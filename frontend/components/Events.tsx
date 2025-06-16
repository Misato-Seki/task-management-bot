import SectionCard from "./SectionCard"
import Card from "./Card"

type Events = {
    id: string;
    summary?: string;
    start: {
        dateTime?: string;
        date?: string;
    };
    end: {
        dateTime?: string;
        date?: string;
    };
}

type EventsProps = {
    loading: boolean,
    error?: string | null,
    events: Events[]
}

export default function Events ({loading, error, events}: EventsProps) {
    const foramtDate = (dateTimeStr?: string) => {
        if (!dateTimeStr) return null

        const date = new Date(dateTimeStr || '')
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})

    }
    return (
        <SectionCard title="Events">
            {loading ? (
                <div className="text-[#5093B4]">Loading...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : events.length === 0 ? (
                <div className="text-gray-500">No events for today.</div>
            ) : (
                events.map(event => (
                    <Card key={event.id} className="flex flex-row items-center gap-3">
                        <input type="checkbox" className="accent-[#5093B4] w-5 h-5 rounded border-2 border-[#49454F]" />
                        <div>
                            <div className="font-medium">{event.summary || 'No Title'}</div>
                            <div className="text-sm text-gray-700">
                                {foramtDate(event.start.dateTime)} - {foramtDate(event.end.dateTime)}
                            </div>
                        </div>
                    </Card>
                ))
            )}
        </SectionCard>
    )
}
