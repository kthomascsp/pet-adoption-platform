const Footer = () => {
    return ( 
        <footer className="bg-blue-400 p-6 mt-10">
            <div className="max-w-6xl mx-auto px-4 flex flex-col justify-between items-center">
                <p className="text-sm">&copy; 2025 Pet Adoption. All rights reserved.</p>
                <div className="flex gap-4 mt-4">
                    <a href="https://facebook.com" target="_blank">Facebook</a>
                    <a href="https://twitter.com" target="_blank">Twitter</a>
                    <a href="https://instagram.com" target="_blank">Instagram</a>
                </div>
            </div>
        </footer>
     );
}
 
export default Footer;