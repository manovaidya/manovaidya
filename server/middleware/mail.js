import Nodemailer from "nodemailer";

const sendOtpPartnerSignUp = async (data) => {
  const { email, otp } = data;
  console.log("email", email, "otp", otp);
  const body = `
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your recovery email</title>
    <style>
        body {
            margin: 0 auto;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border: 1px solid gainsboro;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }

        .logo {
            margin-bottom: 20px;
        }

        .title {
            font-size: 24px;
            color: black;
            font-weight: 500;
            margin-top: 5%;
            margin-bottom: 5%;
        }

        .message {
            font-size: 16px;
            color: #272727;
            margin-bottom: 20px;
            line-height: 1.5;
            text-align: left;
        }

        .code {
            font-size: 36px;
            color: black;
            font-weight: 700;
            margin-bottom: 20px;
            letter-spacing: 2px;
        }

        .note {
            font-size: 14px;
            color: #272727;
            text-align: left;
            margin-top: 20px;
            margin-bottom: 5%;
            line-height: 1.5;
        }

        .footer{
            color: #4a4a4a;
            font-size: 12px;
            max-width: 600px;
            text-align: center;
        }
    </style>
</head>

<body>
    <div style="margin: 0 auto">
        <div class="container">
            <div class="logo">
               <img src="https://api.manovaidya.com/uploads/logo-image/GABOTEC%20LOGO.png" style="width: 180px;"
                    alt="Manodaidya Logo">
            </div>
            <div class="title">Verify your Email</div>
            <hr style="opacity: 30%; margin-top: 3%; margin-bottom: 3%;" />
            <div class="message">
                CarInteriro received a request to verify <strong>${email}</strong> as an onboarding process.
                <br><br>
                Use this code to safely verify your email:
            </div>
            <div class="code">${otp}</div>
          <p class="footer">All rights reserved © 2024 |CarInteriro Solutions Private Limited | 6-67, Yerrakunta, Chandrayangutta, Hyderabad, Telangana 500005</p>
        </div>
    </div>
</body>
</html>
  `;
  const subject = "Verify your Email";
  return await sendMail({ to: email, subject, html: body });
};

const sendResetPassword = async (data) => {
  const { email, token, user } = data;
  // ADMIN_BASE_URL
  console.log("token_data:==", email, token);
  const baseUrl =
    user === "admin" ? process.env.ADMIN_BASE_URL : process.env.BASE_URL;
  const resetLink = baseUrl + `/Pages/reset-password/${token}`;

  const body = `
    <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your recovery email</title>
      <style>
          body {
              margin: 0 auto;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
          }
  
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              border: 1px solid gainsboro;
              padding: 20px;
              border-radius: 8px;
              text-align: center;
          }
  
          .logo {
              margin-bottom: 20px;
          }
  
          .title {
              font-size: 24px;
              color: black;
              font-weight: 500;
              margin-top: 5%;
              margin-bottom: 5%;
          }
  
          .message {
              font-size: 16px;
              color: #272727;
              margin-bottom: 20px;
              line-height: 1.5;
              text-align: left;
          }
  
          .code {
              font-size: 36px;
              color: black;
              font-weight: 700;
              margin-bottom: 20px;
              letter-spacing: 2px;
          }
  
          .note {
              font-size: 14px;
              color: #272727;
              text-align: left;
              margin-top: 20px;
              margin-bottom: 5%;
              line-height: 1.5;
          }
  
          .footer{
              color: #4a4a4a;
              font-size: 12px;
              max-width: 600px;
              text-align: center;
          }
      </style>
  </head>
  
  <body>
      <div style="margin: 0 auto">
          <div class="container">
              <div class="logo">
                  <img src="https://api.manovaidya.com/uploads/logos/logo.png" style="width: 180px;">
              </div>
              <div class="title">Reset Password</div>
              <hr style="opacity: 30%; margin-top: 3%; margin-bottom: 3%;" />
              <div class="message">
                  CarInteriro received a request to <strong>Change Password</strong>.
                  <br><br>
                  Use this link to safely reset your password: ${resetLink}
              </div>
             <p class="footer">All rights reserved © 2024 | CarInteriro | 18-13-6/80, Rajiv Gandhi Nagar, Dastagirnagar, Chandrayangutta- 500005
              Hyderabad, Telangana</p>
          </div>
      </div>
  </body>
  
  </html>
    `;

  const subject = "Reset your Password";
  return await sendMail({ to: email, subject, html: body });
};

