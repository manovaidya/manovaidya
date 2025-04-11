'use client';

import { postData } from "@/app/services/FetchNodeServices";
import React, { use, useState } from "react";
import "./reset-password.css";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from 'next/navigation';

const ResetPassword = ({ params }) => {
    const { id } = use(params);
    const router = useRouter();
    const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        const { password, confirmPassword } = formData;
        if (!password || !confirmPassword) {
            // setError("Both password fields are required.");
            toast.error("Both password fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            // setError("Passwords do not match.");
            toast.error("Passwords do not match.");
            return;
        }
        if (password.length < 4) {
            toast.error("Password must be at least 4 characters long.");
            // setError("Password must be at least 4 characters long.");
            return;
        }

        try {
            const response = await postData("api/users/reset-password", { token: id, new_password: password });
            if (response.status === true) {
                setSuccess(true);
                toast.success(response.message || "User password changed successfully");
                router.push("/Pages/Login");
                // window.location.href = '/Pages/Login';
            } else {
                setError("Failed to reset password. Please try again.");
                toast.error(response.message || "Failed to reset password. Please try again.");
            }
        } catch (err) {
            setError("Failed to reset password. Please try again.");
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="reset-password-container">
            <ToastContainer />
            <form onSubmit={handleResetPassword} className="reset-password-form">
                <h2>Reset Your Password</h2>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">Password reset successfully. You can now log in with your new password.</p>}

                <div className="input-field password-field">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        placeholder="Enter your new password"
                    />
                    <label>Enter your New Password</label>
                    <button
                        type="button"
                        className="eye-icon"
                        onClick={togglePasswordVisibility}
                    >
                        {passwordVisible ? "🙈" : "👁️"}
                    </button>
                </div>

                <div className="input-field password-field">
                    <input
                        type={passwordVisible ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                        placeholder="Confirm your password"
                    />
                    <label>Confirm your Password</label>
                    <button
                        type="button"
                        className="eye-icon"
                        onClick={togglePasswordVisibility}
                    >
                        {passwordVisible ? "🙈" : "👁️"}
                    </button>
                </div>

                <div className="reset-password-btn">
                    <button type="submit" className="reset-password-button">Reset Password</button>
                </div>

                <div className="login-redirect">
                    <p>Remembered your password? <Link href="/login">Log In</Link></p>
                </div>
            </form>
        </div>
    );
};

export default ResetPassword;
