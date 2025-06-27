import SectionCard from "../../components/SectionCard"
import Card from "../../components/Card"
import { Task } from "@/app/types/global";
import { Button } from "../../components/ui/button";
import TaskEditDialog from "../../components/TaskEditDialog";
import { useState } from "react";
import { updateTask, deleteTask, updateTaskCompletion, updateChecklistCompletion, fetchTaskById, createTask } from "@/app/hooks/task";
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

type TasksProps = {
    taskLoading: boolean,
    taskError?: string | null,
    tasks: Task[],
    refetchTasks: () => void
}

export default function Tasks ({ taskLoading, taskError, tasks, refetchTasks }: TasksProps) {
    const [ selectedTask, setSelectedTask ] = useState<Task | null>(null);
    const [ dialogOpen, setDialogOpen ] = useState(false);
    const [ addDialogOpen, setAddDialogOpen ] = useState(false)
    const openEditModal = async (task: Task) => {
        const detailedTask = await fetchTaskById(task.id)
        setSelectedTask(detailedTask);
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
                            {!task.checklist || task.checklist.length === 0 && (
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onClick={(e) => e.stopPropagation()}
                                        onChange={async () => {
                                            await updateTaskCompletion(task.id, !task.completed, refetchTasks);
                                        }}
                                        className="accent-[#5093B4] w-5 h-5 rounded border-2 border-[#49454F]"
                                    />
                                </div>

                            )}
                            <div className="w-full">
                                <div className="flex flex-row gap-3 items-center justify-between">
                                    <span className="font-semibold">{task.title}</span>
                                    <Badge variant="secondary">
                                        <Clock/>{task.deadline ? format(new Date(task.deadline), "MM/dd") : "-"}
                                    </Badge>
                                </div>
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
                                                {item.deadline ? format(new Date(item.deadline), "MM/dd") : "-"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                {/* Progress Bar */}
                                {task.checklist && task.checklist.length > 0 && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="text-sm text-[#5093B4]">{task.completedCount}/{task.checklistCount}</span>
                                        <div className="w-full h-3 bg-[#F1F7F8] rounded">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="h-3 bg-[#5093B4] rounded" style={{ width: `${task.progress}%` }} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{task.progress && Math.round(task.progress)}%</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))
                )}
                <Button variant="taskbotBlue" onClick={() => setAddDialogOpen(true)}>Add New Task</Button>
            </SectionCard>

            {/* Add New Task */}
            <TaskEditDialog
                task = {null}
                open = {addDialogOpen}
                onClose = {() => setAddDialogOpen(false)}
                onSave={async (task, checklist) => {
                    if (!task) return;
                    await createTask(task, checklist, refetchTasks);
                    setAddDialogOpen(false);
                }}
                onDelete = {() => {}}
            />

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