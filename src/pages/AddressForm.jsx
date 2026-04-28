import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Move3D } from 'lucide-react';
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import axios from "axios";
import { addAddress, deleteAddress, setCart, setSelectedAddress } from '@/Redux/productSlice';
import { toast } from 'sonner';

export const AddressForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });

  const { cart, addresses, selectedAddress } = useSelector((store) => store.product);
  // const [showForm, setShowForm] = useState(addresses?.length === 0);
  // const [showForm, setShowForm] = useState(!addresses || addresses.length === 0);
  const [showForm, setShowForm] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'phone' || name === 'zip') && !/^\d*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {

  if (
    !formData.fullName ||
    !formData.phone ||
    !formData.address ||
    !formData.city
  ) {
    return toast.error("Please fill all required fields");
  }

  dispatch(addAddress(formData));
  setFormData({
  fullName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: ''
});
  setShowForm(false);
};

  // const subtotal = cart.totalPrice;
  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = subtotal + shipping + tax;


  const handlePayment = async() => {
    if (selectedAddress === null) {
          return toast.error("Please select address");
      }
    const accessToken = localStorage.getItem("accessToken")
    try {
      const{data} = await axios.post(`${import.meta.env.VITE_URL}/api/v1/orders/create-order`,{
        products: cart?.items?.map(item => ({
          productId: item?.productId?._id,
          quantity: item.quantity 
        })),
        tax,
        shipping,
        amount: total,
        currency: "INR"
      },{
        headers: {Authorization: `Bearer ${accessToken}`}
      })
      if (!data?.success)
         {
             return toast.error("Failed to create order. Please try again.");
         }

        console.log("Razorpay data:", data);

        const options = { 
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data?.order?.amount,  
          currency: data?.order?.currency,
          order_id: data?.order?.id,// order ID from backend
          name: "MyRoyal",
          description: "Order Payment",
          
          // aa error aavti hati aatle comment kari ne niche chatgpt thi je code aapyu che te mukyu che
          // handler: async function (response) {
          //   try {
          //     const verifyRes = await axios.post(`${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`, response, {
          //       headers: { Authorization: `Bearer ${accessToken}` } 
          //     })

          //     if (verifyRes.data.success) {
          //       toast.success("✔️ Payment successful! Order placed.");
          //       dispatch(setCart({ items: [], totalPrice: 0 })); 
          //       navigate("/order-success");
          //     }else{
          //       toast.error("❌ Payment verification failed.");
          //     }
          //   } catch (error) {
          //     toast.error("❌ Payment verification error. ");
          //   }
          // },
       handler: async function (response) {
  try {
    console.log("Payment Response:", response);

    const verifyRes = await axios.post(
      `${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`,
      {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature
      },
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    if (verifyRes.data.success) {
      toast.success("✔️ Payment successful! Order placed.");
      dispatch(setCart({ items: [], totalPrice: 0 }));
      navigate("/order-success");
    } else {
      toast.error("❌ Payment verification failed.");
    }
  } catch (error) {
    console.error(error);
    toast.error("❌ Payment verification error.");
  }
},
          modal: {
            ondismiss:  async function() {
              // Handle user closing popup
              await axios.post(`${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`, {
                razorpay_order_id: data?.order?.id,
                paymentFailed: true
              },{
                headers: { Authorization: `Bearer ${accessToken}` }
              });
              toast.error("Payment cancelled or failed.");
            }
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone
          },
          theme: {color: "#F472B6"}
        };
        const rzp = new window.Razorpay(options);

        // Lissen for payment failers

        rzp.on('payment.failed', async function (response) {
          await axios.post(`${import.meta.env.VITE_URL}/api/v1/orders/verify-payment`, { 
            razorpay_order_id: data?.order?.id, 
            paymentFailed: true
          },{
            headers: { Authorization: `Bearer ${accessToken}` }
          })
          toast.error("❌ Payment failed. Please try again.");
        })
        rzp.open();
    } catch (error) {
      console.log(error);  
      toast.error("❌ Error creating order. Please try again.");
    }
  }
  useEffect(() => {
  if (addresses && addresses.length > 0) {
    setShowForm(false);
  }
}, [addresses]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-300 via-pink-500 to-gray-200 text-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT SECTION */}
          <div className="space-y-4 p-5 bg-white text-black rounded-xl shadow-lg lg:col-span-2 max-w-3xl">
            
            {/* Back Button + Header */}
            <div className="flex items-center gap-3 mb-4">
              <Button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-black"
              >
                <ArrowLeft />
              </Button>
              <h2 className="text-xl font-semibold">Your Addresses</h2>
            </div>

            {showForm ? (
              <>
                <h3 className="text-lg font-medium mb-2">Add New Address</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-semibold">Full Name</label>
                    <Input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Phone</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="9876543210"
                      maxLength={10}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Email</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="abc@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Address</label>
                    <Input name="address" value={formData.address} onChange={handleChange} placeholder="Street / Area" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold">City</label>
                      <Input name="city" value={formData.city} onChange={handleChange} placeholder="Ahmedabad" />
                    </div>
                    <div>
                      <label className="text-sm font-semibold">State</label>
                      <Input name="state" value={formData.state} onChange={handleChange} placeholder="Gujarat" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-semibold">PinCode</label>
                      <Input name="zip" value={formData.zip} onChange={handleChange} placeholder="385001" maxLength={6} />
                    </div>
                    <div>
                      <label className="text-sm font-semibold">Country</label>
                      <Input name="country" value={formData.country} onChange={handleChange} placeholder="India" />
                    </div>
                  </div>
                  <Button
                    onClick={handleSave}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-lg mt-3"
                  >
                    Save Address
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-2">Saved Addresses</h3>
                <div className="space-y-4">
                 {Array.isArray(addresses) && addresses.map((addr, index) => (
                    <div
                      key={index}
                      onClick={() => dispatch(setSelectedAddress(index))}
                      className={`border p-4 rounded-lg relative cursor-pointer transition-all duration-200
                        ${selectedAddress === index
                          ? 'border-pink-500 bg-pink-50 shadow-md'
                          : 'border-gray-300 hover:border-pink-300 hover:shadow-sm'
                        }`}
                    >
                      <p className="font-medium">{addr.fullName}</p>
                      <p className="text-sm">📞 {addr.phone}</p>
                      <p className="text-sm">✉️ {addr.email}</p>
                      <p className="text-sm">
                        📍 {addr.address}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(deleteAddress(index));
                        }}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowForm(true)}
                      className="text-sm w-1/2 bg-gray-800 text-white hover:bg-gray-900"
                    >
                      + Add New
                    </Button>

                    <Button
                      disabled={selectedAddress === null}
                      onClick={handlePayment}
                      className="w-1/2 bg-pink-600 hover:bg-pink-700 text-white"
                    >
                      Checkout
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* RIGHT SECTION - Order Summary */}
          <Card className="w-full lg:sticky lg:top-24 h-fit shadow-xl">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                {/* <span>Subtotal ({cart.items.length}) items</span> */}
                <span>Subtotal ({cart?.items?.length || 0}) items</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total}</span>
              </div>

              <div className="text-sm text-muted-foreground pt-4">
                <p>* Free shipping on orders over 299</p>
                <p>* 7-days return policy</p>
                <p>* Secure Checkout with SSL encryption</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};







// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';
// import axios from 'axios';

// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Separator } from '@/components/ui/separator';

// import { addAddress, deleteAddress, setSelectedAddress } from '@/Redux/productSlice';
// import { setUser } from '@/Redux/userSlice';

// export const AddressForm = () => {

//   const { cart, addresses, selectedAddress } = useSelector((store) => store.product);
//   const { user } = useSelector((store) => store.user);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
//     phone: user?.phoneNo || '',
//     email: user?.email || '',
//     address: user?.address || '',
//     city: user?.city || '',
//     state: '',
//     zip: user?.zipCode || '',
//     country: ''
//   });

//   const [showForm, setShowForm] = useState(addresses?.length === 0);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if ((name === 'phone' || name === 'zip') && !/^\d*$/.test(value)) return;

//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSave = async () => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");

//       const res = await axios.put(
//         `http://localhost:8000/api/v1/user/update/${user._id}`,
//         {
//           address: formData.address,
//           city: formData.city,
//           zipCode: formData.zip
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`
//           }
//         }
//       );

//       if (res.data.success) {

//         // ✅ FIX: merge user (role safe)
//         dispatch(setUser({
//           ...user,
//           ...res.data.user
//         }));

//         dispatch(addAddress(formData));
//         setShowForm(false);
//       }

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (user?.address && addresses.length === 0) {
//       dispatch(addAddress({
//         fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
//         phone: user.phoneNo,
//         email: user.email,
//         address: user.address,
//         city: user.city,
//         state: '',
//         zip: user.zipCode,
//         country: ''
//       }));
//     }
//   }, []);

//   // ✅ PRICE CALCULATION
//   const subtotal = cart?.totalPrice || 0;

//   // ✅ ITEM COUNT FIX
//   const totalItems = cart?.items?.reduce(
//     (acc, item) => acc + (item.quantity || 1),
//     0
//   ) || 0;

//   const shipping = subtotal > 50 ? 0 : 10;
//   const tax = parseFloat((subtotal * 0.05).toFixed(2));
//   const total = subtotal + shipping + tax;



//   return (
//     <div className="min-h-screen bg-gradient-to-r from-purple-300 via-pink-500 to-gray-200 text-white py-6">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* LEFT */}
//           <div className="space-y-4 p-5 bg-white text-black rounded-xl shadow-lg lg:col-span-2 max-w-3xl">
            
//             <div className="flex items-center gap-3 mb-4">
//               <Button onClick={() => navigate(-1)} className="p-2 rounded-full bg-gray-200">
//                 <ArrowLeft />
//               </Button>
//               <h2 className="text-xl font-semibold">Your Addresses</h2>
//             </div>

//             {showForm ? (
//               <>
//                 <h3 className="text-lg font-medium mb-2">Add New Address</h3>
//                 <div className="space-y-3">

//                   <Input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
//                   <Input name="phone" value={formData.phone} onChange={handleChange} maxLength={10} placeholder="Phone" />
//                   <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
//                   <Input name="address" value={formData.address} onChange={handleChange} placeholder="Address" />

//                   <div className="grid grid-cols-2 gap-3">
//                     <Input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
//                     <Input name="state" value={formData.state} onChange={handleChange} placeholder="State" />
//                   </div>

//                   <div className="grid grid-cols-2 gap-3">
//                     <Input name="zip" value={formData.zip} onChange={handleChange} maxLength={6} placeholder="PinCode" />
//                     <Input name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
//                   </div>

//                   <Button onClick={handleSave} className="w-full bg-pink-600 text-white">
//                     Save Address
//                   </Button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <h3 className="text-lg font-medium mb-2">Saved Addresses</h3>

//                 <div className="space-y-4">
//                   {addresses.map((addr, index) => (
//                     <div
//                       key={index}
//                       onClick={() => dispatch(setSelectedAddress(index))}
//                       className={`relative border p-4 rounded-lg cursor-pointer
//                         ${selectedAddress === index ? 'border-pink-500 bg-pink-50' : 'border-gray-300'}
//                       `}
//                     >
//                       <p className="font-medium">{addr.fullName}</p>
//                       <p>📞 {addr.phone}</p>
//                       <p>✉️ {addr.email}</p>
//                       <p>📍 {addr.address}, {addr.city}, {addr.zip}</p>

