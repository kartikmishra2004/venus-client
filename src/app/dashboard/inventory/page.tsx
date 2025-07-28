'use client'
import React, { useEffect, useState } from "react";
import { Calendar, Package, TrendingUp, TrendingDown, Plus, Filter, Search, Eye, X } from "lucide-react";

type TransactionType = "buy" | "sell";

interface InventoryTransaction {
    _id: string;
    productName: string;
    type: TransactionType;
    description?: string;
    quantity: number;
    amountPerPiece: number;
    totalAmount: number;
    createdBy: string;
    transactionDate: string;
    billNumber?: string;
    createdAt?: string;
}

interface BillData {
    billNumber?: string;
    date: string;
    time: string;
    company: {
        name: string;
        address: string;
        city: string;
        phone: string;
        email: string;
        gst: string;
    };
    items: {
        description: string;
        quantity: number;
        rate: number;
        amount: number;
    }[];
    subtotal: number;
    tax: number;
    total: number;
    totalInWords: string;
    notes: string;
    createdBy: string;
    subtotalFormatted: string;
    totalFormatted: string;
}

interface SummaryData {
    totalAmount: number;
    totalQuantity: number;
    totalTransactions: number;
    averageAmount: number;
    totalAmountFormatted: string;
    averageAmountFormatted?: string;
}

interface BuySellSummary {
    buy: SummaryData;
    sell: SummaryData;
    profitLoss: {
        amount: number;
        amountFormatted: string;
        type: "profit" | "loss";
    };
}

