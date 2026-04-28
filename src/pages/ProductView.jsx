import React, { useEffect, useState } from "react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const HomeProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/v1/product/getallproduct");

      if (res.data.success) {
        let allProducts = res.data.products;

        // ✅ FILTER (unwanted remove)
        allProducts = allProducts.filter(
          (item) =>
            item.productImg?.length > 0 &&
            item.category?.name !== "vehicle"
        );

        // ✅ GROUP BY CATEGORY
        const categoryMap = {};

        allProducts.forEach((product) => {
          const categoryId = product.category?._id;

          if (!categoryMap[categoryId]) {
            categoryMap[categoryId] = [];
          }

          categoryMap[categoryId].push(product);
        });

        // ✅ RANDOM 1 PER CATEGORY
        const randomProducts = Object.values(categoryMap).map((items) => {
          const randomIndex = Math.floor(Math.random() * items.length);
          return items[randomIndex];
        });

        // 🔥 ONLY 4 PRODUCTS
        const finalProducts = randomProducts.slice(0, 8);

        setProducts(finalProducts);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 via-pink-50 to-yellow-100 py-12 sm:py-16 px-4 sm:px-6 lg:px-16">

      {/* Hero Section */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-12 sm:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 drop-shadow-lg">
        Make Your Home Beautiful
      </h1>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-xl" />
            ))
          : products.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/products/${product._id}`)}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
              >
                {/* Image */}
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product?.productImg?.[0]?.url}
                    alt={product.productName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* DEBUG (remove later) */}
                <p className="text-xs text-center text-gray-400">
                  {product.category?.name}
                </p>
              </div>
            ))}
      </div>
    </div>
  );
};

export default HomeProducts;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useNavigate } from "react-router-dom";

// const HomeProducts = () => {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   // const getProducts = async () => {
//   //   try {
//   //     setLoading(true);
//   //     const res = await axios.get("http://localhost:8000/api/v1/product/getallproduct");

//   //     if (res.data.success) {
//   //       setProducts(res.data.products.slice(0, 8)); // show only 8 products
//   //     }
//   //   } catch (error) {
//   //     console.log(error);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const getProducts = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("http://localhost:8000/api/v1/product/getallproduct");

//       if (res.data.success) {
//         const allProducts = res.data.products;

//         // category wise group
//         const categoryMap = {};

//         allProducts.forEach((product) => {
//           const categoryId = product.category?._id;

//           if (!categoryMap[categoryId]) {
//             categoryMap[categoryId] = [];
//           }

//           categoryMap[categoryId].push(product);
//         });

//         // random 1 product from each category
//         const randomProducts = Object.values(categoryMap).map((products) => {
//           const randomIndex = Math.floor(Math.random() * products.length);
//           return products[randomIndex];
//         });

//         setProducts(randomProducts); // ✅ final data
//       }
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getProducts();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-purple-100 via-pink-50 to-yellow-100 py-12 sm:py-16 px-4 sm:px-6 lg:px-16">

//       {/* Hero Section */}
//       <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-12 sm:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 drop-shadow-lg">
//         Make Your Home Beautiful
//       </h1>

//       {/* Products Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
//         {loading
//           ? Array.from({ length: 8 }).map((_, i) => (
//             <Skeleton key={i} className="h-48 w-full rounded-xl" />
//           ))
//           : products.map((product) => (
//             <div
//               key={product._id}
//               onClick={() => navigate(`/products/${product._id}`)}
//               className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
//             >
//               {/* Image */}
//               <div className="aspect-square overflow-hidden bg-gray-100">
//                 <img
//                   src={product?.productImg?.[0]?.url}
//                   alt={product.productName}
//                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                 />
//               </div>

//               {/* Name */}
//               {/* <div className="p-3">
//                     <h2 className="text-sm sm:text-base font-semibold text-center line-clamp-2 h-10">
//                       {product.productName}
//                     </h2>
//                   </div> */}
//             </div>
//           ))}
//       </div>
//     </div>

//   );
// };

// export default HomeProducts;











// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Skeleton } from "@/components/ui/skeleton";
// import { useNavigate } from "react-router-dom";

// const HomeProducts = () => {
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate();

//     const getProducts = async () => {
//         try {
//             setLoading(true);
//             const res = await axios.get("http://localhost:8000/api/v1/product/getallproduct");

//             if (res.data.success) {
//                 setProducts(res.data.products.slice(0, 8)); // show only 8 products
//             }
//         } catch (error) {
//             console.log(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         getProducts();
//     }, []);

//     return (
//         <div className="min-h-screen bg-gradient-to-r from-purple-100 via-pink-50 to-yellow-100 py-16 px-4">
//             {/* Hero Section */}
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-400 animate-textShadow drop-shadow-lg">
//                 Make Your Home Beautiful
//             </h1>

//             {/* Products Grid */}
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
//                 {loading
//                     ? Array.from({ length: 8 }).map((_, i) => (
//                         <Skeleton key={i} className="h-48 w-full rounded-xl" />
//                     ))
//                     : products.map((product) => (
//                         <div
//                             key={product._id}
//                             onClick={() => navigate(`/products/${product._id}`)}
//                             className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group"
//                         >
//                             {/* Image */}
//                             <div className="aspect-square overflow-hidden bg-gray-100">
//                                 <img
//                                     src={product?.productImg?.[0]?.url}
//                                     alt={product.productName}
//                                     className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                                 />
//                             </div>

//                             {/* Name */}
//                             <div className="p-3">
//                                 <h2 className="text-sm font-semibold text-center line-clamp-2 h-10">
//                                     {product.productName}
//                                 </h2>
//                             </div>
//                         </div>
//                     ))
//                 }
//             </div>
//         </div>
//     );
// };

// export default HomeProducts;