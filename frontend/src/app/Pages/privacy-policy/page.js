import React from "react";
import returnImage from "../../Images/privacy-policy.png";
import Image from "next/image";
import "../return-and-refund-policy/returnPolicy.css";

const page = () => {
  return (
    <>
      <section className="privacy-policy">
        <div>
          <div className="return-policy-header">
            <div className="row align-items-center">
              <div className="col-md-6">
                <div className="policy-header-sec1">
                  <h1>Privacy Policy of Manovaidya</h1>
                  <h5>
                    Discover how Manovaidya ensures the safety and
                    confidentiality of your personal information.
                  </h5>
                </div>
              </div>
              <div className="col-md-6 policy-header-sec2 text-end">
                <Image
                  src={returnImage}
                  alt="Privacy Policy"
                  // className="w-100" // Uncomment if you want to apply styles
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="return-policy-body">
        <div className="container">
          <p>
            Mavoidya ("we," "our," or "us") is committed to protecting your
            privacy. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you visit our website or use our
            services. Please read this policy carefully to understand our
            practices regarding your personal data.
          </p>
          <h2>1. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <h5>1.1 Personal Information</h5>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Shipping and billing address</li>
            <li>Payment information</li>
            <li>Login credentials (if you create an account)</li>
          </ul>
          <h5>1.2 Non-Personal Information</h5>
          <ul>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>IP address</li>
            <li>
              Usage data, including pages visited, time spent, and interactions
              on the website
            </li>
            <li>Cookies and other tracking technologies</li>
          </ul>
          <h2>2. How We Use Your Information</h2>
          <p>We use your information for the following purposes:</p>
          <ul>
            <li>To process and fulfill your orders.</li>
            <li>To provide customer support and respond to your inquiries.</li>
            <li>To personalize your experience on our website.</li>
            <li>
              To send promotional emails, newsletters, and updates (with your
              consent).
            </li>
            <li>To analyze website usage and improve our services.</li>
            <li>To comply with legal obligations and enforce our policies.</li>
          </ul>
          <h2>3. Sharing Your Information</h2>
          <p>
            We do not sell or rent your personal information to third parties.
            However, we may share your information with:
          </p>
          <h5>Service Providers:</h5>
          <p>
            Third-party vendors who assist us in operating our website,
            processing payments, delivering orders, and analyzing website usage.
          </p>
          <h5>Legal Authorities:</h5>
          <p>
            If required by law or to protect our rights, property, or safety.
          </p>
          <h5>Business Transfers:</h5>
          <p>
            In the event of a merger, acquisition, or sale of assets, your
            information may be transferred to the new owner.
          </p>
          <h2>4. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar technologies to enhance your experience
            on our website. Cookies help us:
          </p>
          <ul>
            <li>Recognize your preferences.</li>
            <li>Analyze website performance.</li>
            <li>Deliver personalized content and ads.</li>
          </ul>
          <p>
            You can manage cookie preferences through your browser settings.
            However, disabling cookies may affect your ability to use some
            features of our website.
          </p>
          <h2>5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal information from unauthorized access,
            alteration, disclosure, or destruction. However, no method of
            transmission over the internet is completely secure, and we cannot
            guarantee absolute security.
          </p>
          <h2>6. Your Rights</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li>Access: Request access to your personal data.</li>
            <li>
              Correction: Request corrections to inaccurate or incomplete data.
            </li>
            <li>
              Deletion: Request deletion of your personal data, subject to legal
              and contractual obligations.
            </li>
            <li>Objection: Object to certain data processing activities.</li>
            <li>
              Data Portability: Request a copy of your data in a structured,
              machine-readable format.
            </li>
          </ul>
          <p>
            To exercise these rights, please contact us at [Insert Contact
            Email].
          </p>
          <h2>7. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not
            responsible for the privacy practices of these external sites. We
            encourage you to read their privacy policies before providing any
            personal information.
          </p>
          <h2>8. Children's Privacy</h2>
          <p>
            Our website is not intended for children under the age of 13. We do
            not knowingly collect personal information from children. If you
            believe we have collected information from a child, please contact
            us, and we will take steps to delete such data.
          </p>
          <h2>9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with the updated effective date. We
            encourage you to review this policy periodically to stay informed
            about how we are protecting your information.
          </p>
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions, concerns, or requests regarding this
            Privacy Policy, please contact us at:
          </p>
          <p>
            Mavoidya Support Team
            <br />
            Email: [Insert Contact Email]
          </p>
        </div>
      </div>
    </>
  );
};

export default page;
