import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, postData } from "../../services/FetchNodeServices";

const EditTag = () => {
  const { id } = useParams(); // Get the tag ID from the URL
  const navigate = useNavigate();
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("#000000");
  const [btnLoading, setBtnLoading] = useState(false);

  const fetchTagData = async () => {
    try {
      const response = await getData(`api/tag/get-tag-by-id/${id}`);
      if (response.status) {
        const tag = response?.data;
        setTagName(tag?.tagName);
        setTagColor(tag?.tagColor);
      }
    } catch (error) {
      toast.error("Error fetching tag data!");
    }
  };

  useEffect(() => {
    fetchTagData();
  }, [id]);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      const updatedTag = {
        tagName,
        tagColor,
      };
      const response = await postData(`api/tag/update-tags/${id}`, updatedTag);
      if (response.status) {
        toast.success("Tag updated successfully!");
        navigate("/all-tags");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Edit Tag</h4>
        </div>
        <div className="links">
          <Link to="/all-tags" className="add-new">
            Back <i className="fa-regular fa-circle-left"></i>
          </Link>
        </div>
      </div>

      <div className="d-form">
        <form className="row g-3" onSubmit={handleSubmit}>
          <div className="col-md-4">
            <label htmlFor="title" className="form-label">
              Tag Name
            </label>
            <input
              type="text"
              name="title"
              className="form-control"
              id="title"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="TagColour" className="form-label">
              Tag Color
            </label>
            <input
              type="color"
              name="TagColour"
              className="form-control"
              id="TagColour"
              value={tagColor}
              onChange={(e) => setTagColor(e.target.value)}
              required
            />
          </div>

          <div className="col-12 text-center">
            <button
              type="submit"
              className={`${btnLoading ? "not-allowed" : "allowed"}`}
              disabled={btnLoading}
            >
              {btnLoading ? "Please Wait..." : "Update Tag"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditTag;
