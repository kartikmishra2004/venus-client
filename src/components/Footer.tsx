import { Mail, MapPin, Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-zinc-900 text-white">
            <div className="h-1 bg-primary"></div>
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Logo and Description Section */}
                    <div className="md:col-span-1">
                        <div className="mb-6">
                            {/* Replace this div with your actual logo component */}
                            <div className="text-white text-2xl font-bold">
                                <span className="text-primary">VENUS</span>
                                <div className="text-sm font-normal text-zinc-400">Sports Arena</div>
                            </div>
                        </div>
                        <p className="text-zinc-300 text-sm leading-relaxed">
                            <span className="text-white font-medium">Where champions rise and dreams take flight</span> - Venus Sports Arena
                        </p>
                    </div>

                    {/* Quick Links Section 1 */}
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

                    {/* Quick Links Section 2 */}
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

                    {/* Get In Touch Section */}
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

                {/* Bottom Section */}
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
