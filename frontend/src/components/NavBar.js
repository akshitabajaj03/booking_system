import { Link } from 'react-router-dom';
import AuthContext from '../store/AuthContext';
import React, { useContext, useState } from "react";

const Navbar = () => {
    const authCtx = useContext(AuthContext)
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="bg-indigo-600 text-white relative">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="text-lg font-bold">Ticket Reservation</div>
                {authCtx.isLoggedIn && <><div className="hidden md:flex space-x-6">
                    <Link to='/' className="hover:text-indigo-300" >Home</Link>
                    <Link to='/profile' className="hover:text-indigo-300">My Bookings</Link>
                </div>
                    <button
                        className="md:hidden flex items-center text-white focus:outline-none"
                        aria-label="Toggle navigation"
                        onClick={toggleMenu}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                            ></path>
                        </svg>
                    </button></>}
            </div>
            {isMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-indigo-700 z-10" onClick={toggleMenu}>
                    <Link to='/' className="block px-4 py-2 hover:bg-indigo-500">Home</Link>
                    <Link to='/profile' className="block px-4 py-2 hover:bg-indigo-500">My Bookings</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;

