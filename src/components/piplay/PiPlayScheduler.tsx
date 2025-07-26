import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Phone, CreditCard, MapPin } from 'lucide-react';

interface PiPlayBooking {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    paymentMode: 'cash' | 'upi';
    teamName: string;
    sportType: string;
    courtNumber: number;
    bookingDuration: string;
    advanceAmount: number;
    pendingAmount: number;
    totalAmount: number;
    bookingDate: string;
    startTime: string;
    endTime: string;
    hours: number;
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | string;
    createdBy: string;
    createdAt: string;
    updatedAt?: string;
}

interface TurfBookingSchedulerProps {
    bookings?: PiPlayBooking[];
}

const PiPlayScheduler: React.FC<TurfBookingSchedulerProps> = ({
    bookings
}) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [selectedBooking, setSelectedBooking] = useState<PiPlayBooking | null>(null);

    const formatTime = (timeString: string): string => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const getBookingColor = (bookingType: PiPlayBooking['sportType']): string => {
        switch (bookingType) {
            case 'padel':
                return 'bg-blue-500';
            case 'pickleball':
                return 'bg-primary';
            default:
                return 'bg-gray-500';
        }
    };

    const getStatusColor = (status: PiPlayBooking['status']): string => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const pad = (num: number) => num.toString().padStart(2, '0');
    const formatDate = (date: Date) =>
        `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

    const getBookingsForDate = (date: Date): PiPlayBooking[] => {
        const dateStr = formatDate(date);
        return bookings?.filter(booking => {
            const bookingDateStr = booking.bookingDate.slice(0, 10);
            return bookingDateStr === dateStr;
        }) || [];
    };

    const generateCalendarDays = (): Date[] => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days: Date[] = [];
        const currentDay = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            days.push(new Date(currentDay));
            currentDay.setDate(currentDay.getDate() + 1);
        }

        return days;
    };

    const calendarDays = useMemo(generateCalendarDays, [currentDate]);

    const monthNames: string[] = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const navigateMonth = (direction: number): void => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const goToToday = (): void => {
        setCurrentDate(new Date());
    };

    const isToday = (date: Date): boolean => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isCurrentMonth = (date: Date): boolean => {
        return date.getMonth() === currentDate.getMonth();
    };

    const handleBookingClick = (booking: PiPlayBooking): void => {
        setSelectedBooking(booking);
    };

    const closeModal = (): void => {
        setSelectedBooking(null);
    };

    const handleModalBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <div className="bg-zinc-900 rounded-lg border p-4 text-xs">
            <div className="max-w-6xl mx-auto">
                <div className="rounded-lg shadow-sm px-3 mb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3 text-zinc-300" />
                                <span className="text-zinc-300">
                                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            <button
                                onClick={() => navigateMonth(-1)}
                                className="p-1 hover:bg-zinc-700 cursor-pointer rounded-lg transition-colors"
                                aria-label="Previous month"
                            >
                                <ChevronLeft className="w-3 h-3 text-zinc-400" />
                            </button>
                            <button
                                onClick={goToToday}
                                className="px-2 py-1 bg-primary text-white rounded-lg hover:bg-primary/80 cursor-pointer transition-colors text-xs"
                            >
                                Today
                            </button>
                            <button
                                onClick={() => navigateMonth(1)}
                                className="p-1 hover:bg-zinc-700 cursor-pointer rounded-lg transition-colors"
                                aria-label="Next month"
                            >
                                <ChevronRight className="w-3 h-3 text-zinc-400" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-zinc-800 rounded-lg shadow-sm border overflow-hidden">
                    <div className="grid grid-cols-7 bg-zinc-900 border-b">
                        {dayNames.map(day => (
                            <div key={day} className="p-2 text-center font-semibold text-zinc-200 border-r last:border-r-0 text-xs">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7">
                        {calendarDays.map((day, index) => {
                            const dayBookings = getBookingsForDate(day);
                            return (
                                <div
                                    key={`${day.getTime()}-${index}`}
                                    className={`min-h-16 border-r border-b last:border-r-0 p-1.5 ${!isCurrentMonth(day) ? 'bg-zinc-700' : 'bg-zinc-800'
                                        } ${isToday(day) ? 'bg-blue-50' : ''}`}
                                >
                                    <div className={`text-xs font-medium mb-1 ${isToday(day) ? 'text-primary' :
                                        !isCurrentMonth(day) ? 'text-gray-400' : 'text-zinc-200'
                                        }`}>
                                        {day.getDate()}
                                    </div>
                                    <div className="space-y-0.5">
                                        {dayBookings.map(booking => (
                                            <div
                                                key={booking._id}
                                                onClick={() => handleBookingClick(booking)}
                                                className={`${getBookingColor(booking.sportType)} text-white text-[10px] p-1 rounded cursor-pointer hover:opacity-80 transition-opacity`}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        handleBookingClick(booking);
                                                    }
                                                }}
                                            >
                                                <div className="font-medium truncate">{booking.teamName}</div>
                                                <div className="flex items-center space-x-0.5">
                                                    <Clock className="w-2 h-2" />
                                                    <span>{formatTime(booking.startTime)}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="mt-3 rounded-lg shadow-sm p-2">
                    <h3 className="text-xs font-semibold text-zinc-200 mb-1.5">Booking Types</h3>
                    <div className="flex space-x-4">
                        <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-blue-500 rounded"></div>
                            <span className="text-xs text-zinc-300">Padel</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-primary rounded"></div>
                            <span className="text-xs text-zinc-300">Pickleball</span>
                        </div>
                    </div>
                </div>
            </div>
            {selectedBooking && (
                <div className="fixed inset-0 bg-zinc-950 bg-opacity-50 flex items-center justify-center p-1 z-50"
                    onClick={handleModalBackdropClick}
                >
                    <div className="bg-zinc-900 border rounded-lg shadow-xl max-w-md w-full overflow-y-auto">
                        <div className="p-3">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-base font-semibold text-gray-900">Booking Details</h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                                    aria-label="Close modal"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <div className="font-medium truncate">{selectedBooking.fullName}</div>
                                        <div className="text-xs text-zinc-400 truncate">{selectedBooking.teamName}</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <div className="text-xs text-zinc-200">{selectedBooking.phone}</div>
                                        <div className="text-[10px] text-gray-500 truncate">{selectedBooking.email}</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                                    <div>
                                        <div className="text-xs text-zinc-200">
                                            {formatTime(selectedBooking.startTime)} - {formatTime(selectedBooking.endTime)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                                    <div>
                                        <div className="text-xs text-zinc-200">
                                            Sport type:
                                        </div>
                                        <div className="text-[10px] text-gray-500 capitalize">
                                            {selectedBooking.sportType}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MapPin className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                                    <div>
                                        <div className="text-xs text-zinc-200">
                                            Court number
                                        </div>
                                        <div className="text-[10px] text-gray-500 capitalize">
                                            #{selectedBooking.courtNumber ? selectedBooking.courtNumber : '-'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <div>
                                        <div className="text-xs">
                                            Advance: {formatCurrency(selectedBooking.advanceAmount)}
                                        </div>
                                        <div className="text-xs">
                                            Pending: {selectedBooking.pendingAmount !== undefined ? formatCurrency(selectedBooking.pendingAmount) : '-'}
                                        </div>
                                        <div className="text-[10px] text-gray-500 capitalize">
                                            Payment Mode: {selectedBooking.paymentMode}
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-1 border-t border-gray-400">
                                    <div className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${getStatusColor(selectedBooking.status)}`}>
                                        {selectedBooking.status.toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PiPlayScheduler;