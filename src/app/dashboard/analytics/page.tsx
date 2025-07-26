'use client';
import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import {
    TrendingUp,
    Users,
    Target,
    PieChart as PieIcon,
    BarChart3,
    Filter,
    IndianRupee,
} from 'lucide-react';

// Type definitions
type Period = 'daily' | 'weekly' | 'monthly';

type PeriodData = {
    totalRevenue: number;
    advanceCollected: number;
    pendingAmount: number;
    totalBookings: number;
    turfRevenue: number;
    piPlayRevenue: number;
    inventoryExpenses: number;
    inventorySales: number;
    inventoryProfit: number;
    netProfit: number;
};

type TurfBookingTypeBreakdown = {
    _id: string;
    totalRevenue: number;
    totalBookings: number;
    averageAmount: number;
};

type PiPlaySportBreakdown = {
    _id: string;
    totalRevenue: number;
    totalBookings: number;
    averageAmount: number;
};

type Breakdowns = {
    turfBookingType: TurfBookingTypeBreakdown[];
    piPlaySport: PiPlaySportBreakdown[];
};

type ApiData = {
    daily: PeriodData;
    weekly: PeriodData;
    monthly: PeriodData;
    breakdowns: Breakdowns;
};

type RevenueComparisonDatum = {
    period: string;
    totalRevenue: number;
    turfRevenue: number;
    piPlayRevenue: number;
    netProfit: number;
};

type PieChartDatum = {
    name: string;
    value: number;
    color: string;
};

type TurfBookingDatum = {
    type: string;
    revenue: number;
    bookings: number;
    average: number;
};

type PiPlaySportDatum = {
    sport: string;
    revenue: number;
    bookings: number;
    average: number;
};

