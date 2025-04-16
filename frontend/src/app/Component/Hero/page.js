"use client";
import React, { useEffect, useState } from "react";
import "./hero.css";
import Link from "next/link";
import { getData, serverURL } from "@/app/services/FetchNodeServices";
import { Parser } from "html-to-react";
import Slider from "react-slick";

const Page = ({ title }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([])
  const [diseases, setDiseases] = useState([])


  const fetchAllDisease = async () => {
    try {
      const response = await getData('api/subcategories/get-all-sub-diseases');
      console.log("DATA:GGGGGG", response)
      if (response.success) {
        const activeDiseases = response?.subcategories?.filter(product => product?.isActive === true);
        setDiseases(activeDiseases);
      } else {
        toast.error("Failed to load sub diseases");
      }
    } catch (error) {
      toast.error("An error occurred while fetching sub diseases");
    }
  };


  const fetchProduct = async () => {
    const data = await getData('api/products/all-product');
    // console.log("DATA:", data);
    if (data?.success === true) {
      // Filter the products where isActive is true
      const activeProducts = data?.products.filter(product => product.wellnessKits === true);
      setProducts(activeProducts);
    }
  }
  // Fetch categories data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getData('api/categories/get-All-category');
        if (response.success === true) {
          // setCategories(response?.categories);
          const activecategories = response?.categories.filter(categorie => categorie.isActive === true);
          setCategories(activecategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchAllDisease()
    fetchCategories();
    fetchProduct()
  }, []);

  console.log(products, "PRODUCTS")
  const settings = {
    autoplay: true,
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  };
  return (
    <>

      <section className="sidebutton">
        <a href="/">
          <i className="bi bi-arrow-up-circle"></i>
        </a>
      </section>

      <section className="sidewhatsapp">
        <a target="_blank" href="https://wa.me/+919131734930" rel="noopener noreferrer">
          <i className="bi bi-whatsapp"></i>
        </a>
      </section>

      <section className="sidecall">
        <a href="tel:+919131734930">
          <i className="bi bi-telephone"></i>
        </a>
      </section>
      <section className="sideInstagram">
        <a href="https://www.instagram.com/silent_lover_aasib_mp07" target="_blank" rel="noopener noreferrer">
          <i className="bi bi-instagram"></i>
        </a>
      </section>

      <section className="top-cards">
        <h2 className="text-center" style={{ fontWeight: '700', color: 'var(--purple)' }}>Explore By Diseases</h2>
        <div className="cards-container">
          {categories?.map((categorie, index) => (
            <Link href={`/Pages/product-tips/${categorie?._id}`} key={index}>
              <div data-aos="fade-up" className="card-main">
                <img
                  src={`${serverURL}/uploads/categorys/${categorie.image}`}
                  alt={categorie?.categoryName}
                  className="hero-cardDieses"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="top-cards-slider">
        <div className="container">
          <div className="slider-container">
            <Slider {...settings}>
              {categories?.map((card, index) => (
                <div className="card-slide" key={index}>
                  <Link href={`/Pages/product-tips/${card?._id}`}>
                    <div className="card-main">
                      <img
                        src={`${serverURL}/uploads/categorys/${card.image}`}
                        alt={card?.categoryName}
                        className="card-image"
                        width={300}
                        height={200}
                      />
                      {/* <h3 className="card-title">{card.name}</h3> */}
                    </div>
                  </Link>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      <section className="ayurved-product">
        <div className="container">
          <h2 className="text-center text-purple">Ayurvedic Wellness Kits</h2>
          <div className="row">
            {products?.map((kit, index) => (
              <div className="col-md-6 col-6 col-lg-4" key={index}>
                <Link className="pruduct-link-all" href={`/Pages/products/${kit?._id}`}>
                  <div className="product-card">
                    <div className="row align-items-center">
                      <div className="col-md-4">
                        <img
                          src={`${serverURL}/uploads/products/${kit?.productImages[0]}`}
                          alt={kit?.title}
                          className="card-img-top"
                          width={200}
                          height={200}
                          style={{ cursor: "pointer", borderRadius: '8px' }}
                        />
                      </div>
                      <div className="col-md-8">
                        <div className="product-card-details">
                          <h5>{kit?.productName}</h5>
                          <span className="descrip">
                            {Parser().parse(kit?.productDescription)}</span>
                          <div className="detail-sec">
                            <p className="off-price m-0">
                              <b style={{ fontSize: "14px" }}>
                                {kit?.variant[0]?.discountPrice} % off
                              </b>
                            </p>
                            <span className="final-price">
                              <strong>₹ {kit?.variant[0]?.finalPrice}</strong>
                            </span>
                            <p className="del-mrp">
                              MRP: <del>
                                ₹ {kit?.variant[0]?.price}
                              </del>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="product-overview-bg">
        <Link href={'/Pages/products'}>

          <button className="buy-now">Buy It Now</button>
        </Link>
      </section>

      <section className="MentalHealthCards">
        <div className="container">
          <div className="row justify-content-center">
            {diseases?.map((item, index) => (
              <div
                className="col-lg-2 col-md-4 col-6 health_cards_main"
                key={index}
              // onClick={() => localStorage.setItem('diseasData', JSON.stringify({ id: item._id, title: 'diseas' }))}
              >
                <Link href={{ pathname: `/Pages/products`, query: { id: item?._id, title: 'subDiseas' } }}>
                  <div data-aos="zoom-in-down" className="Mental-card-main shadow-lg">
                    <img
                      src={`${serverURL}/uploads/subcategorys/${item?.image}`}
                      alt={item.name}
                      className="health-card-image"
                      width={100}
                      height={100}
                    />
                    <div className="card-content">
                      <p>{item?.name}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
