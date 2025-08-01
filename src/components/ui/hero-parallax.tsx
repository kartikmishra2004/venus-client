"use client";
import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";
import Link from "next/link";
import { Button } from "./button";

const products = [
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/1.webp",
  },
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/2.webp",
  },
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/3.webp",
  },
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/4.webp",
  },
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/5.webp",
  },
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/6.webp",
  },
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/7.webp",
  },
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/8.webp",
  },
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/9.webp",
  },
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/10.webp",
  },
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/11.webp",
  },
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/12.webp",
  },
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/13.webp",
  },
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/14.webp",
  },
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "/15.webp",
  },
];

export const HeroParallax = () => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.3], [-200, 100]),
    springConfig
  );
  return (
    <div
      ref={ref}
      className="min-h-[280vh] md:py-40 py-10 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.thumbnail}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row  mb-20 space-x-20 ">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.thumbnail}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.thumbnail}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl z-10 relative mx-auto py-20 md:py-10 px-4 w-full left-0 top-0">
      <h1 className="text-3xl md:text-5xl font-bold dark:text-zinc-100">
        Welcome to <br /> Venus Sports Arena
      </h1>
      <p className="max-w-2xl md:text-base text-sm md:text-md mt-4 dark:text-zinc-400">
        At Venus Sports Arena, sports is more than just a game — it&apos;s a passion that fuels dreams, a lifestyle that inspires health and discipline, and a powerful force that brings people together. We&apos;re not just a venue; we are Indore&apos;s ultimate sports hub — a vibrant space where athletes strive for excellence, enthusiasts chase their goals, professionals sharpen their skills, and families share unforgettable moments. Every corner of our arena pulses with the spirit of the game, building a community united by energy, excitement, and endless possibilities.
      </p>
      <Link href={'/dashboard/turf'}>
        <Button size={"lg"} className="text-zinc-50 mt-4 mr-3 cursor-pointer">Dashboard</Button>
      </Link>
      <Link href={'/aboutus'}>
        <Button size={"lg"} variant={"outline"} className="text-zinc-50 mt-4 cursor-pointer">Learn more</Button>
      </Link>
    </div>
  );
};

export const ProductCard = ({
  product,
  translate,
}: {
  product: {
    title: string;
    link: string;
    thumbnail: string;
  };
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      key={product.title}
      className="group/product h-96 md:w-[30rem] w-[17rem] rounded-lg overflow-hidden relative shrink-0"
    >
      <div
        className="block group-hover/product:shadow-2xl "
      >
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
      </div>
      <div className="absolute inset-0 h-full w-full opacity-0 bg-black pointer-events-none"></div>
    </motion.div>
  );
};
