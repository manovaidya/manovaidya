import axios from "axios";
import JoditEditor from "jodit-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, postData } from "../../services/FetchNodeServices.js";

const EditHerbs = () => {
    const [herbs, setHerbs] = useState({ image: null, name: "", content: "", });
    const [isLoading, setIsLoading] = useState(false);
    // const [productList, setProductList] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch Product Data
    // const fetchProductData = async () => {
    //     const data = await getData("api/products/all-product");
    //     if (data?.success) {
    //         setProductList(data?.products);
    //     }
    // };

    // Fetch Herbs data for Editing
    const fetchHerbs = async () => {
        const data = await getData(`api/herbs/get-herbs-by-id/${id}`);
        if (data?.success) {
            setHerbs({
                ...data.herb,
                content: data?.herb?.content,
                productId: data?.herb?.productId,
                name: data?.herb?.name,
                image: data?.herb?.images[0] || null
            });
        }
    };

    useEffect(() => {
        // fetchProductData();
        fetchHerbs();
    }, [id]);

    // Handle Input Change for Herbs
    const handleInputChange = (field, value) => {
        setHerbs((prevHerbs) => ({ ...prevHerbs, [field]: value }));
    };

    // Handle Jodit Editor change
    const handleJoditChange = (newValue) => {
        setHerbs((prevHerbs) => ({ ...prevHerbs, content: newValue }));
    };

    // Handle Image Upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setHerbs((prevHerbs) => ({ ...prevHerbs, image: file }));
    };

    // Handle Form Submit
    const handleHerbSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!herbs.content) {
            alert("Please select description before submitting.");
            setIsLoading(false);
            return;
        } else if (!herbs.name) {
            alert("Please enter a name before submitting.");
            setIsLoading(false);
            return;
        }

        if (!herbs.image) {

            try {
                const response = await postData(`api/herbs/update-herbs-without-image/${id}`, herbs);
                if (response?.status === true) {
                    toast.success("Herbs updated successfully!");
                    navigate("/All-Herbs-For-Natural");
                } else {
                    toast.error("Failed to update herbs. Please try again.");
                }
            } catch (error) {
                console.error(error);
                toast.error("Error occurred while updating the herbs.");
            } finally {
                setIsLoading(false);
            }
        } else {
            const form = new FormData();
            form.append("herbs", JSON.stringify(herbs)); // Send herb as a JSON string
            if (herbs.image) {
                form.append("herbsImage", herbs.image);
            }

            try {
                const response = await postData(`api/herbs/update-herbs/${id}`, form);
                if (response?.status === true) {
                    toast.success("Herbs updated successfully!");
                    navigate("/All-Herbs-For-Natural");
                } else {
                    toast.error("Failed to update herbs. Please try again.");
                }
            } catch (error) {
                console.error(error);
                toast.error("Error occurred while updating the herbs.");
            } finally {
                setIsLoading(false);
            }
        }

    };

    console.log("XXXXXXXXX", herbs);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Herbs</h4>
                </div>
                <div className="links">
                    <Link to="/All-Herbs-For-Natural" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="d-form">
                <div className="mt-4">
                    <h4>Edit Herbs For Natural</h4>
                    <form className="row g-3 mt-2" onSubmit={handleHerbSubmit}>
                        <div className="row mb-2">
                            <div className="col-md-4">
                                <label className="form-label">Image</label>
                                <input
                                    className="form-control"
                                    type="file"
                                    name="herbsImage"
                                    onChange={(e) => handleImageUpload(e)}
                                />
                            </div>

                            <div className="col-md-4">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={herbs.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                />
                            </div>

                            {/* <div className="col-md-4">
                                <label className="form-label">Select Product</label>
                                <select
                                    name="product"
                                    className="form-control"
                                    value={herbs.productId}
                                    onChange={(e) => handleInputChange("productId", e.target.value)}
                                >
                                    <option value="">Select Product</option>
                                    {productList?.map((product, idx) => (
                                        <option key={idx} value={product?._id}>{product?.productName}</option>
                                    ))}
                                </select>
                            </div> */}

                            <div className="col-md-12">
                                <label className="form-label">For Information</label>
                                <JoditEditor
                                    value={herbs.content}
                                    onChange={handleJoditChange}
                                />
                            </div>
                        </div>

                        <div className="col-md-12 mt-3">
                            <button type="submit" className="btn btn-success" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Edit Herbs"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default EditHerbs;
