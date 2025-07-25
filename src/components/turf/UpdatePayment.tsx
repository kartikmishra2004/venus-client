'use client'
import React, { useEffect, useState } from 'react'

type UpdatePaymentProps = {
    setShowModal: (params: boolean) => void;
    bookingId: string;
};

const UpdatePayment = ({ setShowModal, bookingId }: UpdatePaymentProps) => {
    const [formData, setFormData] = useState({
        additionalPayment: ''
    });
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);

    useEffect(() => {
        fetchBookingById();
    }, [])

    const fetchBookingById = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}`);
            const jsonResp = await response.json();
            setBooking(jsonResp.data || jsonResp);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching booking:', error);
            setLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setUpdateLoading(false)
        if (!booking) return;

        const additionalAmount = Number(formData.additionalPayment);
        const newAdvanceAmount = booking.advanceAmount + additionalAmount;
        const newPendingAmount = booking.pendingAmount - additionalAmount;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${bookingId}/payment`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    advanceAmount: newAdvanceAmount,
                    pendingAmount: newPendingAmount,
                }),
            });

            const data = await response.json();
            console.log(data)
            if (data.success) {
                setShowModal(false);
                setUpdateLoading(false);
            }
        } catch (error) {
            console.error('Error updating payment:', error);
        }
    }

    const handlePaymentChange = (value: string) => {
        const numValue = Number(value);
        if (numValue <= booking?.pendingAmount && numValue >= 0) {
            setFormData({ additionalPayment: value });
        }
    }

    if (loading) {
        return (
            <div className="fixed inset-0 bg-zinc-950 bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="w-8 h-8 border-t-2 border-zinc-300 rounded-full animate-spin" />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="fixed inset-0 bg-zinc-950 bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-zinc-200 dark:bg-zinc-900 border rounded-lg p-6">
                    <div className="text-center text-red-500">Error loading booking data</div>
                </div>
            </div>
        );
    }

    const totalAmount = booking.totalAmount || 9000;
    const advanceAmount = booking.advanceAmount || 4500;
    const pendingAmount = booking.pendingAmount || 4500;
    const paymentPercentage = (advanceAmount / totalAmount) * 100;

    return (
        <div className="fixed inset-0 bg-zinc-950 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-200 dark:bg-zinc-900 border rounded-lg max-w-md w-full max-h-[95vh] overflow-y-auto">
                <div className="p-3 border-b">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Update Payment</h2>
                    <p className="text-xs text-gray-600 dark:text-gray-400">ID: {booking._id?.slice(-8) || bookingId}</p>
                </div>

                <div className="p-3 space-y-3">
                    <div className="bg-gray-50 dark:bg-zinc-800 rounded p-2">
                        <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{booking.fullName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {new Date(booking.bookingDate).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded p-2">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Progress</span>
                            <span className="text-gray-900 dark:text-white font-medium">{paymentPercentage.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                            <div
                                className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                                style={{ width: `${paymentPercentage}%` }}
                            ></div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center p-2 bg-white dark:bg-zinc-800 rounded">
                                <p className="text-gray-600 dark:text-gray-400">Total</p>
                                <p className="font-bold text-gray-900 dark:text-white">₹{totalAmount.toLocaleString()}</p>
                            </div>
                            <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                                <p className="text-gray-600 dark:text-gray-400">Paid</p>
                                <p className="font-bold text-green-600 dark:text-green-400">₹{advanceAmount.toLocaleString()}</p>
                            </div>
                            <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                                <p className="text-gray-600 dark:text-gray-400">Pending</p>
                                <p className="font-bold text-red-600 dark:text-red-400">₹{pendingAmount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-zinc-800 dark:text-gray-300 mb-1">
                                Additional Payment
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    max={pendingAmount}
                                    step="0.01"
                                    value={formData.additionalPayment}
                                    onChange={(e) => handlePaymentChange(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 border rounded text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="0.00"
                                />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Max: ₹{pendingAmount.toLocaleString()}
                            </p>
                        </div>
                        {formData.additionalPayment && Number(formData.additionalPayment) > 0 && (
                            <div className="bg-gray-50 dark:bg-zinc-800 rounded p-2">
                                <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-1">After Update:</h4>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Paid:</span>
                                        <span className="ml-1 font-medium text-green-600 dark:text-green-400">
                                            ₹{(advanceAmount + Number(formData.additionalPayment)).toLocaleString()}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 dark:text-gray-400">Pending:</span>
                                        <span className="ml-1 font-medium text-orange-600 dark:text-orange-400">
                                            ₹{(pendingAmount - Number(formData.additionalPayment)).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end space-x-2 pt-2 border-t">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-800 border rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!formData.additionalPayment || Number(formData.additionalPayment) <= 0}
                                className="px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/80 disabled:bg-zinc-700 disabled:cursor-not-allowed transition-colors"
                            >
                                {updateLoading ? 'Please wait...' : "Update"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpdatePayment