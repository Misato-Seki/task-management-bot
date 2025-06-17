const express = require('express')
const { PrismaClient } = require('../generated/prisma')

const router = express.Router();
const prisma = new PrismaClient()


// 習慣の一覧取得
router.get('/habits', async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
  
    try {
      const allHabits = await prisma.habit.findMany({
        include: {
          logs: true,
        },
      });
  
      const habitsWithProgress = allHabits.map((habit) => {
        const logCount = habit.logs.length;
        const progress = habit.goal > 0 ? logCount / habit.goal : 0;
  
        // 今日の日付に該当するログがあるか
        const hasLogToday = habit.logs.some((log) => {
          const logDate = new Date(log.date);
          return logDate >= today && logDate < tomorrow;
        });
  
        return {
          id: habit.id,
          title: habit.title,
          goal: habit.goal,
          archived: habit.archived,
          createdAt: habit.createdAt,
          logCount,
          progress,
          hasLogToday, // ← ここを追加！
        };
      });
  
      res.json(habitsWithProgress);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch habits." });
    }
  });  

// 習慣を作成
router.post('/habits', async(req, res) => {
    const { title, goal, } = req.body
    try {
        const habit = await prisma.habit.create({
            data: {
                title,
                goal,
                createdAt: new Date(),
                archived: false,
                userId: null
            }
        })
        res.status(201).json(habit)
    } catch (error) {
        res.status(500).json({error: "Failed to create habit."})   
    }  
})

// 習慣を更新
router.put('/habits/:id', async(req, res) => {
    const habitId = Number(req.params.id)
    const { title, goal, archived } = req.body
    try {
        const updatedHabit = await prisma.habit.update({
            where: { id: habitId },
            data: { title, goal, archived}
        })
        res.json(updatedHabit)
    } catch (error) {
        res.status(500).json({error: "Failed to update habit."})       
    }
})

// 習慣を削除
router.delete('/habits/:id', async(req, res) => {
    const habitId = req.params.id
    try {
        await prisma.habit.delete({
            where: { id: habitId}
        })
        res.status(204).send()
    } catch (error) {
        res.status(500).json({error: "Failed to delete habit."})
    }
})

// 習慣の記録を登録（実行済み）
router.post('/habits/:id/log', async (req, res) => {
    const habitId = parseInt(req.params.id, 10);
    const { date } = req.body;

    if (isNaN(habitId)) {
        return res.status(400).json({ error: 'Invalid habit ID' });
    }

    if (!date || isNaN(Date.parse(date))) {
        return res.status(400).json({ error: 'Invalid or missing date.' });
    }

    try {
        const habit = await prisma.habit.findUnique({ where: { id: habitId } });
        if (!habit) {
            return res.status(404).json({ error: 'Habit not found.' });
        }

        const log = await prisma.habitLog.create({
            data: {
                habitId,
                date: new Date(date)
            }
        });

        res.status(201).json(log);
    } catch (error) {
        console.error('Habit log error:', error); // ← ログも出そう
        res.status(500).json({ error: "Failed to create habit log." });
    }
});

// 習慣の記録を削除
router.delete('/habits/:id/log', async (req, res) => {
    const habitId = parseInt(req.params.id, 10);
    const { date } = req.body;
  
    if (isNaN(habitId) || !date) {
      return res.status(400).json({ error: 'Invalid habit ID or date' });
    }
  
    const targetDate = new Date(date);
    const start = new Date(targetDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(targetDate);
    end.setHours(23, 59, 59, 999);
  
    try {
      await prisma.habitLog.deleteMany({
        where: {
          habitId,
          date: {
            gte: start,
            lte: end
          }
        }
      });
      res.status(200).json({ message: 'Deleted habit log for today' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to delete habit log." });
    }
  });
  


module.exports = router;

