import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, postData } from "../../services/FetchNodeServices";

const EditConsultDoctor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [url, setUrl] = useState(''); // Changed to use singular 'url' for state consistency
    const [btnLoading, setBtnLoading] = useState(false);

    useEffect(() => {
        const fetchUrl = async () => { // Renamed function for better clarity
            try {
                const response = await getData(`api/url/get-url-by-id/${id}`);
                console.log("response", response)
                if (response?.status === true) {
                    setUrl(response?.consultation?.urls); // Populate the form with the URL data
                }
            } catch (error) {
                toast.error("Error fetching consultation data");
                console.error("Error fetching consultation:", error);
            }
        };
        fetchUrl();
    }, [id]);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setBtnLoading(true);

        const body = { urls: url }; // Use 'url' as the state variable

        try {
            const response = await postData(`api/url/update-url/${id}`, body);
            if (response?.status === true) {
                toast.success(response.message);
                navigate("/all-consult-doctor");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating consultation");
            console.error("Error updating consultation:", error);
        } finally {
            setBtnLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Doctor Advice</h4>
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
                        <h2>Edit Video URL</h2>
                        <div className="row mb-2">
                            <div className="col-md-10">
                                <input
                                    type="url"
                                    className="form-control"
                                    value={url} // Corrected state variable name to 'url'
                                    onChange={(e) => setUrl(e.target.value)} // Corrected state update
                                    placeholder="Enter URL"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12 mt-3">
                        <button type="submit" className="btn btn-success" disabled={btnLoading}>
                            {btnLoading ? "Saving..." : "Update Doctor Advice"} {/* Corrected loading state */}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditConsultDoctor;
