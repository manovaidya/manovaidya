import axios from "axios";
import JoditEditor from "jodit-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, postData } from "../../services/FetchNodeServices.js";
import { Autocomplete, TextField } from "@mui/material";

const AddProduct = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [herbsList, setHerbsList] = useState([])
  const [formData, setFormData] = useState({
    productName: "",
    productDescription: "",
    productSubDescription: "",
    Variant: [{ price: "", discountPrice: "", finalPrice: "" }],
    herbsId: [],
    productImage: [],
    blogImage: [],
    faqs: [{ question: "", answer: "" }],
    urls: [{ url: "" }],
  });

  const navigate = useNavigate();


  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await getData("api/herbs/get-all-herbs");
        console.log(response)
        if (response?.status === true) {
          setHerbsList(response?.data || []);
        }

      } catch (error) {
        console.error("Error fetching products:", error);
        // toast.error("Failed to fetch products!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { options } = e.target;
    const selectedHerbs = Array.from(options).filter(option => option.selected).map(option => option.value);
    setFormData({ ...formData, herbsId: selectedHerbs });
  };

  const handleInputFaqChange = (index, field, value) => {
    const newfaqs = [...formData?.faqs];
    newfaqs[index][field] = value;
    setFormData({ ...formData, faqs: newfaqs });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 3 || files.length > 8) {
      alert("Please select between 3 to 8 images.");
      e.target.value = "";
      return;
    }
    setFormData({ ...formData, productImage: files });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleJoditChange = (newValue, name) => {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
  };
  // const handleJoditShortChange = (newValue, name) => {
  //   setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
  // };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...formData.Variant];
    updatedVariants[index][name] = value;

    if (name === "price" || name === "discountPrice") {
      const price = parseFloat(updatedVariants[index].price) || 0;
      const discount = parseFloat(updatedVariants[index].discountPrice) || 0;
      updatedVariants[index].finalPrice = price - (price * discount) / 100;
    }

    setFormData({ ...formData, Variant: updatedVariants });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation for product images
    if (formData.productImage.length < 3 || formData.productImage.length > 8) {
      alert("Please select between 3 to 8 images before submitting.");
      setIsLoading(false);
      return;
    }

    const form = new FormData();

    // Loop through formData and append data accordingly
    Object.keys(formData).forEach((key) => {
      if (key === "Variant" || key === "herbsId" || key === "faqs" || key === "urls") {
        // For objects or arrays (like Variant, herbsId, etc.), we need to stringify them
        form.append(key, JSON.stringify(formData[key]));
      } else if (key === "productImage") {
        // For productImage, append each file separately under the 'productImages' field
        formData.productImage.forEach((file) => form.append("productImages", file));
      } else if (key === "blogImage") {
        // For blogImage, append each file separately under the 'blogImages' field
        formData.blogImage.forEach((file) => form.append("blogImages", file));
      } else {
        // For other form fields, append them as they are
        form.append(key, formData[key]);
      }
    });

    try {
      const response = await postData("api/products/create-product", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.success === true) {
        toast.success("Product added successfully!");
        navigate("/all-products"); // Uncomment if you want to redirect after success
      }

    } catch (error) {
      console.error(error);
      toast.error("Failed to add product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 4) {
      alert("You can only upload up to 4 images.");
      return;
    }
    setFormData({ ...formData, blogImage: files });
  };

  const addVariant = () => {
    setFormData({
      ...formData,
      Variant: [...formData.Variant, { price: "", discountPrice: "", finalPrice: "", day: "", bottle: "", tex: "" }],
    });
  };

  const removeVariant = (index) => {
    const updatedVariants = formData.Variant.filter((_, i) => i !== index);
    setFormData({ ...formData, Variant: updatedVariants });
  };

  const addFAQField = () => {
    setFormData({ ...formData, faqs: [...formData.faqs, { question: "", answer: "" }] });
  };

  const deleteFAQField = (index) => {
    const updatedFaqs = formData.faqs.filter((_, i) => i !== index);
    setFormData({ ...formData, faqs: updatedFaqs });
  };

  const addUrlField = () => {
    setFormData({ ...formData, urls: [...formData.urls, { url: "" }] });
  };

  const deleteUrlField = (index) => {
    const updatedUrls = formData.urls.filter((_, i) => i !== index);
    setFormData({ ...formData, urls: updatedUrls });
  };
  console.log("XXXXXXXX", formData)
  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Product</h4>
        </div>
        <div className="links">
          <Link to="/all-products" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3 mt-2" onSubmit={handleSubmit}>
          {/* Product Image */}
          <div className="col-md-4">
            <label htmlFor="productImage" className="form-label">
              Product Image<sup className="text-danger">*</sup>
            </label>
            <input
              type="file"
              name="productImage"
              className="form-control"
              id="productImage"
              multiple
              onChange={handleFileChange}
              required
            />
                <small className="text-danger">Select up to 4 images.</small>
          </div>

          {/* Product Name */}
          <div className="col-md-4">
            <label htmlFor="productName" className="form-label">
              for which disease<sup className="text-danger">*</sup>
            </label>
            <input
              type="text"
              name="productName"
              className="form-control"
              id="productName"
              value={formData.productName}
              onChange={handleChange}
              required
              placeholder="Enter Disease"
            />
          </div>


          <div className="col-md-4" style={{ marginTop: '40px' }}>
            <Autocomplete
              multiple
              options={herbsList}
              value={herbsList.filter((herbs) => formData.herbsId.includes(herbs._id))}
              getOptionLabel={(option) => option.name}
              onChange={(e, newValue) => setFormData(prev => ({ ...prev, herbsId: newValue.map(herbs => herbs._id) }))}
              renderInput={(params) => <TextField {...params} label="Select Herbs" />}
            />
          </div>

          <div className="col-md-12">
            <label htmlFor="productSubDescription" className="form-label">
              Product sub Description<sup className="text-danger">*</sup>
            </label>
            <textarea
              name="productSubDescription"
              rows={1}
              className="form-control"
              id="productSubDescription"
              placeholder="Product Sub Description"
              value={formData.productSubDescription}
              onChange={handleChange}
              required
            />
            {/* <JoditEditor
              className="form-control"
              placeholder="product Sub Description"
              name="productSubDescription"
              value={formData.productSubDescription}
              onChange={(newValue) => handleJoditShortChange(newValue, 'productSubDescription')}
            /> */}
          </div>

          {/* Product Description (Jodit Editor) */}
          <div className="col-md-12">
            <label htmlFor="productDescription" className="form-label">
              Product Description<sup className="text-danger">*</sup>
            </label>
            <JoditEditor
              className="form-control"
              placeholder="Product Description"
              name="productDescription"
              value={formData.productDescription}
              onChange={(newValue) => handleJoditChange(newValue, 'productDescription')}
            />
          </div>

          <div className="col-md-4">
            <label htmlFor="productName" className="form-label">
              Product Name<sup className="text-danger">*</sup>
            </label>
            <input
              type="text"
              name="smirini"
              className="form-control"
              id="smirini"
              value={formData.smirini}
              onChange={handleChange}
              required
              placeholder="Product Name"
            />
          </div>


          {/* Product Variant */}
          {formData.Variant.map((variant, index) => (
            <div key={index} className="variant-container border p-3 mb-3">
              <div className="row">
                {/* Price */}
                <div className="col-md-2">
                  <label className="form-label">
                    Price<sup className="text-danger">*</sup>
                  </label>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={variant.price}
                    onChange={(e) => handleVariantChange(index, e)}
                    required
                    placeholder="Price"
                  />
                </div>

                {/* Discount Percentage */}
                <div className="col-md-2">
                  <label className="form-label">
                    Discount %<sup className="text-danger">*</sup>
                  </label>
                  <input
                    type="number"
                    name="discountPrice"
                    className="form-control"
                    value={variant.discountPrice}
                    onChange={(e) => handleVariantChange(index, e)}
                    required
                    placeholder="Discount %"
                  />
                </div>

                {/* Final Price */}
                <div className="col-md-2">
                  <label className="form-label">
                    Final Price<sup className="text-danger">*</sup>
                  </label>
                  <input
                    type="number"
                    name="finalPrice"
                    className="form-control"
                    value={variant?.finalPrice}
                    readOnly
                    placeholder="Final Price"
                  />
                </div>

                {/* Select Day */}
                <div className="col-md-2">
                  <label className="form-label">Select Day</label>
                  <select
                    name="day"
                    className="form-control"
                    value={variant.day}
                    onChange={(e) => handleVariantChange(index, e)}
                  >
                    <option value="">Select Day</option>
                    <option value="30 Day">30 Day</option>
                    <option value="60 Day">60 Day</option>
                    <option value="90 Day">90 Day</option>
                    <option value="120 Day">120 Day</option>
                  </select>
                </div>

                {/* Select Bottle */}
                <div className="col-md-2">
                  <label className="form-label">Select Bottle</label>
                  <select
                    name="bottle"
                    className="form-control"
                    value={variant.bottle}
                    onChange={(e) => handleVariantChange(index, e)}
                  >
                    <option value="">Select Bottle</option>
                    <option value="3 Bottle">3 Bottle</option>
                    <option value="6 Bottle">6 Bottle</option>
                    <option value="9 Bottle">9 Bottle</option>
                    <option value="12 Bottle">12 Bottle</option>
                  </select>
                </div>

                {/* Taxes */}
                <div className="col-md-2">
                  <label className="form-label">Taxe's</label>
                  <input
                    type="text"
                    name="tex"
                    className="form-control"
                    value={variant.tex}
                    onChange={(e) => handleVariantChange(index, e)}
                  />
                </div>
              </div>

              {/* Delete Button */}
              {index > 0 && (
                <div className="text-end mt-2">
                  <button className="btn btn-danger" onClick={() => removeVariant(index)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Add More Button */}
          <div>
            <button type="button" className="btn btn-primary" onClick={addVariant}>
              Add More
            </button>
          </div>

          {/* FAQ */}
          <div className="mt-4">
            <h2>Add FAQ</h2>
            {formData?.faqs?.map((faq, index) => (
              <div className="row mb-2" key={index}>
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => handleInputFaqChange(index, "question", e.target.value)}
                  />
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => handleInputFaqChange(index, "answer", e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  {index > 0 && (
                    <button type="button" className="btn btn-danger" onClick={() => deleteFAQField(index)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="col-md-12 mt-3">
              <button type="button" className="btn btn-primary me-2" onClick={addFAQField}>
                Add More
              </button>
            </div>
          </div>

          {/* Blog Image */}
          <div className="mt-4">
            <h2>Add Blog Images</h2>
            <div className="row">
              <div className="col-md-6">
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <small className="text-danger">Select up to 4 images.</small>
              </div>
            </div>
          </div>

          {/* URL */}
          <div className="mt-4">
            <h2>Add Video URLs</h2>
            {formData?.urls?.map((urlItem, index) => (
              <div className="row mb-2" key={index}>
                <div className="col-md-10">
                  <input
                    type="url"
                    className="form-control"
                    value={urlItem?.url}
                    onChange={(e) => {
                      const updatedUrls = [...formData.urls];
                      updatedUrls[index].url = e.target.value;
                      setFormData({ ...formData, urls: updatedUrls });
                    }}
                    placeholder="URL"
                  />
                </div>
                <div className="col-md-2">
                  {index > 0 && (
                    <button type="button" className="btn btn-danger" onClick={() => deleteUrlField(index)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="col-md-12 mt-3">
              <button type="button" className="btn btn-primary me-2" onClick={addUrlField}>
                Add More
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="col-md-12 mt-4 text-center">
            <button type="submit" className="btn btn-success" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProduct;
