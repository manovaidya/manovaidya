import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "../../services/FetchNodeServices.js";

const AddBanner = () => {
  const [formData, setFormData] = useState({
    bannerName: "",
    bannerType: "",
    bannerStatus: false,
  });

  const [banners, setBanners] = useState([]); // Store multiple banners
  const [previewImages, setPreviewImages] = useState([]); // Store preview images
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    // Create new banners objects based on files and formData
    const newBanners = files.map((file) => ({
      ...formData,
      bannerImage: file,
    }));

    // Update the banners array
    setBanners((prevBanners) => [...prevBanners, ...newBanners]);

    // Generate preview images
    const previews = files?.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevImages) => [...prevImages, ...previews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (banners?.length === 0) {
      toast.error("Please add at least one banner");
      return;
    }

    try {
      setIsLoading(true);

      const submitData = new FormData();

      // Loop through banners to append multiple files and data
      banners?.forEach((banner) => {
        submitData.append("name", banner?.bannerName);
        submitData.append("images", banner?.bannerImage); // Append each banner's image
        submitData.append("type", banner?.bannerType);
        submitData.append("isActive", banner?.bannerStatus);
      });

      // Send the data to the backend
      const response = await postData("api/banners/create-banners", submitData);

      if (response.success === true) {
        toast.success("Banners added successfully");
        navigate("/all-banners");
        setBanners([]); // Clear banners after submission
        setPreviewImages([]);
      }
    } catch (error) {
      toast.error("Failed to add banners");
    } finally {
      setIsLoading(false);
    }
  };
  console.log("XXXXXXXX banners", banners)
  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Shop Banners</h4>
        </div>
        <div className="links">
          <Link to="/all-banners" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="bannerName" className="form-label">
              Shop Banner Name
            </label>
            <input
              type="text"
              name="bannerName"
              value={formData?.bannerName}
              onChange={handleChange}
              className="form-control"
              id="bannerName"
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="bannerType" className="form-label">
              Banner Type
            </label>
            <select
              name="bannerType"
              className="form-select"
              id="bannerType"
              value={formData?.bannerType}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select Banner Type
              </option>
              <option value="Desktop">Desktop</option>
              <option value="Mobile">Mobile</option>
              {/* <option value="Both">Both</option> */}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="bannerImage" className="form-label">
              Shop Banner Images
            </label>
            <input
              type="file"
              name="bannerImage"
              className="form-control"
              id="bannerImage"
              onChange={handleImageChange}
              // multiple
              required
            />
          </div>
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="bannerStatus"
                id="bannerStatus"
                checked={formData?.bannerStatus}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="bannerStatus">
                Active
              </label>
            </div>
          </div>
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`btn ${isLoading ? "not-allowed" : "allowed"}`}
            >
              {isLoading ? "Please Wait..." : "Add Banners"}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      <div className="preview-section mt-4">
        <h5>Preview</h5>
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Banner Name</th>
              <th>Banner Type</th>
              <th>Status</th>
              <th>Image</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{banner?.bannerName || "N/A"}</td>
                <td>{banner?.bannerType || "N/A"}</td>
                <td>{banner?.bannerStatus ? "Active" : "Inactive"}</td>
                <td>
                  {previewImages[index] && (
                    <img
                      src={previewImages[index]}
                      alt="Preview"
                      className="img-fluid"
                      style={{ maxWidth: "100px", borderRadius: "5px" }}
                    />
                  )}
                </td>
                <td><i className="fa-regular fa-pen-to-square"></i></td>
                <td><i className="fa-solid fa-trash"></i></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AddBanner;
