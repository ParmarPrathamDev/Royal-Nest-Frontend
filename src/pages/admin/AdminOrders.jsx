import axios from "axios";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/v1/orders/all`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (data?.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Failed to fetch admin orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="lg:pl-[320px] py-6 px-4 sm:px-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          📦 Admin Orders
        </h1>

        <span className="self-start sm:self-auto bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-sm font-medium">
          Total Orders: {orders.length}
        </span>
      </div>

      {/* EMPTY STATE */}
      {orders.length === 0 ? (
        <div className="text-center text-gray-500 mt-20 text-lg">
          No orders found 😕
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md">

          {/* MOBILE VIEW (CARDS) */}
          <div className="block sm:hidden space-y-4 p-4">
            {orders.map((order) => (
              <div key={order._id} className="border rounded-lg p-4">
                <div className="text-xs text-gray-500 mb-1">
                  #{order._id.slice(-8)}
                </div>

                <div className="font-medium text-gray-800">
                  {order.user?.lastName || "User"}
                </div>

                <div className="text-xs text-gray-500 mb-2">
                  {order.user?.email}
                </div>

                <div className="flex justify-between text-sm mb-2">
                  <span>{order.products.length} Items</span>
                  <span className="font-semibold">
                    ₹{order.amount.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      order.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "Failed"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>

                  <span className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">

              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">Products</th>
                  <th className="px-4 py-3 text-left">Amount</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {order._id.slice(-8)}
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">
                        {order.user?.lastName || "User"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.user?.email}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {order.products.length} Items
                      </span>
                    </td>

                    <td className="px-4 py-3 font-semibold text-gray-800">
                      ₹{order.amount.toLocaleString("en-IN")}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "Paid"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : order.status === "Failed"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminOrders;










// responsive kariyu chhe 


// import axios from "axios";
// import React, { useEffect, useState } from "react";

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const accessToken = localStorage.getItem("accessToken");

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const { data } = await axios.get(
//           "http://localhost:8000/api/v1/orders/all",
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//             },
//           }
//         );

//         if (data?.success) {
//           setOrders(data.orders);
//         }
//       } catch (error) {
//         console.error("Failed to fetch admin orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [accessToken]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
//         Loading orders...
//       </div>
//     );
//   }

//   return (
//     <div className="pl-[320px] py-10 px-6 bg-gray-50 min-h-screen">

//       {/* HEADER */}
//       <div className="mb-6 flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-gray-800">
//           📦 Admin Orders
//         </h1>
//         <span className="bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-sm font-medium">
//           Total Orders: {orders.length}
//         </span>
//       </div>

//       {/* EMPTY STATE */}
//       {orders.length === 0 ? (
//         <div className="text-center text-gray-500 mt-20 text-lg">
//           No orders found 😕
//         </div>
//       ) : (
//         <div className="overflow-x-auto bg-white rounded-xl shadow-md">

//           <table className="w-full text-sm">

//             {/* TABLE HEADER */}
//             <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
//               <tr>
//                 <th className="px-4 py-3 text-left">Order ID</th>
//                 <th className="px-4 py-3 text-left">Customer</th>
//                 <th className="px-4 py-3 text-left">Products</th>
//                 <th className="px-4 py-3 text-left">Amount</th>
//                 <th className="px-4 py-3 text-left">Status</th>
//                 <th className="px-4 py-3 text-left">Date</th>
//               </tr>
//             </thead>

//             {/* TABLE BODY */}
//             <tbody>
//               {orders.map((order) => (
//                 <tr
//                   key={order._id}
//                   className="border-t hover:bg-gray-50 transition"
//                 >
//                   {/* ORDER ID */}
//                   <td className="px-4 py-3 text-xs text-gray-500">
//                     {order._id.slice(-8)}
//                   </td>

//                   {/* USER */}
//                   <td className="px-4 py-3">
//                     <div className="font-medium text-gray-800">
//                       {order.user?.lastName || "User"}
//                     </div>
//                     <div className="text-xs text-gray-500">
//                       {order.user?.email}
//                     </div>
//                   </td>

//                   {/* PRODUCTS */}
//                   <td className="px-4 py-3">
//                     <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
//                       {order.products.length} Items
//                     </span>
//                   </td>

//                   {/* AMOUNT */}
//                   <td className="px-4 py-3 font-semibold text-gray-800">
//                     ₹{order.amount.toLocaleString("en-IN")}
//                   </td>

//                   {/* STATUS */}
//                   <td className="px-4 py-3">
//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === "Paid"
//                         ? "bg-green-100 text-green-700"
//                         : order.status === "Pending"
//                           ? "bg-yellow-100 text-yellow-700"
//                           : order.status === "Failed"
//                             ? "bg-red-100 text-red-700"
//                             : "bg-gray-200 text-gray-700"
//                         }`}
//                     >
//                       {order.status}
//                     </span>
//                   </td>

