import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Swal from "sweetalert2";
import { getData } from "../../services/FetchNodeServices";

const NewsLetterForm = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                setIsLoading(true);
                const response = await getData("api/newsletter/get-all-newsLetter");

                console.log("ggggg", response);

                if (response?.success === true) {
                    setSubscribers(response?.newsletters);
                } else {
                    toast.error("Failed to load newsletter subscribers");
                }
            } catch (error) {
                toast.error("An error occurred while fetching subscribers");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscribers();
    }, []);

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "This will permanently remove the subscriber from the newsletter list!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                await getData(`api/newsletter/delete-newsletter/${id}`);
                setSubscribers(subscribers.filter((subscriber) => subscriber._id !== id));
                toast.success("Subscriber removed successfully");
            }
        } catch (error) {
            toast.error("Failed to remove the subscriber");
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Newsletter Subscribers</h4>
                </div>
                {/* <div className="links">
                    <Link to="/add-newsletter-subscriber" className="add-new">
                        Add Subscriber <i className="fa-solid fa-plus"></i>
                    </Link>
                </div> */}
            </div>

            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Email</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="text-center">Loading...</td>
                            </tr>
                        ) : subscribers.length > 0 ? (
                            subscribers.map((subscriber, index) => (
                                <tr key={subscriber._id}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{subscriber.name}</td>
                                    <td>{subscriber.email}</td>
                                    <td>{subscriber.phone}</td>
                                    <td>
                                        <button onClick={() => handleDelete(subscriber?._id)} className="bt delete">
                                            Remove <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No newsletter subscribers found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </>
    )
}

export default NewsLetterForm;
