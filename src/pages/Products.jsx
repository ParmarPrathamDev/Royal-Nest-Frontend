import React, { useEffect, useState } from 'react'
import FilterSideBar from '@/components/FilterSideBar'
import ProductCard from '@/components/ProductCard'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue
} from "@/components/ui/select"
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setProducts } from '@/Redux/productSlice'
import { useParams, useNavigate } from "react-router-dom"
import { SlidersHorizontal } from "lucide-react"
import { API_BASE_URL } from "@/config/api"

const Products = () => {
  const { products } = useSelector((store) => store.product) || { products: [] }

  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [brand, setBrand] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 999999])
  const [sortOrder, setSortOrder] = useState("lowtohigh")
  const [visibleCount, setVisibleCount] = useState(8)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const { categoryName } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
const fetchFilteredProducts = async () => {
  try {
    setLoading(true)

    const res = await axios.get(`${API_BASE_URL}/api/v1/product/getallproduct`)

    if (res.data.success) {
      let data = [...(res.data.products || [])]

      data = data.filter((item) => {
        const matchKeyword =
          !search ||
          item?.productName?.toLowerCase().includes(search.toLowerCase())

        const itemCategory =
          typeof item.category === "object"
            ? item.category?.categoryName
            : item.category

        const matchCategory =
          category === "All" || itemCategory === category

        const matchBrand =
          brand === "All" || item?.brand === brand

        const price = Number(item?.productPrice) || 0
        const matchPrice =
          price >= priceRange[0] && price <= priceRange[1]

        return matchKeyword && matchCategory && matchBrand && matchPrice
      })

      if (sortOrder === "lowtohigh") {
        data.sort((a, b) => (a.productPrice || 0) - (b.productPrice || 0))
      } else if (sortOrder === "hightolow") {
        data.sort((a, b) => (b.productPrice || 0) - (a.productPrice || 0))
      }

      dispatch(setProducts(data))
    }
  } catch (error) {
    console.log("PRODUCT FETCH ERROR:", error?.response?.data || error.message || error)
  } finally {
    setLoading(false)
  }
}
  // const fetchFilteredProducts = async () => {
  //   try {
  //     setLoading(true)

  //     const res = await axios.get("http://localhost:8000/api/v1/product/getallproduct")

  //     if (res.data.success) {
  //       let data = [...(res.data.products || [])]

  //       data = data.filter((item) => {
  //         const matchKeyword =
  //           !search ||
  //           item?.productName?.toLowerCase().includes(search.toLowerCase())

  //         const itemCategory =
  //           typeof item.category === "object"
  //             ? item.category?.categoryName
  //             : item.category

  //         const matchCategory =
  //           category === "All" || itemCategory === category

  //         const matchBrand =
  //           brand === "All" || item?.brand === brand

  //         const price = Number(item?.productPrice) || 0
  //         const matchPrice =
  //           price >= priceRange[0] && price <= priceRange[1]

  //         return matchKeyword && matchCategory && matchBrand && matchPrice
  //       })

  //       if (sortOrder === "lowtohigh") {
  //         data.sort((a, b) => (a.productPrice || 0) - (b.productPrice || 0))
  //       } else if (sortOrder === "hightolow") {
  //         data.sort((a, b) => (b.productPrice || 0) - (a.productPrice || 0))
  //       }

  //       dispatch(setProducts(data))
  //     }
  //   } catch (error) {
  //     console.log("PRODUCT FETCH ERROR:", error?.response?.data || error.message || error)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  useEffect(() => {
    fetchFilteredProducts()
  }, [search, category, brand, priceRange, sortOrder])

  useEffect(() => {
    if (categoryName) {
      setCategory(categoryName)
    } else {
      setCategory("All")
    }
  }, [categoryName])

  useEffect(() => {
    setVisibleCount(8)
  }, [search, category, brand, priceRange, sortOrder])

  return (
    <div className='pt-4 min-h-screen bg-gradient-to-r from-green-50 via-teal-50 to-cyan-50'>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-6 px-3 sm:px-6">
        <FilterSideBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          brand={brand}
          setBrand={setBrand}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          isMobileOpen={isMobileFilterOpen}
          setIsMobileOpen={setIsMobileFilterOpen}
        />

        <div className="flex flex-col flex-1 w-full">
          <div className="flex flex-col gap-3 mb-4">
            <div className="text-xs sm:text-sm text-gray-500 flex flex-wrap items-center gap-2">
              <span
                className="cursor-pointer hover:text-pink-500"
                onClick={() => navigate("/")}
              >
                Home
              </span>

              <span>{'>'}</span>

              <span
                className="cursor-pointer hover:text-pink-500"
                onClick={() => {
                  navigate("/products")
                  setCategory("All")
                }}
              >
                Products
              </span>

              {category !== "All" && (
                <>
                  <span>{'>'}</span>
                  <span className="text-gray-700 font-medium">
                    {category}
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border bg-white hover:bg-gray-50 transition"
              >
                <SlidersHorizontal size={18} />
                Filters
              </button>

              <div className="w-full sm:w-auto sm:ml-auto">
                <Select
                  value={sortOrder}
                  onValueChange={(value) => setSortOrder(value)}
                >
                  <SelectTrigger className="w-full sm:w-[220px] bg-white">
                    <SelectValue placeholder="Sort by Price" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="lowtohigh">
                        Price: Low To High
                      </SelectItem>
                      <SelectItem value="hightolow">
                        Price: High To Low
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {loading ? (
              Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-60 bg-gray-200 rounded animate-pulse"
                ></div>
              ))
            ) : !products || products.length === 0 ? (
              <p className="col-span-full text-center text-gray-500">
                No products found
              </p>
            ) : (
              products
                .filter((p) => p && p._id)
                .slice(0, visibleCount)
                .map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
            )}
          </div>

          {visibleCount < (products?.length || 0) && (
            <div className="flex justify-center mt-6 mb-10">
              <button
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="px-5 py-2 bg-[#FFF2EF] rounded hover:bg-pink-200 transition"
              >
                Show More Products
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.25s ease-out;
        }
      `}</style>
    </div>
  )
}

export default Products





// import React, { useEffect, useState } from 'react'
// import FilterSideBar from '@/components/FilterSideBar'
// import ProductCard from '@/components/ProductCard'
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectValue
// } from "@/components/ui/select"
// import { toast } from 'sonner'
// import axios from 'axios'
// import { useDispatch, useSelector } from 'react-redux'
// import { setProducts } from '@/Redux/productSlice'
// import { useParams, useNavigate } from "react-router-dom"
// import { SlidersHorizontal } from "lucide-react"

// const Products = () => {
//   const { products } = useSelector(Store => Store.product) || { products: [] }

//   const [loading, setLoading] = useState(false)
//   const [search, setSearch] = useState("")
//   const [category, setCategory] = useState("All")
//   const [brand, setBrand] = useState("All")
//   const [priceRange, setPriceRange] = useState([0, 999999])
//   const [sortOrder, setSortOrder] = useState('lowtohigh')
//   const [visibleCount, setVisibleCount] = useState(8)
//   const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

//   const { categoryName } = useParams()
//   const navigate = useNavigate()
//   const dispatch = useDispatch()

//   // const fetchFilteredProducts = async () => {
//   //   try {
//   //     setLoading(true)

//   //     const res = await axios.get("http://localhost:8000/api/v1/product/search", {
//   //       params: {
//   //         keyword: search,
//   //         category,
//   //         brand,
//   //         minPrice: priceRange[0],
//   //         maxPrice: priceRange[1]
//   //       }
//   //     })

//   //     if (res.data.success) {
//   //       let data = [...res.data.products]

//   //       if (sortOrder === "lowtohigh") {
//   //         data.sort((a, b) => a.productPrice - b.productPrice)
//   //       } else if (sortOrder === "hightolow") {
//   //         data.sort((a, b) => b.productPrice - a.productPrice)
//   //       }

//   //       dispatch(setProducts(data))
//   //     }
//   //   } catch (error) {
//   //     console.log(error)
//   //     toast.error("Search failed")
//   //   } finally {
//   //     setLoading(false)
//   //   }
//   // }
// const fetchFilteredProducts = async () => {
//   try {
//     setLoading(true)

//     const res = await axios.get("http://localhost:8000/api/v1/product/get")

//     if (res.data.success) {
//       let data = [...(res.data.products || [])]

//       data = data.filter((item) => {
//         const matchKeyword =
//           !search ||
//           item?.productName?.toLowerCase().includes(search.toLowerCase())

//         const itemCategory =
//           typeof item.category === "object"
//             ? item.category?.categoryName
//             : item.category

//         const matchCategory =
//           category === "All" || itemCategory === category

//         const matchBrand =
//           brand === "All" || item.brand === brand

//         const price = Number(item.productPrice) || 0
//         const matchPrice =
//           price >= priceRange[0] && price <= priceRange[1]

//         return matchKeyword && matchCategory && matchBrand && matchPrice
//       })

//       if (sortOrder === "lowtohigh") {
//         data.sort((a, b) => a.productPrice - b.productPrice)
//       } else if (sortOrder === "hightolow") {
//         data.sort((a, b) => b.productPrice - a.productPrice)
//       }

//       dispatch(setProducts(data))
//     }
//   } catch (error) {
//     console.log(error)
//     toast.error("Products fetch failed")
//   } finally {
//     setLoading(false)
//   }
// }
//   useEffect(() => {
//     fetchFilteredProducts()
//   }, [search, category, brand, priceRange, sortOrder])

//   useEffect(() => {
//     if (categoryName) {
//       setCategory(categoryName)
//     } else {
//       setCategory("All")
//     }
//   }, [categoryName])

//   return (
//     <div className='pt-4 min-h-screen bg-gradient-to-r from-green-50 via-teal-50 to-cyan-50'>
//       <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-6 px-3 sm:px-6">
//         {/* Desktop Sidebar + Mobile Drawer */}
//         <FilterSideBar
//           search={search}
//           setSearch={setSearch}
//           category={category}
//           setCategory={setCategory}
//           brand={brand}
//           setBrand={setBrand}
//           priceRange={priceRange}
//           setPriceRange={setPriceRange}
//           isMobileOpen={isMobileFilterOpen}
//           setIsMobileOpen={setIsMobileFilterOpen}
//         />

//         {/* PRODUCTS */}
//         <div className="flex flex-col flex-1 w-full">
//           {/* TOP BAR */}
//           <div className="flex flex-col gap-3 mb-4">
//             {/* Breadcrumb */}
//             <div className="text-xs sm:text-sm text-gray-500 flex flex-wrap items-center gap-2">
//               <span
//                 className="cursor-pointer hover:text-pink-500"
//                 onClick={() => navigate("/")}
//               >
//                 Home
//               </span>

//               <span>{'>'}</span>

//               <span
//                 className="cursor-pointer hover:text-pink-500"
//                 onClick={() => {
//                   navigate("/products")
//                   setCategory("All")
//                 }}
//               >
//                 Products
//               </span>

//               {category !== "All" && (
//                 <>
//                   <span>{'>'}</span>
//                   <span className="text-gray-700 font-medium">
//                     {category}
//                   </span>
//                 </>
//               )}
//             </div>

//             {/* Filter + Sort Row */}
//             <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
//               {/* Mobile Filter Button */}
//               <button
//                 onClick={() => setIsMobileFilterOpen(true)}
//                 className="lg:hidden w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border bg-white hover:bg-gray-50 transition"
//               >
//                 <SlidersHorizontal size={18} />
//                 Filters
//               </button>

//               {/* SORT */}
//               <div className="w-full sm:w-auto sm:ml-auto">
//                 <Select
//                   value={sortOrder}
//                   onValueChange={(value) => setSortOrder(value)}
//                 >
//                   <SelectTrigger className="w-full sm:w-[220px] bg-white">
//                     <SelectValue placeholder="Sort by Price" />
//                   </SelectTrigger>

//                   <SelectContent>
//                     <SelectGroup>
//                       <SelectItem value="lowtohigh">
//                         Price: Low To High
//                       </SelectItem>
//                       <SelectItem value="hightolow">
//                         Price: High To Low
//                       </SelectItem>
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>

//           {/* GRID */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
//             {loading ? (
//               Array.from({ length: 8 }).map((_, idx) => (
//                 <div
//                   key={idx}
//                   className="h-60 bg-gray-200 rounded animate-pulse"
//                 ></div>
//               ))
//             ) : !products || products.length === 0 ? (
//               <p className="col-span-full text-center text-gray-500">
//                 No products found
//               </p>
//             ) : (
//               products
//                 .filter(p => p && p._id)
//                 .slice(0, visibleCount)
//                 .map(product => (
//                   <ProductCard key={product._id} product={product} />
//                 ))
//             )}
//           </div>

//           {/* SHOW MORE */}
//           {visibleCount < (products?.length || 0) && (
//             <div className="flex justify-center mt-6 mb-10">
//               <button
//                 onClick={() => setVisibleCount(prev => prev + 8)}
//                 className="px-5 py-2 bg-[#FFF2EF] rounded hover:bg-pink-200 transition"
//               >
//                 Show More Products
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Inline animation */}
//       <style>{`
//         @keyframes slideIn {
//           from {
//             transform: translateX(-100%);
//           }
//           to {
//             transform: translateX(0);
//           }
//         }

//         .animate-slideIn {
//           animation: slideIn 0.25s ease-out;
//         }
//       `}</style>
//     </div>
//   )
// }

// export default Products












// import React, { useEffect, useState } from 'react'
// import FilterSideBar from '@/components/FilterSideBar'
// import ProductCard from '@/components/ProductCard'
// import {
//     Select,
//     SelectTrigger,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectValue
// } from "@/components/ui/select"
// import { toast } from 'sonner'
// import axios from 'axios'
// import { useDispatch, useSelector } from 'react-redux'
// import { setProducts } from '@/Redux/productSlice'
// import { useParams, useNavigate } from "react-router-dom"

// const Products = () => {

//     const { products } = useSelector(Store => Store.product) || { products: [] }

//     const [loading, setLoading] = useState(false)

//     const [search, setSearch] = useState("")
//     const [category, setCategory] = useState("All")
//     const [brand, setBrand] = useState("All")
//     const [priceRange, setPriceRange] = useState([0, 999999])
//     const [sortOrder, setSortOrder] = useState('lowtohigh')
//     const [visibleCount, setVisibleCount] = useState(8)

//     const { categoryName } = useParams()
//     const navigate = useNavigate()
//     const dispatch = useDispatch()

//     // FETCH PRODUCTS
//     const fetchFilteredProducts = async () => {
//         try {
//             setLoading(true)

//             const res = await axios.get("http://localhost:8000/api/v1/product/search", {
//                 params: {
//                     keyword: search,
//                     category,
//                     brand,
//                     minPrice: priceRange[0],
//                     maxPrice: priceRange[1]
//                 }
//             })

//             if (res.data.success) {
//                 let data = res.data.products

//                 if (sortOrder === "lowtohigh") {
//                     data.sort((a, b) => a.productPrice - b.productPrice)
//                 } else if (sortOrder === "hightolow") {
//                     data.sort((a, b) => b.productPrice - a.productPrice)
//                 }

//                 dispatch(setProducts(data))
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error("Search failed")
//         } finally {
//             setLoading(false)
//         }
//     }

//     // AUTO FETCH
//     useEffect(() => {
//         fetchFilteredProducts()
//     }, [search, category, brand, priceRange, sortOrder])

//     // CATEGORY FROM URL
//     useEffect(() => {
//         if (categoryName) {
//             setCategory(categoryName)
//         } else {
//             setCategory("All")
//         }
//     }, [categoryName])

//     return (
//         <div className='pt-4 min-h-screen bg-gradient-to-r from-green-50 via-teal-50 to-cyan-50'>

//             <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start gap-6 px-3 sm:px-6">

//                 {/* SIDEBAR */}
//                 <div className="w-full lg:w-[260px] lg:min-w-[260px]">
//                     <FilterSideBar
//                         search={search}
//                         setSearch={setSearch}
//                         category={category}
//                         setCategory={setCategory}
//                         brand={brand}
//                         setBrand={setBrand}
//                         priceRange={priceRange}
//                         setPriceRange={setPriceRange}
//                     />
//                 </div>

//                 {/* PRODUCTS */}
//                 <div className="flex flex-col flex-1 w-full">

//                     {/* TOP BAR */}
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">

//                         {/* Breadcrumb */}
//                         <div className="text-xs sm:text-sm text-gray-500 flex flex-wrap items-center gap-2">
//                             <span
//                                 className="cursor-pointer hover:text-pink-500"
//                                 onClick={() => navigate("/")}
//                             >
//                                 Home
//                             </span>

//                             <span>{'>'}</span>

//                             <span
//                                 className="cursor-pointer hover:text-pink-500"
//                                 onClick={() => {
//                                     navigate("/products")
//                                     setCategory("All")
//                                 }}
//                             >
//                                 Products
//                             </span>

//                             {category !== "All" && (
//                                 <>
//                                     <span>{'>'}</span>
//                                     <span className="text-gray-700 font-medium">
//                                         {category}
//                                     </span>
//                                 </>
//                             )}
//                         </div>

//                         {/* SORT */}
//                         <div className="w-full sm:w-auto">
//                             <Select
//                                 defaultValue="lowtohigh"
//                                 onValueChange={(value) => setSortOrder(value)}
//                             >
//                                 <SelectTrigger className="w-full sm:w-[200px]">
//                                     <SelectValue placeholder="Sort by Price" />
//                                 </SelectTrigger>

//                                 <SelectContent>
//                                     <SelectGroup>
//                                         <SelectItem value="lowtohigh">
//                                             Price: Low To High
//                                         </SelectItem>
//                                         <SelectItem value="hightolow">
//                                             Price: High To Low
//                                         </SelectItem>
//                                     </SelectGroup>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>

//                     {/* GRID */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">

//                         {loading ? (
//                             Array.from({ length: 8 }).map((_, idx) => (
//                                 <div
//                                     key={idx}
//                                     className="h-60 bg-gray-200 rounded animate-pulse"
//                                 ></div>
//                             ))
//                         ) : !products || products.length === 0 ? (
//                             <p className="col-span-full text-center text-gray-500">
//                                 No products found
//                             </p>
//                         ) : (
//                             products
//                                 .filter(p => p && p._id)
//                                 .slice(0, visibleCount)
//                                 .map(product => (
//                                     <ProductCard key={product._id} product={product} />
//                                 ))
//                         )}

//                     </div>

//                     {/* SHOW MORE */}
//                     {visibleCount < (products?.length || 0) && (
//                         <div className="flex justify-center mt-6 mb-10">
//                             <button
//                                 onClick={() => setVisibleCount(prev => prev + 8)}
//                                 className="px-5 py-2 bg-[#FFF2EF] rounded hover:bg-pink-200 transition"
//                             >
//                                 Show More Products
//                             </button>
//                         </div>
//                     )}

//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Products








// import React, { useEffect, useState } from 'react'
// import FilterSideBar from '@/components/FilterSideBar'
// import ProductCard from '@/components/ProductCard'
// import {
//     Select,
//     SelectTrigger,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectValue
// } from "@/components/ui/select"
// import { toast } from 'sonner'
// import axios from 'axios'
// import { useDispatch, useSelector } from 'react-redux'
// import { setProducts } from '@/Redux/productSlice'
// import { useParams, useNavigate } from "react-router-dom"

// const Products = () => {

//     const { products } = useSelector(Store => Store.product) || { products: [] }

//     const [loading, setLoading] = useState(false)

//     const [search, setSearch] = useState("")
//     const [category, setCategory] = useState("All")
//     const [brand, setBrand] = useState("All")
//     const [priceRange, setPriceRange] = useState([0, 999999])
//     const [sortOrder, setSortOrder] = useState('lowtohigh')
//     const [visibleCount, setVisibleCount] = useState(8)

//     const { categoryName } = useParams()
//     const navigate = useNavigate()
//     const dispatch = useDispatch()

//     // ✅ 🔥 BACKEND SEARCH FUNCTION
//     const fetchFilteredProducts = async () => {
//         try {
//             setLoading(true)

//             const res = await axios.get("http://localhost:8000/api/v1/product/search", {
//                 params: {
//                     keyword: search,
//                     category,
//                     brand,
//                     minPrice: priceRange[0],
//                     maxPrice: priceRange[1]
//                 }
//             })

//             if (res.data.success) {
//                 let data = res.data.products

//                 // ✅ sorting frontend ma
//                 if (sortOrder === "lowtohigh") {
//                     data.sort((a, b) => a.productPrice - b.productPrice)
//                 } else if (sortOrder === "hightolow") {
//                     data.sort((a, b) => b.productPrice - a.productPrice)
//                 }

//                 dispatch(setProducts(data))
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error("Search failed")
//         } finally {
//             setLoading(false)
//         }
//     }

//     // ✅ AUTO SEARCH (filters change thay)
//     useEffect(() => {
//         fetchFilteredProducts()
//     }, [search, category, brand, priceRange, sortOrder])

//     // ✅ CATEGORY URL SYNC
//     useEffect(() => {
//         if (categoryName) {
//             setCategory(categoryName)
//         } else {
//             setCategory("All")
//         }
//     }, [categoryName])

//     return (
//         <div className='pt-5 min-h-screen bg-gradient-to-r from-green-50 via-teal-50 to-cyan-50'>

//             <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 px-4 sm:px-6">

//                 {/* SIDEBAR */}
//                 <FilterSideBar
//                     search={search}
//                     setSearch={setSearch}
//                     category={category}
//                     setCategory={setCategory}
//                     brand={brand}
//                     setBrand={setBrand}
//                     priceRange={priceRange}
//                     setPriceRange={setPriceRange}
//                 />

//                 {/* PRODUCTS SECTION */}
//                 <div className="flex flex-col flex-1">

//                     {/* BREADCRUMB + SORT */}
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">

//                         {/* Breadcrumb */}
//                         <div className="text-sm text-gray-500 flex flex-wrap items-center gap-2">
//                             <span
//                                 className="cursor-pointer hover:text-pink-500"
//                                 onClick={() => navigate("/")}
//                             >
//                                 Home
//                             </span>

//                             <span>{'>'}</span>

//                             <span
//                                 className="cursor-pointer hover:text-pink-500"
//                                 onClick={() => {
//                                     navigate("/products")
//                                     setCategory("All")
//                                 }}
//                             >
//                                 Products
//                             </span>

//                             {category !== "All" && (
//                                 <>
//                                     <span>{'>'}</span>
//                                     <span className="text-gray-700 font-medium">
//                                         {category}
//                                     </span>
//                                 </>
//                             )}
//                         </div>

//                         {/* SORT */}
//                         <Select
//                             defaultValue="lowtohigh"
//                             onValueChange={(value) => setSortOrder(value)}
//                         >
//                             <SelectTrigger className="w-full sm:w-[200px]">
//                                 <SelectValue placeholder="Sort by Price" />
//                             </SelectTrigger>

//                             <SelectContent>
//                                 <SelectGroup>
//                                     <SelectItem value="lowtohigh">
//                                         Price: Low To High
//                                     </SelectItem>
//                                     <SelectItem value="hightolow">
//                                         Price: High To Low
//                                     </SelectItem>
//                                 </SelectGroup>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* PRODUCTS GRID */}
//  {/* PRODUCTS GRID */}
// <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

//   {loading ? (
//     // Skeleton placeholders
//     Array.from({ length: 8 }).map((_, idx) => (
//       <div
//         key={idx}
//         className="h-64 bg-gray-200 rounded animate-pulse"
//       ></div>
//     ))
//   ) : !products || products.length === 0 ? (
//     <p className="col-span-full text-center text-gray-500">
//       No products found
//     </p>
//   ) : (
//     products
//       .filter(p => p && p._id)
//       .slice(0, visibleCount)
//       .map(product => (
//         <ProductCard key={product._id} product={product} />
//       ))
//   )}

// </div>
//                     {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

//                         {loading ? (
//                             <p className="col-span-full text-center text-gray-500">
//                                 Loading products...
//                             </p>
//                         ) : !products || products.length === 0 ? (
//                             <p className="col-span-full text-center text-gray-500">
//                                 No products found
//                             </p>
//                         ) : (
//                             products
//                                 .filter(p => p && p._id)
//                                 .slice(0, visibleCount)
//                                 .map(product => (
//                                     <ProductCard
//                                         key={product._id}
//                                         product={product}
//                                     />
//                                 ))
//                         )}

//                     </div> */}

//                     {/* SHOW MORE */}
//                     {/* SHOW MORE BUTTON */}
//             {visibleCount < (products?.length || 0) && (
//                  <div className="flex justify-center mt-8 mb-12">  {/* mb-12 = margin bottom 3rem */}
//                    <button
//                          onClick={() => setVisibleCount(prev => prev + 8)}
//                          className="px-6 py-2 bg-[#FFF2EF] text-black rounded hover:bg-pink-200 transition"
//                         >
//                         Show More Products
//                     </button>
//                  </div>
//         )}
//                     {/* {visibleCount < (products?.length || 0) && (
//                         <div className="flex justify-center mt-8">
//                             <button
//                                 onClick={() => setVisibleCount(prev => prev + 8)}
//                                 className="px-6 py-2 bg-[#FFF2EF] text-black rounded hover:bg-pink-200 transition"
//                             >
//                                 Show More Products
//                             </button>
//                         </div>
//                     )} */}

//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Products






// 24-3 aa kariyu backend thi search karava mate 



// import React, { useEffect, useState } from 'react'
// import FilterSideBar from '@/components/FilterSideBar'
// import ProductCard from '@/components/ProductCard'
// import {
//     Select,
//     SelectTrigger,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectValue
// } from "@/components/ui/select"
// import { toast } from 'sonner'
// import axios from 'axios'
// import { useDispatch, useSelector } from 'react-redux'
// import { setProducts } from '@/Redux/productSlice'
// import { useParams, useNavigate } from "react-router-dom"

// const Products = () => {

//     const { products } = useSelector(Store => Store.product) || { products: [] }

//     const [allProducts, setAllProducts] = useState([])
//     const [loading, setLoading] = useState(false)

//     const [search, setSearch] = useState("")
//     const [category, setCategory] = useState("All")
//     const [brand, setBrand] = useState("All")
//     const [priceRange, setPriceRange] = useState([0, 999999])
//     const [sortOrder, setSortOrder] = useState('lowtohigh')
//     const [visibleCount, setVisibleCount] = useState(8)

//     const { categoryName } = useParams()
//     const navigate = useNavigate()
//     const dispatch = useDispatch()

//     // ✅ FETCH PRODUCTS
//     const getAllProduct = async () => {
//         try {
//             setLoading(true)

//             const res = await axios.get("http://localhost:8000/api/v1/product/getallproduct")

//             if (res.data.success) {
//                 const filteredProducts = res.data.products?.filter(p => p != null) || []
//                 setAllProducts(filteredProducts)
//                 dispatch(setProducts(filteredProducts))
//             }

//         } catch (error) {
//             console.log(error)
//             toast.error(error?.response?.data?.message || "Something went wrong")
//         } finally {
//             setLoading(false)
//         }
//     }

//     // ✅ FILTER LOGIC
//     useEffect(() => {

//         if (!allProducts || allProducts.length === 0) return;

//         let filtered = [...allProducts]

//         // search
//         if (search.trim() !== "") {
//             filtered = filtered.filter(p =>
//                 p?.productName?.toLowerCase().includes(search.toLowerCase())
//             )
//         }

//         // category
//         if (category !== "All") {
//             filtered = filtered.filter(p =>
//                 p?.category?.categoryName === category
//             )
//         }

//         // brand
//         if (brand !== "All") {
//             filtered = filtered.filter(p =>
//                 p?.brand === brand
//             )
//         }

//         // price
//         filtered = filtered.filter(p =>
//             p?.productPrice >= priceRange[0] &&
//             p?.productPrice <= priceRange[1]
//         )

//         // sorting
//         if (sortOrder === "lowtohigh") {
//             filtered.sort((a, b) => (a?.productPrice || 0) - (b?.productPrice || 0))
//         } else if (sortOrder === "hightolow") {
//             filtered.sort((a, b) => (b?.productPrice || 0) - (a?.productPrice || 0))
//         }

//         dispatch(setProducts(filtered))

//     }, [search, category, brand, sortOrder, priceRange, allProducts])

//     // ✅ INITIAL FETCH
//     useEffect(() => {
//         getAllProduct()
//     }, [])

//     // ✅ CATEGORY SYNC
//     useEffect(() => {
//         if (categoryName) {
//             setCategory(categoryName)
//         } else {
//             setCategory("All")
//         }
//     }, [categoryName])

//     return (
//         <div className='pt-5 min-h-screen bg-gradient-to-r from-green-50 via-teal-50 to-cyan-50'>

//             <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 px-4 sm:px-6">

//                 {/* SIDEBAR */}
//                 <FilterSideBar
//                     search={search}
//                     setSearch={setSearch}
//                     category={category}
//                     setCategory={setCategory}
//                     brand={brand}
//                     setBrand={setBrand}
//                     allProducts={allProducts}
//                     priceRange={priceRange}
//                     setPriceRange={setPriceRange}
//                 />

//                 {/* PRODUCTS SECTION */}
//                 <div className="flex flex-col flex-1">

//                     {/* BREADCRUMB + SORT */}
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">

//                         {/* Breadcrumb */}
//                         <div className="text-sm text-gray-500 flex flex-wrap items-center gap-2">
//                             <span
//                                 className="cursor-pointer hover:text-pink-500"
//                                 onClick={() => navigate("/")}
//                             >
//                                 Home
//                             </span>

//                             <span>{'>'}</span>

//                             <span
//                                 className="cursor-pointer hover:text-pink-500"
//                                 onClick={() => {
//                                     navigate("/products")
//                                     setCategory("All")
//                                 }}
//                             >
//                                 Products
//                             </span>

//                             {category !== "All" && (
//                                 <>
//                                     <span>{'>'}</span>
//                                     <span className="text-gray-700 font-medium">
//                                         {category}
//                                     </span>
//                                 </>
//                             )}
//                         </div>

//                         {/* SORT */}
//                         <Select
//                             defaultValue="lowtohigh"
//                             onValueChange={(value) => setSortOrder(value)}
//                         >
//                             <SelectTrigger className="w-full sm:w-[200px]">
//                                 <SelectValue placeholder="Sort by Price" />
//                             </SelectTrigger>

//                             <SelectContent>
//                                 <SelectGroup>
//                                     <SelectItem value="lowtohigh">
//                                         Price: Low To High
//                                     </SelectItem>
//                                     <SelectItem value="hightolow">
//                                         Price: High To Low
//                                     </SelectItem>
//                                 </SelectGroup>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* PRODUCTS GRID */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

//                         {loading ? (
//                             <p className="col-span-full text-center text-gray-500">
//                                 Loading products...
//                             </p>
//                         ) : !products || products.length === 0 ? (
//                             <p className="col-span-full text-center text-gray-500">
//                                 No products found
//                             </p>
//                         ) : (
//                             products
//                                 .filter(p => p && p._id) // ✅ remove null / undefined
//                                 .slice(0, visibleCount)
//                                 .map(product => (
//                                     <ProductCard
//                                         key={product._id}
//                                         product={product}
//                                     />
//                                 ))
//                         )}

//                     </div>

//                     {/* SHOW MORE */}
//                     {visibleCount < (products?.length || 0) && (
//                         <div className="flex justify-center mt-8">
//                             <button
//                                 onClick={() => setVisibleCount(prev => prev + 8)}
//                                 className="px-6 py-2 bg-[#FFF2EF] text-black rounded hover:bg-pink-200 transition"
//                             >
//                                 Show More Products
//                             </button>
//                         </div>
//                     )}

//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Products




// ok j hatu but olu product per natu aav tu and responsive natu 


// import React, { useEffect, useState } from 'react'
// import FilterSideBar from '@/components/FilterSideBar'
// import ProductCard from '@/components/ProductCard'
// import { Select, SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectValue } from "@/components/ui/select"
// import { toast } from 'sonner'
// import axios from 'axios'
// import { useDispatch, useSelector } from 'react-redux'
// import { setProducts } from '@/Redux/productSlice'
// import { useParams, useNavigate } from "react-router-dom"


// const Products = () => {

//     const { products } = useSelector(Store => Store.product)

//     const [allProducts, setAllProducts] = useState([])
//     const [loading, setLoading] = useState(false)

//     const [search, setSearch] = useState("")
//     const [category, setCategory] = useState("All")
//     const [brand, setBrand] = useState("All")
//     const [priceRange, setPriceRange] = useState([0, 999999])
//     const [sortOrder, setSortOrder] = useState('lowtohigh')
//     const [visibleCount, setVisibleCount] = useState(8)

//     const { categoryName } = useParams()
//     const navigate = useNavigate()
//     const dispatch = useDispatch()

//     // Fetch products
//     const getAllProduct = async () => {
//         try {
//             setLoading(true)

//             const res = await axios.get("http://localhost:8000/api/v1/product/getallproduct")

//             if (res.data.success) {
//                 setAllProducts(res.data.products || [])
//                 dispatch(setProducts(res.data.products))
//             }

//         } catch (error) {

//             console.log(error)
//             toast.error(error?.response?.data?.message || "Something went wrong")

//         } finally {
//             setLoading(false)
//         }
//     }

//     // Filtering
//     useEffect(() => {

//         if (allProducts.length === 0) return;

//         let filtered = [...allProducts]

//         if (search.trim() !== "") {
//             filtered = filtered.filter(p =>
//                 p.productName?.toLowerCase().includes(search.toLowerCase())
//             )
//         }

//         if (category !== "All") {
//             filtered = filtered.filter(p =>
//                 p.category?.categoryName === category
//             )
//         }

//         if (brand !== "All") {
//             filtered = filtered.filter(p =>
//                 p.brand === brand
//             )
//         }

//         filtered = filtered.filter(p =>
//             p.productPrice >= priceRange[0] &&
//             p.productPrice <= priceRange[1]
//         )

//         if (sortOrder === "lowtohigh") {
//             filtered.sort((a, b) => a.productPrice - b.productPrice)
//         }
//         else if (sortOrder === "hightolow") {
//             filtered.sort((a, b) => b.productPrice - a.productPrice)
//         }

//         dispatch(setProducts(filtered))

//     }, [search, category, brand, sortOrder, priceRange, allProducts])

//     useEffect(() => {
//         getAllProduct()
//     }, [])

//     // URL category
//     useEffect(() => {
//         if (categoryName) {
//             setCategory(categoryName)
//         }
//     }, [categoryName])


//     return (
//        <div className='pt-5 min-h-screen bg-gradient-to-r from-green-50 via-teal-50 to-cyan-50'>
//             <div className="max-w-7xl mx-auto flex gap-7 items-start ">
//             {/* <div className="max-w-7xl mx-auto flex gap-7"> */}
//                 {/* Sidebar */}
                
//                 <FilterSideBar
//                     search={search}
//                     setSearch={setSearch}
//                     category={category}
//                     setCategory={setCategory}
//                     brand={brand}
//                     setBrand={setBrand}
//                     allProducts={allProducts}
//                     priceRange={priceRange}
//                     setPriceRange={setPriceRange}
//                 />
//                 {/* Products Section */}
//                 <div className="flex flex-col flex-1">

//                     {/* Breadcrumb + Sort */}
//                     <div className="flex justify-between items-center mb-4">
//                         <div className="text-sm text-gray-500 flex items-center gap-2">
//                             <span
//                                 className="cursor-pointer hover:text-pink-500"
//                                 onClick={() => navigate("/")}
//                             >
//                                 Home
//                             </span>
//                             <span>{'>'}</span>
//                             <span
//                                 className="cursor-pointer hover:text-pink-500"
//                                 onClick={() => navigate("/products")}
//                             >
//                                 Products
//                             </span>
//                             {category !== "All" && (
//                                 <>
//                                     <span>{'>'}</span>
//                                     <span className="text-gray-700 font-medium">
//                                         {category}
//                                     </span>
//                                 </>
//                             )}
//                         </div>
//                         {/* Sort Dropdown */}
//                         <Select
//                             defaultValue="lowtohigh"
//                             onValueChange={(value) => setSortOrder(value)}>
                        
//                             <SelectTrigger className="w-[200px]">
//                                 <SelectValue placeholder="Sort by Price" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectGroup>
//                                     <SelectItem value="lowtohigh">
//                                         Price: Low To High
//                                     </SelectItem>
//                                     <SelectItem value="hightolow">
//                                         Price: High To Low
//                                     </SelectItem>
//                                 </SelectGroup>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                     {/* Products */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
//                         {products?.slice(0, visibleCount).map((product) => {
//                             if (!product) return null
//                             return (
//                                 <ProductCard
//                                     key={product._id}
//                                     product={product}
//                                     loading={loading}
//                                 />
//                             )
//                         })}
//                     </div>  
//                     {/* Show More */}
//                     {visibleCount < products.length && (

//                         <div className="flex justify-center mt-8">

//                             <button
//                                 onClick={() => setVisibleCount(prev => prev + 8)}
//                                 className="px-6 py-2 bg-[#FFF2EF] text-black rounded hover:bg-pink-200"
//                             >
//                                 Show More Products
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Products



// import React, { useEffect, useState } from 'react'
// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import FilterSideBar from '@/components/FilterSideBar'
// import ProductCard from '@/components/ProductCard'
// import { toast } from 'sonner'
// import axios from 'axios'
// import { useDispatch, useSelector } from 'react-redux'
// import { setProducts } from '@/Redux/productSlice'
// import { Button } from '@/components/ui/button'

// const Products = () => {
//     const { products } = useSelector(Store => Store.product)
//     const [allProducts, setAllProducts] = useState([])
//     const [loading, setLoading] = useState(false)
//     const [search, setSearch] = useState("")
//     const [category, setCategory] = useState("All")
//     const [brand, setSBrand] = useState("All")
//     const [sortOrder, setSortOrder] = useState('lowtohigh')
//     const [priceRange, setPriceRange] = useState([0, 999999])
//     const [visibleCount, setVisibleCount] = useState(9)
//     const dispatch = useDispatch()

//     const getAllProduct = async () => {
//         try {
//             setLoading(true)
//             const res = await axios.get("http://localhost:8000/api/v1/product/getallproduct")
//             console.log("API Response:", res.data) // debug
//             if (res.data.success) {
//                 setAllProducts(res.data.products || [])
//                 dispatch(setProducts(res.data.products))
//             }
//         } catch (error) {
//             console.log(error)
//             toast.error(error?.response?.data?.message || "Something went wrong")
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         if (allProducts.length === 0) return;

//         let filtered = [...allProducts]

//         if (search.trim() !== "") {
//             filtered = filtered.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase()))
//         }

//         // ================= CATEGORY FILTER CHANGE =================
//         // ✅ OLD: filtered = filtered.filter(p => p.category === category)
//         // ✅ NEW: category is now populated object, so compare with categoryName
//         if (category !== "All") {
//             filtered = filtered.filter(p => p.category?.categoryName === category)
//         }

//         if (brand !== "All") {
//             filtered = filtered.filter(p => p.brand === brand)
//         }

//         filtered = filtered.filter(p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])

//         if (sortOrder === "lowtohigh") {
//             filtered.sort((a, b) => a.productPrice - b.productPrice)
//         } else if (sortOrder === "hightolow") {
//             filtered.sort((a, b) => b.productPrice - a.productPrice)
//         }

//         dispatch(setProducts(filtered))
//     }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch])

//     useEffect(() => {
//         getAllProduct()
//     }, [])

//     console.log(allProducts);

//     return (
//         <div className='pt-5'>
//             <div className="max-w-7xl mx-auto flex gap-7">

//                 {/* Sidebar */}
//                 <FilterSideBar
//                     search={search}
//                     setSearch={setSearch}
//                     category={category}
//                     setCategory={setCategory}
//                     brand={brand}
//                     setBrand={setSBrand}
//                     allProducts={allProducts}
//                     priceRange={priceRange}
//                     setPriceRange={setPriceRange}
//                 />

//                 <div className="flex flex-col flex-1">

//                     {/* Sort Dropdown */}
//                     <div className="flex justify-end mb-4">
//                         <Select defaultValue="lowtohigh" onValueChange={(value) => setSortOrder(value)}>
//                             <SelectTrigger className="w-[200px]">
//                                 <SelectValue placeholder="Sort by Price" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectGroup>
//                                     <SelectItem value="lowtohigh">Price: Low To High</SelectItem>
//                                     <SelectItem value="hightolow">Price: High To Low</SelectItem>
//                                 </SelectGroup>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* Product Grid */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-7">
//                         {
//                             products?.slice(0, visibleCount).map((product) => {
//                                 if (!product) return null;
//                                 return (
//                                     <ProductCard
//                                         key={product?._id}
//                                         product={product}
//                                         loading={loading}
//                                     />
//                                 )
//                             })
//                         }
//                     </div>

//                     {/* Show More Button */}
//                     {
//                         visibleCount < products.length && (
//                             <div className="flex justify-center mt-8">
//                                 {/* <button
//                                     onClick={() => setVisibleCount(prev => prev + 9)}
//                                     className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
//                                 >
//                                     Show More
//                                 </button> */}

//                                 <Button onClick={() => setVisibleCount(prev => prev + 9)} className='bg-pink-600 w-max px-6 py-2 rounded hover:bg-gray-800'>
//                                     Show more
//                                 </Button>
//                             </div>
//                         )
//                     }

//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Products



// import React, { useEffect, useState } from 'react'
// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import FilterSideBar from '@/components/FilterSideBar'
// import ProductCard from '@/components/ProductCard'
// import { toast } from 'sonner'
// import axios from 'axios'
// import { useDispatch, useSelector } from 'react-redux'
// import { setProducts } from '@/Redux/productSlice'


// const Products = () => {
//     const { products } = useSelector(Store => Store.product)
//     const [allProducts, setAllProducts] = useState([])
//     const [loading, setLoading] = useState(false)
//     const [search, setSearch] = useState("")
//     const [category, setCategory] = useState("All")
//     const [brand, setSBrand] = useState("All")
//     // const [sortOrder, setSortOrder] = useState('')
//     const [sortOrder, setSortOrder] = useState('lowtohigh')
//     const [priceRange, setPriceRange] = useState([0, 999999])
//     const [visibleCount, setVisibleCount] = useState(9)
//     const dispatch = useDispatch()
//     // const [searchTerm,setSearchTerm] =


//     const getAllProduct = async () => {
//         try {
//             setLoading(true)
//             const res = await axios.get("http://localhost:8000/api/v1/product/getallproduct")
//             console.log("API Response:", res.data) // debug
//             if (res.data.success) {
//                 setAllProducts(res.data.products || [])
//                 dispatch(setProducts(res.data.products))
//             }
//         } catch (error) {
//             console.log(error)
//             toast.error(error?.response?.data?.message || "Something went wrong")
//         } finally {
//             setLoading(false)
//         }
//     }

//     useEffect(() => {
//         if (allProducts.length === 0) return;

//         let filtered = [...allProducts]

//         if (search.trim() !== "") {
//             filtered = filtered.filter(p => p.productName?.toLowerCase().includes(search.toLowerCase()))
//         }

//         if (category !== "All") {
//             filtered = filtered.filter(p => p.category === category)
//         }
//         if (brand !== "All") {
//             filtered = filtered.filter(p => p.brand === brand)
//         }

//         filtered = filtered.filter(p => p.productPrice >= priceRange[0] && p.productPrice <= priceRange[1])

//         if (sortOrder === "lowtohigh") {
//             filtered.sort((a, b) => a.productPrice - b.productPrice)
//         } else if (sortOrder === "hightolow") {
//             filtered.sort((a, b) => b.productPrice - a.productPrice)
//         }

//         dispatch(setProducts(filtered))
//     }, [search, category, brand, sortOrder, priceRange, allProducts, dispatch])

//     useEffect(() => {
//         getAllProduct()
//     }, [])
//     console.log(allProducts);
//     return (
//         <div className='pt-5'>
//             <div className="max-w-7xl mx-auto flex gap-7">

//                 {/* Sidebar */}
//                 <FilterSideBar
//                     search={search}
//                     setSearch={setSearch}
//                     category={category}
//                     setCategory={setCategory}
//                     brand={brand}
//                     setBrand={setSBrand}
//                     allProducts={allProducts}
//                     priceRange={priceRange}
//                     setPriceRange={setPriceRange}

//                 />

//                 <div className="flex flex-col flex-1">

//                     {/* Sort Dropdown */}
//                     <div className="flex justify-end mb-4">
//                         <Select defaultValue="lowtohigh" onValueChange={(value) => setSortOrder(value)}>
//                             <SelectTrigger className="w-[200px]">
//                                 <SelectValue placeholder="Sort by Price" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 <SelectGroup>
//                                     <SelectItem value="lowtohigh">Price: Low To High</SelectItem>
//                                     <SelectItem value="hightolow">Price: High To Low</SelectItem>
//                                 </SelectGroup>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* Product Grid */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-7">
//                         {/* {
//                             products.map((product) => {
//                                 return <ProductCard key={product._id} product={product} loading={loading} />
//                             })
//                         } */}
//                         {
//                             products?.slice(0, visibleCount).map((product) => {
//                                 if (!product) return null;
//                                 return (
//                                     <ProductCard
//                                         key={product?._id}
//                                         product={product}
//                                         loading={loading}
//                                     />
//                                 )
//                             })
//                         }
//                     </div>
//                     {/* Show More Button */}
//                     {
//                         visibleCount < products.length && (
//                             <div className="flex justify-center mt-8">
//                                 <button
//                                     onClick={() => setVisibleCount(prev => prev + 9)}
//                                     className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
//                                 >
//                                     Show More Products
//                                 </button>
//                             </div>
//                         )
//                     }

//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Products
