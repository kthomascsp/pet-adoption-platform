/**
 * The main header component for the Pet Adoption app.
 * It includes:
 *  - A top bar with login/logout status and a test link
 *  - A large centered site title
 *  - A navigation bar with site links
 */

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import LoginStatus from "./ui/LoginStatus";
import { motion } from "framer-motion";

export default function Header() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const onScroll = () => {
            const currentY = window.scrollY;

            // Collapse when scrolling down past 20px
            if (currentY > 20 && currentY > lastScrollY.current) {
                setIsCollapsed(true);
            }

            // Expand when scrolling up by 30px or more
            if (currentY < lastScrollY.current - 30) {
                setIsCollapsed(false);
            }

            // Expand when at the top of page
            if (currentY <= 5) {
                setIsCollapsed(false);
                //lastScrollY.current = 0;
                //return;
            }

            lastScrollY.current = currentY;
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-blue-500 text-white shadow-md">
            {/* Always-visible top bar */}
            <div className="flex justify-between items-center px-4 py-2 bg-blue-600 relative">
                <div className="flex-1" />  {/* pushes LoginStatus to the right */}

                {/* Collapsed Title (centered inside the top bar) */}
                <motion.h1
                    animate={{ opacity: isCollapsed ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute left-1/2 -translate-x-1/2 text-xl font-bold pointer-events-none"
                >
                    Pet Adoption
                </motion.h1>

                {/* Login on the right */}
                <LoginStatus />
            </div>

            {/* EXPANDED HEADER (big title + big nav) */}
            <motion.div
                initial={false}
                animate={{
                    height: isCollapsed ? 0 : "auto",
                    opacity: isCollapsed ? 0 : 1,
                }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden bg-blue-500"
            >
                <h1 className="text-center text-5xl md:text-6xl py-6 font-semibold">
                    Pet Adoption
                </h1>

                <nav className="flex justify-evenly text-2xl py-6 bg-blue-500">
                    <Link href="/">Home</Link>
                    <Link href="/pets">Pets</Link>
                    <Link href="/shelters">Shelter</Link>
                    <Link href="/process">Adoption Process</Link>
                    <Link href="/about">About Us</Link>
                </nav>
            </motion.div>

            {/* COLLAPSED SMALL NAV */}
            <motion.nav
                initial={false}
                animate={{
                    height: isCollapsed ? "2.75rem" : 0,
                    opacity: isCollapsed ? 1 : 0,
                }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden bg-blue-700 text-white text-base flex justify-evenly items-center"
            >
                <Link href="/">Home</Link>
                <Link href="/pets">Pets</Link>
                <Link href="/shelters">Shelter</Link>
                <Link href="/process">Adoption Process</Link>
                <Link href="/about">About Us</Link>
            </motion.nav>
        </header>
    );
}