//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           dispatch(deleteAddress(index));
//                         }}
//                         className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   ))}

//                   <div className="flex gap-3">
//                     <Button onClick={() => setShowForm(true)} className="w-1/2">
//                       + Add New
//                     </Button>

//                     <Button disabled={selectedAddress === null} className="w-1/2 bg-pink-600 text-white">
//                       Checkout
//                     </Button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* RIGHT */}
//           <Card className="w-full lg:sticky lg:top-24 h-fit shadow-xl">
//             <CardHeader>
//               <CardTitle>Order Summary</CardTitle>
//             </CardHeader>

//             <CardContent className="space-y-4">

//               {/* ✅ UPDATED SUBTOTAL WITH ITEM COUNT */}
//               <div className="flex justify-between">
//                 <span>Subtotal ({totalItems} items)</span>
//                 <span>₹{subtotal}</span>
//               </div>

//               <div className="flex justify-between">
//                 <span>Shipping</span>
//                 <span>₹{shipping}</span>
//               </div>

//               <div className="flex justify-between">
//                 <span>Tax</span>
//                 <span>₹{tax}</span>
//               </div>

//               <Separator />

//               <div className="flex justify-between font-bold">
//                 <span>Total</span>
//                 <span>₹{total}</span>
//               </div>

//             </CardContent>
//           </Card>

//         </div>
//       </div>
//     </div>
//   );
// };
// ``
// // 23-3







// aama dirct olu address aave che but add kariye n to admin hoy to user thai jay chhe 

// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';
// import axios from 'axios';

// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Separator } from '@/components/ui/separator';

// import { addAddress, deleteAddress, setSelectedAddress } from '@/Redux/productSlice';
// import { setUser } from '@/Redux/userSlice';

// export const AddressForm = () => {

