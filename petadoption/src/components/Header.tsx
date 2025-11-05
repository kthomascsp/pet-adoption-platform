import LoginStatus from "./ui/LoginStatus";
import Link from "next/link";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-blue-400 text-white font-semibold shadow-md">
            {/* Top bar: login/logout */}
            <div className="flex justify-end items-center p-2 text-sm pr-6 bg-blue-500/90 backdrop-blur-sm">
                <LoginStatus />
            </div>

            {/* Site title */}
            <h1 className="text-center text-5xl md:text-6xl m-2 md:m-4 p-2 md:p-4">
                Pet Adoption
            </h1>

            {/* Navigation */}
            <nav className="flex justify-evenly text-2xl p-8">
                <Link href="/">Home</Link>
                <Link href="/pets">Pets</Link>
                <Link href="/shelters">Shelter</Link>
                <Link href="/">Adoption Process</Link>
                <Link href="/">About Us</Link>
            </nav>
        </header>
    );
}