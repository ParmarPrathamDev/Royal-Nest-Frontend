import React, { useEffect, useState } from "react";
import leftImage from "../assets/images/Cric.webp";

import r1 from "../assets/images/addd.webp";
import r2 from "../assets/images/r2.webp";
import r3 from "../assets/images/r3.webp";


const Hero = () => {
  const images = [r1, r2, r3];
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 lg:px-16">

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* LEFT BIG IMAGE */}
          <div className="md:col-span-2">
            <img
              src={leftImage}
              alt="Main Banner"
              className="w-full h-[300px] md:h-[420px] object-cover rounded-l-2xl"
            />
          </div>

          {/* RIGHT SMALL SLIDER */}
          <div className="relative">
            <img
              src={images[currentImage]}
              alt="Slider"
              className="w-full h-[300px] md:h-[420px] object-cover rounded-lg transition-all duration-700"
            />

            {/* DOTS */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`h-2 rounded-full cursor-pointer ${
                    currentImage === index
                      ? "bg-orange-500 w-5"
                      : "bg-gray-300 w-2"
                  }`}
                ></div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;






// import React, { useEffect, useState } from "react";
// import { Button } from "./ui/button";
// import addImage1 from "../assets/images/1add.webp";
// import addImage2 from "../assets/images/2add.webp";
// import addImage3 from "../assets/images/3add.webp";
// import { useNavigate } from "react-router-dom";

// const Hero = () => {
//   const images = [addImage1, addImage2, addImage3];
//   const [currentImage, setCurrentImage] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImage((prev) => (prev + 1) % images.length);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-12 md:py-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          
//           {/* LEFT CONTENT */}
//           <div className="text-center md:text-left">
//             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-snug md:leading-tight">
//               Make Your Home <br />
//               <span className="text-yellow-300">Stylish & Comfortable</span>
//             </h1>

//             <p className="text-base sm:text-lg md:text-xl mb-6 text-gray-100">
//               Discover premium sofas, elegant curtains, and modern home décor
//               to transform your living space beautifully.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
//               <Button
//                 onClick={() => navigate("/products")}
//                 className="bg-white text-purple-600 font-semibold px-6 py-2 hover:bg-gray-200"
//               >
//                 Shop Now
//               </Button>

//               <Button
//                 variant="outline"
//                 className="bg-white text-purple-600 font-semibold px-6 py-2 hover:bg-gray-200"
//               >
//                 View Deals
//               </Button>
//             </div>
//           </div>

//           {/* RIGHT IMAGE */}
//           <div className="relative flex justify-center mt-8 md:mt-0">
//             {/* Background blur circle */}
//             <div className="absolute w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>

//             {/* Hero image */}
//             <img
//               src={images[currentImage]}
//               alt="Home Decor"
//               className="relative z-10 w-56 sm:w-72 md:w-96 lg:w-[500px] rounded-xl shadow-2xl transition-transform duration-700 hover:scale-105"
//             />
//           </div>
//         </div>

//         {/* DOT INDICATORS */}
//         <div className="flex justify-center mt-8 gap-2">
//           {images.map((_, index) => (
//             <div
//               key={index}
//               onClick={() => setCurrentImage(index)}
//               className={`h-2 rounded-full cursor-pointer transition-all ${
//                 currentImage === index
//                   ? "bg-white w-4"
//                   : "bg-white/50 w-2"
//               }`}    
//             ></div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;









// import React, { useEffect, useState } from "react";
// import { Button } from "./ui/button";
// import addImage1 from "../assets/images/1add.webp";
// import addImage2 from "../assets/images/2add.webp";
// import addImage3 from "../assets/images/3add.webp";
// import { useNavigate } from "react-router-dom";

// const Hero = () => {
//   const images = [addImage1, addImage2, addImage3];
//   const [currentImage, setCurrentImage] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentImage((prev) => (prev + 1) % images.length);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-12 md:py-20">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="grid md:grid-cols-2 gap-10 items-center">
          
//           {/* LEFT CONTENT */}
//           <div className="text-center md:text-left">
//             <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
//               Make Your Home <br />
//               <span className="text-yellow-300">Stylish & Comfortable</span>
//             </h1>

//             <p className="text-base sm:text-lg md:text-xl mb-6 text-gray-100">
//               Discover premium sofas, elegant curtains, and modern home décor
//               to transform your living space beautifully.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
//               <Button
//                 onClick={() => navigate("/products")}
//                 className="bg-white text-purple-600 font-semibold px-6 py-2 hover:bg-gray-200"
//               >
//                 Shop Now
//               </Button>

//               <Button
//                 variant="outline"
//                 className="bg-white text-purple-600 font-semibold px-6 py-2 hover:bg-gray-200"
//               >
//                 View Deals
//               </Button>
//             </div>
//           </div>

//           {/* RIGHT IMAGE */}
//           <div className="relative flex justify-center">
//             <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-white/10 rounded-full blur-3xl"></div>

//             <img
//               src={images[currentImage]}
//               alt="Home Decor"
//               className="relative z-10 w-[280px] sm:w-[350px] md:w-[450px] rounded-xl shadow-2xl transition-all duration-700 hover:scale-105"
//             />
//           </div>
//         </div>

//         {/* DOT INDICATORS */}
//         <div className="flex justify-center mt-8 gap-2">
//           {images.map((_, index) => (
//             <div
//               key={index}
//               onClick={() => setCurrentImage(index)}
//               className={`h-2 w-2 rounded-full cursor-pointer ${
//                 currentImage === index
//                   ? "bg-white w-4"
//                   : "bg-white/50"
//               } transition-all`}    
//             ></div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;