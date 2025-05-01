"use client";
import React, { useEffect, useState } from "react";
import "./hero.css";
import Link from "next/link";
import { getData, serverURL } from "@/app/services/FetchNodeServices";
import { Parser } from "html-to-react";
import Slider from "react-slick";
import { toast } from 'react-toastify';

// ⚠️ Fix: Declare the HTML parser once (otherwise it may cause errors in render loop)
const htmlParser = new Parser();

const Page = ({ title }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [diseases, setDiseases] = useState([]);

  const fetchAllDisease = async () => {
    try {
      const response = await getData('api/subcategories/get-all-sub-diseases');
      if (response?.success === true) {
        // alert("fetchAllDisease")
        const activeDiseases = response?.subcategories?.filter(item => item?.isActive);
        setDiseases(activeDiseases);
      } else {
        // toast.error("Failed to load sub diseases server error");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching sub diseases");
    }
  };

  const fetchProduct = async () => {
    try {
      const data = await getData('api/products/all-product');
      if (data?.success === true) {
        // alert("fetchProduct")
        const activeProducts = data?.products?.filter(p => p?.wellnessKits === true);
        setProducts(activeProducts || []);
      } else {
        // toast.error("Failed to load products");
      }
    } catch (error) {
      console.error(error);
      // toast.error("An error occurred while fetching products");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getData('api/categories/get-All-category');
      console.log("XXXXXXXXXXX:--X:--", response)
      if (response?.success === true) {
        // alert("fetchCategories")
        const activeCategories = response?.categories?.filter(c => c?.isActive);
        setCategories(activeCategories);
      } else {
        // toast.error("Failed to load categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error loading categories");
    }
  };

  useEffect(() => {
    fetchAllDisease();
    fetchCategories();
    fetchProduct();
  }, []);

  const CustomNextArrow = ({ onClick }) => (
    <div className="custom-slider-arrow custom-next-arrow" onClick={onClick}>
      <i className="bi bi-arrow-right"></i>
    </div>
  );

  const CustomPrevArrow = ({ onClick }) => (
    <div className="custom-slider-arrow custom-prev-arrow" onClick={onClick}>
      <i className="bi bi-arrow-left"></i>
    </div>
  );

  const settings = {
    autoplay: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3, slidesToScroll: 1 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 1 }
      }
    ],
  };

  return (
    <>
      {/* Sidebar Buttons */}
      <section className="sidebutton">
        <a href="/"><i className="bi bi-arrow-up-circle"></i></a>
      </section>

      <section className="sidewhatsapp">
        <a target="_blank" href="https://wa.me/+919131734930" rel="noopener noreferrer">
          <i className="bi bi-whatsapp"></i>
        </a>
      </section>

      <section className="sidecall">
        <a href="tel:+919131734930">
          <i className="bi bi-telephone"></i>
        </a>
      </section>

      <section className="sideInstagram">
        <a href="https://www.instagram.com/silent_lover_aasib_mp07" target="_blank" rel="noopener noreferrer">
          <i className="bi bi-instagram"></i>
        </a>
      </section>

      {/* Category Slider */}
      <section className="top-cards-slider">
        <h2 className="text-center" style={{ fontWeight: '700', color: 'var(--purple)', marginBottom: '1rem', marginTop: '1rem' }}>
          Explore Our Treatments by Health Condition
        </h2>
        <div className="container-fluid" style={{ overflow: 'hidden' }}>
          {categories?.length > 0 && <Slider {...settings}>
            {categories?.map((card, index) => (
              <div className="card-slide" key={index}>
                <Link className="text-decoration-none" href={`/Pages/product-tips/${card?._id}`}>
                  <div className="card-main">
                    <img
                      src={`${serverURL}/uploads/categorys/${card?.image}`}
                      alt={card?.categoryName}
                      className="card-image"
                      width={300}
                      height={200}
                    />
                    <p className="disease-responsive" style={{ color: 'black', fontWeight: '600' }}>{card?.categoryName}</p>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
          }

        </div>
      </section>

      {/* Products Section */}
      <section className="ayurved-product">
        <div className="container">
          <h2 className="text-center text-purple">Ayurvedic Wellness Kits</h2>
          {products?.length > 0 && <div className="row">
            {products?.map((kit, index) => (
              <div className="col-md-6 col-6 col-lg-4" key={index}>
                <Link className="pruduct-link-all" href={`/Pages/products/${kit?._id}`}>
                  <div className="product-card">
                    <div className="row align-items-center">
                      <div className="col-md-4">
                        <img
                          src={`${serverURL}/uploads/products/${kit?.productImages?.[0]}`}
                          alt={kit?.title}
                          className="card-img-top"
                          width={200}
                          height={200}
                          style={{ cursor: "pointer", borderRadius: '14px 14px 0px 0px' }}
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="product-card-details">
                          <h5>{kit?.productName}</h5>
                          <span className="descrip">
                            {kit?.productDescription ? htmlParser.parse(kit?.productDescription) : ""}
                          </span>
                          <div className="detail-sec">
                            <p className="off-price m-0">
                              <b style={{ fontSize: "14px" }}>
                                {kit?.variant?.[0]?.discountPrice} % off
                              </b>
                            </p>
                            <span className="final-price">
                              ₹ {kit?.variant?.[0]?.finalPrice}
                            </span>
                            <p className="del-mrp">
                              MRP: <del>₹ {kit?.variant?.[0]?.price}</del>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>}

        </div>
      </section>

      <section className="product-overview-bg">
        <Link href="/Pages/products">
          <button className="buy-now">Buy It Now</button>
        </Link>
      </section>

      {/* Diseases Section */}
      <section className="MentalHealthCards">
        <div className="container">
          <div className="row justify-content-center">
            {diseases?.length > 0 && diseases?.map((item, index) => (
              <div className="col-lg-2 col-md-4 col-6 health_cards_main" key={index}>
                <Link href={{ pathname: `/Pages/products`, query: { id: item?._id, title: 'subDiseas' } }}>
                  <div data-aos="zoom-in-down" className="Mental-card-main shadow-lg">
                    <img
                      src={`${serverURL}/uploads/subcategorys/${item?.image}`}
                      alt={item?.name}
                      className="health-card-image"
                      width={100}
                      height={100}
                    />
                    <div className="card-content">
                      <p>{item?.name}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
