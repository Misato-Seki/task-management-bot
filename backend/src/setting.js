const express = require('express')
const { PrismaClient } = require('../generated/prisma')
const ensureAuthenticated = require('./middleware')

const router = express.Router();
const prisma = new PrismaClient()

router.get("/setting", ensureAuthenticated, async (req, res) => {
    try {
        const setting = await prisma.setting.findMany()
        res.json(setting);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch bot message time." });
    }
});

router.post("/setting", ensureAuthenticated, async (req, res) => {
    const { botMessageHour, botMessageMinute, monthlyReportHour, monthlyReportMinute } = req.body;
    try {
        const setting = await prisma.setting.upsert({
            where: { id: 1 },
            update: {
                botMessageHour,
                botMessageMinute,
                monthlyReportHour,
                monthlyReportMinute
            },
            create: {
                botMessageHour,
                botMessageMinute,
                monthlyReportHour,
                monthlyReportMinute
            }
        });
        res.json(setting);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update bot message time." });
    }
});

module.exports = router