export default function Inventory() {
    const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);

    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [typeFilter, setTypeFilter] = useState<string>("");
    const [productNameFilter, setProductNameFilter] = useState<string>("");
    const [startDateFilter, setStartDateFilter] = useState<string>("");
    const [endDateFilter, setEndDateFilter] = useState<string>("");
    const [sortBy, setSortBy] = useState<keyof InventoryTransaction>("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [loading, setLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [billLoading, setBillLoading] = useState(false);

    const [form, setForm] = useState<Partial<InventoryTransaction>>({
        productName: "",
        type: "buy",
        description: "",
        quantity: 0,
        amountPerPiece: 0,
        totalAmount: 0,
        createdBy: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [billData, setBillData] = useState<BillData | null>(null);
    const [summary, setSummary] = useState<BuySellSummary | null>(null);

    async function fetchTransactions() {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (typeFilter) params.append("type", typeFilter);
            if (productNameFilter) params.append("productName", productNameFilter);
            if (startDateFilter) params.append("startDate", startDateFilter);
            if (endDateFilter) params.append("endDate", endDateFilter);
            params.append("page", page.toString());
            params.append("limit", limit.toString());
            params.append("sortBy", sortBy);
            params.append("sortOrder", sortOrder);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory?` + params.toString());
            if (!res.ok) throw new Error((await res.json()).message || "Failed to fetch");
            const data = await res.json();
            setTransactions(data.data);
            setTotalPages(data.pagination.totalPages);
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    }

    async function fetchSummary() {
        try {
            const params = new URLSearchParams();
            if (startDateFilter) params.append("startDate", startDateFilter);
            if (endDateFilter) params.append("endDate", endDateFilter);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/summary?` + params.toString());
            if (!res.ok) throw new Error((await res.json()).message || "Failed to fetch summary");
            const data = await res.json();
            setSummary(data.data);
        } catch { }
    }

    useEffect(() => {
        fetchTransactions();
        fetchSummary();
    }, [page, typeFilter, productNameFilter, startDateFilter, endDateFilter, sortBy, sortOrder]);

    const getCurrentMonth = () => {
        const now = new Date();
        return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    function onInputChange<K extends keyof typeof form>(key: K, value: typeof form[K]) {
        setForm((f) => {
            const newForm = { ...f, [key]: value };
            if (
                key === "quantity" ||
                key === "amountPerPiece" ||
                key === "totalAmount" ||
                key === "type"
            ) {
                const quantity = Number(newForm.quantity) || 0;
                const amountPerPiece = Number(newForm.amountPerPiece) || 0;
                newForm.totalAmount = quantity * amountPerPiece;
            }
            return newForm;
        });
    }

    async function createTransaction() {
        setError(null);
        try {
            if (!form.productName || !form.type || !form.createdBy) {
                setError("Please fill all required fields");
                return;
            }
            if (
                Math.abs((form.quantity || 0) * (form.amountPerPiece || 0) - (form.totalAmount || 0)) >
                0.01
            ) {
                setError("Total amount doesn't match quantity × amount per piece");
                return;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to create transaction");
            setForm({
                productName: "",
                type: "buy",
                description: "",
                quantity: 0,
                amountPerPiece: 0,
                totalAmount: 0,
                createdBy: "",
            });
            setShowCreateForm(false);
            fetchTransactions();
            fetchSummary();
            if (data.billData) setBillData(data.billData);
            else setBillData(null);
        } catch (e) {
            console.log(e);
        }
    }
    console.log(billData)
    async function fetchBill(id: string) {
        setBillLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/inventory/${id}/bill`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch bill");
            setBillData(data.data);
        } catch (e) {
            console.log(e);
        } finally {
            setBillLoading(false);
        }
    }

    const filteredTransactions = transactions.filter(t => {
        if (typeFilter && t.type !== typeFilter) return false;
        if (productNameFilter && !t.productName.toLowerCase().includes(productNameFilter.toLowerCase())) return false;
        if (startDateFilter && new Date(t.transactionDate) < new Date(startDateFilter)) return false;
        if (endDateFilter && new Date(t.transactionDate) > new Date(endDateFilter)) return false;
        return true;
    });

    return (
        <div className="bg-zinc-950 min-h-screen text-zinc-200 mt-18">
            <div>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-zinc-200 flex items-center gap-2">
                                <Package className="w-6 h-6" />
                                Inventory Management
                            </h1>
                            <p className="text-zinc-400 mt-1">Manage inventory transactions and track stock</p>
                        </div>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="bg-primary cursor-pointer hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            New Transaction
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    { }
                    <div className="lg:col-span-1 space-y-6">
                        { }
                        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Filter className="w-4 h-4" />
                                <h3 className="font-medium">Filters</h3>
                            </div>

                            <div className="space-y-3">
                                <div className="relative">
                                    <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                                        value={productNameFilter}
                                        onChange={(e) => {
                                            setProductNameFilter(e.target.value);
                                            setPage(1);
                                        }}
                                    />
                                </div>

                                <select
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                                    value={typeFilter}
                                    onChange={(e) => {
                                        setTypeFilter(e.target.value);
                                        setPage(1);
                                    }}
                                >
                                    <option value="">All Types</option>
                                    <option value="buy">Buy</option>
                                    <option value="sell">Sell</option>
                                </select>

                                <input
                                    type="date"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                                    value={startDateFilter}
                                    onChange={(e) => {
                                        setStartDateFilter(e.target.value);
                                        setPage(1);
                                    }}
                                    placeholder="Start Date"
                                />

                                <input
                                    type="date"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                                    value={endDateFilter}
                                    onChange={(e) => {
                                        setEndDateFilter(e.target.value);
                                        setPage(1);
                                    }}
                                    placeholder="End Date"
                                />
                            </div>
                        </div>

                        { }
                        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
                            <h3 className="font-medium mb-3">Transaction Types</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span className="text-sm text-zinc-300">Purchase</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                                    <span className="text-sm text-zinc-300">Sale</span>
                                </div>
                            </div>
                        </div>

                        { }
                        <SummaryCard summary={summary} />
                    </div>

                    { }
                    <div className="lg:col-span-3">
                        { }
                        <div className="bg-zinc-900 rounded-lg border border-zinc-800">
                            <div className="p-4 border-b border-zinc-800">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">Recent Transactions</h3>
                                    <div className="flex gap-2">
                                        <select
                                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 text-sm"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value as keyof InventoryTransaction)}
                                        >
                                            <option value="createdAt">Date</option>
                                            <option value="productName">Product</option>
                                            <option value="totalAmount">Amount</option>
                                        </select>
                                        <select
                                            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1 text-sm"
                                            value={sortOrder}
                                            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
                                        >
                                            <option value="desc">Newest</option>
                                            <option value="asc">Oldest</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-zinc-800">
                                {loading ? (
                                    <div className="p-8 text-center text-zinc-400">
                                        <div className="animate-spin w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                                        Loading transactions...
                                    </div>
                                ) : transactions.length === 0 ? (
                                    <div className="p-8 text-center text-zinc-400">
                                        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        No transactions found.
                                    </div>
                                ) : (
                                    transactions.map((transaction) => (
                                        <TransactionRow key={transaction._id} transaction={transaction} onViewBill={fetchBill} />
                                    ))
                                )}
                            </div>

                            { }
                            {!loading && transactions.length > 0 && (
                                <div className="p-4 border-t border-zinc-800">
                                    <Pagination page={page} totalPages={totalPages} setPage={setPage} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            { }
            {showCreateForm && (
                <div className="fixed inset-0 bg-black mt-12 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-zinc-900 rounded-lg border border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-zinc-800">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Create New Transaction</h2>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="text-zinc-400 hover:text-zinc-200"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); createTransaction(); }} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Product Name *</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                                        value={form.productName || ""}
                                        onChange={(e) => onInputChange("productName", e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Transaction Type *</label>
                                    <select
                                        value={form.type || "buy"}
                                        onChange={(e) => onInputChange("type", e.target.value as TransactionType)}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                                        required
                                    >
                                        <option value="buy">Purchase</option>
                                        <option value="sell">Sale</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 h-20 resize-none"
                                    value={form.description || ""}
                                    onChange={(e) => onInputChange("description", e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Quantity *</label>
                                    <input
                                        required
                                        type="number"
                                        min={0}
                                        step={1}
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                                        value={form.quantity || ""}
                                        onChange={(e) => onInputChange("quantity", Number(e.target.value))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Amount Per Piece *</label>
                                    <input
                                        required
                                        type="number"
                                        min={0}
                                        step="0.01"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                                        value={form.amountPerPiece || ""}
                                        onChange={(e) => onInputChange("amountPerPiece", Number(e.target.value))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Total Amount</label>
                                    <input
                                        type="number"
                                        className="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-zinc-400"
                                        value={form.totalAmount || ""}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Created By *</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                                    value={form.createdBy || ""}
                                    onChange={(e) => onInputChange("createdBy", e.target.value)}
                                />
                            </div>

                            {error && (
                                <div className="bg-red-900 border border-red-700 rounded-lg p-3 text-red-200">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors"
                                >
                                    Create Transaction
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="px-6 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            { }
            {billData && <BillModal billData={billData} onClose={() => setBillData(null)} />}
        </div>
    );
}

function Pagination({
    page,
    totalPages,
    setPage,
}: {
    page: number;
    totalPages: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
    return (
        <div className="flex justify-center items-center gap-3 select-none">
            <button
                className="px-3 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                aria-label="Previous page"
            >
                Prev
            </button>
            <span className="text-sm text-zinc-300">
                Page {page} / {totalPages}
            </span>
            <button
                className="px-3 py-1 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 disabled:text-zinc-500 transition-colors"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                aria-label="Next page"
            >
                Next
            </button>
        </div>
    );
}

function TransactionRow({ transaction, onViewBill }: {
    transaction: InventoryTransaction;
    onViewBill: (id: string) => void;
}) {
    return (
        <div className="p-3 hover:bg-zinc-800/50 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex items-start gap-4 flex-1">
                    <div className={`w-3 h-3 rounded-full mt-2 ${transaction.type === 'buy' ? 'bg-blue-500' : 'bg-primary'}`} />
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-zinc-200">{transaction.productName}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.type === 'buy'
                                ? 'bg-blue-900 text-blue-200'
                                : 'bg-emerald-900 text-emerald-200'
                                }`}>
                                {transaction.type === 'buy' ? 'Purchase' : 'Sale'}
                            </span>
                        </div>

                        <div className="text-sm text-zinc-400 mb-2">
                            {transaction.description || 'No description'}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-zinc-300">
                            <span>Qty: {transaction.quantity}</span>
                            <span>Rate: ₹{transaction.amountPerPiece.toLocaleString()}</span>
                            <span>By: {transaction.createdBy}</span>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-lg font-semibold text-zinc-200 mb-1">
                        ₹{transaction.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-zinc-400 mb-2">
                        {new Date(transaction.transactionDate).toLocaleDateString('en-IN')}
                    </div>
                    <div className="flex gap-2">
                        {transaction.type === "sell" && (
                            <button
                                onClick={() => onViewBill(transaction._id)}
                                className="flex cursor-pointer items-center gap-1 px-3 py-1 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 rounded-lg text-xs transition-colors"
                            >
                                <Eye className="w-3 h-3" />
                                Bill
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ summary }: { summary: BuySellSummary | null }) {
    if (!summary) return (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
            <h3 className="font-medium mb-3">Summary</h3>
            <p className="text-zinc-400">Loading...</p>
        </div>
    );

    return (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-4">
            <h3 className="font-medium mb-4">Summary</h3>

            <div className="space-y-4">
                <div className="bg-zinc-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-300">Purchases</span>
                    </div>
                    <div className="text-lg font-semibold text-zinc-200">{summary.buy.totalAmountFormatted}</div>
                    <div className="text-xs text-zinc-400">{summary.buy.totalTransactions} transactions</div>
                </div>

                <div className="bg-zinc-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-300">Sales</span>
                    </div>
                    <div className="text-lg font-semibold text-zinc-200">{summary.sell.totalAmountFormatted}</div>
                    <div className="text-xs text-zinc-400">{summary.sell.totalTransactions} transactions</div>
                </div>

                <div className="bg-zinc-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-zinc-300">Profit/Loss</span>
                    </div>
                    <div className={`text-lg font-semibold ${summary.profitLoss.type === "profit" ? "text-emerald-400" : "text-red-400"
                        }`}>
                        {summary.profitLoss.type === "profit" ? "+" : "-"}{summary.profitLoss.amountFormatted}
                    </div>
                    <div className="text-xs text-zinc-400 capitalize">{summary.profitLoss.type}</div>
                </div>
            </div>
        </div>
    );
}

function BillModal({ billData, onClose }: { billData: BillData; onClose: () => void }) {
    return (
        <div className="fixed mt-12 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 z-50">
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
                <div className="p-4 border-b border-zinc-800">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold"></h2>
                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                className="text-zinc-400 hover:text-zinc-200 p-1.5"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <div className="bg-zinc-900 border text-zinc-300 p-4 rounded">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-xl font-bold mb-1">Bill</h1>
                                <p className="text-sm text-zinc-400">Date: {billData.date}</p>
                            </div>
                            <div className="text-right text-sm text-zinc-400">
                                <h2 className="text-base font-bold text-zinc-300">{billData.company.name}</h2>
                                <p>Indore M.P.</p>
                                <p>+91 9981011811</p>
                                <p>info@venussportsarena.com</p>
                            </div>
                        </div>

                        <table className="w-full border-collapse border text-sm mb-4">
                            <thead>
                                <tr className="bg-zinc-800">
                                    <th className="border p-2 text-left">Description</th>
                                    <th className="border p-2 text-right">Qty</th>
                                    <th className="border p-2 text-right">Rate</th>
                                    <th className="border p-2 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billData.items.map((item, i) => (
                                    <tr key={i}>
                                        <td className="border p-2">{item.description}</td>
                                        <td className="border p-2 text-right">{item.quantity}</td>
                                        <td className="border p-2 text-right">₹{item.rate.toFixed(2)}</td>
                                        <td className="border p-2 text-right">₹{item.amount.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end mb-4 text-sm">
                            <div className="w-52">
                                <div className="flex justify-between mb-1">
                                    <span>Subtotal:</span>
                                    <span>{billData.subtotalFormatted}</span>
                                </div>
                                <div className="flex justify-between font-bold border-t pt-1 text-base">
                                    <span>Total:</span>
                                    <span>{billData.totalFormatted}</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-center mt-6 text-xs text-zinc-400">
                            Thank you for your business!
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}