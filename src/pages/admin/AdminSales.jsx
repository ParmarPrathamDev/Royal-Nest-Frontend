import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import React, { useEffect } from 'react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";

const AdminSales = () => {
  const [stats, setStats] = React.useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    topProducts: [],
  });

  const fetchSales = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/orders/sales`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );

      if (res.data.success) {
        setStats({
          totalUsers: res.data.totalUsers || 0,
          totalProducts: res.data.totalProducts || 0,
          totalOrders: res.data.totalOrders || 0,
          totalSales: res.data.totalSales || 0,
          topProducts: res.data.topProducts || [],
        });
      }
    } catch (error) {
      console.error(error);
      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const chartData = stats.topProducts.map((item) => ({
    ...item,
    shortName:
      item.name?.length > 26
        ? item.name.slice(0, 26) + "..."
        : item.name
  }));

  const summaryCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      bg: "bg-gradient-to-r from-pink-500 to-pink-400",
      light: "bg-pink-50",
      text: "text-pink-600"
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "📦",
      bg: "bg-gradient-to-r from-blue-500 to-blue-400",
      light: "bg-blue-50",
      text: "text-blue-600"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: "🛒",
      bg: "bg-gradient-to-r from-green-500 to-green-400",
      light: "bg-green-50",
      text: "text-green-600"
    },
    {
      title: "Total Sales",
      value: `₹ ${Number(stats.totalSales || 0).toLocaleString("en-IN")}`,
      icon: "💰",
      bg: "bg-gradient-to-r from-purple-500 to-purple-400",
      light: "bg-purple-50",
      text: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fa] px-3 sm:px-4 md:px-5 lg:px-6 pt-20 md:pt-8 md:pl-[300px] lg:pl-[300px] pb-6 overflow-x-hidden">
      {/* Top Header */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Overview of users, products, orders and sales
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
          >
            <div className={`h-1.5 w-full ${card.bg}`} />

            <div className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    {card.title}
                  </p>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 leading-tight break-words">
                    {card.value}
                  </h2>
                </div>

                <div
                  className={`h-11 w-11 sm:h-12 sm:w-12 rounded-xl flex items-center justify-center text-xl ${card.light} ${card.text} shrink-0`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="mt-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Chart Section */}
        <Card className="xl:col-span-8 rounded-2xl border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
              Top Selling Products
            </CardTitle>
            <p className="text-sm text-gray-500">
              Best performing products based on sold quantity
            </p>
          </CardHeader>

          <CardContent>
            {chartData.length > 0 ? (
              <>
                {/* Mobile List */}
                <div className="block md:hidden space-y-3">
                  {chartData.map((item, index) => {
                    const maxQty = Math.max(...chartData.map((p) => p.quantity), 1);
                    const width = Math.max((item.quantity / maxQty) * 100, 8);

                    return (
                      <div
                        key={index}
                        className="rounded-xl border border-gray-200 bg-white p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-medium text-gray-700 leading-snug">
                            {item.name}
                          </p>
                          <span className="shrink-0 rounded-full bg-pink-100 text-pink-600 px-3 py-1 text-xs font-semibold">
                            {item.quantity}
                          </span>
                        </div>

                        <div className="mt-3 h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-pink-500"
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop / Tablet Chart */}
                <div className="hidden md:block w-full h-[420px] lg:h-[460px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      layout="vertical"
                      margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                      barCategoryGap={16}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis
                        type="category"
                        dataKey="shortName"
                        width={210}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}`, "Sold Qty"]}
                        labelFormatter={(label, payload) =>
                          payload?.[0]?.payload?.name || label
                        }
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #e5e7eb"
                        }}
                      />
                      <Bar
                        dataKey="quantity"
                        radius={[0, 10, 10, 0]}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index % 2 === 0 ? "#ec4899" : "#f472b6"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-gray-500 text-sm sm:text-base">
                No product sales data found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Side Info Cards */}
        <div className="xl:col-span-4 space-y-6">
          <Card className="rounded-2xl border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Quick Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-sm text-gray-600">Registered Users</span>
                <span className="font-semibold text-gray-900">{stats.totalUsers}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-sm text-gray-600">Available Products</span>
                <span className="font-semibold text-gray-900">{stats.totalProducts}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-sm text-gray-600">Completed Orders</span>
                <span className="font-semibold text-gray-900">{stats.totalOrders}</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="font-semibold text-gray-900">
                  ₹ {Number(stats.totalSales || 0).toLocaleString("en-IN")}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-gray-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Top Products Snapshot
              </CardTitle>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <div className="space-y-3">
                  {chartData.slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between gap-3 rounded-xl border border-gray-100 px-3 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Product Rank #{index + 1}
                        </p>
                      </div>

                      <div className="shrink-0 rounded-full bg-pink-100 text-pink-600 px-3 py-1 text-xs font-semibold">
                        {item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  No top products available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminSales;









// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import axios from 'axios';
// import React, { useEffect } from 'react';

// import {
//   BarChart,
//   Bar,  
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   Cell
// } from "recharts";

// const AdminSales = () => {
//   const [stats, setStats] = React.useState({
//     totalUsers: 0,
//     totalProducts: 0,
//     totalOrders: 0,
//     totalSales: 0,
//     topProducts: [],
//   });

//   const fetchSales = async () => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");

//       const res = await axios.get(
//         `${import.meta.env.VITE_URL}/api/v1/orders/sales`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`
//           }
//         }
//       );

//       if (res.data.success) {
//         setStats({
//           totalUsers: res.data.totalUsers || 0,
//           totalProducts: res.data.totalProducts || 0,
//           totalOrders: res.data.totalOrders || 0,
//           totalSales: res.data.totalSales || 0,
//           topProducts: res.data.topProducts || [],
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       console.log(error.response?.data);
//     }
//   };

//   useEffect(() => {
//     fetchSales();
//   }, []);

//   const chartData = stats.topProducts.map((item) => ({
//     ...item,
//     shortName:
//       item.name?.length > 28
//         ? item.name.slice(0, 28) + "..."
//         : item.name
//   }));

//   return (
//     <div className='bg-gray-100 min-h-screen px-4 py-6 pt-20 md:pt-10 md:pl-[320px]'>

//       {/* Title */}
//       <h1 className='text-2xl sm:text-3xl font-bold mb-6 sm:mb-8'>
//         📊 Admin Dashboard
//       </h1>

//       {/* Cards */}
//       <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6'>
//         <Card className='shadow-lg rounded-2xl bg-gradient-to-r from-pink-500 to-pink-400 text-white transition hover:scale-[1.02]'>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-base sm:text-lg">Total Users</CardTitle>
//           </CardHeader>
//           <CardContent className='text-3xl sm:text-4xl font-bold'>
//             {stats.totalUsers}
//           </CardContent>
//         </Card>

//         <Card className='shadow-lg rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 text-white transition hover:scale-[1.02]'>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-base sm:text-lg">Total Products</CardTitle>
//           </CardHeader>
//           <CardContent className='text-3xl sm:text-4xl font-bold'>
//             {stats.totalProducts}
//           </CardContent>
//         </Card>

//         <Card className='shadow-lg rounded-2xl bg-gradient-to-r from-green-500 to-green-400 text-white transition hover:scale-[1.02]'>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-base sm:text-lg">Total Orders</CardTitle>
//           </CardHeader>
//           <CardContent className='text-3xl sm:text-4xl font-bold'>
//             {stats.totalOrders}
//           </CardContent>
//         </Card>

//         <Card className='shadow-lg rounded-2xl bg-gradient-to-r from-purple-500 to-purple-400 text-white transition hover:scale-[1.02]'>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-base sm:text-lg">Total Sales</CardTitle>
//           </CardHeader>
//           <CardContent className='text-2xl sm:text-4xl font-bold break-words'>
//             ₹ {stats.totalSales}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Chart */}
//       <Card className='mt-8 sm:mt-10 shadow-lg rounded-2xl overflow-hidden'>
//         <CardHeader className="pb-2">
//           <CardTitle className='text-lg sm:text-xl font-semibold'>
//             🛍️ Top Selling Products
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           {chartData.length > 0 ? (
//             <>
//               {/* Mobile Card List */}
//               <div className="block md:hidden space-y-3">
//                 {chartData.map((item, index) => (
//                   <div
//                     key={index}
//                     className="rounded-xl border bg-white p-3 shadow-sm"
//                   >
//                     <div className="flex items-start justify-between gap-3">
//                       <p className="text-sm font-medium text-gray-700 leading-snug">
//                         {item.name}
//                       </p>
//                       <span className="shrink-0 rounded-full bg-pink-100 text-pink-600 px-3 py-1 text-sm font-semibold">
//                         {item.quantity}
//                       </span>
//                     </div>

//                     <div className="mt-3 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
//                       <div
//                         className="h-full rounded-full bg-pink-500"
//                         style={{
//                           width: `${Math.max(
//                             (item.quantity /
//                               Math.max(...chartData.map((p) => p.quantity), 1)) *
//                               100,
//                             8
//                           )}%`
//                         }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Desktop / Tablet Chart */}
//               <div className="hidden md:block w-full h-[420px] lg:h-[460px]">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <BarChart
//                     data={chartData}
//                     layout="vertical"
//                     margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
//                     barCategoryGap={18}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis type="number" />
//                     <YAxis
//                       type="category"
//                       dataKey="shortName"
//                       width={220}
//                       tick={{ fontSize: 12 }}
//                     />
//                     <Tooltip
//                       formatter={(value) => [`${value}`, "Sold Qty"]}
//                       labelFormatter={(label, payload) =>
//                         payload?.[0]?.payload?.name || label
//                       }
//                       contentStyle={{ borderRadius: "10px" }}
//                     />
//                     <Bar
//                       dataKey="quantity"
//                       fill="#ec4899"
//                       radius={[0, 10, 10, 0]}
//                     >
//                       {chartData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill="#ec4899" />
//                       ))}
//                     </Bar>
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </>
//           ) : (
//             <div className="h-[200px] flex items-center justify-center text-gray-500">
//               No product sales data found
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AdminSales;






// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import axios from 'axios';
// import React, { useEffect } from 'react';

// import {
//   AreaChart,
//   Area,
//   XAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid
// } from "recharts";

// const AdminSales = () => {
//   const [stats, setStats] = React.useState({
//     totalUsers: 0,
//     totalProducts: 0,
//     totalOrders: 0,
//     totalSales: 0,
//     salesByDate: [],
//   });

//   const fetchSales = async () => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");

//       const res = await axios.get(
//         `${import.meta.env.VITE_URL}/api/v1/orders/sales`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`
//           }
//         }
//       );

//       console.log("API Response 👉", res.data);

//       if (res.data.success) {
//         setStats(res.data);
//       }
//     } catch (error) {
//       console.error(error);
//       console.log(error.response?.data);
//     }
//   };

//   useEffect(() => {
//     fetchSales();
//   }, []);

//   return (
//     <div className='bg-gray-100 min-h-screen py-10 px-4 md:pl-[320px]'>

//       {/* Title */}
//       <h1 className='text-3xl font-bold mb-8'>📊 Admin Dashboard</h1>

//       {/* Cards */}
//       <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>

//         <Card className='shadow-lg rounded-2xl bg-gradient-to-r from-pink-500 to-pink-400 text-white hover:scale-105 transition'>
//           <CardHeader>
//             <CardTitle>Total Users</CardTitle>
//           </CardHeader>
//           <CardContent className='text-3xl font-bold'>
//             {stats.totalUsers}
//           </CardContent>
//         </Card>

//         <Card className='shadow-lg rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 text-white hover:scale-105 transition'>
//           <CardHeader>
//             <CardTitle>Total Products</CardTitle>
//           </CardHeader>
//           <CardContent className='text-3xl font-bold'>
//             {stats.totalProducts}
//           </CardContent>
//         </Card>

//         <Card className='shadow-lg rounded-2xl bg-gradient-to-r from-green-500 to-green-400 text-white hover:scale-105 transition'>
//           <CardHeader>
//             <CardTitle>Total Orders</CardTitle>
//           </CardHeader>
//           <CardContent className='text-3xl font-bold'>
//             {stats.totalOrders}
//           </CardContent>
//         </Card>

//         <Card className='shadow-lg rounded-2xl bg-gradient-to-r from-purple-500 to-purple-400 text-white hover:scale-105 transition'>
//           <CardHeader>
//             <CardTitle>Total Sales</CardTitle>
//           </CardHeader>
//           <CardContent className='text-3xl font-bold'>
//             ₹ {stats.totalSales}
//           </CardContent>
//         </Card>

//       </div>

//       {/* Chart Section */}
//       <Card className='mt-10 shadow-lg rounded-2xl'>
//         <CardHeader>
//           <CardTitle className='text-xl font-semibold'>
//             📈 Sales (Last 30 Days)
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           <div className="w-full h-[350px]"> {/* 👈 FIXED HEIGHT */}
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={stats.salesByDate}>
                
//                 {/* Grid (modern look) */}
//                 <CartesianGrid strokeDasharray="3 3" />

//                 <XAxis dataKey="date" />

//                 <Tooltip 
//                   contentStyle={{ borderRadius: "10px" }}
//                 />

//                 <Area
//                   type="monotone"
//                   dataKey="amount"
//                   stroke="#7c3aed"
//                   fill="#c4b5fd"
//                   strokeWidth={3}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>

//     </div>
//   );
// };

// export default AdminSales;








//// aa correct j hatu but olu responsive banayu 



// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import axios from 'axios';
// import React, { useEffect } from 'react'

// import {
//   AreaChart,
//   Area,
//   XAxis,
//   Tooltip,
//   ResponsiveContainer
// } from "recharts";


// const AdminSales = () => {
//   const [stats, setStats] = React.useState({
//     totalUsers: 0,
//     totalProducts: 0,
//     totalOrders: 0,
//     totalSales: 0,
//     salesByDate: [],
//   })

//   const fetchSales = async () => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");

//       const res = await axios.get(
//         `${import.meta.env.VITE_URL}/api/v1/orders/sales`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`
//           }
//         }
//       );
//       console.log("API Response 👉", res.data);
//       if (res.data.success) {
//         setStats(res.data);  // ✅ direct use
//       }
//     } catch (error) {
//       console.error(error);
//       console.log(error.response?.data);
//     }
//   };


//   useEffect(() => {
//     fetchSales()
//   }, [])

//   return (
//     <div className='pl-[320px] bg-gray-100 min-h-screen py-10 px-6'>

//       {/* Title */}
//       <h1 className='text-3xl font-bold mb-8'>📊 Admin Dashboard</h1>

//       {/* Cards */}
//       <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>

//         {/* Users */}
//         <Card className='shadow-md rounded-2xl bg-gradient-to-r from-pink-500 to-pink-400 text-white'>
//           <CardHeader>
//             <CardTitle>Total Users</CardTitle>
//           </CardHeader>
//           <CardContent className='text-3xl font-bold'>
//             {stats.totalUsers}
//           </CardContent>
//         </Card>

//         {/* Products */}
//         <Card className='shadow-md rounded-2xl bg-gradient-to-r from-blue-500 to-blue-400 text-white'>
//           <CardHeader>
//             <CardTitle>Total Products</CardTitle>
//           </CardHeader>
//           <CardContent className='text-3xl font-bold'>
//             {stats.totalProducts}
//           </CardContent>
//         </Card>

//         {/* Orders */}
//         <Card className='shadow-md rounded-2xl bg-gradient-to-r from-green-500 to-green-400 text-white'>
//           <CardHeader>
//             <CardTitle>Total Orders</CardTitle>
//           </CardHeader>
//           <CardContent className='text-3xl font-bold'>
//             {stats.totalOrders}
//           </CardContent>
//         </Card>

//         {/* Sales */}
//         <Card className='shadow-md rounded-2xl bg-gradient-to-r from-purple-500 to-purple-400 text-white'>
//           <CardHeader>
//             <CardTitle>Total Sales</CardTitle>
//           </CardHeader>
//           <CardContent className='text-3xl font-bold'>
//             ₹ {stats.totalSales}
//           </CardContent>
//         </Card>

//       </div>

//       {/* Extra Section (future chart / table) */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Sales (Last 30 Days)</CardTitle>
//         </CardHeader>

//         <CardContent>
//           <div className="w-full h-[300px]">   {/* 👈 IMPORTANT */}
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={stats.salesByDate}>
//                 <XAxis dataKey="date" />
//                 <Tooltip />
//                 <Area
//                   type="monotone"
//                   dataKey="amount"
//                   stroke="#8884d8"
//                   fill="#8884d8"
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>
//       {/* <Card>
//         <CardHeader>
//           <CardTitle>Sales (Last 30 Days)</CardTitle>
//         </CardHeader>
//         <CardContent className="h-[300px] w-full">
//           <ResponsiveContainer width="100%" height="100%">
//             <AreaChart data={stats.salesByDate}>
//               <XAxis dataKey="date" />
//               <Tooltip />
//               <Area
//                 type="monotone"
//                 dataKey="amount"
//                 stroke="#8884d8"
//                 fill="#8884d8"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </CardContent>
//       </Card> */}
//       {/* <Card>
//         <CardHeader>
//           <CardTitle>Sales (Last 30 Days)</CardTitle>
//         </CardHeader>
//         <CardContent style={{ height: 300 }}>
//           <RespoSiveContainer width="100%" height="100%">
//             <AreaChart data={stats.sales}>
//             <XAxis dataKey="date" />
//             <Tooltip/>
//             <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
//             </AreaChart>
//           </RespoSiveContainer>
//         </CardContent>
//       </Card> */}

//     </div>
//   )
// }

// export default AdminSales;