const Analytics: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState<Period>('daily');
    const [data, setData] = useState<ApiData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchRevenue = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/revenue`);
            const data = await response.json();
            if (data.success) {
                setData(data.data)
                setLoading(false)
            }
        } catch (error) {
            console.log("Error fetching revenue!!", error)
        }
    }

    useEffect(() => {
        fetchRevenue()
    }, [])

    const apiData: ApiData = {
        daily: {
            totalRevenue: 107800,
            advanceCollected: 71600,
            pendingAmount: 36200,
            totalBookings: 9,
            turfRevenue: 102200,
            piPlayRevenue: 5600,
            inventoryExpenses: 0,
            inventorySales: 0,
            inventoryProfit: 0,
            netProfit: 107800,
        },
        weekly: {
            totalRevenue: 110800,
            advanceCollected: 73100,
            pendingAmount: 37700,
            totalBookings: 10,
            turfRevenue: 102200,
            piPlayRevenue: 8600,
            inventoryExpenses: 0,
            inventorySales: 0,
            inventoryProfit: 0,
            netProfit: 110800,
        },
        monthly: {
            totalRevenue: 110800,
            advanceCollected: 73100,
            pendingAmount: 37700,
            totalBookings: 10,
            turfRevenue: 102200,
            piPlayRevenue: 8600,
            inventoryExpenses: 0,
            inventorySales: 0,
            inventoryProfit: 0,
            netProfit: 110800,
        },
        breakdowns: {
            turfBookingType: [
                {
                    _id: 'bulk',
                    totalRevenue: 54200,
                    totalBookings: 2,
                    averageAmount: 27100,
                },
                {
                    _id: 'turf-wise',
                    totalRevenue: 48000,
                    totalBookings: 5,
                    averageAmount: 9600,
                },
            ],
            piPlaySport: [
                {
                    _id: 'pickleball',
                    totalRevenue: 5000,
                    totalBookings: 2,
                    averageAmount: 2500,
                },
                {
                    _id: 'padel',
                    totalRevenue: 3600,
                    totalBookings: 1,
                    averageAmount: 3600,
                },
            ],
        },
    };

    const currentData = data ? data[selectedPeriod] : apiData[selectedPeriod];

    // Format currency
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    // Data for revenue comparison chart
    const revenueComparisonData: RevenueComparisonDatum[] = [
        {
            period: 'Daily',
            totalRevenue: apiData.daily.totalRevenue,
            turfRevenue: apiData.daily.turfRevenue,
            piPlayRevenue: apiData.daily.piPlayRevenue,
            netProfit: apiData.daily.netProfit,
        },
        {
            period: 'Weekly',
            totalRevenue: apiData.weekly.totalRevenue,
            turfRevenue: apiData.weekly.turfRevenue,
            piPlayRevenue: apiData.weekly.piPlayRevenue,
            netProfit: apiData.weekly.netProfit,
        },
        {
            period: 'Monthly',
            totalRevenue: apiData.monthly.totalRevenue,
            turfRevenue: apiData.monthly.turfRevenue,
            piPlayRevenue: apiData.monthly.piPlayRevenue,
            netProfit: apiData.monthly.netProfit,
        },
    ];

    // Revenue breakdown pie chart data
    const revenueBreakdownData: PieChartDatum[] = [
        { name: 'Turf Revenue', value: currentData.turfRevenue, color: '#3B82F6' },
        { name: 'PiPlay Revenue', value: currentData.piPlayRevenue, color: '#10B981' },
        { name: 'Inventory Sales', value: currentData.inventorySales, color: '#F59E0B' },
    ];

    // Payment status data
    const paymentStatusData: PieChartDatum[] = [
        { name: 'Advance Collected', value: currentData.advanceCollected, color: '#10B981' },
        { name: 'Pending Amount', value: currentData.pendingAmount, color: '#EF4444' },
    ];

    // Turf booking breakdown
    const turfBookingData: TurfBookingDatum[] = apiData.breakdowns.turfBookingType.map((item) => ({
        type: item._id.charAt(0).toUpperCase() + item._id.slice(1),
        revenue: item.totalRevenue,
        bookings: item.totalBookings,
        average: item.averageAmount,
    }));

    // PiPlay sports breakdown
    const piPlaySportsData: PiPlaySportDatum[] = apiData.breakdowns.piPlaySport.map((item) => ({
        sport: item._id.charAt(0).toUpperCase() + item._id.slice(1),
        revenue: item.totalRevenue,
        bookings: item.totalBookings,
        average: item.averageAmount,
    }));

    if (loading) {
        return (
            <div className="w-full h-screen flex justify-center items-center">
                <div className="w-8 h-8 border-t-2 border-zinc-300 rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 p-6 mt-12">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-zinc-300 mb-2">Revenue Dashboard</h1>
                    <p className="text-zinc-500">Comprehensive overview of your business performance</p>
                </div>
                <div className="bg-zinc-900 border rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Filter className="h-5 w-5 text-gray-300" />
                        <span className="font-medium text-gray-300">Time Period:</span>
                        <div className="flex gap-2">
                            {(['daily', 'weekly', 'monthly'] as Period[]).map((period) => (
                                <button
                                    key={period}
                                    onClick={() => setSelectedPeriod(period)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedPeriod === period
                                        ? 'bg-primary text-white'
                                        : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                                        }`}
                                >
                                    {period.charAt(0).toUpperCase() + period.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-zinc-900 border rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-200">Total Revenue</p>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(currentData.totalRevenue)}</p>
                            </div>
                            <div className="h-12 w-12 bg-zinc-800 border rounded-lg flex items-center justify-center">
                                <IndianRupee className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-200">Net Profit</p>
                                <p className="text-2xl font-bold text-primary">{formatCurrency(currentData.netProfit)}</p>
                            </div>
                            <div className="h-12 w-12 bg-zinc-800 border rounded-lg flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900 border rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-200">Total Bookings</p>
                                <p className="text-2xl font-bold text-zinc-300">{currentData.totalBookings}</p>
                            </div>
                            <div className="h-12 w-12 bg-zinc-800 border rounded-lg flex items-center justify-center">
                                <Users className="h-6 w-6 text-zinc-200" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-zinc-900 border rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-zinc-200">Pending Amount</p>
                                <p className="text-2xl font-bold text-red-400">{formatCurrency(currentData.pendingAmount)}</p>
                            </div>
                            <div className="h-12 w-12 bg-zinc-800 border rounded-lg flex items-center justify-center">
                                <Target className="h-6 w-6 text-red-400" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-900 border rounded-lg shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Revenue Comparison Across Periods
                    </h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueComparisonData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="period" />
                                <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="totalRevenue" fill="#3B82F6" name="Total Revenue" />
                                <Bar dataKey="turfRevenue" fill="#00bc7d" name="Turf Revenue" />
                                <Bar dataKey="piPlayRevenue" fill="#F59E0B" name="PiPlay Revenue" />
                                <Bar dataKey="netProfit" fill="#8B5CF6" name="Net Profit" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-zinc-900 border rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-zinc-300 mb-4 flex items-center gap-2">
                            <PieIcon className="h-5 w-5" />
                            Revenue Breakdown ({selectedPeriod})
                        </h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={revenueBreakdownData.filter((item) => item.value > 0)}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(1)}%`}
                                    >
                                        {revenueBreakdownData
                                            .filter((item) => item.value > 0)
                                            .map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-zinc-900 border rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-zinc-300 mb-4">Payment Status</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={paymentStatusData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(1)}%`}
                                    >
                                        {paymentStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-zinc-900 border rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-zinc-300 mb-4">Turf Booking Types</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={turfBookingData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="type" />
                                    <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    <Bar dataKey="revenue" fill="#3B82F6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {turfBookingData.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-2 px-4 bg-zinc-800 border rounded-lg">
                                    <span className="font-medium">{item.type}</span>
                                    <div className="text-right">
                                        <div className="text-sm text-zinc-400">{item.bookings} bookings</div>
                                        <div className="font-semibold">Avg: {formatCurrency(item.average)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-zinc-900 border rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-zinc-300 mb-4">PiPlay Sports</h2>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={piPlaySportsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="sport" />
                                    <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    <Bar dataKey="revenue" fill="#10B981" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 space-y-2">
                            {piPlaySportsData.map((item, index) => (
                                <div key={index} className="flex justify-between items-center py-2 px-4 border bg-zinc-800 rounded-lg">
                                    <span className="font-medium">{item.sport}</span>
                                    <div className="text-right">
                                        <div className="text-sm text-zinc-400">{item.bookings} bookings</div>
                                        <div className="font-semibold">Avg: {formatCurrency(item.average)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-900 border rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-zinc-200 mb-6">Financial Summary ({selectedPeriod})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <p className="text-sm text-zinc-400">Revenue Sources</p>
                            <p className="text-lg font-semibold">Turf: {formatCurrency(currentData.turfRevenue)}</p>
                            <p className="text-lg font-semibold">PiPlay: {formatCurrency(currentData.piPlayRevenue)}</p>
                            <p className="text-lg font-semibold">Inventory: {formatCurrency(currentData.inventorySales)}</p>
                        </div>
                        <div className="border-l-4 border-primary pl-4">
                            <p className="text-sm text-zinc-400">Collections</p>
                            <p className="text-lg font-semibold text-primary">Advance: {formatCurrency(currentData.advanceCollected)}</p>
                            <p className="text-lg font-semibold text-red-400">Pending: {formatCurrency(currentData.pendingAmount)}</p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4">
                            <p className="text-sm text-zinc-400">Inventory</p>
                            <p className="text-lg font-semibold">Sales: {formatCurrency(currentData.inventorySales)}</p>
                            <p className="text-lg font-semibold">Expenses: {formatCurrency(currentData.inventoryExpenses)}</p>
                            <p className="text-lg font-semibold">Profit: {formatCurrency(currentData.inventoryProfit)}</p>
                        </div>
                        <div className="border-l-4 border-indigo-500 pl-4">
                            <p className="text-sm text-zinc-400">Net Position</p>
                            <p className="text-2xl font-bold text-indigo-500">{formatCurrency(currentData.netProfit)}</p>
                            <p className="text-sm text-zinc-400">Total Net Profit</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
