import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, postData, serverURL } from "../../services/FetchNodeServices";
import JoditEditor from "jodit-react";
import { Autocomplete, TextField } from "@mui/material";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    categoryName: "",
    categoryImage: null,
    categoryStatus: false,
    faq: [{ question: "", answer: "" }],
    healthTestId: "",
    productId: [],
    description: "",
    shortDescription: "",
    connectCommunity: "",
  });

  const [productList, setProductList] = useState([]);
  const [healthTestList, setHealthTestList] = useState([]);
  const [oldImage, setOldImage] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    fetchCategory();
    fetchProducts();
    fetchHealthTests();
  }, [id]);

  const fetchCategory = async () => {
    try {
      const response = await getData(`api/categories/get-category-by-id/${id}`);
      console.log("XXXXXXXXXX", response)
      if (response?.success) {
        const category = response.category;
        setFormData({
          categoryName: category.categoryName || "",
          shortDescription: category.shortDescription || "",
          description: category.description || "",
          productId: category.productId?.map((item) => item._id) || [],
          categoryStatus: category.isActive === "True",
          healthTestId: category.healthTestId || "",
          connectCommunity: category.connectCommunity || "",
          faq: category.faq?.length ? category.faq : [{ question: "", answer: "" }],
          categoryImage: null,
        });
        setOldImage(category.image || null);
      } else {
        toast.error("Failed to load category details.");
      }
    } catch (error) {
      console.error("fetchCategory Error:", error);
      toast.error("Error fetching category details.");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getData("api/products/all-product");
      if (response?.success) {
        setProductList(response.products || []);
      } else {
        toast.error("Failed to load products.");
      }
    } catch (error) {
      console.error("fetchProducts Error:", error);
      toast.error("Error fetching products.");
    }
  };

  const fetchHealthTests = async () => {
    try {
      const response = await postData("api/test/get-mind-test");
      if (response?.status) {
        setHealthTestList(response.data.reverse() || []);
      } else {
        toast.error("Failed to load health tests.");
      }
    } catch (error) {
      console.error("fetchHealthTests Error:", error);
      toast.error("Error fetching health tests.");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleJoditChange = (newValue) => {
    setFormData((prev) => ({ ...prev, description: newValue }));
  };

  const handleCheckboxChange = () => {
    setFormData((prev) => ({ ...prev, categoryStatus: !prev.categoryStatus }));
  };

  const handleFaqChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFaq = [...formData.faq];
    updatedFaq[index][name] = value;
    setFormData((prev) => ({ ...prev, faq: updatedFaq }));
  };

  const addFaq = () => {
    const lastFaq = formData.faq[formData.faq.length - 1];
    if (lastFaq?.question && lastFaq?.answer) {
      setFormData((prev) => ({ ...prev, faq: [...prev.faq, { question: "", answer: "" }] }));
    } else {
      toast.error("Please complete the last FAQ before adding a new one.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const payload = new FormData();
    payload.append("categoryName", formData.categoryName);
    payload.append("categoryStatus", formData.categoryStatus);
    payload.append("productId", JSON.stringify(formData.productId || null)); // Ensure product IDs are serialized
    payload.append("description", formData.description);
    payload.append("shortDescription", formData.shortDescription);
    payload.append("healthTestId", formData.healthTestId);
    payload.append("connectCommunity", formData.connectCommunity);

    // Append FAQs to form data
    formData.faq.forEach((faq, index) => {
      payload.append(`faq[${index}][question]`, faq.question);
      payload.append(`faq[${index}][answer]`, faq.answer);
    });

    if (formData.categoryImage) {
      payload.append("categoryImage", formData.categoryImage);
    }
    if (oldImage && !formData.categoryImage) {
      payload.append("oldImage", oldImage);
    }

    try {
      const response = await postData(`api/categories/update-category/${id}`, payload);
      if (response?.success) {
        toast.success(response.message || "Category updated successfully!");
        navigate("/all-dieses");
      } else {
        toast.error(response.message || "Failed to update category.");
      }
    } catch (error) {
      console.error("handleSubmit Error:", error);
      toast.error("Something went wrong while updating category.");
    } finally {
      setBtnLoading(false);
    }
  };

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
          {/* Category Name */}
          <div className="col-md-4">
            <label className="form-label">Disease Name</label>
            <input
              type="text"
              name="categoryName"
              className="form-control"
              value={formData.categoryName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Category Image */}
          <div className="col-md-4">
            <label className="form-label">Image (300x200 px)</label>
            <input
              type="file"
              name="categoryImage"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
            />
            {formData.categoryImage ? (
              <img src={URL.createObjectURL(formData.categoryImage)} alt="Preview" width="100" className="mt-2" />
            ) : oldImage ? (
              <img src={`${serverURL}/uploads/categorys/${oldImage}`} alt="Old Image" width="100" className="mt-2" />
            ) : null}
          </div>

          {/* Select Products */}
          <div className="col-md-4">
            <label className="form-label">Select Product</label>
            <Autocomplete
              multiple
              options={productList}
              value={productList.filter((p) => formData.productId.includes(p._id))}
              getOptionLabel={(option) => option?.productName || ""}
              onChange={(e, newValue) => setFormData(prev => ({ ...prev, productId: newValue.map(item => item._id) }))}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>

          {/* Short Description */}
          <div className="col-md-6">
            <label className="form-label">Short Description</label>
            <input
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className="form-control"
              type="text"
            />
          </div>

          {/* Health Test */}
          <div className="col-md-6">
            <label className="form-label">Select Health Test</label>
            <Autocomplete
              options={healthTestList}
              value={healthTestList.find((test) => test?._id === formData.healthTestId) || null}
              getOptionLabel={(option) => option?.addHeaderTitle || ""}
              onChange={(e, newValue) => setFormData(prev => ({ ...prev, healthTestId: newValue?._id || "" }))}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>

          {/* Homepage Active */}
          <div className="col-12">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="categoryActive"
                checked={formData.categoryStatus}
                onChange={handleCheckboxChange}
              />
              <label className="form-check-label" htmlFor="categoryActive">
                Active on Homepage
              </label>
            </div>
          </div>

          {/* FAQ Section */}
          <hr />
          <div className="col-md-12">
            <h4>Add FAQ</h4>
          </div>

          {formData.faq.map((faq, index) => (
            <div key={index} className="col-md-12 d-flex gap-3">
              <div className="col-md-6">
                <label className="form-label">Question</label>
                <input
                  type="text"
                  className="form-control"
                  name="question"
                  value={faq.question}
                  onChange={(e) => handleFaqChange(index, e)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Answer</label>
                <input
                  type="text"
                  className="form-control"
                  name="answer"
                  value={faq.answer}
                  onChange={(e) => handleFaqChange(index, e)}
                />
              </div>
            </div>
          ))}

          <div className="col-md-12">
            <button type="button" className="btn btn-primary mt-3" onClick={addFaq}>
              Add FAQ
            </button>
          </div>

          {/* Buyer's Guide */}
          <div className="col-md-12">
            <label className="form-label">Buyer's Guide</label>
            <JoditEditor value={formData.description} onChange={handleJoditChange} />
          </div>

          {/* Connect Community */}
          <div className="col-md-6">
            <label className="form-label">Connect Our Community URL</label>
            <input
              type="url"
              className="form-control"
              name="connectCommunity"
              value={formData.connectCommunity}
              onChange={handleChange}
            />
          </div>

          {/* Submit Button */}
          <div className="col-12 text-center mt-4">
            <button
              type="submit"
              className={`btn ${btnLoading ? "btn-secondary" : "btn-primary"}`}
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
