import { Habit } from "../types/global";

export async function fetchHabits (
    setHabits: (habits: Habit[]) => void,
    setHabitError: (error: string | null) => void, 
    setHabitLoading: (loading: boolean) => void
) {
    try {
        setHabitLoading(true)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}habits`);
        if (!res.ok) {
            setHabitError('Failed to fetch habits');
            setHabitLoading(false);
            return;
        }
        const habits = await res.json();
        setHabits(habits);
        setHabitError(null)
    } catch {
        setHabitError('Failed to fetch habits');
    } finally {
        setHabitLoading(false);
    }
};

export async function updateHabit (habitId: number | undefined, title: string, goal: number, refetch: () => void) {
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}habits/${habitId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, goal })
        })
        refetch()        
    } catch (error) {
        alert("Failed to update habit.");
        console.error(error);
    }
}

export async function deleteHabit (habitId: number | undefined, refetch: () => void) {
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}habits/${habitId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        })
        refetch()    
    } catch (error) {
        alert("Failed to delete habit.");
        console.error(error);
    }
}

export async function logHabit (habitId: number, refetch: () => void) {
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}habits/${habitId}/log`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: new Date().toISOString() })
        })
        refetch()
    } catch (error) {
        alert("Failed to log habit.")
        console.log(error)
    }
}

export async function deleteHabitLog(habitId: number, refetch: () => void) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}habits/${habitId}/log`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: new Date().toISOString() }),
      });
      refetch();
    } catch (error) {
      alert("Failed to delete habit log.");
      console.error(error);
    }
  }
  