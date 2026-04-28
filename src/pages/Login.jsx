import React, { useState, useRef } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser } from "@/Redux/userSlice"
import { Eye, EyeOff } from "lucide-react"
import { API_BASE_URL } from "@/config/api"

const Login = () => {
  const [step, setStep] = useState("login")

  const [email, setEmail] = useState("")
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""])
  const otpRefs = Array(6).fill(0).map(() => useRef())

  const [form, setForm] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  // ================= OTP HANDLERS =================
  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otpValues]
    newOtp[index] = value
    setOtpValues(newOtp)

    if (value && index < 5) {
      otpRefs[index + 1].current.focus()
    }
  }

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      otpRefs[index - 1].current.focus()
    }
  }

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    try {
      setLoading(true)

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/login`,
        { email, password: form.password }
      )

      if (res.data.success) {
        // ✅ token save
        localStorage.setItem("accessToken", res.data.accessToken)

        // ✅ user save (IMPORTANT)
        localStorage.setItem("user", JSON.stringify(res.data.user))

        // redux
        dispatch(setUser(res.data.user))

        // ✅ role based redirect
        if (res.data.user.role === "admin") {
          navigate("/dashboard/sales")
        } else {
          navigate("/")
        }
      }

    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }
  // const handleLogin = async (e) => {
  //   e.preventDefault()
  //   setError("")
  //   try {
  //     setLoading(true)

  //     const res = await axios.post(
  //       "http://localhost:8000/api/v1/user/login",
  //       { email, password: form.password }
  //     )

  //     if (res.data.success) {
  //       localStorage.setItem("accessToken", res.data.accessToken)
  //       dispatch(setUser(res.data.user))
  //       navigate("/")
  //     }
  //   } catch (err) {
  //     setError(err.response?.data?.message || "Login failed")
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // ================= FORGOT =================
  const handleForgot = async (e) => {
    e.preventDefault()
    setError("")
    try {
      setLoading(true)

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/forgot-password`,
        { email }
      )

      if (res.data.success) {
        setStep("otp")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP")
    } finally {
      setLoading(false)
    }
  }

  // ================= VERIFY OTP =================
  const handleOTP = async (e) => {
    e.preventDefault()
    setError("")

    const otp = otpValues.join("")

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/verify-otp/${email}`,
        { otp }
      )

      if (res.data.success) {
        setStep("reset")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP")
    }
  }

  // ================= RESET PASSWORD =================
  const handleReset = async (e) => {
    e.preventDefault()
    setError("")

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/change-password/${email}`,
        {
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        }
      )

      if (res.data.success) {
        alert("Password Changed Successfully")
        setStep("login")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error changing password")
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-pink-100 to-pink-300 px-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl">

        <h2 className="text-2xl font-bold text-center mb-6 capitalize">
          {step === "login" && "Login"}
          {step === "forgot" && "Forgot Password"}
          {step === "otp" && "Verify OTP"}
          {step === "reset" && "Change Password"}
        </h2>

        {/* ================= LOGIN ================= */}
        {step === "login" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            <div>
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border p-2 rounded"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label>Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  className="w-full border p-2 rounded pr-10"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <div
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            <p
              className="text-sm text-pink-600 cursor-pointer text-right"
              onClick={() => setStep("forgot")}
            >
              Forgot Password?
            </p>

            {error && <p className="text-red-500">{error}</p>}

            <button className="bg-pink-500 text-white py-2 rounded">
              {loading ? "Loading..." : "Login"}
            </button>

            <p className="text-center text-sm mt-2">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-pink-600">
                Sign Up
              </Link>
            </p>
          </form>
        )}

        {/* ================= FORGOT ================= */}
        {step === "forgot" && (
          <form onSubmit={handleForgot} className="flex flex-col gap-4">

            <div>
              <label>Email</label>
              <input
                type="email"
                value={email}
                placeholder="Enter email"
                className="w-full border p-2 rounded"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <p className="text-sm text-gray-500 text-center">
              OTP will be sent to this email
            </p>

            {error && <p className="text-red-500">{error}</p>}

            <button className="bg-pink-500 text-white py-2 rounded">
              {loading ? "Sending..." : "Send OTP"}
            </button>

            <p
              className="text-center cursor-pointer"
              onClick={() => setStep("login")}
            >
              Back to Login
            </p>
          </form>
        )}

        {/* ================= OTP ================= */}
        {step === "otp" && (
          <form onSubmit={handleOTP} className="flex flex-col gap-4">

            <label>Enter OTP</label>

            <div className="flex justify-between gap-2">
              {otpValues.map((val, index) => (
                <input
                  key={index}
                  ref={otpRefs[index]}
                  type="text"
                  maxLength="1"
                  value={val}
                  onChange={(e) =>
                    handleOtpChange(e.target.value, index)
                  }
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="w-12 h-12 text-center border rounded text-lg"
                />
              ))}
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button className="bg-pink-500 text-white py-2 rounded">
              Verify OTP
            </button>
          </form>
        )}

        {/* ================= RESET ================= */}
        {step === "reset" && (
          <form onSubmit={handleReset} className="flex flex-col gap-4">

            {/* New Password */}
            <div>
              <label>New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full border p-2 rounded pr-10"
                  onChange={(e) =>
                    setForm({ ...form, newPassword: e.target.value })
                  }
                />
                <div
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label>Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  className="w-full border p-2 rounded pr-10"
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                />
                <div
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button className="bg-pink-500 text-white py-2 rounded">
              Change Password
            </button>
          </form>
        )}

      </div>
    </div>
  )
}

