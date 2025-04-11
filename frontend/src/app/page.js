import React from "react";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "../app/Component/Slider/page";
import Hero from "../app/Component/Hero/page";
import Newslater from "../app/Component/newslater/page"
import ProductSlider from "./Component/productSlider/page";
const page = () => {
  return (
    <>
      <Slider />
      <Hero title="home" />
      <ProductSlider />
      <Newslater />
    </>
  );
};

export default page;
