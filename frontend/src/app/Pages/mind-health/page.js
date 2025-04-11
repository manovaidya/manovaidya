"use client";
import image from "../../Images/mind-health-img.png";
import Image from "next/image";
import "./mindHealth.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { postData } from "@/app/services/FetchNodeServices";
import { Parser } from "html-to-react";
const Page = () => {
  const [testData, setTestData] = useState([])

  const fetchTests = async () => {
    const response = await postData('api/test/get-mind-test');
    console.log("XXXX", response);
    if (response.status === true) {
      setTestData(response.data.reverse());
    }
  }

  useEffect(() => {
    fetchTests()
  }, [])

  return (
    <>
      <section className="mind-health-test">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-9">
              <h4>MENTAL HEALTH SELF TEST</h4>
              <p>
                Understanding your <b> mental well-being</b> is the first step
                toward a healthier, more balanced life. Our self-tests are
                designed to help you <b> gain insights into your emotions,</b>{" "}
                thoughts, and behaviors. These assessments allow you to explore
                specific areas of mental health, such as stress, anxiety, focus,
                or sleep issues, helping you <b> identify patterns</b> that may
                need attention. Whether you’re experiencing challenges in daily
                life or simply want to understand yourself better, these tests
                can be a <b> helpful guide.</b>
              </p>
              <p>
                <b>Disclaimer:</b> These self-tests are intended to provide
                insights into your mental health and are not a substitute for
                professional diagnosis or treatment. For a full evaluation or if
                you have concerns about your mental health, please consult a
                licensed mental health professional or physician.
              </p>
            </div>
            <div className="col-md-3">
              <div className="health-mind-image">
                <Image src={image} alt="health mind image" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mind-health-test-cards">
        <div className="container">
          <div className="text-center">
            <h2>
              Select Your Mental Health Test Area
            </h2>
          </div>
          <hr />
          <div className="row">
            {testData.map((test, index) => (
              <div className="col-12 col-sm-6 col-md-4 mb-3" key={index}>
                <div
                  data-aos="fade-up"
                  className="health-test-card-main"
                  style={{ backgroundColor: test.themeColor, color: "white" }} // Set the font color to white
                >
                  <div className="card-body">
                    <Link href={`/Pages/mental-health-test/${test?._id}`} style={{ color: "white" }}>
                      <h5 className="card-title">{test?.addHeaderTitle}</h5>
                      <p className="card-text">{Parser().parse(test?.keyPoint)}</p> {/* Ensure Parser() is used correctly */}
                    </Link>
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

export default Page;
