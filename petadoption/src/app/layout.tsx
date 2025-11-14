/**
 * This is the root layout component for the Next.js application.
 * It defines the global structure of every page, including:
 *  - Global font setup (Geist and Geist Mono)
 *  - Common layout elements (Header, Footer)
 *  - Authentication context provider (AuthProvider)
 *  - Global CSS and metadata
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

// Load Geist Sans and Geist Mono fonts from Google Fonts
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// Global metadata for the app
export const metadata: Metadata = {
    title: "Pet Adoption Platform",
    description: "A place where pets find loving homes",
};

/**
 * RootLayout wraps all pages and components.
 * It applies consistent layout structure and global providers.
 */
export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        {/* Body includes fonts, layout, and global styling */}
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        >
        {/* AuthProvider makes authentication state available throughout the app */}
        <AuthProvider>
            <Header />
            {/* Main content grows to fill available space between header and footer */}
            <main className="flex-grow">{children}</main>
            <Footer />
        </AuthProvider>
        </body>
        </html>
    );
}
