import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getData, postData, serverURL } from '../../services/FetchNodeServices';
import { Parser } from "html-to-react";

const AllProduct = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch all products
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const response = await getData("api/products/all-product");
                console.log(response);
                if (response.success === true) {
                    setProducts(response?.products || []);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                toast.error("Failed to fetch products!");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Handle product deletion
    const handleDelete = async (productId) => {
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
                const data = await getData(`api/products/delete-product/${productId}`);
                if (data.success === true) {
                    setProducts(products.filter(product => product._id !== productId));
                    toast.success("Product deleted successfully!");
                }
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Failed to delete product!");
            }
        }
    };


    const handleCheckboxwellnessKitsChange = async (e, productId) => {
        const updatedStatus = e.target.checked;

        try {
            const response = await postData('api/products/change-status-wellnessKits', {
                productId: productId,
                wellnessKits: updatedStatus
            });

            if (response.success === true) {
                // Update the status in the local state correctly
                const updatedProducts = products.map(product => {
                    if (product._id === productId) {
                        return { ...product, wellnessKits: updatedStatus }; // Correctly update the product object
                    }
                    return product; // Don't mutate other products, just return the updated one
                });

                setProducts(updatedProducts); // Set the updated products state
                toast.success('Product wellness Kits status  updated successfully');
            }
        } catch (error) {
            toast.error("Error updating category status");
            console.error("Error updating category status:", error);
        }
    };

    const handleCheckboxChange = async (e, productId) => {
        const updatedStatus = e.target.checked;

        try {
            const response = await postData('api/products/change-status', {
                productId: productId,
                isActive: updatedStatus
            });

            if (response.success === true) {
                // Update the status in the local state correctly
                const updatedProducts = products.map(product => {
                    if (product._id === productId) {
                        return { ...product, isActive: updatedStatus }; // Correctly update the product object
                    }
                    return product; // Don't mutate other products, just return the updated one
                });

                setProducts(updatedProducts); // Set the updated products state
                toast.success('Product status updated successfully');
            }
        } catch (error) {
            toast.error("Error updating category status");
            console.error("Error updating category status:", error);
        }
    };

    // Filter products based on search
    const filteredProducts = products.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    console.log("Filtered Products:", filteredProducts);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Product List</h4>
                </div>
                <div className="links">
                    <Link to="/add-product" className="add-new">
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

            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>Product Name</th>
                            <th>Product Image</th>
                            <th>Product Description</th>
                            <th>Product Sub Description</th>
                            <th>show in  HomePage</th>
                            <th>show Wellness Kits in Home</th>
                            <th>Product Price</th>
                            <th>Product Discount</th>
                            <th>Product Final Price</th>
                            <th>Product Selected Days</th>
                            <th>Product Selected Bottles</th>
                            <th>Product Tax</th>
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
                        ) : filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    No products found.
                                </td>
                            </tr>
                        ) : (
                            filteredProducts?.map((product, index) => (
                                <tr key={product._id}>
                                    <td>{index + 1}</td>
                                    <td>{product?.productName}</td>
                                    <td>
                                        {product?.productImages?.slice(0, 4)?.map((image, imgIndex) => (
                                            <img
                                                key={imgIndex}
                                                src={`${serverURL}/uploads/products/${image}`}
                                                alt="Product"
                                                style={{ width: "50px", height: "50px", objectFit: "cover", marginRight: "5px" }}
                                            />
                                        ))}
                                    </td>
                                    <td>{Parser().parse(product?.productDescription)}</td>
                                    <td>{Parser().parse(product?.productSubDescription)}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={product?.isActive}
                                            onChange={(e) => handleCheckboxChange(e, product?._id)}
                                        />
                                    </td>

                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={product?.wellnessKits}
                                            onChange={(e) => handleCheckboxwellnessKitsChange(e, product?._id)}
                                        />
                                    </td>
                                    <td>{product?.variant?.map((t) => <div>{t?.price}</div>)}</td>
                                    <td>{product?.variant?.map((t) => <div>{t?.discountPrice}</div>)}</td>
                                    <td>{product?.variant?.map((t) => <div>{t?.finalPrice}</div>)}</td>
                                    <td>{product?.variant?.map((t) => <div>{t?.day}</div>)}</td>
                                    <td>{product?.variant?.map((t) => <div>{t?.bottle}</div>)}</td>
                                    <td>{product?.variant?.map((t) => <div>{t?.tex}</div>)}</td>
                                    <td>
                                        <Link
                                            to={`/edit-product/${product._id}`}
                                            className="bt edit"
                                        >
                                            Edit <i className="fa-solid fa-pen-to-square"></i>
                                        </Link>
                                        &nbsp;
                                        <button
                                            onClick={() => handleDelete(product._id)}
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

            {/* FAQ Section */}
            {/* <section className="main-table">
                <div className="head">
                    <h4>All FAQ</h4>
                </div>
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>Question</th>
                            <th>Answer</th>
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
                                    No FAQ found.
                                </td>
                            </tr>
                        ) : (
                            filteredProducts?.map((product, index) => (
                                <tr key={product._id}>
                                    <td>{index + 1}</td>
                                    {product?.faqs?.map((faq, faqIndex) => (
                                        <React.Fragment key={faqIndex}>
                                            <td>{faq?.question}</td>
                                            <td>{faq?.answer}</td>
                                        </React.Fragment>
                                    ))}
                                    <td>
                                        <Link
                                            to={`/edit-product/${product._id}`}
                                            className="bt edit"
                                        >
                                            Edit <i className="fa-solid fa-pen-to-square"></i>
                                        </Link>
                                        &nbsp;
                                        <button
                                            onClick={() => handleDelete(product._id)}
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
            </section> */}

            {/* Blog Image Section */}
            {/* <section className="main-table">
                <div className="head">
                    <h4>All Blog Images</h4>
                </div>
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th>S No.</th>
                            <th>Blog Image</th>
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
                        ) : filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center">
                                    No Blog Images found.
                                </td>
                            </tr>
                        ) : (
                            filteredProducts?.map((product, index) => (
                                <tr key={product?._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {product?.blogImages?.map((image, imgIndex) => (
                                            <img
                                                key={imgIndex}
                                                src={`${serverURL}/uploads/products/${image}`}
                                                alt="Blog"
                                                style={{ width: "50px", marginRight: "5px" }}
                                            />
                                        ))}
                                    </td>
                                    <td>
                                        <Link
                                            to={`/edit-product/${product._id}`}
                                            className="bt edit"
                                        >
                                            Edit <i className="fa-solid fa-pen-to-square"></i>
                                        </Link>
                                        &nbsp;
                                        <button
                                            onClick={() => handleDelete(product._id)}
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
            </section> */}
        </>
    );
};

export default AllProduct;
