/**
 * The main footer component for the Pet Adoption app.
 * Includes:
 *  - Copyright
 *  - Social media links
 */

const Footer = () => {
    return (
        <footer className="bg-blue-400 p-6 mt-10">
            {/* Container for footer content, centered with spacing */}
            <div className="max-w-6xl mx-auto px-4 flex flex-col justify-between items-center">
                {/* Copyright notice */}
                <p className="text-sm">&copy; 2025 Pet Adoption. All rights reserved.</p>

                {/* Social media links */}
                <div className="flex gap-4 mt-4">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        Facebook
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        Twitter
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        Instagram
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
