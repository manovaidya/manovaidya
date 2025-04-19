"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';

import Image from "next/image";
import "./productSlider.css";
import { getData, serverURL } from "@/app/services/FetchNodeServices";
import { Parser } from "html-to-react";
import Link from "next/link";

// Import images
import icon1 from "../../Images/pure-ingredents.png";
import icon2 from "../../Images/eco-friendly.png";
import icon3 from "../../Images/expert-crafted.png";
import icon4 from "../../Images/health.png";
import icon5 from "../../Images/delivery.png";
import icon6 from "../../Images/pan-india.png";
import icon7 from "../../Images/costomer-support.png";

const Page = () => {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Fetch products
  const fetchProduct = async () => {
    const data = await getData('api/products/all-product');
    console.log("DATA:", data);
    if (data?.success === true) {
      const activeProducts = data?.products.filter(product => product.isActive === true);
      setProducts(activeProducts);
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    const data = await getData('api/products/get-all-reviews');
    if (data?.success === true) {
      const activeReviews = data?.reviews?.filter((review) => review?.status === true);
      setReviews(activeReviews);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, []);


  // Truncate text for descriptions
  const truncateText = (text, maxLength = 100) => {
    if (text?.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  // Get the average rating of the product by productId
  const getProductRating = (productId) => {
    const productReviews = reviews.filter(review => review.productId === productId);
    const totalRating = productReviews.reduce((acc, review) => acc + review.rating, 0);
    return productReviews.length > 0 ? (totalRating / productReviews.length).toFixed(1) : 5;
  };

  return (
    <>
      <section className="product-slider py-3">
        <div className="container">
          <h2 className="product-slider-title text-center mb-3" >Ayurvedic Products</h2>
          <p className="product-slider-subtitle text-center mb-4">
            Explore our range of natural, herbal, and ayurvedic products for a healthier lifestyle.
          </p>

          <Swiper
            modules={[Autoplay]}
            spaceBetween={10}
            slidesPerView={4}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              0: { slidesPerView: 1 },
              576: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
          >
            {products?.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="product-slider-card">
                  <Link className="pruduct-link-all" href={`/Pages/products/${item?._id}`}>
                    <img
                      src={`${serverURL}/uploads/products/${item?.productImages[0]}`}
                      alt={item?.productName}
                      className="product-slider-image"
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                  <div className="product-slider-details">
                    <h5 className="product-name fw-semibold">{truncateText(item?.productName, 18)}</h5>
                    <p
                      className="product-desc text-muted small mb-2"
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        // minHeight: '60px',
                      }}
                    >
                      {Parser().parse(truncateText(item?.productSubDescription, 50))}
                    </p>
                    <div className="product-slider-footer">
                      <div className="pro-sli">

                        <p className="del-mrp">
                          MRP: <del>
                            ₹ {item?.variant[0]?.price}
                          </del>
                        </p>
                        <p className="final-price"><strong> ₹ {item?.variant[0]?.finalPrice}</strong></p>
                      </div>
                      <p className="off-price m-0">
                        <b style={{ fontSize: "14px" }}>
                          {item?.variant[0]?.discountPrice} % off
                        </b>
                      </p>
                      <p className="product-slider-rating">
                        {getProductRating(item?._id)} <i className="bi bi-star-fill"></i> (
                        {reviews.filter(review => review.productId === item?._id).length || 0} reviews)
                      </p>
                    </div>
                  </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>


      <section className="manovedya-hero-about">
        <div className="container">
          <h2 className="manovedya-title">Manovaidya</h2>
          <p className="manovedya-description">
            Manovaidya - where ancient Ayurveda meets modern mental wellness.
            We’re here to help you find balance with natural, herbal solutions
            crafted to support your mental health, whether you’re dealing with
            anxiety, depression, or just everyday stress. Our products are
            inspired by age-old traditions and perfected with science to fit
            seamlessly into your life helping you find balance, calm, and
            clarity—naturally.
          </p>
          <h3 className="manovedya-subtitle">
            Premium Ayurvedic wellness, embracing nature with zero compromise.
          </h3>

          <div className="row feature-row">
            <div className="col-md-3 col-6 text-center">
              <Image src={icon1} alt="Pure Ingredients" className="manovedya-icon" />
              <h4 className="feature-title">Pure Ingredients</h4>
              <p className="feature-description">100% Ayurvedic, no artificial chemicals.</p>
            </div>
            <div className="col-md-3 col-6 text-center">
              <Image src={icon2} alt="Eco-Friendly" className="manovedya-icon" />
              <h4 className="feature-title">Eco-Friendly</h4>
              <p className="feature-description">Cruelty-free, sustainable practices.</p>
            </div>
            <div className="col-md-3 col-6 text-center">
              <Image src={icon3} alt="Expert Crafted" className="manovedya-icon" />
              <h4 className="feature-title">Expert Crafted</h4>
              <p className="feature-description">Formulated by expert vaidyas.</p>
            </div>
            <div className="col-md-3 col-6 text-center">
              <Image src={icon4} alt="Health Solutions" className="manovedya-icon" />
              <h4 className="feature-title">Health Solutions</h4>
              <p className="feature-description">Wide range for varied wellness needs.</p>
            </div>
          </div>

          <div className="row feature-row m-0">
            <div className="col-md-4 col-6 text-center">
              <Image src={icon5} alt="Free Delivery" className="manovedya-icon" />
              <p className="feature-highlight">Free Delivery Above ₹ 350</p>
            </div>
            <div className="col-md-4 col-6 text-center">
              <Image src={icon6} alt="Shipping PAN India" className="manovedya-icon" />
              <p className="feature-highlight">Shipping PAN India</p>
            </div>
            <div className="col-md-4 col-6 text-center">
              <Image src={icon7} alt="Quick Customer Support" className="manovedya-icon" />
              <p className="feature-highlight">Quick Customer Support</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
