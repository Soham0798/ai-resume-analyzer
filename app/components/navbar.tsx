import { useState, useEffect } from 'react';
import { Link } from 'react-router';

const NavList = () => {
    return (
        <ul className="nav-links">
            <li>
                <Link to="/" className="nav-link">Home</Link>
            </li>
        </ul>
    );
};

const Navbar = () => {
    const [openNav, setOpenNav] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 960) setOpenNav(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/">
                    <p className="text-2xl font-bold text-gradient">Resume Analyze</p>
                </Link>
                <div className="nav-desktop">
                    <NavList />
                    <Link to="/upload" className="primary-button w-fit text-sm">
                        Upload Resume
                    </Link>
                </div>
                <button
                    className="nav-hamburger"
                    onClick={() => setOpenNav(!openNav)}
                    aria-label="Toggle navigation"
                >
                    {openNav ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    )}
                </button>
            </div>
            <div className={`nav-collapse ${openNav ? 'nav-collapse-open' : ''}`}>
                <NavList />
                <Link to="/upload" className="primary-button w-full text-sm text-center mt-2">
                    Upload Resume
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;