import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/NaveBar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import OrderSuccess from "./pages/OrderSuccess";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Verify from "./pages/Verify";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";

import AdminSales from "./pages/admin/AdminSales";
import AddProduct from "./pages/admin/AddProduct";
import AdminProduct from "./pages/admin/AdminProduct";
import AdminOrders from "./pages/admin/AdminOrders";
import ShowUserOrders from "./pages/admin/ShowUserOrders";
import { AdminUsers } from "./pages/admin/AdminUsers";
import UserInfo from "./pages/admin/UserInfo";
import SingleProduct from "./pages/SingleProduct";
import AddCategory from "./pages/admin/AddCategory";
import { AddressForm } from "./pages/AddressForm";

function App() {
  const [loading, setLoading] = useState(true);

  // ✅ SAFE USER PARSE
  const getUserFromStorage = () => {
    try {
      const data = localStorage.getItem("user");
      return data && data !== "undefined" ? JSON.parse(data) : null;
    } catch (err) {
      console.error("Invalid JSON in localStorage:", err);
      return null;
    }
  };

  const user = getUserFromStorage();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`transition-all duration-700 ${
        loading ? "blur-xl opacity-50" : "blur-0 opacity-100"
      }`}
    >
      <Routes>

        {/* 🔓 PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/verify/:token" element={<Verify />} />
        {/* 🔁 HOME */}
        <Route
          path="/"
          element={
            user?.role === "admin" ? (
              <Navigate to="/dashboard" />
            ) : (
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            )
          }
        />

        {/* 📦 PRODUCTS */}
        <Route
          path="/products"
          element={
            user?.role === "admin" ? (
              <Navigate to="/dashboard" />
            ) : (
              <>
                <Navbar />
                <Products />
                <Footer />
              </>
            )
          }
        />

        <Route
          path="/products/category/:categoryName"
          element={
            user?.role === "admin" ? (
              <Navigate to="/dashboard" />
            ) : (
              <>
                <Navbar />
                <Products />
                <Footer />
              </>
            )
          }
        />

        <Route
          path="/products/:id"
          element={
            user?.role === "admin" ? (
              <Navigate to="/dashboard" />
            ) : (
              <>
                <Navbar />
                <SingleProduct />
                <Footer />
              </>
            )
          }
        />

        {/* 🛒 CART */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              {user?.role === "admin" ? (
                <Navigate to="/dashboard" />
              ) : (
                <>
                  <Navbar />
                  <Cart />
                </>
              )}
            </ProtectedRoute>
          }
        />

        {/* 👤 PROFILE */}
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              {user?.role === "admin" ? (
                <Navigate to="/dashboard" />
              ) : (
                <>
                  <Navbar />
                  <Profile />
                </>
              )}
            </ProtectedRoute>
          }
        />

        {/* 📍 ADDRESS */}
        <Route
          path="/address"
          element={
            <ProtectedRoute>
              {user?.role === "admin" ? (
                <Navigate to="/dashboard" />
              ) : (
                <>
                  <Navbar />
                  <AddressForm />
                </>
              )}
            </ProtectedRoute>
          }
        />

        {/* ✅ ORDER SUCCESS */}
        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              {user?.role === "admin" ? (
                <Navigate to="/dashboard" />
              ) : (
                <>
                  <Navbar />
                  <OrderSuccess />
                </>
              )}
            </ProtectedRoute>
          }
        />

        {/* 🔐 ADMIN */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="sales" />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="add-category" element={<AddCategory />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="products" element={<AdminProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/:id" element={<UserInfo />} />
          <Route path="users/orders/:userId" element={<ShowUserOrders />} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;






// import { useState, useEffect } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// import Navbar from "./components/NaveBar";
// import Footer from "./components/Footer";
// import ProtectedRoute from "./components/ProtectedRoute";

// import OrderSuccess from "./pages/OrderSuccess";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Verify from "./pages/Verify";
// import VerifyEmail from "./pages/VerifyEmail";
// import Profile from "./pages/Profile";
// import Products from "./pages/Products";
// import Cart from "./pages/Cart";
// import Dashboard from "./pages/Dashboard";

// import AdminSales from "./pages/admin/AdminSales";
// import AddProduct from "./pages/admin/AddProduct";
// import AdminProduct from "./pages/admin/AdminProduct";
// import AdminOrders from "./pages/admin/AdminOrders";
// import ShowUserOrders from "./pages/admin/ShowUserOrders";
// import { AdminUsers } from "./pages/admin/AdminUsers";
// import UserInfo from "./pages/admin/UserInfo";
// import SingleProduct from "./pages/SingleProduct";
// import AddCategory from "./pages/admin/AddCategory";
// import { AddressForm } from "./pages/AddressForm";

// function App() {
//   const [loading, setLoading] = useState(true);

//   const user = JSON.parse(localStorage.getItem("user"));

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 100);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className={`transition-all duration-700 ${loading ? "blur-xl opacity-50" : "blur-0 opacity-100"}`}>
//       <Routes>

//         {/* 🔓 PUBLIC ROUTES */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         {/* 🔁 HOME REDIRECT LOGIC */}
//         <Route
//           path="/"
//           element={
//             user?.role === "admin" ? (
//               <Navigate to="/dashboard" />
//             ) : (
//               <>
//                 <Navbar />
//                 <Home />
//                 <Footer />
//               </>
//             )
//           }
//         />

//         {/* 📦 USER ROUTES */}
//         <Route
//           path="/products"
//           element={
//             user?.role === "admin" ? (
//               <Navigate to="/dashboard" />
//             ) : (
//               <>
//                 <Navbar />
//                 <Products />
//                 <Footer />
//               </>
//             )
//           }
//         />

//         <Route
//           path="/products/category/:categoryName"
//           element={
//             user?.role === "admin" ? (
//               <Navigate to="/dashboard" />
//             ) : (
//               <>
//                 <Navbar />
//                 <Products />
//                 <Footer />
//               </>
//             )
//           }
//         />

//         <Route
//           path="/products/:id"
//           element={
//             user?.role === "admin" ? (
//               <Navigate to="/dashboard" />
//             ) : (
//               <>
//                 <Navbar />
//                 <SingleProduct />
//                 <Footer />
//               </>
//             )
//           }
//         />

//         <Route
//           path="/cart"
//           element={
//             <ProtectedRoute>
//               {user?.role === "admin" ? (
//                 <Navigate to="/dashboard" />
//               ) : (
//                 <>
//                   <Navbar />
//                   <Cart />
//                 </>
//               )}
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/profile/:userId"
//           element={
//             <ProtectedRoute>
//               {user?.role === "admin" ? (
//                 <Navigate to="/dashboard" />
//               ) : (
//                 <>
//                   <Navbar />
//                   <Profile />
//                 </>
//               )}
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/address"
//           element={
//             <ProtectedRoute>
//               {user?.role === "admin" ? (
//                 <Navigate to="/dashboard" />
//               ) : (
//                 <>
//                   <Navbar />
//                   <AddressForm />
//                 </>
//               )}
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/order-success"
//           element={
//             <ProtectedRoute>
//               {user?.role === "admin" ? (
//                 <Navigate to="/dashboard" />
//               ) : (
//                 <>
//                   <Navbar />
//                   <OrderSuccess />
//                 </>
//               )}
//             </ProtectedRoute>
//           }
//         />

//         {/* 🔐 ADMIN ROUTES */}
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute adminOnly={true}>
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         >
//             <Route index element={<Navigate to="sales" />} />
//           <Route path="sales" element={<AdminSales />} />
//           <Route path="add-category" element={<AddCategory />} />
//           <Route path="add-product" element={<AddProduct />} />
//           <Route path="products" element={<AdminProduct />} />
//           <Route path="orders" element={<AdminOrders />} />
//           <Route path="users" element={<AdminUsers />} />
//           <Route path="users/:id" element={<UserInfo />} />
//           <Route path="users/orders/:userId" element={<ShowUserOrders />} />
//         </Route>

//       </Routes>
//     </div>
//   );
// }

// export default App;








// collage 


// import { useState, useEffect } from "react";
// import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/NaveBar";
// import Footer from "./components/Footer";
// import ProtectedRoute from "./components/ProtectedRoute";
// import OrderSuccess from "./pages/OrderSuccess";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Verify from "./pages/Verify";
// import VerifyEmail from "./pages/VerifyEmail";
// import Profile from "./pages/Profile";
// import Products from "./pages/Products";
// import Cart from "./pages/Cart";
// import Dashboard from "./pages/Dashboard";
// import AdminSales from "./pages/admin/AdminSales";
// import AddProduct from "./pages/admin/AddProduct";
// import AdminProduct from "./pages/admin/AdminProduct";
// import AdminOrders from "./pages/admin/AdminOrders";
// import ShowUserOrders from "./pages/admin/ShowUserOrders";
// import { AdminUsers } from "./pages/admin/AdminUsers";
// import UserInfo from "./pages/admin/UserInfo";
// import SingleProduct from "./pages/SingleProduct";
// import AddCategory from "./pages/admin/AddCategory";
// import { AddressForm } from "./pages/AddressForm";

// function App() {
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 100);
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <div className={`transition-all duration-700 ${loading ? "blur-xl opacity-50" : "blur-0 opacity-100"}`}>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<> <Navbar /><Home /><Footer /></>} />
//         <Route path="/login" element={<> <Login /> </>} />
//         <Route path="/signup" element={<> <Signup /> </>} />
//         <Route path="/verify" element={<> <Navbar /><Verify /> </>} />
//         <Route path="/verify/:token" element={<> <Navbar /><VerifyEmail /> </>} />

