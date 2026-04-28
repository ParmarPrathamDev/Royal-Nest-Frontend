import React, { useEffect, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue
} from "@/components/ui/select"
import axios from 'axios'
import { X } from "lucide-react"

const FilterSideBar = ({
  search,
  setSearch,
  category,
  setCategory,
  brand,
  setBrand,
  priceRange,
  setPriceRange,
  isMobileOpen = false,
  setIsMobileOpen = () => {}
}) => {
  const [allCategories, setAllCategories] = useState([])
  const [allBrands, setAllBrands] = useState([])
  const [searchInput, setSearchInput] = useState(search || "")

  useEffect(() => {
    setSearchInput(search || "")
  }, [search])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/category/get")
        if (res.data.success) {
          setAllCategories(res.data.categories.map(c => c.categoryName))
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchBrands = async () => {
      try {
const res = await axios.get("http://localhost:8000/api/v1/product/getallproduct") 

        if (res.data.success) {
          let products = res.data.products || []

          if (category !== "All") {
            products = products.filter((p) => {
              const itemCategory =
                typeof p.category === "object"
                  ? p.category?.categoryName
                  : p.category

              return itemCategory === category
            })
          }

          const brands = [...new Set(products.map(p => p.brand).filter(Boolean))]
          setAllBrands(brands)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchBrands()
    setBrand("All")
  }, [category, setBrand])

  const handleSearch = () => {
    setSearch(searchInput)
    setIsMobileOpen(false)
  }

  const handleMinChange = (e) => {
    const value = Number(e.target.value)

    if (isNaN(value)) return

    if (value >= 0 && value <= priceRange[1]) {
      setPriceRange([value, priceRange[1]])
    }
  }

  const handleMaxChange = (e) => {
    const value = Number(e.target.value)

    if (isNaN(value)) return

    if (value >= priceRange[0] && value <= 999999) {
      setPriceRange([priceRange[0], value])
    }
  }

  const resetFilters = () => {
    setSearchInput("")
    setSearch("")
    setCategory("All")
    setBrand("All")
    setPriceRange([0, 999999])
    setIsMobileOpen(false)
  }

  const filterContent = (
    <div className='bg-gray-50 h-full p-4 sm:p-5 rounded-none lg:rounded-md w-full'>
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        <button
          onClick={() => setIsMobileOpen(false)}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <X size={20} />
        </button>
      </div>

      <Input
        type='text'
        placeholder='Search...'
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch()
        }}
        className='bg-white p-2 border-gray-300 border w-full text-sm sm:text-base'
      />

      <Button
        onClick={handleSearch}
        className='mt-2 w-full bg-blue-600 text-white hover:bg-blue-700'
      >
        Search
      </Button>

      <h1 className='mt-4 font-semibold text-base sm:text-lg text-neutral-700'>Category</h1>
      <div className='flex flex-col gap-2 mt-2 max-h-[260px] overflow-y-auto pr-1'>
        <label className='flex items-center gap-2 text-sm sm:text-base'>
          <input
            type='radio'
            value='All'
            checked={category === 'All'}
            onChange={() => setCategory("All")}
          />
          All
        </label>

        {allCategories.map((cat, index) => (
          <label key={index} className='flex items-center gap-2 text-sm sm:text-base'>
            <input
              type='radio'
              value={cat}
              checked={category === cat}
              onChange={() => setCategory(cat)}
            />
            {cat}
          </label>
        ))}
      </div>

      <h1 className='mt-4 font-semibold text-base sm:text-lg text-neutral-700'>Brand</h1>
      <Select value={brand} onValueChange={setBrand}>
        <SelectTrigger className='w-full mt-2 bg-white text-sm sm:text-base'>
          <SelectValue placeholder="Select Brand" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectItem value="All">All</SelectItem>
            {allBrands.map((b, index) => (
              <SelectItem key={index} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <h1 className='mt-5 font-semibold text-base sm:text-lg text-neutral-700 mb-3'>
        Price Range
      </h1>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-md bg-white border px-3 py-2 text-xs sm:text-sm font-medium text-gray-700">
          <span>₹{priceRange[0]}</span>
          <span>₹{priceRange[1]}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <input
            type='number'
            min={0}
            max={999999}
            step={100}
            value={priceRange[0]}
            onChange={handleMinChange}
            className='w-full p-2 border border-gray-300 rounded bg-white text-sm outline-none'
          />
          <span className='hidden sm:block text-gray-500'>-</span>
          <input
            type='number'
            min={0}
            max={999999}
            step={100}
            value={priceRange[1]}
            onChange={handleMaxChange}
            className='w-full p-2 border border-gray-300 rounded bg-white text-sm outline-none'
          />
        </div>
      </div>

      <Button
        onClick={resetFilters}
        className='bg-pink-600 mt-5 text-white w-full hover:bg-pink-700'
      >
        Reset Filters
      </Button>
    </div>
  )

  return (
    <>
      <div className='hidden lg:block w-full lg:w-[260px] lg:min-w-[260px] lg:sticky lg:top-24 self-start h-fit'>
        {filterContent}
      </div>

      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileOpen(false)}
          ></div>

          <div className="absolute left-0 top-0 h-full w-[85%] max-w-[340px] bg-white shadow-xl overflow-y-auto animate-slideIn">
            {filterContent}
          </div>
        </div>
      )}
    </>
  )
}

export default FilterSideBar








// import React, { useEffect, useState } from 'react'
// import { Input } from './ui/input'
// import { Button } from './ui/button'
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectValue
// } from "@/components/ui/select"
// import axios from 'axios'
// import { useDispatch } from "react-redux"
// import { setProducts } from "@/Redux/productSlice"
// import { X } from "lucide-react"

