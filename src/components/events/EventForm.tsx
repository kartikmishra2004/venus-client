import { useState, ChangeEvent, FormEvent } from "react"
import { EventType } from "@/app/dashboard/events/page"

const statusOptions = ["upcoming", "ongoing", "completed", "cancelled"] as const

type Props = {
    event?: EventType | null
    onClose: () => void
    onSave: () => void
}

const apiBase = process.env.NEXT_PUBLIC_API_URL

const defaultInit: EventType = {
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: { venue: "", address: "", city: "", state: "", zipCode: "" },
    organizer: { name: "", email: "", phone: "" },
    category: "",
    price: 0,
    registrationDeadline: "",
    imageURL: "",
    status: "upcoming",
    createdBy: ""
}

export default function EventForm({ event, onClose, onSave }: Props) {
    const [values, setValues] = useState<EventType>(event || defaultInit)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        if (name.startsWith("location.")) {
            const locationField = name.split(".")[1] as keyof EventType['location']
            setValues(prev => ({
                ...prev,
                location: { ...prev.location, [locationField]: value }
            }))
        } else if (name.startsWith("organizer.")) {
            const organizerField = name.split(".")[1] as keyof EventType['organizer']
            setValues(prev => ({
                ...prev,
                organizer: { ...prev.organizer, [organizerField]: value }
            }))
        } else {
            // Handle type conversion for numeric fields
            const processedValue = name === 'price' ? Number(value) : value
            setValues(prev => ({ ...prev, [name]: processedValue }))
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        const reqMethod = event?._id ? "PUT" : "POST"
        const reqUrl = event?._id
            ? `${apiBase}/api/events/${event._id}`
            : `${apiBase}/api/events`

        try {
            const res = await fetch(reqUrl, {
                method: reqMethod,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values)
            })
            const data = await res.json()

            if (!data.success) {
                setError(data.message || "Unable to save")
                return
            }

            onSave()
        } catch (err) {
            setError("Network error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-1.5 max-h-[80vh] overflow-y-auto">
            <h2 className="text-lg text-zinc-200 mb-1">{event?._id ? "Edit Event" : "Create Event"}</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 px-2">
                <div>
                    <label htmlFor="title" className="text-xs text-zinc-400">Title</label>
                    <input id="title" name="title" maxLength={60} required autoFocus value={values.title} onChange={handleChange}
                        className="bg-zinc-800 border rounded px-2 py-1 text-sm text-zinc-200 w-full" />
                </div>

                <div>
                    <label htmlFor="category" className="text-xs text-zinc-400">Category</label>
                    <input id="category" name="category" required value={values.category} onChange={handleChange}
                        className="bg-zinc-800 border rounded px-2 py-1 text-sm text-zinc-200 w-full" />
                </div>

                <div>
                    <label htmlFor="price" className="text-xs text-zinc-400">Price</label>
                    <input id="price" name="price" type="number" min={0} required value={values.price} onChange={handleChange}
                        className="bg-zinc-800 border rounded px-2 py-1 text-sm text-zinc-200 w-full" />
                </div>

                <div>
                    <label htmlFor="status" className="text-xs text-zinc-400">Status</label>
                    <select id="status" name="status" value={values.status} onChange={handleChange}
                        className="bg-zinc-800 border rounded px-2 py-1 text-sm text-zinc-200 w-full">
                        {statusOptions.map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 px-2">
                <div>
                    <label htmlFor="date" className="text-xs text-zinc-400">Date</label>
                    <input id="date" name="date" type="date" required value={values.date?.slice(0, 10)} onChange={handleChange}
                        className="bg-zinc-800 border rounded px-2 py-1 text-sm text-zinc-200 w-full" />
                </div>

                <div>
                    <label htmlFor="startTime" className="text-xs text-zinc-400">Start Time</label>
                    <input id="startTime" name="startTime" required value={values.startTime} onChange={handleChange} placeholder="10:00 AM"
                        className="bg-zinc-800 border rounded px-2 py-1 text-sm text-zinc-200 w-full" />
                </div>

                <div>
                    <label htmlFor="endTime" className="text-xs text-zinc-400">End Time</label>
                    <input id="endTime" name="endTime" required value={values.endTime} onChange={handleChange} placeholder="2:00 PM"
                        className="bg-zinc-800 border rounded px-2 py-1 text-sm text-zinc-200 w-full" />
                </div>

                <div>
                    <label htmlFor="registrationDeadline" className="text-xs text-zinc-400">Reg. Deadline</label>
                    <input id="registrationDeadline" name="registrationDeadline" type="date" required value={values.registrationDeadline?.slice(0, 10)} onChange={handleChange}
                        className="bg-zinc-800 border rounded px-2 py-1 text-sm text-zinc-200 w-full" />
                </div>
            </div>

            <div className="px-2">
                <label htmlFor="description" className="text-xs text-zinc-400">Description</label>
                <textarea id="description" name="description" required maxLength={250} rows={2} value={values.description} onChange={handleChange}
                    className="bg-zinc-800 border rounded px-2 py-1 text-sm text-zinc-200 w-full resize-none" />
            </div>

            <div className="grid px-2 grid-cols-2 md:grid-cols-5 gap-1.5">
                <div>
                    <label htmlFor="location.venue" className="text-xs text-zinc-400">Venue</label>
                    <input id="location.venue" name="location.venue" required value={values.location.venue} onChange={handleChange}
                        className="bg-zinc-800 border rounded px-2 py-1 text-sm text-zinc-200 w-full" />
                </div>
                <div>
                    <label htmlFor="location.address" className="text-xs text-zinc-400">Address</label>
                    <input id="location.address" name="location.address" required value={values.location.address} onChange={handleChange}
                        className="bg-zinc-800 border rounded px-2 py-1 text-sm text-zinc-200 w-full" />
                </div>
                <div>
                    <label htmlFor="location.city" className="text-xs text-zinc-400">City</label>
                    <input id="location.city" name="location.city" required value={values.location.city} onChange={handleChange}
                        className="bg-zinc-800 border rounded px-2 py-1 text-sm text-zinc-200 w-full" />
                </div>
                <div>
                    <label htmlFor="location.state" className="text-xs text-zinc-400">State</label>
                    <input id="location.state" name="location.state" required value={values.location.state} onChange={handleChange}
                        className="bg-zinc-800 border rounded px-2 py-1 text-sm text-zinc-200 w-full" />
                </div>
                <div>
                    <label htmlFor="location.zipCode" className="text-xs text-zinc-400">ZIP</label>
                    <input id="location.zipCode" name="location.zipCode" required value={values.location.zipCode} onChange={handleChange}
                        className="bg-zinc-800 border rounded px-2 py-1 text-sm text-zinc-200 w-full" />
                </div>
            </div>

            <div className="grid px-2 grid-cols-2 md:grid-cols-4 gap-1.5">
                <div>
                    <label htmlFor="organizer.name" className="text-xs text-zinc-400">Organizer</label>
                    <input id="organizer.name" name="organizer.name" required value={values.organizer.name} onChange={handleChange}
                        className="bg-zinc-800 border rounded px-2 py-1 text-sm text-zinc-200 w-full" />
                </div>
                <div>
                    <label htmlFor="organizer.email" className="text-xs text-zinc-400">Email</label>
                    <input id="organizer.email" name="organizer.email" type="email" required value={values.organizer.email} onChange={handleChange}
                        className="bg-zinc-800 border rounded px-2 py-1 text-sm text-zinc-200 w-full" />
                </div>
                <div>
                    <label htmlFor="organizer.phone" className="text-xs text-zinc-400">Phone</label>
                    <input id="organizer.phone" name="organizer.phone" required value={values.organizer.phone} onChange={handleChange}
                        className="bg-zinc-800 border rounded px-2 py-1 text-sm text-zinc-200 w-full" />
                </div>
                <div>
                    <label htmlFor="createdBy" className="text-xs text-zinc-400">Staff Name</label>
                    <input id="createdBy" name="createdBy" required value={values.createdBy} onChange={handleChange}
                        className="bg-zinc-800 border rounded px-2 py-1 text-sm text-zinc-200 w-full" />
                </div>
            </div>

            <div className="px-2">
                <label htmlFor="imageURL" className="text-xs text-zinc-400">Image URL (optional)</label>
                <input id="imageURL" name="imageURL" value={values.imageURL || ""} onChange={handleChange}
                    className="bg-zinc-800 border rounded px-2 py-1 text-sm text-zinc-200 w-full" />
            </div>

            {error && <div className="text-red-400 text-sm">{error}</div>}

            <div className="flex gap-2 px-2 justify-end mt-2">
                <button type="button" onClick={onClose}
                    className="border rounded px-3 py-1.5 text-sm cursor-pointer text-zinc-200 bg-zinc-800">Cancel</button>
                <button type="submit" disabled={loading}
                    className="border rounded px-3 py-1.5 text-sm cursor-pointer hover:bg-primary/80 transition-colors bg-primary text-zinc-50">
                    {loading ? "Saving..." : "Save"}
                </button>
            </div>
        </form>
    )
}