const sendEmailUpdateOtp = async (data) => {
  const { name, otp, email } = data;

  const body = `
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your recovery email</title>
    <style>
        body {
            margin: 0 auto;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border: 1px solid gainsboro;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }

        .logo {
            margin-bottom: 20px;
        }

        .title {
            font-size: 24px;
            color: black;
            font-weight: 500;
            margin-top: 5%;
            margin-bottom: 5%;
        }

        .message {
            font-size: 16px;
            color: #272727;
            margin-bottom: 20px;
            line-height: 1.5;
            text-align: left;
        }

        .code {
            font-size: 36px;
            color: black;
            font-weight: 700;
            margin-bottom: 20px;
            letter-spacing: 2px;
        }

        .note {
            font-size: 14px;
            color: #272727;
            text-align: left;
            margin-top: 20px;
            margin-bottom: 5%;
            line-height: 1.5;
        }

        .footer{
            color: #4a4a4a;
            font-size: 12px;
            max-width: 600px;
            text-align: center;
        }
    </style>
</head>

<body>
    <div style="margin: 0 auto">
        <div class="container">
            <div class="logo">
                <img src="https://api.manovaidya.com/uploads/logos/logo.png" style="width: 180px;"
                    alt="Oredo GPS Logo">
            </div>
            <div class="title">Verify your New Email</div>
            <hr style="opacity: 30%; margin-top: 3%; margin-bottom: 3%;" />
            <div class="message">
                Oredo GPS received a request to <strong>Change email</strong>.
                <br><br>
                Use this code to safely verify your new email:
            </div>
            <div class="code">${otp}</div>

           <p class="footer">All rights reserved © 2024 | Oredo CarInteriro Solutions Private Limited | 6-67, Yerrakunta, Chandrayangutta, Hyderabad, Telangana 500005</p>
        </div>
    </div>
</body>

</html>
  `;

  const subject = "Verify your Email";
  return await sendMail({ to: email, subject, html: body });
};

const sendThankYouForBookingConsultation = async (data) => {
  const {
    patientName,
    concernChallenge,
    email,
    phone,
    scheduleCalendar,
    scheduleTime,
    chooseDoctor,
    payment_id,
  } = data;

  const body = `
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You for Booking Consultation</title>
    <style>
        body {
            margin: 0 auto;
            padding: 0;
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f9;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .header {
            background-color: #4CAF50;
            padding: 20px;
            text-align: center;
            color: #fff;
        }

        .header img {
            width: 150px;
            margin-bottom: 10px;
        }

        .title {
            font-size: 28px;
            font-weight: 600;
            margin-top: 15px;
        }

        .message {
            font-size: 16px;
            color: #333;
            line-height: 1.6;
            margin-top: 10px;
            padding: 0 20px;
        }

        .details {
            font-size: 16px;
            color: #333;
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 20px;
        }

        .details strong {
            color: #4CAF50;
        }

        .cta-button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            font-size: 16px;
            text-align: center;
        }

        .footer {
            background-color: #f1f1f1;
            text-align: center;
            font-size: 12px;
            color: #777;
            padding: 20px;
            margin-top: 20px;
        }

        .footer a {
            color: #4CAF50;
            text-decoration: none;
        }

    </style>
</head>

<body>

    <div class="container">
        <div class="header">
            <img src="https://api.manovaidya.com/uploads/logos/logo.png" alt="Gabotec Logo">
            <h2 class="title">Thank You for Booking a Consultation!</h2>
        </div>

        <div class="message">
            <p>Dear ${patientName},</p>
            <p>Thank you for booking a consultation with us. We're excited to help you on your health journey!</p>
            <p>Here are your consultation details:</p>
        </div>

        <div class="details">
            <p><strong>Consultation Date:</strong> ${scheduleCalendar}</p>
            <p><strong>Consultation Time:</strong> ${scheduleTime}</p>
            <p><strong>Doctor:</strong> ${chooseDoctor}</p>
        </div>

        <div class="message">
            <p>Please ensure to arrive at least 10 minutes before your scheduled time. If you need to reschedule or have any questions, feel free to contact us.</p>
        </div>

        // <a href="https://api.manovaidya.com/appointments" class="cta-button">Manage Your Appointment</a>

        // <div class="footer">
        //     <p>All rights reserved © 2024  | 6-67, Yerrakunta, Chandrayangutta, Hyderabad, Telangana 500005</p>
        //     <p>If you did not request this appointment, please <a href="mailto:support@gabotec.com">contact support</a> immediately.</p>
        // </div>
    </div>

</body>

</html>
  `;
  const subject = "Thank You for Booking Consultation";
  return await sendMail({ to: email, subject, html: body });
};

const transporter = Nodemailer.createTransport({
  host: "smtp.hostinger.com", // Replace with your SMTP server host
  port: 465, // Replace with your SMTP server port
  secure: true, // true for 465, false for other ports
  auth: {
    user: "info@gromedia.co.in", // Replace with your SMTP server username
    pass: "@Gromedia2024", // Replace with your SMTP server password
  },
});

const sendMail = ({ to, subject, html, from = "info@gromedia.co.in" }) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: "ManoVaidya <info@gromedia.co.in>",
      to,
      subject,
      html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve(info);
    });
  });
};

export {
  sendOtpPartnerSignUp,
  sendResetPassword,
  sendEmailUpdateOtp,
  sendThankYouForBookingConsultation,
};
