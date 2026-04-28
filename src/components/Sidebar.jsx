import {
    LayoutDashboard,
    PackagePlus,
    PackageSearch,
    Users,
    Menu,
    X,
    LogOut
} from "lucide-react";
import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 font-medium p-3 rounded-xl transition-all duration-200
    ${isActive
            ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md"
            : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
        }`;

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <>
            {/* Mobile Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 bg-pink-600 text-white p-3 rounded-full shadow-lg"
            >
                <Menu size={22} />
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-[260px] md:w-[280px]
        bg-white border-r shadow-lg flex flex-col justify-between
        transform transition-transform duration-300 z-50
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
            >
                {/* Top */}
                <div className="p-5 ">

                    {/* Close Btn */}
                    <div className="md:hidden flex justify-end mb-2">
                        <button onClick={() => setIsOpen(false)}>
                            <X size={26} />
                        </button>
                    </div>

                    {/* 🔥 Logo */}
                    <div
                        className="flex flex-col items-center mb-6 cursor-pointer"
                        onClick={() => navigate("/dashboard/sales")}
                    >
                        <img
                            src={logo}
                            alt="logo"
                            className="h-14 object-contain"
                        />
                        <p className="text-sm font-semibold text-gray-500 mt-1">
                            Admin Panel
                        </p>
                    </div>

                    {/* Links */}
                    <div className="space-y-2">
                        <NavLink to="/dashboard/sales" className={linkClass}>
                            <LayoutDashboard size={20} />
                            Dashboard
                        </NavLink>

                        <NavLink to="/dashboard/add-category" className={linkClass}>
                            <PackagePlus size={20} />
                            Category
                        </NavLink>

                        <NavLink to="/dashboard/products" className={linkClass}>
                            <PackageSearch size={20} />
                            Products
                        </NavLink>

                        <NavLink to="/dashboard/users" className={linkClass}>
                            <Users size={20} />
                            Users
                        </NavLink>

                        <NavLink to="/dashboard/orders" className={linkClass}>
                            <FaRegEdit size={18} />
                            Orders
                        </NavLink>
                    </div>
                </div>

                {/* Bottom */}
                <div className="p-5 border-t">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full 
            bg-red-500 text-white p-3 rounded-xl font-semibold 
            hover:bg-red-600 transition"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;






/// collage




// import {
//     LayoutDashboard,
//     PackagePlus,
//     PackageSearch,
//     Users,
//     Menu,
//     X,
//     LogOut
// } from "lucide-react";
// import React, { useState } from "react";
// import { FaRegEdit } from "react-icons/fa";
// import { NavLink, useNavigate } from "react-router-dom";
// import logo from "../assets/images/logo.png";

// const Sidebar = () => {
//     const [isOpen, setIsOpen] = useState(false);
//     const navigate = useNavigate();

//     // 🔥 Active link style
//     const linkClass = ({ isActive }) =>
//         `text-base md:text-lg ${isActive ? "bg-pink-600 text-white" : "text-gray-700"
//         } flex items-center gap-3 font-semibold cursor-pointer p-3 rounded-xl w-full hover:bg-pink-500 hover:text-white transition`;

//     // 🔥 Logout function
//     const handleLogout = () => {
//         localStorage.removeItem("user");
//         localStorage.removeItem("token");
//         navigate("/login");
//     };

//     return (
//         <>
//             {/* 🔥 Mobile Toggle Button */}
//             <button
//                 onClick={() => setIsOpen(true)}
//                 className="md:hidden fixed top-24 left-4 z-50 bg-pink-600 text-white p-3 rounded-full shadow-lg"
//             >
//                 <Menu size={22} />
//             </button>

//             {/* 🔥 Overlay (Mobile) */}
//             {isOpen && (
//                 <div
//                     className="fixed inset-0 bg-black/40 z-40 md:hidden"
//                     onClick={() => setIsOpen(false)}
//                 />
//             )}

//             {/* 🔥 Sidebar */}
//             <div
//                 className={`fixed top-0 left-0 h-full w-[260px] md:w-[280px]
//         bg-white border-r border-gray-200 shadow-lg
//         flex flex-col justify-between
//         transform transition-transform duration-300 z-50
//         ${isOpen ? "translate-x-0" : "-translate-x-full"}
//         md:translate-x-0`}
//             >
//                 {/* 🔝 Top Section */}
//                 <div className="p-5 mt-20 md:mt-20">
//                     <div className="flex justify-center mb-6">
//                         <img
//                             src={logo}
//                             alt="Logo"
//                             className="h-14 w-auto object-contain cursor-pointer"
//                             onClick={() => navigate('/')}
//                         />
//                     </div>
//                     {/* ❌ Close Button (Mobile) */}
//                     <div className="md:hidden flex justify-end mb-4">
//                         <button onClick={() => setIsOpen(false)}>
//                             <X size={26} />
//                         </button>
//                     </div>

//                     {/* 🔗 Links */}
//                     <div className="space-y-2">
//                         <NavLink
//                             to="/dashboard/sales"
//                             className={linkClass}
//                             onClick={() => setIsOpen(false)}
//                         >
//                             <LayoutDashboard />
//                             <span>Dashboard</span>
//                         </NavLink>

//                         <NavLink
//                             to="/dashboard/add-category"
//                             className={linkClass}
//                             onClick={() => setIsOpen(false)}
//                         >
//                             <PackagePlus />
//                             <span>Category</span>
//                         </NavLink>

//                         <NavLink
//                             to="/dashboard/products"
//                             className={linkClass}
//                             onClick={() => setIsOpen(false)}
//                         >
//                             <PackageSearch />
//                             <span>Products</span>
//                         </NavLink>

//                         <NavLink
//                             to="/dashboard/users"
//                             className={linkClass}
//                             onClick={() => setIsOpen(false)}
//                         >
//                             <Users />
//                             <span>Users</span>
//                         </NavLink>

//                         <NavLink
//                             to="/dashboard/orders"
//                             className={linkClass}
//                             onClick={() => setIsOpen(false)}
//                         >
//                             <FaRegEdit />
//                             <span>Orders</span>
//                         </NavLink>
//                     </div>
//                 </div>

//                 {/* 🔻 Bottom Section (Logout) */}
//                 <div className="p-5 border-t border-gray-200">
//                     <button
//                         onClick={handleLogout}
//                         className="flex items-center justify-center gap-2 w-full bg-red-500 text-white p-3 rounded-xl font-semibold hover:bg-red-600 transition"
//                     >
//                         <LogOut size={18} />
//                         Logout
//                     </button>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Sidebar;






// import { LayoutDashboard, PackagePlus, PackageSearch, Users, Menu, X } from 'lucide-react'
// import React, { useState } from 'react'
// import { FaRegEdit } from 'react-icons/fa'
// import { NavLink } from 'react-router-dom'

// const Sidebar = () => {
//     const [isOpen, setIsOpen] = useState(false)

//     const linkClass = ({ isActive }) =>
//         `text-lg md:text-xl ${
//             isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"
//         } flex items-center gap-3 font-semibold cursor-pointer p-3 rounded-2xl w-full hover:bg-pink-500 hover:text-white transition`

//     return (
//         <>
//             {/* 🔥 Floating Button (Mobile Only) */}
//             <button
//                 onClick={() => setIsOpen(true)}
//                 className="md:hidden fixed top-24 left-4 z-50 bg-pink-600 text-white p-3 rounded-full shadow-lg"
//             >
//                 <Menu size={24} />
//             </button>

//             {/* Overlay */}
//             {isOpen && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
//                     onClick={() => setIsOpen(false)}
//                 ></div>
//             )}

//             {/* Sidebar */}
//             <div
//                 className={`fixed left-0 top-20 h-[calc(100vh-80px)]
//                 w-[260px] md:w-[300px]
//                 bg-pink-50 border-r border-pink-200 p-6 space-y-3
//                 z-40 transform transition-transform duration-300
//                 ${isOpen ? "translate-x-0" : "-translate-x-full"}
//                 md:translate-x-0 md:block`}
//             >
//                 {/* Close button */}
//                 <div className="md:hidden flex justify-end mb-4">
//                     <button onClick={() => setIsOpen(false)}>
//                         <X size={28} />
//                     </button>
//                 </div>

//                 <div className="space-y-2">
//                     <NavLink to='/dashboard/sales' className={linkClass}>
//                         <LayoutDashboard />
//                         <span>Dashboard</span>
//                     </NavLink>

//                     <NavLink to='/dashboard/add-category' className={linkClass}>
//                         <PackagePlus />
//                         <span>Category</span>
//                     </NavLink>

//                     <NavLink to='/dashboard/products' className={linkClass}>
//                         <PackageSearch />
//                         <span>Products</span>
//                     </NavLink>

//                     <NavLink to='/dashboard/users' className={linkClass}>
//                         <Users />
//                         <span>Users</span>
//                     </NavLink>

//                     <NavLink to='/dashboard/orders' className={linkClass}>
//                         <FaRegEdit />
//                         <span>Orders</span>
//                     </NavLink>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default Sidebar


//// responsive banayu uper nu



// import { LayoutDashboard, PackagePlus, PackageSearch, User, Users } from 'lucide-react'
// import React from 'react'
// import { FaRegEdit } from 'react-icons/fa'
// import { NavLink } from 'react-router-dom'

// const Sidebar = () => {
//     return (
//         <div className='hidden fixed md:block border-r bg-pink-50 border-pink-200 x-10 w-[300px] p-10 space-y-2 h-screen'>
//             <div className="text-center px3 spay-2">
//                 <NavLink to='/dashboard/sales' className={({ isActive }) => `text-xl ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}>
//                     <LayoutDashboard />
//                     <span>Dashboard</span>
//                 </NavLink>

//                 <NavLink to='/dashboard/add-category' className={({ isActive }) => `text-xl ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}>
//                     <PackagePlus />
//                     <span>Category</span>
//                 </NavLink>

//                 {/* <NavLink to='/dashboard/add-product' className={({ isActive }) => `text-xl ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}>
//                     <PackagePlus />
//                     <span>Add Product</span>
//                 </NavLink> */}

//                 <NavLink to='/dashboard/products' className={({ isActive }) => `text-xl ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}>
//                     <PackageSearch />
//                     <span>Products</span>
//                 </NavLink>

//                 <NavLink to='/dashboard/users' className={({ isActive }) => `text-xl ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}>
//                     <Users />
//                     <span>Users</span>
//                 </NavLink>

//                 <NavLink to='/dashboard/orders' className={({ isActive }) => `text-xl ${isActive ? "bg-pink-600 text-gray-200" : "bg-transparent"} flex items-center gap-2 font-bold cursor-pointer p-3 rounded-2xl w-full`}>
//                     <FaRegEdit />
//                     <span>Orders</span>
//                 </NavLink>
//             </div>

//         </div>
//     )
// }
// export default Sidebar