'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Events from '@/components/Events';
import Habits from '@/components/Habits';
import { Event, Habit } from '../types/global';



export default function Dashboard() {
    const router = useRouter();
    const [events, setEvents] = useState<Event[]>([]);
    const [eventError, setEventError] = useState<string | null>(null);
    const [eventLoading, setEventLoading] = useState(true);
    const [habits, setHabits] = useState<Habit[]>([])
    const [habitError, setHabitError] = useState<string | null>(null);
    const [habitLoading, setHabitLoading] = useState(true);


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
        const fetchHabits = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}habits`);
                if (!res.ok) {
                    setHabitError('Failed to fetch habits');
                    setHabitLoading(false);
                    return;
                }
                const habits = await res.json();
                setHabits(habits);
            } catch {
                setHabitError('Failed to fetch habits');
            } finally {
                setHabitLoading(false);
            }
        };
        fetchHabits();
    }, []);

    return (
        <div className="min-h-screen bg-[#F1F7F8] flex flex-col">
            <NavBar />

            {/* Main Content */}
            <main className="flex-1 flex justify-center items-start gap-12 px-8 py-10">
                
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
                />

                {/* Task */}
                <section className="bg-[#A2D2E2] rounded-2xl p-6 w-full flex flex-col gap-6">
                    <h2 className="text-xl font-semibold text-white">Task</h2>
                    {/* Task 1 */}
                    <div className="flex items-center gap-3 bg-white rounded-xl p-4">
                        <input type="checkbox" className="accent-[#5093B4] w-5 h-5 rounded border-2 border-[#49454F]" />
                        <span>Buy toilet paper</span>
                    </div>
                    {/* Task 2 */}
                    <div className="flex items-center gap-3 bg-white rounded-xl p-4">
                        <input type="checkbox" checked className="accent-[#F9C8C9] w-5 h-5 rounded border-2 border-[#49454F]" readOnly />
                        <span>Organize desk drawer</span>
                    </div>
                    {/* Task 3 (with subtasks) */}
                    <div className="bg-white rounded-xl p-4 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span>Develop Task Bot</span>
                            <span className="text-[#5093B4] cursor-pointer">▼</span>
                        </div>
                        <div className="flex flex-col gap-1 pl-4">
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked className="accent-[#F9C8C9] w-4 h-4 rounded border-2 border-[#49454F]" readOnly />
                                <span>create README</span>
                                <span className="ml-auto text-xs text-gray-400">5.6.2025</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" className="accent-[#5093B4] w-4 h-4 rounded border-2 border-[#49454F]" />
                                <span>create wireframe</span>
                                <span className="ml-auto text-xs text-gray-400">7.6.2025</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-[#5093B4]">20%</span>
                            <div className="w-full h-3 bg-[#F1F7F8] rounded">
                                <div className="h-3 bg-[#5093B4] rounded" style={{ width: '20%' }} />
                            </div>
                        </div>
                    </div>
                    {/* Add New Task Button */}
                    <button className="mt-2 w-full bg-[#5093B4] text-white py-2 rounded-lg font-medium">Add New Task</button>
                </section>
            </main>
        </div>
    );
}