//         {/* Protected User Routes */}
//         <Route
//           path="/profile/:userId"
//           element={
//             <ProtectedRoute>
//               <Navbar />
//               <Profile />
//             </ProtectedRoute>
//           }
//         />
//         <Route path="/products" element={<> <Navbar /><Products /><Footer /></>} />
//         <Route path="/products/category/:categoryName" element={<> <Navbar /><Products /><Footer /></>} />
//         <Route path="/products/:id" element={<> <Navbar /><SingleProduct /><Footer /></>} />
//         <Route
//           path="/cart"
//           element={
//             <ProtectedRoute>
//               <Navbar />
//               <Cart />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/address"
//           element={
//             <ProtectedRoute>
//               <Navbar />
//               <AddressForm />
//             </ProtectedRoute>
//           }
//         />
//          <Route
//           path="/order-success"
//           element={
//             <ProtectedRoute>
//               <Navbar />
//               <OrderSuccess />
//             </ProtectedRoute>
//           }
//         />
        

//         {/* Admin Dashboard Routes */}
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute adminOnly={true}>
//               <Navbar />
//               <Dashboard />
//             </ProtectedRoute>
//           }
//         >
//           <Route path="sales" element={<AdminSales />} />
//           <Route path="add-category" element={<AddCategory />} />
//           <Route path="add-product" element={<AddProduct />} />
//           <Route path="products" element={<AdminProduct />} />
//           <Route path="orders" element={<AdminOrders />} />
//           {/* <Route path="usrs/orders/:userId" element={<ShowUserOrders />} /> */}
//           <Route path="users" element={<AdminUsers />} />
//           <Route path="users/:id" element={<UserInfo />} />
//           <Route path="users/orders/:userId" element={<ShowUserOrders />} />
//         </Route>
//       </Routes>
//     </div>
//   );
// }

