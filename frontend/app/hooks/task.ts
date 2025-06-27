import { Task, Checklist } from '../types/global';

export async function fetchTasks (
    setTasks: (tasks: Task[]) => void,
    setTaskError: (error: string | null) => void, 
    setTaskLoading: (loading: boolean) => void
) {
    try {
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
}

export async function fetchTodaysTasks(
    setTasks: (tasks: Task[]) => void,
    setTaskError: (error: string | null) => void, 
    setTaskLoading: (loading: boolean) => void
) {
    try {
        setTaskLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}tasks/today`);
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

export async function fetchTaskById(taskId: number | undefined) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}tasks/${taskId}`);
        if (!res.ok) {
            throw new Error('Failed to fetch Task');
        }
        const data = await res.json();
        return data
    } catch {
        throw new Error('Failed to fetch Task');
    }
}

export async function createTask(
    task: Task,
    checklist: Checklist[],
    refetch: () => void
) {
    // Clean up checklist data
    const cleanedChecklist = checklist.map(item => ({
        title: item.title,
        description: item.description,
        deadline: item.deadline,
        completed: item.completed
    }))
    // Clean up task data
    const cleanedTask = {
        title: task.title,
        description: task.description,
        deadline: task.deadline,
        status: task.status,
        completed: task.completed,
        checklist: cleanedChecklist
    }
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...cleanedTask })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Server error:', errorData);
            throw new Error(errorData.error || 'Failed to create task');
        }
        refetch();
    } catch (error) {
        alert("Failed to create task.");
        console.error('Error creating task:', error);
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

export async function updateTaskCompletion (
  taskId: number | undefined,
  completed: boolean,
  refetch: () => void
) {
  if (!taskId) return;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}tasks/${taskId}/completion`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });
    if (!response.ok) throw new Error('Failed to update task completion');
    const updateTask = await response.json();
    refetch();
    return updateTask
  } catch (error) {
    alert('Failed to update task completion.');
    console.error(error);
  }
}

export async function updateChecklistCompletion (
  checklistId: number | undefined,
  completed: boolean,
  refetch: () => void
) {
  if (!checklistId) return;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}checklists/${checklistId}/completion`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed })
    });
    if (!response.ok) throw new Error('Failed to update checklist completion');
    refetch();
    return response.json()
  } catch (error) {
    alert('Failed to update checklist completion.');
    console.error(error);
  }
}
