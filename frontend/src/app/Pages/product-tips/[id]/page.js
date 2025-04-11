'use client'

import React, { use, useEffect, useState } from "react";
import "../tips.css";
import "../../../Component/Hero/hero.css"
import Link from "next/link";
import { getData, serverURL } from "@/app/services/FetchNodeServices";
import { Parser } from "html-to-react";

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







    // const faqData = [
    //     {
    //         question: "Mild Issues? Go for Sleep Wellness.",
    //         answer:
    //             "If you're dealing with mild sleep disruptions, Sleep Wellness can help restore your natural rhythm.",
    //     },
    //     {
    //         question:
    //             "Daily Stress or Emotional Imbalance? Choose Nourishment and Balance.",
    //         answer:
    //             "If stress or emotional imbalance is affecting your sleep, Nourishment and Balance offers relaxation support.",
    //     },
    //     {
    //         question:
    //             "Severe Insomnia or Long-Term Challenges? Opt for the Complete Insomnia Treatment.",
    //         answer:
    //             "For chronic sleep problems, the Complete Insomnia Treatment provides a comprehensive solution.",
    //     },
    // ];
    // const wellnessKits = [
    //     {
    //         title: "For OCD-Obsessive Compulsive Disorder",
    //         description: [
    //             "Balances thyroid function",
    //             "Restores hormonal balance",
    //             "Improves mental clarity",
    //         ],
    //         price: "1499",
    //         rating: 4.5,
    //         image: ayurvedImage1,
    //     },
    //     {
    //         title: "For Anxiety",
    //         description: [
    //             "Supports mental clarity",
    //             "Promotes emotional balance",
    //             "Improves concentration",
    //         ],
    //         price: "1499",
    //         rating: 4.5,
    //         image: ayurvedImage2,
    //     },
    //     {
    //         title: "For Depression",
    //         description: [
    //             "Reduces feelings of fatigue",
    //             "Increases motivation",
    //             "Promotes emotional stability",
    //         ],
    //         price: "1499",
    //         rating: 4.5,
    //         image: ayurvedImage3,
    //     },
    //     {
    //         title: "Daily Stress & Overthinking",
    //         description: [
    //             "Stabilizes thought patterns",
    //             "Reduces distractions",
    //             "Supports mental clarity",
    //         ],
    //         price: "1499",
    //         rating: 4.5,
    //         image: ayurvedImage4,
    //     },
    //     {
    //         title: "For Insomnia",
    //         description: [
    //             "Promotes restful sleep",
    //             "Calms mind, reduces overthinking",
    //             "Improves sleep cycle regulation",
    //         ],
    //         price: "1499",
    //         rating: 4.5,
    //         image: ayurvedImage5,
    //     },
    //     {
    //         title: "For Cognitive Function",
    //         description: [
    //             "Amplifies focus, cognitive precision",
    //             "Elevates memory retention",
    //             "Unlocks peak productivity potential",
    //         ],
    //         price: "1499",
    //         rating: 4.5,
    //         image: ayurvedImage6,
    //     },
    // ];
    // const products = [
    //     {
    //         id: 1,
    //         image: image1,
    //         title: "Ayurvedic Tablets",
    //         name: "For Sleep Wellness",
    //         desc: "Supports a peaceful sleep cycle and calms the mind",
    //         price: 1499,
    //         rating: 4.5,
    //         reviews: "5673",
    //     },
    //     {
    //         id: 2,
    //         image: image2,
    //         title: "Ayurvedic Tablets",
    //         name: "For Nourishment and Balance",
    //         desc: "Supports cognitive function, emotional stability, and overall well-being.",
    //         price: 1299,
    //         rating: 4.3,
    //         reviews: "5673",
    //     },
    //     {
    //         id: 3,
    //         image: image3,
    //         title: "Ayurvedic Tablets",
    //         name: "Complete Insomnia Treatment",
    //         desc: "Provides effective relief from chronic insomnia, easing anxiety and improving sleep quality",
    //         price: 999,
    //         rating: 4.7,
    //         reviews: "5673",
    //     },
    // ];


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
                            {/* Experience the Ayurvedic way to calm your mind and improve sleep.
                            Rooted in natural brain nourishment, Ayurveda restores balance,
                            reduces stress, and promotes deep, restful sleep for overall
                            well-being. */}
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
                                    className="text-black text-decoration-none" 
                                    
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
                            <div key={item._id} className="col-md-4 col-sm-6 col-6 mb-4">
                                <Link
                                    className="text-black text-decoration-none"
                                    href={`/Pages/products/${item?._id}`}
                                >
                                    <div className="product-card" style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                                        <img
                                            src={`${serverURL}/uploads/products/${item?.productImages[0]}`}
                                            alt={item?.productName}
                                            className="product-image"
                                            style={{ width: "100%", height: '40vh' }}
                                        />
                                        <div className="tips-detail-card">
                                            <p className="title">{item.title}</p>
                                            <h5 className="product-name">{item?.productName}</h5>
                                            <p className="product-desc" style={{ height: '60px' }}>{Parser().parse(item?.productSubDescription)}</p>
                                            <div className="product-footer">
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                                        <p className="product-price m-0">
                                                            ₹ <span>{item?.variant[0]?.finalPrice}</span>
                                                        </p>
                                                        <p className="product-final-price m-0" style={{ textDecoration: 'line-through' }}>
                                                            ₹ <span>{item?.variant[0]?.price}</span>
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span>{item?.variant[0]?.discountPrice} % Off</span>
                                                        <p>SAVE - ₹{item?.variant[0]?.price - item?.variant[0]?.finalPrice}</p>
                                                        <p className="product-rating m-0" style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: -10 }}>
                                                            {getProductRating(item?._id)}  <i className="bi bi-star-fill"></i> (
                                                            {reviews.filter(review => review.productId === item?._id).length || 0} reviews)
                                                        </p>

                                                    </div>
                                                </div>


                                            </div>
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
                            {/* Finding the perfect solution for your sleep and relaxation needs is
                            essential for a healthy and balanced life. Here’s a guide to help
                            you decide which product suits you best. */}
                        </p>
                    </div>
                </div>
            </section>


            <section className="ayurved-product">
                <div className="container">
                    <div className="row">
                        {wellnessKitss?.map((kit, index) => (
                            <div className="col-md-6 col-6 col-lg-4" key={index}>
                                <div data-aos="zoom-in" className="product-card" style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '5px' }}>
                                    <div className="row align-items-center">
                                        <div className="col-md-4">
                                            <Link href={`/Pages/products/${kit?._id}`}>
                                                <img
                                                    src={`${serverURL}/uploads/products/${kit?.productImages[0]}`}
                                                    alt={kit?.title}
                                                    className="card-img-top"
                                                    width={200}
                                                    height={200}
                                                    style={{ cursor: "pointer", borderRadius: '8px' }}
                                                />
                                            </Link>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="product-card-details" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingLeft: '10px' }}>
                                                <h5 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '10px' }}>{kit?.productName}</h5>
                                                <div style={{ fontSize: '0.8rem', display: '-webkit-box', overflow: 'hidden', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', textOverflow: 'ellipsis', marginBottom: '10px' }}>
                                                    {Parser().parse(kit?.productDescription)}
                                                </div>
                                                <p className="m-0" style={{ fontSize: '1rem', color: '#000' }}>
                                                    <strong>₹ {kit?.variant[0]?.price}</strong>
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
