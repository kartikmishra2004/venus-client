import Link from 'next/link'
import React from 'react'

export default function Navbar() {
    return (
        <div className='flex w-full fixed h-14 bg-zinc-900 z-[999] border-b justify-between items-center px-12'>
            <h1>V</h1>
            <nav className='space-x-6'>
                <Link className='text-sm' href='/'>Home</Link>
                <Link className='text-sm' href='/dashboard/turf'>Dashboard</Link>
            </nav>
            <div className=""></div>
        </div>
    )
}