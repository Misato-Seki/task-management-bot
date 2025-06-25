const express = require('express')
const { PrismaClient } = require('../generated/prisma')
const { toZonedTime } = require('date-fns-tz');
const { startOfDay, endOfDay, addDays } = require('date-fns');


const router = express.Router();
const prisma = new PrismaClient()

const timezone = 'Europe/Helsinki';
const today = toZonedTime(startOfDay(new Date()), timezone);
const nextWeek = toZonedTime(endOfDay(addDays(new Date(), 7)), timezone);

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            include: {
                checklist: true
            },
        })
        return res.json({ tasks });
    } catch (error) {
        res.status(500).json({ error: error.message });   
    }
})

router.get('/tasks/today', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          {
            deadline: {
              gte: today,
              lte: nextWeek,
            },
          },
          {
            checklist: {
              some: {
                deadline: {
                  gte: today,
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
              gte: today,
              lte: nextWeek,
            },
          },
        },
      },
    });

    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post('/tasks', async (req, res) => {
    const { title, description, deadline, status, checklist } = req.body;

    try {
        const task = await prisma.task.create({
            data: {
                title,
                description,
                deadline: deadline? new Date(deadline) : undefined,
                status,
                checklist: {
                    create: checklist.map(item => ({
                        title: item.title,
                        description: item.description,
                        deadline: new Date(item.deadline),
                        priority: item.priority,
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

router.put('/tasks/:id', async (req, res) => {
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

router.delete('/tasks/:id', async (req, res) => {
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
router.patch('/tasks/:id/completion', async (req, res) => {
  const taskId = Number(req.params.id);
  const { completed } = req.body;

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Invalid completed value' });
  }

  try {
    // 1. Taskのcompleted更新
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { completed }
    });

    // 2. Checklistも全て同じ状態に更新
    await prisma.checklist.updateMany({
      where: { taskId },
      data: { completed }
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle Checklist Completion
router.patch('/checklists/:id/completion', async (req, res) => {
  const checklistId = Number(req.params.id);
  const { completed } = req.body;

  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Invalid completed value' });
  }

  try {
    // 1. Checklist更新
    const updatedChecklist = await prisma.checklist.update({
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
      where: { taskId: checklistItem.taskId }
    });

    // 4. 全て完了ならTask.completed=true, そうでなければfalse
    const allCompleted = allChecklist.every(item => item.completed);
    await prisma.task.update({
      where: { id: checklistItem.taskId },
      data: { completed: allCompleted }
    });
    res.json(updatedChecklist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;