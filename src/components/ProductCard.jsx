import { ShoppingCart } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import axios from 'axios';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCart } from '@/Redux/productSlice';
import { API_BASE_URL } from "@/config/api";

const ProductCard = ({ product, loading }) => {
    const { productImg, productPrice, productName, _id, quantity } = product || {};
    const accessToken = localStorage.getItem('accessToken');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const addToCart = async (productId) => {
        if (!accessToken) {
            toast.error("Please login first");
            navigate("/login");
            return;
        }

        if (quantity === 0) {
            toast.error("Out of Stock");
            return;
        }

        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/v1/cart/add`,
                { productId, quantity: 1 },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );

            if (res.data.success) {
                toast.success("Product Added To Cart");
                dispatch(setCart(res.data.cart));
            }
        } catch (error) {
            console.error("Add to Cart Error:", error.response || error);
            toast.error(error?.response?.data?.message || "Failed to add product to cart");
        }
    };

    return (
        <div className='shadow-lg rounded-lg overflow-hidden h-max bg-white transition-all duration-300 hover:shadow-xl group'>
            <div className="relative w-full aspect-square overflow-hidden">
                {loading ? (
                    <Skeleton className='w-full h-full rounded-none' />
                ) : (
                    <>
                        <img
                            onClick={() => navigate(`/products/${product._id}`)}
                            src={productImg?.[0]?.url || "/placeholder.png"}
                            alt={productName || "Product"}
                            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer'
                        />

                        {quantity === 0 ? (
                            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                                Out of Stock
                            </span>
                        ) : quantity <= 3 ? (
                            <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-semibold px-3 py-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition-all duration-300">
                                Only {quantity} left
                            </span>
                        ) : null}
                    </>
                )}
            </div>

            <div className='p-3 space-y-2'>
                <h1 className='font-semibold text-base leading-6 min-h-[48px] line-clamp-2'>
                    {productName || "Product Name"}
                </h1>

                <h2 className='font-bold text-lg'>₹{productPrice || 0}</h2>

                <Button
                    onClick={() => _id && addToCart(_id)}
                    disabled={loading || quantity === 0}
                    className='bg-pink-600 w-full hover:bg-pink-800 disabled:bg-gray-400 disabled:cursor-not-allowed'
                >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {quantity === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
            </div>
        </div>
    );
};

export default ProductCard;









// import { ShoppingCart } from 'lucide-react';
// import React from 'react';
// import { Button } from './ui/button';
// import { Skeleton } from './ui/skeleton';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { setCart } from '@/Redux/productSlice';

// const ProductCard = ({ product, loading }) => {
//     const { productImg, productPrice, productName, _id, quantity } = product || {};
//     const accessToken = localStorage.getItem('accessToken');
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const addToCart = async (productId) => {
//         if (!accessToken) {
//             toast.error("Please login first");
//             navigate("/login");
//             return;
//         }

//         if (quantity === 0) {
//             toast.error("Out of Stock");
//             return;
//         }

//         try {
//             const res = await axios.post(
//                 `http://localhost:8000/api/v1/cart/add`,
//                 { productId, quantity: 1 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${accessToken}`
//                     }
//                 }
//             );

//             if (res.data.success) {
//                 toast.success("Product Added To Cart");
//                 dispatch(setCart(res.data.cart));
//             }
//         } catch (error) {
//             console.error("Add to Cart Error:", error.response || error);
//             toast.error(error?.response?.data?.message || "Failed to add product to cart");
//         }
//     };

//     return (
//         <div className='shadow-lg rounded-lg overflow-hidden h-max hover:shadow-amber-600'>
//             <div className="w-full h-full aspect-square overflow-hidden">
//                 {loading ? (
//                     <Skeleton className='w-full h-full rounded-lg' />
//                 ) : (
//                     <img
//                         onClick={() => navigate(`/products/${product._id}`)}
//                         src={productImg?.[0]?.url || "/placeholder.png"}
//                         alt={productName || "Product"}
//                         className='w-full h-full transition-transform duration-300 hover:scale-120'
//                     />
//                 )}
//             </div>

//             <div className='px-2 space-y-1'>
//                 <h1 className='font-semibold h-12 line-clamp-2'>{productName || "Product Name"}</h1>
//                 <h2 className='font-bold'>₹{productPrice || 0}</h2>

//                 <p className={`text-sm font-medium ${
//                     quantity === 0
//                         ? "text-red-500"
//                         : quantity < 5
//                         ? "text-yellow-500"
//                         : "text-green-600"
//                 }`}>
//                     {
//                         quantity === 0
//                             ? "Out of Stock"
//                             : quantity < 5
//                             ? `Only ${quantity} left`
//                             : `Available: ${quantity}`
//                     }
//                 </p>

//                 <Button
//                     onClick={() => _id && addToCart(_id)}
//                     disabled={loading || quantity === 0}
//                     className='bg-pink-600 mb-6 w-full hover:bg-pink-800 disabled:bg-gray-400 disabled:cursor-not-allowed'
//                 >
//                     <ShoppingCart /> {quantity === 0 ? "Out of Stock" : "Add to Cart"}
//                 </Button>
//             </div>
//         </div>
//     );
// };

// export default ProductCard;



// quantity mate kariyu chhe


// import { ShoppingCart } from 'lucide-react';
// import React from 'react';
// import { Button } from './ui/button';
// import { Skeleton } from './ui/skeleton';
// import axios from 'axios';
// import { toast } from 'sonner';
// import { useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { setCart } from '@/Redux/productSlice';

// const ProductCard = ({ product, loading }) => {
//     const { productImg, productPrice, productName, _id } = product || {};
//     const accessToken = localStorage.getItem('accessToken');
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const addToCart = async (productId) => {
//         if (!accessToken) {
//             toast.error("Please login first");
//             navigate("/login");
//             return;
//         }

//         try {
//             const res = await axios.post(
//                 `http://localhost:8000/api/v1/cart/add`,
//                 { productId },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${accessToken}`
//                     }
//                 }
//             );

//             if (res.data.success) {
//                 toast.success("Product Added To Cart");
//                 dispatch(setCart(res.data.cart));
//             }
//         } catch (error) {
//             console.error("Add to Cart Error:", error.response || error);
//             toast.error("Failed to add product to cart");
//         }
//     };

//     return (
//         <div className='shadow-lg rounded-lg overflow-hidden h-max hover:shadow-amber-600'>
//             <div className="w-full h-full aspect-square overflow-hidden">
//                 {loading ? (
//                     <Skeleton className='w-full h-full rounded-lg' />
//                 ) : (
//                     <img
//                     onClick={()=>navigate(`/products/${product._id}`)}
//                         src={productImg?.[0]?.url || "/placeholder.png"}
//                         alt={productName || "Product"}
//                         className='w-full h-full transition-transform duration-300 hover:scale-120'
//                     />
//                 )}
//             </div>

//             <div className='px-2 space-y-1'>
//                 <h1 className='font-semibold h-12 line-clamp-2'>{productName || "Product Name"}</h1>
//                 <h2 className='font-bold'>₹{productPrice || 0}</h2>
//                 <Button
//                     onClick={() => _id && addToCart(_id)}
//                     disabled={loading}
//                     className='bg-pink-600 mb-6 w-full hover:bg-pink-800'
//                 >
//                     <ShoppingCart /> Add to Cart
//                 </Button>
//             </div>
//         </div>
//     );
// };

// export default ProductCard;



// import { ShoppingCart } from 'lucide-react'
// import React from 'react'
// import { Button } from './ui/button'
// import { Skeleton } from './ui/skeleton'
// import axios from 'axios'
// import { toast } from 'sonner'
// import { useDispatch } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import { setCart } from '@/Redux/productSlice'

// const ProductCard = ({ product, loading }) => {

//     // const { productImg, productPrice, productName } = product
//     const { productImg, productPrice, productName } = product || {}
//     const accessToken = localStorage.getItem('accessToken')
//     const dispatch = useDispatch()
//     const navigate = useNavigate()

//     const addToCart = async (productId) => {
//         try {
//             const res = await axios.post(`http://localhost:8000/api/v1/cart/add`, { productId }, {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`
//                 }
//             })
//             if (res.data.success) {
//                 toast.success('Product Added To Cart')
//                 dispatch(setCart(res.data.cart))
//             }
//         } catch (error) {
//             console.error(error)
//         }
//     }
//     return (
//         <div className='shadow-lg rounded-lg overflow-hidden h-max hover:shadow-amber-600'>
//             <div className="w-full h-full aspect-square overflow-hidden">
//                 {
//                     loading ? <Skeleton className='w-full h-full rounded-lg' /> : <img src={productImg[0]?.url} alt='' className='w-full h-full transition-transform duration-300 hover:scale-120' />
//                 }

//             </div>
//             <div className='px-2 space-y-1'>
//                 <h1 className='font-semibold h-12 line-clamp-2'>{productName}</h1>
//                 <h2 className='font-bold'>₹{productPrice}</h2>
//                 {/* <Button onClick={()=> (addToCart(product._id))}  className='bg-pink-600 mb-6 w-full hover:bg-pink-800'><ShoppingCart />Add to Cart </Button> */}
//                 <Button
//                     onClick={() => product._id && addToCart(product._id)}
//                     disabled={loading}
//                     className='bg-pink-600 mb-6 w-full hover:bg-pink-800'
//                 >
//                     <ShoppingCart /> Add to Cart
//                 </Button>
//             </div>
//         </div>
//     )
// }
// export default ProductCard
