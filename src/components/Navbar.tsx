'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Button } from './ui/button';
import { Power, Menu, X } from 'lucide-react';
import { logout } from '@/lib/auth';

interface NavbarProps {
    isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    const linkClass = (path: string) =>
        `block px-2 py-1 rounded text-sm transition-colors ${(path === '/'
            ? pathname === path
            : pathname.startsWith(path))
            ? 'text-white font-semibold underline underline-offset-4'
            : 'text-zinc-400 hover:text-primary'
        }`;

    // Nav Links, easy to map for both desktop & mobile
    const navLinks = [
        { label: 'Home', href: '/' },
        { label: 'About us', href: '/aboutus' },
        { label: 'Contact us', href: '/contactus' },
        { label: 'Blog', href: '/blog' },
        { label: 'Dashboard', href: '/dashboard/turf' },
    ];

    return (
        <header className="bg-zinc-900 border-b-4 border-primary fixed w-full h-18 z-[999] top-0 left-0">
            <div className="flex justify-between items-center h-18 px-4 md:px-12 relative">
                {/* Logo */}
                <Link href='/'>
                    <Image src='/monogram_logo.svg' height={30} width={30} className='hue-rotate-135' alt='logo' />
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex space-x-6">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href} className={linkClass(link.href)}>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Auth */}
                <div className="hidden md:flex gap-4 items-center">
                    {!isLoggedIn && (
                        <Link href='/login/user'>
                            <Button size='sm' className='text-zinc-50 cursor-pointer'>Login</Button>
                        </Link>
                    )}
                    {isLoggedIn && (
                        <button className='cursor-pointer' onClick={async () => { await logout(); location.reload() }}>
                            <Power className='w-5.5 text-red-400' />
                        </button>
                    )}
                </div>

                {/* Mobile hamburger menu button */}
                <button
                    className="flex md:hidden z-[1001] ml-2 p-2 rounded ring-0"
                    aria-label={menuOpen ? "Close Menu" : "Open Menu"}
                    onClick={() => setMenuOpen(val => !val)}
                >
                    {menuOpen ? <X className="w-7 h-7 text-white" /> : <Menu className="w-7 h-7 text-white" />}
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            <div
                className={`
          fixed md:hidden top-0 left-0 w-full bg-zinc-900 border-b-4 border-primary z-[1000]
          transition-transform duration-200 ease-in-out
          ${menuOpen ? 'translate-y-0' : '-translate-y-[120%]'}
        `}
            >
                <div className="flex flex-col pt-20 pb-8 px-6 gap-3">
                    {navLinks.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={linkClass(link.href)}
                            onClick={() => setMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="mt-2">
                        {!isLoggedIn && (
                            <Link href='/login/user' onClick={() => setMenuOpen(false)}>
                                <Button size='sm' className='text-zinc-50 w-full'>Login</Button>
                            </Link>
                        )}
                        {isLoggedIn && (
                            <button
                                className='w-full flex items-center gap-2 justify-center text-left text-red-400 py-2 mt-2'
                                onClick={async () => { await logout(); location.reload(); setMenuOpen(false); }}
                            >
                                <Power className='w-5.5' />
                                <span>Logout</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}