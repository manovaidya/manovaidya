import JoditEditor from "jodit-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postData } from "../../services/FetchNodeServices";

const AddTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    addHeaderTitle: "",
    keyPoint: "",
    description: "",
    themeColor: "#000",
    questions: [{ question: "" }],
    productUrl: [{ url: "", per: "" }],
    videoUrl: [{ url: "" }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleJoditChange = (newValue, name) => {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
  };

  const handleFieldChange = (index, name, value, type) => {
    const updatedData = [...formData[type]];
    updatedData[index][name] = value;
    setFormData((prevData) => ({ ...prevData, [type]: updatedData }));
  };

  const addField = (type, maxLimit, newItem) => {
    if (formData[type].length < maxLimit) {
      setFormData((prevData) => ({
        ...prevData,
        [type]: [...prevData[type], newItem],
      }));
    } else {
      toast.error(`You can add only ${maxLimit} ${type}.`);
    }
  };

  const removeField = (type, index) => {
    const updatedData = [...formData[type]];
    updatedData.splice(index, 1);
    setFormData((prevData) => ({ ...prevData, [type]: updatedData }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (
      !formData.addHeaderTitle ||
      !formData.keyPoint ||
      !formData.description ||
      !formData.themeColor ||
      !formData.questions.length ||
      !formData.productUrl.length
    ) {
      toast.error("Please fill in all the required fields.");
      setIsLoading(false);
      return;
    }

    if (formData.questions.length < 10) {
      toast.error("Please fill 10 question fields.");
      setIsLoading(false);
      return;
    }

    if (formData.productUrl.length < 4) {
      toast.error("Please fill 4 product URLs with percentages.");
      setIsLoading(false);
      return;
    }

    // Submit
    try {
      const response = await postData("api/test/create-mind-health-test", formData);
      if (response.status === true) {
        toast.success(response?.message);
        navigate("/view-test");
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      toast.error(error.response?.message || "Error adding test");
      console.error("Error adding test:", error);
    } finally {
      setIsLoading(false);
    }
  };
console.log("XXXXXXXXXX",formData)
  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Add Test</h4>
        </div>
        <div className="links">
          <Link to="/view-test" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          {/* Header Title */}
          <div className="col-md-4">
            <label htmlFor="addHeaderTitle" className="form-label">
              Add Header Title
            </label>
            <input
              type="text"
              name="addHeaderTitle"
              className="form-control"
              id="addHeaderTitle"
              value={formData.addHeaderTitle}
              onChange={handleChange}
              required
            />
          </div>

          {/* Color Picker */}
          <div className="col-md-6">
            <label htmlFor="themeColor" className="form-label">
              Select Card Background Color
            </label>
            <input
              type="color"
              name="themeColor"
              className="form-control form-control-color"
              id="themeColor"
              value={formData.themeColor}
              onChange={handleChange}
            />
          </div>

          {/* Key Points */}
          <div className="col-md-12">
            <label htmlFor="keyPoint" className="form-label">
              Add Header Key Points
            </label>
            <JoditEditor
              className="form-control"
              placeholder="Key Points"
              name="keyPoint"
              value={formData.keyPoint}
              onChange={(newValue) => handleJoditChange(newValue, "keyPoint")}
            />
          </div>

          {/* Description */}
          <div className="col-md-12">
            <label htmlFor="description" className="form-label">
              Add Header Description
            </label>
            <JoditEditor
              className="form-control"
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={(newValue) => handleJoditChange(newValue, "description")}
            />
          </div>

          {/* Questions Section */}
          <div className="col-md-12">
            <div className="head">
              <h4>Add Only 10 Test Questions</h4>
            </div>
            {formData.questions.map((item, index) => (
              <div key={index} className="row align-items-center">
                <div className="col-md-8">
                  <label htmlFor={`question-${index}`} className="form-label">
                    {index + 1} Add Question
                  </label>
                  <input
                    type="text"
                    name="question"
                    className="form-control"
                    id={`question-${index}`}
                    value={item.question}
                    onChange={(e) => handleFieldChange(index, "question", e.target.value, "questions")}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <br />
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger me-2"
                      onClick={() => removeField("questions", index)}
                    >
                      Remove
                    </button>
                  )}
                  {index === formData.questions.length - 1 && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => addField("questions", 10, { question: "" })}
                    >
                      Add More
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Product URLs & Percentages Section */}
          <div className="col-md-12">
            <div className="head">
              <h4>Add Product 4 URL & Percentage out of 100</h4>
            </div>
            {formData.productUrl.map((item, index) => (
              <div key={index} className="row align-items-center">
                <div className="col-md-4">
                  <label htmlFor={`url-${index}`} className="form-label">
                    {index + 1} Add URL
                  </label>
                  <input
                    type="text"
                    name="url"
                    className="form-control"
                    id={`url-${index}`}
                    value={item.url}
                    onChange={(e) => handleFieldChange(index, "url", e.target.value, "productUrl")}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor={`percentage-${index}`} className="form-label">
                    Add Percentage
                  </label>
                  <input
                    type="number"
                    name="per"
                    className="form-control"
                    id={`percentage-${index}`}
                    value={item.per}
                    onChange={(e) => handleFieldChange(index, "per", e.target.value, "productUrl")}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <br />
                  {formData.productUrl.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger me-2"
                      onClick={() => removeField("productUrl", index)}
                    >
                      Remove
                    </button>
                  )}
                  {index === formData.productUrl.length - 1 && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => addField("productUrl", 4, { url: "", per: "" })}
                    >
                      Add More
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Doctor's Advice Video URL Section */}
          <div className="col-md-12">
            <div className="head">
              <h4>Doctor's Advice Video's URL</h4>
            </div>
            {formData.videoUrl.map((item, index) => (
              <div key={index} className="row align-items-center">
                <div className="col-md-8">
                  <label htmlFor={`videoUrl-${index}`} className="form-label">
                    {index + 1} Add URL
                  </label>
                  <input
                    type="text"
                    name="url"
                    className="form-control"
                    id={`videoUrl-${index}`}
                    value={item.url}
                    onChange={(e) => handleFieldChange(index, "url", e.target.value, "videoUrl")}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <br />
                  {formData.videoUrl.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger me-2"
                      onClick={() => removeField("videoUrl", index)}
                    >
                      Remove
                    </button>
                  )}
                  {index === formData.videoUrl.length - 1 && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => addField("videoUrl", 4, { url: "" })}
                    >
                      Add More
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`btn ${isLoading ? "btn-secondary" : "btn-success"}`}
            >
              {isLoading ? "Please Wait..." : "Add Test"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddTest;