//                   {/* DATE */}
//                   <td className="px-4 py-3 text-gray-500 text-sm">
//                     {new Date(order.createdAt).toLocaleDateString("en-IN")}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminOrders;








// import axios from "axios";
// import React, { useEffect, useState } from "react";

// const AdminOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const accessToken = localStorage.getItem("accessToken");

//   console.log("orders", orders);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const { data } = await axios.get("http://localhost:8000/api/v1/orders/all", {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });

//         if (data?.success) {
//           setOrders(data.orders);
//         }

//       } catch (error) {
//         console.error("Failed to fetch admin orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [accessToken]);

//   if (loading) {
//     return <div className="text-center py-20 text-gray-500">Loading all orders...</div>;
//   }

//   return (
//     <div className="pl-[350px] py-10 mx-auto px-4">
//       <h1 className="text-3xl font-bold mb-6">Admin - All Orders</h1>
//       {orders.length === 0 ? (
//         <p className="text-gray-500">No orders found.</p>
//       ) : (
//           <div className="overflow-x-auto">
//               <table className="w-full border border-gray-200 text-left text-sm">
//                   <thead className="bg-gray-100">
//                       <tr>
//                         <th className="px-4 py-2 border">Order Id</th>
//                         <th className="px-4 py-2 border">User</th>
//                         <th className="px-4 py-2 border">Products</th>
//                         <th className="px-4 py-2 border">Amount</th>
//                         <th className="px-4 py-2 border">Status</th>
//                         <th className="px-4 py-2 border">Date</th>
//                       </tr>
//                   </thead>
//                   <tbody>
//                     {orders.map((order)=> (
//                       <tr  key={order._id} className="hover:bg-gray-50">
//                           <td className="px-4 py-2 border">{order._id}</td>
//                           <td className="px-4 py-2 border">
//                             {order.user?.name }  <br/>
//                             <span className="text-xs text-gray-500">{order.user?.email}</span>
//                           </td>
//                           <td className="px-4 py-2 border">
//                             {order.products.map((p,idx) => (
//                               <div key={idx} className="text-sm">
//                                 {p.productName} x {p.quantity}
//                               </div>
//                             ))}
//                           </td>
//                           <td className="px-4 py-2 border">
//                             ₹{order.amount.toLocaleString("en-IN")}
//                           </td>
//                           <td className="px-4 py-2 border">
//                             <span
//                             className={`px-2 py-1 rounded text-xs font-medium ${order.status === "Paid" ? "bg-green-100 text-green-700": order.status === "Pending" ? "bg-yellow-100 text-yellow-700":"bg-red-100 text-red-700"}`}>
//                               {order.status}
//                             </span>
//                           </td>
//                           <td className="px-4 py-2 border">
//                             {new Date(order.createdAt).toLocaleDateString()}
//                           </td>
//                       </tr>
//                     ))}
//                   </tbody>
//               </table>
//           </div>
//         )}
//     </div>
//   );
// };

// export default AdminOrders;