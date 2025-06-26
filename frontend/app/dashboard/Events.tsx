import SectionCard from "../../components/SectionCard"
import Card from "../../components/Card"
import { Event } from "@/app/types/global"

type EventsProps = {
    eventLoading: boolean,
    eventError?: string | null,
    events: Event[]
}

export default function Events ({eventLoading, eventError, events}: EventsProps) {
    const foramtDate = (dateTimeStr?: string) => {
        if (!dateTimeStr) return null

        const date = new Date(dateTimeStr || '')
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})

    }
    return (
        <SectionCard title="Events">
            {eventLoading ? (
                <div className="text-[#5093B4]">Loading...</div>
            ) : eventError ? (
                <div className="text-red-500">{eventError}</div>
            ) : events.length === 0 ? (
                <div className="text-gray-500">No events for today.</div>
            ) : (
                events.map(event => (
                    <Card key={event.id}>
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
