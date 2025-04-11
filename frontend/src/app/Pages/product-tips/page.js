"use client";

import React from "react";
import "./tips.css";
import "../../Component/Hero/hero.css"
import image1 from "../../Images/product-1.png";
import image2 from "../../Images/product-2.png";
import image3 from "../../Images/product-3.png";
import ayurvedImage1 from "../../Images/kit-image-1.png";
import ayurvedImage2 from "../../Images/kit-image-2.png";
import ayurvedImage3 from "../../Images/kit-image-3.png";
import ayurvedImage4 from "../../Images/kit-image-4.jpg";
import ayurvedImage5 from "../../Images/kit-image-5.png";
import ayurvedImage6 from "../../Images/kit-image-6.jpg";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';
const page = () => {
  const router = useRouter();
  // const { categoryId } = router.query
  // console.log("XXXXXXXXXXXXXXXXXXX",categoryId)
  const faqData = [
    {
      question: "Mild Issues? Go for Sleep Wellness.",
      answer:
        "If you're dealing with mild sleep disruptions, Sleep Wellness can help restore your natural rhythm.",
    },
    {
      question:
        "Daily Stress or Emotional Imbalance? Choose Nourishment and Balance.",
      answer:
        "If stress or emotional imbalance is affecting your sleep, Nourishment and Balance offers relaxation support.",
    },
    {
      question:
        "Severe Insomnia or Long-Term Challenges? Opt for the Complete Insomnia Treatment.",
      answer:
        "For chronic sleep problems, the Complete Insomnia Treatment provides a comprehensive solution.",
    },
  ];
  const wellnessKits = [
    {
      title: "For OCD-Obsessive Compulsive Disorder",
      description: [
        "Balances thyroid function",
        "Restores hormonal balance",
        "Improves mental clarity",
      ],
      price: "1499",
      rating: 4.5,
      image: ayurvedImage1,
    },
    {
      title: "For Anxiety",
      description: [
        "Supports mental clarity",
        "Promotes emotional balance",
        "Improves concentration",
      ],
      price: "1499",
      rating: 4.5,
      image: ayurvedImage2,
    },
    {
      title: "For Depression",
      description: [
        "Reduces feelings of fatigue",
        "Increases motivation",
        "Promotes emotional stability",
      ],
      price: "1499",
      rating: 4.5,
      image: ayurvedImage3,
    },
    {
      title: "Daily Stress & Overthinking",
      description: [
        "Stabilizes thought patterns",
        "Reduces distractions",
        "Supports mental clarity",
      ],
      price: "1499",
      rating: 4.5,
      image: ayurvedImage4,
    },
    {
      title: "For Insomnia",
      description: [
        "Promotes restful sleep",
        "Calms mind, reduces overthinking",
        "Improves sleep cycle regulation",
      ],
      price: "1499",
      rating: 4.5,
      image: ayurvedImage5,
    },
    {
      title: "For Cognitive Function",
      description: [
        "Amplifies focus, cognitive precision",
        "Elevates memory retention",
        "Unlocks peak productivity potential",
      ],
      price: "1499",
      rating: 4.5,
      image: ayurvedImage6,
    },
  ];
  const products = [
    {
      id: 1,
      image: image1,
      title: "Ayurvedic Tablets",
      name: "For Sleep Wellness",
      desc: "Supports a peaceful sleep cycle and calms the mind",
      price: 1499,
      rating: 4.5,
      reviews: "5673",
    },
    {
      id: 2,
      image: image2,
      title: "Ayurvedic Tablets",
      name: "For Nourishment and Balance",
      desc: "Supports cognitive function, emotional stability, and overall well-being.",
      price: 1299,
      rating: 4.3,
      reviews: "5673",
    },
    {
      id: 3,
      image: image3,
      title: "Ayurvedic Tablets",
      name: "Complete Insomnia Treatment",
      desc: "Provides effective relief from chronic insomnia, easing anxiety and improving sleep quality",
      price: 999,
      rating: 4.7,
      reviews: "5673",
    },
  ];
  return (
    <>
      <section className="product-tips">
        <div className="product-tips-header">
          <div className="container">
            <div className="product-tips-heading">
              <h3>CALM & SLEEP AID</h3>
            </div>
            <p>
              Experience the Ayurvedic way to calm your mind and improve sleep.
              Rooted in natural brain nourishment, Ayurveda restores balance,
              reduces stress, and promotes deep, restful sleep for overall
              well-being.
            </p>
            <div className="product-tips-test">
              <p>
                <b>
                  Take the test now to find your personalized solution for
                  mental wellness!
                </b>
              </p>
              <button>
                Take the Test now for your mental health diagnosis
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="tips-product-page">
        <div className="container">
          <div className="row">
            {products.map((item) => (
              <div key={item.id} className="col-md-4 col-sm-6 col-6 mb-4">
                <Link
                  className="text-black text-decoration-none"
                  href={"/Pages/product-tips-detail"}
                >
                  <div className="product-card">
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="product-image"
                    />
                    <div className="tips-detail-card">
                      <p className="title">{item.title}</p>
                      <h5 className="product-name">{item.name}</h5>
                      <p className="product-desc">{item.desc}</p>
                      <div className="product-footer">
                        <p className="product-rating m-0">
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <i className="bi bi-star-fill"></i>
                          <span>({item.reviews} reviews)</span>
                        </p>
                        <p className="product-price m-0">
                          ₹ <span>{item.price}</span>
                        </p>
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
              {faqData.map((item, index) => (
                <div className="accordion-item" key={index}>
                  <h2 className="accordion-header" id={`heading${index}`}>
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                      aria-expanded="false"
                      aria-controls={`collapse${index}`}
                    >
                      {item.question}
                    </button>
                  </h2>
                  <div
                    id={`collapse${index}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`heading${index}`}
                    data-bs-parent="#faqAccordion"
                  >
                    <div className="accordion-body">{item.answer}</div>
                  </div>
                </div>
              ))}
            </div>

            <h5 className="mt-4">
              Complete Buyer’s Guide: Choosing the Right Calm and Sleep Aid
            </h5>
            <p>
              Finding the perfect solution for your sleep and relaxation needs is
              essential for a healthy and balanced life. Here’s a guide to help
              you decide which product suits you best.
            </p>
          </div>
        </div>
      </section>


      <section className="ayurved-product">
        <div className="container">
          <div className="row">
            {wellnessKits.map((kit, index) => (
              <div className="col-md-6 col-lg-4 col-6 mb-4" key={index}>
                <div className="product-card">
                  <div className="row align-items-center">
                    <div className="col-md-4">
                      <Image
                        src={kit.image}
                        alt={kit.title}
                        className="card-img-top"
                      />
                    </div>
                    <div className="col-md-8">
                      <div className="product-card-details">
                        <h5>{kit.title}</h5>
                        <ul>
                          {kit.description.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                        <p className="m-0">
                          ₹ <strong>{kit.price}</strong>
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
