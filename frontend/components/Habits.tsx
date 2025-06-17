import SectionCard from "./SectionCard";
import Card from "./Card";
import { Habit } from "@/app/types/global";
import { Button } from "./ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
  } from "@/components/ui/tooltip"

type HabitsProps = {
    habitLoading: boolean,
    habitError?: string | null,
    habits: Habit[]
}

export default function Habits ({ habitLoading, habitError, habits }: HabitsProps) {
    return (
        <SectionCard title="Habits">
            {habitLoading ? (
                <div className="text-[#5093B4]">Loading...</div>
            ) : habitError ? (
                <div className="text-red-500">{habitError}</div>
            ) : habits.length === 0 ? (
                <div className="text-gray-500">No events for today.</div>
            ) : (
                habits.map(habit => (
                    <Card key={habit.id}>
                        <input type="checkbox" className="accent-[#5093B4] w-5 h-5 rounded border-2 border-[#49454F]" />
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
    )
}