//   const { cart, addresses, selectedAddress } = useSelector((store) => store.product);
//   const { user } = useSelector((store) => store.user);

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
//     phone: user?.phoneNo || '',
//     email: user?.email || '',
//     address: user?.address || '',
//     city: user?.city || '',
//     state: '',
//     zip: user?.zipCode || '',
//     country: ''
//   });

//   const [showForm, setShowForm] = useState(addresses?.length === 0);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if ((name === 'phone' || name === 'zip') && !/^\d*$/.test(value)) return;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSave = async () => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");

//       const res = await axios.put(
//         `http://localhost:8000/api/v1/user/update/${user._id}`,
//         {
//           address: formData.address,
//           city: formData.city,
//           zipCode: formData.zip
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`
//           }
//         }
//       );

//       if (res.data.success) {
//         dispatch(setUser(res.data.user));
//         dispatch(addAddress(formData));
//         setShowForm(false);
//       }

//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     if (user?.address && addresses.length === 0) {
//       dispatch(addAddress({
//         fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
//         phone: user.phoneNo,
//         email: user.email,
//         address: user.address,
//         city: user.city,
//         state: '',
//         zip: user.zipCode,
//         country: ''
//       }));
//     }
//   }, []);

//   const subtotal = cart.totalPrice;
//   const shipping = subtotal > 50 ? 0 : 10;
//   const tax = parseFloat((subtotal * 0.05).toFixed(2));
//   const total = subtotal + shipping + tax;

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-purple-300 via-pink-500 to-gray-200 text-white py-6">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//           {/* LEFT */}
//           <div className="space-y-4 p-5 bg-white text-black rounded-xl shadow-lg lg:col-span-2 max-w-3xl">
            
//             <div className="flex items-center gap-3 mb-4">
//               <Button onClick={() => navigate(-1)} className="p-2 rounded-full bg-gray-200">
//                 <ArrowLeft />
//               </Button>
//               <h2 className="text-xl font-semibold">Your Addresses</h2>
//             </div>

//             {showForm ? (
//               <>
//                 <h3 className="text-lg font-medium mb-2">Add New Address</h3>
//                 <div className="space-y-3">

//                   <Input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" />
//                   <Input name="phone" value={formData.phone} onChange={handleChange} maxLength={10} placeholder="Phone" />
//                   <Input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
//                   <Input name="address" value={formData.address} onChange={handleChange} placeholder="Address" />

//                   <div className="grid grid-cols-2 gap-3">
//                     <Input name="city" value={formData.city} onChange={handleChange} placeholder="City" />
//                     <Input name="state" value={formData.state} onChange={handleChange} placeholder="State" />
//                   </div>

//                   <div className="grid grid-cols-2 gap-3">
//                     <Input name="zip" value={formData.zip} onChange={handleChange} maxLength={6} placeholder="PinCode" />
//                     <Input name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
//                   </div>

//                   <Button onClick={handleSave} className="w-full bg-pink-600 text-white">
//                     Save Address
//                   </Button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <h3 className="text-lg font-medium mb-2">Saved Addresses</h3>

//                 <div className="space-y-4">
//                   {addresses.map((addr, index) => (
//                     <div
//                       key={index}
//                       onClick={() => dispatch(setSelectedAddress(index))}
//                       className={`relative border p-4 rounded-lg cursor-pointer
//                         ${selectedAddress === index ? 'border-pink-500 bg-pink-50' : 'border-gray-300'}
//                       `}
//                     >
//                       <p className="font-medium">{addr.fullName}</p>
//                       <p>📞 {addr.phone}</p>
//                       <p>✉️ {addr.email}</p>
//                       <p>📍 {addr.address}, {addr.city}, {addr.zip}</p>

//                       {/* ✅ FIXED DELETE BUTTON */}
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           dispatch(deleteAddress(index));
//                         }}
//                         className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   ))}

//                   <div className="flex gap-3">
//                     <Button onClick={() => setShowForm(true)} className="w-1/2">
//                       + Add New
//                     </Button>

//                     <Button disabled={selectedAddress === null} className="w-1/2 bg-pink-600 text-white">
//                       Checkout
//                     </Button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>

//           {/* RIGHT */}
//           <Card className="w-full lg:sticky lg:top-24 h-fit shadow-xl">
//             <CardHeader>
//               <CardTitle>Order Summary</CardTitle>
//             </CardHeader>

//             <CardContent className="space-y-4">
//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span>₹{subtotal}</span>
//               </div>

