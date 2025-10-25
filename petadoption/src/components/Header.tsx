import { createClient } from "@/utils/supabase/server"; // Supabase server-side client
import LoginStatus from "./ui/LoginStatus"; // Client component for login/logout display

// Header component is a Server Component (async) to fetch user data
const Header = async () => {
    // Initialize Supabase client for server-side requests
    const supabase = createClient();

    // Fetch currently logged-in user (if any)
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Fallback display name to email
    let displayName = user?.email;

    if (user) {
        // Query Profile table for user's display name
        const { data: profile } = await supabase
            .from("Profile")
            .select("ProfileName")
            .eq("ProfileID", user.id) // Match by user ID
            .single(); // Expect a single row

        if (profile?.ProfileName) {
            displayName = profile.ProfileName;
        }
    }

    return (
        // Sticky header container
        <header className="
            sticky        /* Stick to top of viewport */
            top-0         /* Top offset 0 */
            z-50          /* High z-index to stay above content */
            bg-blue-400   /* Background color */
            text-white    /* Text color */
            font-semibold /* Semi-bold font */
            shadow-md     /* Medium drop shadow */
        ">

            {/* 🔹 Top bar: login/logout */}
            <div className="
                flex              /* Flexbox layout */
                justify-end       /* Align items to the right */
                items-center      /* Vertically center items */
                p-2               /* Padding all around 0.5rem */
                text-sm           /* Small text size */
                pr-6              /* Extra right padding 1.5rem */
                bg-blue-500/90    /* Slightly darker blue, 90% opacity */
                backdrop-blur-sm  /* Blur background behind element */
            ">
                {/* Render LoginStatus Client Component */}
                <LoginStatus user={user} displayName={displayName} />
            </div>

            {/* 🔹 Site title */}
            <h1 className="
                text-center   /* Center-align text */
                text-5xl      /* Font size ~3rem on mobile */
                md:text-6xl   /* Font size ~3.75rem on medium screens+ */
                m-2           /* Margin 0.5rem on all sides */
                md:m-4        /* Margin 1rem on medium screens+ */
                p-2           /* Padding 0.5rem */
                md:p-4        /* Padding 1rem on medium screens+ */
            ">
                Pet Adoption
            </h1>
            <nav className="flex justify-evenly text-2xl">
                        <Link href="/" className="hover:bg-blue-600 transition-colors">
                            Home
                        </Link>
                        <Link href="/pets">
                            Pets
                        </Link>
                        <Link href="/">
                        <Link href="/shelters">
                            Shelter
                        </Link>
                        <Link href="/db-test">
                            Adoption Process
                        </Link>
                        <Link href="/pets">
                            About Us
                        </Link>
                        <Link href="/login">
                            Login
                        </Link>
            </nav>
        </header>
    );
};

export default Header; // Export for use in layout/pages
