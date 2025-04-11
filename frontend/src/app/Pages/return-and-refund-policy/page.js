import React from "react";
import "./returnPolicy.css";
import returnImage from "../../Images/return-image.png";
import Image from "next/image";
const page = () => {
  return (
    <>
      <section className="return-policy">
        <div className="return-policy-header">
          <div className="row align-items-center">
            <div className="col-md-6">
              <div className="policy-header-sec1">
                <h1>Free return policy </h1>
                <h5>Make product return easy for you and your costomers</h5>
              </div>
            </div>
            <div className="col-md-6 policy-header-sec2">
              <Image src={returnImage} alt="return & refund victor" />
            </div>
          </div>
        </div>
        <div className="return-policy-body">
          <div className="container">
            <h2>Returns / Exchange Policy</h2>
            <p>
              Subject to Clause 9.8 below, Mavoidya shall accept only the
              following unused products for returns/exchange:
            </p>
            <ul>
              <li>Physically damaged product;</li>
              <li>
                Incomplete delivery: Where the complete product has not been
                delivered;
              </li>
              <li>
                Product mismatch: Where the product is different from the
                description on the website;
              </li>
              <li>Incorrect quantity received.</li>
            </ul>
            <p>
              You must notify Mavoidya in writing within 5 (five) business days
              from the date of receipt of the product and must not use or
              consume the product to be eligible for return/exchange.
            </p>
            <p>
              If no written notification is received by Mavoidya within the time
              frame mentioned above and/or the product is consumed, Mavoidya
              will not be obligated to accept the return/exchange. Furthermore,
              if the product was purchased using the Cash on Delivery (COD)
              option, Mavoidya reserves the right to accept return/exchange
              requests only in exceptional cases.
            </p>
            <p>
              Upon receiving a return request within the specified time frame,
              Mavoidya will arrange for the collection of the product through
              its logistics partner at no additional cost to you. The product
              will then undergo inspection as described in Clause 9.4 below.
            </p>
            <p>
              Upon receipt of the returned product, Mavoidya will inspect to
              determine if the product is defective/damaged/not as per the order
              placed or has been consumed. Based on the inspection:
            </p>
            <ul>
              <li>
                If the product is found to be undamaged, correct, and/or
                consumed, you will be notified, and the product will be
                reshipped to your address. You will be responsible for the
                shipment charges for the reshipped product.
              </li>
              <li>
                If the product is found defective/damaged/not as per the order
                and has not been consumed, Mavoidya will:
                <ul>
                  <li>
                    Replace the product within 15 (fifteen) business days of the
                    return request, or
                  </li>
                  <li>
                    Refund the payment as per the refund policy if a replacement
                    is not possible.
                  </li>
                </ul>
              </li>
            </ul>
            <p>
              In cases where you choose not to complete a recommended
              consultation or submit a required questionnaire but still seek a
              refund, you must immediately return the unused products following
              Mavoidya’s indicated process. If the inspection confirms the
              product is unused, a refund will be processed as per the refund
              policy. If the product is used or not returned in the prescribed
              manner, Mavoidya will not accept the return.
            </p>
            <p>
              Mavoidya’s decisions regarding returns/exchanges are final and
              binding, and you agree not to contest them.
            </p>
            <h2>Refund Policy</h2>
            <p>
              Refunds will be processed only under the following circumstances:
            </p>
            <ul>
              <li>
                A return/exchange request is accepted under Mavoidya’s
                return/exchange policy where:
              </li>
              <ul>
                <li>Replacement is not possible, or</li>
                <li>Replacement is not requested.</li>
              </ul>
              <li>
                A cancellation request is initiated either by you or by Mavoidya
                (including subscriptions).
              </li>
              <li>A refund request is placed as per Clause 9.8.</li>
            </ul>
            <p>
              Refund details will be communicated via your registered email.
              Mavoidya reserves the right to process refunds in a manner it
              deems fit and will only accept refund requests in exceptional
              cases. You agree not to contest such decisions.
            </p>
            <h2>Online Refunds</h2>
            <p>
              For online payments (credit card, debit card, net banking, virtual
              payment wallets), the refund will be credited to your bank account
              or wallet, as applicable.
            </p>
            <p>
              Refunds will be processed within 5 (five) business days from the
              date of the return/cancellation request (excluding Clause 9.8
              requests), subject to eligibility.
            </p>
            <p>
              For Clause 9.8 refund requests, refunds will be processed within
              45 (forty-five) business days from the request date.
            </p>
            <h2>Offline Refunds</h2>
            <p>
              For COD payments, Mavoidya will provide the refund as credit for
              future purchases on the website or cash vouchers redeemable as
              indicated by Mavoidya.
            </p>
            <p>
              Such credits/vouchers will be issued within 5 (five) business days
              of the return/cancellation request (excluding Clause 9.8
              requests), subject to eligibility.
            </p>
            <p>
              For Clause 9.8 refund requests, credits/vouchers will be issued
              within 45 (forty-five) business days from the request date.
            </p>
            <h2>Disclaimer on Product Information and Pricing</h2>
            <p>
              While Mavoidya takes utmost care to ensure accuracy in product
              descriptions and pricing, errors may occur. If a product is listed
              at an incorrect price or with incorrect information, Mavoidya
              reserves the right to either:
            </p>
            <ul>
              <li>Contact you for instructions, or</li>
              <li>Cancel the order and notify you of the cancellation.</li>
            </ul>
            <p>
              In such cases, Mavoidya will refund the transaction amount (if
              payment has already been received) in a manner it deems fit.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