//               <div className="flex justify-between">
//                 <span>Shipping</span>
//                 <span>₹{shipping}</span>
//               </div>

//               <div className="flex justify-between">
//                 <span>Tax</span>
//                 <span>₹{tax}</span>
//               </div>

//               <Separator />

//               <div className="flex justify-between font-bold">
//                 <span>Total</span>
//                 <span>₹{total}</span>
//               </div>
//             </CardContent>
//           </Card>

//         </div>
//       </div>
//     </div>
//   );
// };







// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Separator } from '@/components/ui/separator';
// import { addAddress, deleteAddress, setSelectedAddress } from '@/Redux/productSlice';
// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';

// export const AddressForm = () => {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     phone: "",
//     email: "",
//     address: "",
//     city: "",
//     state: "",
//     zip: "",
//     country: ""
//   });

//   const { cart, addresses, selectedAddress } = useSelector((store) => store.product);
//   const [showForm, setShowForm] = useState(addresses?.length === 0);
//   const dispatch = useDispatch();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSave = () => {
//     dispatch(addAddress(formData));
//     setShowForm(false);
//   };

//   const subtotal = cart.totalPrice
//   const shipping = subtotal > 50 ? 0 : 10;
//   const tax = parseFloat((subtotal * 0.05).toFixed(2))
//   const total = subtotal + shipping + tax

//   return (
//     <div className='max-w-7xl mx-auto px-4'>
//       <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>

//         <div className="space-y-4 p-4 bg-white rounded-md">

//           {showForm ? (
//             <>
//               <div>
//                 <label className='text-sm font-semibold'>Full Name</label>
//                 <Input
//                   name='fullName'
//                   value={formData.fullName}
//                   onChange={handleChange}
//                   placeholder='John Doe'
//                 />
//               </div>

//               <div>
//                 <label className='text-sm font-semibold'>Phone</label>
//                 <Input
//                   name='phone'
//                   value={formData.phone}
//                   type='text'
//                   onChange={handleChange}
//                   placeholder='9876543210'
//                   inputMode='numeric'
//                   maxLength={10}
//                   className='appearance-none'
//                 />
//               </div>

//               <div>
//                 <label className='text-sm font-semibold'>Email</label>
//                 <Input
//                   name='email'
//                   type='email'
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder='abc@example.com'
//                 />
//               </div>

//               <div>
//                 <label className='text-sm font-semibold'>Address</label>
//                 <Input
//                   name='address'
//                   value={formData.address}
//                   onChange={handleChange}
//                   placeholder='32, Asopalav Society'
//                 />
//               </div>

//               <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
//                 <div>
//                   <label className='text-sm font-semibold'>City</label>
//                   <Input
//                     name='city'
//                     value={formData.city}
//                     onChange={handleChange}
//                     placeholder='Ahmedabad'
//                   />
//                 </div>

//                 <div>
//                   <label className='text-sm font-semibold'>State</label>
//                   <Input
//                     name='state'
//                     value={formData.state}
//                     onChange={handleChange}
//                     placeholder='Gujarat'
//                   />
//                 </div>
//               </div>

//               <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
//                 <div>
//                   <label className='text-sm font-semibold'>PinCode</label>
//                   <Input
//                     name='zip'
//                     type='text'
//                     value={formData.zip}
//                     onChange={handleChange}
//                     placeholder='385001'
//                     inputMode='numeric'
//                     maxLength={6}
//                     className='appearance-none'
//                   />
//                 </div>

//                 <div>
//                   <label className='text-sm font-semibold'>Country</label>
//                   <Input
//                     name='country'
//                     value={formData.country}
//                     onChange={handleChange}
//                     placeholder='India'
//                   />
//                 </div>
//               </div>

//               <button
//                 onClick={handleSave}
//                 className='w-full font-semibold bg-blue-600 text-white rounded p-2 text-sm hover:bg-blue-700'
//               >
//                 Save Address
//               </button>
//             </>
//             // <>
//             //   <div>
//             //     <label className='text-sm font-semibold'>Full Name</label>
//             //     <Input
//             //       name='fullName'
//             //       value={formData.fullName}
//             //       onChange={handleChange}
//             //       placeholder='John Doe'
//             //     />
//             //   </div>

//             //   <div>
//             //     <label className='text-sm font-semibold'>Phone</label>
//             //     <Input
//             //       name='phone'
//             //       value={formData.phone}
//             //       type='text'
//             //       onChange={handleChange}
//             //       placeholder='9876543210'
//             //       inputMode='numeric'
//             //       pattern='[0-9]*'
//             //       className='appearance-none'
//             //     />
//             //   </div>

