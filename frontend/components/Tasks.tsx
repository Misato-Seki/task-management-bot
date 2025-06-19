// import { useEffect, useState } from "react"
import SectionCard from "./SectionCard"
import Card from "./Card"
import { Task } from "@/app/types/global";
import { Button } from "./ui/button";

type TasksProps = {
    taskLoading: boolean,
    taskError?: string | null,
    tasks: Task[],
    refetchTasks: () => void
}


export default function Tasks ({ taskLoading, taskError, tasks }: TasksProps) {
    
    return (
        <>
            <SectionCard title="Tasks">
                {taskLoading ? (
                    <div className="text-[#5093B4]">Loading...</div>
                ) : taskError ? (
                    <div className="text-red-500">{taskError}</div>
                ) : tasks.length === 0 ? (
                    <div className="text-gray-500">No planned tasks for today.</div>
                ) : (
                    tasks.map(task => (
                        <Card key={task.id} className="cursor-pointer ">
                            <div>
                                {!task.checklist &&
                                <input
                                    type="checkbox"
                                    className="accent-[#5093B4] w-5 h-5 rounded border-2 border-[#49454F]"
                                />
                                }
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">{task.title}</span>
                                    <span className="text-[#5093B4] cursor-pointer">▼</span>
                                </div>
                                <div className="text-gray-500 text-sm mb-2">{task.description}</div>
                                <div className="flex flex-col gap-1 pl-4">
                                    {task.checklist?.map(item => (
                                        <div key={item.id} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={item.completed}
                                                readOnly
                                                className={`accent-[#5093B4] w-4 h-4 rounded border-2 border-[#49454F]`}
                                            />
                                            <span>{item.title}</span>
                                            <span className="ml-auto text-xs text-gray-400">
                                                {item.deadline && new Date(item.deadline).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    ))
                )}
                <Button variant="taskbotBlue" onClick={() => console.log("button clicked")}>Add New Task</Button>
            </SectionCard>
        </>
    )
}