// const FilterSideBar = ({
//   category,
//   setCategory,
//   brand,
//   setBrand,
//   priceRange,
//   setPriceRange,
//   isMobileOpen = false,
//   setIsMobileOpen = () => {}
// }) => {
//   const dispatch = useDispatch()

//   const [allCategories, setAllCategories] = useState([])
//   const [allBrands, setAllBrands] = useState([])
//   const [searchInput, setSearchInput] = useState("")

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/v1/category/get")
//         if (res.data.success) {
//           setAllCategories(res.data.categories.map(c => c.categoryName))
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }

//     fetchCategories()
//   }, [])

//   useEffect(() => {
//     const fetchBrands = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/v1/product/search", {
//           params: {
//             category: category,
//             brand: "All",
//             minPrice: 0,
//             maxPrice: 999999
//           }
//         })

//         if (res.data.success) {
//           const products = res.data.products
//           const brands = [...new Set(products.map(p => p.brand).filter(Boolean))]
//           setAllBrands(brands)
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }

//     fetchBrands()
//     setBrand("All")
//   }, [category, setBrand])

//   const handleSearch = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/api/v1/product/search", {
//         params: {
//           keyword: searchInput,
//           category,
//           brand,
//           minPrice: priceRange[0],
//           maxPrice: priceRange[1]
//         }
//       })

