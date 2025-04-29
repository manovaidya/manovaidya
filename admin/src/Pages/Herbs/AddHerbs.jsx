import axios from "axios";
import JoditEditor from "jodit-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, postData } from "../../services/FetchNodeServices.js";

const AddHerbs = () => {
    const [herbs, setHerbs] = useState([{ image: null, name: "", content: "",}]);
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState([]);
    // const [productList, setProductList] = useState([]);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    // Fetch Product Data
    // const fetchProductData = async () => {
    //     const data = await getData(`api/products/all-product`);
    //     console.log("HHHHHHHH", data)
    //     if (data?.success === true) {
    //         setProductList(data?.products);
    //     }
    // };

    // useEffect(() => {
    //     fetchProductData();
    // }, []);

    // Handle Input Change for Herbs
    const handleInputChange = (index, field, value) => {
        const newHerbs = [...herbs];
        newHerbs[index][field] = value;
        setHerbs(newHerbs);
    };

    // Handle Jodit Editor change
    const handleJoditChange = (newValue, index) => {
        const newHerbs = [...herbs];
        newHerbs[index].content = newValue;
        setHerbs(newHerbs);
    };

    // Handle Image Upload
    const handleImageUpload = (index, event) => {
        const file = event.target.files[0];
        const newHerbs = [...herbs];
        newHerbs[index].image = file;
        setHerbs(newHerbs);
    };

    // Add More Herb Fields
    const addHerbField = () => {
        setHerbs([...herbs, { image: null, name: "", content: ""}]);
    };

    // Delete Herb Field
    const deleteHerbField = (index) => {
        const newHerbs = herbs.filter((_, i) => i !== index);
        setHerbs(newHerbs);
    };

    // Handle Form Submit
    const handleHerbSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Ensure that we have between 3 and 8 images
        if (!images) {
            alert("Please select  1  images before submitting.");
            setIsLoading(false);
            return;
        }

        const form = new FormData();
        // Append herbs data and images to the form
        herbs.forEach((herb, index) => {
            form.append("herbs", JSON.stringify(herb)); // Send herb as a JSON string

            if (herb.image) {
                form.append(`herbsImage[${index}]`, herb.image);
            }
        });

        try {
            const response = await postData("api/herbs/create-herbs", form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response?.status === true) {
                toast.success("Herbs added successfully!");
                navigate("/All-Herbs-For-Natural");
            } else {
                toast.error("Failed to add herbs. Please try again.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error occurred while adding the product.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Herbs</h4>
                </div>
                <div className="links">
                    <Link to="/All-Herbs-For-Natural" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="d-form">
                <div className="mt-4">
                    <h4>Herbs For Natural</h4>
                    <form className="row g-3 mt-2" onSubmit={handleHerbSubmit}>
                        {herbs?.map((herb, index) => (
                            <div className="row mb-2" key={index}>
                                {/* Image Input */}
                                <div className="col-md-4">
                                    <label className="form-label">Image</label>
                                    <input
                                        className="form-control"
                                        type="file"
                                        name="herbsImage"
                                        onChange={(e) => handleImageUpload(index, e)}
                                    />
                                </div>

                                {/* Name Input */}
                                <div className="col-md-4">
                                    <label className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={herb.name}
                                        onChange={(e) => handleInputChange(index, "name", e.target.value)}
                                    />
                                </div>

                                {/* Product Selection */}
                                {/* <div className="col-md-4">
                                    <label className="form-label">Select Product</label>
                                    <select
                                        name="product"
                                        className="form-control"
                                        value={herb?.productId}
                                        onChange={(e) => handleInputChange(index, "productId", e.target.value)}
                                    >
                                        <option value="">Select Product</option>
                                        {productList?.map((product, idx) => (
                                            <option key={idx} value={product?._id}>{product?.productName}</option>
                                        ))}
                                    </select>
                                </div> */}

                                {/* Jodit Editor for Description */}
                                <div className="col-md-12">
                                    <label className="form-label">For Information</label>
                                    <JoditEditor
                                        value={herb.content}
                                        onChange={(newContent) => handleJoditChange(newContent, index)}
                                    />
                                </div>

                                {/* Delete Button */}
                                <div className="col-md-2 mt-2">
                                    {index > 0 && (
                                        <button type="button" className="btn btn-danger" onClick={() => deleteHerbField(index)}>
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Add More & Submit Buttons */}
                        <div className="col-md-12 mt-3">
                            <button type="button" className="btn btn-primary me-2" onClick={addHerbField}>
                                Add More
                            </button>
                            <button type="submit" className="btn btn-success" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Add Herbs"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddHerbs;
