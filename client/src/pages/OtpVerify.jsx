import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.value;
    // Allow only numeric values and limit to 6 characters
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtp(value);
    }
  };

  const handleSubmit = () => {
    if (otp) {
      
     
        navigate("/VotingPage"); 
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate">
      <h1 className="text-2xl font-semibold mb-4">Enter OTP</h1>
      <p className="text-white-600 mb-4">
        Please enter the 6-digit OTP sent to your phone.
      </p>
      <Input
        type="text"
        value={otp}
        onChange={handleChange}
        placeholder="Enter OTP"
        className="w-1/3 border border-gray-300 rounded-md px-4 py-2 text-center text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit OTP
      </button>
    </div>
  );
}
