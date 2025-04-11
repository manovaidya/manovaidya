import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddSubCategory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: "",
    subcategoryName: "",
    subcategoryStatus: "False",
    subcategoryImage: null,
  });
  const [mainCategories, setMainCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await axios.get(
          "https://api.manovaidya.com/api/get-main-category"
        );
        setMainCategories(response.data.data);
      } catch (error) {
        toast.error("Error fetching main categories");
        console.error("Error fetching main categories:", error);
      }
    };
    fetchMainCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "subcategoryImage") {
      setFormData((prevData) => ({ ...prevData, subcategoryImage: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleCheckboxChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      subcategoryStatus:
        prevData.subcategoryStatus === "True" ? "False" : "True",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("categoryName", formData.categoryName);
    data.append("subcategoryName", formData.subcategoryName);
    data.append("subcategoryStatus", formData.subcategoryStatus);
    if (formData.subcategoryImage)
      data.append("subcategoryImage", formData.subcategoryImage);

    try {
      const response = await axios.post(
        "https://api.manovaidya.com/api/create-subcategory",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(response.data.message);
      navigate("/all-subcategory");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding subcategory");
      console.error("Error adding subcategory:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Subcategory</h4>
        </div>
        <div className="links">
          <Link to="/all-subcategory" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-6">
            <label htmlFor="categoryName" className="form-label">
              Select Main Category
            </label>
            <select
              name="categoryName"
              className="form-control"
              id="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              {mainCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.mainCategoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <label htmlFor="subcategoryName" className="form-label">
              Subcategory Name
            </label>
            <input
              type="text"
              name="subcategoryName"
              className="form-control"
              id="subcategoryName"
              value={formData.subcategoryName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="subcategoryImage" className="form-label">
              Subcategory Image
            </label>
            <input
              type="file"
              name="subcategoryImage"
              className="form-control"
              id="subcategoryImage"
              onChange={handleChange}
            />
          </div>
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="subcategoryStatus"
                id="subcategoryStatus"
                checked={formData.subcategoryStatus === "True"}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="subcategoryStatus">
                Active
              </label>
            </div>
          </div>
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`${isLoading ? "not-allowed" : "allowed"}`}
            >
              {isLoading ? "Please Wait..." : "Add Subcategory"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddSubCategory;
