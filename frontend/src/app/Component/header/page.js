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
import sidebarLogo from "../../Images/logo-white.jpg";

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
    { name: "explore-By-Diseases", link: "#explore-by-diseases" },
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
              <i onClick={toggleSidebar} style={{ cursor: "pointer", fontSize: '22px' }} className="bi bi-list"></i>
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
              <div className="d-flex  align-items-center login-cart">
                <Link href="/Pages/User_Profile" className="text-decoration-none">
                  Profile
                </Link> |
                <div className="d-flex align-items-center position-relative">
                  <i onClick={cartToggle} className="bi bi-cart3 cart-icon fs-3" style={{ cursor: "pointer" }} ></i>
                  <div
                    className="position-absolute top-0 start-100 translate-middle badge rounded-circle"
                    style={{ backgroundColor: "#722f7f", color: "#fff", fontSize: "0.5rem", padding: "5px", }}>
                    {cart?.length}
                  </div>
                </div>
              </div>
            ) : (
              <div className="d-flex  align-items-center login-cart">
                <Link href="/Pages/Login" className="text-decoration-none">Log in</Link> |
                <div className="d-flex align-items-center position-relative">
                  <i onClick={cartToggle} className="bi bi-cart3 cart-icon fs-3" style={{ cursor: "pointer" }} ></i>
                  <div
                    className="position-absolute top-0 start-100 translate-middle badge rounded-circle"
                    style={{ backgroundColor: "#722f7f", color: "#fff", fontSize: "0.5rem", padding: "5px", }}>
                    {cart?.length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className={`cartSidebar ${cartSidebar ? "active" : ""}`}>
        <div className="cart-close-btn">
          <h4>SHOPPING CART</h4>
          <span onClick={cartToggle}>
            <i className="bi bi-x-octagon"></i>
          </span>
        </div>

        <div className="shopping-cart">
          <div className="cart-item" style={{ flexDirection: "column" }}>
            {cart?.map((item, index) => {
              const parsedItem = JSON.parse(item?.item);

              return (
                <div key={item._id} style={{ marginBottom: "40px", borderBottom: "1px solid #eee", paddingBottom: "20px" }}>
                  <p style={{ margin: '0 0 6px', fontWeight: 'bold', fontSize: '16px' }}>
                    {item?.product?.productName}
                  </p>

                  <p style={{ margin: '4px 0', fontSize: '14px', color: '#555' }}>
                    {parsedItem?.day} | {parsedItem?.bottle}
                  </p>

                  {/* Tag if needed */}
                  {/* {parsedItem?.tagType?.tagName && (
              <p className="bestseller">⭐ {parsedItem?.tagType?.tagName}</p>
            )} */}

                  <div className="price" style={{ margin: '8px 0', fontSize: '14px' }}>
                    <span className="original-price" style={{ textDecoration: 'line-through', color: '#999', marginRight: '8px' }}>
                      ₹ {(parsedItem?.price * item?.quantity).toFixed(2)}
                    </span>
                    <span style={{ color: '#e53935', fontWeight: 'bold' }}>
                      ₹ {(parsedItem?.finalPrice * item?.quantity).toFixed(2)}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#777', marginBottom: '10px' }}>
                    Save ₹{((parsedItem?.price - parsedItem?.finalPrice) * item?.quantity).toFixed(2)} |
                    Discount {parsedItem?.discountPrice?.toFixed(2)}%
                  </div>

                  <div style={{ display: 'flex',  justifyContent: 'space-between', alignItems: 'center' }}>
                    <div  style={{display:'flex',alignItems:'center', width:'25%'}}>
                      <button
                        disabled={item?.quantity <= 1}
                        onClick={() => updateQuantity("decrement", index)}
                        className="decrease"
                      >
                        -
                      </button>
                      <span className="count">{item?.quantity}</span>
                      <button
                        onClick={() => updateQuantity("increment", index)}
                        className="increase"
                      >
                        +
                      </button>
                    </div>

                    <button onClick={() => handleRemoveItem(item)} className="delete-btn mt-2">
                      <i className="bi bi-trash" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-footer">
            <div
              onClick={() => {
                if (userData?._id) { cart.length > 0 ? router.push(`/Pages/Checkout/${userData._id}`) : router.push(`/Pages/products`); } else { router.push(`/Pages/Login`); }
              }}>
              <button className="checkout-btn">CHECKOUT</button>
            </div>

            <button onClick={() => router.push(`/Pages/products`)} className="shop-more-btn">
              SHOP MORE
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <div className="close-btn" onClick={toggleSidebar}>
          <Image className="sidebar-logo" src={sidebarLogo} alt="logo-main" />
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