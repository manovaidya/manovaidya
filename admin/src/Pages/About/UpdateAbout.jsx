import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import JoditEditor from "jodit-react";
import axios from "axios";

const UpdateAbout = () => {
  const [content, setContent] = useState(""); // Store Jodit editor content
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing About content
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await axios.get(
          "https://api.manovaidya.com/api/get-about"
        );
        if (response.data.success) {
          setContent(response.data.data.description || "");
        } else {
          toast.error("Failed to load content");
        }
      } catch (error) {
        toast.error("Error fetching data");
      }
    };

    fetchAbout();
  }, []);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.put(
        "https://api.manovaidya.com/api/update-about",
        {
          description: content,
        }
      );

      if (response.data.success) {
        toast.success("About content updated successfully!");
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      toast.error("Error updating content");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Update About Content</h4>
        </div>
        <div className="links">
          <Link to="/about" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-12">
            <label className="form-label">About Content</label>
            <JoditEditor
              value={content}
              onChange={(newContent) => setContent(newContent)}
            />
          </div>

          <div className="col-12 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`btn ${isLoading ? "not-allowed" : "allowed"}`}
            >
              {isLoading ? "Please Wait..." : "Update About"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateAbout;