//       if (res.data.success) {
//         dispatch(setProducts(res.data.products))
//         setIsMobileOpen(false)
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   useEffect(() => {
//     handleSearch()
//   }, [category, brand, priceRange])

//   const handleMinChange = (e) => {
//     const value = Number(e.target.value)

//     if (isNaN(value)) return

//     if (value >= 0 && value <= priceRange[1]) {
//       setPriceRange([value, priceRange[1]])
//     }
//   }

//   const handleMaxChange = (e) => {
//     const value = Number(e.target.value)

//     if (isNaN(value)) return

//     if (value >= priceRange[0] && value <= 999999) {
//       setPriceRange([priceRange[0], value])
//     }
//   }

//   const resetFilters = () => {
//     setSearchInput("")
//     setCategory("All")
//     setBrand("All")
//     setPriceRange([0, 999999])
//     setIsMobileOpen(false)
//   }

//   const filterContent = (
//     <div className='bg-gray-50 h-full p-4 sm:p-5 rounded-none lg:rounded-md w-full'>
//       {/* Mobile Header */}
//       <div className="flex items-center justify-between mb-4 lg:hidden">
//         <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
//         <button
//           onClick={() => setIsMobileOpen(false)}
//           className="p-2 rounded-full hover:bg-gray-200 transition"
//         >
//           <X size={20} />
//         </button>
//       </div>

//       <Input
//         type='text'
//         placeholder='Search...'
//         value={searchInput}
//         onChange={(e) => {
//           const value = e.target.value
//           if (/^[A-Za-z\s]*$/.test(value)) {
//             setSearchInput(value)
//           }
//         }}
//         onKeyDown={(e) => {
//           if (e.key === "Enter") handleSearch()
//         }}
//         className='bg-white p-2 border-gray-300 border w-full text-sm sm:text-base'
//       />

//       <Button
//         onClick={handleSearch}
//         className='mt-2 w-full bg-blue-600 text-white hover:bg-blue-700'
//       >
//         Search
//       </Button>

//       <h1 className='mt-4 font-semibold text-base sm:text-lg text-neutral-700'>Category</h1>
//       <div className='flex flex-col gap-2 mt-2 max-h-[260px] overflow-y-auto pr-1'>
//         <label className='flex items-center gap-2 text-sm sm:text-base'>
//           <input
//             type='radio'
//             value='All'
//             checked={category === 'All'}
//             onChange={() => setCategory("All")}
//           />
//           All
//         </label>

//         {allCategories.map((cat, index) => (
//           <label key={index} className='flex items-center gap-2 text-sm sm:text-base'>
//             <input
//               type='radio'
//               value={cat}
//               checked={category === cat}
//               onChange={() => setCategory(cat)}
//             />
//             {cat}
//           </label>
//         ))}
//       </div>

//       <h1 className='mt-4 font-semibold text-base sm:text-lg text-neutral-700'>Brand</h1>
//       <Select value={brand} onValueChange={setBrand}>
//         <SelectTrigger className='w-full mt-2 bg-white text-sm sm:text-base'>
//           <SelectValue placeholder="Select Brand" />
//         </SelectTrigger>

//         <SelectContent>
//           <SelectGroup>
//             <SelectItem value="All">All</SelectItem>
//             {allBrands.map((b, index) => (
//               <SelectItem key={index} value={b}>
//                 {b}
//               </SelectItem>
//             ))}
//           </SelectGroup>
//         </SelectContent>
//       </Select>

//       <h1 className='mt-5 font-semibold text-base sm:text-lg text-neutral-700 mb-3'>
//         Price Range
//       </h1>

//       <div className="flex flex-col gap-3">
//         <div className="flex items-center justify-between rounded-md bg-white border px-3 py-2 text-xs sm:text-sm font-medium text-gray-700">
//           <span>₹{priceRange[0]}</span>
//           <span>₹{priceRange[1]}</span>
//         </div>

//         <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
//           <input
//             type='number'
//             min={0}
//             max={999999}
//             step={100}
//             value={priceRange[0]}
//             onChange={handleMinChange}
//             className='w-full p-2 border border-gray-300 rounded bg-white text-sm outline-none'
//           />
//           <span className='hidden sm:block text-gray-500'>-</span>
//           <input
//             type='number'
//             min={0}
//             max={999999}
//             step={100}
//             value={priceRange[1]}
//             onChange={handleMaxChange}
//             className='w-full p-2 border border-gray-300 rounded bg-white text-sm outline-none'
//           />
//         </div>

//         {/* <div className="bg-white border rounded-lg p-3 flex flex-col gap-3">
//           <div>
//             <p className="text-xs sm:text-sm text-gray-500 mb-1">Minimum Price</p>
//             <input
//               type='range'
//               min={0}
//               max={999999}
//               step={100}
//               value={priceRange[0]}
//               onChange={handleMinChange}
//               className="w-full cursor-pointer"
//             />
//           </div>

//           <div>
//             <p className="text-xs sm:text-sm text-gray-500 mb-1">Maximum Price</p>
//             <input
//               type='range'
//               min={0}
//               max={999999}
//               step={100}
//               value={priceRange[1]}
//               onChange={handleMaxChange}
//               className="w-full cursor-pointer"
//             />
//           </div>
//         </div> */}
//       </div>

//       <Button
//         onClick={resetFilters}
//         className='bg-pink-600 mt-5 text-white w-full hover:bg-pink-700'
//       >
//         Reset Filters
//       </Button>
//     </div>
//   )

//   return (
//     <>
//       {/* Desktop Sidebar */}
//       <div className='hidden lg:block w-full lg:w-[260px] lg:min-w-[260px] lg:sticky lg:top-24 self-start h-fit'>
//         {filterContent}
//       </div>

//       {/* Mobile Overlay */}
//       {isMobileOpen && (
//         <div className="lg:hidden fixed inset-0 z-50">
//           <div
//             className="absolute inset-0 bg-black/40"
//             onClick={() => setIsMobileOpen(false)}
//           ></div>

//           <div className="absolute left-0 top-0 h-full w-[85%] max-w-[340px] bg-white shadow-xl overflow-y-auto animate-slideIn">
//             {filterContent}
//           </div>
//         </div>
//       )}
//     </>
//   )
// }

// export default FilterSideBar



// chat plush no code nakhu chhu 


// import React, { useEffect, useState } from 'react'
// import { Input } from './ui/input'
// import { Button } from './ui/button'
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectValue
// } from "@/components/ui/select"
// import axios from 'axios'
// import { useDispatch } from "react-redux"
// import { setProducts } from "@/Redux/productSlice"

// const FilterSideBar = ({
//   category,
//   setCategory,
//   brand,
//   setBrand,
//   priceRange,
//   setPriceRange
// }) => {

//   const dispatch = useDispatch()

//   const [allCategories, setAllCategories] = useState([])
//   const [allBrands, setAllBrands] = useState([])
//   const [searchInput, setSearchInput] = useState("")

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/v1/category/get")
//         if (res.data.success) {
//           setAllCategories(res.data.categories.map(c => c.categoryName))
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     fetchCategories()
//   }, [])

//   useEffect(() => {

//     const fetchBrands = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/v1/product/search", {
//           params: {
//             category: category,
//             brand: "All",
//             minPrice: 0,
//             maxPrice: 999999
//           }
//         })

//         if (res.data.success) {
//           const products = res.data.products
//           const brands = [...new Set(products.map(p => p.brand))]
//           setAllBrands(brands)
//         }

//       } catch (error) {
//         console.log(error)
//       }
//     }

//     fetchBrands()
//     setBrand("All")

//   }, [category])

//   const handleSearch = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/api/v1/product/search", {
//         params: {
//           keyword: searchInput,
//           category,
//           brand,
//           minPrice: priceRange[0],
//           maxPrice: priceRange[1]
//         }
//       })

//       if (res.data.success) {
//         dispatch(setProducts(res.data.products))
//       }

//     } catch (error) {
//       console.log(error)
//     }
//   }

//   useEffect(() => {
//     handleSearch()
//   }, [category, brand, priceRange])

//   const handleMinChange = (e) => {
//     const value = Number(e.target.value)
//     if (value <= priceRange[1]) {
//       setPriceRange([value, priceRange[1]])
//     }
//   }

//   const handleMaxChange = (e) => {
//     const value = Number(e.target.value)
//     if (value >= priceRange[0]) {
//       setPriceRange([priceRange[0], value])
//     }
//   }

//   const resetFilters = () => {
//     setSearchInput("")
//     setCategory("All")
//     setBrand("All")
//     setPriceRange([0, 999999])
//   }

//   return (
//     <div className='bg-gray-50 p-4 rounded-md w-full lg:w-[260px] lg:min-w-[260px] sticky top-24 h-fit'>
//       <Input
//         type='text'
//         placeholder='Search...'
//         value={searchInput}
//         onChange={(e) => {
//           const value = e.target.value

//           // only allow alphabets + space
//           if (/^[A-Za-z\s]*$/.test(value)) {
//             setSearchInput(value)
//           }
//         }}
//         onKeyDown={(e) => {
//           if (e.key === "Enter") handleSearch()
//         }}
//         className='bg-white p-2 border-gray-400 border-2 w-full'
//       />
//       {/* <Input
//         type='text'
//         placeholder='Search...'
//         value={searchInput}
//         onChange={(e) => setSearchInput(e.target.value)}
//         onKeyDown={(e) => {
//           if (e.key === "Enter") handleSearch()
//         }}
//         className='bg-white p-2 border-gray-400 border-2 w-full'
//       /> */}

//       <Button
//         onClick={handleSearch}
//         className='mt-2 w-full bg-blue-600 text-white'
//       >
//         Search
//       </Button>

//       <h1 className='mt-4 font-semibold text-lg text-neutral-500'>Category</h1>
//       <div className='flex flex-col gap-2 mt-2'>

//         <label className='flex items-center gap-2'>
//           <input
//             type='radio'
//             value='All'
//             checked={category === 'All'}
//             onChange={() => setCategory("All")}
//           />
//           All
//         </label>

//         {allCategories.map((cat, index) => (
//           <label key={index} className='flex items-center gap-2'>
//             <input
//               type='radio'
//               value={cat}
//               checked={category === cat}
//               onChange={() => setCategory(cat)}
//             />
//             {cat}
//           </label>
//         ))}

//       </div>

//       <h1 className='mt-4 font-semibold text-lg text-neutral-500'>Brand</h1>
//       <Select value={brand} onValueChange={setBrand}>
//         <SelectTrigger className='w-full mt-2'>
//           <SelectValue placeholder="Select Brand" />
//         </SelectTrigger>

//         <SelectContent>
//           <SelectGroup>
//             <SelectItem value="All">All</SelectItem>
//             {allBrands.map((b, index) => (
//               <SelectItem key={index} value={b}>
//                 {b}
//               </SelectItem>
//             ))}
//           </SelectGroup>
//         </SelectContent>
//       </Select>

//       <h1 className='mt-5 font-semibold text-lg text-neutral-500 mb-3'>Price Range</h1>

//       <div className="flex flex-col gap-2">

//         <div className="flex gap-2 items-center">
//           <input
//             type='number'
//             value={priceRange[0]}
//             onChange={handleMinChange}
//             className='w-full p-1 border border-gray-300 rounded'
//           />
//           <span>-</span>
//           <input
//             type='number'
//             value={priceRange[1]}
//             onChange={handleMaxChange}
//             className='w-full p-1 border border-gray-300 rounded'
//           />
//         </div>

//         <input
//           type='range'
//           min={0}
//           max={priceRange[1]}
//           step={1000}
//           value={priceRange[0]}
//           onChange={handleMinChange}
//         />

//         <input
//           type='range'
//           min={priceRange[0]}
//           max={999999}
//           step={1000}
//           value={priceRange[1]}
//           onChange={handleMaxChange}
//         />
//       </div>

//       <Button
//         onClick={resetFilters}
//         className='bg-pink-600 mt-5 text-white w-full'
//       >
//         Reset Filters
//       </Button>

//     </div>
//   )
// }

// export default FilterSideBar



// 11/4/2026

// import React, { useEffect, useState } from 'react'
// import { Input } from './ui/input'
// import { Button } from './ui/button'
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectValue
// } from "@/components/ui/select"
// import axios from 'axios'
// import { useDispatch } from "react-redux"
// import { setProducts } from "@/Redux/productSlice"

// const FilterSideBar = ({
//   category,
//   setCategory,
//   brand,
//   setBrand,
//   priceRange,
//   setPriceRange
// }) => {

//   const dispatch = useDispatch()

//   const [allCategories, setAllCategories] = useState([])
//   const [allBrands, setAllBrands] = useState([])
//   const [searchInput, setSearchInput] = useState("")

//   // ✅ Fetch Categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/v1/category/get")
//         if (res.data.success) {
//           setAllCategories(res.data.categories.map(c => c.categoryName))
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     fetchCategories()
//   }, [])

//   // ✅ 🔥 Fetch Brands FROM BACKEND (category wise)
//   useEffect(() => {

//     const fetchBrands = async () => {
//       try {

//         const res = await axios.get("http://localhost:8000/api/v1/product/search", {
//           params: {
//             category: category,
//             brand: "All",
//             minPrice: 0,
//             maxPrice: 999999
//           }
//         })

//         if (res.data.success) {

//           const products = res.data.products

//           const brands = [...new Set(products.map(p => p.brand))]

//           setAllBrands(brands)
//         }

//       } catch (error) {
//         console.log(error)
//       }
//     }

//     fetchBrands()

//     // 👉 reset brand when category change
//     setBrand("All")

//   }, [category])

//   // ✅ Search API
//   const handleSearch = async () => {
//     try {
//       const res = await axios.get("http://localhost:8000/api/v1/product/search", {
//         params: {
//           keyword: searchInput,
//           category,
//           brand,
//           minPrice: priceRange[0],
//           maxPrice: priceRange[1]
//         }
//       })

//       if (res.data.success) {
//         dispatch(setProducts(res.data.products))
//       }

//     } catch (error) {
//       console.log(error)
//     }
//   }

//   // ✅ Auto search
//   useEffect(() => {
//     handleSearch()
//   }, [category, brand, priceRange])

//   // ✅ Price handlers
//   const handleMinChange = (e) => {
//     const value = Number(e.target.value)
//     if (value <= priceRange[1]) {
//       setPriceRange([value, priceRange[1]])
//     }
//   }

//   const handleMaxChange = (e) => {
//     const value = Number(e.target.value)
//     if (value >= priceRange[0]) {
//       setPriceRange([priceRange[0], value])
//     }
//   }

//   // ✅ Reset
//   const resetFilters = () => {
//     setSearchInput("")
//     setCategory("All")
//     setBrand("All")
//     setPriceRange([0, 999999])
//   }

//   return (
//     <div className='bg-gray-50 p-4 rounded-md hidden md:block w-64 sticky top-24 h-fit'>

//       {/* 🔍 Search */}
//       <Input
//         type='text'
//         placeholder='Search...'
//         value={searchInput}
//         onChange={(e) => setSearchInput(e.target.value)}
//         onKeyDown={(e) => {
//           if (e.key === "Enter") {
//             handleSearch()
//           }
//         }}
//         className='bg-white p-2 border-gray-400 border-2 w-full'
//       />

//       <Button
//         onClick={handleSearch}
//         className='mt-2 w-full bg-blue-600 text-white'
//       >
//         Search
//       </Button>

//       {/* 🗂 Category */}
//       <h1 className='mt-4 font-semibold text-xl text-neutral-500'>Category</h1>
//       <div className='flex flex-col gap-2 mt-2'>

//         <label className='flex items-center gap-2'>
//           <input
//             type='radio'
//             value='All'
//             checked={category === 'All'}
//             onChange={() => setCategory("All")}
//           />
//           All
//         </label>

//         {allCategories.map((cat, index) => (
//           <label key={index} className='flex items-center gap-2'>
//             <input
//               type='radio'
//               value={cat}
//               checked={category === cat}
//               onChange={() => setCategory(cat)}
//             />
//             {cat}
//           </label>
//         ))}

//       </div>

//       {/* 🏷 Brand (Backend based) */}
//       <h1 className='mt-4 font-semibold text-xl text-neutral-500'>Brand</h1>
//       <Select value={brand} onValueChange={setBrand}>
//         <SelectTrigger className='w-full mt-2'>
//           <SelectValue placeholder="Select Brand" />
//         </SelectTrigger>

//         <SelectContent>
//           <SelectGroup>

//             <SelectItem value="All">All</SelectItem>

//             {allBrands.map((b, index) => (
//               <SelectItem key={index} value={b}>
//                 {b}
//               </SelectItem>
//             ))}

//           </SelectGroup>
//         </SelectContent>
//       </Select>

//       {/* 💰 Price */}
//       <h1 className='mt-5 font-semibold text-xl text-neutral-500 mb-3'>Price Range</h1>

//       <div className="flex flex-col gap-2">

//         <div className="flex gap-2 items-center">
//           <input
//             type='number'
//             value={priceRange[0]}
//             onChange={handleMinChange}
//             className='w-20 p-1 border border-gray-300 rounded'
//           />
//           <span>-</span>
//           <input
//             type='number'
//             value={priceRange[1]}
//             onChange={handleMaxChange}
//             className='w-20 p-1 border border-gray-300 rounded'
//           />
//         </div>

//         <input
//           type='range'
//           min={0}
//           max={priceRange[1]}
//           step={1000}
//           value={priceRange[0]}
//           onChange={handleMinChange}
//         />

//         <input
//           type='range'
//           min={priceRange[0]}
//           max={999999}
//           step={1000}
//           value={priceRange[1]}
//           onChange={handleMaxChange}
//         />
//       </div>

//       {/* 🔄 Reset */}
//       <Button
//         onClick={resetFilters}
//         className='bg-pink-600 mt-5 text-white w-full'
//       >
//         Reset Filters
//       </Button>

//     </div>
//   )
// }

// export default FilterSideBar

// 24-3


// import React, { useEffect, useState } from 'react'
// import { Input } from './ui/input'
// import { Button } from './ui/button'
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectValue
// } from "@/components/ui/select"
// import axios from 'axios'
// import { useNavigate } from "react-router-dom"

// const FilterSideBar = ({
//   search,
//   setSearch,
//   category,
//   setCategory,
//   brand,
//   setBrand,
//   priceRange,
//   setPriceRange,
//   allProducts
// }) => {

//   const [allCategories, setAllCategories] = useState([])
//   const [searchInput, setSearchInput] = useState(search)
//   const [mobileOpen, setMobileOpen] = useState(false)

//   const navigate = useNavigate()

//   // FETCH CATEGORY
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/v1/category/get")
//         if (res.data.success) {
//           setAllCategories(res.data.categories.map(c => c.categoryName))
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     fetchCategories()
//   }, [])

//   // FILTER BRAND
//   const filteredProductsByCategory =
//     category === "All"
//       ? allProducts
//       : allProducts.filter((p) =>
//           p.category?.categoryName === category || p.category === category
//         )

//   const Brands = filteredProductsByCategory.map(p => p.brand)
//   const UniqueBrand = ["All", ...new Set(Brands)]

//   // PRICE
//   const handleMinChange = (e) => {
//     const value = Number(e.target.value)
//     if (value <= priceRange[1]) {
//       setPriceRange([value, priceRange[1]])
//     }
//   }

//   const handleMaxChange = (e) => {
//     const value = Number(e.target.value)
//     if (value >= priceRange[0]) {
//       setPriceRange([priceRange[0], value])
//     }
//   }

//   // RESET
//   const resetFilters = () => {
//     setSearch("")
//     setSearchInput("")
//     setCategory("All")
//     setBrand("All")
//     setPriceRange([0, 999999])
//   }

//   // CATEGORY CHANGE
//   const handleCategoryChange = (value) => {
//     setCategory(value)
//     setBrand("All")

//     if (value === "All") {
//       navigate("/products")
//     } else {
//       navigate(`/products/category/${value}`)
//     }
//   }

//   const handleSearch = () => {
//     setSearch(searchInput)
//   }

//   // 🔥 SIDEBAR CONTENT (reuse for mobile + desktop)
//   const SidebarContent = () => (
//     <div className='bg-white p-5 rounded-xl shadow-sm flex flex-col gap-5'>

//       {/* SEARCH */}
//       <div>
//         <h2 className="font-semibold mb-2">Search</h2>
//         <Input
//           placeholder='Search products...'
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//         />
//         <Button onClick={handleSearch} className='mt-2 w-full bg-blue-600'>
//           Search
//         </Button>
//       </div>

//       {/* CATEGORY */}
//       <div>
//         <h2 className='font-semibold mb-2'>Category</h2>

//         <div className='flex flex-col gap-2 max-h-40 overflow-y-auto'>

//           <label className='flex items-center gap-2'>
//             <input
//               type='radio'
//               checked={category === "All"}
//               onChange={() => handleCategoryChange("All")}
//             />
//             All
//           </label>

//           {allCategories.map((cat, i) => (
//             <label key={i} className='flex items-center gap-2'>
//               <input
//                 type='radio'
//                 checked={category === cat}
//                 onChange={() => handleCategoryChange(cat)}
//               />
//               {cat}
//             </label>
//           ))}

//         </div>
//       </div>

//       {/* BRAND */}
//       <div>
//         <h2 className='font-semibold mb-2'>Brand</h2>

//         <Select value={brand} onValueChange={setBrand}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select Brand" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               {UniqueBrand.map((b, i) => (
//                 <SelectItem key={i} value={b}>{b}</SelectItem>
//               ))}
//             </SelectGroup>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* PRICE */}
//       <div>
//         <h2 className='font-semibold mb-2'>Price Range</h2>

//         <div className="flex gap-2">
//           <Input type="number" value={priceRange[0]} onChange={handleMinChange} />
//           <Input type="number" value={priceRange[1]} onChange={handleMaxChange} />
//         </div>
//       </div>

//       {/* RESET */}
//       <Button onClick={resetFilters} className='bg-pink-600 w-full'>
//         Reset Filters
//       </Button>

//     </div>
//   )

//   return (
//     <>
//       {/* 🔥 MOBILE FILTER BUTTON */}
//       <div className="md:hidden mb-4 px-4">
//         <Button
//           onClick={() => setMobileOpen(true)}
//           className="w-full bg-black text-white"
//         >
//           Open Filters
//         </Button>
//       </div>

//       {/* 🔥 MOBILE DRAWER */}
//       {mobileOpen && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex">
//           <div className="w-[80%] bg-white p-4 overflow-y-auto">
//             <div className="flex justify-between mb-4">
//               <h2 className="font-bold text-lg">Filters</h2>
//               <button onClick={() => setMobileOpen(false)}>✕</button>
//             </div>
//             <SidebarContent />
//           </div>
//         </div>
//       )}

//       {/* 💻 DESKTOP SIDEBAR */}
//       <div className="hidden md:block w-64 sticky top-24 h-fit">
//         <SidebarContent />
//       </div>
//     </>
//   )
// }

// export default FilterSideBar


//ok j hatu but responsive and design better



// import React, { useEffect, useState } from 'react'
// import { Input } from './ui/input'
// import { Button } from './ui/button'
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectValue
// } from "@/components/ui/select"
// import axios from 'axios'
// import { useNavigate } from "react-router-dom"

// const FilterSideBar = ({
//   search,
//   setSearch,
//   category,
//   setCategory,
//   brand,
//   setBrand,
//   priceRange,
//   setPriceRange,
//   allProducts
// }) => {

//   const [allCategories, setAllCategories] = useState([])
//   const [searchInput, setSearchInput] = useState(search)

//   const navigate = useNavigate()

//   // ✅ Fetch categories from backend
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/v1/category/get")
//         if (res.data.success) {
//           setAllCategories(res.data.categories.map(c => c.categoryName))
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }
//     fetchCategories()
//   }, [])

//   // ✅ STEP 1: Filter products based on selected category
//   const filteredProductsByCategory =
//     category === "All"
//       ? allProducts
//       : allProducts.filter((p) => {

//           // 🔥 CASE 1: category object hoy
//           if (p.category && typeof p.category === "object") {
//             return p.category.categoryName === category
//           }

//           // 🔥 CASE 2: category string hoy
//           return p.category === category
//         })

//   // ✅ STEP 2: Extract brands only from filtered products
//   const Brands = filteredProductsByCategory.map(p => p.brand)

//   // ✅ STEP 3: Remove duplicate brands + add "All"
//   const UniqueBrand = ["All", ...new Set(Brands)]

//   // ✅ Price handlers
//   const handleMinChange = (e) => {
//     const value = Number(e.target.value)
//     if (value <= priceRange[1]) {
//       setPriceRange([value, priceRange[1]])
//     }
//   }

//   const handleMaxChange = (e) => {
//     const value = Number(e.target.value)
//     if (value >= priceRange[0]) {
//       setPriceRange([priceRange[0], value])
//     }
//   }

//   // ✅ Reset filters
//   const resetFilters = () => {
//     setSearch("")
//     setSearchInput("")
//     setCategory("All")
//     setBrand("All")
//     setPriceRange([0, 999999])
//   }

//   // ✅ Category change
//   const handleCategoryChange = (value) => {
//     setCategory(value)

//     // 🔥 IMPORTANT: brand reset when category changes
//     setBrand("All")

//     if (value === "All") {
//       navigate("/products")
//     } else {
//       navigate(`/products/category/${value}`)
//     }
//   }

//   // ✅ Search
//   const handleSearch = () => {
//     setSearch(searchInput)
//   }

//   return (
//     <div className='bg-gray-50 p-4 rounded-md hidden md:block w-64 sticky top-24 h-fit'>

//       {/* 🔍 Search */}
//       <Input
//         type='text'
//         placeholder='Search...'
//         value={searchInput}
//         onChange={(e) => setSearchInput(e.target.value)}
//         onKeyDown={(e) => {
//           if (e.key === "Enter") {
//             handleSearch()
//           }
//         }}
//         className='bg-white p-2 border-gray-400 border-2 w-full'
//       />

//       <Button
//         onClick={handleSearch}
//         className='mt-2 w-full bg-blue-600 text-white'
//       >
//         Search
//       </Button>

//       {/* 🗂 Category */}
//       <h1 className='mt-4 font-semibold text-xl text-neutral-500'>Category</h1>
//       <div className='flex flex-col gap-2 mt-2'>

//         <label className='flex items-center gap-2'>
//           <input
//             type='radio'
//             name='category'
//             value='All'
//             checked={category === 'All'}
//             onChange={() => handleCategoryChange("All")}
//           />
//           All
//         </label>

//         {allCategories.map((cat, index) => (
//           <label key={index} className='flex items-center gap-2'>
//             <input
//               type='radio'
//               name='category'
//               value={cat}
//               checked={category === cat}
//               onChange={() => handleCategoryChange(cat)}
//             />
//             {cat}
//           </label>
//         ))}

//       </div>

//       {/* 🏷 Brand (dynamic based on category) */}
//       <h1 className='mt-4 font-semibold text-xl text-neutral-500'>Brand</h1>
//       <Select value={brand} onValueChange={setBrand}>
//         <SelectTrigger className='w-full mt-2'>
//           <SelectValue placeholder="Select Brand" />
//         </SelectTrigger>

//         <SelectContent>
//           <SelectGroup>

//             {UniqueBrand.map((b, index) => (
//               <SelectItem key={index} value={b}>
//                 {b}
//               </SelectItem>
//             ))}

//           </SelectGroup>
//         </SelectContent>
//       </Select>

//       {/* 💰 Price Range */}
//       <h1 className='mt-5 font-semibold text-xl text-neutral-500 mb-3'>Price Range</h1>

//       <div className="flex flex-col gap-2">

//         <div className="flex gap-2 items-center">
//           <input
//             type='number'
//             min={0}
//             max={priceRange[1]}
//             value={priceRange[0]}
//             onChange={handleMinChange}
//             className='w-20 p-1 border border-gray-300 rounded'
//           />
//           <span>-</span>
//           <input
//             type='number'
//             min={priceRange[0]}
//             max={999999}
//             value={priceRange[1]}
//             onChange={handleMaxChange}
//             className='w-20 p-1 border border-gray-300 rounded'
//           />
//         </div>

//         <input
//           type='range'
//           min={0}
//           max={priceRange[1]}
//           step={1000}
//           value={priceRange[0]}
//           onChange={handleMinChange}
//           className='w-full'
//         />

//         <input
//           type='range'
//           min={priceRange[0]}
//           max={999999}
//           step={1000}
//           value={priceRange[1]}
//           onChange={handleMaxChange}
//           className='w-full'
//         />

//       </div>

//       {/* 🔄 Reset */}
//       <Button
//         onClick={resetFilters}
//         className='bg-pink-600 mt-5 text-white cursor-pointer w-full'
//       >
//         Reset Filters
//       </Button>

//     </div>
//   )
// }

// export default FilterSideBar


// import React, { useEffect, useState } from 'react'
// import { Input } from './ui/input'
// import { Button } from './ui/button'
// import axios from 'axios'

// const FilterSideBar = ({
//   search,
//   setSearch,
//   category,
//   setCategory,
//   brand,
//   setBrand,
//   setPriceRange,
//   allProducts,
//   priceRange
// }) => {

//   // ✅ State for categories fetched from backend
//   const [allCategories, setAllCategories] = useState([])

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/v1/category/get")
//         if (res.data.success) {
//           // only store categoryName for radio buttons
//           setAllCategories(res.data.categories.map(c => c.categoryName))
//         }
//       } catch (error) {
//         console.log(error)
//       }
//     }

//     fetchCategories()
//   }, [])

//   // ✅ Brands from products
//   const Brands = allProducts.map(p => p.brand)
//   const UniqueBrand = ["All", ...new Set(Brands)]

//   const handleCategoryClick = (val) => {
//     setCategory(val)
//   }

//   const handleBrandChange = (e) => {
//     setBrand(e.target.value)
//   }

//   const handleMinChange = (e) => {
//     const value = Number(e.target.value)
//     if (value <= priceRange[1]) setPriceRange([value, priceRange[1]])
//   }

//   const handleMaxChange = (e) => {
//     const value = Number(e.target.value)
//     if (value >= priceRange[0]) setPriceRange([priceRange[0], value])
//   }

//   const resetFilters = () => {
//     setSearch("")
//     setCategory("All")
//     setBrand("All")
//     setPriceRange([0, 999999])
//   }

//   return (
//     <div className='bg-gray-50 mt-10 p-4 rounded-md h-max hidden md:block w-64'>
//       {/* search */}
//       <Input
//         type='text'
//         placeholder='Search...'
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className='bg-white p-2 border-gray-400 border-2 w-full'
//       />

//       {/* category */}
//       <h1 className='mt-4 font-semibold text-xl text-neutral-500'>Category</h1>
//       <div className='flex flex-col gap-2 mt-3'>
//         {["All", ...allCategories].map((item, index) => (
//           <div key={index} className='flex items-center gap-2'>
//             <input
//               type='radio'
//               checked={category === item}
//               onChange={() => handleCategoryClick(item)}
//             />
//             <label>{item}</label>
//           </div>
//         ))}
//       </div>

//       {/* Brands */}
//       <h1 className='mt-4 font-semibold text-xl text-neutral-500'>Brand</h1>
//       <select
//         className='bg-white w-full p-2 border-gray-200 border-2 rounded-md'
//         value={brand}
//         onChange={handleBrandChange}
//       >
//         {UniqueBrand.map((item, index) => (
//           <option key={index} value={item}>
//             {item.toUpperCase()}
//           </option>
//         ))}
//       </select>

//       {/* Price Range  */}
//       <h1 className='mt-5 font-semibold text-xl text-neutral-500 mb-3'>Price Range</h1>
//       <div className="flex flex-col gap-2">
//         <label>Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}</label>
//         <div className="flex gap-2 items-center">
//           <input
//             type='number'
//             min={0}
//             max={priceRange[1]}
//             value={priceRange[0]}
//             onChange={handleMinChange}
//             className='w-20 p-1 border border-gray-300 rounded'
//           />
//           <span>-</span>
//           <input
//             type='number'
//             min={priceRange[0]}
//             max={999999}
//             value={priceRange[1]}
//             onChange={handleMaxChange}
//             className='w-20 p-1 border border-gray-300 rounded'
//           />
//         </div>
//         <input
//           type='range'
//           min={0}
//           max={priceRange[1]}
//           step={100}
//           value={priceRange[0]}
//           onChange={handleMinChange}
//           className='w-full'
//         />
//         <input
//           type='range'
//           min={priceRange[0]}
//           max={999999}
//           step={100}
//           value={priceRange[1]}
//           onChange={handleMaxChange}
//           className='w-full'
//         />
//       </div>

//       {/* Reset Button */}
//       <Button
//         onClick={resetFilters}
//         className='bg-pink-600 mt-5 text-white cursor-pointer w-full'
//       >
//         Reset Filters
//       </Button>
//     </div>
//   )
// }

// export default FilterSideBar





// ahiya maru chhe


// import React from 'react'
// import { Input } from './ui/input'
// import { Select } from 'radix-ui'
// import { Button } from './ui/button'

// const FilterSideBar = ({ search, setSearch, category, setCategory, brand, setBrand, setPriceRange, allProducts, priceRange }) => {
//   const Categories = allProducts.map(p => p.category)
//   const UniqueCategories = ["All", ...new Set(Categories)]

//   const Brands = allProducts.map(p => p.brand)
//   const UniqueBrand = ["All", ...new Set(Brands)]
//   console.log(UniqueBrand);

//   const handleCategoryClick = (Val) => { //value
//     setCategory(Val)
//   }

//   const handleBrandChange = (e) => {  // event
//     setBrand(e.target.value)
//   }

//   const handleMinChange = (e) => {
//     const value = Number(e.target.value)
//     if (value <= priceRange[1]) setPriceRange([value, priceRange[1]])
//   }

//   const handleMaxChange = (e) => {
//     const value = Number(e.target.value)
//     if (value >= priceRange[0]) setPriceRange([priceRange[0], value])
//   }

//   const resetFilters = () => {
//     setSearch("");
//     setCategory("All");
//     setBrand("All");
//     setPriceRange([0, 999999])
//   }

//   return (
//     <div className='bg-gray-50 mt-10 p-4 rounded-md h-max hidden md:block w-64'>
//       {/* search */}
//       <Input
//         type='text'
//         placeholder='Search...'
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className='bg-white p-2 rotate-md border-gray-400 border-2 w-full' />
//       {/* category */}
//       <h1 className='mt-4 font-semibold text-xl text-neutral-500'>Category</h1>
//       <div className='flex flex-col gap-2 mt-3'>
//         {
//           UniqueCategories.map((item, index) => (
//             <div key={index} className='flex items-center gap-2'>
//               <input type='radio' checked={category === item} onChange={() => handleCategoryClick(item)} />
//               <label htmlFor=''>{item}</label>
//             </div>
//           ))
//         }
//       </div>

//       {/* Brands */}
//       <h1 className='mt-4 font-semibold text-xl text-neutral-500'>Brand</h1>

//       <select
//         className='bg-white w-full p-2 border-gray-200 border-2 rounded-md'
//         value={brand}
//         onChange={handleBrandChange}
//       >
//         {UniqueBrand.map((item, index) => (
//           <option key={index} value={item}>
//             {item.toUpperCase()}
//           </option>
//         ))}
//       </select>

//       {/* Price Range  */}

//       <h1 className='mt-5 font-semibold text-xl text-neutral-500 mb-3'>Price Prange</h1>
//       <div className="flex flex-col gap-2 ">
//         <label>
//           Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
//         </label>
//         <div className="flex gap-2 items-center">
//           <input type='number' min={"0"} max={"5000"} value={priceRange[0]} onChange={handleMinChange} className='w-20 p-1 border border-gray-300 rounded' />
//           <span>-</span>
//           <input type='number' min={"0"} max={"999999"} value={priceRange[1]} onChange={handleMaxChange} className='w-20 p-1 border border-gray-300 rounded' />
//         </div>
//         <input type='range' min={"0"} max={"5000"} step={"100"} value={priceRange[0]} onChange={handleMinChange} className='w-full' />
//         <input type='range' min={"0"} max={"999999"} step={"100"} value={priceRange[1]} onChange={handleMaxChange} className='w-full' />
//       </div>
//       {/* Reset Button */}
//       <Button onClick={resetFilters} className='bg-pink-600 mt-5 text-white cursor-pointer w-full'>
//         Reset Filters
//       </Button>
//     </div>
//   )
// }
// export default FilterSideBar



