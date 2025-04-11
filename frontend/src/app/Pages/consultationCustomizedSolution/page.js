"use client";
import React, { useEffect, useRef, useState } from "react";
import "./customized.css";
import Image from "next/image";
import icon1 from "../../Images/icon1.png";
import icon2 from "../../Images/icon2.png";
import icon3 from "../../Images/icon3.png";
import icon4 from "../../Images/icon4.png";
import icon5 from "../../Images/icon5.png";
import icon6 from "../../Images/icon6.png";
import icon7 from "../../Images/icon7.png";
import icon8 from "../../Images/icon8.png";
import icon9 from "../../Images/icon9.png";
import icon10 from "../../Images/icon10.png";
import icon11 from "../../Images/icon11.png";
import icon12 from "../../Images/icon12.png";
import icon13 from "../../Images/icon13.png";
import icon14 from "../../Images/icon14.png";
import banner from "../../Images/costomized-banner.png";
import logo from "../../Images/logo.png";
import "../../Component/Hero/hero.css";
import reviewImage from "../../Images/reviewImage1.png";
import { useRazorpay } from "react-razorpay";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { getData, postData, serverURL } from "@/app/services/FetchNodeServices";
import Review from "@/app/Pages/review/page";
const page = () => {
  const { error, isLoading, Razorpay } = useRazorpay();
  const [formData, setFormData] = useState({ chooseDoctor: '', scheduleTime: '10-12 AM', scheduleCalendar: '', patientName: '', concernChallenge: '', email: '', totalAmount: 1599 });
  const [user_data, setUser_data] = useState(null)
  const [urls, setUrls] = useState([])
  const modalCloseButton = useRef(null)
  const router = useRouter();


  useEffect(() => {
    const user_data = JSON.parse(localStorage.getItem("User_data"))
    setUser_data(user_data)
  }, [])

  const fetchDoctorAdvice = async () => {
    const response = await getData('api/url/get-All-url');
    // console.log("Fetched Consultations:", response.consultations.filter(url => url?.isActive === true));
    if (response.status === true) {
      const data = response.consultations.filter(url => url?.isActive === true)
      // console.log("FetchedConsultations:", response?.consultations);
      setUrls(data);
    }
  }
  useEffect(() => {
    fetchDoctorAdvice()
  }, [])

  const data = [
    { title: "Dementia", image: icon1 },
    { title: "Stress Related Migraine", image: icon2 },
    { title: "Mood Swings", image: icon3 },
    {
      title: "PTSD-POST-Traumatic Stress Disorder",
      image: icon4,
    },
    { title: "Bipolar Disorder", image: icon5 },
    { title: "Substance Use Disorders", image: icon6 },
    { title: "Schizophrenia", image: icon7 },
    {
      title: "Personality Disorders",
      image: icon8,
    },
    { title: "Eating Disorders", image: icon9 },
    {
      title: "Sexual Desire Disorders",
      image: icon10,
    },
    {
      title: "Autism-ASD: Autism Spectrum Disorder",
      image: icon11,
    },
    {
      title: "ADHD: Attention Deficit Hyperactivity Disorder",
      image: icon12,
    },
    { title: "Stress Related Thyroid", image: icon13 },
    { title: "Stress Related High B.P", image: icon14 },
  ];

  const review = [
    {
      name: "Arti Kumari",
      date: "December 18, 2023",
      profileImage: reviewImage,
      rating: 5,
      reviewTitle:
        "Lorem Ipsum is Simply Dummy Text of The nd Typesetting Industry.",
      reviewText:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
      likes: 123,
      dislikes: 123,
    },
    // Add more review objects as needed
    {
      name: "Arti Kumari",
      date: "December 18, 2023",
      profileImage: reviewImage,
      rating: 4,
      reviewTitle:
        "Lorem Ipsum is Simply Dummy Text of The nd Typesetting Industry.",
      reviewText:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
      likes: 123,
      dislikes: 123,
    },
    {
      name: "Arti Kumari",
      date: "December 18, 2023",
      profileImage: reviewImage,
      rating: 5,
      reviewTitle:
        "Lorem Ipsum is Simply Dummy Text of The nd Typesetting Industry.",
      reviewText:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
      likes: 123,
      dislikes: 123,
    },
  ];
  const reviews = [
    { stars: 5, percentage: 10, count: 249 },
    { stars: 4, percentage: 10, count: 0 },
    { stars: 3, percentage: 10, count: 0 },
    { stars: 2, percentage: 10, count: 0 },
    { stars: 1, percentage: 10, count: 0 },
  ];


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDoctorChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      chooseDoctor: value,
    });
  };

  // Razorpay payment handling
  const handleRzrpPayment = async () => {
    const options = {
      key: "rzp_test_GQ6XaPC6gMPNwH",
      amount: 1599 * 100,
      currency: "INR",
      name: "manovaidya",
      description: "Test Transaction",
      image: `${logo}`,
      handler: async (razorpayResponse) => {
        let body = { ...formData, payment_id: razorpayResponse.razorpay_payment_id, userId: user_data?._id };
        let response = await postData(`api/consultation/create-consultation`, body);
        // console.log("response", response);
        if (response?.status === true) {
          Swal.fire({
            title: "Paymant success!",
            text: "Your Paymant success",
            icon: "success",
            confirmButtonText: "Okay",
          });
          if (modalCloseButton.current) {
            modalCloseButton.current.click();
          }
          // router.push("/");
        } else {
          Swal.fire({
            title: "Paymant Failed!",
            text: "Your Paymant Failed",
            icon: "error",
            confirmButtonText: "Okay",
          });
        }

      },
      prefill: {
        name: formData?.name,
        email: formData?.email,
        contact: formData?.phone,
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new Razorpay(options);

    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.payment_id);
    });

    rzp1.open();
  };
  /////////////////////////////////////////////////////////////////////////


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("formData", formData)
    if (formData.patientName.trim() === '' || formData.concernChallenge.trim() === '' || formData.email.trim() === '' || formData.scheduleCalendar.trim() === '' || formData.scheduleTime.trim() === '') {
      toast.error('Please fill all the fields');
      return; // Exit function if validation fails
    }

    if (formData?.chooseDoctor?.trim() === '') {
      toast.error('Please select a doctor');
      return; // Exit function if validation fails
    }

    const payload = {
      userId: user_data?._id,
      patientName: formData.patientName,
      concernChallenge: formData.concernChallenge,
      email: formData.email,
      scheduleCalendar: formData.scheduleCalendar,
      scheduleTime: formData.scheduleTime,
      chooseDoctor: formData.chooseDoctor,
      totalAmount: formData.totalAmount || 1599,
    };

    console.log('Payload:', payload);

    handleRzrpPayment(payload);

  };


  const today = new Date();
  today.setDate(today.getDate() + 1); // Set the date to tomorrow

  // Format the date as YYYY-MM-DD for the min attribute
  const formattedDate = today.toISOString().split('T')[0];


  console.log('Payload@:', formData);
  return (
    <>
      <ToastContainer />
      <section className="consultation-header" data-bs-toggle="modal"
        data-bs-target="#staticBackdrop">
      </section>
      <section className="consultation-main">
        <div className="container">
          <h1>Our Specialities</h1>
          <div className="row justify-content-center">
            {data.map((item, index) => (
              <div
                className="col-lg-2 col-md-4 col-4 health_cards_main"
                key={index}
              >
                <div className="Mental-card-main">
                  <Image
                    src={item.image}
                    alt={item.title}
                    className="health-card-image"
                  />
                  <div className="card-content">
                    <p>{item.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <hr />
      </section>
      <section className="online-consultant">
        <div className="container">
          <h2>Online Consultation</h2>
          <div className="row">
            <div className="col-md-6">
              <div className="online-consultant-heading">
                <h4>Ayurveda Doctor</h4>
                <p>Mental Health Specialist</p>
              </div>
              <div className="card">
                <p>
                  Discover personalized Ayurvedic herbal medicines and solutions
                  crafted to address your unique needs and tackle the root
                  causes of your mental health concerns. Book a one-on-one
                  consultation with our Ayurvedic Mental Health Specialist today
                  and take the first step towards holistic healing and
                  well-being.
                </p>
                <div className="text-center">
                  <button
                    className="consultNow"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                  >
                    Consult Now
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="online-consultant-heading">
                <h4>Psychologist</h4>
                <p>Mental Health Coach</p>
              </div>
              <div className="card">
                <p>
                  Unlock personalized strategies and guidance to address your
                  unique challenges and promote mental well-being. Book a
                  one-on-one session with our Psychologist and Mental Health
                  Coach today to take the first step towards a healthier,
                  happier you.
                </p>
                <div className="text-center">
                  <button
                    className="consultNow"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                  >
                    Consult Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          <hr />
        </div>
        <section className="form-modal-consultation">
          <div
            className="modal fade"
            id="staticBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="staticBackdropLabel">
                    Consult with a doctor
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    ref={modalCloseButton} // Attach the ref to the close button
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row align-items-center">
                      <div className="col-md-12">
                        <div className="consult-form">
                          <label htmlFor="patientName">Patient Name</label>
                          <input
                            required
                            className="form-control"
                            name="patientName"
                            value={formData.patientName}
                            onChange={handleChange}
                            type="text"
                          />
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="consult-form">
                          <label htmlFor="concernChallenge">Concern a challenge</label>
                          <textarea
                            className="form-control"
                            rows="3"
                            required
                            name="concernChallenge"
                            value={formData.concernChallenge}
                            onChange={handleChange}
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="consult-form">
                          <label htmlFor="email">Email</label>
                          <input
                            type="email"
                            required
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="consult-form">
                          <label htmlFor="phone">Mobile No.</label>
                          <input
                            type="number"
                            required
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="consult-form">
                          <label htmlFor="scheduleCalendar">Schedule Calendar</label>
                          <input
                            type="date"
                            required
                            className="form-control"
                            name="scheduleCalendar"
                            value={formData.scheduleCalendar}
                            onChange={handleChange}
                            min={formattedDate}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="consult-form">
                          <label htmlFor="scheduleTime">Schedule Time</label>
                          <select
                            className="form-control"
                            name="scheduleTime"
                            value={formData.scheduleTime}
                            onChange={handleChange}
                          >
                            <option value="10-12 AM">10-12 AM</option>
                            <option value="12-02 PM">12-02 PM</option>
                            <option value="02-04 PM">02-04 PM</option>
                            <option value="04-06 PM">04-06 PM</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <label htmlFor="chooseDoctor">Choose Your Doctor</label>
                        <div className="d-flex gap-4">
                          <div className="form-check consult-form">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="chooseDoctor"
                              value="Ayurveda Doctor"
                              checked={formData.chooseDoctor === 'Ayurveda Doctor'}
                              onChange={handleDoctorChange}
                            />
                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                              Ayurveda Doctor
                            </label>
                          </div>
                          <div className="form-check consult-form">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="chooseDoctor"
                              value="Psychologist"
                              checked={formData.chooseDoctor === 'Psychologist'}
                              onChange={handleDoctorChange}
                            />
                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                              Psychologist
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <p className="price">₹ {formData.totalAmount || 1599}</p>
                      <button type="submit" className="consultNow">
                        Pay Now
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
      <section className="doctor-advice-videos">
        <div className="container">
          <h2>Doctor's Advice</h2>
          <div className="row">
            {urls.map((video) => (
              <div className="col-md-4 col-6" key={video.id}>
                <div className="video-card">
                  <iframe
                    width="100%"
                    height="250"
                    src={video.urls}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="customer-reviews-advice py-4">
        <div className="container">
          <h4>Customer Reviews Advice</h4>
          <hr />
          <p className="mb-3">Based on 2495 reviews</p>
          <div className="reviews-list">
            {reviews.map((review, index) => (
              <div className="row align-items-center mb-3" key={index}>
                <div className="col-3 col-md-2">
                  <div className="stars">
                    {[...Array(review.stars)].map((_, i) => (
                      <span key={i} className="text-warning">
                        &#9733;
                      </span>
                    ))}
                    {[...Array(5 - review.stars)].map((_, i) => (
                      <span key={i} className="text-muted">
                        &#9733;
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-6 col-md-8">
                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-warning"
                      role="progressbar"
                      style={{ width: `${review.percentage}%` }}
                      aria-valuenow={review.percentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>
                <div className="col-3 col-md-2">
                  <small>
                    {review.percentage}% ({review.count})
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section>
        <Review />
      </section>
    </>
  );
};

export default page;
