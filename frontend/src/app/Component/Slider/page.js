"use client";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./slider.css";
import { getData, serverURL } from "@/app/services/FetchNodeServices";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";

const Page = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await getData("api/banners");
        console.log("Response:", response?.banners);

        if (response?.success === true && response?.banners) {
          setBanners(
            response?.banners.filter((banner) => banner?.isActive === true)
          );
        } else {
          setError("No banners found or error in API response.");
        }
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError("Failed to load banner images.");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const arrowStyle = (direction) => ({
    position: "absolute",
    top: "60%",
    [direction]: "10px",
    zIndex: 10,
    fontSize: "30px",
    color: "#fff",
    cursor: "pointer",
    transform: "translateY(-50%)",
    padding: "10px",
    border: "none",
    backgroundColor: "transparent",
    borderRadius: "50%",
  });

  // ✅ Custom Arrow Components (no DOM warning)
  const NextArrow = ({ onClick }) => (
    <div onClick={onClick} style={arrowStyle("right")}>
      <SlArrowRight />
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div onClick={onClick} style={arrowStyle("left")}>
      <SlArrowLeft />
    </div>
  );

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "linear",
    beforeChange: (current, next) => setActiveIndex(next),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div id="carouselExampleIndicators" style={{ zIndex: 6 }}>
      <div className="carousel-inner">
        <Slider {...settings} ref={sliderRef}>
          {banners
            ?.filter((banner) =>
              isMobile ? banner?.type === "Mobile" : banner?.type === "Desktop"
            )
            ?.map((banner, index) => (
              <div
                key={index}
                className={`carousel-item ${
                  index === activeIndex ? "active" : ""
                }`}
              >
                {banner?.type === "Desktop" && (
                  <img
                    src={`${serverURL}/uploads/banners/${banner?.images[0]}`}
                    className="desktop-banner"
                    height={500}
                    width={1200}
                    alt={`slide-${index}`}
                  />
                )}
                {banner?.type === "Mobile" && (
                  <img
                    src={`${serverURL}/uploads/banners/${banner?.images[0]}`}
                    className="mobile-banner"
                    height={500}
                    width={1200}
                    alt={`slide-mobile-${index}`}
                  />
                )}
              </div>
            ))}
        </Slider>
      </div>
    </div>
  );
};

export default Page;
