"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./forgot-password.css";
import { postData } from "@/app/services/FetchNodeServices";
import { toast, ToastContainer } from "react-toastify";

const Page = () => {
  const router = useRouter(); // Correct usage of the Next.js Router hook
  const [email, setEmail] = useState(""); // State for email/mobile input
  const [btn, setBtn] = useState(false);

  // Handle "Send OTP" button click
  const handleSendOtp = async (e) => {
    if (email.trim() === "") {
      toast.error("Please enter your email!");
      return;
    }

    setBtn(true);
    const response = await postData(`api/users/send-reset-password-email`, { email });

    if (response.status === true) {
      toast.success(response?.message);
      setBtn(false);
    } else {
      toast.error(response?.message || "Error sending reset link!");
      setBtn(false);
    }
  };

  return (
    <section className="forgot-password-section">
      <div className="container">
        <h2 className="forgot-password-title">Forgot Password</h2>
        <p className="forgot-password-description">
          Enter your registered email or mobile number, and we’ll send you a
          reset link or OTP.
        </p>
        <form className="forgot-password-form">
          <div className="row">
            <>
              {/* Email / Mobile Input */}
              <div className="col-md-12 form-group">
                <label htmlFor="email">Enter Your Email / Mobile No.</label>
                <input
                  type="text"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email / mobile no."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Send OTP Button */}
              <div className="col-md-12 buttons-container">
                <button
                  type="button"
                  disabled={btn}
                  className="send-reset-button"
                  onClick={handleSendOtp}
                >
                  {btn ? "Sending..." : "Send Reset Link / OTP"}
                </button>
              </div>
            </>


            {/* Back to Login Link */}
            <div className="col-md-12 back-to-login">
              <p>
                Remembered your password?{" "}
                <a href="/Pages/Login" className="login-link">
                  Back to Login
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Page;
