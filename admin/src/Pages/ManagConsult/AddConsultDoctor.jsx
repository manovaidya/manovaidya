import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "../../services/FetchNodeServices";

const AddConsultDoctor = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [url, setUrl] = useState(''); // Single URL field
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Check if URL is empty
        if (!url.trim()) {
            toast.error("Please add a valid URL.");
            setIsLoading(false);
            return;
        }

        const body = { urls: url }; // Sending the URL in an array as the API expects it

        try {
            const response = await postData("api/url/create-url", body);
            if (response?.status === true) {
                toast.success(response?.message || "URL added successfully!");
                navigate("/all-consult-doctor");
            } else {
                toast.error(response?.message || "Failed to add URL.");
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || "Error adding URL";
            toast.error(errorMessage);
            console.error("Error adding URL:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Doctor Advice</h4>
                </div>
                <div className="links">
                    <Link to="/all-consult-doctor" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <h2>Add Video URL</h2>
                        <div className="row mb-2">
                            <div className="col-md-10">
                                <input
                                    type="url"
                                    className="form-control"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="Enter URL"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12 mt-3">
                        <button type="submit" className="btn btn-success" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Add Doctor Advice"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddConsultDoctor;
