import React from "react";
import aboutimage from "../../Images/about-image.png";
import Image from "next/image";
import "./about.css";
import Head from "next/head";
const page = () => {
  return (
    <>
    <Head>
        <title>About Us - Manovaidya</title>
        <meta
          name="description"
          content="Discover how Manovaidya integrates Ayurveda and mental health practices to offer holistic well-being solutions."
        />
        <meta name="keywords" content="Ayurveda, Mental Health, Manovaidya, Holistic Healing" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <section className="about-us">
        <div className="container">
          <h2 className="heading">About Us</h2>
          <div className="row align-items-center">
            <div className="col-md-4">
              <div className="about-card-1">
                <p>
                  Ayurveda, meaning "The Science of Life," is an ancient Indian
                  system of healing that dates back over 5,000 years. It takes a
                  holistic approach to health, aiming to balance the body, mind,
                  and spirit through natural remedies, lifestyle changes, and
                  dietary practices.
                </p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <Image
                src={aboutimage}
                alt="about-image"
                width={300}
                height={300}
              />
            </div>
            <div className="col-md-4">
              <div className="about-card-2">
                <p>
                  Mental Health refers to emotional, psychological, and social
                  well-being. It affects how we think, feel, and behave in daily
                  life, influencing how we cope with stress, relate to others,
                  and make decisions. Nurturing mental health is essential for
                  leading a fulfilling and balanced life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="about-details">
        <div className="container">
        <h2 className="heading">How Manovaidya Brings the Two Together</h2>
        <p>
          At Manovaidya, we believe that true mental well-being stems from a
          delicate balance between ancient wisdom and modern understanding.
          Rooted in Ayurveda’s timeless principles, we craft personalized
          solutions for mental health challenges like stress, anxiety,
          depression, and more. By integrating powerful herbal formulations with
          targeted lifestyle recommendations, we offer holistic support tailored
          to your unique needs.
        </p>
        <p>
          Our approach combines the best of Ayurveda and mental health science,
          providing remedies that not only address symptoms but also target the
          root causes. At Manovaidya, we’re committed to empowering individuals
          to achieve peace of mind, emotional strength, and overall harmony.
        </p>
        </div>
      </section>
    </>
  );
};

export default page;
