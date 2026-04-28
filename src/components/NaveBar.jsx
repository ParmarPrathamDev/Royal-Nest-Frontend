import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import logo from '../assets/images/logo.png';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/Redux/userSlice';
import { FaUserCircle } from 'react-icons/fa';
import { API_BASE_URL } from "@/config/api";

const NaveBar = () => {

  const { user } = useSelector(store => store.user);
  const { cart } = useSelector(store => store.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  const admin = user?.role === "admin";
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = async () => {
  try {

    const accessToken = localStorage.getItem("accessToken");

    const res = await axios.post(
      `${API_BASE_URL}/api/v1/user/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (res.data.success) {
      toast.success(res.data.message);
      dispatch(setUser(null));
      localStorage.removeItem("accessToken"); // important
      navigate("/");
    }

  } catch (error) {
    console.log(error);
  }
};
  // const logoutHandler = async () => {
  //   try {
  //     const res = await axios.post(
  //       `http://localhost:8000/api/v1/user/logout`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`
  //         }
  //       }
  //     );

  //     if (res.data.success) {
  //       toast.success(res.data.message);
  //       dispatch(setUser(null));
  //       setMenuOpen(false); 
  //     }

  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    // <header className="w-full bg-[#0b2a4a] border-b border-blue-900">
    <header className="w-full bg-[#0b2a4a] border-b border-blue-900 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-4">

        {/* LOGO */}
        <img
          src={logo}
          onClick={() => navigate('/')}
          alt="Logo"
          className="h-14 md:h-20 w-auto object-contain" 
        />
        <nav className="hidden md:flex items-center gap-10 text-white">
          <ul className="flex gap-7 items-center text-lg font-semibold">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            {admin && (
              <li>
                <Link to="/dashboard/sales">Dashboard</Link>
              </li>
            )}

            {user && (
              <li>
                <Link to={`/profile/${user._id}`}>
                  {/* Hello, {user.lastName} */}
                   <FaUserCircle size={28} />
                </Link>
              </li>
            )}

          </ul>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <ShoppingCart />
            <span className="bg-pink-500 rounded-full absolute text-white -top-2 -right-3 px-2 text-xs">
              {cart?.items?.length || 0}
            </span>
          </Link>

          {user ? (
            <Button
              className="bg-pink-500 text-white"
              onClick={logoutHandler}
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/Login')}
              className="bg-blue-500 text-white"
            >
              Login
            </Button>
          )}

        </nav>

        <div className="md:hidden text-white cursor-pointer">
          {menuOpen ? (
            <X size={28} onClick={() => setMenuOpen(false)} />
          ) : (
            <Menu size={28} onClick={() => setMenuOpen(true)} />
          )}
        </div>

      </div>
      {menuOpen && (
        <div className="md:hidden bg-[#0b2a4a] text-white px-6 py-6 space-y-6">
          <div className="flex flex-col space-y-4 text-lg font-semibold">

            <Link 
              to="/" 
              onClick={() => setMenuOpen(false)}
              className="border-b border-blue-800 pb-2"
            >
              Home
            </Link>

            <Link 
              to="/products" 
              onClick={() => setMenuOpen(false)}
              className="border-b border-blue-800 pb-2"
            >
              Products
            </Link>

            {user && (
              <Link
                to={`/profile/${user._id}`}
                onClick={() => setMenuOpen(false)}
                className="border-b border-blue-800 pb-2"
              >
                Hello, {user.firstName}
              </Link>
            )}

            {admin && (
              <Link
                to="/dashboard/sales"
                onClick={() => setMenuOpen(false)}
                className="border-b border-blue-800 pb-2"
              >
                Dashboard
              </Link>
            )}

            <Link 
              to="/cart" 
              onClick={() => setMenuOpen(false)}
              className="border-b border-blue-800 pb-2"
            >
              Cart ({cart?.items?.length || 0})
            </Link>

          </div>

          {/* Button Section */}
          <div className="pt-4">

            {user ? (
              <Button
                className="bg-pink-500 w-full"
                onClick={logoutHandler}
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/Login')}
                className="bg-blue-500 w-full"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NaveBar;






// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { ShoppingCart } from 'lucide-react';
// import logo from '../assets/images/logo.png';
// import { Button } from './ui/button';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { useDispatch, useSelector } from 'react-redux';
// import { setUser } from '@/Redux/userSlice';

// const NaveBar = () => {
//   const { user } = useSelector(store => store.user);
//   const { cart } = useSelector(store => store.product);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const accessToken = localStorage.getItem('accessToken');
//   const admin = user?.role === "admin" ? true : false

//   const logoutHandler = async () => {
//     try {
//       const res = await axios.post(
//         `http://localhost:8000/api/v1/user/logout`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`
//           }
//         }
//       );
//       if (res.data.success) {
//         toast.success(res.data.message);
//         dispatch(setUser(null));
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   console.log(cart);

//   return (
//     <header className="w-full bg-[#0b2a4a] border-b border-blue-900">
//       <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-6">

//         {/* LOGO */}
//         <div className="flex items-center">
//           <img
//             src={logo}
//             alt="Logo"
//             className="h-20 w-auto object-contain"
//           />
//         </div>

//         {/* NAV LINKS */}
//         <nav className="flex items-center gap-10 text-white">
//           <ul className="flex gap-7 items-center text-lg font-semibold">
//             <li><Link to="/">Home</Link></li>
//             <li><Link to="/products">Products</Link></li>

//             {user && (
//               <li>
//                 <Link to={`/profile/${user._id}`}>
//                   Hello, {user.firstName}
//                 </Link>
//               </li>
//             )}

//             {admin && (<li><Link to={`/dashboard/sales`}>Dashboard</Link></li>)}
//           </ul>

//           <Link to="/cart" className="relative">
//             <ShoppingCart />

//             {/* ❗ ERROR HATI: cart.items undefined hati ane tame direct .length call kari didhi */}
//             {/* ✅ FIX: optional chaining + fallback 0 */}

//             <span className="bg-pink-500 rounded-full absolute text-white -top-2 -right-4 px-2 text-xs">
//               {cart?.items?.length || 0}
//             </span>
//           </Link>

//           {user ? (
//             <Button
//               className="bg-pink-400 text-white cursor-pointer"
//               onClick={logoutHandler}
//             >
//               Logout
//             </Button>
//           ) : (
//             <Button
//               onClick={() => navigate('/Login')}
//               className="bg-gradient-to-tl from-blue-600 to-blue-400 text-white cursor-pointer"
//             >
//               Login
//             </Button>
//           )}
//         </nav>

//       </div>
//     </header>
//   );
// };

// export default NaveBar; 



// import React from 'react';
// import { Link, Navigate, useNavigate } from 'react-router-dom';
// import { ShoppingCart, ShowerHeadIcon } from 'lucide-react';
// import logo from '../assets/images/logo.png';
// import { Button } from './ui/button';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { useDispatch, useSelector } from 'react-redux';
// import { setUser } from '@/Redux/userSlice';


// const NaveBar = () => {
  
//   const { user } = useSelector(store => store.user);
//   const {cart} = useSelector(store => store.product);
//   const dispatch = useDispatch()
//   const navigate = useNavigate()
//   const accessToken = localStorage.getItem('accessToken');

//   const logoutHandler = async () => {
//     try {
//       const res = await axios.post(`http://localhost:8000/api/v1/user/logout`, {}, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       });
//       if (res.data.success) {
//         toast.success(res.data.message);
//         dispatch(setUser(null))
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   console.log(cart);
//   return (
//     <header className="w-full bg-[#0b2a4a] border-b border-blue-900">
//       <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-6">

//         {/* LOGO */}
//         <div className="flex items-center">
//           <img
//             src={logo}
//             alt="Logo"
//             className="h-20 w-auto object-contain"
//           />
//         </div>

//         {/* NAV LINKS */}
//         <nav className="flex items-center gap-10 text-white">
//           <ul className="flex gap-7 items-center text-lg font-semibold">
//             <li><Link to="/">Home</Link></li>
//             <li><Link to="/products">Products</Link></li>

//             {/* ✅ CHANGE 3: Correctly show username with JSX curly braces */}
//             {user && <li><Link to={`/profile/${user._id}`}>Hello, {user.firstName}</Link></li>}

//           </ul>

//           <Link to="/cart" className="relative">
//             <ShoppingCart />
//             <span className="bg-pink-500 rounded-full absolute text-white -top-2 -right-4 px-2 text-xs">{cart.items.length}</span>
//           </Link>

//           {/* ✅ CHANGE 4: Add onClick for logout button */}
//           {user ? (
//             <Button className='bg-pink-400 text-white cursor-pointer' onClick={logoutHandler}>
//               Logout
//             </Button>
//           ) : (
//             <Button onClick={()=>navigate('/Login')} className='bg-gradient-to-tl from-blue-600 to-blue-400 text-white cursor-pointer'>
//               Login
//             </Button>
//           )}
//         </nav>

//       </div>
//     </header>
//   );
// };

// export default NaveBar;











































// // import React from 'react';
// // import { Link } from 'react-router-dom';
// // import { ShoppingCart } from 'lucide-react';
// // import logo from '../assets/images/logo.png';
// // import { Button } from './ui/button';
// // import axios from 'axios';
// // import { toast } from 'sonner';
// // import { useSelector } from 'react-redux';
// // import store from '@/Redux/store';

// // const NaveBar = () => {
// //   const { user } = useSelector(store => store.user)

// //   const accessToken = localStorage.getItem('accessToken')
// //   const logoutHandler = async () => {
// //     try {
// //       const res = await axios.post(`http://localhost:8000/api/v1/user/logout`, {}, {
// //         headers: {
// //           Authorization: `Bearer ${accessToken}`
// //         }
// //       })
// //       if (res.data.success) {
// //         toast.success(res.data.message)
// //       }
// //     } catch (error) {
// //       console.log(error)
// //     }
// //   }

// //   return (
// //     <header className="w-full bg-[#0b2a4a] border-b border-blue-900">
// //       <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-6">

// //         {/* LOGO */}
// //         <div className="flex items-center">
// //           <img
// //             src={logo}
// //             alt="Logo"
// //             className="h-20 w-auto object-contain"
// //           />
// //         </div>

// //         {/* NAV LINKS */}
// //         <nav className="flex items-center gap-10 text-white">
// //           <ul className="flex gap-7 items-center text-lg font-semibold">
// //             <li><Link to="/">Home</Link></li>
// //             <li><Link to="/products">Products</Link></li>
// //             {user && <li><Link to="/profile">Hello, {user.firstName}</Link></li>}

// //           </ul>

// //           <Link to="/cart" className="relative">
// //             <ShoppingCart />
// //             <span className="bg-pink-500 rounded-full absolute text-white -top-2 -right-4 px-2 text-xs">0</span>
// //           </Link>
// //           {

// //             user ? <Button className='bg-pink-400 text-white cursor-pointer'>Logout</Button> : <Button className=' bg-gradient-to-tl from-blue-600 to-blue-400 text-white cursor-pointer'>Login</Button>
// //           }
// //         </nav>



// //       </div>
// //     </header>
// //   );
// // };

// // export default NaveBar;
