"use client";
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css";
import Link from "next/link";
import { toast } from "react-toastify";
import { getData } from "@/app/services/FetchNodeServices";

const page = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getData('api/categories/get-All-category');
        if (response.success === true) {
          const activecategories = response?.categories.filter(categorie => categorie.isActive === true);
          setCategories(activecategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="row">
            {/* Follow Us Section */}
            <div className="col-md-4">
              <h5>Follow Us</h5>
              <div className="social-icons d-flex gap-3">
                <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-dark">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-dark">
                  <i className="bi bi-youtube"></i>
                </a>
                <a href="https://www.instagram.com/silent_lover_aasib_mp07" target="_blank" rel="noopener noreferrer" className="instagram-icon">
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </div>

            {/* Categories Section */}
            <div className="col-md-4">
              <h5>Categories</h5>
              <div className="footer-category-list">
                <ul className="list-unstyled">
                  {categories?.map((categorie, index) => (
                    <li key={index}>
                      <Link className="text-decoration-none" href={`/Pages/product-tips/${categorie?._id}`} key={index}>
                        <i className="bi bi-arrow-right-circle"></i> {categorie?.categoryName}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Terms & Condition Section */}
            <div className="col-md-4">
              <h5>Terms & Condition</h5>
              <ul className="list-unstyled">
                <li>
                  <Link href={"/Pages/contactUs"}>
                    <i className="bi bi-arrow-right-circle"></i> Contact Us
                  </Link>
                </li>
                <li>
                  <Link href={"/Pages/blog"}>
                    <i className="bi bi-arrow-right-circle"></i> Blog
                  </Link>
                </li>
                <li>
                  <Link href={"/Pages/terms-conditions"}>
                    <i className="bi bi-arrow-right-circle"></i> Term & Conditions's
                  </Link>
                </li>
                <li>
                  <Link href={"/Pages/privacy-policy"}><i className="bi bi-arrow-right-circle"></i> Privacy Policy</Link>
                </li>
                <li>
                  <Link href={"/Pages/return-and-refund-policy"}>
                    <i className="bi bi-arrow-right-circle"></i> Return/Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="icon-section">
            <div className="row">
              <div
                className="col-md-4 col-4"
                style={{ borderRight: "1px solid lightgray" }}
              >
                <i className="bi bi-shield-lock footer-icon"></i>
                <p className="footer-text">Secure Payment</p>
              </div>
              <div
                className="col-md-4 col-4"
                style={{ borderRight: "1px solid lightgray" }}
              >
                <i className="bi bi-people footer-icon"></i>
                <p className="footer-text">6L+ Happy Customers</p>
              </div>
              <div className="col-md-4 col-4">
                <i className="bi bi-arrow-repeat footer-icon"></i>
                <p className="footer-text">Easy Refund</p>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
        </div>
      </footer>
      <div className="bottom-footer">
        © {new Date().getFullYear()} MANOVAIDYA All Rights Reserved. by{" "}
        <a
          style={{ color: 'var(--yellow)', textDecoration: 'none' }}
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.digiindiasolutions.com/"
        >
          Digi India Solutions
        </a>
      </div>

    </>
  );
};

export default page;
