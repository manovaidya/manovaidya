"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getData, serverURL } from "@/app/services/FetchNodeServices";
import { toast } from "react-toastify";

const Page = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await getData('api/categories/all-categories'); // ✅ adjust endpoint if needed
      if (response.success) {
        const activeCategories = response.categories.filter(cat => cat?.isActive === true);
        setCategories(activeCategories);
      } else {
        toast.error("Failed to load categories");
      }
    } catch (error) {
      toast.error("An error occurred while fetching categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="container">
      <section className="top-cards">
        <h2 className="text-center" style={{ fontWeight: '700', color: 'var(--purple)' }}>
          Explore By Diseases
        </h2>
        <div className="cards-container">
          {categories?.map((category, index) => (
            <Link href={`/Pages/product-tips/${category?._id}`} key={index}>
              <div data-aos="fade-up" className="card-main">
                <img
                  src={`${serverURL}/uploads/categorys/${category.image}`}
                  alt={category?.categoryName}
                  className="hero-cardDieses"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Page;
