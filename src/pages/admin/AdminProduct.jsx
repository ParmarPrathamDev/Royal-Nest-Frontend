import { Input } from '@/components/ui/input';
import { Edit, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ImageUpload';
import axios from 'axios';
import { toast } from 'sonner';
import { setProducts } from '@/Redux/productSlice';
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const AdminProduct = () => {
  const { products } = useSelector(store => store.product)
  const safeProducts = Array.isArray(products) ? products : []

  const [editProduct, setEditProduct] = useState(null)
  const accessToken = localStorage.getItem("accessToken")
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(5)

  const [search, setSearch] = useState("")
  const [sortOrder, setSortOrder] = useState("")
  const fetchLatestProducts = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/api/v1/product/getallproduct`)

    if (res.data.success) {
      const latestProducts = [...(res.data.products || [])].sort(
        (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)
      )

      dispatch(setProducts(latestProducts))
    }
  } catch (error) {
    console.log(error)
  }
}
useEffect(() => {
  fetchLatestProducts()
}, [])

  const handleSearch = async (value) => {
    setSearch(value)

    try {
      if (value.trim() === "") {
        const res = await axios.get(`${API_BASE_URL}/api/v1/product/getallproduct`)

        if (res.data.success) {
          const latestProducts = [...(res.data.products || [])].sort(
            (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)
          )

          dispatch(setProducts(latestProducts))
        }
        return
      }

      const res = await axios.get(
        `${API_BASE_URL}/api/v1/product/search?keyword=${value}`
      )

      if (res.data.success) {
        const latestProducts = [...(res.data.products || [])].sort(
          (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)
        )

        dispatch(setProducts(latestProducts))
      }

    } catch (error) {
      console.log(error)
    }
  }

  // const handleChange = (e) => {
  //   const { name, value } = e.target
  //   setEditProduct(prev => ({
  //     ...prev,
  //     [name]: value
  //   }))
  // }
const handleChange = (e) => {
  const { name, value } = e.target

  // PRICE VALIDATION
  if (name === "productPrice") {
    if (value === "") {
      setEditProduct(prev => ({ ...prev, productPrice: "" }))
      return
    }

    let num = value.replace(/\D/g, "")
    num = Number(num)

    if (num < 0) num = 0
    if (num > 1000000) num = 1000000

    setEditProduct(prev => ({
      ...prev,
      productPrice: num
    }))
    return
  }

  // QUANTITY VALIDATION
  if (name === "quantity") {
    if (value === "") {
      setEditProduct(prev => ({ ...prev, quantity: "" }))
      return
    }

    let num = value.replace(/\D/g, "")
    num = Number(num)

    if (num < 0) num = 0
    if (num > 50) num = 50

    setEditProduct(prev => ({
      ...prev,
      quantity: num
    }))
    return
  }

  setEditProduct(prev => ({
    ...prev,
    [name]: value
  }))
}
const handleSave = async (e) => {
  e.preventDefault()

  // ✅ PRICE VALIDATION
  if (
    editProduct.productPrice === "" ||
    Number(editProduct.productPrice) < 0 ||
    Number(editProduct.productPrice) > 1000000
  ) {
    toast.error("Price must be between 0 and 1000000")
    return
  }

  // ✅ QUANTITY VALIDATION
  if (
    editProduct.quantity === "" ||
    Number(editProduct.quantity) < 0 ||
    Number(editProduct.quantity) > 50
  ) {
    toast.error("Quantity must be between 0 and 50")
    return
  }

  const formData = new FormData()
  formData.append("productName", editProduct.productName)
  formData.append("productDesc", editProduct.productDesc)
  formData.append("productPrice", editProduct.productPrice)
  formData.append("category", editProduct.category?._id || editProduct.category)
  formData.append("brand", editProduct.brand)
  formData.append("quantity", editProduct.quantity)

  const existingImages = editProduct.productImg
    ?.filter((img) => !(img instanceof File) && img.public_id)
    .map((img) => img.public_id)

  formData.append("existingImages", JSON.stringify(existingImages))

  editProduct.productImg
    ?.filter((img) => img instanceof File)
    .forEach((file) => {
      formData.append("files", file)
    })

  try {
    const res = await axios.put(
      `${API_BASE_URL}/api/v1/product/update/${editProduct._id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    )

    if (res.data.success) {
      toast.success('Product Updated Successfully')

      // ✅ UPDATED PRODUCT TOP PAR
      const updatedProduct = res.data.product

      const remainingProducts = safeProducts.filter(
        (p) => p._id !== updatedProduct._id
      )

      const latestProducts = [updatedProduct, ...remainingProducts]

      dispatch(setProducts(latestProducts))
      setOpen(false)

      // ✅ REDIRECT PRODUCT PAGE
      setTimeout(() => {
        navigate("/dashboard/products")
      }, 500)
    }

  } catch (error) {
    console.log(error)
  }
}
// const handleSave = async (e) => {
//   e.preventDefault()

//   // ✅ PRICE VALIDATION
//   if (
//     editProduct.productPrice === "" ||
//     Number(editProduct.productPrice) < 0 ||
//     Number(editProduct.productPrice) > 1000000
//   ) {
//     toast.error("Price must be between 0 and 1000000")
//     return
//   }

//   // ✅ QUANTITY VALIDATION
//   if (
//     editProduct.quantity === "" ||
//     Number(editProduct.quantity) < 0 ||
//     Number(editProduct.quantity) > 50
//   ) {
//     toast.error("Quantity must be between 0 and 50")
//     return
//   }

//   const formData = new FormData()
//   formData.append("productName", editProduct.productName)
//   formData.append("productDesc", editProduct.productDesc)
//   formData.append("productPrice", editProduct.productPrice)
//   formData.append("category", editProduct.category?._id || editProduct.category)
//   formData.append("brand", editProduct.brand)
//   formData.append("quantity", editProduct.quantity)

//   const existingImages = editProduct.productImg
//     ?.filter((img) => !(img instanceof File) && img.public_id)
//     .map((img) => img.public_id)

//   formData.append("existingImages", JSON.stringify(existingImages))

//   editProduct.productImg
//     ?.filter((img) => img instanceof File)
//     .forEach((file) => {
//       formData.append("files", file)
//     })

//   try {
//     const res = await axios.put(
//       `http://localhost:8000/api/v1/product/update/${editProduct._id}`,
//       formData,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       }
//     )

//     if (res.data.success) {
//       toast.success('Product Updated Successfully')

// const updatedProduct = res.data.product

// const remainingProducts = safeProducts.filter(
//   (p) => p._id !== updatedProduct._id
// )

// const latestProducts = [updatedProduct, ...remainingProducts]

// dispatch(setProducts(latestProducts))
//       setOpen(false)
//     }

//   } catch (error) {
//     console.log(error)
//   }
// }
  // const handleSave = async (e) => {
  //   e.preventDefault()

  //   const formData = new FormData()
  //   formData.append("productName", editProduct.productName)
  //   formData.append("productDesc", editProduct.productDesc)
  //   formData.append("productPrice", editProduct.productPrice)
  //   formData.append("category", editProduct.category?._id || editProduct.category)
  //   formData.append("brand", editProduct.brand)
  //   formData.append("quantity", editProduct.quantity)

  //   const existingImages = editProduct.productImg
  //     ?.filter((img) => !(img instanceof File) && img.public_id)
  //     .map((img) => img.public_id)

  //   formData.append("existingImages", JSON.stringify(existingImages))

  //   editProduct.productImg
  //     ?.filter((img) => img instanceof File)
  //     .forEach((file) => {
  //       formData.append("files", file)
  //     })

  //   try {
  //     const res = await axios.put(
  //       `http://localhost:8000/api/v1/product/update/${editProduct._id}`,
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`
  //         }
  //       }
  //     )

  //     if (res.data.success) {
  //       toast.success('Product Updated Successfully')

  //       const updateProducts = safeProducts.map((p) =>
  //         p._id === editProduct._id ? res.data.product : p
  //       )

  //       const latestProducts = [...updateProducts].sort(
  //         (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)
  //       )

  //       dispatch(setProducts(latestProducts))
  //       setOpen(false)
  //     }

  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const deleteProductHandler = async (productId) => {
    try {
      const remainingProducts = safeProducts.filter((product) => product._id !== productId)

      const res = await axios.delete(
        `${API_BASE_URL}/api/v1/product/delete/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      if (res.data.success) {
        toast.success(res.data.message)

        const latestProducts = [...remainingProducts].sort(
          (a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)
        )

        dispatch(setProducts(latestProducts))
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='bg-gray-100 min-h-screen py-6 px-4 md:pl-[320px] w-full flex flex-col gap-4'>

      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="relative bg-white rounded-lg w-full md:w-[400px]">
          <Input
            type='text'
            placeholder='Search Product...'
            className='w-full'
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Search className='absolute right-3 top-2 text-gray-500' />
        </div>

        <Select onValueChange={(value) => setSortOrder(value)}>
          <SelectTrigger className="w-full md:w-[200px] bg-white">
            <SelectValue placeholder="Sort By Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="lowToHigh">Price: Low To High</SelectItem>
              <SelectItem value="highToLow">Price: High To Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          className='bg-[#5A7863] w-full md:w-auto'
          onClick={() => navigate("/dashboard/add-product")}
        >
          Add Product
        </Button>
      </div>

      {[...safeProducts]
        .filter(p => p && p.productPrice != null)
        .sort((a, b) => {
          const priceA = Number(a?.productPrice || 0)
          const priceB = Number(b?.productPrice || 0)

          if (sortOrder === "lowToHigh") return priceA - priceB
          if (sortOrder === "highToLow") return priceB - priceA

          return new Date(b?.createdAt) - new Date(a?.createdAt)
        })
        .slice(0, visibleCount)
        .map((product, index) => {
          if (!product) return null

          return (
            <Card key={product._id || index} className="p-4 rounded-2xl border shadow-sm">
  <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
    
    {/* LEFT: IMAGE + NAME */}
    <div className="flex items-center gap-3 md:flex-[2] min-w-0">
      <img
        src={product?.productImg?.[0]?.url || product?.productImg?.[0] || "/placeholder.png"}
        alt={product?.productName}
        className="w-20 h-20 object-cover rounded-md shrink-0"
      />

      <div className="min-w-0">
        <h1 className="font-bold text-gray-700 text-sm md:text-lg leading-snug line-clamp-2 break-words">
          {product?.productName}
        </h1>
      </div>
    </div>

    {/* CATEGORY */}
    <div className="md:flex-1 min-w-0">
      <h1 className="font-semibold text-gray-400 text-sm md:text-base break-words">
        {product?.category?.categoryName || "No Category"}
      </h1>
    </div>

    {/* PRICE + QTY */}
    <div className="md:w-[140px] shrink-0">
      <h1 className="font-semibold text-gray-800 text-base md:text-xl">
        ₹{product?.productPrice}
      </h1>

      <span
        className={`text-sm font-medium ${
          product?.quantity === 0 ? "text-red-500" : "text-green-600"
        }`}
      >
        {product?.quantity === 0 ? "Out of Stock" : `Qty: ${product?.quantity}`}
      </span>
    </div>

    {/* ACTIONS */}
    <div className="flex gap-3 md:w-[80px] shrink-0 md:justify-end">
      <Edit
        onClick={() => {
          setEditProduct(product);
          setOpen(true);
        }}
        className="text-gray-500 cursor-pointer"
      />

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Trash2 className="text-red-500 cursor-pointer" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteProductHandler(product._id)}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </div>
</Card>
          )
        })}

      {visibleCount < safeProducts.length && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => setVisibleCount(prev => prev + 5)}
            className="bg-[#D8C9A7] text-white hover:bg-[#1D546C]"
          >
            Show More
          </Button>
        </div>
      )}

      {editProduct && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[625px] max-h-[500px] overflow-y-scroll">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Make changes to your product here.
              </DialogDescription>
            </DialogHeader>

            <form className="flex flex-col gap-2" onSubmit={handleSave}>
              <div className='grid gap-2'>
                <Label>Product Name</Label>
                <Input
                  name="productName"
                  value={editProduct.productName}
                  onChange={handleChange}
                />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='grid gap-2'>
                  <Label>Product Price</Label>
                  <Input
  type="number"
  name="productPrice"
  min="0"
  max="1000000"
  value={editProduct.productPrice}
  onChange={handleChange}
/>
                
                </div>

                <div className='grid gap-2'>
                  <Label>Quantity</Label>
                 <Input
  type="number"
  name="quantity"
  min="0"
  max="50"
  value={editProduct.quantity || ""}
  onChange={handleChange}
/>
                
                </div>
              </div>

              <div className='grid gap-2'>
                <Label>Brand</Label>
                <Input
                  name="brand"
                  value={editProduct.brand}
                  onChange={handleChange}
                />
              </div>

              <div className='grid gap-2'>
                <Label>Description</Label>
                <Textarea
                  name="productDesc"
                  value={editProduct.productDesc}
                  onChange={handleChange}
                />
              </div>

              <ImageUpload
                productData={editProduct}
                setProductData={setEditProduct}
              />

              <DialogFooter className="flex gap-2 mt-4">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default AdminProduct








// import { Input } from '@/components/ui/input';
// import { Edit, Search, Trash2 } from 'lucide-react';
// import React, { useState } from 'react'
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Card } from '@/components/ui/card';
// import { useDispatch, useSelector } from 'react-redux';
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Textarea } from '@/components/ui/textarea';
// import ImageUpload from '@/components/ImageUpload';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { setProducts } from '@/Redux/productSlice';
// import { useNavigate } from "react-router-dom";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"

