"use client";

import "./addCart.css";
import Swal from "sweetalert2";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../../redux/slices/user-slice";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { serverURL } from "@/app/services/FetchNodeServices";

const CartPage = ({ params }) => {
    const { id } = use(params); // Access the id directly from params
    const dispatch = useDispatch();
    const { carts } = useSelector((state) => state?.user);
    const [userData, setUserData] = useState(null);
    const [cart, setCart] = useState([]);

    const router = useRouter();

    // Fetch user data and cart data from local/session storage
    useEffect(() => {
        const storedUserData = localStorage?.getItem("User_data");
        const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
        setUserData(parsedUserData);

        const storedCartData = sessionStorage?.getItem("carts");
        const parsedCartData = storedCartData ? JSON.parse(storedCartData) : [];
        setCart(parsedCartData);
    }, [carts]);

    // Calculate total price of cart items
    const calculateTotal = () => {

        return cart?.reduce((total, item) => {
            const price = JSON.parse(item?.item)?.finalPrice;
            const quantity = item?.quantity || 0;
            return total + (price * quantity);
        }, 0).toFixed(2);
    };

    // console.log("CARAT", cart.map((i) => JSON.parse(i?.item).finalPrice * i?.quantity))
    // Calculate tax (18%)
    const calculateTax = () => {
        const totalPrice = parseFloat(calculateTotal());
        return (totalPrice * 0.18).toFixed(2);
    };

    // Calculate total price including tax
    const totalWithTax = () => {
        const totalPrice = parseFloat(calculateTotal());
        const tax = totalPrice * 0.18;
        return (totalPrice + tax + 75).toFixed(2);
    };

    const updateQuantity = (operation, index) => {
        const newCartItems = [...cart];
        if (operation === "increment") {
            newCartItems[index].quantity += 1;
        } else if (operation === "decrement" && newCartItems[index]?.quantity > 1) {
            newCartItems[index].quantity -= 1;
        }
        setCart(newCartItems);
        dispatch(login({ cart: newCartItems }));
        sessionStorage?.setItem("carts", JSON.stringify(newCartItems)); // Update sessionStorage
    };



    const handleRemoveItem = (item) => {
        console.log("item", item?.product?._id, cart[0]?.product?._id);
        const updatedCart = cart?.filter((cartItem) => cartItem?.product?._id !== item?.product?._id);
        console.log("item", updatedCart);
        sessionStorage.setItem("carts", JSON.stringify(updatedCart));
        setCart(updatedCart);
        dispatch(login({ cart: updatedCart }));
        Swal.fire({ title: "Item Removed!", text: "Your item has been removed from the cart.", icon: "success", confirmButtonText: "Okay", });
    };

    return (
        <div className="container mt-3">
            <div className="row">
                <div className="heading">
                    <h1>Your Cart</h1>
                </div>
            </div>

            <div className="row">
                <div className="col-md-8">
                    <div className="cart-item-data-container" >
                        <h4>Cart Items</h4>
                        <hr />
                        {cart?.length === 0 ? (
                            <div className="text-center">
                                <h5>Your cart is empty</h5>
                                <Link
                                    href="/Pages/products"
                                    className="btn"
                                    style={{ backgroundColor: "#050f3d", color: "#fff" }}
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        ) : (
                            cart?.map((item, index) => (
                                <div
                                    className="cart-item-data"
                                    style={{ margin: "5px 0px" }}
                                    key={item?._id}
                                >
                                    <div className="cart-product-image" style={{ width: "15%" }}>
                                        <img
                                            src={`${serverURL}/uploads/products/${item?.product?.productImages[0]}`}
                                            alt={item?.product?.productName}
                                        />
                                    </div>
                                    <div style={{ width: "30%" }}>
                                        <h4>{item?.product?.productName}</h4>
                                    </div>
                                    <div
                                        style={{
                                            display: "flex",
                                            width: "10%",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <button
                                            style={{
                                                padding: 5,
                                                fontWeight: 500,
                                                fontSize: "1.5rem",
                                                background: "#a665b3",
                                                border: "none",
                                                borderRadius: "5px",
                                                color: "#fff",
                                            }}
                                            onClick={() => updateQuantity("decrement", index)}
                                            disabled={item?.quantity <= 1}
                                            className="quantity"
                                        >
                                            &#8722;
                                        </button>
                                        <span style={{ padding: 5, fontWeight: 500, fontSize: "1.5rem" }}>
                                            {item?.quantity}
                                        </span>
                                        <button
                                            style={{
                                                padding: 5,
                                                fontWeight: 500,
                                                fontSize: "1.5rem",
                                                background: "#a665b3",
                                                border: "none",
                                                borderRadius: "5px",
                                                color: "#fff",
                                            }}
                                            className="quantity"
                                            onClick={() => updateQuantity("increment", index)}
                                        >
                                            &#43;
                                        </button>
                                    </div>
                                    <div className="cart-product-price" style={{ width: "18%" }}>
                                        <h4>₹{(parseFloat(JSON.parse(item?.item)?.finalPrice) * item?.quantity).toFixed(2)}</h4>
                                    </div>
                                    <div className="cart-product-delete">
                                        <button
                                            onClick={() => handleRemoveItem(item)}
                                            className="border-0 bg-white"
                                        >
                                            <i className="bi bi-trash3 text-danger"></i>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                        <hr />
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="cart-price-data">
                        <div className="subtotal">
                            <h4>Subtotal: </h4>
                            <h4>
                                <i className="bi bi-currency-rupee"></i>
                                {calculateTotal()}
                            </h4>
                        </div>
                        <hr />
                        <div className="subtotal">
                            <h4>Tax:</h4>
                            <h4>
                                <i className="bi bi-currency-rupee"></i>
                                {calculateTax()}
                            </h4>
                        </div>
                        <hr />
                        <div className="subtotal">
                            <h4>Shipping:</h4>
                            <h4>
                                <i className="bi bi-currency-rupee"></i>
                                75
                            </h4>
                        </div>
                        <hr />
                        <div className="subtotal">
                            <h4>Total:</h4>
                            <h4>
                                <i className="bi bi-currency-rupee"></i>
                                {totalWithTax()}
                            </h4>
                        </div>
                        <div className="cart-payment">
                            <button onClick={() => userData?._id ? router.push(`/Pages/Checkout/${userData?._id}`) : router.push(`/Pages/Login`)} className="payment-confirm" style={{ background: "#a665b3" }}>
                                Confirm Order
                            </button>
                            <Link href="/Pages/products">
                                <button className="continue-shopping">Continue Shopping</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
