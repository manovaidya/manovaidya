'use client';

import React, { useState } from "react";
import "./newslater.css";
import { postData } from "@/app/services/FetchNodeServices";
import { toast, ToastContainer } from "react-toastify";
import { HiOutlineMail } from "react-icons/hi";
import { FaPhone } from "react-icons/fa6";
import { FaRegUserCircle } from "react-icons/fa";
const Page = () => {
  // State to store form input values
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Validate email format
  const isValidEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  // Validate phone number format (assuming a 10-digit phone number)
  const isValidPhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !phone || !name) {
      toast.error("All fields are required.");
      return;
    }

    // Email validation
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Phone validation
    if (!isValidPhone(phone)) {
      toast.error("Please enter a valid phone number (10 digits).");
      return;
    }

    // Name length check
    if (name.length < 3) {
      toast.error("Please enter a valid name with at least 3 characters.");
      return;
    }

    // Prepare the payload
    const payload = { email, phone, name };

    try {
      const response = await postData("api/newsletter/create-newsletter", payload);

      if (response.success === true) {
        // Handle success
        toast.success("Subscription successful!");
        setEmail(""); // Reset form fields
        setPhone("");
        setName("");
      } else {
        toast.error(response?.error || "Something went wrong, please try again.");
      }
    } catch (error) {
      toast.error("Failed to submit the form. Please try again later.");
    }
  };

  return (
    <>
      <ToastContainer />
      <section className="newslater">
        <div className="container">
          <div className="newslater-form">
            <h2>MANOVAIDYA</h2>
            <p>
              Sign up to our newsletter - the place for wild news, invitations
              and good karma treats!
            </p>
            <form onSubmit={handleSubmit}>
              {/* Email input */}
              <div className="newslater-input-field" style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <HiOutlineMail style={{ position: "absolute", left: "10px", fontSize: "20px", color: "#888", }} />
                  <input type="email" required className="form-control" placeholder="Enter Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={{ paddingLeft: "40px", width: "100%", }} />
                </div>
              </div>

              {/* Mobile number input */}
              <div className="newslater-input-field" style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <FaPhone style={{ position: "absolute", left: "10px", fontSize: "20px", color: "#888", }} />
                  <input type="tel" className="form-control" placeholder="Enter Mobile Number" value={phone} style={{ paddingLeft: "40px", width: "100%", }} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>

              {/* Name input */}
              <div className="newslater-input-field" style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <FaRegUserCircle style={{ position: "absolute", left: "10px", fontSize: "20px", color: "#888", }} />
                  <input type="text" className="form-control" placeholder="Enter Your Name" value={name} style={{ paddingLeft: "40px", width: "100%", }} onChange={(e) => setName(e.target.value)} />
                </div>
              </div>

              {/* Submit button */}
              <div className="text-center">
                <button type="submit" className="signup-btn">
                  SIGN UP
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
