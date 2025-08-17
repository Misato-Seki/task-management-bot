import { PrismaClient, Prisma } from "../generated/prisma"

const prisma = new PrismaClient()



export async function main() {
    await prisma.setting.upsert({
        where: { id: 1 },
        update: {
            botMessageHour: 0,
            botMessageMinute: 0,
            monthlyReportHour: 0,
            monthlyReportMinute: 0,
        },
        create: {
            botMessageHour: 0,
            botMessageMinute: 0,
            monthlyReportHour: 0,
            monthlyReportMinute: 0,
        },
    });
} 

main();