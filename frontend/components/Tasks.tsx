// import { useEffect, useState } from "react"
import SectionCard from "./SectionCard"
import Card from "./Card"
import { Task } from "@/app/types/global";
import { Button } from "./ui/button";
import TaskEditDialog from "./TaskEditDialog";
import { useState } from "react";
import { updateTask, deleteTask, updateTaskCompletion, updateChecklistCompletion } from "@/app/hooks/task";
import { useRouter } from "next/navigation";

type TasksProps = {
    taskLoading: boolean,
    taskError?: string | null,
    tasks: Task[],
    refetchTasks: () => void
}

export default function Tasks ({ taskLoading, taskError, tasks, refetchTasks }: TasksProps) {
    const [ selectedTask, setSelectedTask ] = useState<Task | null>(null);
    const [ dialogOpen, setDialogOpen ] = useState(false);
    
    const router = useRouter()

    const openEditModal = (task: Task) => {
            setSelectedTask(task);
            setDialogOpen(true);
        }
    
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
                        <Card key={task.id} onClick={() => openEditModal(task)} className="cursor-pointer">
                            <div>
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={async () => {
                                        await updateTaskCompletion(task.id, !task.completed, () => {
                                            console.log("refetch")
                                            refetchTasks()
                                        });
                                    }}
                                    className="accent-[#5093B4] w-5 h-5 rounded border-2 border-[#49454F]"
                                />
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">{task.title}</span>
                                </div>
                                <div className="text-gray-500 text-sm mb-2">{task.description}</div>
                                <div className="flex flex-col gap-1 pl-4">
                                    {task.checklist?.map(item => (
                                        <div key={item.id} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={item.completed}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={async () => {
                                                    await updateChecklistCompletion(item.id, !item.completed, refetchTasks);
                                                }}
                                                className="accent-[#5093B4] w-4 h-4 rounded border-2 border-[#49454F]"
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
                <Button variant="taskbotBlue" onClick={() => router.push('/task')}>Show All Task</Button>
            </SectionCard>

            {/* Edit/Delete Task Dialog */}
            <TaskEditDialog
                task={selectedTask}
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSave={async (task, checklist) => {
                    if (!task) return;
                    await updateTask(selectedTask?.id, task, checklist, refetchTasks);
                    setDialogOpen(false);
                }}
                onDelete={async () => {
                    if (!selectedTask) return;
                    await deleteTask(selectedTask.id, refetchTasks);
                    setDialogOpen(false);
                }}
            />
        </>
    )
}