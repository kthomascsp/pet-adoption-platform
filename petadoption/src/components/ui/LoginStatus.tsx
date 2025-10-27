"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { FiUser, FiHome } from "react-icons/fi"; // Person and shelter icons
import { createClient } from "@/utils/supabase/client";

interface LoginStatusProps {
    user: any; // Supabase user object or null
    displayName: string; // Display name from Profile table
    profileType?: string; // 'adopter' or 'shelter'
}

export default function LoginStatus({
                                        user,
                                        displayName,
                                        profileType = "adopter",
                                    }: LoginStatusProps) {
    const pathname = usePathname();
    const router = useRouter();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [closing, setClosing] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Close dropdown if clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setClosing(true);
                setTimeout(() => {
                    setDropdownOpen(false);
                    setClosing(false);
                }, 200);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Hide login button on login page
    if (!user && pathname === "/login") return null;

    return (
        <div className="relative flex items-center space-x-2">
            {user ? (
                <>
                    {/* Avatar + Name clickable area */}
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center space-x-2 cursor-pointer focus:outline-none"
                    >
                        <div className="flex items-center space-x-2">
                            {/* Avatar circle */}
                            <div className="w-8 h-8 rounded-full bg-white text-blue-500 flex items-center justify-center">
                                {profileType === "shelter" ? (
                                    <FiHome className="w-5 h-5" />
                                ) : (
                                    <FiUser className="w-5 h-5" />
                                )}
                            </div>
                            <span className="opacity-90">{displayName}</span>
                        </div>
                    </button>

                    {/* Dropdown menu */}
                    {dropdownOpen && (
                        <div
                            ref={dropdownRef}
                            className={`absolute right-0 top-full mt-4 min-w-[10rem] w-max bg-blue-500 text-white rounded-lg border border-blue-300/30 shadow-xl overflow-hidden z-50
                transition-all duration-200 ease-out
                ${closing ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"}
              `}
                        >
                            <Link
                                href="/profile"
                                className="block px-4 py-2 hover:bg-blue-600 transition-colors"
                                onClick={() => setDropdownOpen(false)}
                            >
                                View Profile
                            </Link>
                            <form action="/auth/signout" method="post">
                                <button
                                    type="submit"
                                    className="w-full text-left px-4 py-2 hover:bg-blue-600 transition-colors"
                                >
                                    Log Out
                                </button>
                            </form>
                        </div>
                    )}
                </>
            ) : (
                <Link
                    href="/login"
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                >
                    Login / Sign Up
                </Link>
            )}
        </div>
    );
}
