'use client';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
    const pathname = usePathname();

    const linkClass = (path: string) =>
        `text-sm transition-colors ${(
            path === '/'
                ? pathname === path
                : pathname.startsWith(path)
        )
            ? 'text-white font-semibold underline underline-offset-4'
            : 'text-zinc-400 hover:text-white'
        }`;

    return (
        <div className='flex w-full fixed h-14 bg-zinc-900 z-[999] border-b justify-between items-center px-12'>
            <Link href='/'>
                <Image src='/logo.svg' height={100} className='invert' width={100} alt='logo' />
            </Link>
            <nav className='space-x-6'>
                <Link className={linkClass('/')} href='/'>Home</Link>
                <Link className={linkClass('/dashboard')} href='/dashboard/turf'>Dashboard</Link>
            </nav>
            <div className=""></div>
        </div>
    );
}
