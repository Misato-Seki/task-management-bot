export type Event = {
    id: string;
    summary?: string;
    start: { dateTime?: string; date?: string };
    end: { dateTime?: string; date?: string };
  };

export type Habit = {
    id: number,
    title: string,
    goal: number,
    archived: boolean,
    createdAt: string,
    logCount: number,
    progress: number,
    hasLogToday: boolean
}