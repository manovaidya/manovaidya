import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getData, serverURL } from '../../services/FetchNodeServices';
import { Parser } from "html-to-react";


export default function AllHerbs() {
    const [herbs, setHerbs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch all products
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await getData("api/herbs/get-all-herbs");
                console.log(response)
                if (response?.status === true) {
                    setHerbs(response?.data || []);
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
    console.log("herbsherbsherbs:=", herbs)
    // Handle product deletion
    const handleDelete = async (herbsId) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        });

        if (confirm.isConfirmed) {
            try {
                const data = await getData(`api/herbs/delete-herbs/${herbsId}`);
                if (data.success === true) {

                }
                setHerbs(herbs.filter(herbs => herbs._id !== herbsId));
                toast.success("Product deleted successfully!");
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Failed to delete product!");
            }
        }
    };

    // Filter products based on search
    const filteredProducts = herbs.filter((herb) =>
        herb.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (<>
        <ToastContainer />
        <div className="bread">
            <div className="head">
                <h4>All Herbs For Natural List</h4>
            </div>
            <div className="links">
                <Link to="/add-herbs" className="add-new">
                    Add New <i className="fa-solid fa-plus"></i>
                </Link>
            </div>
        </div>

        {/* <div className="filteration">
            <div className="search">
                <label htmlFor="search">Search</label> &nbsp;
                <input
                    type="text"
                    name="search"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div> */}



        {/* All Herbs For Natural */}
        <section className="main-table">
            <div className="head">
                <h4>All Herbs For Natural</h4>
            </div>
            <table className="table table-bordered table-striped table-hover">
                <thead>
                    <tr>
                        <th>S No.</th>
                        <th>Name</th>
                        <th>Image </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="8" className="text-center">
                                Loading...
                            </td>
                        </tr>
                    ) : filteredProducts?.length === 0 ? (
                        <tr>
                            <td colSpan="8" className="text-center">
                                No Herbs For Natural found.
                            </td>
                        </tr>
                    ) : (
                        filteredProducts?.map((product, index) => (
                            <tr key={product._id}>
                                <td>{index + 1}</td>
                                <td>{product?.name}</td>
                                <td>
                                    {product.images?.map((image, imgIndex) => (
                                        <img
                                            key={imgIndex}
                                            src={`${serverURL}/uploads/herbs/${image}`}
                                            alt="Product"
                                            style={{ width: "50px", marginRight: "5px" }}
                                        />
                                    ))}
                                </td>
                                <td>
                                    <Link
                                        to={`/edit-Herbs/${product?._id}`}
                                        className="bt edit"
                                    >
                                        Edit <i className="fa-solid fa-pen-to-square"></i>
                                    </Link>
                                    &nbsp;
                                    <button
                                        onClick={() => handleDelete(product?._id)}
                                        className="bt delete"
                                    >
                                        Delete <i className="fa-solid fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </section>
    </>)
}