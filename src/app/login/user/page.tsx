'use client'
import React from 'react';
import { Clock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function UserLogin() {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="bg-zinc-900 border rounded-lg shadow-lg p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-zinc-800 border rounded-full flex items-center justify-center mb-6">
                        <User className="w-8 h-8 text-zinc-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-300 mb-3">
                        User Login Coming Soon
                    </h1>
                    <p className="text-zinc-500 mb-8 leading-relaxed">
                        We&apos;re working hard to bring you an amazing user login experience.
                        Stay tuned for updates!
                    </p>
                    <div className="inline-flex items-center gap-2 bg-zinc-800 border text-primary px-4 py-2 rounded-full text-sm font-medium mb-8">
                        <Clock className="w-4 h-4" />
                        Coming Soon
                    </div>
                    <Link href={'/login/admin'}>
                        <Button
                            size={'lg'}
                            className="w-full cursor-pointer bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 group"
                        >
                            Go to Admin Login
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}