// export default App;





// import { Routes, Route } from "react-router-dom"
// import Navbar from "./components/NaveBar"
// import ProtectedRoute from "./components/ProtectedRoute"

// import Home from "./pages/Home"
// import Login from "./pages/Login"
// import Signup from "./pages/Signup"
// import Verify from "./pages/Verify"
// import VerifyEmail from "./pages/VerifyEmail"
// import Profile from "./pages/Profile"
// import Products from "./pages/Products"
// import Cart from "./pages/Cart"
// import Dashboard from "./pages/Dashboard"
// import AdminSales from "./pages/admin/AdminSales"
// import AddProduct from "./pages/admin/AddProduct"
// import AdminProduct from "./pages/admin/AdminProduct"
// import AdminOrders from "./pages/admin/AdminOrders"
// import ShowUserOrders from "./pages/admin/ShowUserOrders"
// import { AdminUsers } from "./pages/admin/AdminUsers"
// import UserInfo from "./pages/admin/UserInfo"
// import SingleProduct from "./pages/SingleProduct"
// import AddCategory from "./pages/admin/AddCategory"
// import Footer from "./components/Footer"
// import { AddressForm } from "./pages/AddressForm"

// function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<> <Navbar /><Home /> <Footer /></>} />
//       <Route path="/login" element={<> {/* <Navbar /> */} <Login />  </>} />
//       <Route path="/signup" element={<> {/* <Navbar /> */} <Signup /></>} />
//       <Route path="/verify" element={<><Navbar /><Verify /> </>} />
//       <Route path="/verify/:token" element={
//         <>
//           <Navbar />
//           <VerifyEmail />
//         </>
//       }
//       />
//       <Route path="/profile/:userId" element={
//         <ProtectedRoute>
//           <Navbar />
//           <Profile />

