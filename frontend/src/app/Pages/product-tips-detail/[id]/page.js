'use client'

import React, { use, useEffect, useState } from "react";
import "../../product-tips/tips.css";
import productImage from "../../../Images/card-pic-1.png";
import Image from "next/image";
import "../product-detail-tips.css";
import { getData, serverURL } from "@/app/services/FetchNodeServices";
import { useRouter } from "next/navigation";

const Page = ({ params }) => {
    const { id } = use(params);
    const [categories, setCategories] = useState([])
    const route = useRouter()

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
    }, [id])

    return (
        <>
            <section className="product-tips">
                <div className="product-tips-header">
                    <div className="container">
                        <div className="product-tips-heading">
                            <h3>{categories?.categoryName}</h3>
                        </div>
                        <h6>Achieve Balanced Mental Wellness with Ayurveda</h6>
                        <p>
                            Ayurveda offers a holistic approach to mental well-being by
                            nourishing the mind and body. The Everyday Mental Wellness Combo
                            is designed to keep you mentally fit, relaxed, and resilient in
                            the face of life's challenges. Combining stress-relief, cognitive
                            support, and gut health enhancement, this remedy helps you
                            maintain a calm, focused, and energized mind every day.
                        </p>
                        <div className="product-tips-test">
                            <p>
                                <b>
                                    Take the test now to find your personalized solution for
                                    mental wellness!
                                </b>
                            </p>
                            <button type="button" onClick={() => { route.push("/Pages/mind-health") }} className="test-button">
                                Take the Test
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <section className="product-tips-details">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="tips-details-image">
                                <img
                                    src={`${serverURL}/uploads/categorys/${categories?.image}`}
                                    alt="Product Image"
                                    style={{ objectFit: "cover" }}
                                    width={500}
                                    height={500}
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="tips-details-section">
                                <h4>Ayurvedic Tablets</h4>
                                <h5>
                                    Complete care for stress, cognitive function, and gut
                                    health—nourish your mind and body to stay mentally fit and
                                    relaxed.
                                </h5>
                                <ul>
                                    <li>Helps reduce stress and improve mental clarity.</li>
                                    <li>Enhances cognitive function and focus.</li>
                                    <li>Supports gut health, digestion, and detoxification.</li>
                                    <li>
                                        Promotes overall mental wellness, relaxation, and strength
                                    </li>
                                </ul>
                                <p className="product-rating">
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <span>(5673 reviews)</span>
                                </p>
                                <p className="price">₹ 500.00</p>
                                <button type="button" className="buy-now">
                                    BUY IT NOW
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="mental-wellness-section">
                <div className="container">
                    <h4 className="section-heading">
                        Complete Guide for Buyers: Why Choose the Everyday Mental Wellness
                        Combo?
                    </h4>
                    <div className="benefit-list">
                        {[
                            {
                                title:
                                    "1. For Those Who Struggle with Unexplained Stress or Mental Fatigue",
                                content:
                                    "Choose this if you often feel mentally overwhelmed but aren’t sure what’s causing it. If you struggle with stress, mood fluctuations, or lack of mental clarity, this combo works to reduce stress and restore your mental balance.",
                            },
                            {
                                title:
                                    "2. If You Want a Holistic Solution for Mental and Gut Health",
                                content:
                                    "This combo isn’t just about mental wellness—it’s also about supporting your digestive health. If you experience digestive issues or bloating alongside mental strain, this combo addresses both, improving your gut health while boosting your cognitive function.",
                            },
                            {
                                title:
                                    "3. Ideal for Those Who Need a Daily Boost of Mental Resilience",
                                content:
                                    "Whether you’re juggling work, personal life, or simply trying to maintain focus in a busy world, the Everyday Mental Wellness Combo keeps you strong. It boosts your cognitive function and helps you remain resilient, no matter what life throws at you.",
                            },
                            {
                                title: "4. For People Looking to Maintain Long-Term Wellness",
                                content:
                                    "This is the ideal choice if you’re looking for a consistent, daily solution to keep your mind sharp, your gut in balance, and your stress under control.",
                            },
                        ].map((item, index) => (
                            <div className="benefit-item" key={index}>
                                <h5>{item.title}</h5>
                                <p>{item.content}</p>
                            </div>
                        ))}
                    </div>
                    <div className="benefits-summary">
                        <h5>Benefits:</h5>
                        <ul>
                            <li>
                                <strong>Mental Clarity:</strong> Supports cognitive function and
                                focus.
                            </li>
                            <li>
                                <strong>Stress Relief:</strong> Reduces stress and promotes
                                mental relaxation.
                            </li>
                            <li>
                                <strong>Gut Health:</strong> Improves digestion, detoxifies, and
                                nourishes the gut.
                            </li>
                            <li>
                                <strong>Complete Care:</strong> A holistic approach for both
                                mind and body.
                            </li>
                        </ul>
                    </div>
                    <p className="closing-note">
                        Take control of your mental wellness with Ayurveda’s trusted solution. Stay strong, calm, and focused every day!
                    </p>
                </div>
            </section>
        </>
    );
};

export default Page;
