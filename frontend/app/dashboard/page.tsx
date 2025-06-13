'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const router = useRouter();
    const [events, setEvents] = useState<any[]>([]);
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
            .catch(e => {
                setError('認証情報の取得に失敗しました');
                setLoading(false);
            });
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F1F7F8]">
        <div className="w-[410px] bg-white rounded-lg shadow-lg border border-[#5093B4] p-10 flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-[#5093B4] mb-2">Dashboard</h1>
            <p className="text-base text-gray-700">Welcome to my dashboard!</p>
            <h2 className="text-lg font-bold text-[#5093B4] mt-4">Events</h2>
            {loading ? (
                <p>読み込み中...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : events.length === 0 ? (
                <p>本日の予定はありません。</p>
            ) : (
                <ul className="list-disc ml-5">
                    {events.map(event => (
                        <li key={event.id}>
                            {event.summary || '(タイトルなし)'}<br />
                            {event.start?.dateTime || event.start?.date} ～ {event.end?.dateTime || event.end?.date}
                        </li>
                    ))}
                </ul>
            )}
        </div>
        </div>
    );
}