import Image from 'next/image';
import React from 'react';

const AboutUs = () => {
    return (
        <section className="mt-24 text-white px-6 py-12 mb-10 max-w-7xl mx-auto">
            <h2 className="text-3xl font-semibold mb-8 text-center">Welcome to Venus Sports Arena - Indore&apos;s Premier Sporting Destination</h2>

            <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
                <Image width={100} height={100} src="/9.webp" alt="Indoor Football Turf" className="w-full md:w-1/2 max-h-[60vh] object-contain rounded-lg shadow-lg" />
                <div className="md:w-1/2">
                    <h3 className="text-primary text-xl font-semibold mb-4">At Venus Sports Arena, we believe that sports is more than just a game</h3>
                    <p className="text-zinc-200 leading-relaxed">
                        It&apos;s a passion that fuels dreams, a lifestyle that promotes health and discipline, and a powerful force that unites people across all backgrounds. Our mission goes beyond providing a place to play - we&apos;ve built Indore&apos;s ultimate sports hub, a dynamic space where athletes strive for excellence, enthusiasts choose their goals, professionals refine their skills, and families bond over shared experiences. It&apos;s a place where the spirit of the game lives in every corner, creating a vibrant community driven by energy, excitement, and endless possibilities.
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-10 mb-16 mt-32">
                <div className="md:w-1/2">
                    <h3 className="text-primary text-lg font-semibold mb-4">Where Passion Meets Excellence</h3>
                    <p className="text-zinc-200 mb-6">
                        Every inch of Venus Sports Arena is built to inspire performance. Whether you&apos;re a beginner or a seasoned player, we offer the ideal space to grow your skills, connect with like-minded people, and embrace the joy of sports.
                    </p>
                    <div className="flex items-start gap-6">
                        <Image width={106} height={110} src="/15.webp" alt="Players Playing Indoor Sports" className="w-24 rounded-lg shadow" />
                        <blockquote className="border-l-4 border-primary pl-4 italic text-zinc-200">
                            From our internationally certified football turf and professionally maintained cricket grounds to Indore&apos;s first padelball courts and premium pickleball arenas
                        </blockquote>
                    </div>
                    <div className="mt-4 text-primary text-xl">★★★★★</div>
                </div>
                <div className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-zinc-900 border rounded-md p-5">
                        <h4 className="text-primary font-semibold mb-2">Cultivating Community</h4>
                        <p className="text-zinc-200 text-sm">Bringing together players of all ages and skill levels to connect, grow, and thrive through the shared love of sports.</p>
                    </div>
                    <div className="bg-zinc-900 border rounded-md p-5">
                        <h4 className="text-primary font-semibold mb-2">Expanding Access</h4>
                        <p className="text-zinc-200 text-sm">Making premium, world-class sports infrastructure accessible and affordable to everyone - from aspiring athletes to everyday enthusiasts.</p>
                    </div>
                    <div className="bg-zinc-900 border rounded-md p-5">
                        <h4 className="text-primary font-semibold mb-2">Empowering the Next Generation</h4>
                        <p className="text-zinc-200 text-sm">Inspiring youth through sports by providing a safe, inclusive, and motivating environment that encourages learning, discipline, and leadership.</p>
                    </div>
                    <div className="bg-zinc-900 border rounded-md p-5">
                        <h4 className="text-primary font-semibold mb-2">Elevating Sports Culture in Indore</h4>
                        <p className="text-zinc-200 text-sm">Setting new standards for sporting excellence in the city by hosting events, promoting emerging sports, and supporting talent development at every level.</p>
                    </div>
                </div>
            </div>

            <div className="p-8 text-center">
                <h3 className="text-2xl font-semibold mb-4">Our Vision: <span className="text-primary">Shaping the Future of Sports</span></h3>
                <p className="text-zinc-400 mb-8">Were driven by two core principles:</p>
                <div className="flex flex-col md:flex-row justify-center gap-10 max-w-4xl mx-auto">
                    <div className="bg-zinc-900 border rounded-md px-6 py-5 text-left flex-1">
                        <h4 className="text-primary font-semibold mb-3">01 Cultivating Community</h4>
                        <p className="text-zinc-200 text-sm">
                            Bringing together players of all levels through the love of the game - from beginners finding their footing to pros chasing excellence, Venus Sports Arena is where passion, practice, & performance come together on every court.
                        </p>
                    </div>
                    <div className="bg-zinc-900 border rounded-md px-6 py-5 text-left flex-1">
                        <h4 className="text-primary font-semibold mb-3">02 Expanding Access</h4>
                        <p className="text-zinc-200 text-sm">
                            We&apos;re breaking barriers by making world-class sports facilities available to everyone, ensuring that every player—regardless of age, skill, or background—has a place to play, grow, and shine.
                        </p>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default AboutUs
