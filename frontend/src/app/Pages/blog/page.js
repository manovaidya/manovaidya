"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "./blog.css";
import { getData, serverURL } from "@/app/services/FetchNodeServices";
import parse from "html-react-parser"; // ✅ Use html-react-parser
import { formatDate } from "@/app/constant";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const response = await getData("api/blogs/get-all-blogs");
      if (response.status === true) {
        setBlogs(response.blogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const truncateText = (htmlString, maxLength) => {
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <section className="blog-section">
      <div className="container">
        <h2 className="section-title text-center">Our Blog</h2>
        <p className="section-description text-center">
          Discover the latest insights, tips, and tricks in lifestyle, wellness,
          and skincare.
        </p>
        <div className="row">
          {blogs.map((item, index) => (
            <div className="col-md-4 col-6" key={index}>
              <div className="blog-card">
                <img
                  src={`${serverURL}/${item?.blogImage}`}
                  alt={item?.blogTitle}
                  className="blog-img"
                />
                <div className="blog-details">
                  <p className="blog-date">
                    {formatDate(item?.date)} / {item?.blogTitle}
                  </p>
                  <h3 className="blog-title">{item?.name}</h3>

                  <div
                    className="blog-desc"
                    style={{
                      lineHeight: "1.8",
                      fontSize: "18px",
                      color: "#555",
                      marginBottom: "30px",
                      padding: "0 10px",
                      textAlign: "justify",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      WebkitLineClamp: 2,
                    }}
                  >
                    {parse(truncateText(item?.description || "", 250))}
                  </div>

                  {item?.description?.length > 250 && (
                    <Link href={`blog/${item?._id}`} className="read-more-link">
                      Read More →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPage;
