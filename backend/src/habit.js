const express = require('express')
const { PrismaClient } = require('../generated/prisma')

const router = express.Router();
const prisma = new PrismaClient()


// 習慣の一覧取得
router.get('/habits', async(req, res) => {
    try {
        const allHabits = await prisma.habit.findMany({
            include: {
                logs: true
            }
        })
        const habitsWithProgress = allHabits.map(habit => ({
            id: habit.id,
            title: habit.title,
            goal: habit.goal,
            archived: habit.archived,
            createdAt: habit.createdAt,
            logCount: habit.logs.length,
            progress: habit.logs.length / habit.goal
        }))
        res.json(habitsWithProgress)        
    } catch (error) {
        res.status(500).json({error: "Failed to fetch habits."})
    }
})

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
    const habitId = req.params.id
    const { date } = req.body

    try {
        const log = await prisma.habit.create({
            data: {
                habitId,
                date: new Date(date)
            }
        })
        res.status(201).json(log)
    } catch (error) {
        res.status(500).json({error: "Failed to create habit log."})
    }
})

module.exports = router;

