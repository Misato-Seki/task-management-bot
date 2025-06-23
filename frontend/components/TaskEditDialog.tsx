import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Task, Checklist } from "@/app/types/global";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type TaskEditModalProps = {
    task: Task | null;
    open: boolean;
    onClose: () => void;
    onSave: (task: Task | null, checklist: Checklist[]) => void;
    onDelete: () => void;
}
                    
export default function TaskEditModal({ task, open, onClose, onSave, onDelete }: TaskEditModalProps) {
    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");
    const [deadline, setDeadline] = useState(task?.deadline ? new Date(task.deadline) : new Date());
    const [status, setStatus] = useState(task?.status || "NOT_STARTED");
    const [checklist, setChecklist] = useState<Checklist[]>(task?.checklist || []);



    useEffect(() => {
        if (!task) {
            setTitle("");
            setDescription("");
            setDeadline(new Date());
            setStatus("NOT_STARTED");
            setChecklist([]);            
        } else {
            setTitle(task.title);
            setDescription(task.description || "");
            setDeadline(task.deadline ? new Date(task.deadline) : new Date());
            setStatus(task.status || "NOT_STARTED");
            setChecklist(task.checklist || []);
        }
    }, [task, open]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{task ? "Edit Task" : "New Task"}</DialogTitle>
                </DialogHeader>
                <Label>Title</Label>
                <Input placeholder="Task Title"
                value={title} onChange={(e) => setTitle(e.target.value)} />
                <Label className="mt-2">Description</Label>
                <Input placeholder="Task Description"
                value={description} onChange={(e) => setDescription(e.target.value)} />
                <Label className="mt-2">Deadline</Label>
                <Input
                    type="datetime-local"
                    value={deadline.toISOString().slice(0, 16)} // YYYY-MM-DDTHH:mm format
                    onChange={(e) => setDeadline(new Date(e.target.value))}
                />
                <Label className="mt-2">Status</Label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    <option value="NOT_STARTED">Not Started</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="REMINDER">Reminder</option>
                </select>
                <Label className="mt-2">Checklist</Label>
                <div className="flex flex-col gap-2">
                    {checklist.map((item, index) => (   
                        <div key={item.id || index} className="flex flex-col items-left gap-2 w-full">
                            <div className="flex items-center gap-2 w-full">
                                <input
                                    type="checkbox"
                                    checked={item.completed}
                                    onChange={() => {
                                        const newChecklist = [...checklist];
                                        newChecklist[index].completed = !newChecklist[index].completed;
                                        setChecklist(newChecklist);
                                    }}
                                    className="accent-[#5093B4] w-5 h-5 rounded border-2 border-[#49454F]"
                                />                            
                                <Input
                                    value={item.title}
                                    onChange={(e) => {
                                        const newChecklist = [...checklist];
                                        newChecklist[index].title = e.target.value;
                                        setChecklist(newChecklist);
                                    }}
                                    placeholder="Checklist Item"
                                />
                                <Button 
                                    variant="taskbotPink" 
                                    onClick={() => 
                                        setChecklist(checklist.filter((_, i) => i !== index))
                                    }
                                >
                                ✕
                                </Button>
                            </div>
                            
                                <Label className="mt-2">Deadline</Label>
                                <Input
                                    type="datetime-local"
                                    value={item.deadline ? new Date(item.deadline).toISOString().slice(0, 16) : ""}// YYYY-MM-DDTHH:mm format
                                    onChange={(e) => {
                                        const newChecklist = [...checklist];
                                        newChecklist[index].deadline = e.target.value ? new Date(e.target.value).toISOString() : undefined;
                                        setChecklist(newChecklist);
                                    }}
                                />

                                <Label className="mt-2">Priority</Label>
                                <select
                                    value={item.priority}
                                    onChange={(e) => {
                                        const newChecklist = [...checklist];
                                        newChecklist[index].priority = parseInt(e.target.value, 10);
                                        setChecklist(newChecklist);
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="1">Low</option>
                                    <option value="2">Medium</option>
                                    <option value="3">High</option>
                                </select>
                            </div>
                    ))}
                </div>
                <Button
                    className="mt-2"
                    variant="outline"
                    onClick={() =>
                        setChecklist([
                            ...checklist,
                            {
                                id: 0,
                                title: "",
                                description: "",
                                deadline: undefined,
                                priority: 1,
                                completed: false,
                                completedAt: null,
                                taskId: task?.id || 0,
                            },
                        ])
                    }
                >
                    + Add Checklist Item
                </Button>
                <div className="flex justify-between mt-4">
                    <Button 
                        variant="taskbotBlue"  
                        onClick={() => 
                            onSave(
                                {
                                    id: task?.id || 0,
                                    title,
                                    description,
                                    deadline: deadline.toISOString(),
                                    status,
                                    userId: task?.userId || null,
                                    checklist
                                },
                                checklist
                            )}
                    >Save</Button>
                    {task && <Button variant="taskbotPink" onClick={onDelete}>Delete</Button>}
                </div>
            </DialogContent>
        </Dialog>
    )
}

