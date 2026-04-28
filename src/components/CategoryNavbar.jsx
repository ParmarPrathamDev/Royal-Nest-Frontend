import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";

const CategoryNavbar = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/category/get`);
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-full bg-gradient-to-r from-purple-100 via-pink-50 to-yellow-100 shadow-md py-4 border-b top-0 z-50">
      <div className="flex justify-center flex-wrap gap-6 px-4 sm:px-6">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => navigate(`/products/category/${cat.categoryName}`)}
            className="relative text-gray-700 font-semibold px-4 py-2 rounded-lg  font-semibold
             hover:text-whitetransition-all duration-300 group"
          >
            {cat.categoryName}

            {/* Underline Animation */}
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-pink-500 
                   transition-all duration-300 group-hover:w-full"></span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNavbar;





// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const CategoryNavbar = () => {
//   const [categories, setCategories] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/v1/category/get");
//         if (res.data.success) {
//           setCategories(res.data.categories);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   return (
//     <div className="w-full bg-white shadow-sm border-y py-3">
//       <div className="flex justify-center flex-wrap gap-6 px-4">
//         {categories.map((cat) => (
//           <button
//             key={cat._id}
//             onClick={() => navigate(`/products/category/${cat.categoryName}`)}
//             className="relative text-gray-700 font-medium hover:text-pink-500 transition duration-300 group"
//           >
//             {cat.categoryName}

//             {/* Underline Animation */}
//             <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
//           </button>
//         ))}

//       </div>

//     </div>
//   );
// };

// export default CategoryNavbar;