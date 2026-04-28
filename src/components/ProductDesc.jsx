import React, { useState } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setCart } from '@/Redux/productSlice';
import { API_BASE_URL } from "@/config/api";

const ProductDesc = ({ product }) => {
    const accessToken = localStorage.getItem("accessToken")
    const dispatch = useDispatch()

    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState("");

    const increaseQty = () => {
        if (product?.quantity === 0) {
            setError("Out of Stock")
            return
        }

        if (quantity >= 5) {
            setError("You cannot buy more than 5 items")
            return
        }

        if (quantity >= product?.quantity) {
            setError(`Only ${product?.quantity} items available`)
            return
        }

        setQuantity(quantity + 1)
        setError("")
    }

    const decreaseQty = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
            setError("")
        }
    }

    const addToCart = async (productId) => {
        if (product?.quantity === 0) {
            toast.error("Out of Stock")
            return
        }

        if (quantity > 5) {
            toast.error("You cannot buy more than 5 items")
            return
        }

        if (quantity > product?.quantity) {
            toast.error(`Only ${product?.quantity} items available`)
            return
        }

        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/v1/cart/add`,
                { productId, quantity },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            )

            if (res.data.success) {
                toast.success('Product Added To Cart')
                dispatch(setCart(res.data.cart))
                setError("")
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to add product")
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            <h1 className='font-bold text-4xl text-gray-800'>{product.productName}</h1>

            <p className='font-bold text-gray-800'>
                {product.category?.categoryName} | {product.brand}
            </p>

            <h2 className='font-bold text-2xl text-pink-500'>₹{product.productPrice}</h2>

            {/* Stock message */}
            {product?.quantity === 0 ? (
                <p className='font-medium text-red-500'>
                    Out of Stock
                </p>
            ) : product?.quantity <= 3 ? (
                <p className='font-medium text-yellow-500 transition-all duration-200 hover:text-red-500 hover:scale-105 w-max cursor-default'>
                    Only {product?.quantity} left
                </p>
            ) : null}

            <div className="bg-gray-50 p-4 rounded-xl border space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Product Details
                </h3>

                <p className="text-gray-600 leading-relaxed">
                    {product.productDesc?.split(".").slice(0, 2).join(".")}.
                </p>

                <ul className="list-disc pl-5 text-gray-600 space-y-1 text-sm">
                    {product.productDesc
                        ?.split(".")
                        .slice(2)
                        .filter((line) => line.trim() !== "")
                        .map((line, index) => (
                            <li key={index}>{line.trim()}</li>
                        ))}
                </ul>
            </div>

            <div className="flex flex-col gap-1">
                <div className="flex gap-2 items-center">
                    <p className='text-gray-800 font-semibold'>Quantity</p>

                    <button
                        onClick={decreaseQty}
                        className="px-3 py-1 bg-gray-200 rounded"
                    >
                        -
                    </button>

                    <Input
                        type='number'
                        className='w-14 text-center'
                        value={quantity}
                        readOnly
                    />

                    <button
                        onClick={increaseQty}
                        className="px-3 py-1 bg-gray-200 rounded"
                    >
                        +
                    </button>
                </div>

                {error && (
                    <p className="text-red-500 text-sm">
                        {error}
                    </p>
                )}
            </div>

            <Button
                onClick={() => addToCart(product._id)}
                disabled={product?.quantity === 0}
                className='bg-pink-600 w-max disabled:bg-gray-400 disabled:cursor-not-allowed'
            >
                {product?.quantity === 0 ? "Out of Stock" : "Add To Cart"}
            </Button>
        </div>
    )
}

export default ProductDesc









// import React, { useState } from 'react'
// import { Input } from './ui/input';
// import { Button } from './ui/button';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { useDispatch } from 'react-redux';
// import { setCart } from '@/Redux/productSlice';

// const ProductDesc = ({ product }) => {
//     const accessToken = localStorage.getItem("accessToken")
//     const dispatch = useDispatch()

//     const [quantity, setQuantity] = useState(1);
//     const [error, setError] = useState("");

//     const increaseQty = () => {
//         if (product?.quantity === 0) {
//             setError("Out of Stock")
//             return
//         }

//         if (quantity >= 5) {
//             setError("You cannot buy more than 5 items")
//             return
//         }

//         if (quantity >= product?.quantity) {
//             setError(`Only ${product?.quantity} items available`)
//             return
//         }

//         setQuantity(quantity + 1)
//         setError("")
//     }

//     const decreaseQty = () => {
//         if (quantity > 1) {
//             setQuantity(quantity - 1)
//             setError("")
//         }
//     }

//     const addToCart = async (productId) => {
//         if (product?.quantity === 0) {
//             toast.error("Out of Stock")
//             return
//         }

//         if (quantity > 5) {
//             toast.error("You cannot buy more than 5 items")
//             return
//         }

//         if (quantity > product?.quantity) {
//             toast.error(`Only ${product?.quantity} items available`)
//             return
//         }

//         try {
//             const res = await axios.post(
//                 'http://localhost:8000/api/v1/cart/add',
//                 { productId, quantity },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${accessToken}`
//                     }
//                 }
//             )

//             if (res.data.success) {
//                 toast.success('Product Added To Cart')
//                 dispatch(setCart(res.data.cart))
//                 setError("")
//             }
//         } catch (error) {
//             console.log(error);
//             toast.error(error?.response?.data?.message || "Failed to add product")
//         }
//     }

//     return (
//         <div className='flex flex-col gap-4'>
//             <h1 className='font-bold text-4xl text-gray-800'>{product.productName}</h1>

//             <p className='font-bold text-gray-800'>
//                 {product.category?.categoryName} | {product.brand}
//             </p>

//             <h2 className='font-bold text-2xl text-pink-500'>₹{product.productPrice}</h2>

//             <p className={`font-medium ${
//                 product?.quantity === 0
//                     ? "text-red-500"
//                     : product?.quantity < 5
//                     ? "text-yellow-500"
//                     : "text-green-600"
//             }`}>
//                 {
//                     product?.quantity === 0
//                         ? "Out of Stock"
//                         : product?.quantity < 5
//                         ? `Only ${product?.quantity} left`
//                         : `Available: ${product?.quantity}`
//                 }
//             </p>

//             <p className='font-bold text-muted-foreground'>{product.productDesc}</p>

//             <div className="flex flex-col gap-1">
//                 <div className="flex gap-2 items-center">
//                     <p className='text-gray-800 font-semibold'>Quantity</p>

//                     <button
//                         onClick={decreaseQty}
//                         className="px-3 py-1 bg-gray-200 rounded"
//                     >
//                         -
//                     </button>

//                     <Input
//                         type='number'
//                         className='w-14 text-center'
//                         value={quantity}
//                         readOnly
//                     />

//                     <button
//                         onClick={increaseQty}
//                         className="px-3 py-1 bg-gray-200 rounded"
//                     >
//                         +
//                     </button>
//                 </div>

//                 {error && (
//                     <p className="text-red-500 text-sm">
//                         {error}
//                     </p>
//                 )}
//             </div>

//             <Button
//                 onClick={() => addToCart(product._id)}
//                 disabled={product?.quantity === 0}
//                 className='bg-pink-600 w-max disabled:bg-gray-400 disabled:cursor-not-allowed'
//             >
//                 {product?.quantity === 0 ? "Out of Stock" : "Add To Cart"}
//             </Button>
//         </div>
//     )
// }

// export default ProductDesc






/// quantity mate kariyu chhe


// import React, { useState } from 'react'
// import { Input } from './ui/input';
// import { Button } from './ui/button';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { useDispatch } from 'react-redux';
// import { setCart } from '@/Redux/productSlice';

// const ProductDesc = ({ product }) => {
//     const accessToken = localStorage.getItem("accessToken")
//     const dispatch = useDispatch()

//     // ✅ Quantity + Error state
//     const [quantity, setQuantity] = useState(1);
//     const [error, setError] = useState("");

//     // 🔥 Increase Quantity
//     const increaseQty = () => {
//         if (product?.quantity === 0) {
//             setError("Out of Stock")
//             return
//         }

//         if (quantity >= 5) {
//             setError("You cannot buy more than 5 items")
//             return
//         }

//         if (quantity >= product?.quantity) {
//             setError(`Only ${product?.quantity} items available`)
//             return
//         }

//         setQuantity(quantity + 1)
//         setError("")
//     }
//     // const increaseQty = () => {
//     //     if (quantity >= 5) {
//     //         setError("You cannot buy more than 5 items")
//     //         return
//     //     }
//     //     setQuantity(quantity + 1)
//     //     setError("")
//     // }

//     // 🔥 Decrease Quantity
//     const decreaseQty = () => {
//         if (quantity > 1) {
//             setQuantity(quantity - 1)
//             setError("")
//         }
//     }

//     const addToCart = async (productId) => {
//         if (quantity > 5) {
//             toast.error("You cannot buy more than 5 items")
//             return
//         }

//         try {
//             const res = await axios.post(
//                 'http://localhost:8000/api/v1/cart/add',
//                 { productId, quantity },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${accessToken}`
//                     }
//                 }
//             )
//             if (res.data.success) {
//                 toast.success('Product Added To Cart')
//                 dispatch(setCart(res.data.cart))
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     return (
//         <div className='flex flex-col gap-4'>
//             <h1 className='font-bold text-4xl text-gray-800'>{product.productName}</h1>

//             {/* Category & Brand */}
//             <p className='font-bold text-gray-800'>
//                 {product.category?.categoryName} | {product.brand}
//             </p>

//             <h2 className='font-bold text-2xl text-pink-500'>₹{product.productPrice}</h2>
//             <p className='font-bold text-muted-foreground'>{product.productDesc}</p>

//             {/* 🔥 Quantity Control */}
//             <div className="flex flex-col gap-1">
//                 <div className="flex gap-2 items-center">
//                     <p className='text-gray-800 font-semibold'>Quantity</p>

//                     <button
//                         onClick={decreaseQty}
//                         className="px-3 py-1 bg-gray-200 rounded"
//                     >
//                         -
//                     </button>

//                     <Input
//                         type='number'
//                         className='w-14 text-center'
//                         value={quantity}
//                         readOnly
//                     />

//                     <button
//                         onClick={increaseQty}
//                         className="px-3 py-1 bg-gray-200 rounded"
//                     >
//                         +
//                     </button>
//                 </div>

//                 {/* ❌ Error Message */}
//                 {error && (
//                     <p className="text-red-500 text-sm">
//                         {error}
//                     </p>
//                 )}
//             </div>

//             <Button
//                 onClick={() => addToCart(product._id)}
//                 className='bg-pink-600 w-max'
//             >
//                 Add To Cart
//             </Button>
//         </div>
//     )
// }

// export default ProductDesc






// collage ma thi change karva nu kidhu hatu aa change kariyu chhe olu quantity nu



// import React, { useState } from 'react'
// import { Input } from './ui/input';
// import { Button } from './ui/button';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { useDispatch } from 'react-redux';
// import { setCart } from '@/Redux/productSlice';

// const ProductDesc = ({ product }) => {
//     const accessToken = localStorage.getItem("accessToken")
//     const dispatch = useDispatch()

//     // ✅ Track quantity in state
//     const [quantity, setQuantity] = useState(1);

//     const addToCart = async(productId)=>{
//         try {
//             const res = await axios.post(
//                 'http://localhost:8000/api/v1/cart/add',
//                 { productId, quantity }, // send quantity to API
//                 {
//                     headers:{
//                         Authorization:`Bearer ${accessToken}`
//                     }
//                 }
//             )
//             if(res.data.success){
//                 toast.success('Product Added To Cart')
//                 dispatch(setCart(res.data.cart))
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     return (
//         <div className='flex flex-col gap-4'>
//             <h1 className='font-bold text-4xl text-gray-800'>{product.productName}</h1>

//             {/* Category & Brand */}
//             <p className='font-bold text-gray-800'>
//               {product.category?.categoryName} | {product.brand}
//             </p>

//             <h2 className='font-bold text-2xl text-pink-500'>₹{product.productPrice}</h2>
//             <p className='font-bold text-muted-foreground'>{product.productDesc}</p>

//             {/* Quantity Input */}
//             <div className="flex gap-2 items-center">
//                 <p className='text-gray-800 font-semibold'>Quantity</p>
//                 <Input
//                     type='number'
//                     className='w-14'
//                     min={1} // ✅ Minimum value 1
//                     value={quantity}
//                     onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} // prevent negative
//                 />
//             </div>

//             <Button onClick={()=>addToCart(product._id)} className='bg-pink-600 w-max'>
//               Add To Cart
//             </Button>
//         </div>
//     )
// }

// export default ProductDesc;




// import React from 'react'
// import { Input } from './ui/input';
// import { Button } from './ui/button';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { useDispatch } from 'react-redux';
// import { setCart } from '@/Redux/productSlice';

// const ProductDesc = ({ product }) => {
//     const accessToken = localStorage.getItem("accessToken")
//     const dispatch = useDispatch()

//     const addToCart = async(productId)=>{
//         try {
//             const res= await axios.post('http://localhost:8000/api/v1/cart/add',{productId},{
//                 headers:{
//                     Authorization:`Bearer ${accessToken}`
//                 }
//             })
//             if(res.data.success){
//                 toast.success('Product Added To Cart')
//                 dispatch(setCart(res.data.cart))
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     return (
//         <div className='flex flex-col gap-4'>
//             <h1 className='font-bold text-4xl text-gray-800'>{product.productName}</h1>

//             {/* Fixed category rendering */}
//             <p className='font-bold text-gray-800'>
//               {product.category?.categoryName} | {product.brand}
//             </p>

//             <h2 className='font-bold text-2xl text-pink-500'>₹{product.productPrice}</h2>
//             <p className='font-bold text-muted-foreground'>{product.productDesc}</p>

//             <div className="flex gap-2 items-center">
//                 <p className='text-gray-800 font-semibold'>Quantity</p>
//                 <Input type='number' className='w-14' defaultValue={1}/>
//             </div>

//             <Button onClick={()=>addToCart(product._id)} className='bg-pink-600 w-max'>
//               Add To Cart
//             </Button>
//         </div>
//     )
// }

// export default ProductDesc;



// import React from 'react'
// import { Input } from './ui/input';
// import { Button } from './ui/button';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { useDispatch } from 'react-redux';
// import { setCart } from '@/Redux/productSlice';

// const ProductDesc = ({ product }) => {
//     const accessToken = localStorage.getItem("accessToken")
//     const dispatch = useDispatch()

//     const addToCart = async(productId)=>{
//         try {
//             const res= await axios.post('http://localhost:8000/api/v1/cart/add',{productId},{
//                 headers:{
//                     Authorization:`Bearer ${accessToken}`
//                 }
//             })
//             if(res.data.success){
//                 toast.success('Product Added To Cart')
//                 dispatch(setCart(res.data.cart))
//             }
//         } catch (error) {
//             console.log(error);
//         }
//     }
//     return (
//         <div className='flex flex-col gap-4'>
//             <h1 className='font-bold text-4xl text-gray-800'>{product.productName}</h1>
//             <p className='font-bold  text-gray-800'>{product.category} | {product.brand}</p>
//             <h2 className='font-bold text-2xl  text-pink-500'>₹{product.productPrice}</h2>
//             <p className='font-bold text-muted-foreground '>{product.productDesc}</p>
//             <div className="flex gap-2 items-center e-[300px]">
//                 <p className='text-gray-800 font-semibold'> Quantity </p>
//                 <Input type='number' className='w-14' defaultValue={1}/>
//             </div>
//             <Button onClick={()=>addToCart(product._id)} className='bg-pink-600 w-max'>Add To Cart </Button>
//         </div>
//     )
// }
// export default ProductDesc;