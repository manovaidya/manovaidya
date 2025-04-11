import JoditEditor from "jodit-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, postData } from "../../services/FetchNodeServices";

const EditTest = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    addHeaderTitle: "",
    keyPoint: "",
    description: "",
    themeColor: "#000",
    questions: [{ question: "" }],
    productUrl: [{ url: "", per: "" }],
  });

  // Fetch test data on mount
  const fetchTest = async () => {
    try {
      const response = await getData(`api/test/get-by-id/${id}`);
      if (response.status === true) {
        setFormData({
          addHeaderTitle: response.data.addHeaderTitle || "",
          keyPoint: response.data.keyPoint || "",
          description: response.data.description || "",
          themeColor: response.data.themeColor || "#000",
          questions: response.data.questions || [{ question: "" }],
          productUrl: response.data.productUrl || [{ url: "", per: "" }],
        });
      } else {
        toast.error("Test data not found");
      }
    } catch (error) {
      toast.error("Error fetching test data");
      console.error("Error fetching test data:", error);
    }
  };

  useEffect(() => {
    if (id) fetchTest();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleJoditChange = (newValue, name) => {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
  };

  const handleQuestionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index][name] = value;
    setFormData((prevData) => ({ ...prevData, questions: updatedQuestions }));
  };

  const handleUrlChange = (index, e) => {
    const { name, value } = e.target;
    const updatedUrls = [...formData.productUrl];
    updatedUrls[index][name] = value;
    setFormData((prevData) => ({ ...prevData, productUrl: updatedUrls }));
  };

  const addQuestionField = () => {
    if (formData.questions.length < 10) {
      setFormData((prevData) => ({
        ...prevData,
        questions: [...prevData.questions, { question: "" }],
      }));
    } else {
      toast.error("You can add only 10 questions.");
    }
  };

  const removeQuestionField = (index) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions.splice(index, 1);
    setFormData((prevData) => ({ ...prevData, questions: updatedQuestions }));
  };

  const addUrlField = () => {
    if (formData.productUrl.length < 4) {
      setFormData((prevData) => ({
        ...prevData,
        productUrl: [...prevData.productUrl, { url: "", per: "" }],
      }));
    } else {
      toast.error("You can add only 4 URLs.");
    }
  };

  const removeUrlField = (index) => {
    const updatedUrls = [...formData.productUrl];
    updatedUrls.splice(index, 1);
    setFormData((prevData) => ({ ...prevData, productUrl: updatedUrls }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form data
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
      toast.error("Please fill all 10 questions fields.");
      setIsLoading(false);
      return;
    }

    if (formData.productUrl.length < 4) {
      toast.error("Please fill 4 product URLs with percentages.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await postData(`api/test/update-mind-health-test/${id}`, formData);
      if (response.status === true) {
        toast.success(response.message);
        navigate("/view-test");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.response?.message || "Error updating test");
      console.error("Error updating test:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Test</h4>
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
              style={{ marginLeft: 100 }}
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
              placeholder="keyPoint"
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
                    onChange={(e) => handleQuestionChange(index, e)}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <br />
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger me-2"
                      onClick={() => removeQuestionField(index)}
                    >
                      Remove
                    </button>
                  )}
                  {index === formData.questions.length - 1 && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={addQuestionField}
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
                    onChange={(e) => handleUrlChange(index, e)}
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
                    onChange={(e) => handleUrlChange(index, e)}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <br />
                  {formData.productUrl.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger me-2"
                      onClick={() => removeUrlField(index)}
                    >
                      Remove
                    </button>
                  )}
                  {index === formData.productUrl.length - 1 && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={addUrlField}
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
              {isLoading ? "Please Wait..." : "Edit Test"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditTest;
