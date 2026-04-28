import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from 'sonner'
import { setUser } from '@/Redux/userSlice'
import { API_BASE_URL } from "@/config/api"


const UserInfo = () => {
  const navigate = useNavigate()
  const [updateUser, setUpdateUser] = useState(null)
  const dispatch = useDispatch()
  // const { user } = useSelector(store => store.user)
  const params = useParams()
  const userId = params.id
  const handleChange = (e) => {
    setUpdateUser({
      ...updateUser,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const accessToken = localStorage.getItem("accessToken")

    try {
      const formData = new FormData()
      formData.append("firstName", updateUser.firstName)
      formData.append("lastName", updateUser.lastName)
      formData.append("email", updateUser.email)
      formData.append("phoneNo", updateUser.phoneNo)
      formData.append("address", updateUser.address)
      formData.append("city", updateUser.city)
      formData.append("zipCode", updateUser.zipCode)
      formData.append("role", updateUser.role)

      const res = await axios.put(
        `${API_BASE_URL}/api/v1/user/update/${userId}`,
        updateUser,   // JSON directly
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
          }
        }
      )

      // if (res.data.success) {
      //   toast.success(res.data.message)
      //   dispatch(setUser(res.data.user))
      // }

      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))
      }

    } catch (error) {
      console.log(error)
      toast.error("Failed to Update profile")
    }
  }

  const getUserDetails = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/user/get-user/${userId}`
      );

      if (res.data.success) {
        setUpdateUser(res.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getUserDetails()
  }, [])
  return (
    <div className='pt-5 min-h-screen bg- bg-gray-100'>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center min-h-screen bg-gray-100">

          {/* Top Header */}
          <div className="w-full max-w-2xl flex items-center gap-4 mb-6">
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft />
            </Button>
            <h1 className="font-bold text-2xl text-gray-800">
              Update Profile
            </h1>
          </div>

          {/* Form */}
          <div className="w-full max-w-2xl px-7">
            <form
              onSubmit={handleSubmit}
              className="space-y-4 shadow-lg p-5 rounded-lg ml-30 bg-white"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium">First Name</Label>
                  <Input type="text"
                    name="firstName"
                    placeholder="Papu"
                    value={updateUser?.firstName}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1" />
                </div>
                <div>
                  <Label className="block text-sm font-medium">Last Name</Label>
                  <Input type="text"
                    name="lastName"
                    placeholder="Pandit"
                    value={updateUser?.lastName}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1" />
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium">Email</Label>
                <Input type="email"
                  name="email"
                  disabled
                  value={updateUser?.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed" />
              </div>
              <div>
                <Label className="block text-sm font-medium">Phone No</Label>
                <Input type="text"
                  name="phoneNo"
                  placeholder="Enter your contact No"
                  value={updateUser?.phoneNo}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 mt-1 " />
              </div>
              <div>
                <Label className="block text-sm font-medium">Address</Label>
                <Input type="text"
                  name="address"
                  value={updateUser?.address}
                  onChange={handleChange}
                  placeholder="Enter your Address"
                  className="w-full border rounded-lg px-3 py-2 mt-1 " />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium">City</Label>
                  <Input type="text"
                    name="city"
                    value={updateUser?.city}
                    onChange={handleChange}
                    placeholder="Enter your City"
                    className="w-full border rounded-lg px-3 py-2 mt-1 " />
                </div>
                <div>
                  <label className="block text-sm font-medium">Pin Code</label>
                  <Input type="text"
                    name="zipCode"
                    placeholder="Enter your Pin Code"
                    value={updateUser?.zipCode}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1 " />
                </div>
              </div>
              <div className='flex gap-3 items-center'>
                <Label className='block text-sm font-medium'>Role:</Label>
                <RadioGroup 
                value={updateUser?.role} 
                onValueChange={(value)=>setUpdateUser({...updateUser, role:value})}
                className='flex items-center'>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem  value='user' id='user' />
                    <Label htmlFor='user'>User</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem  value='admin' id='admin' />
                    <Label htmlFor='admin'>Admin</Label>
                  </div>
                </RadioGroup>

              </div>
              <Button type="submit" className="w-full mt-4 bg-pink-600 hover:bg-pink-300 text-white font-semibold py-2 rounded-lg">
                Update Profile
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default UserInfo
