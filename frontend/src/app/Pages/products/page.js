"use client";
import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import "./products.css";

import { getData, serverURL } from "@/app/services/FetchNodeServices";
import { Parser } from "html-to-react";
import { useRouter } from "next/navigation";

const Page = ({ searchParams }) => {
  // const router = useRouter();
  const { id, title, searchTerm } = use(searchParams);
  console.log("XXXXXXXXXXX", searchTerm)

  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    try {
      const data = await getData('api/products/get-all-reviews');
      if (data?.success === true) {
        const activeReviews = data?.reviews?.filter((review) => review?.status === true);
        setReviews(activeReviews);
      }
    } catch (err) {
      console?.error("Error fetching reviews:", err);
      setError("Failed to fetch reviews.");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); // Show loading state
      try {
        const response = await getData(
          title === 'subDiseas' ? `api/subcategories/get-subcategory-by-id/${id}` : "api/products/all-product"
        );
        if (response?.success === true) {
          const productsData = response?.products || response?.subcategory?.productId || [];
          setProducts(productsData);
        }
      } catch (err) {
        console?.error("Error fetching products:", err);
        setError("Failed to fetch products.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    fetchReviews();
  }, [id, title]);

  useEffect(() => {
    try {
      if (searchTerm?.length) {
        setProducts(
          products?.filter((product) => product?.productName?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
        );
      } else {
        setProducts(products);
      }
    } catch (err) {
      console?.log(err)
    }
  }, [searchTerm])

  const truncateText = (text, maxLength = 100) => {
    if (text?.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const getProductRating = (productId) => {
    const productReviews = reviews?.filter(review => review?.productId === productId);
    const totalRating = productReviews?.reduce((acc, review) => acc + review?.rating, 0);
    return productReviews?.length > 0 ? (totalRating / productReviews?.length).toFixed(1) : 0;
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show loading indicator
  }

  if (error) {
    return <div>{error}</div>; // Show error message
  }

  return (
    <section className="product-page">
      <div className="container">
        <h2 className="heading">Ayurvedic Products</h2>
        <p className="product-grid-subtitle">
          Explore our range of natural, herbal, and ayurvedic products for a healthier lifestyle.
        </p>
        <div className="row">
          {products.map((item) => (
            <div key={item._id} className="col-md-3 col-6 mb-2" style={{padding:'5px'}}>
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
                    <div className="product-footer" style={{ alignItems: 'center', justifyContent: 'space-between' , alignItems:'end' }}>
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
                      <p className="product-slider-rating">
                        {getProductRating(item?._id)} <i className="bi bi-star"></i> (
                        {reviews.filter(review => review.productId === item?._id).length || 10} reviews)
                      </p>
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