//             //   <div>
//             //     <label className='text-sm font-semibold'>Email</label>
//             //     <Input
//             //       name='email'
//             //       type='email'
//             //       value={formData.email}
//             //       onChange={handleChange}
//             //       placeholder='abc@example.com'
//             //     />
//             //   </div>

//             //   <div>
//             //     <label className='text-sm font-semibold'>Address</label>
//             //     <Input
//             //       name='address'
//             //       value={formData.address}
//             //       onChange={handleChange}
//             //       placeholder='32, Asopalav Society'
//             //     />
//             //   </div>

//             //   <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
//             //     <div>
//             //       <label className='text-sm font-semibold'>City</label>
//             //       <Input
//             //         name='city'
//             //         value={formData.city}
//             //         onChange={handleChange}
//             //         placeholder='Ahmedabad'
//             //       />
//             //     </div>

//             //     <div>
//             //       <label className='text-sm font-semibold'>State</label>
//             //       <Input
//             //         name='state'
//             //         value={formData.state}
//             //         onChange={handleChange}
//             //         placeholder='Gujarat'
//             //       />
//             //     </div>
//             //   </div>

//             //   <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
//             //     <div>
//             //       <label className='text-sm font-semibold'>PinCode</label>
//             //       <Input
//             //         name='zip'
//             //         type='number'
//             //         value={formData.zip}
//             //         onChange={handleChange}
//             //         placeholder='385001'
//             //       />
//             //     </div>

//             //     <div>
//             //       <label className='text-sm font-semibold'>Country</label>
//             //       <Input
//             //         name='country'
//             //         value={formData.country}
//             //         onChange={handleChange}
//             //         placeholder='India'
//             //       />
//             //     </div>
//             //   </div>

//             //   <button
//             //     onClick={handleSave}
//             //     className='w-full font-semibold bg-blue-600 text-white rounded p-2 text-sm hover:bg-blue-700'
//             //   >
//             //     Save Address
//             //   </button>
//             // </>
//           ) : (
//             <div className='space-y-4'>
//               <h2 className='text-lg font-semibold'>Saved Addresses</h2>

//               {addresses.map((addr, index) => (
//                 <div
//                   onClick={() => dispatch(setSelectedAddress(index))}
//                   key={index}
//                   className={`border p-3 rounded-md relative ${selectedAddress === index
//                     ? "border-pink-600 bg-pink-50"
//                     : "border-gray-300"
//                     }`}
//                 >
//                   <p className='font-medium'>{addr.fullName}</p>
//                   <p className='text-sm'>📞 {addr.phone}</p>
//                   <p className='text-sm'>✉️ {addr.email}</p>
//                   <p className='text-sm'>
//                     📍 {addr.address}, {addr.city}, {addr.state}, {addr.zip}, {addr.country}
//                   </p>

//                   <button
//                     onClick={() => dispatch(deleteAddress(index))}
//                     className='absolute top-2 right-2 text-red-500 hover:text-blue-950 '
//                   >
//                     Delete
//                   </button>
//                 </div>
//               ))}

//               <div className='flex gap-3'>
//                 <Button
//                   onClick={() => setShowForm(true)}
//                   variant='outline'
//                   className='text-sm bg-blue-700 w-1/2'
//                 >
//                   + Add New Address
//                 </Button>

//                 <Button
//                   disabled={selectedAddress === null}
//                   className='w-1/2 bg-pink-600'>
//                   Proceed To CheckOut
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>
//         {/* Right Side Order Sumary */}
//         <Card className='w-[400px] mt-5 ml-25'>
//           <CardHeader>
//             <CardTitle>Order Summary</CardTitle>
//           </CardHeader>
//           <CardContent className='space-y-4'>
//             <div className="flex justify-between">
//               <span>Subtotal ({cart.items.length}) items</span>
//               <span>₹{subtotal.toLocaleString("en-IN")}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Shipping</span>
//               <span>₹{shipping}</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Tax</span>
//               <span>₹{tax}</span>
//             </div>
//             <Separator />
//             <div className="flex justify-between font-bold text-lg ">
//               <span>Total</span>
//               <span>₹{total}</span>
//             </div>
//             <div className="text-sm text-muted-foreground pt-4">
//               <p>* Free shipping on orders over 299</p>
//               <p>* 7-days return policy</p>
//               <p>* Secure Checkout with SSl encryption</p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };