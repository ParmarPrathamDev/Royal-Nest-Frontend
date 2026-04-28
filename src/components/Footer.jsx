import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaPinterest, FaTwitterSquare } from 'react-icons/fa';
import logo from '../assets/images/logo.png';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">

        {/* Brand Info */}
        <div>
         <img
                  src={logo}
                  onClick={() => navigate('/')}
                  alt="Logo"
                  className="h-14 md:h-20 w-auto object-contain" 
                />
          <p className="text-sm">Comfort You Can Feel, Style You’ll Love.</p>
          <p className="text-sm mt-2">Palanpur B.K</p>
          <p className="text-sm">support@zaptron.com</p>
          <p className="text-sm">(123) 456-7890</p>
        </div>

        {/* Customer Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Customer Service</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-pink-500 cursor-pointer">Contact Us</li>
            <li className="hover:text-pink-500 cursor-pointer">Shipping & Returns</li>
            <li className="hover:text-pink-500 cursor-pointer">FAQs</li>
            <li className="hover:text-pink-500 cursor-pointer">Order Tracking</li>
            <li className="hover:text-pink-500 cursor-pointer">Size Guide</li>
          </ul>
        </div>

        {/* Social + Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Follow Us</h3>

          {/* Social Icons */}
          <div className="flex space-x-4 text-xl">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-blue-500 transition">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-pink-500 transition">
              <FaInstagram />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition">
              <FaTwitterSquare />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-red-500 transition">
              <FaPinterest />
            </a>
          </div>

          {/* Newsletter */}
          <div className="mt-6">
            <p className="text-sm mb-2">Subscribe for updates</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter email"
                className="w-full p-2 rounded-l-md bg-gray-800 text-sm focus:outline-none"
              />
              <button className="bg-pink-600 px-4 rounded-r-md hover:bg-pink-700 text-white text-sm">
                Join
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="mt-10 border-t border-gray-700 pt-5 text-center text-sm">
        <p>
          © {new Date().getFullYear()} <span className="text-pink-500 font-semibold">EKart</span>. All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;








// import React from 'react';
// import { Link } from 'react-router-dom';
// // import Logo from '../assets/Logo.png';
// import { FaFacebook, FaInstagram, FaPinterest, FaTwitterSquare } from 'react-icons/fa';

// const Footer = () => {
//   return (
//     <footer className="bg-gray-900 text-gray-200 py-10 mt-5">
//       <div className="max-w-7xl mx-auto px-4 md:flex md:justify-between">
//         {/* info */}
//         <div className="mb-6 md:mb-0">
//           <Link to="/">
//             <img src="Ekart.png" alt="" className="w-32" />
//           </Link>
//           <p className="mt-2 text-sm">Comfort You Can Feel, Style You’ll Love.</p>
//           <p className="mt-2 text-sm">Palanpur B.K</p>
//           <p className="text-sm">Email: support@zaptron.com</p>
//           <p className="text-sm">Phone: (123) 456-7890</p>
//         </div>

//         {/* customer service link */}
//         <div className="mb-6 md:mb-0">
//           <h3 className="text-xl font-semibold">Customer Service</h3>
//           <ul className="mt-2 text-sm space-y-2">
//             <li>Contact Us</li>
//             <li>Shipping & Returns</li>
//             <li>FAQs</li>
//             <li>Order Tracking</li>
//             <li>Size Guide</li>
//           </ul>
//         </div>

//         {/* social media links */}
//         <div className="mb-6 md:mb-0">
//           <h3 className="text-xl font-semibold">Follow Us</h3>
//           <div className="flex space-x-4 mt-2">
//             <FaFacebook />
//             <FaInstagram />
//             <FaTwitterSquare />
//             <FaPinterest />
//           </div>
//         </div>

//         {/* newsletter subscription */}
//         {/* <div>
//           <h3 className="text-xl font-semibold">Stay in the Loop</h3>
//           <p className="mt-2 text-sm">Subscribe to get special offers, free giveaways, and more</p>
//           <form action="" className="mt-4 flex">
//             <input
//               type="email"
//               placeholder="Your email address"
//               className="w-full p-2 rounded-l-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
//             />
//             <button type="submit" className="bg-pink-600 text-white px-4 rounded-r-md hover:bg-red-700">
//               Subscribe
//             </button>
//           </form>
//         </div> */}
//       </div>

//       {/* bottom section */}
//       <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm">
//         <p>&copy; {new Date().getFullYear()} <span className="text-pink-600">EKart</span>. All rights reserved</p>
//       </div>
//     </footer>
//   );
// };

// export default Footer;
