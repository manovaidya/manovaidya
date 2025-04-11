import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";

const About = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://api.manovaidya.com/api/get-banners"
        );
        if (response.data.success) {
          setBanners(response.data.data);
        } else {
          toast.error("Failed to load banners");
        }
      } catch (error) {
        toast.error("An error occurred while fetching banners");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await axios.delete(
          `https://api.manovaidya.com/api/delete-banner/${id}`
        );
        setBanners((prevBanners) =>
          prevBanners.filter((banner) => banner._id !== id)
        );
        toast.success("Banner deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete the banner");
    }
  };

  // Filtering banners based on search input
  const filteredBanners = banners.filter((banner) =>
    banner.bannerDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Manage About</h4>
        </div>
        <div className="links">
          <Link to="/update-about" className="add-new">
            Update About <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      <div className="filteration">
        {/* <div className="search">
          <label htmlFor="search">Search </label> &nbsp;
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search by content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> */}
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Content</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="3" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredBanners.length > 0 ? (
              filteredBanners.map((banner, index) => (
                <tr key={banner._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{banner.bannerDescription}</td>
                  <td>
                    <Link to={`/edit-banner/${banner._id}`} className="bt edit">
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                    &nbsp;
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="bt delete"
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No Content found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default About;
