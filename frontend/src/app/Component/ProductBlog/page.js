import React from "react";
import image1 from "../../Images/blogImage.jpg";
import Image from "next/image";
import { serverURL } from "@/app/services/FetchNodeServices";
const Page = ({ product, title }) => {
  // Array containing image data
  const images = [
    { id: 1, src: image1, alt: "Image 1", link: "#" },
    { id: 2, src: image1, alt: "Image 2", link: "#" },
    { id: 3, src: image1, alt: "Image 3", link: "#" },
    { id: 4, src: image1, alt: "Image 4", link: "#" },
    // { id: 5, src: image1, alt: "Image 5", link: "#" },
    // { id: 6, src: image1, alt: "Image 6", link: "#" },
    // { id: 7, src: image1, alt: "Image 7", link: "#" },
    // { id: 8, src: image1, alt: "Image 8", link: "#" },
  ];

  return (
    <div className="container my-4">
      <div className="row">
        {title === "Single Product" && product?.blogImages?.map((image) => (
          <div className="col-6 col-md-6 col-lg-3 mb-4" key={image.id}>
            <a href={image.link} target="_blank" rel="noopener noreferrer">
              <img
                src={`${serverURL}/uploads/products/${image}`}
                alt={image.alt}
                className="img-fluid rounded"
                style={{ cursor: "pointer" }}
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
