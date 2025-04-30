"use client";
import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import './products.css';
import { getData, serverURL } from "@/app/services/FetchNodeServices";
import { Parser } from "html-to-react";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const title = searchParams.get("title") || "";
  const searchTerm = searchParams.get("searchTerm") || "";

  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("DDDDDDDDDDDDDDDDDDDDDDDD:--", id, title, searchTerm)
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getData("api/products/get-all-reviews");
        if (data?.success) {
          const activeReviews = data.reviews.filter(r => r.status === true);
          setReviews(activeReviews);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let response;
        if (searchTerm.trim()) {
          response = await getData(`api/products/search-all-product?search=${searchTerm}`);
        } else if (title === "subDiseas" && id) {
          response = await getData(`api/subcategories/get-subcategory-by-id/${id}`);
        } else {
          response = await getData("api/products/all-product");
        }

        if (response?.success) {
          const productsData = response.products || response.subcategory?.productId || [];
          setProducts(productsData);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    fetchReviews();
  }, [id, title, searchTerm]);

  const truncateText = (text, maxLength = 100) =>
    text?.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  const getProductRating = productId => {
    const productReviews = reviews.filter(r => r.productId === productId);
    const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
    return productReviews.length > 0 ? (totalRating / productReviews.length).toFixed(1) : "0";
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="product-page">
      <div className="container">
        <h2 className="heading">Ayurvedic Products</h2>
        <p className="product-grid-subtitle">
          Explore our range of natural, herbal, and ayurvedic products for a healthier lifestyle.
        </p>
        <div className="row">
          {products.map((item) => (
            <div key={item._id} className="col-md-4 col-6 mb-2">
              <div className="product-slider-card">
                <Link className="text-black text-decoration-none" href={`/Pages/products/${item?._id}`}>
                  <div data-aos="zoom-in" className="product-card p-0">
                    <img
                      src={`${serverURL}/uploads/products/${item?.productImages[0]}`}
                      alt={item.name}
                      className="product-image"
                    />
                    <div className="product-details">
                      <h5 className="product-name">
                        {truncateText(item?.productName, 30)}
                      </h5>
                      <p className="product-desc">
                        {Parser().parse(truncateText(item?.productSubDescription, 90))}
                      </p>
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
                        {reviews.filter(review => review.productId === item?._id).length || 10} reviews)
                      </p> */}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Page;
