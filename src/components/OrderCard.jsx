import React from 'react'
import { Button } from './ui/button'
import { Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { API_BASE_URL } from "@/config/api"

export const OrderCard = ({ userOrder = [] }) => {
    const navigate = useNavigate()
    if (!userOrder) {
        return <p className="text-xl">Loading...</p>
    }
    return (
         <div className="md:pl-[200px] px-4 sm:px-6 py-6 min-h-screen ">

            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft />
                </Button>
                <h1 className="text-3xl font-bold">My Orders</h1>
            </div>

            {/* Empty State */}
            {userOrder.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-2xl font-semibold text-gray-600">
                        No orders found 🛒
                    </p>
                </div>
            ) : (
                <div className="space-y-8">
                    {userOrder.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white shadow-md rounded-2xl p-6 border hover:shadow-lg transition"
                        >
                            {/* Top Section */}
                            <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                                <div>
                                    <p className="text-sm text-gray-500">Order ID</p>
                                    <p className="font-semibold">{order._id}</p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total Amount</p>
                                    <p className="text-lg font-bold text-blue-600">
                                        ₹{Number(order.amount || 0).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
                                <div>
                                    <p className="font-medium">
                                        {order.user?.firstName || "Unknown"}{" "}
                                        {order.user?.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {order.user?.email || "N/A"}
                                    </p>
                                </div>

                                {/* Status Badge */}
                                <span
                                    className={`px-4 py-1 text-sm rounded-full font-medium ${order.status === "Paid"
                                            ? "bg-green-100 text-green-700"
                                            : order.status === "Failed"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {order.status}
                                </span>
                            </div>

                            {/* Products */}
                            <div>
                                <h3 className="font-semibold mb-3">Products</h3>

                                <div className="space-y-3">
                                    {order.products?.map((product, index) => {
                                        const url =
                                            product.productId?.productImg?.[0]?.url;

                                        const imageUrl = url
                                            ? url.startsWith("http")
                                                ? url
                                                : `${API_BASE_URL}${url}`
                                            : "/placeholder.png";

                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center gap-4 border rounded-xl p-3 hover:bg-gray-50 transition"
                                            >
                                                {/* Image */}
                                                <img
                                                    onClick={() =>
                                                        navigate(`/products/${product.productId._id}`)
                                                    }
                                                    src={imageUrl}
                                                    alt="product"
                                                    className="w-20 h-20 object-cover rounded-lg border cursor-pointer"
                                                />

                                                {/* Info */}
                                                <div className="flex-1">
                                                    <p className="font-medium line-clamp-1">
                                                        {product.productId?.productName || "No Name"}
                                                    </p>

                                                    <p className="text-sm text-gray-500">
                                                        ID: {product?.productId?._id}
                                                    </p>
                                                </div>

                                                {/* Price */}
                                                <div className="text-right">
                                                    <p className="font-semibold">
                                                        ₹{product?.productId?.productPrice}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Qty: {product.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