// const AdminProduct = () => {

//   // const { products = [] } = useSelector(store => store.product)
//   const { products } = useSelector(store => store.product)
// const safeProducts = Array.isArray(products) ? products : []
//   const [editProduct, setEditProduct] = useState(null)
//   const accessToken = localStorage.getItem("accessToken")
//   const [open, setOpen] = useState(false)
//   const dispatch = useDispatch()
//   const navigate = useNavigate();
//   const [visibleCount, setVisibleCount] = useState(5)

//   // ✅ search + sort state
//   const [search, setSearch] = useState("")
//   const [sortOrder, setSortOrder] = useState("")

//   // 🔥 BACKEND SEARCH
//   const handleSearch = async (value) => {
//     setSearch(value)

//     try {

//       // 🔁 empty hoy to all products
//       if (value.trim() === "") {
//         const res = await axios.get("http://localhost:8000/api/v1/product/getallproduct")

//         if (res.data.success) {
//           dispatch(setProducts(res.data.products))
//         }
//         return
//       }

//       const res = await axios.get(
//         `http://localhost:8000/api/v1/product/search?keyword=${value}`
//       )

//       if (res.data.success) {
//         dispatch(setProducts(res.data.products))
//       }

//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setEditProduct(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleSave = async (e) => {
//     e.preventDefault()

//     const formData = new FormData()
//     formData.append("productName", editProduct.productName)
//     formData.append("productDesc", editProduct.productDesc)
//     formData.append("productPrice", editProduct.productPrice)
//     formData.append("category", editProduct.category?._id || editProduct.category)
//     formData.append("brand", editProduct.brand)
//     formData.append("quantity", editProduct.quantity)

//     const existingImages = editProduct.productImg
//       ?.filter((img) => !(img instanceof File) && img.public_id)
//       .map((img) => img.public_id)

//     formData.append("existingImages", JSON.stringify(existingImages))

//     editProduct.productImg
//       ?.filter((img) => img instanceof File)
//       .forEach((file) => {
//         formData.append("files", file)
//       })

//     try {
//       const res = await axios.put(
//         `http://localhost:8000/api/v1/product/update/${editProduct._id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`
//           }
//         }
//       )

//       if (res.data.success) {
//         toast.success('Product Updated Successfully')

//         const updateProducts = products.map((p) =>
//           p._id === editProduct._id ? res.data.product : p)

//         dispatch(setProducts(updateProducts))
//         setOpen(false)
//       }

