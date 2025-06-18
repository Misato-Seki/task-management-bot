import { PrismaClient, Prisma } from "../generated/prisma"

const prisma = new PrismaClient()

const habitData: Prisma.HabitCreateInput[] = [
    {
        title: "Read YLE News",
        goal: 30,
        createdAt: new Date("2025-06-01"),
        archived: false,
        user: undefined,
        logs: {
            create: [
                { date: new Date("2025-06-01")},
                { date: new Date("2025-06-02")},
            ]
        }
    }
]

export async function main() {
    for (const habit of habitData) {
        await prisma.habit.create({ data:habit })
    }
} 

main();