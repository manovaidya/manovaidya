import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { getData, postData } from "../../services/FetchNodeServices";
import { Parser } from "html-to-react";
import Swal from "sweetalert2";

const ViewTest = () => {
  const [mindTest, setMindTest] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [search, setSearch] = useState('');

  // Function to fetch data based on pagination and search
  const fetchMindTest = async () => {
    try {
      setIsLoading(true);
      const response = await postData('api/test/get-mind-test', { page: currentPage, limit: pageLimit, search });
      console.log("xxxxxxx", response);
      if (response.status === true) {
        setMindTest(response?.data.reverse());
        setTotalPages(response?.pagination?.totalPages);
      } else {
        toast.error("Failed to load mind health tests");
      }
    } catch (error) {
      toast.error("An error occurred while fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMindTest();
  }, [currentPage, pageLimit, search]);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      });

      if (result.isConfirmed) {
        // Replace with the correct delete endpoint
        const deleteResponse = await postData(`api/test/delete-mindTest/${id}`);
        if (deleteResponse.status) {
          setMindTest(mindTest.filter((test) => test._id !== id));
          toast.success("Test deleted successfully");
        } else {
          toast.error("Failed to delete the test");
        }
      }
    } catch (error) {
      toast.error("An error occurred while deleting the test");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);  // Reset to first page when search changes
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>Mental Health Self Test</h4>
        </div>
        <div className="links">
          <Link to="/add-test" className="add-new">
            Add Test <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      {/* <div className="filteration">
        <div className="search">
          <label htmlFor="search">Search </label> &nbsp;
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search by name..."
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div> */}

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              <th scope="col">Test Heading</th>
              <th scope="col">Test Points</th>
              <th scope="col">Background Color</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : mindTest.length > 0 ? (
              mindTest.map((test, index) => (
                <tr key={test._id}>
                  <th scope="row">{(currentPage - 1) * pageLimit + index + 1}</th>
                  <td>{test.addHeaderTitle}</td>
                  <td>{Parser().parse(test.keyPoint)}</td>
                  <td>{test.themeColor}</td>

                  <td>
                    <Link to={`/Edit-test/${test._id}`} className="bt edit">
                      Edit <i className="fa-solid fa-pen-to-square"></i>
                    </Link>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(test._id)}
                      className="bt delete"
                    >
                      Delete <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No Test found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Pagination controls */}
      {/* <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>{`Page ${currentPage} of ${totalPages}`}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div> */}
    </>
  );
};

export default ViewTest;
