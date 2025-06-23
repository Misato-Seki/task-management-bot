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

const taskData: Prisma.TaskCreateInput[] = [
    {
        title: "Plan Summer Trip",
        description: "Book flights and hotels",
        deadline: new Date("2025-06-25"),
        status: "NOT_STARTED",
        user: undefined,
        checklist: {
            create: [
                { 
                    title: "Book flights",
                    description: "Find the best deals",
                    deadline: new Date("2025-06-20"),
                    priority: 1,
                    completed: false,
                    completedAt: null
                },
                {
                    title: "Book hotels",
                    description: "Choose a family-friendly hotel",
                    deadline: new Date("2025-06-22"),
                    priority: 2,
                    completed: false,
                    completedAt: null
                }
            ]

        }
    }
]

export async function main() {
    for (const habit of habitData) {
        await prisma.habit.create({ data:habit })
    }
    for (const task of taskData) {
        await prisma.task.create({ data: task })
    }
} 

main();