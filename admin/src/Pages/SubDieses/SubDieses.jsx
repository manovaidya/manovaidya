import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getData, postData, serverURL } from '../../services/FetchNodeServices';

const SubDiseases = () => {
  const [diseases, setDiseases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        setIsLoading(true);
        const response = await getData('api/subcategories/get-all-sub-diseases');
        if (response.success) {
          setDiseases(response.subcategories);
        } else {
          toast.error("Failed to load sub diseases");
        }
      } catch (error) {
        toast.error("An error occurred while fetching sub diseases");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiseases();
  }, []);

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const data = await getData(`api/subcategories/delete-sub-disease/${id}`);
        if (data?.success) {
          // Remove deleted disease from the state directly
          setDiseases(diseases.filter(disease => disease._id !== id));
          toast.success("Sub disease deleted successfully");
        }
      }
    } catch (error) {
      toast.error("Failed to delete the sub disease");
    }
  };

  const handleCheckboxChange = async (e, diseaseId) => {
    const updatedStatus = e.target.checked;

    try {
      const response = await postData('api/subcategories/change-status', {
        diseaseId,
        isActive: updatedStatus
      });

      if (response.success) {
        // Update the disease status in the state
        setDiseases(prevDiseases =>
          prevDiseases.map(disease =>
            disease._id === diseaseId ? { ...disease, isActive: updatedStatus } : disease
          )
        );
        toast.success('Sub disease status updated successfully');
      }
    } catch (error) {
      toast.error("Error updating sub disease status");
      console.error("Error updating sub disease status:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="bread">
        <div className="head">
          <h4>All Sub Diseases</h4>
        </div>
        <div className="links">
          <Link to="/add-sub-diseases" className="add-new">
            Add New <i className="fa-solid fa-plus"></i>
          </Link>
        </div>
      </div>

      <section className="main-table">
        <table className="table table-bordered table-striped table-hover">
          <thead>
            <tr>
              <th scope="col">Sr.No.</th>
              <th scope="col">Disease Name</th>
              <th scope="col">Image</th>
              <th scope="col">Product</th>
              <th scope="col">Show in Home Page</th>
              <th scope="col">Edit</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="text-center">Loading...</td>
              </tr>
            ) : diseases.length > 0 ? (
              diseases.map((disease, index) => {
                const { _id, name, image, productId, isActive } = disease;
                return (
                  <tr key={_id}>
                    <th scope="row">{index + 1}</th>
                    <td>{name}</td>
                    <td>
                      <img
                        src={`${serverURL}/uploads/subcategorys/${image}`}
                        alt={name}
                        style={{ width: '100px', height: 'auto' }}
                      />
                    </td>
                    <td>{productId?.map(item => <div key={item._id}>{item.productName}</div>)}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => handleCheckboxChange(e, _id)}
                      />
                    </td>
                    <td>
                      <Link to={`/edit-sub-diseases/${_id}`} className="bt edit">
                        Edit <i className="fa-solid fa-pen-to-square"></i>
                      </Link>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(_id)}
                        className="bt delete"
                      >
                        Delete <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No sub diseases found</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </>
  );
};

export default SubDiseases;
