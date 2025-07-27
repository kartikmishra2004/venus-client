'use client';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Button } from './ui/button';
import { Power } from 'lucide-react';
import { logout } from '@/lib/auth';

interface NavbarProps {
    isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
    const pathname = usePathname();

    const linkClass = (path: string) =>
        `text-sm transition-colors ${(
            path === '/'
                ? pathname === path
                : pathname.startsWith(path)
        )
            ? 'text-white font-semibold underline underline-offset-4'
            : 'text-zinc-400 hover:text-primary'
        }`;

    return (
        <div className='flex w-full fixed h-18 border-b-4 border-primary bg-zinc-900 z-[999] justify-between items-center px-12'>
            <Link href='/'>
                <Image src='/monogram_logo.svg' height={30} width={30} className='hue-rotate-135' alt='logo' />
            </Link>
            <nav className='space-x-8'>
                <Link className={linkClass('/')} href='/'>Home</Link>
                <Link className={linkClass('/aboutus')} href='/aboutus'>About us</Link>
                <Link className={linkClass('/contactus')} href='/contactus'>Contact us</Link>
                <Link className={linkClass('/blog')} href='/blog'>Blog</Link>
                <Link className={linkClass('/dashboard')} href='/dashboard/turf'>Dashboard</Link>
            </nav>
            {!isLoggedIn && (
                <Link href='/login/user'>
                    <Button size='sm' className='text-zinc-50 cursor-pointer'>Login</Button>
                </Link>
            )}
            {isLoggedIn && (
                <button className='cursor-pointer' onClick={async () => {await logout(); location.reload()}}>
                    <Power className='w-5.5 text-red-400' />
                </button>
            )}
        </div>
    );
}