//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const deleteProductHandler = async (productId) => {
//     try {
//       const remainingProducts = products.filter((product) => product._id !== productId)

//       const res = await axios.delete(
//         `http://localhost:8000/api/v1/product/delete/${productId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`
//           }
//         }
//       )

//       if (res.data.success) {
//         toast.success(res.data.message)
//         dispatch(setProducts(remainingProducts))
//       }

//     } catch (error) {
//       console.log(error);
//     }
//   }
// return (
//   <div className='bg-gray-100 min-h-screen py-6 px-4 md:pl-[320px] w-full flex flex-col gap-4'>

//     {/* TOP BAR */}
//     <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">

//       {/* 🔍 Search */}
//       <div className="relative bg-white rounded-lg w-full md:w-[400px]">
//         <Input
//           type='text'
//           placeholder='Search Product...'
//           className='w-full'
//           value={search}
//           onChange={(e) => handleSearch(e.target.value)}
//         />
//         <Search className='absolute right-3 top-2 text-gray-500' />
//       </div>

//       {/* 🔽 Sort */}
//       <Select onValueChange={(value) => setSortOrder(value)}>
//         <SelectTrigger className="w-full md:w-[200px] bg-white">
//           <SelectValue placeholder="Sort By Price" />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectGroup>
//             <SelectItem value="lowToHigh">Price: Low To High</SelectItem>
//             <SelectItem value="highToLow">Price: High To Low</SelectItem>
//           </SelectGroup>
//         </SelectContent>
//       </Select>

//       {/* ➕ Add Product */}
//       <Button
//         className='bg-[#5A7863] w-full md:w-auto'
//         onClick={() => navigate("/dashboard/add-product")}
//       >
//         Add Product
//       </Button>

//     </div>

//     {/* PRODUCTS LIST */}
//     {
//   [...safeProducts]
//     .filter(p => p && p.productPrice != null)
//     .sort((a, b) => {

//       const priceA = Number(a?.productPrice || 0)
//       const priceB = Number(b?.productPrice || 0)

//       if (sortOrder === "lowToHigh") return priceA - priceB
//       if (sortOrder === "highToLow") return priceB - priceA

//       return 0
//     })
//     .slice(0, visibleCount)
//     .map((product, index) => {
//           if (!product) return null

//           return (
//             <Card key={index} className='p-4'>
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

//                 {/* LEFT */}
//                 <div className="flex gap-3 items-center">
//                   <img
//                     src={product?.productImg?.[0]?.url || product?.productImg?.[0] || "/placeholder.png"}
//                     className="w-20 h-20 object-cover rounded-md"
//                   />
//                  <h1 className='font-bold text-gray-700 text-sm md:text-base max-w-[150px] md:max-w-[250px] truncate'>
//                       {product?.productName}
//                   </h1>
//                 </div>

//                 {/* CATEGORY */}
//                 <h1 className='font-semibold text-gray-400 text-sm'>
//                   {product?.category?.categoryName}
//                 </h1>

//                 {/* PRICE */}
//                 <div className="flex flex-col">
//                   <h1 className='font-semibold text-gray-800'>
//                    ₹{product?.productPrice}
//                    </h1>

//                  <span className={`text-sm font-medium ${
//                      product?.quantity === 0 ? "text-red-500" : "text-green-600"
//                  }`}>
//                {
//                   product?.quantity === 0
//                   ? "Out of Stock"
//                   : `Qty: ${product?.quantity}`
//                }
//                  </span>
//             </div>

//                 {/* ACTIONS */}
//                 <div className='flex gap-3'>
//                   <Edit
//                     onClick={() => {
//                       setEditProduct(product);
//                       setOpen(true);
//                     }}
//                     className='text-gray-500 cursor-pointer'
//                   />

//                   <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                       <Trash2 className='text-red-500 cursor-pointer' />
//                     </AlertDialogTrigger>
//                     <AlertDialogContent>
//                       <AlertDialogHeader>
//                         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                         <AlertDialogDescription>
//                           This will permanently delete this product.
//                         </AlertDialogDescription>
//                       </AlertDialogHeader>
//                       <AlertDialogFooter>
//                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                         <AlertDialogAction onClick={() => deleteProductHandler(product._id)}>
//                           Continue
//                         </AlertDialogAction>
//                       </AlertDialogFooter>
//                     </AlertDialogContent>
//                   </AlertDialog>
//                 </div>

//               </div>
//             </Card>
//           )
//         })
//     }

//     {/* SHOW MORE */}
//     {visibleCount < safeProducts.length && (
//       <div className="flex justify-center mt-6">
//         <Button
//           onClick={() => setVisibleCount(prev => prev + 5)}
//           className="bg-[#D8C9A7] text-white hover:bg-[#1D546C]"
//         >
//           Show More
//         </Button>
//       </div>
//     )}

//     {/* EDIT DIALOG (UNCHANGED) */}
//     {editProduct && (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="sm:max-w-[625px] max-h-[500px] overflow-y-scroll">
//           <DialogHeader>
//             <DialogTitle>Edit Product</DialogTitle>
//             <DialogDescription>
//               Make changes to your product here.
//             </DialogDescription>
//           </DialogHeader>

//           <form className="flex flex-col gap-2" onSubmit={handleSave}>

//             <div className='grid gap-2'>
//               <Label>Product Name</Label>
//               <Input name="productName" value={editProduct.productName} onChange={handleChange} />
//             </div>

