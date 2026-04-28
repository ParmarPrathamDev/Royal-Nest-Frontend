import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Crown, Edit, Eye, Search, ShieldCheck, User } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const getAllUser = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/user/all-user`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (error) {
      console.log("GET USERS ERROR:", error);
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.toLowerCase();
      const email = (user?.email || "").toLowerCase();
      const search = searchTerm.toLowerCase();

      return fullName.includes(search) || email.includes(search);
    });
  }, [users, searchTerm]);

  return (
    <div className="bg-gray-100 min-h-screen py-6 px-4 sm:px-5 md:px-6 md:pl-[320px] w-full">
      {/* HEADER */}
      <div className="mb-5">
        <h1 className="font-bold text-2xl sm:text-3xl text-gray-800">
          User Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          View users and check only that particular user's orders
        </p>
      </div>

      {/* SEARCH */}
      <div className="relative w-full sm:w-[320px] mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <Input
          className="pl-10 bg-white h-11"
          placeholder="Search user by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* USERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredUsers.map((user) => {
          const isAdmin =
            user?.role === "admin" ||
            user?.isAdmin === true ||
            user?.userRole === "admin";

          return (
            <div
              key={user?._id}
              className={`rounded-2xl p-4 sm:p-5 shadow-sm transition border hover:shadow-md bg-white ${
                isAdmin
                  ? "border-pink-300 ring-1 ring-pink-200"
                  : "border-gray-200"
              }`}
            >
              <div className="flex flex-col gap-4">
                {/* TOP */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                        isAdmin
                          ? "bg-pink-100 text-pink-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {isAdmin ? <Crown size={22} /> : <User size={22} />}
                    </div>

                    <div className="min-w-0">
                      <h2 className="font-semibold text-base sm:text-lg text-gray-800 truncate">
                        {user?.firstName} {user?.lastName}
                      </h2>
                      <p className="text-sm text-gray-500 break-all">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  {isAdmin && (
                    <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-pink-100 text-pink-700 px-3 py-1 text-xs font-semibold">
                      <ShieldCheck size={14} />
                      Admin
                    </span>
                  )}
                </div>

                {/* ROLE LINE */}
                <div className="flex items-center justify-between text-sm border-t pt-3">
                  <span className="text-gray-500">Account Type</span>
                  <span
                    className={`font-semibold ${
                      isAdmin ? "text-pink-600" : "text-gray-700"
                    }`}
                  >
                    {isAdmin ? "Administrator" : "User"}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  {/* <Button
                    onClick={() => navigate(`/dashboard/users/${user?._id}`)}
                    size="sm"
                    variant="outline"
                    className="w-full sm:flex-1"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Button> */}

                  {/* Only normal user mate order button */}
                  {!isAdmin && (
                    <Button
                      size="sm"
                      onClick={() =>
                        navigate(`/dashboard/users/orders/${user?._id}`)
                      }
                      className="w-full sm:flex-1"
                    >
                      <Eye size={16} className="mr-1" />
                      View Orders
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {filteredUsers.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm border border-gray-200 mt-6">
          No users found.
        </div>
      )}
    </div>
  );
};






// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import axios from "axios";
// import { Crown, Edit, Eye, Search, ShieldCheck, User } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   const getAllUser = async () => {
//     const accessToken = localStorage.getItem("accessToken");

//     try {
//       const res = await axios.get(
//         "http://localhost:8000/api/v1/user/all-user",
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );

//       if (res.data.success) {
//         setUsers(res.data.users);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const filteredUsers = users.filter((user) =>
//     `${user.firstName} ${user.lastName}`
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   useEffect(() => {
//     getAllUser();
//   }, []);

//   return (
//     <div className="bg-gray-100 min-h-screen py-6 px-4 md:pl-[320px] w-full">
//       {/* HEADER */}
//       <div className="mb-4">
//         <h1 className="font-bold text-2xl">User Management</h1>
//         <p className="text-gray-500 text-sm">
//           View and manage registered users
//         </p>
//       </div>

//       {/* SEARCH */}
//       <div className="relative w-full md:w-[300px] mb-6">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
//         <Input
//           className="pl-10 bg-white"
//           placeholder="Search User"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* USERS GRID */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//         {filteredUsers.map((user) => {
//           const isAdmin =
//             user?.role === "admin" ||
//             user?.isAdmin === true ||
//             user?.userRole === "admin";

//           return (
//             <div
//               key={user._id}
//               className={`rounded-2xl p-5 shadow transition border hover:shadow-md bg-white ${
//                 isAdmin
//                   ? "border-pink-300 ring-1 ring-pink-200"
//                   : "border-gray-200"
//               }`}
//             >
//               <div className="flex flex-col gap-3">
//                 {/* TOP */}
//                 <div className="flex items-start justify-between gap-3">
//                   <div className="flex items-center gap-3 min-w-0">
//                     <div
//                       className={`w-12 h-12 rounded-full flex items-center justify-center ${
//                         isAdmin
//                           ? "bg-pink-100 text-pink-600"
//                           : "bg-gray-100 text-gray-600"
//                       }`}
//                     >
//                       {isAdmin ? <Crown size={22} /> : <User size={22} />}
//                     </div>

//                     <div className="min-w-0">
//                       <h1 className="font-semibold text-lg text-gray-800 truncate">
//                         {user?.firstName} {user?.lastName}
//                       </h1>
//                       <p className="text-sm text-gray-500 truncate">
//                         {user?.email}
//                       </p>
//                     </div>
//                   </div>

//                   {isAdmin && (
//                     <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-pink-100 text-pink-700 px-3 py-1 text-xs font-semibold">
//                       <ShieldCheck size={14} />
//                       Admin
//                     </span>
//                   )}
//                 </div>

//                 {/* ROLE LINE */}
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-gray-500">Account Type</span>
//                   <span
//                     className={`font-medium ${
//                       isAdmin ? "text-pink-600" : "text-gray-700"
//                     }`}
//                   >
//                     {isAdmin ? "Administrator" : "User"}
//                   </span>
//                 </div>

//                 {/* ACTIONS */}
//                 <div className="flex flex-col sm:flex-row gap-2 mt-2">
//                   <Button
//                     onClick={() => navigate(`/dashboard/users/${user?._id}`)}
//                     size="sm"
//                     variant="outline"
//                     className="w-full sm:w-auto"
//                   >
//                     <Edit size={16} className="mr-1" />
//                     Edit
//                   </Button>

//                   {/* 👇 Only show for normal users */}
//                   {!isAdmin && (
//                     <Button
//                       size="sm"
//                       onClick={() =>
//                         navigate(`/dashboard/users/orders/${user?._id}`)
//                       }
//                       className="w-full sm:w-auto"
//                     >
//                       <Eye size={16} className="mr-1" />
//                       View Orders
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {filteredUsers.length === 0 && (
//         <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm border border-gray-200 mt-4">
//           No users found.
//         </div>
//       )}
//     </div>
//   );
// };


// admin ma thi order na thay aa button nikaliyu 



// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import axios from "axios";
// import { Crown, Edit, Eye, Search, ShieldCheck, User } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const navigate = useNavigate();

//   const getAllUser = async () => {
//     const accessToken = localStorage.getItem("accessToken");

//     try {
//       const res = await axios.get(
//         "http://localhost:8000/api/v1/user/all-user",
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );

//       if (res.data.success) {
//         setUsers(res.data.users);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const filteredUsers = users.filter((user) =>
//     `${user.firstName} ${user.lastName}`
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   useEffect(() => {
//     getAllUser();
//   }, []);

//   return (
//     <div className="bg-gray-100 min-h-screen py-6 px-4 md:pl-[320px] w-full">
//       {/* HEADER */}
//       <div className="mb-4">
//         <h1 className="font-bold text-2xl">User Management</h1>
//         <p className="text-gray-500 text-sm">
//           View and manage registered users
//         </p>
//       </div>

//       {/* SEARCH */}
//       <div className="relative w-full md:w-[300px] mb-6">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
//         <Input
//           className="pl-10 bg-white"
//           placeholder="Search User"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* USERS GRID */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//         {filteredUsers.map((user) => {
//           const isAdmin =
//             user?.role === "admin" ||
//             user?.isAdmin === true ||
//             user?.userRole === "admin";

//           return (
//             <div
//               key={user._id}
//               className={`rounded-2xl p-5 shadow transition border hover:shadow-md bg-white ${
//                 isAdmin
//                   ? "border-pink-300 ring-1 ring-pink-200"
//                   : "border-gray-200"
//               }`}
//             >
//               <div className="flex flex-col gap-3">
//                 {/* TOP */}
//                 <div className="flex items-start justify-between gap-3">
//                   <div className="flex items-center gap-3 min-w-0">
//                     <div
//                       className={`w-12 h-12 rounded-full flex items-center justify-center ${
//                         isAdmin
//                           ? "bg-pink-100 text-pink-600"
//                           : "bg-gray-100 text-gray-600"
//                       }`}
//                     >
//                       {isAdmin ? <Crown size={22} /> : <User size={22} />}
//                     </div>

//                     <div className="min-w-0">
//                       <h1 className="font-semibold text-lg text-gray-800 truncate">
//                         {user?.firstName} {user?.lastName}
//                       </h1>
//                       <p className="text-sm text-gray-500 truncate">
//                         {user?.email}
//                       </p>
//                     </div>
//                   </div>

//                   {isAdmin && (
//                     <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-pink-100 text-pink-700 px-3 py-1 text-xs font-semibold">
//                       <ShieldCheck size={14} />
//                       Admin
//                     </span>
//                   )}
//                 </div>

//                 {/* ROLE LINE */}
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-gray-500">Account Type</span>
//                   <span
//                     className={`font-medium ${
//                       isAdmin ? "text-pink-600" : "text-gray-700"
//                     }`}
//                   >
//                     {isAdmin ? "Administrator" : "User"}
//                   </span>
//                 </div>

//                 {/* ACTIONS */}
//                 <div className="flex flex-col sm:flex-row gap-2 mt-2">
//                   <Button
//                     onClick={() => navigate(`/dashboard/users/${user?._id}`)}
//                     size="sm"
//                     variant="outline"
//                     className="w-full sm:w-auto"
//                   >
//                     <Edit size={16} className="mr-1" />
//                     Edit
//                   </Button>

//                   <Button
//                     size="sm"
//                     onClick={() =>
//                       navigate(`/dashboard/users/orders/${user?._id}`)
//                     }
//                     className="w-full sm:w-auto"
//                   >
//                     <Eye size={16} className="mr-1" />
//                     View Orders
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {filteredUsers.length === 0 && (
//         <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-sm border border-gray-200 mt-4">
//           No users found.
//         </div>
//       )}
//     </div>
//   );
// };  




















// olu problam aavti hati aatle 



// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import axios from "axios";
// import { Edit, Eye, Search } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("")
//   const navigate = useNavigate()



//   const getAllUser = async () => {
//     const accessToken = localStorage.getItem("accessToken");

//     try {
//       const res = await axios.get(
//         "http://localhost:8000/api/v1/user/all-user",
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );

//       if (res.data.success) {
//         setUsers(res.data.users);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const filteredUsers = users.filter(user=>
//     `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase() ) || 
//     user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   useEffect(() => {
//     getAllUser();
//   }, []);

//   return (
//   <div className="bg-gray-100 min-h-screen py-6 px-4 md:pl-[320px] w-full">

//     {/* HEADER */}
//     <div className="mb-4">
//       <h1 className="font-bold text-2xl">User Management</h1>
//       <p className="text-gray-500 text-sm">View and manage registered users</p>
//     </div>

//     {/* SEARCH */}
//     <div className="relative w-full md:w-[300px] mb-6">
//       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
//       <Input
//         className="pl-10 bg-white"
//         placeholder="Search User"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />
//     </div>

//     {/* USERS GRID */}
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

//       {filteredUsers.map((user) => (
//         <div
//           key={user._id}
//           className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
//         >
//           <div className="flex flex-col gap-2">

//             {/* NAME */}
//             <h1 className="font-semibold text-lg text-gray-800 truncate">
//               {user?.firstName} {user?.lastName}
//             </h1>

//             {/* EMAIL */}
//             <p className="text-sm text-gray-500 truncate">
//               {user?.email}
//             </p>

//             {/* ACTIONS */}
//             <div className="flex flex-col sm:flex-row gap-2 mt-4">

//               <Button
//                 onClick={() => navigate(`/dashboard/users/${user?._id}`)}
//                 size="sm"
//                 variant="outline"
//                 className="w-full sm:w-auto"
//               >
//                 <Edit size={16} className="mr-1" />
//                 Edit
//               </Button>

//               <Button
//                 size="sm"
//                 onClick={() => navigate(`/dashboard/users/orders/${user?._id}`)}
//                 className="w-full sm:w-auto"
//               >
//                 <Eye size={16} className="mr-1" />
//                 View Orders
//               </Button>

//             </div>

//           </div>
//         </div>
//       ))}

//     </div>

//   </div>
// );
//   // return (
//   //   <div className="pl-[350px] py-10 pr-20 mx-auto px-4">
//   //     <h1 className="font-bold text-2xl">User Management</h1>
//   //     <p className="text-gray-500">View and manage registered users</p>

//   //     <div className="relative w-[250px] mt-2">
//   //       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
//   //       <Input
//   //         className="pl-10"
//   //         placeholder="Search User"
//   //         value={searchTerm}
//   //         onChange={(e) => setSearchTerm(e.target.value)}
//   //       />
//   //     </div>

//   //     <div className="grid grid-cols-3 gap-7 mt-7">
//   //       {filteredUsers.map((user) => (
//   //         <div
//   //           key={user._id}
//   //           className="bg-pink-100 p-5 rounded-lg shadow-sm"
//   //         >
//   //           <div>
//   //             <h1 className="font-semibold text-lg">
//   //               {user?.firstName} {user?.lastName}
//   //             </h1>
//   //             <p className="text-sm text-gray-700">{user?.email}</p>
//   //             <div className="flex gap-3 mt-4">
//   //               <Button onClick={()=>navigate(`/dashboard/users/${user?._id}`)} size="sm" variant="outline"> 
//   //                 <Edit size={16} className="mr-1" />
//   //                 Edit
//   //               </Button>
//   //               <Button size="sm"
//   //               onClick={()=>navigate(`/dashboard/users/orders/${user?._id}`)}
//   //               >
//   //                 <Eye size={16} className="mr-1" />
//   //                 View Orders
//   //               </Button>
//   //             </div>
//   //           </div>
//   //         </div>
//   //       ))}
//   //     </div>
//   //   </div>
//   // );
// };





// import axios from "axios";
// import React, { useEffect, useState } from "react";

// export const AdminUsers = () => {
//   const [users, setUsers] = useState([]);

//   const getAllUser = async () => {
//     const accessToken = localStorage.getItem("accessToken");
//     try {
//       const res = await axios.get(
//         "http://localhost:8000/api/v1/user/all-user",
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );

//       if (res.data.success) {
//         setUsers(res.data.users);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getAllUser();
//   }, []);

//   return (
//     <div className="pl-[350px] pr-20 py-10 bg-[#9ECAD6] min-h-screen">

//       {/* Page Title */}
//       <h1 className="text-3xl font-bold mb-2 text-gray-800">
//         Users Management
//       </h1>

//       <p className="text-gray-600 mb-8">
//         View and Manage Registered User
//       </p>

//       {/* Card */}
//       <div className="bg-white shadow-lg rounded-xl overflow-hidden">

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full">

//             {/* Table Head */}
//             <thead className="bg-[#F5EFE6] text-gray-600 uppercase text-sm">
//               <tr>
//                 <th className="p-4 text-left">#</th>
//                 <th className="p-4 text-left">Name</th>
//                 <th className="p-4 text-left">Email</th>
//                 <th className="p-4 text-left">Role</th>
//               </tr>
//             </thead>

//             {/* Table Body */}
//             <tbody className="text-gray-700">
//               {users.map((user, index) => (
//                 <tr
//                   key={user._id}
//                   className="border-t hover:bg-gray-100 transition"
//                 >
//                   <td className="p-4">{index + 1}</td>
//                   <td className="p-4 font-medium">{user.lastName}</td>
//                   <td className="p-4">{user.email}</td>

//                   {/* Role Badge */}
//                   <td className="p-4">
//                     <span
//                       className={`px-3 py-1 text-sm rounded-full font-semibold
//                         ${user.role === "admin"
//                           ? "bg-red-100 text-red-600"
//                           : "bg-green-100 text-green-600"
//                         }`}
//                     >
//                       {user.role}
//                     </span>
//                   </td>

//                 </tr>
//               ))}
//             </tbody>

//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };
