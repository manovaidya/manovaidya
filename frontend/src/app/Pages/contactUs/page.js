import React from "react";
import "./contactus.css";
import Image from "next/image";
import image from "../../Images/icon1.webp";
import Link from "next/link";
import contactImage from "../../Images/content2.webp";
const page = () => {
  // const contactDetails = [
  //   {
  //     title: "Circle of Sisterhood",
  //     description: "Our Private Community of Sisters, 1.2Lakh+ Members",
  //     buttonText: "Request Access",
  //     buttonLink: "#",
  //     imageUrl: contactImage,
  //   },
  //   {
  //     title: "Customer Care",
  //     description: "Order Support, Service Related Queries, Escalations",
  //     buttonText: "+919920774720",
  //     buttonLink: "tel:+919920774720",
  //     imageUrl: contactImage,
  //   },
  //   {
  //     title: "Gynoveda Clinic",
  //     description:
  //       "Expert Consultation, Nearby Clinic Address, Booking Appointment",
  //     buttonText: "+917240007000",
  //     buttonLink: "tel:+917240007000",
  //     imageUrl: contactImage,
  //   },
  //   {
  //     title: "Gynoveda HQ",
  //     description: "For Business, Investment, Careers, Media",
  //     buttonText: "Visit Office",
  //     buttonLink: "#",
  //     imageUrl: contactImage,
  //   },
  // ];
  return (
    <>
      <section className="contact-us">
        <div className="container">
          <div className="contact-us-top-sec">
            <h1>We're here to help!</h1>
            <h5>
              Manovaidya help centre for information on products, orders,
              shipping, delivery, refund & cancellation
            </h5>
          </div>
          <div className="contact-card-main">
            <div className="row align-items-center">
              <div
                className="col-md-6"
                style={{ borderRight: "1px solid lightgray" }}
              >
                <div className="contact-us-card">
                  <Image src={image} alt="person-image" />
                  <div>
                    <h4>Book Doctor Appointment</h4>
                    <Link href={"tel:+91 7823838638"}>+91 7823838638</Link>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="contact-us-card">
                  <Image src={image} alt="person-image" />
                  <div>
                    <h4>Book Doctor Appointment</h4>
                    <Link href={"tel:+91 +918860002653"}>+91 +918860002653</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <div className="contacts-card">
            <div className="row">
              {contactDetails.map((item, index) => (
                <div className="col-md-3 col-6" key={index}>
                  <div className="card shadow-sm border-0 h-100">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      className="card-img-top"
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                    <div className="contact-card-body text-center">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">{item.description}</p>
                      <a
                        href={item.buttonLink}
                        className="contactUs-btn w-100"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.buttonText}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
          <div className="contact-us-locations">
            <i className="bi bi-geo-alt-fill"></i>
            <h2>Manovaidya HQ</h2>
            <h4>C 7, Block C, Sector 12, Noida, Uttar Pradesh 201301</h4>
            <div className="contact-us-location-main">
              <a href="mailto:manovaidya2@gmail.com">manovaidya2@gmail.com</a>
              <span>|</span>
              <a href="tel:+91 7823838638">+91 7823838638</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