//             <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

//   {/* PRICE */}
//  <div className='grid gap-2'>
//   <Label>Product Price</Label>
//   <Input
//     type="number"
//     name="productPrice"
//     min="0"
//     value={editProduct.productPrice}
//     onChange={(e) => {
//       if (e.target.value < 0) return;
//       handleChange(e);
//     }}
//   />
// </div>

// {/* QUANTITY */}
// <div className='grid gap-2'>
//   <Label>Quantity</Label>
//   <Input
//     type="number"
//     name="quantity"
//     min="0"
//     value={editProduct.quantity || ""}
//     onChange={(e) => {
//       if (e.target.value < 0) return;
//       handleChange(e);
//     }}
//   />
// </div>

// </div>

//             <div className='grid gap-2'>
//               <Label>Brand</Label>
//               <Input name="brand" value={editProduct.brand} onChange={handleChange} />
//             </div>

//             <div className='grid gap-2'>
//               <Label>Description</Label>
//               <Textarea name="productDesc" value={editProduct.productDesc} onChange={handleChange} />
//             </div>

//             <ImageUpload
//               productData={editProduct}
//               setProductData={setEditProduct}
//             />

//             <DialogFooter className="flex gap-2 mt-4">
//               <DialogClose asChild>
//                 <Button variant="outline">Cancel</Button>
//               </DialogClose>
//               <Button type="submit">Save changes</Button>
//             </DialogFooter>

//           </form>
//         </DialogContent>
//       </Dialog>
//     )}

//   </div>
// )
//   // return (
//   //   <div className='pl-[350px] py-10 pr-20 flex flex-col gap-3 min-h-screen bg-gray-100'>

//   //     <div className="flex justify-between">

//   //       {/* 🔍 Search */}
//   //       <div className="relative bg-white rounded-lg">
//   //         <Input
//   //           type='text'
//   //           placeholder='Search Product...'
//   //           className='w-[400px]'
//   //           value={search}
//   //           onChange={(e) => handleSearch(e.target.value)}
//   //         />
//   //         <Search className='absolute right-3 top-1.5 text-gray-500' />
//   //       </div>

//   //       {/* 🔽 Sort */}
//   //       <Select onValueChange={(value) => setSortOrder(value)}>
//   //         <SelectTrigger className="w-[200px] bg-white">
//   //           <SelectValue placeholder="Sort By Price" />
//   //         </SelectTrigger>
//   //         <SelectContent>
//   //           <SelectGroup>
//   //             <SelectItem value="lowToHigh">Price: Low To High</SelectItem>
//   //             <SelectItem value="highToLow">Price: High To Low</SelectItem>
//   //           </SelectGroup>
//   //         </SelectContent>
//   //       </Select>

//   //       <div>
//   //         <Button
//   //           className='bg-[#5A7863]'
//   //           onClick={() => navigate("/dashboard/add-product")}>
//   //           Add Product
//   //         </Button>
//   //       </div>

//   //     </div>

//   //     {
//   //       [...products]
//   //         .sort((a, b) => {
//   //           if (sortOrder === "lowToHigh") {
//   //             return Number(a.productPrice) - Number(b.productPrice)
//   //           }
//   //           if (sortOrder === "highToLow") {
//   //             return Number(b.productPrice) - Number(a.productPrice)
//   //           }
//   //           return 0
//   //         })
//   //         .slice(0, visibleCount)
//   //         .map((product, index) => {
//   //           if (!product) return null

//   //           return (
//   //             <Card key={index} className='px-4'>
//   //               <div className="flex items-center justify-between">

//   //                 <div className="flex gap-2 items-center">
//   //                   <img
//   //                     src={product?.productImg?.[0]?.url || product?.productImg?.[0] || "/placeholder.png"}
//   //                     className="w-25 h-25"
//   //                   />
//   //                   <h1 className='w-96 font-bold text-gray-700'>
//   //                     {product?.productName}
//   //                   </h1>
//   //                 </div>

//   //                 <h1 className='font-semibold text-gray-400'>
//   //                   {product?.category?.categoryName}
//   //                 </h1>

//   //                 <h1 className='font-semibold text-gray-800'>
//   //                   ₹{product?.productPrice}
//   //                 </h1>

//   //                 <div className='flex gap-3'>

//   //                   <Edit
//   //                     onClick={() => {
//   //                       setEditProduct(product);
//   //                       setOpen(true);
//   //                     }}
//   //                     className='text-gray-500 cursor-pointer'
//   //                   />

//   //                   <AlertDialog>
//   //                     <AlertDialogTrigger asChild>
//   //                       <Trash2 className='text-red-500 cursor-pointer' />
//   //                     </AlertDialogTrigger>
//   //                     <AlertDialogContent>
//   //                       <AlertDialogHeader>
//   //                         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//   //                         <AlertDialogDescription>
//   //                           This will permanently delete this product.
//   //                         </AlertDialogDescription>
//   //                       </AlertDialogHeader>
//   //                       <AlertDialogFooter>
//   //                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//   //                         <AlertDialogAction onClick={() => deleteProductHandler(product._id)}>
//   //                           Continue
//   //                         </AlertDialogAction>
//   //                       </AlertDialogFooter>
//   //                     </AlertDialogContent>
//   //                   </AlertDialog>

//   //                 </div>
//   //               </div>
//   //             </Card>
//   //           )
//   //         })
//   //     }

