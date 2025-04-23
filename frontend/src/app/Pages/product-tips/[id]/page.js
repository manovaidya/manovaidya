'use client'

import React, { use, useEffect, useState } from "react";
import "../tips.css";
import "../../../Component/Hero/hero.css"
import Link from "next/link";
import { getData, serverURL } from "@/app/services/FetchNodeServices";
import { Parser } from "html-to-react";
import '../../../Pages/products/products.css'

const page = ({ params }) => {
    const { id } = use(params);
    const [categories, setCategories] = useState([])
    const [wellnessKitss, setWellnessKits] = useState([])
    const [reviews, setReviews] = useState([]);
    // console.log("XXXXXXXXXXXXXXXXXXX", id)


    const fetchProduct = async () => {
        const data = await getData('api/products/all-product');
        console.log("DATA:", data);
        if (data?.success === true) {
            // Filter the products where isActive is true
            const activeProducts = data?.products?.filter(product => product?.wellnessKits === true);
            setWellnessKits(activeProducts);
        }
    }
    const fetchReviews = async () => {
        const data = await getData('api/products/get-all-reviews');
        if (data?.success === true) {
            const activeReviews = data?.reviews?.filter((review) => review?.status === true);
            setReviews(activeReviews);
        }
    };

    useEffect(() => {

        const fetchCategoriesById = async () => {
            try {
                const response = await getData(`api/categories/get-category-by-id/${id}`)
                console.log("XXXXXXXXXXXXXXXXXXX", response)
                if (response?.success === true) {
                    setCategories(response?.category)
                }
            } catch (e) {
                console.log('ERROR:-', e)
            }
        }
        fetchCategoriesById()
        fetchProduct()
        fetchReviews();
    }, [id])

    const getProductRating = (productId) => {
        const productReviews = reviews.filter(review => review.productId === productId);
        const totalRating = productReviews.reduce((acc, review) => acc + review.rating, 0);
        return productReviews.length > 0 ? (totalRating / productReviews.length).toFixed(1) : 3;
    };

    return (
        <>
            <section className="product-tips">
                <div className="product-tips-header">
                    <div className="container">
                        <div className="product-tips-heading">
                            <h3>{categories?.categoryName}</h3>
                        </div>
                        <p>
                            {categories?.shortDescription}
                        </p>
                        <div className="product-tips-test">
                            <p>
                                <b>
                                    Take the test now to find your personalized solution for
                                    mental wellness!
                                </b>
                            </p>
                            <button>

                                <Link
                                    className="text-white text-decoration-none"

                                    // href={`/Pages/product-tips-detail/${categories?._id}`}
                                    href={`/Pages/mental-health-test/${categories?.healthTestId}`}
                                >
                                    Take the Test now for your mental health diagnosis
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="tips-product-page">
                <div className="container">
                    <div className="row">
                        {categories?.productId?.map((item) => (
                            <div key={item._id} className="col-md-3 col-sm-6 col-6 mb-4">
                                <Link
                                    className="text-black text-decoration-none"
                                    href={`/Pages/products/${item?._id}`}
                                >
                                    <div className="product-slider-card" style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                                        <img
                                            src={`${serverURL}/uploads/products/${item?.productImages[0]}`}
                                            alt={item?.productName}
                                            className="product-image"
                                        />
                                        <div className="product-details">
                                            <p className="title">{item.title}</p>
                                            <h5 className="product-name">{item?.productName}</h5>
                                            <p className="product-desc">{Parser().parse(item?.productSubDescription)}</p>
                                            <div className="product-footer" style={{ alignItems: 'center', justifyContent: 'space-between', alignItems: 'end' }}>
                                                <div className="product-price m-0">
                                                    <div>
                                                        <p className="del-mrp">
                                                            MRP: <del>
                                                                ₹ {item?.variant[0]?.price}
                                                            </del>
                                                        </p>
                                                        <span className="final-price">
                                                            <strong>₹ {item?.variant[0]?.finalPrice}</strong>
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="off-price m-0">
                                                    <b style={{ fontSize: "14px" }}>
                                                        {item?.variant[0]?.discountPrice}% off
                                                    </b>
                                                </p>
                                                {/* <p className="product-slider-rating">
                                                    {getProductRating(item?._id)} <i className="bi bi-star"></i> (
                                                    {reviews.filter(review => review.productId === item?._id).length || 0} reviews)
                                                </p> */}
                                            </div>

                                            {/* <div className="product-footer">
                                                <div className="product-footer">
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                        <p className="product-price m-0">
                                                            ₹ <span>{item?.variant[0]?.finalPrice}</span>
                                                        </p>
                                                        <p className="product-final-price m-0" style={{ textDecoration: 'line-through' }}>
                                                            ₹ <span>{item?.variant[0]?.price}</span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="off-price">{item?.variant[0]?.discountPrice} % Off</span>
                                                        <p>SAVE - ₹{item?.variant[0]?.price - item?.variant[0]?.finalPrice}</p>
                                                        <p className="product-rating m-0" style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: -10 }}>
                                                            {getProductRating(item?._id)}  <i className="bi bi-star-fill"></i> (
                                                            {reviews.filter(review => review.productId === item?._id).length || 0} reviews)
                                                        </p>
                                                    </div>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="howDecide">
                <div className="container">
                    <h2>How To Decide</h2>
                    <div className="decide-details">
                        <div className="accordion" id="faqAccordion">
                            {categories?.faq?.map((item, index) => (
                                <div className="accordion-item" key={index}>
                                    <h2 className="accordion-header" id={`heading${index}`}>
                                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="false" aria-controls={`collapse${index}`}                                        >
                                            {item?.question}
                                        </button>
                                    </h2>
                                    <div id={`collapse${index}`} className="accordion-collapse collapse" aria-labelledby={`heading${index}`} data-bs-parent="#faqAccordion"                                    >
                                        <div className="accordion-body">{item?.answer}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h5 className="mt-4">
                            Complete Buyer’s Guide: Choosing the Right {categories?.categoryName}
                        </h5>
                        <p>
                            {Parser().parse(categories?.description)}
                        </p>
                        <button className="bynowbtn" style={{maxWidth:'fit-content'}}>
                            Connect Our Community
                        </button>
                    </div>
                </div>
            </section>


            <section className="ayurved-product">
                <div className="container">
                    <div className="row">
                        {wellnessKitss?.map((kit, index) => (
                            <div className="col-md-6 col-6 col-lg-4" key={index}>
                                <div className="product-card">
                                    <div className="row align-items-center">
                                        <div className="col-md-4">
                                            <Link href={`/Pages/products/${kit?._id}`}>
                                                <img
                                                    src={`${serverURL}/uploads/products/${kit?.productImages[0]}`}
                                                    alt={kit?.title}
                                                    className="card-img-top"
                                                    style={{ cursor: "pointer", borderRadius: '8px' }}
                                                />
                                            </Link>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="product-card-details">
                                                <h5>{kit?.productName}</h5>
                                                <span className="descrip">
                                                    {Parser().parse(kit?.productDescription)}
                                                </span>
                                            </div>
                                            <div className="detail-sec">
                                                <p className="off-price m-0">
                                                    <b style={{ fontSize: "14px" }}>
                                                        {kit?.variant[0]?.discountPrice} % off
                                                    </b>
                                                </p>
                                                <span className="final-price">
                                                    <strong>₹ {kit?.variant[0]?.finalPrice}</strong>
                                                </span>
                                                <p className="del-mrp">
                                                    MRP: <del>
                                                        ₹ {kit?.variant[0]?.price}
                                                    </del>
                                                </p>
                                            </div>
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

export default page;
