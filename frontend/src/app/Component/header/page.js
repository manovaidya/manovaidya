"use client";
import React, { useEffect, useState } from "react";
import "./header.css";
import logo from "../../Images/logo.png";
import logo1 from "../../Images/logo1.png";
import Image from "next/image";
import Slider from "react-slick";
import Link from "next/link";
import { getData, postData } from "@/app/services/FetchNodeServices";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login } from '../../redux/slices/user-slice'

const Page = () => {
  // State Variables
  // const selector = useSelector
  const router = useRouter();
  const [cartSidebar, setCartSidebar] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [couponTitle, setCouponTitle] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch()
  const { carts } = useSelector(state => state.user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("User_data");
    const parsedUser = user ? JSON.parse(user) : null;

    const storedCartData = sessionStorage.getItem("carts");
    const parsedCartData = storedCartData ? JSON.parse(storedCartData) : [];
    setCart(parsedCartData);

    setUserToken(token);
    setUserData(parsedUser);
    setUserId(parsedUser?._id);

  }, [carts]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      router.push(`/Pages/products?searchTerm=${searchTerm}`);
    }
    // console.log("setSearchTerm", searchTerm);
  }, [searchTerm])

  // Cart Sidebar toggle handler
  const cartToggle = () => setCartSidebar(!cartSidebar);

  // Sidebar toggle handler
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Navigation menu items
  const navItems = [
    { name: "Home", link: "/" },
    { name: "About Us", link: "/Pages/aboutUs" },
    { name: "Products", link: "/Pages/products" },
    { name: "Blog", link: "/Pages/blog" },
    { name: "Mind Health Self-Test", link: "/Pages/mind-health" },
    { name: "Consultation & Customized Solution", link: "/Pages/consultationCustomizedSolution" },
    // { name: "Track Your Order", link: `/Pages/trackOrder/${userId}` },
  ];

  const handleRemoveItem = (item) => {
    console.log("item", item.product._id, cart[0].product._id);
    const updatedCart = cart.filter((cartItem) => cartItem.product._id !== item.product._id);
    console.log("item", updatedCart);
    sessionStorage.setItem("carts", JSON.stringify(updatedCart));
    setCart(updatedCart);
    dispatch(login({ cart: updatedCart }));

    Swal.fire({ title: "Item Removed!", text: "Your item has been removed from the cart.", icon: "success", confirmButtonText: "Okay", });
  };


  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const response = await postData("api/coupon/get-coupon-by-status", {
          status: true,
        });
        if (response?.success) setCouponTitle(response?.coupons || []);
      } catch (e) {
        console.log(e);
      }
    };
    fetchCoupon();
  }, []);


  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    // speed: 100,
    autoplaySpeed: 5000,
    cssEase: "linear"
  };

  const updateQuantity = (operation, index) => {
    const newCartItems = [...cart];
    if (operation === "increment") {
      newCartItems[index].quantity += 1;
    } else if (operation === "decrement" && newCartItems[index].quantity > 1) {
      newCartItems[index].quantity -= 1;
    }
    setCart(newCartItems);
    dispatch(login(newCartItems));
    sessionStorage.setItem("carts", JSON.stringify(newCartItems)); // Update sessionStorage
  };
  console.log("CXXXXXXXXXXX", cart)
  return (
    <>
      {/* Top Nav for Coupons */}
      <div className="top-nav">
        <div style={{ width: '100%', overflow: 'hidden' }}>
          <Slider {...settings}>
            {couponTitle?.map((item, index) => (
              <div key={index}>{item?.couponTitle}</div>
            ))}
          </Slider>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="nav-main">
        <div className="container">
          <div className="nav-logo-section">
            <div className="nav-menu-search">
              <i onClick={toggleSidebar} style={{ cursor: "pointer" }} className="bi bi-list"></i>
              <div className="searchbar">
                <input type="text" onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search" className="form-control m-0" />
                <i className="bi bi-search"></i>
              </div>
            </div>
            <div className="nav-logo">
              <Link href="/">
                <Image src={logo} width={200} alt="logo-main" />
              </Link>
            </div>
            {userToken ? (
              <div className="login-cart">
                <Link href="/Pages/User_Profile">Profile</Link>
                <i onClick={cartToggle} style={{ cursor: "pointer" }} className="bi bi-cart3"></i>
              </div>
            ) : (
              <div className="login-cart">
                <Link href="/Pages/Login">Log in</Link>
                <i onClick={cartToggle} style={{ cursor: "pointer" }} className="bi bi-cart3"></i>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className={`cartSidebar ${cartSidebar ? "active" : ""}`}>
        <div className="cart-close-btn">
          <h4>SHOPPING CART</h4>
          <span onClick={cartToggle}><i className="bi bi-x-octagon"></i></span>
        </div>
        <div className="shopping-cart">
          <div className="cart-item" style={{ flexDirection: "column" }}>
            {cart?.map((item, index) => (
              <div key={item._id} style={{ flexDirection: "column" }}>
                <p className="m-0"><b>{item?.product?.productName}</b></p>
                <p>{JSON.parse(item?.item)?.day} | {JSON.parse(item?.item)?.bottle} | ₹5 / tablet</p>
                <p className="bestseller">⭐ Bestseller</p>
                <p className="price">
                  <span className="original-price">₹{JSON.parse(item?.item)?.price * item?.quantity}</span> ₹{JSON.parse(item?.item)?.finalPrice * item?.quantity}
                </p>
                <div className="quantity">
                  <button disabled={item?.quantity <= 1} onClick={() => updateQuantity("decrement", index)} className="decrease">-</button>
                  <span className="count">{item?.quantity}</span>
                  <button onClick={() => updateQuantity("increment", index)} className="increase">+</button>
                </div>
                <button onClick={() => handleRemoveItem(item)} className="delete-btn mt-2">
                  <i className="bi bi-trash" />
                </button>
              </div>
            ))}
          </div>
          <div className="cart-footer">
            <div onClick={() => userData?._id ? cart.length > 0 ? router.push(`/Pages/Checkout/${userData?._id}`) : router.push(`/Pages/products`) : router.push(`/Pages/Login`)} >
              <button className="checkout-btn">CHECKOUT</button>
            </div>
            <div onClick={() => router.push(`/Pages/products`)}></div>
            <button className="shop-more-btn">SHOP MORE</button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <div className="close-btn" onClick={toggleSidebar}>
          <Image src={logo} width={100} alt="logo-main" />
          <i className="bi bi-x-octagon"></i>
        </div>
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <Link href={item.link} onClick={toggleSidebar}>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div>
          <div className="d-flex align-items-center">
            <ul className="nav">
              {navItems.map((item, index) => (
                <li key={index} className="nav-item">
                  <Link href={item.link} className="nav-link">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div>
              <Image src={logo1} width={130} alt="logo-main" />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Page;
