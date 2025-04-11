import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getData, postData } from '../../services/FetchNodeServices';

const AllConsultDoctor = () => {
    const [urls, setUrls] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState(""); // for search functionality

    // Fetch URLs on mount
    useEffect(() => {
        const fetchUrls = async () => {
            try {
                const response = await getData('api/url/get-All-url');
                console.log("Fetched Consultations:", response.consultations);

                if (response.status === true) {
                    setUrls(response?.consultations);
                }
            } catch (error) {
                toast.error('Error fetching URLs');
                console.error('Error fetching URLs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUrls();
    }, []);

    // Handle Delete Action
    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirmDelete.isConfirmed) {
            try {
                const response = await getData(`api/url/delete-url/${id}`);
                if (response.status === true) {
                    setUrls(urls.filter(url => url._id !== id)); // Update the state after deleting
                    Swal.fire('Deleted!', 'Your URL has been deleted.', 'success');
                }
            } catch (error) {
                Swal.fire('Error!', 'There was an error deleting the URL.', 'error');
                console.error('Error deleting URL:', error);
            }
        }
    };

    // Handle status checkbox change
    const handleCheckboxChange = async (e, urlId) => {
        const updatedStatus = e.target.checked;

        try {
            const response = await postData('api/url/change-status', {
                urlId: urlId,
                status: updatedStatus,
            });

            if (response.status === true) {
                const updatedUrls = urls.map(url => {
                    if (url._id === urlId) {
                        url.isActive = updatedStatus;  // Make sure the field name is isActive
                    }
                    return url;
                });
                setUrls(updatedUrls);
                toast.success('URL status updated successfully');
            }
        } catch (error) {
            toast.error("Error updating URL status");
            console.error("Error updating URL status:", error);
        }
    };

    // Handle Search Change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter URLs based on search query
    const filteredUrls = urls.filter(url =>
        url?.urls?.toLowerCase().includes(searchQuery.toLowerCase()) // Handle case-sensitive search safely
    );

    // Loading state
    if (isLoading) {
        return <p>Loading URLs...</p>;
    }

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Consult Doctor Advice URLs</h4>
                </div>
                <div className="links">
                    <Link to="/add-consult-doctor" className="add-new">
                        Add New <i className="fa-solid fa-plus"></i>
                    </Link>
                </div>
            </div>

            {/* <div className="filteration">
                <div className="search">
                    <label htmlFor="search">Search</label>&nbsp;
                    <input
                        type="text"
                        name="search"
                        id="search"
                        value={searchQuery}
                        onChange={handleSearchChange} // Handle search input change
                        placeholder="Search by URL"
                    />
                </div>
            </div> */}

            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">URL</th>
                            <th scope="col">Status</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUrls.length > 0 ? (
                            filteredUrls.map((url, index) => (
                                <tr key={url._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{url?.urls}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={url?.isActive}  // Updated field to isActive
                                            onChange={(e) => handleCheckboxChange(e, url._id)}
                                        />
                                    </td>
                                    <td>
                                        <Link to={`/edit-consult-doctor/${url?._id}`} className="bt edit">
                                            Edit <i className="fa-solid fa-pen-to-square"></i>
                                        </Link>
                                    </td>
                                    <td>
                                        <button className="bt delete" onClick={() => handleDelete(url?._id)}>
                                            Delete <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No URLs found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default AllConsultDoctor;
