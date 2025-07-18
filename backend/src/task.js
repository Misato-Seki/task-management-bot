const express = require('express')
const { PrismaClient } = require('../generated/prisma')
const { toZonedTime } = require('date-fns-tz');
const { startOfDay, endOfDay, addDays } = require('date-fns');
const ensureAuthenticated = require('./middleware')


const router = express.Router();
const prisma = new PrismaClient()

const timezone = 'Europe/Helsinki';
const nextWeek = toZonedTime(endOfDay(addDays(new Date(), 7)), timezone);

router.get('/tasks', ensureAuthenticated, async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
          orderBy: {
            deadline: 'asc'
          },
          include: {
              checklist: {
                orderBy: {
                  deadline: 'asc'
                }
              }
          },
        })

        const taskWithProgress = tasks.map(task => {
          const completedChecklistItems = task.checklist.filter(item => item.completed);
          const totalChecklistItems = task.checklist.length;
          const progress = totalChecklistItems === 0 ? 0 : (completedChecklistItems.length / totalChecklistItems) * 100;
          return {
            ...task,
            progress,
            checklistCount: totalChecklistItems,
            completedCount: completedChecklistItems.length
          };
        })

        return res.json({ tasks: taskWithProgress });
    } catch (error) {
        res.status(500).json({ error: error.message });   
    }
})

router.get('/tasks/today', ensureAuthenticated, async (req, res) => {
  try {
    // Tasks with the checklist with duedate within 7 days from today
    const tasks = await prisma.task.findMany({
      orderBy: {
        deadline: 'asc'
      },
      where: {
        OR: [
          {
            deadline: {
              lte: nextWeek,
            },
          },
          {
            checklist: {
              some: {
                deadline: {
                  lte: nextWeek,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        description: true,
        deadline: true,
        status: true,
        completed: true,
        checklist: {
          where: {
            deadline: {
              lte: nextWeek,
            },
            completed: false
          },
          orderBy: {
            deadline: 'asc'
          }
        },
      },
    });

    // Tasks with all checklist
    const allTasks = await prisma.task.findMany({
      include: { checklist: true }
    })

    // Generate Progress
    const allTasksMap = new Map(allTasks.map(task => [task.id, task]))
    const tasksWithProgress = tasks.map(task => {
      const allChecklist = allTasksMap.get(task.id)?.checklist || [];
      const completedChecklistItems = allChecklist.filter(item => item.completed);
      const totalChecklistItems = allChecklist.length;
      const progress = totalChecklistItems === 0 ? 0 : (completedChecklistItems.length / totalChecklistItems) * 100
      return {
        ...task,
        progress,
        checklistCount: totalChecklistItems,
        completedCount: completedChecklistItems.length
      }
    })
    res.json({ tasks: tasksWithProgress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/tasks/:id', ensureAuthenticated, async (req, res) => {
    const taskId = Number(req.params.id);
    try {
        const task = await prisma.task.findUnique({
            where: {
                id: taskId
            },
            include: {
                checklist: {
                  orderBy: {
                    deadline: 'asc'
                  }
                }
            },
        })
        const taskWithProgress = {
          ...task,
          progress: task.checklist.length === 0 ? 0 : (task.checklist.filter(item => item.completed).length / task.checklist.length) * 100,
          checklistCount: task.checklist.length,
          completedCount: task.checklist.filter(item => item.completed).length
        }
        res.json(taskWithProgress);        
    } catch (error) {
        res.status(500).json({ error: error.message });        
    }
})


router.post('/tasks', ensureAuthenticated, async (req, res) => {
    const { title, description, deadline, status, checklist, completed } = req.body;

    try {
        const task = await prisma.task.create({
            data: {
                title,
                description,
                deadline: deadline? new Date(deadline) : undefined,
                status,
                completed,
                checklist: {
                    create: checklist.map(item => ({
                        title: item.title,
                        description: item.description,
                        deadline: new Date(item.deadline),
                        completed: item.completed,
                    }))
                }
            },
            include: {
                checklist: true
            }
        })
        res.status(201).json(task);        
    } catch (error) {
        res.status(500).json({ error: error.message });        
    }
})

router.put('/tasks/:id', ensureAuthenticated, async (req, res) => {
    const taskId = Number(req.params.id);
    const { title, description, deadline, status, checklist } = req.body;

    try {
        const updatedTask = await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                title,
                description,
                deadline: deadline ? new Date(deadline) : undefined,
                status,
                checklist: {
                    deleteMany: {},
                    create: checklist.map(item => ({
                        title: item.title,
                        description: item.description,
                        deadline: item.deadline ? new Date(item.deadline) : undefined,
                        priority: item.priority,
                        completed: item.completed,
                    }))
                }
            },
            include: {
                checklist: true
            }
        })
        res.json(updatedTask);        
    } catch (error) {
        res.status(500).json({ error: error.message });        
    }
})

router.delete('/tasks/:id', ensureAuthenticated, async (req, res) => {
    const taskId = Number(req.params.id);

    try {
        await prisma.task.delete({
            where: {
                id: taskId
            },
        })
        res.status(204).send();        
    } catch (error) {
        res.status(500).json({ error: error.message });        
    }
})

// Toggle Task Completion
router.patch('/tasks/:id/completion', ensureAuthenticated, async (req, res) => {
  const taskId = Number(req.params.id);
  const { completed } = req.body;

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Invalid completed value' });
  }

  try {
    // 1. Taskのcompleted更新
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { 
        completed,
        ...(completed ? {status: "COMPLETED"} : {status: "REMINDER"})
      },
      include: { checklist: true }
    });

    // 2. Checklistも全て同じ状態に更新
    await prisma.checklist.updateMany({
      where: { taskId },
      data: { completed },
    });

    // 3. checklistを再取得して正しい状態で返す（更新後の状態が必要なため）
    const updatedChecklist = await prisma.checklist.findMany({
      where: { taskId },
    });

    // 4. updatedTask に正しい checklist を上書き（更新後状態で上書き）
    updatedTask.checklist = updatedChecklist;

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle Checklist Completion
router.patch('/checklists/:id/completion', ensureAuthenticated, async (req, res) => {
  const checklistId = Number(req.params.id);
  const { completed } = req.body;

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Invalid completed value' });
  }

  try {
    // 1. Checklist更新
    const updatedChecklistItem = await prisma.checklist.update({
      where: { id: checklistId },
      data: { completed }
    });

    // 2. 親TaskのID取得
    const checklistItem = await prisma.checklist.findUnique({
      where: { id: checklistId },
      select: { taskId: true }
    });

    // 3. 親TaskのChecklist全件取得
    const allChecklist = await prisma.checklist.findMany({
      where: { taskId: checklistItem.taskId },
      orderBy: { deadline: 'asc' }
    });

    // 4. 全て完了ならTask.completed=true, そうでなければfalse
    const allCompleted = allChecklist.every(item => item.completed);
    await prisma.task.update({
      where: { id: checklistItem.taskId },
      data: { completed: allCompleted }
    });

    // 5. チェックリストの進捗状況を返す
    const progress = allChecklist.length === 0 ? 0 : (allChecklist.filter(item => item.completed).length / allChecklist.length) * 100;
    const checklistCount = allChecklist.length;
    const completedCount = allChecklist.filter(item => item.completed).length;

    res.json({
      updatedChecklistItem,
      updatedChecklist: allChecklist,
      progress, 
      checklistCount, 
      completedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;