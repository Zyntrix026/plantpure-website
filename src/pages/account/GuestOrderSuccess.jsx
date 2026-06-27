import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const GuestOrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 max-w-md w-full text-center space-y-5">
        <CheckCircle className="text-green-500 mx-auto" size={56} />
        <h1 className="text-2xl font-black text-primary">Order Confirmed!</h1>
        {orderNumber && (
          <p className="text-sm text-gray-500">
            Order Number: <span className="font-bold text-gray-800">{orderNumber}</span>
          </p>
        )}
        <p className="text-sm text-gray-500">
          A confirmation email has been sent to your email address. Thank you for shopping with us!
        </p>
        <Link to="/" className="block w-full bg-primary text-white py-3 rounded-xl font-bold text-sm">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default GuestOrderSuccess;
