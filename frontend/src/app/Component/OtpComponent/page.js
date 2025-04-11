"use client";

import { postData } from "@/app/services/FetchNodeServices";
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

// Helper function to handle OTP input changes
const OTPInput = ({ length, otp, onChange }) => {

  // Handle input change
  const handleChange = (e, index) => {
    const value = e.target.value;

    // Only allow numbers and ensure the value is 1 character
    if (value.match(/^\d$/)) {
      otp[index] = value;
      onChange([...otp]);

      // Automatically focus next input after entering a value
      if (index < length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    } else if (value === "") {
      // Clear the box if it's invalid or empty
      otp[index] = "";
      onChange([...otp]);
    }
  };

  // Handle backspace to move to the previous field
  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-input-${index - 1}`).focus();
      }
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
      {otp.map((digit, index) => (
        <input
          key={index}
          id={`otp-input-${index}`}
          type="text"
          value={digit}
          maxLength="1"
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleBackspace(e, index)}
          style={{
            width: "40px",
            height: "40px",
            textAlign: "center",
            fontSize: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            cursor: "pointer", // Indicate that the input is clickable
          }}
        />
      ))}
    </div>
  );
};

const OtpComponent = ({ handleSubmit, formData, title, setOtpForm }) => {
  const [otp, setOtp] = useState(Array(6).fill("")); // OTP with 6 fields
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter()

  // Handle OTP verification (simulated)
  const handleVerifyOTP = async () => {
    const otpStr = otp.join(""); // Join the OTP array to make it a string
    if (otpStr.length === 6) {
      const body = { ...formData, otp: otpStr }
      const response = await postData(`api/users/verify-otp-for-user-signup`, body)
      console.log("response response:=", response)
      if (response.status === true) {
        toast.success(response?.message)

        router.push("/Pages/Login")
        setOtpForm(false)

      } else {
        toast.error(response?.message);
      }
    }
  };

  // Move back to the first incorrect OTP field
  useEffect(() => {
    if (error) {
      for (let i = otp.length - 1; i >= 0; i--) {
        if (otp[i] === "") {
          document.getElementById(`otp-input-${i}`).focus();
          break;
        }
      }
    }
  }, [error, otp]);

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Enter OTP</h2>
      <p style={{ textAlign: "center" }}> Please enter the OTP sent to your email address</p>
      <OTPInput length={6} otp={otp} onChange={setOtp} />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          onClick={handleVerifyOTP}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginBottom: "10px",
          }}
        >
          Verify OTP
        </button>
      
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        {isVerified && <p style={{ color: "green", textAlign: "center" }}>OTP Verified!</p>}
        {!isVerified && !error && (
          <div style={{ marginTop: "10px", textAlign: "center" }}>
            <button
              onClick={handleSubmit}
              style={{
                padding: "8px 15px",
                fontSize: "14px",
                cursor: "pointer",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Resend OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpComponent;
