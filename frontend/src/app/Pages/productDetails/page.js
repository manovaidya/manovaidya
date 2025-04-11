"use client";
import React, { useEffect, useRef, useState } from "react";
import "./productDetails.css";
import prodctImage from "../../Images/kit-image-1.png"; // Correct import path
import paymentImage1 from "../../Images/payment-img1.png";
import paymentImage2 from "../../Images/payment-img2.png";
import paymentImage3 from "../../Images/payment-img3.png";
import paymentImage4 from "../../Images/payment-img4.png";
import paymentImage5 from "../../Images/payment-img5.png";
import ingredentImage1 from "../../Images/ingrediantsImage1.png";
import ingredentImage2 from "../../Images/ingrediantsImage2.png";
import ingredentImage3 from "../../Images/ingrediantsImage3.png";
import ingredentImage4 from "../../Images/ingrediantsImage4.png";
import Image from "next/image";
import Link from "next/link";
import ProductBlog from "../../Component/ProductBlog/page";
import reviewImage from "../../Images/reviewImage1.png";
import Slider from "react-slick";
import productimg1 from "../../Images/product-details1.png";
import productimg2 from "../../Images/product-details2.png";
import productimg3 from "../../Images/product-details3.png";
const Page = () => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  let sliderRef1 = useRef(null);
  let sliderRef2 = useRef(null);

  useEffect(() => {
    setNav1(sliderRef1);
    setNav2(sliderRef2);
  }, []);
  const review = [
    {
      name: "Arti Kumari",
      date: "December 18, 2023",
      profileImage: reviewImage,
      rating: 5,
      reviewTitle:
        "Lorem Ipsum is Simply Dummy Text of The nd Typesetting Industry.",
      reviewText:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
      likes: 123,
      dislikes: 123,
    },
    // Add more review objects as needed
    {
      name: "Arti Kumari",
      date: "December 18, 2023",
      profileImage: reviewImage,
      rating: 4,
      reviewTitle:
        "Lorem Ipsum is Simply Dummy Text of The nd Typesetting Industry.",
      reviewText:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
      likes: 123,
      dislikes: 123,
    },
    {
      name: "Arti Kumari",
      date: "December 18, 2023",
      profileImage: reviewImage,
      rating: 5,
      reviewTitle:
        "Lorem Ipsum is Simply Dummy Text of The nd Typesetting Industry.",
      reviewText:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
      likes: 123,
      dislikes: 123,
    },
  ];
  const reviews = [
    { stars: 5, percentage: 10, count: 249 },
    { stars: 4, percentage: 10, count: 0 },
    { stars: 3, percentage: 10, count: 0 },
    { stars: 2, percentage: 10, count: 0 },
    { stars: 1, percentage: 10, count: 0 },
  ];
    const videos = [
      {
        id: "video1",
        url: "https://www.youtube.com/embed/tgbNymZ7vqY",
      },
      {
        id: "video2",
        url: "https://www.youtube.com/embed/sBws8MSXN7A",
      },
      {
        id: "video3",
        url: "https://www.youtube.com/embed/sBws8MSXN7A",
      },
    ];
  const accordionData = [
    {
      id: "flush-collapseOne",
      headingId: "flush-headingOne",
      title: "Benefite",
      content:
        "Placeholder content for this accordion, which is intended to demonstrate the .accordion-flush class. This is the first item's accordion body.",
    },
    {
      id: "flush-collapseTwo",
      headingId: "flush-headingTwo",
      title: "How Should Take It",
      content:
        "Placeholder content for this accordion, which is intended to demonstrate the .accordion-flush class. This is the second item's accordion body. Let's imagine this being filled with some actual content.",
    },
    {
      id: "flush-collapseThree",
      headingId: "flush-headingThree",
      title: "Product Details",
      content:
        "Placeholder content for this accordion, which is intended to demonstrate the .accordion-flush class. This is the third item's accordion body. Nothing more exciting happening here in terms of content, but just filling up the space to make it look, at least at first glance, a bit more representative of how this would look in a real-world application.",
    },
    {
      id: "flush-collapseFour",
      headingId: "flush-headingFour",
      title: "Dosage Duration",
      content:
        "Placeholder content for this accordion, which is intended to demonstrate the .accordion-flush class. This is the third item's accordion body. Nothing more exciting happening here in terms of content, but just filling up the space to make it look, at least at first glance, a bit more representative of how this would look in a real-world application.",
    },
    {
      id: "flush-collapseFive",
      headingId: "flush-headingFive",
      title: "How It’s Made",
      content:
        "Placeholder content for this accordion, which is intended to demonstrate the .accordion-flush class. This is the third item's accordion body. Nothing more exciting happening here in terms of content, but just filling up the space to make it look, at least at first glance, a bit more representative of how this would look in a real-world application.",
    },
  ];

  const pricingOptions = [
    {
      duration: "30 Days",
      bottles: "1 Bottle",
      price: 990,
      discount: "45% off",
      originalPrice: 1799,
      savings: 809,
      taxes: "MRP (Incl of all taxes)",
    },
    {
      duration: "60 Days",
      bottles: "2 Bottle",
      price: 1799,
      discount: "50% off",
      originalPrice: 3599,
      savings: 1800,
      taxes: "MRP (Incl of all taxes)",
    },
    {
      duration: "90 Days",
      bottles: "3 Bottle",
      price: 2099,
      discount: "60% off",
      originalPrice: 5399,
      savings: 3300,
      bestseller: true,
      taxes: "MRP (Incl of all taxes)",
    },
  ];

  const ingredients = [
    {
      name: "Jatamansi",
      picture: ingredentImage1,
    },
    {
      name: "Nardostachys Jatamansi",
      picture: ingredentImage2,
    },
    {
      name: "Sankhpushpi",
      picture: ingredentImage3,
    },
    {
      name: "Tinospora Cordifolia",
      picture: ingredentImage4,
    },
  ];

  const images = [productimg1, productimg2, productimg3];

  return (
    <>
      <section className="product-details-section">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <Slider
                asNavFor={nav2}
                ref={(slider) => {
                  setNav1(slider);
                  sliderRef1.current = slider;
                }}
              >
                {images.map((image, index) => (
                  <div key={index}>
                    <Image
                      src={image}
                      alt={`Slide ${index + 1}`}
                      style={{ width: "100%", height: "400px" , objectFit:'fill' }}
                    />
                  </div>
                ))}
              </Slider>

              <Slider
                asNavFor={nav1}
                ref={(slider) => {
                  setNav2(slider);
                  sliderRef2.current = slider;
                }}
                autoplay={true}
                autoplaySpeed={3000}
                infinite={true}
                pauseOnHover={true}
                slidesToShow={4}
                swipeToSlide={true}
                focusOnSelect={true}
              >
                {images.map((image, index) => (
                  <div className="product-mini-images" key={index}>
                    
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      style={{ width: "95%", height: "120px" , objectFit:'cover' }}
                    />
                  </div>
                ))}
              </Slider>
              {/* </div> */}
            </div>

            <div className="col-md-6">
              <div className="product-details">
                <h1>Ayurvedic Tablets</h1>
                <p>Putranjivak, Shivlingi + 15 herbs</p>
                <div className="product-description">
                  <p className="m-0">
                    Clinical Study - Lorem Ipsum has been the industry's
                    standard dummy text
                  </p>
                </div>
                <ul> 
                  <li>
                  Balances thyroid function
                  </li>
                  <li>
                  Balances thyroid function
                  </li>
                  <li>
                  Balances thyroid function
                  </li>
                </ul>
                <hr />
                <div className="product-detail-smrini">
                  <h2>SMRINI</h2>
                  <div className="row">
                    {pricingOptions.map((item, index) => (
                      <div className="col-md-4 col-6" key={index}>
                        <div className="product-detail-card">
                          <p className="smrini-duration">{item.duration}</p>
                          <p className="smrini-bottle">{item.bottles}</p>
                          <hr />
                          <p className="smrini-original-price">
                            ₹ <del>{item.originalPrice}</del>
                          </p>
                          <p className="smrini-price">₹ {item.price}</p>
                          <p className="smrini-discount">{item.discount}</p>
                          
                          <p className="smrini-taxes">{item.taxes}</p>
                          <p className="smrini-saving">Save ₹ {item.savings}</p>
                        </div>
                      </div>
                    ))}
                    <div className="col-md-12">
                      <Link href={"/Pages/Checkout"} className="bynowbtn mt-3">
                        BUY IT NOW
                      </Link>
                    </div>
                    <div className="col-md-12">
                      <div className="payment-images">
                        {[
                          paymentImage1,
                          paymentImage2,
                          paymentImage3,
                          paymentImage4,
                          paymentImage5,
                        ].map((image, index) => (
                          <Link href="/" key={index}>
                            <Image src={image} alt="Payment Option" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ingredients-detail">
        <div className="container">
          <h2>Herbs for Natural</h2>
          <div className="row">
            {ingredients.map((item, index) => (
              <div key={index} className="col-md-4 col-6">
                <div className="ingredent-main">
                  <Image src={item.picture} alt="ingredents-image" />
                  <p>{item.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="ingredients-accordion">
        <div className="container">
          <div className="accordion accordion-flush" id="accordionFlushExample">
            {accordionData.map((item) => (
              <div className="accordion-item" key={item.id}>
                <h2 className="accordion-header" id={item.headingId}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${item.id}`}
                    aria-expanded="false"
                    aria-controls={item.id}
                  >
                    {item.title}
                  </button>
                </h2>
                <div
                  id={item.id}
                  className="accordion-collapse collapse"
                  aria-labelledby={item.headingId}
                  data-bs-parent="#accordionFlushExample"
                >
                  <div className="accordion-body">{item.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="product-blog-section">
        <ProductBlog />
      </section>
      <section className="doctor-advice-videos">
        <div className="container">
          <h2>Doctor's Advice</h2>
          <div className="row">
            {videos.map((video) => (
              <div className="col-md-4 col-6" key={video.id}>
                <div className="video-card">
                  <iframe
                    width="100%"
                    height="250"
                    src={video.url}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="customer-reviews-advice py-4">
        <div className="container">
          <h4>Customer Reviews Advice</h4>
          <hr />
          <p className="mb-3">Based on 2495 reviews</p>
          <div className="reviews-list">
            {reviews.map((review, index) => (
              <div className="row align-items-center mb-3" key={index}>
                <div className="col-3 col-md-2">
                  <div className="stars">
                    {[...Array(review.stars)].map((_, i) => (
                      <span key={i} className="text-warning">
                        &#9733;
                      </span>
                    ))}
                    {[...Array(5 - review.stars)].map((_, i) => (
                      <span key={i} className="text-muted">
                        &#9733;
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-6 col-md-8">
                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-warning"
                      role="progressbar"
                      style={{ width: `${review.percentage}%` }}
                      aria-valuenow={review.percentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
                <div className="col-3 col-md-2">
                  <small>
                    {review.percentage}% ({review.count})
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="review-section">
        <div className="container">
          <h2 className="mb-4">
            <strong>Review</strong>
          </h2>
          <div className="row">
            {review.map((review, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <Image
                        src={review.profileImage}
                        alt={review.name}
                        className="rounded-circle me-3"
                        style={{ width: "50px", height: "50px" }}
                      />
                      <div>
                        <h6 className="mb-0">{review.name}</h6>
                        <small className="text-muted">{review.date}</small>
                      </div>
                    </div>
                    <h6 className="card-tit">{review.reviewTitle}</h6>
                    <p className="card-text">{review.reviewText}</p>
                    <div className="d-flex align-items-center">
                      <span className="text-warning me-2">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fa${
                              i < review.rating ? "s" : "r"
                            } fa-star`}
                          ></i>
                        ))}
                      </span>
                      <hr />
                      <small className="text-muted ms-auto">
                        <i className="bi bi-hand-thumbs-up"></i>
                        {review.likes}
                      </small>
                      <small className="text-muted ms-3">
                        <i className="bi bi-hand-thumbs-down"></i>
                        {review.dislikes}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
