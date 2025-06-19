const express = require('express')
const { PrismaClient } = require('../generated/prisma')

const router = express.Router();
const prisma = new PrismaClient()

router.get('/tasks', async (req, res) => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    try {
        const tasks = await prisma.task.findMany({
            where: {
                deadline: {
                    gte: today,
                    lte: nextWeek,
                }
            },
            include: {
                checklist: true,
            }
        })
        
        const checklists = await prisma.checklist.findMany({
            where: {
                deadline: {
                    gte: today,
                    lte: nextWeek
                }
            }, 
        })
        res.json({ tasks, checklists})
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

module.exports = router;