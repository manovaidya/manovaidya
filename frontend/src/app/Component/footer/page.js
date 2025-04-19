import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css";
import Link from "next/link";

const page = () => {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="row">
            {/* Follow Us Section */}
            <div className="col-md-4">
              <h5>Follow Us</h5>
              <div className="social-icons">
                <a href="#" className="text-dark">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="text-dark">
                  <i className="bi bi-youtube"></i>
                </a>
              </div>
            </div>

            {/* Categories Section */}
            <div className="col-md-4">
              <h5>Categories</h5>
              <ul className="list-unstyled">
                <li>Wellness Kits</li>
                <li>Mind Health</li>
                <li>Conditions</li>
                <li>Cognitive Function</li>
              </ul>
            </div>

            {/* Terms & Condition Section */}
            <div className="col-md-4">
              <h5>Terms & Condition</h5>
              <ul className="list-unstyled">
                <li>
                  <Link href={"/Pages/contactUs"}>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href={"/Pages/terms-conditions"}>
                    Term & Conditions's
                  </Link>
                </li>
                <li>
                  <Link href={"/Pages/privacy-policy"}>Privacy Policy</Link>
                </li>
                <li>
                  <Link href={"/Pages/return-and-refund-policy"}>
                    Return/Refund Policy
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
