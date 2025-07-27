import { Mail, MapPin, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-zinc-900 text-white">
            <div className="h-1 bg-primary"></div>
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    <div className="md:col-span-1">
                        <div className="mb-6">
                            <div className="text-white text-2xl font-bold">
                                <Image src='/primary_logo.svg' height={180} width={180} className='hue-rotate-135' alt='logo' />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1">
                        <h3 className="text-white text-lg font-semibold mb-6 uppercase tracking-wide">
                            Quick Links
                        </h3>
                        <nav className="space-y-3">
                            <Link href="/" className="block text-zinc-300 hover:text-primary transition-colors duration-200 underline underline-offset-4">
                                Home
                            </Link>
                            <Link href="/aboutus" className="block text-zinc-300 hover:text-primary transition-colors duration-200 underline underline-offset-4">
                                About
                            </Link>
                            <Link href="contactus" className="block text-zinc-300 hover:text-primary transition-colors duration-200 underline underline-offset-4">
                                Contact
                            </Link>
                        </nav>
                    </div>

                    <div className="md:col-span-1">
                        <h3 className="text-white text-lg font-semibold mb-6 uppercase tracking-wide">
                            Quick Links
                        </h3>
                        <nav className="space-y-3">
                            <Link href="/blog" className="block text-zinc-300 hover:text-primary transition-colors duration-200">
                                Blogs
                            </Link>
                            <Link href="/privacypolicy" className="block text-zinc-300 hover:text-primary transition-colors duration-200">
                                Privacy Policy
                            </Link>
                            <Link href="/termsandconditions" className="block text-zinc-300 hover:text-primary transition-colors duration-200">
                                Terms & Conditions
                            </Link>
                        </nav>
                    </div>

                    <div className="md:col-span-1">
                        <h3 className="text-white text-lg font-semibold mb-6 uppercase tracking-wide">
                            Get In Touch
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <span className="text-zinc-300 text-sm">Indore, India</span>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <a href="mailto:info@venussportsarena.com" className="text-zinc-300 text-sm hover:text-primary transition-colors duration-200">
                                    info@venussportsarena.com
                                </a>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                <a href="tel:+919981011811" className="text-zinc-300 text-sm hover:text-primary transition-colors duration-200">
                                    +91 99810 11811
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-zinc-800">
                    <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0">
                        <div className="text-zinc-400 text-sm">
                            Copyright @2025 Venus Sports Arena All rights reserved {' '}
                            <a href="https://kmportfolio.vercel.app/" target='_blank' className="text-white hover:text-primary transition-colors duration-200">
                                Kartik Mishra
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
