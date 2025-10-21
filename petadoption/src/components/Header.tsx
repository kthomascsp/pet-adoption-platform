import Link from "next/link";

const Header = () => {
    return ( 
        <header className="bg-blue-400 p-4 justify-evenly items-center font-semibold">
            <h1 className="flex justify-evenly text-6xl m-4 p-4">
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
}
 
export default Header;