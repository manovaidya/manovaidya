"use client";

import React, { useState } from "react";
import "./login.css";
import Link from "next/link";
import { useRouter } from "next/navigation"; // To navigate to other pages
import { postData } from "@/app/services/FetchNodeServices";
import { toast, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/user-slice"

const page = () => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // Error handling state
  const router = useRouter(); // Use Next.js router for navigation

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form default behavior
    if (!formData.email || !formData.password) {
      setError("Please fill in both email and password.");
      return;
    }

    const payload = {
      email: formData.email,
      password: formData.password,
    };

    try {
      const response = await postData("api/users/user-login", payload);
      console.log("Login response:", response);
      if (response?.status === true) {
        localStorage.setItem("token", response?.token);
        localStorage.setItem("User_data", JSON.stringify(response?.user));
        dispatch(login(response?.user))
        router.push("/");
        toast.success("Login successful!");
      } else {
        toast.error(response?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="login-section">
        <div className="container" style={{ width: "70%" }}>
          <h2 className="login-title">Log In</h2>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="row">
              {/* Email / Mobile Input */}
              <div className="col-md-6 form-group">
                <label htmlFor="email">Enter Your Email / Mobile No.</label>
                <input
                  type="text"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="form-control"
                  placeholder="Enter your email / mobile no."
                  required
                />
              </div>

              {/* Password Input */}
              <div className="col-md-6 form-group">
                <label htmlFor="password">Enter Your Password</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="form-control"
                  placeholder="Enter your password"
                  required
                />
                <Link href="/Pages/forgetpassword" className="forgot-password">
                  Forgot Password?
                </Link>
              </div>

              {/* Error Message */}
              {error && (
                <div className="col-md-12 text-center text-danger">{error}</div>
              )}

              {/* Login and Register Buttons */}
              <div
                className="col-md-12 buttons-container"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button type="submit" className="login-button">
                  Login
                </button>
                <Link href="/Pages/register" type="button" className="register-button">
                  Register
                </Link>
              </div>

              {/* Social Login */}
              {/* <div className="col-md-12 social-login">
                <p>Or Login With</p>
                <div className="social-buttons">
                  <button type="button" className="google-button">
                    <i className="bi bi-google"></i> Google
                  </button>
                  <button type="button" className="facebook-button">
                    <i className="bi bi-facebook"></i> Facebook
                  </button>
                </div>
              </div> */}
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default page;
