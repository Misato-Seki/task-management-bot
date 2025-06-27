import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Task, Checklist } from "@/app/types/global";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ChevronDownIcon, Clock, AlignLeft, CircleCheckBig, ListTodo, Trash2 } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns"
import { updateChecklistCompletion, updateTaskCompletion } from "@/app/hooks/task";


type TaskEditDialogProps = {
    task: Task | null;
    open: boolean;
    onClose: () => void;
    onSave: (task: Task | null, checklist: Checklist[]) => void;
    onDelete: () => void;
}
                    
export default function TaskEditDialog({ task, open, onClose, onSave, onDelete }: TaskEditDialogProps) {
    const [title, setTitle] = useState(task?.title || "");
    const [description, setDescription] = useState(task?.description || "");
    const [deadline, setDeadline] = useState(task?.deadline ? new Date(task.deadline) : new Date());
    const [status, setStatus] = useState(task?.status || "NOT_STARTED");
    const [completed, setCompleted] = useState(task?.completed || false)
    const [progress, setProgress] = useState<number | undefined>(0)
    const [checklistCount, setChecklistCount] = useState<number | undefined>(0)
    const [completedCount, setCompletedCount] = useState<number | undefined>(0)
    const [checklist, setChecklist] = useState<Checklist[]>(task?.checklist || []);
    const [datePickerOpen, setDatePickerOpen] = useState(false)
    const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null)


    useEffect(() => {
        if (!task) {
            setTitle("");
            setDescription("");
            setDeadline(new Date());
            setStatus("NOT_STARTED");
            setCompleted(false)
            setChecklist([]); 
            setChecklistCount(0)
            setCompletedCount(0)
            setProgress(0)         
        } else {
            setTitle(task.title);
            setDescription(task.description || "");
            setDeadline(task.deadline ? new Date(task.deadline) : new Date());
            setStatus(task.status || "NOT_STARTED");
            setCompleted(task.completed || false)
            setChecklist(task.checklist || []);
            setChecklistCount(task.checklistCount)
            setCompletedCount(task.completedCount)
            setProgress(task.progress) 
        }
        // setEditingIndex(null)
    }, [task, open]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="h-4/5 overflow-y-auto">
                {/* Title */}
                <DialogHeader>
                    <DialogTitle className="flex flex-row items-center gap-3">
                        <Tooltip>
                            <TooltipTrigger>
                                <Input
                                    type="checkbox"
                                    checked={completed}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={async () => {
                                        if (task) {
                                            const newCompleted = !completed;
                                            try {
                                                const updatedTask = await updateTaskCompletion(task.id, newCompleted, () => {});
                                                setCompleted(newCompleted);
                                                setStatus(updatedTask.status)
                                                setChecklist(updatedTask.checklist)
                                            } catch (error) {
                                                console.error("Failed to update task completion", error)
                                            }                                            
                                        }
                                    }}
                                    className="accent-[#5093B4] w-5 h-5 rounded border-2 border-[#49454F]"
                                />
                            </TooltipTrigger>
                            <TooltipContent>Mark Complete</TooltipContent>
                        </Tooltip>
                        <Input placeholder="Task Title"
                        value={title} onChange={(e) => setTitle(e.target.value)} />
                    </DialogTitle>
                </DialogHeader>
                {/* Deadline */}
                <div className="flex flex-col gap-3">
                    <Label htmlFor="date-picker" className="px-1">
                    <Clock size={20}/>Deadline
                    </Label>
                    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                        <Button
                        variant="outline"
                        id="date-picker"
                        className="w-32 justify-between font-normal"
                        >
                        {deadline ? deadline.toLocaleDateString() : "Select date"}
                        <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                        mode="single"
                        selected={deadline}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                            if (date) {
                                setDeadline(date)
                                setDatePickerOpen(false)
                            }
                        }}
                        />
                    </PopoverContent>
                    </Popover>
                </div>
                {/* Description */}
                <div className="flex flex-col gap-3">
                    <Label htmlFor="description" className="mt-2 px-1"><AlignLeft size={20}/>Description</Label>
                    <Input placeholder="Task Description"
                    value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                {/* Status */}
                <div className="flex flex-col gap-3">
                    <Label htmlFor="status" className="mt-2"><CircleCheckBig size={20}/>Status</Label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                    >
                        <option value="NOT_STARTED">Not Started</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="REMINDER">Reminder</option>
                    </select>
                </div>
                {/* Checklist */}
                <div className="flex flex-col gap-3">
                    <Label htmlFor="checklist" className="mt-2"><ListTodo size={20}/>Checklist</Label>
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-[#5093B4]">{completedCount}/{checklistCount}</span>
                        <div className="w-full h-3 bg-[#F1F7F8] rounded">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="h-3 bg-[#5093B4] rounded" style={{ width: `${progress}%` }} />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{progress && Math.round(progress)}%</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {checklist.map((item, index) => (   
                            <div 
                                key={item.id || index} 
                                className="flex flex-col items-left gap-2 w-full"
                            >
                                <div className="flex items-center gap-2 w-full">
                                    <input
                                        type="checkbox"
                                        checked={item.completed}
                                        onChange={async() => {
                                            try {
                                                const res = await updateChecklistCompletion(checklist[index].id, !checklist[index].completed, () => {})
                                                setChecklist(res.updatedChecklist)
                                                setProgress(res.progress)
                                                setChecklistCount(res.checklistCount)
                                                setCompletedCount(res.completedCount)
                                                
                                            } catch (error) {
                                                console.error(error)
                                            }
                                        }}
                                        className="accent-[#5093B4] w-5 h-5 rounded border-2 border-[#49454F]"
                                        onClick={e => e.stopPropagation()}
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
                                    <Popover 
                                        open={openPopoverIndex === index} 
                                        onOpenChange={(open) => setOpenPopoverIndex(open ? index : null)}
                                    >
                                        <PopoverTrigger asChild>
                                            <Badge variant="outline">
                                                <Clock/>{item.deadline ? format(new Date(item.deadline), "MM/dd") : "-"}
                                            </Badge>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                            <Calendar
                                            mode="single"
                                            selected={item.deadline ? new Date(item.deadline) : undefined}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                
                                                    const newChecklist = [...checklist];
                                                    newChecklist[index].deadline = date ? new Date(date).toISOString() : undefined;
                                                    setChecklist(newChecklist);                                                    
                                                    setOpenPopoverIndex(null)
                                                
                                            }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <div 
                                        onClick={e => {                                    
                                            e.stopPropagation()
                                            setChecklist(checklist.filter((_, i) => i !== index))
                                        }}
                                    >
                                        <Trash2 color="#F66164"/>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Add New Checklist */}
                <Button
                    className="mt-2"
                    variant="outline"
                    onClick={() =>
                        setChecklist([
                            ...checklist,
                            {
                                title: "",
                                description: "",
                                deadline: undefined,
                                completed: false,
                                taskId: task?.id
                            },
                        ])
                    }
                >
                    + Add Checklist Item
                </Button>
                {/* Save/Delete Button */}
                <div className="flex justify-between mt-4">
                    <Button 
                        variant="taskbotBlue"  
                        onClick={() => 
                            onSave(
                                {
                                    id: task?.id,
                                    title,
                                    description,
                                    deadline: deadline.toISOString(),
                                    status,
                                    completed,
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

