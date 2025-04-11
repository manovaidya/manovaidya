import React from "react";
import returnImage from "../../Images/term.png";
import Image from "next/image";
import "../return-and-refund-policy/returnPolicy.css";
const page = () => {
  return (
    <>
      <section className="term-conditions">
        <div>
          <div className="return-policy-header">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="policy-header-sec1">
                  <h1>Term & Conditions</h1>
                  <h5>Welcome to Manovaidya !</h5>
                </div>
              </div>
              <div className="col-md-6 policy-header-sec2 text-end">
                <Image src={returnImage} className="w-50" alt="return & refund victor" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="return-policy-body">
        <div className="container">
            
          <p>
            Welcome to Mavoidya. By accessing or using our website and services,
            you agree to comply with and be bound by the following Terms and
            Conditions ("Terms"). Please read them carefully before using our
            website. If you do not agree to these Terms, you should not use our
            website or services.
          </p>

          <h2>1. Use of the Website</h2>

          <h5>1.1. Eligibility</h5>
          <p>
            You must be at least 18 years old to use our website or services. By
            using our website, you confirm that you meet this age requirement.
          </p>

          <h5>1.2. Account Creation</h5>
          <p>
            To access certain features, you may need to create an account. You
            are responsible for maintaining the confidentiality of your login
            information and for all activities under your account.
          </p>

          <h5>1.3. Prohibited Activities</h5>
          <p>You agree not to:</p>
          <ul>
            <li>Use the website for any unlawful purpose.</li>
            <li>Interfere with the website’s functionality or security.</li>
            <li>Distribute viruses, malware, or other harmful software.</li>
            <li>
              Attempt to gain unauthorized access to any part of the website or
              user accounts.
            </li>
          </ul>

          <h2>2. Orders and Payments</h2>

          <h5>2.1. Placing Orders</h5>
          <p>
            By placing an order, you agree to provide accurate and complete
            information. Mavoidya reserves the right to cancel orders if the
            information provided is incorrect.
          </p>

          <h5>2.2. Pricing</h5>
          <p>
            All prices are listed in [Insert Currency] and are subject to change
            without notice. Mavoidya will honor the price at the time of
            purchase for confirmed orders.
          </p>

          <h5>2.3. Payments</h5>
          <p>
            We accept various payment methods, including credit cards, debit
            cards, net banking, and virtual wallets. Payment must be made in
            full at the time of purchase.
          </p>

          <h5>2.4. Order Confirmation</h5>
          <p>
            Once an order is placed, you will receive a confirmation email. This
            does not guarantee acceptance of your order. Mavoidya reserves the
            right to cancel orders due to stock unavailability, pricing errors,
            or other issues.
          </p>

          <h2>3. Shipping and Delivery</h2>

          <h5>3.1. Shipping</h5>
          <p>
            We deliver products to locations as specified on our website.
            Shipping fees and delivery timelines will be indicated at checkout.
          </p>

          <h5>3.2. Delivery Issues</h5>
          <p>
            If there are delays or issues with delivery, Mavoidya will notify
            you promptly. We are not liable for delays caused by circumstances
            beyond our control, such as natural disasters or courier
            disruptions.
          </p>

          <h5>3.3. Ownership and Risk</h5>
          <p>
            Ownership and risk transfer to you upon successful delivery of the
            product to your address.
          </p>

          <h2>4. Returns and Refunds</h2>
          <p>
            Please refer to our Returns and Refunds Policy for detailed
            information on returns, exchanges, and refunds.
          </p>

          <h2>5. Intellectual Property</h2>

          <h5>5.1. Ownership</h5>
          <p>
            All content on the website, including text, images, logos, and
            graphics, is the property of Mavoidya and protected by applicable
            copyright and trademark laws.
          </p>

          <h5>5.2. Restrictions</h5>
          <p>
            You may not copy, reproduce, distribute, or use any content without
            prior written consent from Mavoidya.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            Mavoidya is not liable for any indirect, incidental, or
            consequential damages arising from the use of our website or
            services. Our total liability, whether in contract or tort, shall
            not exceed the total amount paid by you for the purchase in
            question.
          </p>

          <h2>7. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with the
            laws of [Insert Jurisdiction]. Any disputes arising under these
            Terms shall be subject to the exclusive jurisdiction of the courts
            in [Insert Location].
          </p>

          <h2>8. Modifications to Terms</h2>
          <p>
            Mavoidya reserves the right to update or modify these Terms at any
            time without prior notice. Changes will be effective immediately
            upon posting. Your continued use of the website constitutes
            acceptance of the updated Terms.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            For questions or concerns regarding these Terms, please contact us
            at:
          </p>
          <ul>
            <li>Email: [Insert Contact Email]</li>
            <li>Phone: [Insert Contact Number]</li>
            <li>Address: [Insert Address]</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default page;
