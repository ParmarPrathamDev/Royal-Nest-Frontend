import { OrderCard } from '@/components/OrderCard'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export const MyOrder = () => {
  const [userOrder, setUserOrder] = useState([])
  const [visibleCount, setVisibleCount] = useState(5)

  const getUserOrders = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken")

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/myorders`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      if (res.data.success) {
        // ✅ latest order pela (descending)
        const sortedOrders = res.data.orders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )

        setUserOrder(sortedOrders)
      }
    } catch (error) {
      console.error("ERROR:", error.response?.data || error.message)
    }
  }

  useEffect(() => {
    getUserOrders()
  }, [])

  const visibleOrders = userOrder.slice(0, visibleCount)

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 5)
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4">

      {/* ✅ TOTAL ORDERS */}
      {/* <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          My Orders
        </h2>

        <span className="text-sm sm:text-base text-gray-600 font-medium">
          Total: {userOrder.length} Orders
        </span>
      </div> */}

      {userOrder.length > 0 ? (
        <>
          <OrderCard userOrder={visibleOrders} />

          {/* ✅ SHOW MORE */}
          {visibleCount < userOrder.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleShowMore}
                className="px-6 py-2.5 rounded-lg bg-pink-600 text-white font-medium hover:bg-pink-700 transition"
              >
                Show More
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-gray-700">No Orders Found</h2>
          <p className="text-gray-500 mt-2">You haven’t placed any orders yet.</p>
        </div>
      )}
    </div>
  )
}



/// +5 order walu kariyu chhe 



// import { OrderCard } from '@/components/OrderCard'
// import axios from 'axios'
// import React, { useEffect, useState } from 'react'

// export const MyOrder = () => {
//     const [userOrder, setUserOrder] = useState([])

//     const getUserOrders = async () => {
//         try {
//             const accessToken = localStorage.getItem("accessToken")

//             const res = await axios.get(
//                 `${import.meta.env.VITE_URL}/api/v1/orders/myorders`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${accessToken}`
//                     }
//                 }
//             )

//             if (res.data.success) {
//                 console.log("ORDERS:", res.data.orders)
//                 setUserOrder(res.data.orders)
//             }
//         } catch (error) {
//             console.error("ERROR:", error.response?.data || error.message)
//         }
//     }

//     useEffect(() => {
//         getUserOrders()
//     }, [])

//     return (
//        <>
//        <OrderCard   userOrder={userOrder}/>
//        </>
//     )
// }


// import { Button } from '@/components/ui/button'
// import axios from 'axios'
// import { ArrowLeft, Calendar, DollarSign, User } from 'lucide-react'
// import React, { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// export const MyOrder = () => {
//   const navigate = useNavigate()
//   const [orders, setOrders] = useState([])

//   const getUserOrders = async () => {
//     try {
//       const token = localStorage.getItem("accessToken")
//       const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/orders/myorders`, {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       if (res.data.success) setOrders(res.data.orders)
//     } catch (err) {
//       console.error(err.response?.data || err.message)
//     }
//   }

//   useEffect(() => { getUserOrders() }, [])

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case "paid": return "bg-green-500"
//       case "failed": return "bg-red-500"
//       case "pending": return "bg-yellow-500"
//       default: return "bg-gray-400"
//     }
//   }

//   return (
//     <div className="px-4 md:px-16 py-6 flex flex-col gap-6">
//       {/* Header */}
//       <div className="flex items-center gap-4">
//         <Button onClick={() => navigate(-1)} className="p-2">
//           <ArrowLeft />
//         </Button>
//         <h1 className="text-2xl md:text-3xl font-bold">My Orders</h1>
//       </div>

//       {/* No Orders */}
//       {orders.length === 0 ? (
//         <div className="flex justify-center items-center h-64">
//           <p className="text-gray-500 text-lg md:text-xl">No orders found.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {orders.map((order) => (
//             <div key={order._id} className="border rounded-2xl shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between bg-white">
//               {/* Top Section */}
//               <div className="flex justify-between items-start mb-4">
//                 <h2 className="text-md font-semibold break-all">{order._id}</h2>
//                 <span className={`${getStatusColor(order.status)} text-white px-3 py-1 rounded-full text-sm`}>
//                   {order.status}
//                 </span>
//               </div>

//               {/* Info Section */}
//               <div className="flex flex-col gap-2 text-gray-600 text-sm">
//                 <div className="flex items-center gap-2">
//                   <User size={16} /> {order.user?.firstName || "Unknown"} {order.user?.lastName || ""}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <DollarSign size={16} /> {order.currency} {Number(order.amount || 0).toFixed(2)}
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Calendar size={16} /> {new Date(order.createdAt).toLocaleDateString()}
//                 </div>
//                 <p className="text-gray-400 text-xs break-all">Email: {order.user?.email || "N/A"}</p>
//               </div>

//               {/* View Button */}
//               <Button
//                 onClick={() => navigate(`/orders/${order._id}`)}
//                 className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white"
//               >
//                 View Details
//               </Button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }



