// Header.tsx
'use client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Header: React.FC = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const nav = useRouter();
    const token = sessionStorage.getItem('token');
    function handleLogout(): void {
        sessionStorage.removeItem("token");
    }

    return (
        <div className="bg-white shadow p-4 flex justify-between items-center">
            <div className="text-xl font-bold cursor-pointer" onClick={() => nav.push("/")}>Dra+</div>
            <input
                type="text"
                placeholder="Search for a user"
                className="border rounded px-3 py-2 w-1/3"
            />
            <div className="flex items-center space-x-4 pr-20 md:pr-2">
                <button className="relative group">
                    <span className="material-icons text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                        </svg>
                    </span>
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
                    <span className="absolute text-xs bottom-[-20px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Notifications
                    </span>
                </button>

                <button className="relative group" onClick={() => setShowDropdown(!showDropdown)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    {showDropdown && (
                        token ? (<div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Profile</a>
                            <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Settings</a>
                            <a onClick={() => handleLogout()} className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Logout</a>
                        </div>)
                            : (
                                <div className='absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg'>
                                    <a href="/login" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Login</a>
                                </div>
                            )

                    )}
                    <span className="absolute text-xs bottom-[-30px] left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        User Menu
                    </span>
                </button>
            </div>

        </div>
    );
};

export default Header;
