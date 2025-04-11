import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import { getData, postData, serverURL } from "../../services/FetchNodeServices";
import { formatDate } from "../../constant";

const EditBlog = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const editor = useRef(null); // Reference for Jodit Editor
    const navigate = useNavigate();
    const [previewImage, setPreviewImage] = useState(''); // Image preview state
    const [formData, setFormData] = useState({ name: "", blogTitle: '', date: '', blogImage: null, description: "", additionalDetails: "", isActive: false, });

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const response = await getData(`api/blogs/get-blog-by-id/${id}`);
                const blog = response?.blog;
                console.log("blog", blog);
                if (response?.status === true) {
                    setFormData({
                        ...blog,
                        name: blog?.name || '',
                        blogTitle: blog?.blogTitle || '',
                        date: formatDate(blog?.date).split('-').reverse().join('-') || '',
                        description: blog?.description || '',
                        additionalDetails: blog?.additionalDetails || '',
                        isActive: blog?.isActive || false,
                    });
                    setPreviewImage(blog?.blogImage ? `${serverURL}/${blog?.blogImage}` : '');
                }
            } catch (error) {
                console.error("Failed to fetch blog data:", error);
                toast.error("Failed to load blog data");
            }
        };

        fetchBlogData();
    }, [id]);
    console.log("BODY", formData)
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            const file = files[0];
            if (file && file.type.startsWith('image/')) {
                setFormData((prevData) => ({ ...prevData, blogImage: files[0] }));
                setPreviewImage(URL.createObjectURL(file)); // Update preview image
            } else {
                toast.error("Please upload a valid image.");
            }
        } else {
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }
    };

    const handleCheckboxChange = () => {
        setFormData((prevData) => ({
            ...prevData,
            isActive: !prevData.isActive,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simple validation before submitting form
        if (!formData.name || !formData.blogTitle || !formData.date || !formData.description) {
            toast.error("Please fill out all the required fields.");
            setIsLoading(false);
            return;
        }

        const uploadData = new FormData();
        uploadData.append("name", formData.name);
        uploadData.append("blogTitle", formData.blogTitle);
        uploadData.append("date", formData.date);
        uploadData.append("blogImage", formData.blogImage);
        uploadData.append("description", formData.description);
        uploadData.append("additionalDetails", formData.additionalDetails);
        uploadData.append("isActive", formData.isActive.toString());

        try {
            const response = await postData(`api/blogs/update-Blog/${id}`, uploadData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.status === true) {
                toast.success(response.message);
                navigate("/all-blogs");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating Blog");
            console.error("Error updating Blog:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head"><h4>Edit Blog</h4></div>
                <div className="links">
                    <Link to="/all-blogs" className="add-new">
                        Back <i className="fa-regular fa-circle-left"></i>
                    </Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    {/* Blog title */}
                    <div className="col-md-3">
                        <label htmlFor="blogTitle" className="form-label">Blog Title</label>
                        <input type="text" name="blogTitle" className="form-control" id="blogTitle" value={formData.blogTitle} onChange={handleChange} required />
                    </div>

                    {/* Blog Name */}
                    <div className="col-md-3">
                        <label htmlFor="name" className="form-label">Blog Heading</label>
                        <input type="text" name="name" className="form-control" id="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    {/* Blog Image */}
                    <div className="col-md-3">
                        <label htmlFor="blogImage" className="form-label">Blog Image</label>
                        <input type="file" name="blogImage" className="form-control" id="blogImage" accept="image/*" onChange={handleChange} />
                        {/* Display preview if an image is selected */}
                        {previewImage && <img src={previewImage} alt="Preview" className="mt-2" width="100" />}
                    </div>

                    {/* Blog Date */}
                    <div className="col-md-3">
                        <label htmlFor="date" className="form-label">
                            Blog Date
                        </label>
                        <input type="date" name="date" className="form-control" id="date" value={formData?.date} onChange={handleChange} required />
                    </div>

                    {/* Description with Jodit Editor */}
                    <div className="col-md-12">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <JoditEditor ref={editor} value={formData.description} onChange={(newContent) => setFormData((prevData) => ({ ...prevData, description: newContent }))}
                        />
                    </div>
                    {/* Checkbox */}
                    <div className="col-12">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" name="isActive" id="BlogActive" checked={formData.isActive} onChange={handleCheckboxChange} />
                            <label className="form-check-label" htmlFor="BlogActive">
                                Active on Homepage
                            </label>
                        </div>
                    </div>

                    <hr />

                    {/* Submit Button */}
                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? "not-allowed" : "allowed"}`}                        >
                            {isLoading ? "Please Wait..." : "Update Blog"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditBlog;
