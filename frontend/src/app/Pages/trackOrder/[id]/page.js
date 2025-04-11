"use client";

import React, { use, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getData, serverURL } from "@/app/services/FetchNodeServices"; // Ensure you have the correct import for your fetch function
import { useRouter } from "next/navigation";

const EditOrder = ({ params }) => {
    const { id } = use(params); // Get the order ID from params directly
    const router = useRouter();
    const [orderData, setOrderData] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        const userData = localStorage?.getItem("User_data");
        setIsLoggedIn(userData ? true : false);
    }, []);

    useEffect(() => {
        if (isLoggedIn === false) {
            router.push("/Pages/Login");
            return;
        }

        if (id) {
            getApiData();
        }
    }, [id, isLoggedIn]);

    // Fetch API data
    const getApiData = async () => {
        try {
            const res = await getData(`api/orders/get-order-by-user-id/${id}`);
            console.log("DATA", res);
            if (res?.success === true && res?.orders?.length > 0) {
                const order = res.orders[0]; // Assuming there's only one order in the list
                setOrderData(order);
                setPaymentStatus(order.isPaid ? "Success" : "Pending");
            } else {
                toast.error("No order found.");
            }
        } catch (error) {
            console.error("Error fetching order data:", error);
            toast.error("Failed to fetch order data.");
        }
    };

    if (!orderData) {
        return (
            <div className="container mt-5" style={{ textAlign: "center" }}>
                <p>Loading order details...</p>
            </div>
        );
    }

    return (
        <>
            {id ? (
                <div className="py-3">
                    <div className="container">
                    <div className="bread p-3">
                        <div className="head">
                            <h4>Order Details</h4>
                        </div>
                        <div className="links">
                            <button className="btn btn-outline-secondary" onClick={() => router.push("/Pages/User_Profile")}                            >
                                Back <i className="fa fa-arrow-left"></i>
                            </button>
                        </div>
                    </div>
                    </div>

                    <div className="container mt-3">
                        <div className="row">
                            <div className="col-lg-8">
                                <div className="card">
                                    <div style={{backgroundColor:"var(--purple)"}} className="card-header text-white">
                                        <h5 className="card-title m-0">Order Details</h5>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <tbody>
                                                <tr>
                                                    <th scope="row">Order ID</th>
                                                    <td>{orderData?._id}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">User Name</th>
                                                    <td>{orderData?.user?.name}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Email</th>
                                                    <td>{orderData?.user?.email}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Phone Number</th>
                                                    <td>{orderData?.user?.phone}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Address</th>
                                                    <td>
                                                        {orderData?.shippingAddress?.addressLine1},{" "}
                                                        {orderData?.shippingAddress?.addressLine2},{" "}
                                                        {orderData?.shippingAddress?.city},{" "}
                                                        {orderData?.shippingAddress?.state},{" "}
                                                        {orderData?.shippingAddress?.pinCode}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Order Date</th>
                                                    <td>{new Date(orderData?.createdAt).toLocaleString()}</td>
                                                </tr>
                                                {orderData?.couponDiscount && (
                                                    <tr>
                                                        <th scope="row">Coupon Discount</th>
                                                        <td>{orderData?.couponDiscount}%</td>
                                                    </tr>
                                                )}
                                                <tr>
                                                    <th scope="row">Final Price</th>
                                                    <td>₹{orderData?.totalAmount}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Order Status</th>
                                                    <td>
                                                        <select disabled className="form-select" value={orderData?.status}                                                        >
                                                            <option value="orderConfirmed">Order Confirmed</option>
                                                            <option value="processing">Processing</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Payment Mode</th>
                                                    <td>{orderData?.paymentMethod}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Payment Id</th>
                                                    <td>{orderData?.payment_id}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Payment Status</th>
                                                    <td>
                                                        <select disabled className="form-select" value={paymentStatus}                                                        >
                                                            <option value="Pending">Pending</option>
                                                            <option value="Success">Success</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 mt-3">
                                <div className="card" style={{ height: "100%", overflowY: "scroll", overflowX: "hidden", position: "relative", }}                                >
                                    <div style={{backgroundColor:"var(--purple)"}} className="card-header text-white">
                                        <h5 className="card-title m-0">Ordered Items</h5>
                                    </div>
                                    <div className="card-body">
                                        {orderData?.orderItems && orderData?.orderItems?.length > 0 ? (
                                            orderData?.orderItems.map((item, index) => (
                                                <div key={index}>
                                                    <div key={index} className="mb-3">
                                                        <strong>{item?.productId?.productName}</strong>
                                                        <br />
                                                        <p className="mb-1">Quantity: {item?.quantity}</p>
                                                        <p className="mb-1">
                                                            Price: ₹{item?.productId?.variant[0]?.finalPrice}
                                                        </p>
                                                        <p className="mb-1">
                                                            Delivery Period: {item?.productId?.variant[0]?.day ||
                                                                "20 days"}
                                                        </p>
                                                        <p className="mb-0">
                                                            Bottle Quantity: {item?.quantity}
                                                        </p>
                                                        <img
                                                            src={`${serverURL}/uploads/products/${item?.productId?.productImages[0]}`}
                                                            alt={item?.productId?.productName}
                                                            style={{
                                                                width: "100px",
                                                                height: "100px",
                                                                marginTop: "10px",
                                                            }}
                                                        />
                                                        <hr />
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No items in the cart.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                router.push("/Pages/Login")
            )}

            <ToastContainer />
        </>
    );
};

export default EditOrder;
