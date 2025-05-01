"use client";
import React, { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { IoInformationCircleOutline } from "react-icons/io5";
import Slider from "react-slick";
import "../../products/products.css";
import '../../productDetails/productDetails.css'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import googleImage from "../../../Images/googleImage.svg";
import ProductBlog from "../../../Component/ProductBlog/page";
import { getData, postData, serverURL } from "@/app/services/FetchNodeServices";
import { Parser } from "html-to-react";
import Swal from "sweetalert2";
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux";
import { login } from '../../../redux/slices/user-slice'
import { toast, ToastContainer } from "react-toastify";
import { formatDate } from "@/app/constant";
import image1 from "../../../Images/paymantIcon/google-pay 1.png";
import image2 from "../../../Images/paymantIcon/640px-Paytm_logo 1.png";
import image3 from "../../../Images/paymantIcon/images 1.png";
import image4 from "../../../Images/paymantIcon/Mastercard-logo.svg 1.png";
import image5 from "../../../Images/paymantIcon/visa-logo-png-image-4 (1) 1.png";

const paymentImages = [{ name: image1 }, { name: image2 }, { name: image3 }, { name: image4 }, { name: image5 }]

const Page = ({ params }) => {
  // Unwrap the params with React.use()

  const dispatch = useDispatch()
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [User_data, setUser_data] = useState(null)
  const [user_token, setUser_token] = useState(null)
  const [buttonText, setButtonText] = useState('Add To Cart')
  const [btn, setBtn] = useState(false)
  const [formData, setFormData] = useState({ profileImage: null });
  const [review, setReview] = useState([])
  // const [ratingDistribution, setRatingDistribution] = useState([]);

  useEffect(() => {
    const user = localStorage.getItem('User_data')
    const User_data = JSON.parse(user)
    setUser_data(User_data)
    const user_token = localStorage.getItem('token')
    setUser_token(user_token)
    const carts = localStorage.getItem('carts')
    setCart(carts)
  }, [])
  ////////////////////////////////////////////////////////////////////////

  const fetchProductById = async () => {
    const data = await getData(`api/products/get_product_by_id/${id}`)
    console.log("productDetail:-", data)
    if (data.success === true) {
      setProduct(data?.product)
    }
  }

  const fetchReview = async () => {
    try {
      const response = await getData("api/products/get-all-reviews");
      if (response.success === true) {
        setReview(response?.reviews?.filter((r) => r?.status === true) || []);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }
  useEffect(() => {
    fetchProductById()
    fetchReview()
  }, [id])

  //////////////////////////////////////////////////////////////////////
  const handleSelect = (index, item) => {
    setSelectedIndex(index);
    localStorage.setItem("productItem", JSON.stringify(item))
    dispatch(login(item));
    setBtn(true)
  };


  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  let sliderRef1 = useRef(null);
  let sliderRef2 = useRef(null);

  useEffect(() => {
    setNav1(sliderRef1);
    setNav2(sliderRef2);
  }, []);

  if (!product) {
    return <div className="loading">Loading...</div>;
  }

  const handleCartSubmit = async () => {
    const quantity = 1;
    const item = localStorage.getItem("productItem");
    const bd = { product, quantity, item };

    const cartss = JSON.parse(sessionStorage.getItem("carts")) || [];
    const cartLocal = JSON.parse(localStorage.getItem("carts")) || [];

    const isProductInCart = cartss.some((cartItem) => cartItem.product._id === bd.product._id);

    if (isProductInCart) {
      Swal.fire({
        title: "Item Already in Cart!",
        text: "This item is already in your cart.",
        icon: "info",
        confirmButtonText: "Go to Cart",
      }).then(() => {
        router.push('/Pages/cart/id');
        // setButtonText.router.push('/Pages/cart/id')
        // setButtonText("Okay");
      })
    } else {
      let body = { userId: User_data?._id, productId: product?._id, quantity, item };

      const updatedCartLocal = [...cartLocal, body];
      localStorage.setItem("carts", JSON.stringify(updatedCartLocal));

      const updatedCartSession = [...cartss, bd];
      sessionStorage.setItem("carts", JSON.stringify(updatedCartSession));
      dispatch(login({ cart: updatedCartSession }));
      Swal.fire({
        title: "Item Added!",
        text: "Your item has been added to the cart.",
        icon: "success",
        confirmButtonText: "Go to Cart",
      }).then(() => {
        setButtonText("Go to Cart");
      });
    }
  };

  const goToCart = () => {
    router.push(`/Pages/cart/${User_data?._id}`);
  };

  const BuyItNow = () => {
    const quantity = 1;
    const item = localStorage.getItem("productItem");
    const bd = { product, quantity, item };

    const cartss = JSON.parse(sessionStorage.getItem("carts")) || [];
    const cartLocal = JSON.parse(localStorage.getItem("carts")) || [];

    const isProductInCart = cartss.some((cartItem) => cartItem.product._id === bd.product._id);

    if (isProductInCart) {
      Swal.fire({
        title: "Item Already in Cart!",
        text: "This item is already in your cart.",
        icon: "info",
        confirmButtonText: "Go to Cart",
      }).then(() => {
        router.push(`/Pages/Checkout/${User_data?._id}`);
        // setButtonText.router.push('/Pages/cart/id')
        // setButtonText("Okay");
      })
    } else {
      let body = { userId: User_data?._id, productId: product?._id, quantity, item };

      const updatedCartLocal = [...cartLocal, body];
      localStorage.setItem("carts", JSON.stringify(updatedCartLocal));
      const updatedCartSession = [...cartss, bd];
      sessionStorage.setItem("carts", JSON.stringify(updatedCartSession));
      dispatch(login({ cart: updatedCartSession }));
      Swal.fire({
        title: "Item Added!",
        text: "Your item has been added to the cart.",
        icon: "success",
        confirmButtonText: "Go to Cart",
      }).then(() => {
        setButtonText("Go to Cart");
        router.push(`/Pages/Checkout/${User_data?._id}`);
      });
    }
  }
  // console.log("XXXXXXXXXXXXXXXX", product?.urls[0].url)

  const handleReviewImage = (event) => {
    setFormData((prevData) => ({ ...prevData, profileImage: { bytes: event.target.files[0], filename: URL.createObjectURL(event.target.files[0]) } }))
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault(); // You should prevent default to avoid page reload
    console.log("Form Data:", formData);

    try {
      if (formData?.profileImage?.bytes) {
        // If image is selected
        const form = new FormData();
        form.append("name", formData.name || '');
        form.append("productId", id);
        form.append("profileImage", formData.profileImage.bytes);
        form.append("rating", formData.rating || '');
        form.append("email", formData.email || '');
        form.append("reviewText", formData.reviewText || '');

        const res = await postData("api/products/reviews", form);
        console.log("Response:", res);

        if (res.success) {
          toast.success("Review submitted successfully!");
          resetForm();
        } else {
          toast.error(res?.message || "Something went wrong!");
        }

      } else {
        // No image selected -> Submit without image
        const body = { name: formData.name || '', email: formData.email || '', rating: formData.rating || '', reviewText: formData.reviewText || '', productId: id };

        const res = await postData("api/products/without-image-reviews", body);
        console.log("Response:", res);

        if (res.success) {
          toast.success("Review submitted successfully!");
          resetForm();
        } else {
          toast.error(res?.message || "Something went wrong!");
        }
      }

    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("There was an error submitting your review. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', rating: '', reviewText: '', profileImage: null });
    const modalElement = document.getElementById('exampleModalToggle');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
      modal.hide();
    }
  };
  // console.log("XXXXXXXXXXXXXX", review)


  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: review.filter(review => review.rating === rating).length,
    percentage: (review.filter(review => review.rating === rating).length / review.length) * 100
  }));

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 992, // Medium devices (tablets)
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768, // Small devices (phones)
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  console.log("XXXXXXXXXXXXXX:==", product)

  const handleReview = () => {
    alert("Login First Then Give Review")
    router.push('/Pages/Login');
  };

  return (
    <>
      <ToastContainer />
      <section className="product-details-section">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <Slider
                asNavFor={nav2}
                ref={(slider) => {
                  setNav1(slider);
                  sliderRef1.current = slider;
                }}
              >
                {product?.productImages?.map((image, index) => (
                  <div key={index}>
                    <img
                      src={`${serverURL}/uploads/products/${image}`}
                      alt={`Slide ${index + 1}`}
                      className="product-details-image"
                    />
                  </div>
                ))}
              </Slider>

              <Slider
                asNavFor={nav1}
                ref={(slider) => {
                  setNav2(slider);
                  sliderRef2.current = slider;
                }}
                autoplay={true}
                autoplaySpeed={3000}
                infinite={true}
                pauseOnHover={true}
                slidesToShow={4}
                swipeToSlide={true}
                focusOnSelect={true}
              >
                {product?.productImages?.map((image, index) => (
                  <div className="product-mini-images" key={index}>
                    <img
                      src={`${serverURL}/uploads/products/${image}`}
                      alt={`Thumbnail ${index + 1}`}
                      style={{ width: "95%", height: "100px", objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </Slider>
            </div>

            <div className="col-md-6">
              <div className="product-details">
                <h1>{product.productName}</h1>
                <p className="product-detail-desc">{product?.productSubDescription}</p>

                {/* Price & Rating */}
                <div className="product-price-rating">
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Image
                      src={googleImage} // Replace with an actual Google logo image path
                      alt="Google Logo"
                      width={30}
                    />
                    <span style={{ fontWeight: "bold", fontSize: "30px" }}>
                      {product.rating}
                    </span>
                    <span style={{ color: "#FFD700", fontSize: "28px" }}>★★★★★</span>
                  </div>

                  <p className="m-0">
                    <span style={{ color: "var(--purple)", fontWeight: '600', }}>{product.reviews}+ reviews</span>
                  </p>
                </div>

                {/* Features List */}
                <p >Helping In</p>
                {Parser().parse(product?.productDescription)}

                {/* Pricing Options */}
                <hr />
                <div className="product-detail-smrini">
                  <h2>{product?.smirini}</h2>
                  <div className="row">
                    {product?.variant?.map((item, index) => (
                      <div className="col-md-4 col-6" key={index}>
                        <div
                          className={`product-detail-card ${selectedIndex === index ? "selected" : ""}`}
                          onClick={() => handleSelect(index, item)}>
                          <div className="product-detail-card-content">
                            {selectedIndex === index && <span className="tick-mark">✔</span>}
                            <p className="smrini-duration">{item?.duration}</p>
                            <h1 className="smrini-price" style={{ color: '#800080' }}>{item?.day}</h1>
                            <p className="smrini-bottle">{item?.bottle}</p>
                            <hr />
                            <p className="smrini-original-price">₹ <del>{item?.price}</del></p>
                            <p className="smrini-price">₹ {item?.finalPrice}</p>
                            <p className="smrini-discount">{item?.discountPrice}% Off</p>
                            <p className="smrini-taxes" >{item?.tex}% Taxes</p>
                            <p className="smrini-saving">Save ₹ {(item?.price - item?.finalPrice).toFixed(2)}</p>
                          </div>

                          <p className="smrini-bestseller" style={{ background: `${item?.tagType?.tagColor}` }}>{item?.tagType?.tagName || "Best Seller"}</p>

                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Buy Now Button */}
                  <div className="bynowbtns" >
                    {buttonText === "Add To Cart" ? (
                      <div className="col-md-12" >
                        <div onClick={btn ? handleCartSubmit : () => toast.error("Select Price")} className="bynowbtn mt-3 " style={{ cursor: "pointer" }}>
                          {buttonText}
                        </div>
                      </div>
                    ) : (
                      <div className="col-md-12">
                        <div onClick={goToCart} className="bynowbtn mt-3" style={{ cursor: "pointer" }}>
                          {buttonText}
                        </div>
                      </div>
                    )}

                    <div className="col-md-12">
                      <div onClick={btn ? BuyItNow : () => toast.error("Select Price")} className="bynowbtn mt-3" style={{ cursor: "pointer" }}>
                        BUY IT NOW
                      </div>
                    </div>
                  </div>

                  {/* Payment Images */}
                  <div className="col-md-12">
                    <div className="payment-images">
                      {paymentImages?.map((image, index) => (
                        <Link href="/" key={index}>
                          <Image src={image?.name} alt="Payment Option" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ingredients-detail">
        <div className="container">
          <h2>Herbs for Natural</h2>
          <div className="row">
            {product?.herbsId?.map((item, index) => (
              <div key={index} className="col-md-4 col-6">
                <div className="ingredent-main" style={{ position: "relative" }}>
                  <img src={`${serverURL}/uploads/herbs/${item?.images[0]}`} alt="ingredents-image" />
                  <p>{item?.name}</p>
                  <div
                    data-bs-toggle="modal"
                    data-bs-target={`#modal-${index}`} // Unique ID for each modal
                    style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    <IoInformationCircleOutline size="20px" />
                  </div>
                </div>

                {/* Modal for each item */}
                <div
                  className="modal fade"
                  id={`modal-${index}`} // Unique modal ID
                  aria-hidden="true"
                  aria-labelledby={`modal-${index}-label`} // Unique label ID
                  tabIndex="-1"
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id={`modal-${index}-label`}>
                          {item?.name}
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="d-flex justify-content-center align-items-center mb-3">
                          <img
                            src={`${serverURL}/uploads/herbs/${item?.images[0]}`}
                            alt="ingredents-image"
                            style={{ maxWidth: '100%', maxHeight: '250px' }}
                          />
                        </div>
                        <div>{Parser()?.parse(item?.content)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="ingredients-accordion">
        <div className="container">
          <div className="accordion accordion-flush" id="accordionFlushExample">
            {product?.faqs?.map((item) => (
              <div className="accordion-item" key={item?._id}>
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#${item?._id}`}
                    aria-expanded="false"
                    aria-controls={item?._id}
                  >
                    {item?.question}
                  </button>
                </h2>
                <div id={item?._id} className="accordion-collapse collapse" aria-labelledby={item?._id} data-bs-parent="#accordionFlushExample">
                  <div className="accordion-body">{item?.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="product-blog-section">
        <ProductBlog product={product} title="Single Product" />
      </section>

      <section className="doctor-advice-videos">
        <div className="container">
          <h2>Doctor's Advice</h2>
          <div className="row">
            {product?.urls?.map((video) => (<>
              {console.log(`${video?.url}`)}
              <div className="col-md-4 col-6" key={video?._id}>
                <div className="video-card">
                  <iframe
                    width="100%"
                    height="250"
                    src={video?.url}
                    title={`Doctor's Advice - ${video?._id}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </>))}
          </div>
        </div>
      </section>

      {product?.RVUS.length > 0 ? <section className="doctor-advice-videos">
        <div className="container">
          <h2>Review Video </h2>
          <div className="row">
            {product?.RVUS?.map((video) => (<>
              {console.log(`${video?.RVU}`)}
              <div className="col-md-4 col-6" key={video?._id}>
                <div className="video-card">
                  <iframe
                    width="100%"
                    height="250"
                    src={video?.RVU}
                    title={`Doctor's Advice - ${video?._id}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </>))}
          </div>
        </div>
      </section> : ""}


      <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5 fc-perple" id="exampleModalToggleLabel">Your Review is Important to us.</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form id="reviewForm" onSubmit={handleReviewSubmit}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <div className="mb-3">
                    <label htmlFor="reviewName" className="form-label">Your Name</label>
                    <input type="text" onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="form-control" id="reviewName" placeholder="Enter Name" value={formData.name} required />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="reviewEmail" className="form-label">Your Email</label>
                    <input type="email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="form-control" id="reviewEmail" placeholder="Enter your email" value={formData.email} required />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="reviewRating" className="form-label">Rating</label>
                    <select className="form-select" onChange={(e) => setFormData({ ...formData, rating: e.target.value })} id="reviewRating" value={formData.rating} required>
                      <option value="" disabled>Select Rating</option>
                      <option value="1">1 Star</option>
                      <option value="2">2 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="5">5 Stars</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <button type="button" onClick={() => document.getElementById('imageUpload').click()} className="btn btn-secondary">
                      <input id="imageUpload" onChange={handleReviewImage} hidden type="file" accept="image/*" />
                      YOUR IMAGE
                    </button>
                  </div>
                  <div>
                    {formData.profileImage && (
                      <img src={formData?.profileImage?.filename} alt="Uploaded" style={{ width: 100, height: 100, objectFit: 'cover' }} />
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="reviewBody" className="form-label">Your Review</label>
                  <textarea onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })} className="form-control" id="reviewBody" rows="4" placeholder="Write your review" value={formData.reviewText} required></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="submit" form="reviewForm" className="btn bg-warning" data-bs-dismiss="modal" >Submit Review</button>
            </div>
          </div>
        </div>
      </div>
      <section className="customer-reviews-advice py-4">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h4>Customer Reviews Advice</h4>
            {user_token ? <button class="btn bg-warning" style={{ marginRight: '50px' }} data-bs-target="#exampleModalToggle" data-bs-toggle="modal">
              Give Review
            </button> : <button class="btn bg-warning" onClick={handleReview} style={{ marginRight: '50px' }} data-bs-target="#exampleModalToggle" >
              Give Review
            </button>}
          </div>
          <hr />

          <p className="mb-3">Based on {review.length} reviews</p>
          <div className="reviews-list">
            {ratingDistribution.map((distribution, index) => {
              // Find the count of reviews for the specific rating
              const countForRating = review.filter(review => review.rating === distribution.rating).length;
              const percentage = (countForRating / review.length) * 100;

              return (
                <div className="row align-items-center mb-3" key={index}>
                  <div className="col-3 col-md-2">
                    <div className="stars">
                      {[...Array(distribution.rating)].map((_, i) => (
                        <span key={i} className="text-warning">
                          &#9733;
                        </span>
                      ))}
                      {[...Array(5 - distribution.rating)].map((_, i) => (
                        <span key={i} className="text-muted">
                          &#9733;
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="col-6 col-md-8">
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{ width: `${percentage}%` }}
                        aria-valuenow={percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  <div className="col-3 col-md-2">
                    <small>
                      {percentage.toFixed(2)}% ({countForRating})
                    </small>
                  </div>
                </div>
              );
            })}
          </div>


        </div>
      </section>
      <section className="review-section py-5 bg-light">
        <div className="container">
          <h2 className="mb-3 text-center fw-bold">What Our Users Say</h2>
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={3}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              992: {
                slidesPerView: 3,
              },
            }}
          >
            {review?.map((review, index) => (
              <SwiperSlide className="p-3" key={index}>
                <div className="card border rounded-4 h-100">
                  <div className="card-body p-2">
                    <div className="d-flex align-items-center mb-4">
                      <img
                        src={review?.profileImage ? `${serverURL}/${review.profileImage}` : `${serverURL}/uploads/logos/fav.jpg`}
                        alt={review?.name}
                        className="rounded-circle me-3"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <h5 className="mb-1 fw-semibold">{review?.name}</h5>
                        <small className="text-muted">{formatDate(review?.createdAt)}</small>
                      </div>
                    </div>
                    <p
                      className="card-text text-secondary"
                      style={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        WebkitLineClamp: 4,
                        // minHeight: "80px",
                      }}
                    >
                      {review?.reviewText}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>


    </>

  );
};

export default Page;