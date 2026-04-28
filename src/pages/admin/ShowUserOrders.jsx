import { OrderCard } from '@/components/OrderCard';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

const ShowUserOrders = () => {
  const params = useParams()
  const [userOrder, setUserOrder] = useState([])

  const getUserOrders = async () => {
    const accessToken = localStorage.getItem("accessToken")
    const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders/user-orders/${params.userId}`, {
      headers: {
         Authorization: `Bearer ${accessToken}` 
        }
    })
    if (res.data.success) {
      setUserOrder(res.data.orders)
    }
  }
  useEffect(() => {
    getUserOrders()
  },[])
console.log("USER ORDERS:", userOrder)

  return (
    <div className='lg:pl-[150px] md:pl-[200px]'>
      <OrderCard userOrder={userOrder} />
    </div>
  )
}
export default ShowUserOrders;