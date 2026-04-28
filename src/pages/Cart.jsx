import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import userLogo from "../assets/images/userLogo.png"
import { Button } from '@/components/ui/button'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setCart } from '@/Redux/productSlice'
import { toast } from 'sonner'

const Cart = () => {
  const { cart } = useSelector(store => store.product)

  const subtotal = cart?.totalPrice || 0
  const shipping = subtotal >= 299 ? 0 : 10
  const tax = Number((subtotal * 0.05).toFixed(2))
  const total = Number((subtotal + shipping + tax).toFixed(2))

  const navigate = useNavigate()
  const API = "http://localhost:8000/api/v1/cart"
  const accessToken = localStorage.getItem("accessToken")
  const dispatch = useDispatch()

  const formatPrice = (amount) => `₹${Number(amount || 0).toFixed(2)}`

  const loadCart = async () => {
    try {
      const res = await axios.get(API, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      }
    } catch (error) {
      console.log(error)
    }
  }

  // const handleUpdateQuantity = async (productId, type, currentQty) => {
  //   if (type === "increase") {
  //     const product = cart?.items?.find(
  //       (item) => item.productId._id === productId
  //     )

  //     if (!product) return

  //     if (currentQty >= product.productId.quantity) {
  //       toast.error(`Only ${product.productId.quantity} items available`)
  //       return
  //     }

  //     if (currentQty >= 5) {
  //       toast.error("Maximum 5 quantity allowed")
  //       return
  //     }
  //   }

  //   if (type === "decrease" && currentQty <= 1) {
  //     return
  //   }

  //   try {
  //     const res = await axios.put(
  //       `${API}/update`,
  //       { productId, type },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`
  //         }
  //       }
  //     )

  //     if (res.data.success) {
  //       dispatch(setCart(res.data.cart))
  //     } else {
  //       toast.error(res.data.message)
  //     }
  //   } catch (error) {
  //     toast.error("Something went wrong")
  //   }
  // }
  const handleUpdateQuantity = async (productId, type, currentQty) => {
    const product = cart?.items?.find(
      (item) => item.productId._id === productId
    )

    if (!product) return

    // decrease ma 1 karta niche na java de
    if (type === "decrease" && currentQty <= 1) {
      return
    }

    // increase ma max 5 ane stock banne check
    if (type === "increase") {
      const availableStock = product?.productId?.quantity || 0

      if (currentQty >= 5) {
        toast.error("5 karta vadhare product tame lai sakta nathi")
        return
      }

      if (currentQty >= availableStock) {
        toast.error(`Fakt ${availableStock} quantity available chhe`)
        return
      }
    }

    try {
      const res = await axios.put(
        `${API}/update`,
        { productId, type },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      if (res.data.success) {
        dispatch(setCart(res.data.cart))
      } else {
        toast.error(res.data.message || "Quantity update thai nathi")
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        (type === "increase" && currentQty >= 5
          ? "5 karta vadhare product tame lai sakta nathi"
          : "Quantity update karva ma problem aavi")
      )
    }
  }

  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${API}/remove`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        data: { productId }
      })

      if (res.data.success) {
        dispatch(setCart(res.data.cart))
        toast.success('Product Removed From Cart')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-r from-yellow-50 via-pink-100 to-red-100">
      {cart?.items?.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Shopping Cart</h1>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">
            {/* LEFT SIDE */}
            <div className="flex flex-col gap-4 min-w-0">
              {cart?.items?.map((product, index) => {
                const itemTotal =
                  (product?.productId?.productPrice || 0) * (product?.quantity || 0)

                return (
                  <Card key={index} className="rounded-2xl shadow-sm border bg-white">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* IMAGE + INFO */}
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <img
                            src={product?.productId?.productImg?.[0]?.url || userLogo}
                            alt={product?.productId?.productName || "product"}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shrink-0"
                          />

                          <div className="min-w-0 flex-1">
                            <h2 className="font-semibold text-base sm:text-lg leading-snug break-words">
                              {product?.productId?.productName}
                            </h2>

                            <p className="text-sm sm:text-base text-gray-600 mt-1">
                              {formatPrice(product?.productId?.productPrice)}
                            </p>

                            {product?.productId?.quantity === 0 ? (
                              <p className="text-sm text-red-500 mt-2">Out of Stock</p>
                            ) : product?.productId?.quantity < 5 ? (
                              <p className="text-sm text-yellow-600 mt-2">
                                Only {product?.productId?.quantity} left
                              </p>
                            ) : null}
                          </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 lg:justify-end">
                          {/* QUANTITY */}
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              className="h-10 w-10 p-0 text-lg"
                              onClick={() =>
                                handleUpdateQuantity(
                                  product.productId._id,
                                  'decrease',
                                  product.quantity
                                )
                              }
                              disabled={product.quantity <= 1}
                            >
                              -
                            </Button>

                            <span className="w-8 text-center font-medium">
                              {product?.quantity}
                            </span>

                            <Button
                              type="button"
                              variant="outline"
                              className="h-10 w-10 p-0 text-lg"
                              onClick={() =>
                                handleUpdateQuantity(
                                  product.productId._id,
                                  'increase',
                                  product.quantity
                                )
                              }
                              disabled={
                                product.quantity >= 5 ||
                                product.quantity >= product.productId.quantity
                              }
                            >
                              +
                            </Button>
                          </div>

                          {/* PRICE + REMOVE */}
                          <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-5">
                            <p className="font-semibold text-base sm:text-lg whitespace-nowrap">
                              {formatPrice(itemTotal)}
                            </p>

                            <button
                              type="button"
                              onClick={() => handleRemove(product?.productId?._id)}
                              className="flex items-center gap-1 text-red-500 hover:text-red-600 transition whitespace-nowrap"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* RIGHT SIDE */}
            <div className="w-full xl:w-[360px] xl:sticky xl:top-24">
              <Card className="rounded-2xl shadow-md border bg-white w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold">Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="space-y-3 text-sm sm:text-base">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-600">
                        Subtotal ({cart?.items?.length} items)
                      </span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? "Free" : formatPrice(shipping)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-gray-600">Tax (5%)</span>
                      <span className="font-medium">{formatPrice(tax)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-lg sm:text-xl font-bold">Total</span>
                    <span className="text-xl sm:text-2xl font-bold">
                      {formatPrice(total)}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input
                      placeholder="Promo Code"
                      className="h-11"
                    />
                    <Button
                      variant="outline"
                      className="h-11 sm:w-auto"
                    >
                      Apply
                    </Button>
                  </div>

                  <Button
                    className="w-full h-11 bg-pink-600 hover:bg-pink-700 text-white"
                    onClick={() => navigate('/address')}
                  >
                    PLACE ORDER
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-11 bg-transparent"
                  >
                    <Link to="/products">Continue Shopping</Link>
                  </Button>

                  <div className="text-sm text-gray-500 pt-2 space-y-1 leading-6">
                    <p>* Free shipping on orders over ₹299</p>
                    <p>* 7-days return policy</p>
                    <p>* Secure Checkout with SSL encryption</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
          <div className="bg-pink-100 p-6 rounded-full">
            <ShoppingCart className="w-16 h-16 text-pink-600" />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-gray-800">Your Cart is Empty</h2>
          <p className="mt-2 text-gray-600">
            Looks like you haven't added anything to your cart yet
          </p>

          <Button
            onClick={() => navigate('/products')}
            className="mt-6 bg-pink-600 text-white rounded-xl hover:bg-pink-700 cursor-pointer"
          >
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  )
}

export default Cart










// responsive banayu chhe


// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import userLogo from "../assets/images/userLogo.png"
// import { Button } from '@/components/ui/button'
// import { ShoppingCart, Trash2 } from 'lucide-react'
// import { Separator } from '@/components/ui/separator'
// import { Input } from '@/components/ui/input'
// import { Link, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { setCart } from '@/Redux/productSlice'
// import { toast } from 'sonner'

// const Cart = () => {

//   const { cart } = useSelector(store => store.product)

//   const subtotal = cart?.totalPrice || 0
//   const shipping = subtotal > 299 ? 0 : 10;
//   const tax = subtotal * 0.05
//   const total = subtotal + shipping + tax

//   const navigate = useNavigate()
//   const API = "http://localhost:8000/api/v1/cart"
//   const accessToken = localStorage.getItem("accessToken")
//   const dispatch = useDispatch()

//   const loadCart = async () => {
//     try {
//       const res = await axios.get(API, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       })
//       if (res.data.success) {
//         dispatch(setCart(res.data.cart))
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const handleUpdateQuantity = async (productId, type, currentQty) => {

//     if (type === "increase") {

//       const product = cart?.items?.find(
//         (item) => item.productId._id === productId
//       );

//       if (!product) return;

//       // ❌ stock limit check
//       if (currentQty >= product.productId.quantity) {
//         toast.error(`Only ${product.productId.quantity} items available`)
//         return
//       }

//       // ❌ max 5 limit
//       if (currentQty >= 5) {
//         toast.error("Maximum 5 quantity allowed")
//         return
//       }
//     }

//     // if (type === "increase" && currentQty >= 5) {
//     //   toast.error("Maximum 5 quantity allowed")
//     //   return
//     // }

//     if (type === "decrease" && currentQty <= 1) {
//       return
//     }

//     try {
//       const res = await axios.put(`${API}/update`, { productId, type }, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       })

//       if (res.data.success) {
//         dispatch(setCart(res.data.cart))
//       } else {
//         toast.error(res.data.message)
//       }

//     } catch (error) {
//       toast.error("Something went wrong")
//     }
//   }

//   const handleRemove = async (productId) => {
//     try {
//       const res = await axios.delete(`${API}/remove`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         },
//         data: { productId }
//       })
//       if (res.data.success) {
//         dispatch(setCart(res.data.cart))
//         toast.success('Product Removed From Cart ')
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     loadCart()
//   }, [])

//   return (
//     <div className="min-h-screen overflow-x-hidden bg-gradient-to-r from-yellow-50 via-pink-100 to-red-100">

//       {cart?.items?.length > 0 ? (
//         <div className='max-w-7xl mx-auto px-4 py-4'>

//           <h1 className='text-xl sm:text-2xl font-bold mb-7'>Shopping Cart</h1>

//           {/* MAIN LAYOUT */}
//           <div className='flex flex-col md:flex-row gap-7'>

//             {/* LEFT SIDE */}
//             <div className="flex flex-col gap-5 flex-1 w-full">
//               {
//                 cart?.items?.map((product, index) => (
//                   <Card key={index}>
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4 w-full min-w-0">

//                       {/* IMAGE + INFO */}
//                       <div className="flex items-center w-full min-w-0">
//                         <img
//                           src={product?.productId?.productImg?.[0]?.url || userLogo}
//                           alt=''
//                           className='w-20 h-20 sm:w-24 sm:h-24 mr-4 object-cover rounded-md shrink-0'
//                         />

//                         <div className="w-full min-w-0">
//                           <h1 className='font-semibold truncate mb-2'>
//                             {product?.productId?.productName}
//                           </h1>
//                           <p>₹{product?.productId?.productPrice}</p>
//                         </div>
//                       </div>

//                       {/* QUANTITY */}
//                       <div className='flex gap-3 items-center shrink-0'>
//                         <Button
//                           onClick={() => handleUpdateQuantity(product.productId._id, 'decrease', product.quantity)}
//                           variant='outline'
//                           disabled={product.quantity <= 1}
//                         >
//                           -
//                         </Button>

//                         <span>{product?.quantity}</span>

//                         <Button
//                           onClick={() => handleUpdateQuantity(product.productId._id, 'increase', product.quantity)}
//                           variant='outline'
//                           // disabled={product.quantity >= 5}
//                           disabled={
//                             product.quantity >= 5 ||
//                             product.quantity >= product.productId.quantity
//                           }
//                         >
//                           +
//                         </Button>
//                       </div>

//                       {/* PRICE */}
//                       <p className="font-medium shrink-0">
//                         ₹{product?.productId?.productPrice * product?.quantity}
//                       </p>

//                       <p className={`text-sm ${product?.productId?.quantity === 0
//                           ? "text-red-500"
//                           : product?.productId?.quantity < 5
//                             ? "text-yellow-500"
//                             : "text-green-600"
//                         }`}>
//                         {
//                           product?.productId?.quantity === 0
//                             ? "Out of Stock"
//                             : product?.productId?.quantity < 5
//                               ? `Only ${product?.productId?.quantity} left`
//                               : ""
//                         }
//                       </p>

//                       {/* REMOVE */}
//                       <p
//                         onClick={() => handleRemove(product?.productId?._id)}
//                         className='flex text-red-500 items-center gap-1 cursor-pointer whitespace-nowrap shrink-0'
//                       >
//                         <Trash2 className='w-4 h-4' />
//                         Remove
//                       </p>

//                     </div>
//                   </Card>
//                 ))
//               }
//             </div>

//             {/* RIGHT SIDE */}
//             <div className="w-full md:w-[350px] shrink-0">
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Order Summary</CardTitle>
//                 </CardHeader>

//                 <CardContent className='space-y-4'>
//                   <div className="flex justify-between">
//                     <span>Subtotal ({cart?.items?.length} items)</span>
//                     <span>₹{subtotal.toLocaleString('en-IN')}</span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span>Shipping</span>
//                     <span>₹{shipping}</span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span>Tax(5%)</span>
//                     <span>₹{tax}</span>
//                   </div>

//                   <Separator />

//                   <div className="flex justify-between font-bold text-lg">
//                     <span>Total</span>
//                     <span>₹{total}</span>
//                   </div>

//                   <div className="space-y-3 pt-4">
//                     <div className='flex space-x-2'>
//                       <Input placeholder='Promo Code' />
//                       <Button variant='outline'>Apply</Button>
//                     </div>

//                     <Button
//                       className='w-full bg-pink-600'
//                       onClick={() => navigate('/address')}
//                     >
//                       PLACE ORDER
//                     </Button>

//                     <Button variant='outline' className='w-full bg-transparent'>
//                       <Link to="/products">Continue Shopping</Link>
//                     </Button>
//                   </div>

//                   <div className="text-sm text-muted-foreground pt-4">
//                     <p>* Free shipping on orders over 299</p>
//                     <p>* 7-days return policy</p>
//                     <p>* Secure Checkout with SSL encryption</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//           </div>
//         </div>
//       ) : (
//         <div className='flex flex-col items-center justify-center min-h-[60vh] p-6 text-center'>
//           <div className="bg-pink-100 p-6 rounded-full">
//             <ShoppingCart className='w-16 h-16 text-pink-600' />
//           </div>

//           <h2 className='mt-6 text-2xl font-bold text-gray-800'>Your Cart is Empty</h2>
//           <p className='mt-2 text-gray-600'>Looks like you haven't added anything to your cart yet</p>

//           <Button
//             onClick={() => navigate('/products')}
//             className='mt-6 bg-pink-600 text-white rounded-xl hover:bg-pink-700 cursor-pointer'
//           >
//             Start Shopping
//           </Button>
//         </div>
//       )}

//     </div>
//   )
// }

// export default Cart




// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import userLogo from "../assets/images/userLogo.png"
// import { Button } from '@/components/ui/button'
// import { ShoppingCart, Trash2 } from 'lucide-react'
// import { Separator } from '@/components/ui/separator'
// import { Input } from '@/components/ui/input'
// import { Link, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { setCart } from '@/Redux/productSlice'
// import { toast } from 'sonner'

// const Cart = () => {

//   const { cart } = useSelector(store => store.product)

//   const subtotal = cart?.totalPrice
//   const shipping = subtotal > 299 ? 0 : 10;
//   const tax = subtotal * 0.05 // 5% tax
//   const total = subtotal + shipping + tax
//   const navigate = useNavigate()
//   const API = "http://localhost:8000/api/v1/cart"
//   const accessToken = localStorage.getItem("accessToken")
//   const dishpatch = useDispatch()

//   const loadCart = async () => {
//     try {
//       const res = await axios.get(API, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       })
//       if (res.data.success) {
//         dishpatch(setCart(res.data.cart))
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const handleUpdateQuantity = async (productId, type, currentQty) => {

//     // 🔥 MAX 5 LIMIT
//     if (type === "increase" && currentQty >= 5) {
//       toast.error("Maximum 5 quantity allowed")
//       return
//     }

//     // 🔥 MIN 1
//     if (type === "decrease" && currentQty <= 1) {
//       return
//     }

//     try {
//       const res = await axios.put(`${API}/update`, { productId, type }, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       })

//       if (res.data.success) {
//         dishpatch(setCart(res.data.cart))
//       } else {
//         toast.error(res.data.message)
//       }

//     } catch (error) {
//       toast.error("Something went wrong")
//     }
//   }
//   const handleRemove = async (productId) => {
//     try {
//       const res = await axios.delete(`${API}/remove`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         },
//         data: { productId }
//       })
//       if (res.data.success) {
//         dishpatch(setCart(res.data.cart))
//         toast.success('Product Removed From Cart ')
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     loadCart()
//   }, [dishpatch])
//   return (
//     <div className="min-h-screen bg-gradient-to-r from-yellow-50 via-pink-100 to-red-100">
//       {cart?.items?.length > 0 ? (
//         <div className='max-w-7xl mx-auto px-4 p-4'>

//           <h1 className='text-2xl font-bold mb-7'>Shopping Cart</h1>
//           <div className='flex gap-7'>

//             {/* LEFT SIDE - CART ITEMS */}
//             <div className="flex flex-col gap-5 flex-1">
//               {
//                 cart?.items?.map((product, index) => {
//                   return (
//                     <Card key={index}>
//                       <div className="flex justify-between items-center pr-7">

//                         <div className="flex items-center w-[350px] p-2">
//                           <img
//                             src={product?.productId?.productImg?.[0]?.url || userLogo}
//                             alt=''
//                             className='w-24 h-24 mr-5 object-cover rounded-md'
//                           // ✅ CHANGED: w-50 h-50 → w-24 h-24 (Tailwind valid size)
//                           />

//                           <div className="w-[280px]">
//                             <h1 className='font-semibold truncate mb-2'>
//                               {product?.productId?.productName}
//                             </h1>
//                             <p>₹{product?.productId?.productPrice}</p>
//                           </div>
//                         </div>

//                         <div className='flex gap-5 items-center'>
//                           <Button
//                             onClick={() => handleUpdateQuantity(product.productId._id, 'decrease', product.quantity)}
//                             variant='outline'
//                             disabled={product.quantity <= 1}
//                           >
//                             -
//                           </Button>

//                           <span>{product?.quantity}</span>

//                           <Button
//                             onClick={() => handleUpdateQuantity(product.productId._id, 'increase', product.quantity)}
//                             variant='outline'
//                             disabled={product.quantity >= 5}
//                           >
//                             +
//                           </Button>
//                         </div>

//                         <p>
//                           ₹{(product?.productId?.productPrice) * (product?.quantity)}
//                         </p>

//                         <p onClick={() => handleRemove(product?.productId?._id)} className='flex text-red-500 items-center gap-1 cursor-pointer'>
//                           <Trash2 className='w-4 h-4' />
//                           Remove
//                         </p>

//                       </div>
//                     </Card>
//                   )
//                 })
//               }
//             </div>

//             {/* RIGHT SIDE - ORDER SUMMARY */}
//             <div className="w-[400px]"> {/* ✅ CHANGED: fixed width added */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Order Summary</CardTitle>
//                 </CardHeader>

//                 <CardContent className='space-y-4'>
//                   <div className="flex justify-between">
//                     <span>
//                       Subtotal ({cart?.items?.length} items)
//                     </span>
//                     <span>
//                       ₹{cart?.totalPrice?.toLocaleString('en-IN')}
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span>Shipping</span>
//                     <span>₹{shipping}</span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span>Tax(5%)</span>
//                     <span>₹{tax}</span>
//                   </div>
//                   <Separator />
//                   <div className="flex justify-between font-bold text-lg">
//                     <span>Total</span>
//                     <span>₹{total}</span>
//                   </div>
//                   <div className="space-y-3 pt-4">
//                     <div className='flex space-x-2'>
//                       <Input placeholder='Promo Code' />
//                       <Button variant='outline'>Apply</Button>
//                     </div>
//                     <Button
//                       className='w-full bg-pink-600'
//                       onClick={() => (navigate('/address'))}
//                     >PLACE ORDER</Button>
//                     <Button variant='outline' className='w-full bg-transparent'>
//                       <Link to="/products">Continue Shopping</Link>
//                     </Button>
//                   </div>
//                   <div className="text-sm text-muted-foreground pt-4">
//                     <p>* Free shipping on orders over 299</p>
//                     <p>* 7-days return policy</p>
//                     <p>* Secure Checkout with SSl encryption</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//           </div>
//         </div>
//       ) : (
//         <div className='flex flex-col items-center justify-center min-h-[60vh] p-6 text-center'>
//           {/* Icon */}
//           <div className="bg-pink-100 p-6 rounded-full">
//             <ShoppingCart className='w-16 h-16 text-pink-600' />
//           </div>
//           {/* Title */}
//           <h2 className='mt-6 text-2xl font-bold text-gray-800'>Your Cart is Empty</h2>
//           <p className='mt-2 text-gray-600'>Looks like you haven't added anything to your cart yet</p>
//           <Button onClick={() => navigate('/products')} className='mt-6 bg-pink-600 text-white rounded-xl hover:bg-pink-700 cursor-pointer'>Start Shoping</Button>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Cart
















// collage ma change karva  u kidhu hatu aa change karu chhu




// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import React, { useEffect } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import userLogo from "../assets/images/userLogo.png"
// import { Button } from '@/components/ui/button'
// import { ShoppingCart, Trash2 } from 'lucide-react'
// import { Separator } from '@/components/ui/separator'
// import { Input } from '@/components/ui/input'
// import { Link, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { setCart } from '@/Redux/productSlice'
// import { toast } from 'sonner'

// const Cart = () => {

//   const { cart } = useSelector(store => store.product)

//   const subtotal = cart?.totalPrice
//   const shipping = subtotal > 299 ? 0 : 10;
//   const tax = subtotal * 0.05 // 5% tax
//   const total = subtotal + shipping + tax
//   const navigate = useNavigate()
//   const API = "http://localhost:8000/api/v1/cart"
//   const accessToken = localStorage.getItem("accessToken")
//   const dishpatch = useDispatch()

//   const loadCart = async () => {
//     try {
//       const res = await axios.get(API, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       })
//       if (res.data.success) {
//         dishpatch(setCart(res.data.cart))
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const handleUpdateQuantity = async (productId, type) => {
//     try {
//       const res = await axios.put(`${API}/update`, { productId, type }, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         }
//       })
//       if (res.data.success) {
//         dishpatch(setCart(res.data.cart))
//       }

//     } catch (error) {
//       console.log(error);
//     }
//   }

//   const handleRemove = async (productId) => {
//     try {
//       const res = await axios.delete(`${API}/remove`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`
//         },
//         data: { productId }
//       })
//       if (res.data.success) {
//         dishpatch(setCart(res.data.cart))
//         toast.success('Product Removed From Cart ')
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(() => {
//     loadCart()
//   }, [dishpatch])
//   return (
//     <div className="min-h-screen bg-gradient-to-r from-yellow-50 via-pink-100 to-red-100">
//       {cart?.items?.length > 0 ? (
//         <div className='max-w-7xl mx-auto px-4 p-4'>

//           <h1 className='text-2xl font-bold mb-7'>Shopping Cart</h1>
//           <div className='flex gap-7'>

//             {/* LEFT SIDE - CART ITEMS */}
//             <div className="flex flex-col gap-5 flex-1">
//               {
//                 cart?.items?.map((product, index) => {
//                   return (
//                     <Card key={index}>
//                       <div className="flex justify-between items-center pr-7">

//                         <div className="flex items-center w-[350px] p-2">
//                           <img
//                             src={product?.productId?.productImg?.[0]?.url || userLogo}
//                             alt=''
//                             className='w-24 h-24 mr-5 object-cover rounded-md'
//                           // ✅ CHANGED: w-50 h-50 → w-24 h-24 (Tailwind valid size)
//                           />

//                           <div className="w-[280px]">
//                             <h1 className='font-semibold truncate mb-2'>
//                               {product?.productId?.productName}
//                             </h1>
//                             <p>₹{product?.productId?.productPrice}</p>
//                           </div>
//                         </div>

//                         <div className='flex gap-5 items-center'>
//                           <Button onClick={() => handleUpdateQuantity(product.productId._id, 'decrease')} variant='outline'>-</Button>
//                           <span>{product?.quantity}</span> {/* ✅ CHANGED: dynamic quantity */}
//                           <Button onClick={() => handleUpdateQuantity(product.productId._id, 'increase')} variant='outline'>+</Button>
//                         </div>

//                         <p>
//                           ₹{(product?.productId?.productPrice) * (product?.quantity)}
//                         </p>

//                         <p onClick={() => handleRemove(product?.productId?._id)} className='flex text-red-500 items-center gap-1 cursor-pointer'>
//                           <Trash2 className='w-4 h-4' />
//                           Remove
//                         </p>

//                       </div>
//                     </Card>
//                   )
//                 })
//               }
//             </div>

//             {/* RIGHT SIDE - ORDER SUMMARY */}
//             <div className="w-[400px]"> {/* ✅ CHANGED: fixed width added */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Order Summary</CardTitle>
//                 </CardHeader>

//                 <CardContent className='space-y-4'>
//                   <div className="flex justify-between">
//                     <span>
//                       Subtotal ({cart?.items?.length} items)
//                     </span>
//                     <span>
//                       ₹{cart?.totalPrice?.toLocaleString('en-IN')}
//                     </span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span>Shipping</span>
//                     <span>₹{shipping}</span>
//                   </div>

//                   <div className="flex justify-between">
//                     <span>Tax(5%)</span>
//                     <span>₹{tax}</span>
//                   </div>
//                   <Separator />
//                   <div className="flex justify-between font-bold text-lg">
//                     <span>Total</span>
//                     <span>₹{total}</span>
//                   </div>
//                   <div className="space-y-3 pt-4">
//                     <div className='flex space-x-2'>
//                       <Input placeholder='Promo Code' />
//                       <Button variant='outline'>Apply</Button>
//                     </div>
//                     <Button
//                     className='w-full bg-pink-600'
//                     onClick={()=>(navigate('/address'))}
//                     >PLACE ORDER</Button>
//                     <Button variant='outline' className='w-full bg-transparent'>
//                       <Link to="/products">Continue Shopping</Link>
//                     </Button>
//                   </div>
//                   <div className="text-sm text-muted-foreground pt-4">
//                     <p>* Free shipping on orders over 299</p>
//                     <p>* 7-days return policy</p>
//                     <p>* Secure Checkout with SSl encryption</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//           </div>
//         </div>
//       ) : (
//         <div className='flex flex-col items-center justify-center min-h-[60vh] p-6 text-center'>
//           {/* Icon */}
//           <div className="bg-pink-100 p-6 rounded-full">
//             <ShoppingCart className='w-16 h-16 text-pink-600' />
//           </div>
//           {/* Title */}
//           <h2 className='mt-6 text-2xl font-bold text-gray-800'>Your Cart is Empty</h2>
//           <p className='mt-2 text-gray-600'>Looks like you haven't added anything to your cart yet</p>
//           <Button onClick={() => navigate('/products')} className='mt-6 bg-pink-600 text-white rounded-xl hover:bg-pink-700 cursor-pointer'>Start Shoping</Button>
//         </div>
//       )}
//     </div>
//   )
// }

//export default Cart


// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import React from 'react'
// import { useSelector } from 'react-redux'
// import userLogo from "../assets/images/userLogo.png"
// import { Button } from '@/components/ui/button'
// import { Trash2 } from 'lucide-react'

// const Cart = () => {
//   // Correctly get the cart object from the product slice
//   const { cart } = useSelector(store => store.product)

//   console.log(cart) // To verify items

//   return (
//     <div className='pt-6 bg-gray-50 min-h-screen'>
//       {cart?.items?.length > 0 ? (
//         <div className='max-w-7xl mx-auto'>
//           <h1 className='text-2xl font-bold mb-7'>Shopping Cart</h1>
//           <div className='max-w-7xl mx-auto flex gap-7'>
//             <div className="flex flex-col gap-5 flex-1">
//               {
//                 cart?.items?.map((product, index) => {
//                   return <Card key={index}>
//                     <div className="flex justify-between items-center pr-7">
//                       <div className="flex items-center w-[350px] p-1 ">  {/* p-2 thi div ni andar thodi jagya */}
//                         <img
//                           src={product?.productId?.productImg?.[0]?.url || userLogo}
//                           alt=''
//                           className='w-50 h-50 mr-5 object-cover rounded-md '
//                         />
//                         <div className="w-[280px]">
//                           <h1 className='font-semibold truncate mb-2'>{product?.productId?.productName}</h1>
//                           <p>₹{product?.productId?.productPrice}</p>
//                         </div>
//                       </div>
//                       <div className='flex gap-5 items-center'>
//                         <Button variant='outline'>+</Button>
//                         <span>1</span>
//                         <Button variant='outline'>-</Button>
//                       </div>
//                       <p>₹{(product?.productId?.productPrice) * (product?.quantity)}</p>
//                       <p className='flex text-red-500 items-center gap-1 cursor-pointer'><Trash2 className='w-4 h-4 ' />Remove</p>
//                     </div>
//                   </Card>
//                 })
//               }
//             </div>
//             <div>
//               <Card className='w-[400px] '>
//                 <CardHeader>
//                   <CardTitle>Order Summary</CardTitle>
//                 </CardHeader>
//                 <CardContent className='space-y-4'>
//                   <div className="flex justify-between">
//                     <span>Subtotal ({cart?.items?.length} items)</span>
//                     <span>₹{cart?.totalPrice?.toLocaleString('en-IN')}</span>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className='text-center text-gray-500 mt-20'>
//           Your cart is empty
//         </div>
//       )}
//     </div>
//   )
// }

// export default Cart