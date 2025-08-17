'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Events from '@/app/dashboard/Events';
import Habits from '@/app/dashboard/Habits';
import Tasks from '@/app/dashboard/Tasks';
import { Event, Habit, Task } from '@/app/types/global';
import { fetchHabits } from '../hooks/habit';
import { fetchTasks } from '../hooks/task';



export default function Dashboard() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [eventError, setEventError] = useState<string | null>(null);
    const [eventLoading, setEventLoading] = useState(true);
    const [habits, setHabits] = useState<Habit[]>([])
    const [habitError, setHabitError] = useState<string | null>(null);
    const [habitLoading, setHabitLoading] = useState(true);
    const [tasks, setTasks] = useState<Task[]>([])
    const [taskError, setTaskError] = useState<string | null>(null);
    const [taskLoading, setTaskLoading] = useState(true);


    // Fetch Events
    useEffect(() => {
        // Check if the user is authenticated and get accessToken
        fetch(`${process.env.NEXT_PUBLIC_API_URL}auth/check`, {
            credentials: 'include',
        })
            .then(res => res.json())
            .then(async data => {
                if (!data.authenticated) {
                    router.push('/unauthorized');
                    return;
                }
                if (!data.accessToken) {
                    setEventError('Googleアクセストークンが取得できませんでした');
                    setEventLoading(false);
                    return;
                }
                // カレンダー予定取得
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}calendar/today`, {
                    headers: { Authorization: `Bearer ${data.accessToken}` },
                    credentials: 'include',
                });
                if (!res.ok) {
                    setEventError('予定の取得に失敗しました');
                    setEventLoading(false);
                    return;
                }
                const events = await res.json();
                setEvents(events);
                setEventLoading(false);
            })
            .catch(() => {
                setEventError('認証情報の取得に失敗しました');
                setEventLoading(false);
            });
    }, [router]);
    

    // Fetch Habits
    useEffect(() => {
        fetchHabits(setHabits, setHabitError, setHabitLoading);
    }, []);

    // Fetch Tasks
    useEffect(() => {
        fetchTasks(setTasks, setTaskError, setTaskLoading);
    }, []);

    return (
        <div className="min-h-screen w-full bg-[#F1F7F8] flex flex-col">
            <NavBar />

            {/* Main Content */}
            <main className="grid grid-cols-1 md:grid-cols-3 justify-center items-start gap-12 px-8 py-10">

                {/* Events */}
                <Events 
                    eventLoading = {eventLoading}
                    eventError = {eventError}
                    events = {events}
                />

                {/* Habit */}
                <Habits 
                    habitLoading = {habitLoading}
                    habitError = {habitError}
                    habits = {habits}
                    refetchHabits={() => fetchHabits(setHabits, setHabitError, setHabitLoading)}
                />

                {/* Task */}
                <Tasks 
                    taskLoading = {taskLoading}
                    taskError = {taskError}
                    tasks = {tasks}
                    refetchTasks={() => fetchTasks(setTasks, setTaskError, setTaskLoading)}
                />
            </main>
        </div>
    );
}