//   //     {visibleCount < products.length && (
//   //       <div className="flex justify-center mt-6">
//   //         <Button
//   //           onClick={() => setVisibleCount(prev => prev + 5)}
//   //           className="bg-[#D8C9A7] text-white hover:bg-[#1D546C]"
//   //         >
//   //           Show More
//   //         </Button>
//   //       </div>
//   //     )}

//   //     {/* Edit Dialog */}
//   //     {editProduct && (
//   //       <Dialog open={open} onOpenChange={setOpen}>
//   //         <DialogContent className="sm:max-w-[625px] max-h-[500px] overflow-y-scroll">
//   //           <DialogHeader>
//   //             <DialogTitle>Edit Product</DialogTitle>
//   //             <DialogDescription>
//   //               Make changes to your product here.
//   //             </DialogDescription>
//   //           </DialogHeader>

//   //           <form className="flex flex-col gap-2" onSubmit={handleSave}>

//   //             <div className='grid gap-2'>
//   //               <Label>Product Name</Label>
//   //               <Input name="productName" value={editProduct.productName} onChange={handleChange} />
//   //             </div>

//   //             <div className='grid gap-2'>
//   //               <Label>Product Price</Label>
//   //               <Input name="productPrice" value={editProduct.productPrice} onChange={handleChange} />
//   //             </div>

//   //             <div className='grid gap-2'>
//   //               <Label>Brand</Label>
//   //               <Input name="brand" value={editProduct.brand} onChange={handleChange} />
//   //             </div>

//   //             <div className='grid gap-2'>
//   //               <Label>Description</Label>
//   //               <Textarea name="productDesc" value={editProduct.productDesc} onChange={handleChange} />
//   //             </div>

//   //             <ImageUpload
//   //               productData={editProduct}
//   //               setProductData={setEditProduct}
//   //             />

//   //             <DialogFooter className="flex gap-2 mt-4">
//   //               <DialogClose asChild>
//   //                 <Button variant="outline">Cancel</Button>
//   //               </DialogClose>
//   //               <Button type="submit">Save changes</Button>
//   //             </DialogFooter>

//   //           </form>
//   //         </DialogContent>
//   //       </Dialog>
//   //     )}

//   //   </div>
//   // )
// }

// export default AdminProduct






///// complet j hatu pan search working karayu and price nu karayu 


// import { Input } from '@/components/ui/input';
// import { Edit, Search, Trash2 } from 'lucide-react';
// import React, { useState } from 'react'
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Card } from '@/components/ui/card';
// import { useDispatch, useSelector } from 'react-redux';
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Textarea } from '@/components/ui/textarea';
// import ImageUpload from '@/components/ImageUpload';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { setProducts } from '@/Redux/productSlice';
// import { useNavigate } from "react-router-dom";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"

// const AdminProduct = () => {

