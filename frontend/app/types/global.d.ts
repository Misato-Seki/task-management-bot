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

export type Task = {
    id: number,
    title: string,
    description?: string,
    deadline: string,
    createdAt?: string,
    status: string,
    userId?: number | null,
    checklist?: Checklist[]
}

export type Checklist = {
    id: number,
    title: string,
    description?: string,
    deadline?: string,
    priority: number,
    completed: boolean,
    completedAt?: string | null,
    createdAt?: string,
    taskId: number
}