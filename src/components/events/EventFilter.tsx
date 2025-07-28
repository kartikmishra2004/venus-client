type FilterState = {
    status: string;
    category: string;
    page: number;
    sortOrder: string;
    limit: number;
    sortBy: string;
}

type Props = {
    filters: FilterState;
    setFilters: (filters: FilterState | ((prevFilters: FilterState) => FilterState)) => void;
}

export default function EventFilter({ filters, setFilters }: Props) {
    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg flex flex-wrap items-center gap-3 p-4 mb-7">
            <input
                placeholder="Search category..."
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 text-zinc-200"
                value={filters.category || ""}
                onChange={e => setFilters(prevFilters => ({ ...prevFilters, category: e.target.value, page: 1 }))}
            />
            <select
                value={filters.status}
                onChange={e => setFilters(prevFilters => ({ ...prevFilters, status: e.target.value, page: 1 }))}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 text-zinc-200"
            >
                <option value="">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
            </select>
            <select
                value={filters.sortOrder}
                onChange={e => setFilters(prevFilters => ({ ...prevFilters, sortOrder: e.target.value }))}
                className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 text-zinc-200"
            >
                <option value="asc">Sort: Date ↑</option>
                <option value="desc">Sort: Date ↓</option>
            </select>
        </div>
    )
}