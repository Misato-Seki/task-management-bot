import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Habit } from "@/app/types/global";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type HabitEditModalProps = {
    habit: Habit | null;
    open: boolean;
    onClose: () => void;
    onSave: (title: string, goal: number) => void;
    onDelete: () => void;
}
export default function HabitEditModal({ habit, open, onClose, onSave, onDelete }: HabitEditModalProps) {
    const [title, setTitle] = useState(habit?.title || "");
    const [goal, setGoal] = useState(habit?.goal || 1);
    const [goalInput, setGoalInput] = useState(habit?.goal?.toString() || "1");

    useEffect(() => {
        if (!habit) {
            setTitle("");
            setGoal(1);
            setGoalInput("1")
        } else {
            setTitle(habit.title);
            setGoal(habit.goal);
            setGoalInput(habit.goal.toString())
        }
    }, [habit, open]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Habit</DialogTitle>
                </DialogHeader>
                <Label>Title</Label>
                <Input placeholder="Habit Title"
                value={title} onChange={(e) => setTitle(e.target.value)} />
                <Label>Goal (times/month)</Label>
                <Input
                    type="number"
                    min="1"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    onBlur={() => {
                        const parsed = Math.max(Number(goalInput), 1); // 1以上を保証
                        setGoal(parsed);
                        setGoalInput(parsed.toString());
                    }}
                />
                <div className="flex justify-between mt-4">
                    <Button variant="taskbotBlue"  onClick={() => onSave(title, goal)}>Save</Button>
                    {habit && <Button variant="taskbotPink" onClick={onDelete}>Delete</Button>}
                </div>
            </DialogContent>
        </Dialog>
    )
}

