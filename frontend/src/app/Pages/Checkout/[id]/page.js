"use client";

import React, { use, useEffect, useState } from "react";
import "../checkout.css";
import logo from "../../../Images/logo.png";
import paymentImage1 from "../../../Images/payment-img1.png";
import paymentImage2 from "../../../Images/payment-img2.png";
import paymentImage3 from "../../../Images/payment-img3.png";
import paymentImage4 from "../../../Images/payment-img4.png";
import paymentImage5 from "../../../Images/payment-img5.png";
import Image from "next/image";
import CardImage from "../../../Images/card-image.jpg";
import { getData, postData } from "@/app/services/FetchNodeServices";
import { useRazorpay } from "react-razorpay";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux";
import { login } from "../../../redux/slices/user-slice"
import { State } from "country-state-city";

const Page = ({ params }) => {
  const { error, Razorpay } = useRazorpay();
  const router = useRouter();
  const { id } = use(params);
  const [countryCode] = useState('IN');
  const [stateList, setStateList] = useState([]);
  const dispatch = useDispatch()
  const [isChecked, setIsChecked] = useState(false);
  const [cart, setCart] = useState(null)
  const [formData, setFormData] = useState({ email: "", firstName: "", lastName: "", country: "", address: "", city: "", state: "", pinCode: "", phone: "", consent: false, saveInfo: false, paymentMethod: "Online", billingAddress: "", });
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [user_data, setUser_data] = useState(null)


  useEffect(() => {
    const ct = sessionStorage.getItem("carts");
    const cart_data = JSON.parse(ct);
    setCart(cart_data)

    const data = localStorage.getItem("User_data");
    const user_data = JSON.parse(data);
    setUser_data(user_data)

  }, [])

  useEffect(() => {
    setStateList(State?.getStatesOfCountry(countryCode));
  }, [countryCode]);
  // console.log("XXXXXXXXXXXXXXXXXXXXXXXXXX", cart)

  const removedCart = async () => {
    sessionStorage.removeItem("carts");
  };

  useEffect(() => {
    if (user_data) {
      setFormData({
        user: user_data?._id,
        ...user_data,
        email: user_data.email,
        firstName: user_data?.name,
        country: user_data?.address.country,
        houseNo: user_data?.address?.addressLine1,
        street: user_data?.address?.addressLine2,
        state: user_data?.address?.state,
        pinCode: user_data?.address?.pinCode,
        city: user_data?.address?.city
      });
    }
  }, [user_data]);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  // Handle form changes dynamically
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  //////////////////////////////////////////////////////////////////////////////////////////////
  const handleRzrpPayment = async (payload) => {
    const options = {
      key: "rzp_test_GQ6XaPC6gMPNwH",
      amount: totalWithTax() * 100,
      currency: "INR",
      name: "manovaidya",
      description: "Test Transaction",
      image: `${logo}`,
      handler: async (razorpayResponse) => {

        let body = { ...payload, payment_id: razorpayResponse.razorpay_payment_id };

        let response = await postData(`api/orders/create-order`, body);
        // console.log("response", response);
        if (response?.success === true) {
          Swal.fire({
            title: "Paymant success!",
            text: "Your Paymant success",
            icon: "success",
            confirmButtonText: "Okay",
          });
          removedCart()
          router.push("/");
        } else {
          Swal.fire({
            title: "Paymant Failed!",
            text: "Your Paymant Failed",
            icon: "error",
            confirmButtonText: "Okay",
          });
          setIsLoading(false);
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
  ////////////////////////////////////////////////////////////////////////////////
  // console.log("cart", cart)
  // Handle form submission
  const handleSubmit = async (e) => {
    // alert("jjj")
    e.preventDefault();
    const payload = {
      user: formData.user,
      email: formData.email,
      name: formData.firstName + ' ' + formData.lastName || '',
      phone: formData.billingAddress === 'different' ? formData.billingPhone : formData.phone,
      orderItems: cart?.map((item) => ({ productId: item.product._id, name: item.product.productName, price: JSON.parse(item?.item)?.finalPrice, bottle: JSON.parse(item?.item)?.bottle, day: JSON.parse(item.item).day, quantity: item.quantity })),
      address: {
        country: formData.country,
        city: formData.billingAddress === 'different' ? formData.billingCity : formData.city,
        state: formData.billingAddress === 'different' ? formData.billingState : formData.state,
        pinCode: formData.billingAddress === 'different' ? formData.billingPinCode : formData.pinCode,
        street: formData.billingAddress === 'different' ? formData.billingStreet : formData.street,
        houseNo: formData.houseNo
      },
      consent: formData.consent,
      saveInfo: formData.saveInfo,
      paymentMethod: formData.paymentMethod || 'Online',
      billingAddress: formData.billingAddress,
      totalAmount: totalWithTax(),
      shippingAmount: 75,
      couponDiscount: discount

    };

    console.log("Payload to be sent:", formData);
    // setIsLoading(true);

    try {
      if (formData.paymentMethod === 'COD') {

        const response = await postData("api/orders/create-order", payload);
        if (response?.success === true) {
          Swal.fire({
            title: "Order success!",
            text: "Your Order success",
            icon: "success",
            confirmButtonText: "Okay",
          });
          removedCart()
          router.push("/");

        } else {
          Swal.fire({
            title: "Order Failed!",
            text: "Your Order Failed",
            icon: "error",
            confirmButtonText: "Okay",
          });
          setIsLoading(false);
        }
      } else {
        handleRzrpPayment(payload)
      }

    } catch (error) {
      console.error("Checkout error:", error);
      alert("Error processing checkout.");
    }
  };

  const calculateTotal = () => {
    return cart?.reduce((total, item) => {
      const price = JSON.parse(item?.item).finalPrice;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0).toFixed(2);
  };

  const calculateTax = () => {
    const totalPrice = calculateTotal();
    return (totalPrice * 0.18).toFixed(2); // 18% tax
  };

  const totalWithTax = () => {
    const totalPrice = calculateTotal();
    const discountAmount = totalPrice * discount / 100; // Calculate the discount amount
    // console.log("Discount Amount:", discountAmount);

    const totalAfterDiscount = totalPrice - discountAmount;

    const tax = totalAfterDiscount * 0.18;

    const finalTotal = totalAfterDiscount + tax + (formData?.paymentMethod === 'COD' ? 75 : 0);

    return parseFloat(finalTotal.toFixed(2)); // Returns as a number
  };

  const applyDiscount = async () => {
    // alert(couponCode)
    const data = await postData(`api/coupon/get-coupon-by-code`, { couponCode: couponCode });
    if (data?.success === true) {
      setDiscount(data?.coupon?.discount)
    }
    // console.log("data:-", data)
  }
  return (
    <section className="checkout">
      <div className="container">
        <div className="row">
          {/* Contact and Delivery Section */}
          <div className="col-md-6">
            <div className="checkout-sec1">
              <form className="checkout-form" onSubmit={handleSubmit}>
                <h3 className="section-title">Contact</h3>
                <input className="form-control" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required />

                <h3 className="section-title">Delivery</h3>
                <input type="text" name="country" className="form-control" value={formData.country} onChange={handleInputChange} placeholder="Country" required />
                <div className="name-fields">
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name" required />
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" required />
                </div>
                <input className="form-control" type="text" name="houseNo" value={formData.houseNo} onChange={handleInputChange} placeholder="Flat/House No, Building/Apartment/Company Name" required />
                <input className="form-control" type="text" name="street" value={formData.street} onChange={handleInputChange} placeholder="Street/Road Name, Sector Name, Area/Village/PO Name" required />
                <div className="address-fields">
                  <input  className="form-control" type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City/District/Town Name" required />
                  <select 
                    name="state"
                    value={formData?.state}
                    onChange={handleInputChange}
                  >
                    <option value="">State</option>
                    {/* {stateList?.map((state) => (<option value={`${state?.name}`}>{state?.name}</option>))} */}
                    <option value="MP">MP</option>
                    <option value="UP">UP</option>
                    <option value="Dehli">Dehli</option>
                    {/* Add state options */}
                  </select>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    placeholder="PIN Code"
                    required
                  />
                </div>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  required
                />
              </form>
            </div>
            <div className="checkout-section">
              <h2>Payment</h2>
              <p>All transactions are secure and encrypted</p>
              <div className="payment-options">
                <div className="payment-option-header">
                  <div>
                    <label>
                      <input type="radio" name="paymentMethod" value="Online" checked={formData.paymentMethod === 'Online'} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} />
                      &nbsp; CashFree Payment
                      <p>(UPI, Cards, Wallets, NetBanking)</p>
                    </label>
                  </div>
                  <div>
                    <Image src={paymentImage1} alt="Visa" />
                    <Image src={paymentImage2} alt="MasterCard" />
                    <Image src={paymentImage3} alt="NetBanking" />
                    <Image src={paymentImage4} alt="NetBanking" />
                    <Image src={paymentImage5} alt="NetBanking" />
                  </div>
                </div>
                <div className="payment-info">
                  <div className="card-icon">
                    <Image src={CardImage} alt="card-image" />
                  </div>
                  <p>
                    After clicking “Pay now,” you will be redirected to Cashfree
                    Payment to complete your purchase securely.
                  </p>
                </div>
                <div className="payment-info-footer">
                  <label>
                    <input type="radio" name="paymentMethod" value="COD" checked={formData.paymentMethod === 'COD'} onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })} />
                    Cash on Delivery (COD)
                  </label>
                </div>
              </div>

              <h2>Billing Address</h2>
              <div className="billing-address">
                <label>
                  <input type="radio" name="billingAddress" value="same" checked={formData.billingAddress === 'same'} onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })} />
                  Same as shipping address
                </label>
                <label>
                  <input type="radio" name="billingAddress" value="different" checked={formData.billingAddress === 'different'} onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })} />
                  Use a different billing address
                </label>

                {formData.billingAddress === 'different' && (
                  <div style={{ padding: '20px', marginTop: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9', }}                  >
                    <h3 style={{ textAlign: 'center', color: '#333', marginBottom: '15px', fontWeight: 'bold', }}                    >
                      Billing Address
                    </h3>
                    <input type="text" name="billingStreet" value={formData.billingStreet || ''} onChange={handleInputChange} placeholder="Street, Sector Name, Area/Village/PO Name" style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px', backgroundColor: '#fff', }} />
                    <input type="text" name="billingCity" value={formData.billingCity || ''} onChange={handleInputChange} placeholder="City/District/Town Name" style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px', backgroundColor: '#fff', }} />
                    <input type="text" name="billingState" value={formData.billingState || ''} onChange={handleInputChange} placeholder="State" style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px', backgroundColor: '#fff', }} />
                    <input type="text" name="billingPinCode" value={formData.billingPinCode || ''} onChange={handleInputChange} placeholder="PIN Code" style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px', backgroundColor: '#fff', }} />
                    <input type="text" name="billingPhone" value={formData.billingPhone || ''} onChange={handleInputChange} placeholder="Phone" style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '14px', backgroundColor: '#fff', }} />
                  </div>
                )}
              </div>

              <button
                className="pay-now-btn"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? "Processing..." : "Pay Now"}
              </button>

              <div className="checkout-footer">
                <a href="#">Refund Policy</a>
                <a href="#">Shipping Policy</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
            </div>
          </div>

          {/* Order Summary Section */}
          <div className="col-md-6">
            <div className="order-summary">
              <h3 className="section-title">Order Summary</h3>
              <div className="order-image">
                <div>
                  <Image src={paymentImage1} alt="product-image" />
                </div>
                <div className="item">
                  <p>White Discharge, Itching Ayurvedic Tablets</p>
                  <p>₹{totalWithTax()}</p>
                </div>
              </div>
              <div className="discount-code">
                <input
                  className="form-control"
                  type="text"
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Discount code"
                />
                <button onClick={() => applyDiscount()}>Apply</button>
              </div>
              <div className="summary">
                <div className="summary-main">
                  <p>Subtotal:</p>
                  <span>₹{calculateTotal()}</span>
                </div>
                {discount && <div className="summary-main">
                  <p>Coupon Discount:</p>
                  <span>{discount}%</span>
                </div>}
                {formData.paymentMethod === 'COD' ? <div className="summary-main">
                  <p>Shipping:</p>
                  <span>₹ 75</span>
                </div> : ''}
                <div className="summary-main">
                  <p>Including</p>
                  <span>₹{calculateTax()} in taxes</span>
                </div>
                <div className="summary-main">
                  <p><b>Total:</b></p>
                  <span><b> ₹{totalWithTax()}</b></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
