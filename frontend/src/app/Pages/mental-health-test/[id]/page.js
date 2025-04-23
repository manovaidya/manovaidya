"use client";
import React, { use, useEffect, useState } from "react";
import "../test.css";
import reviewImage from "../../../Images/reviewImage1.png";
import Image from "next/image";
import { getData, postData, serverURL } from "@/app/services/FetchNodeServices";
import Slider from "react-slick";
import { formatDate } from "@/app/constant";
import { toast, ToastContainer } from "react-toastify";
import ReviewSection from "../../review/page";
import Link from "next/link";

const page = ({ params }) => {
    const { id } = use(params);
    const [testData, setTestData] = useState([]);
    const [answers, setAnswers] = useState({});
    const [totalScore, setTotalScore] = useState(null);
    const [category, setCategory] = useState("");
    const [recommendation, setRecommendation] = useState("");
    const [productUrl, setProductUrl] = useState("");
    const [formData, setFormData] = useState({})
    const [user_token, setUser_token] = useState(null)
    const [review, setReview] = useState([])

    const handleAnswerChange = (questionNumber, answer) => {
        setAnswers((prev) => ({ ...prev, [questionNumber]: answer }));
    };

    const calculateTotalScore = () => {
        const scoreMapping = {
            Rarely: 2.5,
            Sometimes: 5,
            Often: 7.5,
            "Almost Always": 10,
        };
        console.log("XXXXXXXX", answers.length, 'XXXXXXXX@22', testData?.questions?.length)
        if (Object?.keys(answers)?.length !== testData?.questions?.length) {
            toast.error("Please complete the remaining questions and submit them.");
            return;
        }

        const total = Object.values(answers).reduce((total, answer) => {
            return total + scoreMapping[answer];
        }, 0);

        setTotalScore(total);
        // Categorize the score
        if (total <= 25) {
            setCategory("Mild");
            setRecommendation("Recommend anxiety medicines combo for 4-6 months.");
            setProductUrl(selectProductUrl(total));
        } else if (total <= 50) {
            setCategory("Moderate");
            setRecommendation("Recommend anxiety medicines combo for 6 months to 1 year.");
            setProductUrl(selectProductUrl(total));
        } else if (total <= 75) {
            setCategory("Moderate");
            setRecommendation("Recommend anxiety medicines combo for 6 months to 1 year.");
            setProductUrl(selectProductUrl(total));
        } else {
            setCategory("Severe");
            setRecommendation("Recommend anxiety medicines combo for 1 to 2 years.");
            setProductUrl(selectProductUrl(total));
        }

    };

    const selectProductUrl = (score) => {
        const urlData = testData?.productUrl || [];
        let selectedUrl = "";

        urlData.forEach((product) => {
            if (score >= product.per) {
                selectedUrl = product.url;
            }
        });

        return selectedUrl;
    };


    const fetchReview = async () => {
        try {
            const response = await getData("api/products/get-all-reviews");
            if (response.success === true) {
                setReview(response?.reviews?.filter((r) => r?.status === true) || []);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    }

    const fetchTests = async () => {
        const response = await getData(`api/test/get-by-id/${id}`);
        if (response?.status === true) {
            setTestData(response?.data);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const user_token = localStorage.getItem('token')
        setUser_token(user_token)

        fetchTests();
        fetchReview()
    }, [id]);

    const options = ["Rarely", "Sometimes", "Often", "Almost Always"];

    const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
        rating,
        count: review.filter(review => review.rating === rating).length,
        percentage: (review.filter(review => review.rating === rating).length / review.length) * 100
    }));

    const handleReviewImage = (event) => {
        setFormData((prevData) => ({ ...prevData, profileImage: { bytes: event.target.files[0], filename: URL.createObjectURL(event.target.files[0]) } }))
    };


    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        if (!formData?.profileImage?.filename) {
            alert("Please upload an image.");
            return;
        }
        const form = new FormData();
        form.append("name", formData.name);
        form.append("productId", id);
        form.append("profileImage", formData.profileImage.bytes);
        form.append("rating", formData.rating);
        form.append("email", formData.email);
        form.append("reviewText", formData.reviewText);
        try {
            const res = await postData("api/products/reviews", form);
            console.log("Response:", res);
            if (res.success === true) {
                toast.success("Review submitted successfully!")
                setFormData({ name: '', email: '', rating: '', reviewText: '', profileImage: null });
                const modal = new bootstrap.Modal(document.getElementById('exampleModalToggle'));
                modal.hide();
            } else {
                toast.error(res?.message || "Something Worng!")
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("There was an error submitting your review. Please try again.");
        }
    };

    const settings = { dots: false, infinite: true, slidesToShow: 3, slidesToScroll: 1, autoplay: true, autoplaySpeed: 5000, cssEase: "linear" };

    return (
        <>
            <ToastContainer />
            <section className="health-test">
                <div className="container">
                    <div className="health-test-breadcrumb">
                        <h2>Take a Mental Health Test</h2>
                        <p>
                            Online screening is one of the quickest and easiest ways to
                            determine whether you are experiencing symptoms of a mental health
                            condition.
                        </p>
                        <p>
                            <b>
                                Mental health conditions, such as depression or anxiety, are
                                real, common, and treatable. And recovery is possible.
                            </b>
                        </p>
                    </div>
                </div>
            </section>

            {totalScore === null ? (
                <section className="test-section">
                    <div className="test-heading">
                        <h2>{testData?.addHeaderTitle}</h2>
                    </div>
                    <div className="container">
                        {testData?.questions?.map((question, index) => (
                            <div key={index} className="test-main">
                                <p>
                                    {index + 1}. {question.question}
                                </p>
                                <div className="d-flex justify-content-between custom-button-group">
                                    {options.map((option, idx) => (
                                        <button
                                            key={idx}
                                            className={`custom-button ${answers[index] === option ? "selected" : ""}`}
                                            onClick={() => handleAnswerChange(index, option)}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div className="text-center">
                            <button
                                className="custom-submit-button"
                                onClick={() => {
                                    calculateTotalScore();
                                }}
                            >
                                <Link className="text-decoration-none text-white" href='#testresults'>
                                Submit Test
                                </Link>
                            </button>
                        </div>
                    </div>
                </section>
            ) : (
                <section id="testresults" className="container py-5">
                    <h2 className="text-center mb-4">Your {testData?.addHeaderTitle} Test Results</h2>
                    <div className={`result-box ${category.toLowerCase()} p-4 rounded shadow-sm`}>
                        <h3 className="text-uppercase">{category} Category</h3>
                        <p>Your symptoms suggest {category} {testData?.addHeaderTitle}</p>
                        <p>Total Score: {totalScore} / 100</p>
                        <p><strong>Recommendation:</strong> {recommendation}</p>
                        <button
                            onClick={() => window.location.href = productUrl}
                            className="btn btn-primary mt-3"
                        >
                            View Recommended Medicines
                        </button>
                    </div>
                </section>
            )}

            {testData?.videoUrl?.length > 0 ? <section className="doctor-advice-videos">
                <div className="container">
                    <h2>Doctor's Advice</h2>
                    <div className="row">
                        {testData?.videoUrl?.map((video) => (
                            <div className="col-md-4" key={video.id}>
                                <div className="video-card">
                                    <iframe
                                        width="100%"
                                        height="250"
                                        src={video.url}
                                        // title={video.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section> : ''}


            <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5 fc-perple" id="exampleModalToggleLabel">Your Review is Important to us.</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form id="reviewForm" onSubmit={handleReviewSubmit}>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <div className="mb-3">
                                        <label htmlFor="reviewName" className="form-label">Your Name</label>
                                        <input type="text" onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-control" id="reviewName" placeholder="Enter Name" value={formData.name} required />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="reviewEmail" className="form-label">Your Email</label>
                                        <input type="email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="form-control" id="reviewEmail" placeholder="Enter your email" value={formData.email} required />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="reviewRating" className="form-label">Rating</label>
                                        <select className="form-select" onChange={(e) => setFormData({ ...formData, rating: e.target.value })} id="reviewRating" value={formData.rating} required>
                                            <option value="" disabled>Select Rating</option>
                                            <option value="1">1 Star</option>
                                            <option value="2">2 Stars</option>
                                            <option value="3">3 Stars</option>
                                            <option value="4">4 Stars</option>
                                            <option value="5">5 Stars</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <button type="button" onClick={() => document.getElementById('imageUpload').click()} className="btn btn-secondary">
                                            <input id="imageUpload" onChange={handleReviewImage} hidden type="file" accept="image/*" />
                                            YOUR IMAGE
                                        </button>
                                    </div>
                                    <div>
                                        {formData.profileImage && (
                                            <img src={formData?.profileImage?.filename} alt="Uploaded" style={{ width: 100, height: 100, objectFit: 'cover' }} />
                                        )}
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="reviewBody" className="form-label">Your Review</label>
                                    <textarea onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })} className="form-control" id="reviewBody" rows="4" placeholder="Write your review" value={formData.reviewText} required></textarea>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" form="reviewForm" className="btn bg-warning" data-bs-dismiss="modal" >Submit Review</button>
                        </div>
                    </div>
                </div>
            </div>
            <section className="customer-reviews-advice py-4">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h4>Customer Reviews Advice</h4>
                        {user_token ? <button class="btn bg-warning" style={{ marginRight: '50px' }} data-bs-target="#exampleModalToggle" data-bs-toggle="modal">
                            Give Review
                        </button> : ""}
                    </div>
                    <hr />

                    <p className="mb-3">Based on {review.length} reviews</p>
                    <div className="reviews-list">
                        {ratingDistribution.map((distribution, index) => {
                            // Find the count of reviews for the specific rating
                            const countForRating = review.filter(review => review.rating === distribution.rating).length;
                            const percentage = (countForRating / review.length) * 100;

                            return (
                                <div className="row align-items-center mb-3" key={index}>
                                    <div className="col-3 col-md-2">
                                        <div className="stars">
                                            {[...Array(distribution.rating)].map((_, i) => (
                                                <span key={i} className="text-warning">
                                                    &#9733;
                                                </span>
                                            ))}
                                            {[...Array(5 - distribution.rating)].map((_, i) => (
                                                <span key={i} className="text-muted">
                                                    &#9733;
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-8">
                                        <div className="progress" style={{ height: '8px' }}>
                                            <div
                                                className="progress-bar bg-warning"
                                                role="progressbar"
                                                style={{ width: `${percentage}%` }}
                                                aria-valuenow={percentage}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="col-3 col-md-2">
                                        <small>
                                            {percentage.toFixed(2)}% ({countForRating})
                                        </small>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </section>
            <section>
          <ReviewSection />
      </section>

        </>
    );
};

export default page;
