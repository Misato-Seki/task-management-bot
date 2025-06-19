import { Task } from '../types/global';
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