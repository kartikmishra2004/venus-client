'use client'
import React, { useState, useEffect } from 'react';
import { Plus, Search, Calendar, Clock, Edit, Trash2, Users, LandPlot } from 'lucide-react';
import Scheduler from '../Scheduler';
import UpdatePayment from './UpdatePayment';
import SidebarMobileOpenButton from '../SidebarMobileOpenButton';

interface TurfBooking {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    paymentMode: 'cash' | 'upi';
    bookingType: 'turf-wise' | 'bulk';
    teamName: string;
    advanceAmount: number;
    pendingAmount?: number;
    totalAmount?: number;
    bookingDate: string;
    startTime: string;
    endTime: string;
    hours?: number;
    bookingDuration?: string;
    turfSize?: '10000' | '6500';
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
    createdBy: string;
    createdAt: string;
    bulkPricePerHour?: number; // New field for bulk
}

type FormDataType = {
    fullName: string;
    email: string;
    phone: string;
    paymentMode: 'cash' | 'upi';
    bookingType: 'turf-wise' | 'bulk';
    teamName: string;
    advanceAmount: number;
    pendingAmount: number;
    totalAmount: number;
    bulkPricePerHour?: number; // New field for bulk
    bookingDate: string;
    startTime: string;
    endTime: string;
    hours: number;
    bookingDuration: string;
    turfSize: '10000' | '6500';
    createdBy: string;
};

interface TurfBookingProps {
    sessionId: string;
}

