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

    useEffect(() => {
        if (habit) {
            setTitle(habit.title);
            setGoal(habit.goal);
        }
    }, [habit]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Habit</DialogTitle>
                </DialogHeader>
                <Label>Title</Label>
                <Input placeholder="Habit Title"
                value={title} onChange={(e) => setTitle(e.target.value)} />
                <Label>Goal (/month)</Label>
                <Input placeholder="Goal (times per day)"
                type="number" min="1"
                value={goal} onChange={(e) => setGoal(Number(e.target.value))} />
                <div className="flex justify-between mt-4">
                    <Button variant="taskbotBlue"  onClick={() => onSave(title, goal)}>Save</Button>
                    <Button variant="taskbotPink" onClick={onDelete}>Delete</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

