import React, { useState, useRef, useEffect } from "react";

const Nav = () => {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="max-w-7xl mx-auto h-20 flex items-center px-6">

            <div ref={dropdownRef} className="relative">

                <button
                    onClick={() => setOpen(!open)}
                    className="text-gray-800 bg-transparent focus:outline-none"
                >
                    Sofa
                </button>

                {open && (
                    <ul className="absolute top-full left-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg">
                        <li>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                                One Seater
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                                Two Seater
                            </a>
                        </li>
                        <li>
                            <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                                Three Seater
                            </a>
                        </li>
                    </ul>

                )}

            </div>

            
            
        </div>
    );
};

export default Nav;
