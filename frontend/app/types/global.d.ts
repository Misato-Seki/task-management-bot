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
    id?: number,
    title: string,
    description?: string,
    deadline: string,
    createdAt?: string,
    status: string,
    completed: boolean,
    userId?: number | null,
    checklist?: Checklist[]
    progress?: number
    completedCount?: number
    checklistCount?: number
}

export type Checklist = {
    id?: number,
    title: string,
    description?: string,
    deadline?: string,
    completed: boolean,
    createdAt?: string,
    taskId?: number
}