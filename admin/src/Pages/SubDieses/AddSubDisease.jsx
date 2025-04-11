import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, postData } from "../../services/FetchNodeServices";
import { Autocomplete, TextField } from "@mui/material";

const AddSubDisease = () => {
  const [formData, setFormData] = useState({
    subDiseaseName: "",
    subDiseaseStatus: false,
    productId: [],
    image: "",
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const navigate = useNavigate();

  // Fetch All Products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await getData("api/products/all-product");
        if (response.success === true) {
          setProductList(response?.products || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" || type === "radio") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      handleImageChange(e);
    } else if (name === "productId") {
      setFormData({
        ...formData,
        [name]: Array.from(e.target.selectedOptions, (option) => option.value),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Getting the first file
    const previewUrl = URL.createObjectURL(file);
    setPreviewImages([previewUrl]);

    setFormData({
      ...formData,
      image: file, // Add the image to formData
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subDiseaseName || !formData.image) {
      toast.error("Please add the sub-disease name and image");
      return;
    }

    try {
      setIsLoading(true);
      const submitData = new FormData();
      submitData.append("name", formData.subDiseaseName);
      submitData.append("image", formData.image);
      submitData.append("isActive", formData.subDiseaseStatus ? "true" : "false");

      formData.productId.forEach((productId) => {
        submitData.append("productId", productId);
      });

      const response = await postData(
        `api/subcategories/create-sub-diseases`,
        submitData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.success === true) {
        toast.success("Sub-diseases added successfully");
        navigate("/sub-diseases");
        setFormData({
          subDiseaseName: "",
          subDiseaseStatus: false,
          productId: [],
          image: "",
        });
        setPreviewImages([]);
      }
    } catch (error) {
      toast.error("Failed to add sub-diseases");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Sub-Diseases</h4>
        </div>
        <div className="links">
          <Link to="/sub-diseases" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>
      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="subDiseaseName" className="form-label">
              Sub-Disease Name
            </label>
            <input
              type="text"
              name="subDiseaseName"
              value={formData.subDiseaseName}
              onChange={handleChange}
              className="form-control"
              id="subDiseaseName"
              required
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="subDiseaseImage" className="form-label">
              Sub-Disease Images
            </label>
            <input
              type="file"
              name="subDiseaseImage"
              className="form-control"
              id="subDiseaseImage"
              onChange={handleImageChange}
              required
            />
          </div>

          {/* <div className="col-md-4">
            <label htmlFor="selectProduct">Select Product</label>
            <select
              multiple
              style={{ height: 100 }}
              name="productId"
              onChange={handleChange}
              className="form-control"
            >
              <option value="">Select Product</option>
              {productList?.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.productName}
                </option>
              ))}
            </select>
          </div> */}

          <div className="col-md-4" style={{ marginTop: '40px' }}>
            <Autocomplete
              multiple
              options={productList}
              value={productList.filter((product) => formData.productId.includes(product._id))}
              getOptionLabel={(option) => option.productName}
              onChange={(e, newValue) => setFormData(prev => ({ ...prev, productId: newValue.map(product => product._id) }))}
              renderInput={(params) => <TextField {...params} label="Select Product" />}
            />
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="subDiseaseStatus"
                id="subDiseaseStatus"
                checked={formData.subDiseaseStatus}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="subDiseaseStatus">
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
              {isLoading ? "Please Wait..." : "Add Sub-Diseases"}
            </button>
          </div>
        </form>
      </div>

      {/* Image Preview Section */}
      <div className="preview-section mt-4">
        <h5>Preview</h5>
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Sub-Disease Name</th>
              <th>Status</th>
              <th>Image</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {previewImages.length > 0 && (
              <tr>
                <td>1</td>
                <td>{formData.subDiseaseName || "N/A"}</td>
                <td>{formData.subDiseaseStatus ? "Active" : "Inactive"}</td>
                <td>
                  <img
                    src={previewImages[0]}
                    alt="Preview"
                    className="img-fluid"
                    style={{ maxWidth: "100px", borderRadius: "5px" }}
                  />
                </td>
                <td>
                  <i className="fa-regular fa-pen-to-square"></i>
                </td>
                <td>
                  <i className="fa-solid fa-trash"></i>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AddSubDisease;
