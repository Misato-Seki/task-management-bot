import { PrismaClient, Prisma } from "../generated/prisma"

const prisma = new PrismaClient()

const taskData: Prisma.TaskCreateInput[] = [
    {
        title: "Plan Summer Trip",
        description: "Book flights and hotels",
        deadline: new Date("2025-07-1"),
        status: "NOT_STARTED",
        user: undefined,
        completed: false,
        checklist: {
            create: [
                { 
                    title: "Book flights",
                    description: "Find the best deals",
                    deadline: new Date("2025-06-30"),
                    completed: false,
                },
                {
                    title: "Book hotels",
                    description: "Choose a family-friendly hotel",
                    deadline: new Date("2025-06-29"),
                    completed: false,
                }
            ]

        }
    },
    {
        title: "Buy Groceries",
        description: "Groceries for the week",
        deadline: new Date("2025-06-30"),
        status: "NOT_STARTED",
        user: undefined,
        completed: false
    }
]

export async function main() {
    for (const task of taskData) {
        await prisma.task.create({ data: task })
    }
} 

main();