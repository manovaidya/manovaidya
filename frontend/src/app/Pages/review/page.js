"use client"; // Required for Next.js client components

import React, { useEffect, useState } from "react";
import "./review.css";
import { getData, serverURL } from "@/app/services/FetchNodeServices";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { formatDate } from "@/app/constant";

const ReviewSection = () => {
  const [review, setReview] = useState([]);

  const fetchReview = async () => {
    try {
      const response = await getData("api/products/get-all-reviews");
      if (response.success === true) {
        setReview(response?.reviews?.filter((r) => r?.status === true) || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReview();
  }, []);

  return (
    <section className="review-section py-5 bg-light">
      <div className="container">
        <h2 className="mb-3 text-center fw-bold">What Our Users Say</h2>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            992: {
              slidesPerView: 3,
            },
          }}
        >
          {review?.map((review, index) => (
            <SwiperSlide className="p-3" key={index}>
              <div className="card border rounded-4 h-100">
                <div className="card-body p-2">
                  <div className="d-flex align-items-center mb-4">
                    <img
                      src={`${serverURL}/${review?.profileImage}`}
                      alt={review?.name}
                      className="rounded-circle me-3"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <h5 className="mb-1 fw-semibold">{review?.name}</h5>
                      <small className="text-muted">
                        {formatDate(review?.createdAt)}
                      </small>
                    </div>
                  </div>
                  <p
                    className="card-text text-secondary"
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      WebkitLineClamp: 4,
                    }}
                  >
                    {review?.reviewText}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ReviewSection;