export default Login


// import React, { useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Eye, EyeOff, Loader2 } from "lucide-react"
// import { Link, useNavigate } from "react-router-dom"
// import axios from "axios"
// import { useDispatch } from 'react-redux'
// import { setUser } from "@/Redux/userSlice"

// const Login = () => {
//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   })

//   const [errors, setErrors] = useState({})

//   const navigate = useNavigate()

//   const dispatch = useDispatch()


//   const handleChange = (e) => {
//     const { name, value } = e.target

//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))

//     setErrors((prev) => ({
//       ...prev,
//       [name]: "",
//       api: "",
//     }))
//   }

//   // ✅ Validation
//   const validate = () => {
//     let newErrors = {}

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required"
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Invalid email format"
//     }

//     if (!formData.password) {
//       newErrors.password = "Password is required"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const submitHandler = async (e) => {
//     e.preventDefault()

//     if (!validate()) return

//     try {
//       setLoading(true)

//       const res = await axios.post(
//         "http://localhost:8000/api/v1/user/login",
//         formData,
//         {
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       )

//       if (res.data.success) {
//         navigate("/") // ya dashboard page
//         dispatch(setUser(res.data.user))
//         localStorage.setItem("accessToken",res.data.accessToken)
//       }
//     } catch (error) {
//       setErrors({
//         api: error.response?.data?.message || "Login failed",
//       })
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-pink-100">
//       <Card className="w-full max-w-sm">
//         <CardHeader>
//           <CardTitle>Login</CardTitle>
//           <CardDescription>
//             Enter your email and password to login
//           </CardDescription>
//         </CardHeader>

//         <CardContent>
//           <form onSubmit={submitHandler} className="flex flex-col gap-3">
//             {/* Email */}
//             <div className="grid gap-2">
//               <Label>Email</Label>
//               <Input
//                 name="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm">{errors.email}</p>
//               )}
//             </div>

//             {/* Password */}
//             <div className="grid gap-2">
//               <Label>Password</Label>
//               <div className="relative">
//                 <Input
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   value={formData.password}
//                   onChange={handleChange}
//                 />
//                 {showPassword ? (
//                   <EyeOff
//                     onClick={() => setShowPassword(false)}
//                     className="w-5 h-5 absolute right-4 top-3 cursor-pointer"
//                   />
//                 ) : (
//                   <Eye
//                     onClick={() => setShowPassword(true)}
//                     className="w-5 h-5 absolute right-4 top-3 cursor-pointer"
//                   />
//                 )}
//               </div>
//               {errors.password && (
//                 <p className="text-red-500 text-sm">{errors.password}</p>
//               )}
//             </div>

//             {/* API Error */}
//             {errors.api && (
//               <p className="text-red-600 text-sm text-center">
//                 {errors.api}
//               </p>
//             )}

//             <Button
//               type="submit"
//               className="w-full bg-pink-400 hover:bg-pink-700"
//             >
//               {loading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                   Please Wait
//                 </>
//               ) : (
//                 "Login"
//               )}
//             </Button>
//           </form>
//         </CardContent>

//         <CardFooter>
//           <p className="text-gray-400 text-sm">
//             Don’t have an account?{" "}
//             <Link to="/signup" className="text-pink-800 hover:underline">
//               Sign Up
//             </Link>
//           </p>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }

// export default Login
