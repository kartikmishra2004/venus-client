import { EventType } from "@/app/dashboard/events/page"

type Props = {
    event: EventType
    onEdit: () => void
    onView: () => void
}

export default function EventCard({ event, onEdit, onView }: Props) {
    return (
        <div className="bg-zinc-900 border rounded-lg p-4 flex flex-col gap-2 transition hover:shadow-md">
            {event.imageURL &&
                <img src={event.imageURL} className="w-full h-40 object-cover rounded-lg border mb-2" alt={event.title} />
            }
            <h3 className="text-lg font-bold text-zinc-200">{event.title}</h3>
            <div className="text-zinc-400 line-clamp-2">{event.description}</div>
            <div className="text-zinc-300 text-sm flex flex-wrap gap-x-4">
                <span>{new Date(event.date).toLocaleDateString()}</span>
                <span>{event.startTime} - {event.endTime}</span>
            </div>
            <div className="mt-1 flex justify-between items-center">
                <span className="text-zinc-400 capitalize px-3 bg-zinc-800 rounded-lg">{event.status}</span>
                <span className="text-zinc-400 text-sm">₹{event.price}</span>
            </div>
            <div className="flex gap-3 mt-2">
                <button onClick={onView} className="px-3 py-1 bg-primary hover:bg-primary/80 transition-colors duration-200 ease-in-out cursor-pointer border text-zinc-50 rounded-lg w-1/2">View</button>
                <button onClick={onEdit} className="px-3 py-1 bg-zinc-800 border cursor-pointer text-zinc-50 rounded-lg w-1/2">Edit</button>
            </div>
        </div>
    )
}