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
            where: {
                deadline: {
                    gte: today,
                    lte: nextWeek,
                }
            },
            select: {
                id: true,
                title: true,
                description: true,
                deadline: true,
                status: true,
                checklist: {
                    where: {
                        deadline: {
                            gte: today,
                            lte: nextWeek,
                        }
                    },
                }
            }
        })
        res.json({ tasks })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

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

module.exports = router;