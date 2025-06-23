import { Task, Checklist } from '../types/global';
export async function fetchTasks(
    setTasks: (tasks: Task[]) => void,
    setTaskError: (error: string | null) => void, 
    setTaskLoading: (loading: boolean) => void
) {
    try {
        setTaskLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}tasks`);
        if (!res.ok) {
            setTaskError('Failed to fetch Tasks');
            setTaskLoading(false);
            return;
        }
        const data = await res.json();
        setTasks(Array.isArray(data.tasks) ? data.tasks : []);
        setTaskError(null)
    } catch {
        setTaskError('Failed to fetch Tasks');
    } finally {
        setTaskLoading(false);
    }
};

export async function createTask(
    task: Task,
    checklist: Checklist[],
    refetch: () => void
) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...task, checklist })
        });

        if (!response.ok) {
            throw new Error('Failed to create task');
        }
        refetch();
        // debugging
        console.log('Created task:', task);
        console.log('Checklist:', checklist);
    } catch (error) {
        alert("Failed to create task.");
        console.error('Error creating task:', error);
        // debugging
        console.log('Created task:', task);
        console.log('Checklist:', checklist);
    }
}

export async function updateTask (
    taskId: number | undefined,
    tasks: Task,
    checklist: Checklist[],
    refetch: () => void
) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}tasks/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ taskId, ...tasks, checklist  })
        });
        if (!response.ok) {
            throw new Error('Failed to update task');
        }
        refetch();
    } catch (error) {
        alert("Failed to update task.");
        console.error('Error updating task:', error);
    }
}

export async function deleteTask (
    taskId: number | undefined,
    refetch: () => void
) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}tasks/${taskId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        refetch();
    } catch (error) {
        alert("Failed to delete task.");
        console.error('Error deleting task:', error);
    }
}