const TurfBooking: React.FC<TurfBookingProps> = ({ sessionId }) => {
    const [bookings, setBookings] = useState<TurfBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setbookingoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'turf-wise' | 'bulk' | string>('all');
    const [filterStatus, setFilterStatus] = useState<'confirmed' | 'paid' | 'all' | string>('all');
    const [bookingId, setBookingId] = useState('');

    const [formData, setFormData] = useState<FormDataType>({
        fullName: '',
        email: '',
        phone: '',
        paymentMode: 'cash' as 'cash' | 'upi',
        bookingType: 'turf-wise' as 'turf-wise' | 'bulk',
        teamName: '',
        advanceAmount: 0,
        pendingAmount: 0,
        totalAmount: 0,
        bulkPricePerHour: undefined, // new field
        bookingDate: '',
        startTime: '',
        endTime: '',
        hours: 1,
        bookingDuration: '',
        turfSize: '10000' as '10000' | '6500',
        createdBy: 'Staff'
    });

    const today = new Date().toISOString().split("T")[0];
    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
                headers: {
                    'Authorization': `Bearer ${sessionId}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setBookings(data.data);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to calculate hours
    const calculateHours = (startTime: string, endTime: string) => {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    };

    // Calculate total amount
    const calculateTotal = (bookingType: string, hours: number, turfSize?: string, bulkPricePerHour?: number) => {
        if (bookingType === 'bulk') {
            return bulkPricePerHour && hours ? hours * bulkPricePerHour : 0;
        } else {
            return hours * (turfSize === '10000' ? 3000 : 2000);
        }
    };

    // Enhanced form change handler
    const handleFormChange = (field: keyof typeof formData, value: string | number) => {
        // eslint-disable-next-line prefer-const
        let newForm = { ...formData, [field]: value };

        // Live-calculate hours, totalAmount, pending if relevant fields updated
        if (
            field === 'startTime' ||
            field === 'endTime' ||
            field === 'bookingType' ||
            field === 'turfSize' ||
            field === 'advanceAmount' ||
            field === 'bulkPricePerHour'
        ) {
            if (newForm.startTime && newForm.endTime) {
                const hours = calculateHours(newForm.startTime, newForm.endTime);
                newForm.hours = hours;

                const totalAmount = calculateTotal(
                    newForm.bookingType,
                    hours,
                    newForm.turfSize,
                    newForm.bookingType === 'bulk' ? Number(newForm.bulkPricePerHour) : undefined
                );
                newForm.totalAmount = totalAmount;
                newForm.pendingAmount = Math.max(totalAmount - Number(newForm.advanceAmount), 0);
                newForm.bookingDuration = `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
            } else {
                newForm.totalAmount = 0;
                newForm.pendingAmount = 0;
                newForm.hours = 1;
                newForm.bookingDuration = '';
            }
        }

        if (field === 'advanceAmount') {
            newForm.pendingAmount = Math.max(newForm.totalAmount - Number(value), 0);
        }

        setFormData(newForm);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setbookingoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionId}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (data.success) {
                fetchBookings();
                setShowForm(false);
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    paymentMode: 'cash',
                    bookingType: 'turf-wise',
                    teamName: '',
                    advanceAmount: 0,
                    pendingAmount: 0,
                    totalAmount: 0,
                    bulkPricePerHour: undefined,
                    bookingDate: '',
                    startTime: '',
                    endTime: '',
                    hours: 1,
                    bookingDuration: '',
                    turfSize: '10000',
                    createdBy: 'Staff'
                });
                setbookingoading(false)
            }
        } catch (error) {
            console.error('Error creating booking:', error);
        }
    };

    const deleteBooking = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${sessionId}`,
                    },
                });

                if (response.ok) {
                    fetchBookings();
                }
            } catch (error) {
                console.error('Error deleting booking:', error);
            }
        }
    };

    const handleUpdatePayment = (id: string) => {
        setBookingId(id)
        setShowModal(true);
    }

    // For displaying table/calculations
    const calculateTotalAmount = (startTime: string, endTime: string, bookingType: string, turfSize?: string, bulkPricePerHour?: number) => {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

        if (bookingType === 'bulk') {
            return bulkPricePerHour ? hours * bulkPricePerHour : 0;
        } else {
            return hours * (turfSize === '10000' ? 3000 : 2000);
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.phone.includes(searchTerm) ||
            booking.teamName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || booking.bookingType === filterType;

        const totalAmount = calculateTotalAmount(
            booking.startTime,
            booking.endTime,
            booking.bookingType,
            booking.turfSize,
            booking.bulkPricePerHour
        );
        const pendingAmount = totalAmount - booking.advanceAmount;

        let matchesStatus = true;
        if (filterStatus === 'confirmed') {
            matchesStatus = pendingAmount !== 0;
        } else if (filterStatus === 'paid') {
            matchesStatus = pendingAmount === 0;
        }
        return matchesSearch && matchesType && matchesStatus;
    });

    return (
        <div className="space-y-4 w-full md:mt-0 mt-12">
            <div className="flex md:flex-row flex-col md:gap-0 gap-4 md:items-center justify-between">
                <div>
                    <SidebarMobileOpenButton />
                    <h1 className="md:text-2xl text-lg font-bold text-gray-900 dark:text-zinc-100">Turf Bookings</h1>
                    <p className="md:text-sm text-xs text-gray-600 dark:text-zinc-400 md:mt-1">Manage turf bookings and reservations</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center w-max px-4 py-2 bg-primary text-white md:text-sm text-xs font-medium rounded-lg hover:bg-primary/80 cursor-pointer transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2 md:block hidden" />
                    New Booking
                </button>
            </div>
            {bookings && loading ? (
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border">
                    <div className="p-8 h-[76vh] flex justify-center items-center text-center">
                        <div className="w-8 h-8 border-t-2 border-zinc-300 rounded-full animate-spin" />
                    </div>
                </div>
            ) : (
                <Scheduler setFormData={setFormData} formData={formData} setShowForm={setShowForm} bookings={bookings} />
            )}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm border">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterType(e.target.value)}
                        className="px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    >
                        <option value="all">All Types</option>
                        <option value="turf-wise">Turf-wise</option>
                        <option value="bulk">Bulk</option>
                    </select>
                    <select
                        value={filterStatus}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                    >
                        <option value="all">All Status</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="paid">Paid</option>
                    </select>
                    <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                        Total: {filteredBookings.length} bookings
                    </div>
                </div>
            </div>
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border">
                {loading ? (
                    <div className="p-8 h-[60vh] flex justify-center items-center text-center">
                        <div className="w-8 h-8 border-t-2 border-zinc-300 rounded-full animate-spin" />
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="p-8 h-[60vh] flex justify-center items-center flex-col text-center">
                        <LandPlot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <div className="text-gray-500 dark:text-gray-400">No bookings found</div>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg">
                        <table className="md:w-full w-[270vw]">
                            <thead className="bg-gray-50 dark:bg-zinc-800 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Booking Details</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Schedule</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {filteredBookings.map((booking) => {
                                    const totalAmount = calculateTotalAmount(
                                        booking.startTime,
                                        booking.endTime,
                                        booking.bookingType,
                                        booking.turfSize,
                                        booking.bulkPricePerHour
                                    );
                                    const pendingAmount = totalAmount - booking.advanceAmount;
                                    return (
                                        <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                            <td className="px-4 py-3">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-zinc-200">{booking.fullName}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{booking.phone}</div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">{booking.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <div className="text-sm text-gray-900 dark:text-zinc-200 flex items-center">
                                                        <Users className="w-3 h-3 mr-1" />
                                                        {booking.teamName}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-zinc-400 capitalize">
                                                        {booking.bookingType} {booking.turfSize && `(${booking.turfSize} sqft)`}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-zinc-400 capitalize">
                                                        {booking.paymentMode}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <div className="text-sm text-gray-900 dark:text-zinc-200 flex items-center">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {new Date(booking.bookingDate).toLocaleDateString('en-GB', {
                                                            day: '2-digit',
                                                            month: 'long',
                                                            year: 'numeric',
                                                        })}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-zinc-400 flex items-center">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {booking.startTime} - {booking.endTime}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div>
                                                    <div className="text-sm text-gray-900 dark:text-zinc-200 flex items-center">
                                                        ₹{booking.advanceAmount.toFixed(2)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-zinc-400">
                                                        Pending: ₹{pendingAmount.toFixed(2)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-zinc-400">
                                                        Total: ₹{totalAmount.toFixed(2)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                {booking.pendingAmount === 0 ? (
                                                    <span className='text-xs text-primary bg-green-950 px-3 py-0.5 rounded-lg'>
                                                        paid
                                                    </span>
                                                ) : (
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-primary dark:bg-green-900/30 dark:text-primary' :
                                                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                                                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                                                                'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex space-x-2">
                                                    {booking.pendingAmount === 0 ? (null) : (
                                                        <button onClick={() => handleUpdatePayment(booking._id)} className="p-1 text-gray-400 hover:text-primary transition-colors">
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteBooking(booking._id)}
                                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {showForm && (
                <div className="fixed w-full h-screen overflow-y-auto inset-0 bg-zinc-950 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-zinc-200 dark:bg-zinc-900 border rounded-lg max-w-2xl w-full md:mt-14 mt-96 overflow-y-auto">
                        <div className="p-3 border-b">
                            <h2 className="text-md font-semibold text-gray-900 dark:text-white">New Turf Booking</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-800 dark:text-gray-300 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={(e) => handleFormChange('fullName', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => handleFormChange('email', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => handleFormChange('phone', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Team Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.teamName}
                                        onChange={(e) => handleFormChange('teamName', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Payment Mode
                                    </label>
                                    <select
                                        value={formData.paymentMode}
                                        onChange={(e) => handleFormChange('paymentMode', e.target.value as 'cash' | 'upi')}
                                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="upi">UPI</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Booking Type
                                    </label>
                                    <select
                                        value={formData.bookingType}
                                        onChange={(e) => handleFormChange('bookingType', e.target.value as 'turf-wise' | 'bulk')}
                                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                                    >
                                        <option value="turf-wise">Turf-wise</option>
                                        <option value="bulk">Bulk</option>
                                    </select>
                                </div>
                                {formData.bookingType === 'bulk' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Price Per Hour (₹)
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min={0}
                                            value={formData.bulkPricePerHour || ''}
                                            onChange={e => handleFormChange('bulkPricePerHour', Number(e.target.value))}
                                            className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                )}
                                {formData.bookingType === 'turf-wise' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Turf Size
                                        </label>
                                        <select
                                            value={formData.turfSize}
                                            onChange={(e) => handleFormChange('turfSize', e.target.value as '10000' | '6500')}
                                            className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                                        >
                                            <option value="10000">10,000 sqft (₹3,000/hr)</option>
                                            <option value="6500">6,500 sqft (₹2,000/hr)</option>
                                        </select>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Booking Date
                                    </label>
                                    <input
                                        min={today}
                                        type="date"
                                        required
                                        value={formData.bookingDate}
                                        onChange={(e) => handleFormChange('bookingDate', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Start Time
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.startTime}
                                        onChange={(e) => handleFormChange('startTime', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        End Time
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.endTime}
                                        onChange={(e) => handleFormChange('endTime', e.target.value)}
                                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Advance Amount (₹)
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        required
                                        value={formData.advanceAmount}
                                        onChange={(e) => handleFormChange('advanceAmount', Number(e.target.value))}
                                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {formData.totalAmount > 0 && (
                                <div className="mt-4 text-sm text-gray-700 dark:text-zinc-100 p-2 bg-gray-50 dark:bg-zinc-900/40 rounded">
                                    Total for {formData.bookingDuration || ''}: <strong>₹{formData.totalAmount.toFixed(2)}</strong>, Pending: <strong>₹{formData.pendingAmount.toFixed(2)}</strong>
                                </div>
                            )}

                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border rounded-md hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={
                                        !formData.fullName ||
                                        !formData.email ||
                                        !formData.phone ||
                                        !formData.teamName ||
                                        !formData.paymentMode ||
                                        !formData.bookingType ||
                                        (formData.bookingType === 'turf-wise' && !formData.turfSize) ||
                                        (formData.bookingType === 'bulk' && !formData.bulkPricePerHour) ||
                                        !formData.bookingDate ||
                                        !formData.startTime ||
                                        !formData.endTime
                                    }
                                    type="submit"
                                    className="px-4 py-2 text-sm disabled:cursor-not-allowed disabled:bg-zinc-700 font-medium text-white bg-primary rounded-md hover:bg-primary/80 cursor-pointer"
                                >
                                    {
                                        bookingLoading ? "Please wait..." : "Create Booking"
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showModal && <UpdatePayment bookingId={bookingId} setShowModal={setShowModal} />}
        </div>
    );
};

export default TurfBooking;