//         </ProtectedRoute>
//       }
//       />
//       <Route path="/products" element={
//         <>
//           <Navbar />
//           <Products />
//           <Footer />
//         </>
//       }
//       />
//       <Route path="/products/category/:categoryName" element={
//         <>
//           <Navbar />
//           <Products />
//           <Footer />
//         </>
//       } />
//       <Route path="/products/:id" element={
//         <>
//           <Navbar />
//           <SingleProduct />
//           <Footer />
//         </>
//       }
//       />
//       <Route path="/cart" element={
//         <ProtectedRoute>
//           <Navbar />
//           <Cart />
//         </ProtectedRoute>
//       }
//       />
//       <Route path="/address" element={
//         <ProtectedRoute>
//           <Navbar />
//           <AddressForm />
//         </ProtectedRoute>
//       }
//       />

//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute adminOnly={true}>
//             <Navbar />
//             <Dashboard />
//           </ProtectedRoute>
//         }
//       >
//         <Route path="sales" element={<AdminSales />} />
//         <Route path="add-category" element={<AddCategory />} />
//         <Route path="add-product" element={<AddProduct />} />
//         <Route path="products" element={<AdminProduct />} />
//         <Route path="orders" element={<AdminOrders />} />
//         <Route path="usrs/orders/:userId" element={<ShowUserOrders />} />
//         <Route path="users" element={<AdminUsers />} />
//         <Route path="users/:id" element={<UserInfo />} />
//       </Route>

//     </Routes>
//   )
// }

// export default App

// import { Routes, Route } from "react-router-dom"
// import Navbar from "./components/NaveBar"
// import Home from "./pages/Home"
// import Login from "./pages/Login"
// import Signup from "./pages/Signup"
// import Verify from "./pages/Verify"
// import VerifyEmail from "./pages/VerifyEmail"
// import Profile from "./pages/Profile"
// import Products from "./pages/Products"
// import Cart from "./pages/Cart"
// import Dashboard from "./pages/Dashboard"
// import AdminSales from "./pages/admin/AdminSales"
// import AddProduct from "./pages/admin/AddProduct"
// import AdminProduct from "./pages/admin/AdminProduct"
// import AdminOrders from "./pages/admin/AdminOrders"
// import ShowUserOrders from "./pages/admin/ShowUserOrders"
// import { AdminUsers } from "./pages/admin/AdminUsers"
// import UserInfo from "./pages/admin/UserInfo"


// function App() {
//   return (
//     <>
//       <Navbar />

//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} /> 
//         <Route path="/verify" element={<Verify />} />
//         <Route path="/verify/:token" element={<VerifyEmail />} />
//         <Route path="/profile/:userId" element={<Profile />} />
//         <Route path="/products" element={<Products />} />
//         <Route path="/cart" element={<Cart />} />

//         {/* ✅ Nested routing */}
//         <Route path="/dashboard" element={<Dashboard />}>
//           <Route path="sales" element={<AdminSales />} />
//           <Route path="add-product" element={<AddProduct />} />
//           <Route path="products" element={<AdminProduct />} />
//           <Route path="orders" element={<AdminOrders />} />
//           <Route path="usrs/orders/:userId" element={<ShowUserOrders />} />
//           <Route path="users" element={<AdminUsers />} />
//           <Route path="users/:id" element={<UserInfo />} />
//         </Route>

//       </Routes>
//     </>
//   )
// }

// export default App


















// import { Routes, Route } from "react-router-dom"
// import { Button } from "./components/ui/button"
// import Navbar from "./components/NaveBar"
// import Home from "./pages/Home"
// import Login from "./pages/Login"
// import Signup from "./pages/Signup"
// import Verify from "./pages/Verify"
// import VerifyEmail from "./pages/VerifyEmail"
// import Profile from "./pages/Profile"
// import Products from "./pages/Products"
// import Cart from "./pages/Cart"



// function App() {
//   return (
//     <>

//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} /> 
//         <Route path="/verify" element={<Verify />} />
//         <Route path="/verify/:token" element={<VerifyEmail />} />
//         <Route path="/profile/:userId" element={<Profile />} />
//         <Route path="/products" element={<Products />} />
//         <Route path="/cart" element={<Cart />} />


//       </Routes>
//     </>
//   )
// }

// export default App
