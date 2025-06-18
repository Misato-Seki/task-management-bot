import SectionCard from "./SectionCard";
import Card from "./Card";
import { logHabit, deleteHabitLog, updateHabit, deleteHabit } from "@/app/hooks/habit";
import { Habit } from "@/app/types/global";
import { Button } from "./ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import HabitEditDialog from "./HabitEditDialog";
import { useState } from "react";

type HabitsProps = {
    habitLoading: boolean,
    habitError?: string | null,
    habits: Habit[],
    refetchHabits: () => void
}

export default function Habits ({ habitLoading, habitError, habits, refetchHabits }: HabitsProps) {
    const [ selectedHabit, setSelectedHabit ] = useState<Habit | null>(null);
    const [ dialogOpen, setDialogOpen ] = useState(false);

    const openEditModal = (habit: Habit) => {
        setSelectedHabit(habit);
        setDialogOpen(true);
    }

    return (
        <>
            <SectionCard title="Habits">
                {habitLoading ? (
                    <div className="text-[#5093B4]">Loading...</div>
                ) : habitError ? (
                    <div className="text-red-500">{habitError}</div>
                ) : habits.length === 0 ? (
                    <div className="text-gray-500">No events for today.</div>
                ) : (
                    habits.map(habit => (
                        <Card key={habit.id} onClick={() => openEditModal(habit)} className="cursor-pointer">
                            <input
                                type="checkbox"
                                className="accent-[#5093B4] w-5 h-5 rounded border-2 border-[#49454F]"
                                checked={habit.hasLogToday}
                                onClick={(e) => e.stopPropagation()} // Prevent checkbox click from triggering card click
                                onChange={async (e) => {
                                    if(e.target.checked) {
                                        await logHabit(habit.id, refetchHabits)
                                    } else {
                                        await deleteHabitLog(habit.id, refetchHabits)
                                    }
                                }}
                            />
                            <div className="w-full">
                                <div className="font-medium">{habit.title || 'No Title'}</div>
                                {/* Progress Bar */}
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-sm text-[#5093B4]">{habit.logCount}/{habit.goal}</span>
                                    <div className="w-full h-3 bg-[#F1F7F8] rounded">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div className="h-3 bg-[#5093B4] rounded" style={{ width: `${habit.progress*100}%` }} />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{Math.round(habit.progress*100)}%</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
                <Button variant="taskbotBlue">Add New Habit</Button>
            </SectionCard>
            
            <HabitEditDialog
                habit={selectedHabit}
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSave={(title, goal) => {
                    // Handle save logic here
                    if (!selectedHabit) return;
                    updateHabit(selectedHabit?.id, title, goal, refetchHabits);
                    setDialogOpen(false);
                    refetchHabits();
                }}
                onDelete={() => {
                    // Handle delete logic here
                    if (!selectedHabit) return;
                    deleteHabit(selectedHabit?.id, refetchHabits);
                    setSelectedHabit(null);
                    refetchHabits();
                }}
            />
        </>
    )
}