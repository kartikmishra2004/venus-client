'use client';

import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const linkClass = (path: string) =>
        `text-sm transition-colors ${pathname === path ? 'text-white font-semibold underline underline-offset-4' : 'text-zinc-400 hover:text-white'
        }`;

    return (
        <div className='flex w-full fixed h-14 bg-zinc-900 z-[999] border-b justify-between items-center px-12'>
            <Link href={'/'}>
                <span className="w-8 flex justify-center items-center h-8 rounded-full border border-zinc-600"><h1>V</h1></span>
            </Link>
            <nav className='space-x-6'>
                <Link className={linkClass('/')} href='/'>Home</Link>
                <Link className={linkClass('/dashboard/turf')} href='/dashboard/turf'>Dashboard</Link>
            </nav>
            <div className=""></div>
        </div>
    );
}
