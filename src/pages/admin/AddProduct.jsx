

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/ImageUpload';
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setProducts } from '@/Redux/productSlice';
import { Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from "react-router-dom";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue
} from "@/components/ui/select";

const AddProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedCategoryId = location.state?.categoryId;

  const accessToken = localStorage.getItem("accessToken");
  const { product } = useSelector(store => store.product);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);

  const [productData, setProductData] = useState({
    productName: "",
    productPrice: "",
    productDesc: "",
    productImg: [],
    brand: "",
    category: "",
    quantity: ""
  });

  const fetchAllProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/product/get");
      if (res.data.success) {
        dispatch(setProducts(res.data.products || []));
      }
    } catch (error) {
      console.log("Fetch products error:", error);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/category/get");

        if (res.data.success) {
          setCategories(res.data.categories);

          if (selectedCategoryId) {
            setProductData((prev) => ({
              ...prev,
              category: selectedCategoryId
            }));
          }
        }
      } catch (error) {
        console.log("ERROR:", error.response?.data);
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    };

    fetchCategories();
    fetchAllProducts();
  }, [selectedCategoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "productPrice") {
      if (value === "") {
        setProductData((prev) => ({ ...prev, productPrice: "" }));
        return;
      }

      let numericValue = Number(value);

      if (numericValue < 0) numericValue = 0;
      if (numericValue > 1000000) numericValue = 1000000;

      setProductData((prev) => ({
        ...prev,
        productPrice: numericValue
      }));
      return;
    }

    if (name === "quantity") {
      if (value === "") {
        setProductData((prev) => ({ ...prev, quantity: "" }));
        return;
      }

      let numericValue = Number(value);

      if (numericValue < 0) numericValue = 0;
      if (numericValue > 50) numericValue = 50;

      setProductData((prev) => ({
        ...prev,
        quantity: numericValue
      }));
      return;
    }

    setProductData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!productData.productName.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (!productData.brand.trim()) {
      toast.error("Brand is required");
      return;
    }

    if (!productData.category) {
      toast.error("Please select category");
      return;
    }

    if (productData.productPrice === "" || Number(productData.productPrice) < 0 || Number(productData.productPrice) > 1000000) {
      toast.error("Price must be between 0 and 1000000");
      return;
    }

    if (productData.quantity === "" || Number(productData.quantity) < 0 || Number(productData.quantity) > 50) {
      toast.error("Quantity must be between 0 and 50");
      return;
    }

    if (productData.productImg.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("productDesc", productData.productDesc);
    formData.append("category", productData.category);
    formData.append("brand", productData.brand);
    formData.append("quantity", productData.quantity);

    productData.productImg.forEach((img) => {
      formData.append("files", img);
    });

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/api/v1/product/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      // if (res.data.success) {
      //   toast.success(res.data.message || "Product added successfully");

      //   await fetchAllProducts();

      //   setProductData({
      //     productName: "",
      //     productPrice: "",
      //     productDesc: "",
      //     productImg: [],
      //     brand: "",
      //     category: selectedCategoryId || "",
      //     quantity: ""
      //   });
      // }
      if (res.data.success) {
        toast.success(res.data.message || "Product added successfully");

        await fetchAllProducts();

        setTimeout(() => {
          navigate("/dashboard/products");
        }, 800);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 md:pl-[300px] w-full">
      <Card className="w-full my-1.5">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl">Add Product</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Enter Product Details Below
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 sm:px-6">
          <form onSubmit={submitHandler} className="flex flex-col gap-4 sm:gap-5">
            <div className="grid gap-2">
              <Label>Product Name</Label>
              <Input
                type="text"
                name="productName"
                value={productData.productName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  name="productPrice"
                  min="0"
                  max="1000000"
                  value={productData.productPrice}
                  onChange={handleChange}
                  placeholder="Enter price (max 1000000)"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  name="quantity"
                  min="0"
                  max="50"
                  value={productData.quantity}
                  onChange={handleChange}
                  placeholder="Enter quantity (max 50)"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Brand</Label>
                <Input
                  type="text"
                  name="brand"
                  value={productData.brand}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label>Category</Label>
                <Select
                  value={productData.category}
                  onValueChange={(value) =>
                    setProductData((prev) => ({
                      ...prev,
                      category: value
                    }))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.categoryName}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea
                name="productDesc"
                value={productData.productDesc}
                onChange={handleChange}
                className="min-h-[120px]"
              />
            </div>

            <div className="w-full overflow-hidden">
              <ImageUpload productData={productData} setProductData={setProductData} />
            </div>

            <CardFooter className="p-0 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-pink-600 hover:bg-pink-700 text-white"
              >
                {loading ? (
                  <span className="flex gap-2 items-center justify-center">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Please wait
                  </span>
                ) : (
                  "Add Product"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddProduct;
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import ImageUpload from '@/components/ImageUpload';
// import React, { useEffect, useState } from 'react'
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux';
// import { setProducts } from '@/Redux/productSlice';
// import { Loader2 } from 'lucide-react';
// import { useLocation } from "react-router-dom"; // ✅ CHANGE

// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectValue
// } from "@/components/ui/select";

// const AddProduct = () => {

//   const location = useLocation(); // ✅ CHANGE
//   const selectedCategoryId = location.state?.categoryId; // ✅ CHANGE

//   const accessToken = localStorage.getItem("accessToken")
//   const { product } = useSelector(store => store.product)
//   const [loading, setLoading] = useState(false)
//   const dispatch = useDispatch()
//   const [categories, setCategories] = useState([]);

//   const [productData, setProductData] = useState({
//     productName: "",
//     productPrice: 0,
//     productDesc: "",
//     productImg: [],
//     brand: "",
//     category: "",
//     quantity: 0
//   })

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/v1/category/get");

//         if (res.data.success) {
//           setCategories(res.data.categories);

//           // ✅ AUTO SELECT CATEGORY
//           if (selectedCategoryId) {
//             setProductData((prev) => ({
//               ...prev,
//               category: selectedCategoryId
//             }));
//           }
//         }

//       } catch (error) {
//         console.log("ERROR:", error.response?.data);
//         toast.error(error.response?.data?.message || "Something went wrong");
//       }

//     };

//     fetchCategories();
//   }, [selectedCategoryId]); // ✅ CHANGE

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProductData((prev) => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const submitHandler = async (e) => {
//     e.preventDefault()
//     const formData = new FormData();

//     formData.append("productName", productData.productName)
//     formData.append("productPrice", productData.productPrice)
//     formData.append("productDesc", productData.productDesc)
//     formData.append("category", productData.category)
//     formData.append("brand", productData.brand)
//     formData.append("quantity", productData.quantity)

//     if (productData.productImg.length === 0) {
//       toast.error("Please select at least one image");
//       return;
//     }

//     productData.productImg.forEach((img) => {
//       formData.append("files", img)
//     })

//     try {
//       setLoading(true)

//       const res = await axios.post(
//         "http://localhost:8000/api/v1/product/add",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "multipart/form-data"
//           }
//         }
//       );

//       if (res.data.success) {
//         dispatch(setProducts([...(product || []), res.data.product]))
//         toast.message(res.data.message)
//       }

//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false)
//     }
//   }
//   return (
//     <div className="bg-gray-100 min-h-screen py-10 px-4 md:pl-[320px] w-full">

//       <Card className="w-full my-1.5">
//         <CardHeader>
//           <CardTitle>AddProduct</CardTitle>
//           <CardDescription>Enter Product Details Below </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <div className="flex flex-col gap-2">

//             <div className="grid gap-2">
//               <Label>Product Name</Label>
//               <Input type='text' name='productName' value={productData.productName} onChange={handleChange} required />
//             </div>

//             <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

//               <div className="grid gap-2">
//                 <Label>Price</Label>
//                 <Input
//                   type='number'
//                   name='productPrice'
//                   min="0"
//                   value={productData.productPrice || ""}
//                   onChange={(e) => {
//                     if (e.target.value < 0) return;
//                     handleChange(e);
//                   }}
//                 />
//               </div>

//               <div className="grid gap-2">
//                 <Label>Quantity</Label>
//                 <Input
//                   type='number'
//                   name='quantity'
//                   min="0"
//                   value={productData.quantity || ""}
//                   onChange={(e) => {
//                     if (e.target.value < 0) return;
//                     handleChange(e);
//                   }}
//                 />
//               </div>

//             </div>
//             {/* 🔥 FIX: responsive grid */}
//             <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

//               <div className="grid gap-2">
//                 <Label>Brand</Label>
//                 <Input type='text' name='brand' value={productData.brand} onChange={handleChange} required />
//               </div>

//               <div className="grid gap-2">
//                 <Label>Category</Label>

//                 <Select
//                   value={productData.category}
//                   onValueChange={(value) =>
//                     setProductData((prev) => ({
//                       ...prev,
//                       category: value
//                     }))
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Category" />
//                   </SelectTrigger>

//                   <SelectContent>
//                     <SelectGroup>
//                       {
//                         categories.map((cat) => (
//                           <SelectItem key={cat._id} value={cat._id}>
//                             {cat.categoryName}
//                           </SelectItem>
//                         ))
//                       }
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>

//             </div>

//             <div className="grid gap-2">
//               <Label>Description</Label>
//               <Textarea name='productDesc' value={productData.productDesc} onChange={handleChange} />
//             </div>

//             <ImageUpload productData={productData} setProductData={setProductData} />

//           </div>

//           <CardFooter className='flex gap-2'>
//             <Button disabled={loading} onClick={submitHandler} className='w-full mt-5 bg-pink-600'>
//               {
//                 loading
//                   ? <span className='flex gap-1 items-center'>
//                     <Loader2 className='animate-spin' />
//                     please wait
//                   </span>
//                   : 'Add Product'
//               }
//             </Button>
//           </CardFooter>

//         </CardContent>
//       </Card>

//     </div>
//   )
//   // return (
//   //   // <div className='pl-[350px] py-10 min-h-screen pr-20 mx-auto px-4 bg-gray-100 '>
//   //   <div className='bg-gray-100 min-h-screen py-10 px-4 md:pl-[300px]'>
//   //     <Card className='w-full my-1.5'>
//   //       <CardHeader>
//   //         <CardTitle>AddProduct</CardTitle>
//   //         <CardDescription>Enter Product Details Below </CardDescription>
//   //       </CardHeader>
//   //       <CardContent>
//   //         <div className="flex flex-col gap-2">

//   //           <div className="grid gap-2">
//   //             <Label>Product Name</Label>
//   //             <Input type='text' name='productName' value={productData.productName} onChange={handleChange} required />
//   //           </div>

//   //           <div className="grid gap-2">
//   //             <Label>Price</Label>
//   //             <Input type='number' value={productData.productPrice || ""} onChange={handleChange} name='productPrice' required />
//   //           </div>

//   //           <div className='grid grid-cols-2 gap-4'>

//   //             <div className="grid gap-2">
//   //               <Label>Brand</Label>
//   //               <Input type='text' name='brand' value={productData.brand} onChange={handleChange} required />
//   //             </div>

//   //             <div className="grid gap-2">
//   //               <Label>Category</Label>

//   //               <Select
//   //                 value={productData.category}
//   //                 onValueChange={(value) =>
//   //                   setProductData((prev) => ({
//   //                     ...prev,
//   //                     category: value
//   //                   }))
//   //                 }
//   //               >
//   //                 <SelectTrigger>
//   //                   <SelectValue placeholder="Select Category" />
//   //                 </SelectTrigger>

//   //                 <SelectContent>
//   //                   <SelectGroup>
//   //                     {
//   //                       categories.map((cat) => (
//   //                         <SelectItem key={cat._id} value={cat._id}>
//   //                           {cat.categoryName}
//   //                         </SelectItem>
//   //                       ))
//   //                     }
//   //                   </SelectGroup>
//   //                 </SelectContent>
//   //               </Select>
//   //             </div>

//   //           </div>

//   //           <div className="grid gap-2">
//   //             <Label>Description</Label>
//   //             <Textarea name='productDesc' value={productData.productDesc} onChange={handleChange} />
//   //           </div>

//   //           <ImageUpload productData={productData} setProductData={setProductData} />

//   //         </div>

//   //         <CardFooter className='flex gap-2'>
//   //           <Button disabled={loading} onClick={submitHandler} className='w-full mt-5 bg-pink-600'>
//   //             {
//   //               loading
//   //                 ? <span className='flex gap-1 items-center'>
//   //                   <Loader2 className='animate-spin' />
//   //                   please wait
//   //                 </span>
//   //                 : 'Add Product'
//   //             }
//   //           </Button>
//   //         </CardFooter>

//   //       </CardContent>
//   //     </Card>
//   //   </div>
//   // )
// }

// export default AddProduct;





// today






// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import ImageUpload from '@/components/ImageUpload';
// import React, { useEffect, useState } from 'react'
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux';
// import { setProducts } from '@/Redux/productSlice';
// import { Loader2 } from 'lucide-react';

// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectValue
// } from "@/components/ui/select";


// const AddProduct = () => {
//   const accessToken = localStorage.getItem("accessToken")
//   const { product } = useSelector(store => store.product)
//   const [loading, setLoading] = useState(false)
//   const dispatch = useDispatch()
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axios.get("http://localhost:8000/api/v1/category/get");
//         if (res.data.success) {
//           setCategories(res.data.categories);
//         }
//       } catch (error) {
//         console.log("ERROR:", error.response?.data);
//         toast.error(error.response?.data?.message || "Something went wrong");
//       }

//     };

//     fetchCategories();
//   }, []);
//   const [productData, setProductData] = useState({
//     productName: "",
//     productPrice: 0,
//     productDesc: "",
//     productImg: [],
//     brand: "",
//     category: ""

//   })

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProductData((prev) => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const submitHandler = async (e) => {
//     e.preventDefault()
//     const formData = new FormData();
//     formData.append("productName", productData.productName)
//     formData.append("productPrice", productData.productPrice)
//     formData.append("productDesc", productData.productDesc)
//     formData.append("category", productData.category)
//     formData.append("brand", productData.brand)

//     if (productData.productImg.length === 0) {
//       toast.error("Please select at least one image");
//       return;
//     }
//     productData.productImg.forEach((img) => {
//       formData.append("files", img)
//     })
//     try {
//       setLoading(true)
//       // const res = await axios.post(`http://localhost:8000/api/v1/product/add`, formData, {
//       //   headers: {
//       //     Authorization: `Bearer ${accessToken}`
//       //   }
//       // })
//       const res = await axios.post(
//         "http://localhost:8000/api/v1/product/add",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "multipart/form-data"
//           }
//         }
//       );
//       if (res.data.success) {
//         dispatch(setProducts([...(product || []), res.data.product]))
//         toast.message(res.data.message)
//       }

//     } catch (error) {
//       console.log(error);
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className='pl-[350px] py-10 min-h-screen pr-20 mx-auto px-4 bg-gray-100 '>
//       <Card className='w-full my-1.5'>
//         <CardHeader>
//           <CardTitle>AddProduct</CardTitle>
//           <CardDescription>Enter Product Details Below </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col gap-2">
//             <div className="grid gap-2">
//               <Label>Product Name</Label>
//               <Input type='text' name='productName' value={productData.productName} onChange={handleChange} placeholder='Ex-One Seater Sofa' required />
//             </div>
//             <div className="grid gap-2">
//               <Label>Price</Label>
//               <Input type='number' value={productData.productPrice} onChange={handleChange} name='productPrice' placeholder='' required />
//             </div>
//             <div className='grid grid-cols-2 gap-4'>
//               <div className="grid gap-2">
//                 <Label>Brand</Label>
//                 <Input type='text' name='brand' value={productData.brand} onChange={handleChange} placeholder='Ex-sleepwell' required />
//               </div>
//               {/* <div className="grid gap-2">
//                 <Label>Category</Label>
//                 <Input type='text' name='category' value={productData.category} onChange={handleChange} placeholder='Ex-Sofa' required />
//               </div> */}

//               <div className="grid gap-2">
//                 <Label>Category</Label>

//                 <Select
//                   value={productData.category}
//                   onValueChange={(value) =>
//                     setProductData((prev) => ({
//                       ...prev,
//                       category: value
//                     }))
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select Category" />
//                   </SelectTrigger>

//                   <SelectContent>
//                     <SelectGroup>
//                       {
//                         categories.map((cat) => (
//                           <SelectItem key={cat._id} value={cat._id}>
//                             {cat.categoryName}
//                           </SelectItem>
//                         ))
//                       }
//                     </SelectGroup>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="grid gap-2">
//               <div className="flex items-center">
//                 <Label>Description</Label>
//               </div>
//               <Textarea name='productDesc' value={productData.productDesc} onChange={handleChange} placeholder='Enter brief description of product ' />
//             </div>
//             <ImageUpload productData={productData} setProductData={setProductData} />
//           </div>
//           <CardFooter className='flex gap-2'>
//             <Button disabled={loading} onClick={submitHandler} className='w-full mt-5 bg-pink-600 cursor-pointer' type='submit'>
//               {
//                 loading ? <span className='flex gap-1 items-center'><Loader2 className='animate-spin' />please wait</span> : 'Add Product'
//               }
//             </Button>
//           </CardFooter>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
// export default AddProduct;