//   const { products = [] } = useSelector(store => store.product)
//   const [editProduct, setEditProduct] = useState(null)
//   const accessToken = localStorage.getItem("accessToken")
//   const [open, setOpen] = useState(false)
//   const dispatch = useDispatch()
//   const navigate = useNavigate();
//   const [visibleCount, setVisibleCount] = useState(5)

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setEditProduct(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleSave = async (e) => {
//     e.preventDefault()

//     const formData = new FormData()
//     formData.append("productName", editProduct.productName)
//     formData.append("productDesc", editProduct.productDesc)
//     formData.append("productPrice", editProduct.productPrice)
//     // formData.append("category", editProduct.category)
//     formData.append("category", editProduct.category?._id || editProduct.category)
//     formData.append("brand", editProduct.brand)
//     // add existing image in public id 
//     const existingImages = editProduct.productImg
//       .filter((img) => !(img instanceof File) && img.public_id)
//       .map((img) => img.public_id)

//     formData.append("existingImages", JSON.stringify(existingImages))

//     //  add new files
//     editProduct.productImg
//       .filter((img) => img instanceof File)
//       .forEach((file) => {
//         formData.append("files", file)
//       })
//     try {

//       const res = await axios.put(
//         `http://localhost:8000/api/v1/product/update/${editProduct._id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`
//           }
//         }
//       )

//       if (res.data.success) {
//         toast.success('Product Updated Successfully')
//         const updateProducts = products.map((p) =>
//           p._id === editProduct._id ? res.data.product : p)
//         dispatch(setProducts(updateProducts))
//         setOpen(false)
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const deleteProductHandler = async (productId) => {
//     try {
//       const remainingProducts = products.filter((product) => product._id !== productId)
//       const res = await axios.delete(`http://localhost:8000/api/v1/product/delete/${productId}`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       })
//       if (res.data.success) {
//         toast.success(res.data.message)  // aa data backend thi malse 
//         dispatch(setProducts(remainingProducts))
//       }
//     } catch (error) {
//       console.log(error);

//     }
//   }

//   return (
//     <div className='pl-[350px] py-10 pr-20 flex flex-col gap-3 min-h-screen bg-gray-100'>

//       <div className="flex justify-between">

//         <div className="relative bg-white rounded-lg">
//           <Input type='text' placeholder='Search Product...' className='w-[400px]' />
//           <Search className='absolute right-3 top-1.5 text-gray-500' />
//         </div>
        
//         <Select>
//           <SelectTrigger className="w-[200px] bg-white">
//             <SelectValue placeholder="Sort By Price" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectItem value="lowToHigh">Price: Low To High</SelectItem>
//               <SelectItem value="highToLow">Price: High To Low</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>

//         <div className=''>
//           <Button
//             className='bg-[#5A7863]'
//             onClick={() => navigate("/dashboard/add-product")}>
//             Add Product
//           </Button>
//         </div>

//       </div>

//       {

//         products?.slice(0, visibleCount).map((product, index) => {
//           if (!product) return null
//           return (
//             <Card key={index} className='px-4'>
//               <div className="flex items-center justify-between">
//                 <div className="flex gap-2 items-center">
//                   {/* <img
//                     src={product?.productImg?.[0]?.url}
//                     className="w-25 h-25"
//                   /> */}
//                   <img
//                     src={product?.productImg?.[0]?.url || product?.productImg?.[0]}
//                     className="w-25 h-25"
//                   />
//                   <h1 className='w-96 font-bold text-gray-700'>
//                     {product?.productName}
//                   </h1>
//                 </div>
//                 <h1 className='font-semibold text-gray-400'>
//                   {product?.category?.categoryName}
//                 </h1>
//                 <h1 className='font-semibold text-gray-800'>
//                   ₹{product?.productPrice}
//                 </h1>
//                 <div className='flex gap-3'>
//                   <Dialog>
//                     <DialogTrigger asChild>
//                       <Edit
//                         onClick={() => {
//                           setEditProduct(product); // select product to edit
//                           setOpen(true);
//                         }}
//                         className='text-gray-500 cursor-pointer'
//                       />
//                     </DialogTrigger>

//                     {editProduct && (
//                       <DialogContent className="sm:max-w-[625px] max-h-[500px] overflow-y-scroll">
//                         <DialogHeader>
//                           <DialogTitle>Edit Product</DialogTitle>
//                           <DialogDescription>
//                             Make changes to your product here. Click save when you're done.
//                           </DialogDescription>
//                         </DialogHeader>

//                         <form className="flex flex-col gap-2" onSubmit={handleSave}>
//                           <div className='grid gap-2'>
//                             <Label>Product Name</Label>
//                             <Input
//                               type='text'
//                               name="productName"
//                               value={editProduct.productName}
//                               onChange={handleChange}
//                             />
//                           </div>

//                           <div className='grid gap-2'>
//                             <Label>Product Price</Label>
//                             <Input
//                               type='number'
//                               name="productPrice"
//                               value={editProduct.productPrice}
//                               onChange={handleChange}
//                             />
//                           </div>

//                           <div className='grid grid-cols-2 gap-4'>
//                             <div className="grid gap-2">
//                               <Label>Brand</Label>
//                               <Input
//                                 type='text'
//                                 name="brand"
//                                 value={editProduct.brand}
//                                 onChange={handleChange}
//                               />
//                             </div>

//                             <div className="grid gap-2">
//                               <Label>Category</Label>
//                               <Input
//                                 type="text"
//                                 name="category"
//                                 value={editProduct?.category?.categoryName || ""}
//                                 readOnly
//                                 className="bg-gray-100 cursor-not-allowed"
//                               />
//                             </div>
//                           </div>

//                           <div className='grid gap-2'>
//                             <Label>Description</Label>
//                             <Textarea
//                               name='productDesc'
//                               value={editProduct.productDesc}
//                               onChange={handleChange}
//                             />
//                           </div>

//                           <ImageUpload
//                             productData={editProduct}
//                             setProductData={setEditProduct}
//                           />

//                           <DialogFooter className="flex gap-2 mt-4">
//                             <DialogClose asChild>
//                               <Button variant="outline">Cancel</Button>
//                             </DialogClose>
//                             <Button type="submit">Save changes</Button>
//                           </DialogFooter>
//                         </form>
//                       </DialogContent>
//                     )}
//                   </Dialog>
//                   <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                       <Trash2 className='text-red-500 cursor-pointer' />
//                     </AlertDialogTrigger>
//                     <AlertDialogContent>
//                       <AlertDialogHeader>
//                         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                         <AlertDialogDescription>
//                           This action cannot be undone. This will permanently delete your account
//                           from our servers.
//                         </AlertDialogDescription>
//                       </AlertDialogHeader>
//                       <AlertDialogFooter>
//                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                         <AlertDialogAction onClick={() => deleteProductHandler(product._id)}>Continue</AlertDialogAction>
//                       </AlertDialogFooter>
//                     </AlertDialogContent>
//                   </AlertDialog>

//                 </div>
//               </div>
//             </Card>

//           )
//         })
//       }
//       {visibleCount < products.length && (
//         <div className="flex justify-center mt-6">
//           <Button
//             onClick={() => setVisibleCount(prev => prev + 5)}
//             className="bg-[#D8C9A7] text-white hover:bg-[#1D546C]"
//           >
//             Show More
//           </Button>
//         </div>
//       )}

//     </div>
//   )
// }

// export default AdminProduct






// import { Input } from '@/components/ui/input';
// import { Edit, Search, Trash2 } from 'lucide-react';
// import React, { useState } from 'react'
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Card } from '@/components/ui/card';
// import { useDispatch, useSelector } from 'react-redux';
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Textarea } from '@/components/ui/textarea';
// import ImageUpload from '@/components/ImageUpload';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { setProducts } from '@/Redux/productSlice';



// const AdminProduct = () => {
//   const { products } = useSelector(store => store.product)
//   const [editProduct, setEditProduct] = useState(null)
//   const accessToken = localStorage.getItem("accessToken")
//   const dispatch = useDispatch()

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setEditProduct(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const handleSave = async (e) => {
//     e.preventDefault()

//     const formData = new FormData()
//     formData.append("productName", editProduct.productName)
//     formData.append("productDesc", editProduct.productDesc)
//     formData.append("productPrice", editProduct.productPrice)
//     formData.append("category", editProduct.category)
//     formData.append("brand", editProduct.brand)

//     // add existing images public_id

//     const existingImages = editProduct.productImg
//       .filter((img) => !(img instanceof File) && img.public_id)
//       .map((img) => img.public_id)

//     formData.append("existingImages", JSON.stringify(existingImages))

//     // addnew files
//     editProduct.productImg
//       .filter((img) => img instanceof File)
//       .forEach((file) => {
//         formData.append("files", file)
//       })

//     try {
//       const res = await axios.put(`http://localhost:8000/api/v1/product/update/${editProduct._id}`, formData, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       })
//       if (res.data.success) {
//         toast.success('Product Updated Successfully')

//         const updateProducts = products.map((p) =>
//           p._id === editProduct._id ? res.data.product : p
//         )

//         dispatch(setProducts(updateProducts))
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }
//   return (
//     <div className='pl-[350px] py-10 pr-20 flex flex-col gap-3 min-h-screen bg-gray-100'>
//       <div className="flex justify-between">
//         <div className="relative bg-white rounded-lg">
//           <Input type='text' placeholder='Search Product...' className='w-[400px] items-center' />
//           <Search className='absolute right-3 top-1.5 text-gray-500' />
//         </div>
//         <Select>
//           <SelectTrigger className="w-[200px] py bg-white">
//             <SelectValue placeholder="Sort By Price" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectGroup>
//               <SelectItem value="lowToHigh">Price:Low To High</SelectItem>
//               <SelectItem value="highToLow">Price:High To Low</SelectItem>
//             </SelectGroup>
//           </SelectContent>
//         </Select>
//       </div>
//       {
//         products.map((product, index) => {
//           return <Card key={index} className='px-4'>
//             <div className="flex items-center justify-between">
//               <div className="flex gap-2 items-center">
//                 {/* <img src={product.productImg[0].url} alt="" className='w-25 h-25' /> */}
//                 <img src={product?.productImg?.[0]?.url} className="w-25 h-25" />
//                 <h1 className='w-96 font-bold text-gray-700'>{product.productName}</h1>
//               </div>
//               <h1 className='font-semibold text-gray-800'>₹{product.productPrice}</h1>
//               <div className='flex gap-3'>
//                 <Dialog>
//                   <form>
//                     <DialogTrigger asChild>
//                       {/* <Edit className='text-gray-500 cursor-pointer' /> */}
//                       <Edit
//                         onClick={() => setEditProduct(product)}
//                         className='text-gray-500 cursor-pointer'
//                       />
//                     </DialogTrigger>
//                     <DialogContent className="sm:max-w-[625px] max-h-[740px ] overflow-y-scroll">
//                       <DialogHeader>
//                         <DialogTitle>Edit profile</DialogTitle>
//                         <DialogDescription>
//                           Make changes to your Produt here. Click save when you&apos;re
//                           done.
//                         </DialogDescription>
//                       </DialogHeader>
//                       <div className="flex flex-col gap-2">
//                         <div className='grid gap-2'>
//                           <Label>Product Name</Label>
//                           <Input
//                             type='text'
//                             name="productName"
//                             value={editProduct?.productName}
//                             onChange={handleChange}
//                             placeholder="EX-Two seater Soffa" required />
//                         </div>

//                         <div className='grid gap-2'>
//                           <Label>Product Price</Label>
//                           <Input
//                             type='number'
//                             name="productPrice"
//                             value={editProduct?.productPrice}
//                             onChange={handleChange}
//                           />
//                         </div>
//                         <div className='grid grid-cols-2 gap-4'>
//                           <div className="grid gap-2">
//                             <Label>Brand</Label>
//                             <Input
//                               type='text'
//                               value={editProduct?.brand}
//                               onChange={handleChange}
//                               name="brand"
//                               placeholder="EX-Assembly" />
//                           </div>
//                           <div className="grid gap-2">
//                             <Label>Category</Label>
//                             <Input
//                               type='text'
//                               name="category"
//                               value={editProduct?.category}
//                               onChange={handleChange}
//                               placeholder="Ex-Sofa" />
//                           </div>
//                         </div>
//                         <div className='grid gap-2'>
//                           <div className='flex items-center'>
//                             <Label>Description</Label>
//                           </div>
//                           <Textarea
//                             name='productDesc'
//                             value={editProduct?.productDesc}
//                             onChange={handleChange}
//                             placeholder='Enter Breaf description of product' />
//                         </div>
//                         <ImageUpload productData={editProduct} setProductData={setEditProduct} />
//                       </div>
//                       <DialogFooter>
//                         <DialogClose asChild>
//                           <Button variant="outline">Cancel</Button>
//                         </DialogClose>
//                         <Button onClick={handleSave} type="submit">Save changes</Button>
//                       </DialogFooter>
//                     </DialogContent>
//                   </form>
//                 </Dialog>

//                 <Trash2 className='text-red-500 cursor-pointer' />
//               </div>
//             </div>
//           </Card>
//         })
//       }
//     </div >
//   )
// }
// export default AdminProduct;

