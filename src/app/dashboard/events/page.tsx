'use client'
import { useEffect, useState } from "react"
import EventCard from "@/components/events/Eventcard"
import EventForm from "@/components/events/EventForm"
import EventFilter from "@/components/events/EventFilter"

export type EventType = {
    _id?: string
    title: string
    description: string
    date: string
    startTime: string
    endTime: string
    location: {
        venue: string
        address: string
        city: string
        state: string
        zipCode: string
    }
    organizer: {
        name: string
        email: string
        phone: string
    }
    category: string
    price: number
    registrationDeadline: string
    imageURL?: string
    status: "upcoming" | "ongoing" | "completed" | "cancelled"
    createdBy: string
    createdAt?: string
}

type FilterState = {
    status: string
    category: string
    page: number
    limit: number
    sortBy: string
    sortOrder: string
}

type PaginationState = {
    currentPage: number
    totalPages: number
}

type APIResponse<T> = {
    success: boolean
    data: T
    pagination: PaginationState
    message?: string
}

const apiBase = process.env.NEXT_PUBLIC_API_URL

export default function Events() {
    const [events, setEvents] = useState<EventType[]>([])
    const [loading, setLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [editEvent, setEditEvent] = useState<EventType | null>(null)
    const [detail, setDetail] = useState<EventType | null>(null)
    const [filters, setFilters] = useState<FilterState>({
        status: "",
        category: "",
        page: 1,
        limit: 9,
        sortBy: "date",
        sortOrder: "asc"
    })
    const [pagination, setPagination] = useState<PaginationState>({ currentPage: 1, totalPages: 1 })

    const fetchEvents = async (params: FilterState = filters) => {
        setLoading(true)
        try {
            // Convert FilterState to URLSearchParams compatible format
            const searchParams: Record<string, string> = {
                status: params.status,
                category: params.category,
                page: params.page.toString(),
                limit: params.limit.toString(),
                sortBy: params.sortBy,
                sortOrder: params.sortOrder
            }

            const query = new URLSearchParams(searchParams).toString()
            const res = await fetch(`${apiBase}/api/events?${query}`)
            const data: APIResponse<EventType[]> = await res.json()

            setEvents(data.data || [])
            setPagination({
                currentPage: data.pagination.currentPage,
                totalPages: data.pagination.totalPages
            })
        } catch (error) {
            console.error('Failed to fetch events:', error)
            setEvents([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
        // eslint-disable-next-line
    }, [filters])

    const openCreate = () => { setEditEvent(null); setModalOpen(true) }
    const openEdit = (e: EventType) => { setEditEvent(e); setModalOpen(true) }
    const closeModal = () => { setModalOpen(false) }
    const onSave = async () => { setModalOpen(false); fetchEvents() }

    const showDetail = async (id: string) => {
        setLoading(true)
        try {
            const res = await fetch(`${apiBase}/api/events/${id}`)
            const data: APIResponse<EventType> = await res.json()
            setDetail(data.data)
        } catch (error) {
            console.error('Failed to fetch event details:', error)
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async (id?: string) => {
        if (!id) return
        try {
            await fetch(`${apiBase}/api/events/${id}`, { method: "DELETE" })
            setDetail(null)
            fetchEvents()
        } catch (error) {
            console.error('Failed to delete event:', error)
        }
    }

    return (
        <div className="bg-zinc-950 mt-14 px-4 min-h-screen flex flex-col">
            <div className="w-full min-h-[55vh] px-2 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-zinc-200">Event Management</h1>
                    <button className="bg-zinc-800 border text-zinc-200 rounded-lg px-4 py-2 hover:bg-zinc-700" onClick={openCreate}>
                        + Create Event
                    </button>
                </div>
                <EventFilter filters={filters} setFilters={setFilters} />
                {loading ? (
                    <div className="p-8 min-h-[55vh] flex justify-center items-center text-center">
                        <div className="w-8 h-8 border-t-2 rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        {events.map((e) => (
                            <EventCard
                                key={e._id}
                                event={e}
                                onEdit={() => openEdit(e)}
                                onView={() => showDetail(e._id!)}
                            />
                        ))}
                    </div>
                )}
                <div className="flex justify-center gap-3 mt-8">
                    <button disabled={pagination.currentPage <= 1}
                        onClick={() => setFilters({ ...filters, page: pagination.currentPage - 1 })}
                        className="bg-zinc-900 border rounded-lg px-3 py-1 text-zinc-200 disabled:opacity-50">
                        Prev
                    </button>
                    <span className="text-zinc-200">{pagination.currentPage} / {pagination.totalPages}</span>
                    <button disabled={pagination.currentPage >= pagination.totalPages}
                        onClick={() => setFilters({ ...filters, page: pagination.currentPage + 1 })}
                        className="bg-zinc-900 border rounded-lg px-3 py-1 text-zinc-200 disabled:opacity-50">
                        Next
                    </button>
                </div>
            </div>
            {modalOpen && (
                <div className="fixed inset-0 mt-12 bg-zinc-950 bg-opacity-60 z-30 flex items-center justify-center">
                    <div className="bg-zinc-900 border rounded-lg w-full max-w-3xl p-6">
                        <EventForm event={editEvent} onClose={closeModal} onSave={onSave} />
                    </div>
                </div>
            )}
            {detail && (
                <div className="fixed inset-0 bg-zinc-950 bg-opacity-50 z-40 flex items-center justify-center">
                    <div className="bg-zinc-900 border rounded-lg w-full max-w-3xl p-6 relative">
                        <button className="absolute top-5 right-5 text-zinc-200" onClick={() => setDetail(null)}>✕</button>
                        <div className="flex flex-col md:flex-row gap-4">
                            {detail.imageURL && <img src={detail.imageURL} alt={detail.title} className="md:w-52 w-full rounded-lg border object-cover" />}
                            <div className="flex-1">
                                <h2 className="text-2xl font-semibold text-zinc-200 mb-2">{detail.title}</h2>
                                <p className="text-zinc-400 mb-2">{detail.description}</p>
                                <p className="text-zinc-300 mb-1"><b>Date:</b> {new Date(detail.date).toLocaleDateString()}</p>
                                <p className="text-zinc-300 mb-1"><b>Time:</b> {detail.startTime} - {detail.endTime}</p>
                                <p className="text-zinc-300 mb-1"><b>Venue:</b> {detail.location.venue}</p>
                                <p className="text-zinc-300 mb-1"><b>Address:</b> {detail.location.address}, {detail.location.city}, {detail.location.state} {detail.location.zipCode}</p>
                                <p className="text-zinc-300 mb-1"><b>Organizer:</b> {detail.organizer.name}, {detail.organizer.email}, {detail.organizer.phone}</p>
                                <p className="text-zinc-300 mb-1"><b>Category:</b> {detail.category}</p>
                                <p className="text-zinc-300 mb-1"><b>Price:</b> ₹{detail.price}</p>
                                <p className="text-zinc-300 mb-1"><b>Registration Deadline:</b> {new Date(detail.registrationDeadline).toLocaleDateString()}</p>
                                <p className="text-zinc-300 mb-2"><b>Status:</b> <span className="capitalize">{detail.status}</span></p>
                                <div className="flex gap-3">
                                    <button className="px-4 cursor-pointer py-1 bg-zinc-800 border rounded-lg text-zinc-200"
                                        onClick={() => { setEditEvent(detail); setModalOpen(true); setDetail(null) }}>
                                        Edit
                                    </button>
                                    <button className="px-4 cursor-pointer py-1 bg-zinc-800 border text-red-400 rounded-lg"
                                        onClick={() => onDelete(detail._id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}