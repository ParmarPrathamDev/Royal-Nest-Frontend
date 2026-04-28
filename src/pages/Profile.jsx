import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { setUser } from "@/Redux/userSlice"
import axios from "axios"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { toast } from "sonner"
import { MyOrder } from "./MyOrder"

const Profile = () => {
  const { user } = useSelector((store) => store.user)
  const params = useParams()
  const userId = params.userId

  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
    role: user?.role || "",
  })

  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target
    let newValue = value

    if (name === "phoneNo") {
      newValue = value.replace(/\D/g, "").slice(0, 10)
    }

    if (name === "zipCode") {
      newValue = value.replace(/\D/g, "").slice(0, 6)
    }

    setUpdateUser({
      ...updateUser,
      [name]: newValue,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateUser.email)) {
      toast.error("Enter valid email")
      return
    }

    if (updateUser.phoneNo && updateUser.phoneNo.length !== 10) {
      toast.error("Mobile number must be 10 digits")
      return
    }

    if (updateUser.zipCode && updateUser.zipCode.length !== 6) {
      toast.error("Pincode must be 6 digits")
      return
    }

    const accessToken = localStorage.getItem("accessToken")

    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/user/update/${userId}`,
        updateUser,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      )

      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to Update profile")
    }
  }

  return (
    <div className="bg-gradient-to-l from-purple-100 via-pink-50 to-yellow-100 min-h-screen flex flex-col items-center">
      <Tabs defaultValue="profile" className="max-auto items-center">
        <TabsList className="mt-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div>
            <div className="flex flex-col justify-center items-center">
              <h1 className="font-bold mb-4 text-2xl text-gray-800">
                Update Profile
              </h1>

              <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 shadow-lg p-5 rounded-lg bg-white w-full"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Papu"
                        value={updateUser.firstName}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Pandit"
                        value={updateUser.lastName}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      disabled
                      value={updateUser.email}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Phone No
                    </label>
                    <input
                      type="text"
                      name="phoneNo"
                      placeholder="Enter your contact No"
                      value={updateUser.phoneNo}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={updateUser.address}
                      onChange={handleChange}
                      placeholder="Enter your Address"
                      className="w-full border rounded-lg px-3 py-2 mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium">City</label>
                     <input
  type="text"
  name="city"
  value={updateUser.city}
  onChange={(e) => {
    const value = e.target.value;
    
    // Only allow letters and spaces
    if (/^[a-zA-Z\s]*$/.test(value)) {
      handleChange(e);
    }
  }}
  placeholder="Enter your City"
  className="w-full border rounded-lg px-3 py-2 mt-1"
/>
                    </div>

                    <div>
                      <label className="block text-sm font-medium">
                        Pin Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="Enter your Pin Code"
                        value={updateUser.zipCode}
                        onChange={handleChange}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-4 bg-pink-600 hover:bg-pink-300 text-white font-semibold py-2 rounded-lg"
                  >
                    Update Profile
                  </button>
                </form>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <MyOrder />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Profile

// import React from "react"
// import { MyOrder } from "./MyOrder"

// const Profile = () => {
//   return (
//     <div className="bg-gradient-to-l from-purple-100 via-pink-50 to-yellow-100 min-h-screen">
//       <div className="max-w-7xl mx-auto px-4 py-6">
//         <div className="flex justify-center">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
//             My Orders
//           </h1>
//         </div>

//         <MyOrder />
//       </div>
//     </div>
//   )
// }

// export default Profile





// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"

// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs"
// import store from "@/Redux/store"
// import { setUser } from "@/Redux/userSlice"
// import axios from "axios"
// import { useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { useParams } from "react-router-dom"
// import { toast } from "sonner"
// import { MyOrder } from "./MyOrder"

// const Profile = () => {
//   const { user } = useSelector(store => store.user)
//   const params = useParams()
//   const userId = params.userId
  
//   const [updateUser, setUpdateUser] = useState({
//     firstName: user?.firstName,
//     lastName: user?.lastName,
//     email: user?.email,
//     phoneNo: user?.phoneNo,
//     address: user?.address,
//     city: user?.city,
//     zipCode: user?.zipCode,
//     role: user?.role
//   })

//   const dispatch = useDispatch()

//   const handleChange = (e) => {
//     setUpdateUser({
//       ...updateUser,
//       [e.target.name]: e.target.value
//     })
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault()

//     const accessToken = localStorage.getItem("accessToken")

//     try {
//       const formData = new FormData()
//       formData.append("firstName", updateUser.firstName)
//       formData.append("lastName", updateUser.lastName)
//       formData.append("email", updateUser.email)
//       formData.append("phoneNo", updateUser.phoneNo)
//       formData.append("address", updateUser.address)
//       formData.append("city", updateUser.city)
//       formData.append("zipCode", updateUser.zipCode)
//       formData.append("role", updateUser.role)

//       const res = await axios.put(
//         `http://localhost:8000/api/v1/user/update/${userId}`,
//         updateUser,   // JSON directly
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             "Content-Type": "application/json"
//           }
//         }
//       )


//       // if (res.data.success) {
//       //   toast.success(res.data.message)
//       //   dispatch(setUser(res.data.user))
//       // }

//       if (res.data.success) {
//         toast.success(res.data.message)
//         dispatch(setUser(res.data.user))
//       }

//     } catch (error) {
//       console.log(error)
//       toast.error("Failed to Update profile")
//     }
//   }

//   return (

    
//        <div className="bg-gradient-to-l from-purple-100 via-pink-50 to-yellow-100 min-h-screen flex flex-col items-center">
//       <Tabs defaultValue="profile" className=" max-auto items-center">
//         <TabsList className="mt-2">
//           <TabsTrigger value="profile">Profile</TabsTrigger>
//           <TabsTrigger value="orders">Orders</TabsTrigger>
//         </TabsList>

//         <TabsContent value="profile">
//           <div>
//             <div className="flex flex-col justify-center items-center ">
//               <h1 className="font-bold mb-4 text-2xl text-gray-800"> Update Profile </h1>
//               <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
//                 <form onSubmit={handleSubmit} className="space-y-4 shadow-lg p-5 rounded-lg bg-white">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium">First Name</label>
//                       <input type="text"
//                         name="firstName"
//                         placeholder="Papu"
//                         value={updateUser.firstName}
//                         onChange={handleChange}
//                         className="w-full border rounded-lg px-3 py-2 mt-1" />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium">Last Name</label>
//                       <input type="text"
//                         name="lastName"
//                         placeholder="Pandit"
//                         value={updateUser.lastName}
//                         onChange={handleChange}
//                         className="w-full border rounded-lg px-3 py-2 mt-1" />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium">Email</label>
//                     <input type="email"
//                       name="email"
//                       disabled
//                       value={updateUser.email}
//                       onChange={handleChange}
//                       className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed" />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium">Phone No</label>
//                     <input type="text"
//                       name="phoneNo"
//                       placeholder="Enter your contact No"
//                       value={updateUser.phoneNo}
//                       onChange={handleChange}
//                       className="w-full border rounded-lg px-3 py-2 mt-1 " />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium">Address</label>
//                     <input type="text"
//                       name="address"
//                       value={updateUser.address}
//                       onChange={handleChange}
//                       placeholder="Enter your Address"
//                       className="w-full border rounded-lg px-3 py-2 mt-1 " />
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium">City</label>
//                       <input type="text"
//                         name="city"
//                         value={updateUser.city}
//                         onChange={handleChange}
//                         placeholder="Enter your City"
//                         className="w-full border rounded-lg px-3 py-2 mt-1 " />
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium">Pin Code</label>
//                       <input type="text"
//                         name="zipCode"
//                         placeholder="Enter your Pin Code"
//                         value={updateUser.zipCode}
//                         onChange={handleChange}
//                         className="w-full border rounded-lg px-3 py-2 mt-1 " />
//                     </div>
//                   </div>

//                   <button type="submit" className="w-full mt-4 bg-pink-600 hover:bg-pink-300 text-white font-semibold py-2 rounded-lg">
//                     Update Profile
//                   </button>
//                 </form>
//               </div>

//             </div>
//           </div>
//         </TabsContent>

//         <TabsContent value="orders">
//        <MyOrder/>
//         </TabsContent>

//       </Tabs>
//     </div>

//   )
// }

// export default Profile