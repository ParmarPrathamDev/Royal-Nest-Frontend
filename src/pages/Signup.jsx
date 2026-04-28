import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_BASE_URL } from "@/config/api"

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  const [errors, setErrors] = useState({})

  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // error remove when user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }))
  }

  // ✅ Validation Function
  const validate = () => {
    let newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    if (!validate()) return

    try {
      setLoading(true)

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (res.data.success) {
        navigate("/verify") //// redirect second page 
      }
    } catch (error) {
      setErrors({
        api: error.response?.data?.message || "Something went wrong",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Enter details below to create your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={submitHandler} className="flex flex-col gap-3">
            
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>First Name</Label>
                <Input
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>

              <div className="grid gap-2">
                <Label>Last Name</Label>
                <Input
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                />
                {showPassword ? (
                  <EyeOff
                    onClick={() => setShowPassword(false)}
                    className="w-5 h-5 absolute right-4 top-3 cursor-pointer"
                  />
                ) : (
                  <Eye
                    onClick={() => setShowPassword(true)}
                    className="w-5 h-5 absolute right-4 top-3 cursor-pointer"
                  />
                )}
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* API Error */}
            {errors.api && (
              <p className="text-red-600 text-sm text-center">
                {errors.api}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-pink-400 hover:bg-pink-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Please Wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pink-800 hover:underline"
            >
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Signup

























// import React, { useState } from 'react'
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Eye, EyeOff, Loader2 } from 'lucide-react'
// import { Link, useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { toast } from 'sonner'

// const Signup = () => {
//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoaging] = useState(false)
//   const [formData, setFormdata] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//   })

//   const navigate = useNavigate()

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormdata((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   }

//   const submitHandler = async (e) => {
//     e.preventDefault() // from realod nai thay 
//     console.log(formData);
//     try {
//       setLoaging(true)
//       const res = await axios.post(`http://localhost:8000/api/v1/user/register`, formData, {
//         headers: {
//           "Content-Type": "application/json"
//         }
//       })

//       if (res.data.success) {
//         navigate('/verify')
//         toast.success(res.data.message); 
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.response.data.message)
//     }finally{
//       setLoaging(false)
//     }
//   }
//   return (
//     <div className='flex justify-center items-center min-h-screen bg-pink-100 '>
//       <Card className="w-full max-w-sm">
//         <CardHeader>
//           <CardTitle>Create your account</CardTitle>
//           <CardDescription>
//             Enter given details below to create to your account
//           </CardDescription>

//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col gap-3">
//             <div className="grid grid-cols-2 gap-4">
//               <div className='grid gap-2'>
//                 <Label htmlFor="firstname">First Name</Label>
//                 <Input
//                   id='firstname'
//                   name='firstName'
//                   placeholder='adc'
//                   type='text'
//                   value={formData.firstname}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className='grid gap-2'>
//                 <Label htmlFor="lastname">Last Name</Label>
//                 <Input
//                   id='lastname'
//                   name='lastName'
//                   placeholder='xyz'
//                   type='text'
//                   value={formData.lastname}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>
//             <div className='grid gap-2'>
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="m@example.com"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />

//             </div>
//             <div className="grid gap-2">
//               <div className="flex items-center">
//                 <Label htmlFor="password">Password</Label>
//               </div>
//               <div className='relative'>
//                 <Input id="password"
//                   name='password'
//                   placeholder='Create Password'
//                   type={showPassword ? 'text' : 'password'}
//                   value={formData.password}
//                   onChange={handleChange}
//                   required />
//                 {
//                   showPassword ? <EyeOff onClick={() => setShowPassword(false)} className='w-5 h-5 text-gray-700 absolute right-5 bottom-2' /> :
//                     <Eye onClick={() => setShowPassword(true)} className='w-5 h-5 text-gray-700 absolute right-5 bottom-2' />
//                 }
//               </div>

//             </div>
//           </div>

//         </CardContent>
//         <CardFooter className="flex-col gap-2">
//           <Button onClick={submitHandler} type="submit" className="w-full cursor-pointer bg-pink-400 hover:bg-pink-700">
//           {loading ? <><Loader2  className='h-4 w-4 animate-spin mr-2'/>Please Wait</> : 'Sign Up'}   
//           </Button>
//           <p className='text-gray-400 text-sm'> Alrady have an account? <Link to={'/Login'} className='hover:underline cursor-pointer text-pink-800'>Login </Link></p>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }
// export default Signup;