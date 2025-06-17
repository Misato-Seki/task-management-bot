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

export async function logHabit (habitId: number, fetchHabits: () => void) {
    try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}habits/${habitId}/log`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: new Date().toISOString() })
        })
        fetchHabits() // ← ログ後に再取得
    } catch (error) {
        alert("Failed to log habit.")
        console.log(error)
    }
}

export async function deleteHabitLog(habitId: number, fetchHabits: () => void) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}habits/${habitId}/log`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: new Date().toISOString() }),
      });
      fetchHabits();
    } catch (error) {
      alert("Failed to delete habit log.");
      console.error(error);
    }
  }
  