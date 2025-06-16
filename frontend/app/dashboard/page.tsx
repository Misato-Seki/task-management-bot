'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import Events from '@/components/Events';

type CalendarEvent = {
  id: string;
  summary?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
};

export default function Dashboard() {
    const router = useRouter();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

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
                    setError('Googleアクセストークンが取得できませんでした');
                    setLoading(false);
                    return;
                }
                // カレンダー予定取得
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}calendar/today`, {
                    headers: { Authorization: `Bearer ${data.accessToken}` },
                    credentials: 'include',
                });
                if (!res.ok) {
                    setError('予定の取得に失敗しました');
                    setLoading(false);
                    return;
                }
                const events = await res.json();
                setEvents(events);
                setLoading(false);
            })
            .catch(() => {
                setError('認証情報の取得に失敗しました');
                setLoading(false);
            });
    }, [router]);

    return (
        <div className="min-h-screen bg-[#F1F7F8] flex flex-col">
            <NavBar />

            {/* Main Content */}
            <main className="flex-1 flex justify-center items-start gap-12 px-8 py-10">
                {/* Events */}
                <Events 
                    loading = {loading}
                    error = {error}
                    events = {events}
                />

                {/* Habit */}
                <section className="bg-[#A2D2E2] rounded-2xl p-6 w-[400px] flex flex-col gap-6">
                    <h2 className="text-xl font-semibold text-white">Habit</h2>
                    {/* Habit 1 */}
                    <div className="bg-white rounded-xl p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <input type="checkbox" className="accent-[#5093B4] w-5 h-5 rounded border-2 border-[#49454F]" />
                            <span>Study English vocabulary for 15 minutes daily</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-[#5093B4]">20%</span>
                            <div className="w-full h-3 bg-[#F1F7F8] rounded">
                                <div className="h-3 bg-[#5093B4] rounded" style={{ width: '20%' }} />
                            </div>
                        </div>
                    </div>
                    {/* Habit 2 */}
                    <div className="bg-white rounded-xl p-4 flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <input type="checkbox" checked className="accent-[#F9C8C9] w-5 h-5 rounded border-2 border-[#49454F]" readOnly />
                            <span>Drink a glass of water right after waking up</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-[#5093B4]">80%</span>
                            <div className="w-full h-3 bg-[#F1F7F8] rounded">
                                <div className="h-3 bg-[#5093B4] rounded" style={{ width: '80%' }} />
                            </div>
                        </div>
                    </div>
                    {/* Add New Habit Button */}
                    <button className="mt-2 w-full bg-[#5093B4] text-white py-2 rounded-lg font-medium">Add New Habit</button>
                </section>

                {/* Task */}
                <section className="bg-[#A2D2E2] rounded-2xl p-6 w-[400px] flex flex-col gap-6">
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