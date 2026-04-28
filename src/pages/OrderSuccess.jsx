import { CheckCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderSuccess = () => {
    const navigate = useNavigate();

    // ✅ Redux mathi user levu
    const { user } = useSelector((state) => state.user);

    // ✅ fallback (jo redux empty hoy to)
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // ✅ final userId
    const userId = user?._id || storedUser?._id;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 via-emerald-500 to-blue-500 px-4">

            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center">

                {/* Icon */}
                <div className="flex justify-center">
                    <div className="bg-green-100 p-4 rounded-full">
                        <CheckCircle className="h-16 w-16 sm:h-20 sm:w-20 text-green-500" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-bold mt-5 text-gray-800">
                    Payment Successful 🎉🎉
                </h1>

                {/* Message */}
                <p className="text-gray-600 mt-3 text-sm sm:text-base leading-relaxed">
                    Thank you for your purchase! Your order has been placed successfully.
                    You can view your order details in your profile anytime.
                </p>

                {/* Buttons */}
                <div className="mt-6 flex flex-col gap-3">

                    {/* Continue Shopping */}
                    <button
                        onClick={() => navigate("/")}
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
                    >
                        Continue Shopping
                    </button>

                    {/* View Profile */}
                    <button
                        onClick={() => {
                            if (userId) {
                                navigate(`/profile/${userId}`);
                            } else {
                                alert("User not found. Please login again.");
                            }
                        }}
                        className="w-full border-2 border-pink-500 text-pink-600 py-3 rounded-xl font-semibold hover:bg-pink-50 transition-all duration-300 disabled:opacity-50"
                        disabled={!userId}
                    >
                        View Profile
                    </button>

                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;