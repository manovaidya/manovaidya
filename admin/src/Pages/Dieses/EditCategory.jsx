import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, postData, serverURL } from "../../services/FetchNodeServices";
import JoditEditor from "jodit-react";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Autocomplete, TextField } from "@mui/material";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    categoryName: "",
    categoryImage: null,
    categoryStatus: false,
    shortDescription: "",
    description: "",
    productId: []
  });
  const [btnLoading, setBtnLoading] = useState(false);
  const [productList, setProductList] = useState([]);
  const [oldImage, setOldImage] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getData(`api/categories/get-category-by-id/${id}`);
        if (response?.success) {
          setFormData({
            categoryName: response?.category?.categoryName,
            shortDescription: response?.category?.shortDescription,
            description: response?.category?.description,
            productId: response?.category?.productId?.map((product) => product._id) || [],
            categoryStatus: response?.category?.isActive,
            categoryImage: response?.category?.image || null,
          });
          setOldImage(response?.category?.image || null);
        }
      } catch (error) {
        toast.error("Error fetching category data");
        console.error("Error fetching category:", error);
      }
    };


    const fetchProducts = async () => {
      setBtnLoading(true);
      try {
        const response = await getData("api/products/all-product");
        if (response.success) {
          setProductList(response?.products || []);
        }
      } catch (error) {
        toast.error("Failed to fetch products!");
        console.error("Error fetching products:", error);
      } finally {
        setBtnLoading(false);
      }
    };

    fetchCategory();
    fetchProducts();
  }, [id]);

  const handleJoditChange = (newValue) => {
    setFormData((prev) => ({
      ...prev,
      description: newValue
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const payload = new FormData();
    payload.append("categoryName", formData.categoryName);
    if (formData.categoryImage) {
      payload.append("categoryImage", formData.categoryImage);
    }
    payload.append("categoryStatus", formData.categoryStatus ? "True" : "False");
    payload.append("shortDescription", formData.shortDescription);
    payload.append("description", formData.description);
    payload.append("productId", formData?.productId);

    if (oldImage) {
      payload.append("oldImage", oldImage);
    }

    try {
      const response = await postData(`api/categories/update-category/${id}`, payload);
      if (response?.success === true) {
        toast.success(response.message);
        navigate("/all-dieses");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating category");
      console.error("Error updating category:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  console.log("fromData", formData)

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Category</h4>
        </div>
        <div className="links">
          <Link to="/all-dieses" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label htmlFor="categoryName" className="form-label">
              Category Name
            </label>
            <input
              type="text"
              name="categoryName"
              className="form-control"
              id="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="categoryImage" className="form-label">
              Category Image
            </label>
            <input
              type="file"
              name="categoryImage"
              className="form-control"
              id="categoryImage"
              onChange={handleChange}
            />
            {oldImage && (
              <img src={`${serverURL}/uploads/categorys/${oldImage}`} alt="old category" width="100" />
            )}
          </div>

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

          <div className="col-md-12">
            <label htmlFor="shortDescription" className="form-label">
              Add Short Description
            </label>
            <input
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className="form-control"
              type="text"
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">For Information</label>
            <JoditEditor
              value={formData.description}
              onChange={handleJoditChange}
            />
          </div>

          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                name="categoryStatus"
                id="categoryStatus"
                checked={formData.categoryStatus}
                onChange={handleChange}
              />
              <label className="form-check-label" htmlFor="categoryStatus">
                Active on Homepage
              </label>
            </div>
          </div>

          <div className="col-12 text-center">
            <button
              type="submit"
              className={`${btnLoading ? "not-allowed" : "allowed"}`}
              disabled={btnLoading}
            >
              {btnLoading ? "Please Wait..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditCategory;
