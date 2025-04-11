import axios from "axios";
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";
import { postData } from "../../services/FetchNodeServices";

const AddBlog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const editor = useRef(null); // Reference for Jodit Editor
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    blogTitle: '',
    date: '',
    blogImage: null,
    description: "",
    additionalDetails: "",
    isActive: false,  // Set default as boolean
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({ ...prevData, blogImage: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleCheckboxChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      isActive: !prevData.isActive,  // Toggle the boolean value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const uploadData = new FormData();
    uploadData.append("name", formData.name);
    uploadData.append("blogTitle", formData.blogTitle);  // Corrected to `blogTitle`
    uploadData.append("date", formData.date);
    uploadData.append("blogImage", formData.blogImage);
    uploadData.append("description", formData.description);
    uploadData.append("additionalDetails", formData.additionalDetails);
    uploadData.append("isActive", formData.isActive.toString());  // Send as string "true"/"false"

    try {
      const response = await postData("api/blogs/create-Blog", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      });
      if (response.status === true) {
        toast.success(response.message);
        navigate("/all-blogs");
      }
      // Redirect to the Blog list
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding Blog");
      console.error("Error adding Blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  console.log("XXXXXXX", formData)
  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Blog</h4>
        </div>
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
            <label htmlFor="blogTitle" className="form-label">
              Blog Title
            </label>
            <input
              type="text"
              name="blogTitle"  // Corrected to match the state field name
              className="form-control"
              id="blogTitle"
              value={formData.blogTitle}
              onChange={handleChange}
              required
            />
          </div>

          {/* Blog Name */}
          <div className="col-md-3">
            <label htmlFor="name" className="form-label">
              Blog Heading
            </label>
            <input
              type="text"
              name="name"  // Corrected to match the state field name
              className="form-control"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Blog Image */}
          <div className="col-md-3">
            <label htmlFor="blogImage" className="form-label">
              Blog Image
            </label>
            <input
              type="file"
              name="blogImage"
              className="form-control"
              id="blogImage"
              accept="image/*"
              onChange={handleChange}
              required
            />
          </div>

          {/* Blog Date */}
          <div className="col-md-3">
            <label htmlFor="date" className="form-label">
              Blog Date
            </label>
            <input
              type="date"
              name="date"
              className="form-control"
              id="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description with Jodit Editor */}
          <div className="col-md-12">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <JoditEditor
              ref={editor}
              value={formData.description}
              onChange={(newContent) =>
                setFormData((prevData) => ({ ...prevData, description: newContent }))
              }
            />
          </div>

          {/* Additional Details */}
          {/* <div className="col-md-12">
            <label htmlFor="additionalDetails" className="form-label">
              Additional Details
            </label>
            <textarea
              name="additionalDetails"
              className="form-control"
              id="additionalDetails"
              rows="3"
              value={formData.additionalDetails}
              onChange={handleChange}
            />
          </div> */}

          {/* Checkbox */}
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="isActive"
                id="BlogActive"
                checked={formData.isActive}  // Now using boolean directly
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="BlogActive">
                Active on Homepage
              </label>
            </div>
          </div>

          <hr />

          {/* Submit Button */}
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`${isLoading ? "not-allowed" : "allowed"}`}
            >
              {isLoading ? "Please Wait..." : "Add Blog"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddBlog;
