import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { getData, postData, serverURL } from "../../services/FetchNodeServices";
import { formatDate } from "../../constant";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await getData("api/blogs/get-all-blogs");
      if (response.status === true) {
        setBlogs(response.blogs);
      } else {
        toast.error("Failed to load banners");
      }
    } catch (error) {
      toast.error("An error occurred while fetching banners");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
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
        const data = await getData(`api/blogs/delete-blog/${id}`);
        console.log("data", data)
        if (data.status === true) {
          fetchBlogs()
          setBlogs(blogs?.filter((blog) => blog?._id !== id));
          toast.success("blog deleted successfully");
        }
      }
    } catch (error) {
      toast.error("Failed to delete the blog");
    }
  };

  const handleCheckboxChange = async (e, blogId) => {
    const updatedStatus = e.target.checked;

    try {
      const response = await postData('api/blogs/change-status', { blogId: blogId, isActive: updatedStatus });

      if (response.status === true) {
        // Update the status in the local state
        const updatedCategories = blogs.map(blog => {
          if (blog?._id === blogId) {
            blog.isActive = updatedStatus;
          }
          return blog;
        });
        setBlogs(updatedCategories);
        toast.success('Blogs status updated successfully');
      }
    } catch (error) {
      toast.error("Error updating Blogs status");
      console.error("Error updating Blogs status:", error);
    }
  };


  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head"><h4>All Blogs</h4></div>
        <div className="links">
          <Link to="/add-blog" className="add-new">
            Add Blog <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      {/* <div className="filteration">
        <div className="search">
          <label htmlFor="search">Search </label> &nbsp;
          <input type="text" name="search" id="search" placeholder="Search by name..." />
        </div>
      </div> */}

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              <th scope="col">Image</th>
              <th scope="col">Date</th>
              <th scope="col">Title</th>
              <th scope="col">Show in home page</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="8" className="text-center">Loading...</td></tr>
            ) : blogs.length > 0 ? (
              blogs.map((blog, index) => (
                <tr key={blog?._id} >
                  <th scope="row">{index + 1}</th>
                  <td><img src={`${serverURL}/${blog.blogImage}`} alt={blog.blogTitle} style={{ width: "100px", height: "auto" }} /></td>
                  <td>{formatDate(blog.date)}</td>
                  <td>{blog.blogTitle}</td>
                  <td><input type="checkbox" checked={blog?.isActive} onChange={(e) => handleCheckboxChange(e, blog?._id)} /></td>
                  <td>
                    <Link to={`/edit-blog/${blog?._id}`} className="bt edit">
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(blog?._id)} className="bt delete">
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No banners found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default Blog;
