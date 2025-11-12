/**
 * The main header component for the Pet Adoption app.
 * It includes:
 *  - A top bar with login/logout status and a test link
 *  - A large centered site title
 *  - A navigation bar with site links
 */

import LoginStatus from "./ui/LoginStatus";
import Link from "next/link";

/**
 * Header component
 * Renders the top navigation area and site title.
 */
export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-blue-400 text-white font-semibold shadow-md">
            {/* Top bar with login/logout and temporary chat link */}
            <div className="flex justify-between items-center p-2 text-sm pr-6 bg-blue-500/90 backdrop-blur-sm">
                <Link href="/chat">Chat Test Page</Link> {/* Temporary test link */}
                <LoginStatus /> {/* Shows user login or logout status */}
            </div>

            {/* Main site title */}
            <h1 className="text-center text-5xl md:text-6xl m-2 md:m-4 p-2 md:p-4">
                Pet Adoption
            </h1>

            {/* Primary navigation links */}
            <nav className="flex justify-evenly text-2xl p-8">
                <Link href="/">Home</Link>
                <Link href="/pets">Pets</Link>
                <Link href="/shelters">Shelter</Link>
                <Link href="/process">Adoption Process</Link>
                <Link href="/about">About Us</Link>
            </nav>
        </header>
    );
}
