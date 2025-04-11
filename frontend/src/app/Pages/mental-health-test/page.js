"use client";
import React, { useState } from "react";
import "./test.css";
import reviewImage from "../../Images/reviewImage1.png";
import Image from "next/image";
import ReviewSection from "../review/page";

const page = () => {
  const [answers, setAnswers] = useState({});

  const handleAnswerChange = (questionNumber, answer) => {
    setAnswers((prev) => ({ ...prev, [questionNumber]: answer }));
  };

  const questions = [
    "How often do you feel overwhelmed by daily tasks or responsibilities?",
    "Do you find it hard to concentrate or focus on tasks, even when they're important?",
    "How frequently do you feel restless or find it hard to relax?",
    "Do you often feel sad, down, or hopeless for no clear reason?",
    "How often do you feel excessively worried about the future or things outside your control?",
    "Do you lose interest in activities or hobbies you once enjoyed?",
    "How often do you experience physical symptoms like headaches, muscle tension, or stomach aches?",
    "Do you have difficulty falling asleep or staying asleep at night?",
    "How often do you feel fatigued or tired, even after getting enough sleep?",
    "Do you feel guilt or shame over things that are out of your control?",
    "How often do you feel alone or isolated from others?",
    "Do you feel that you lack the motivation to start new tasks or pursue goals?",
  ];

  const options = ["Rarely", "Sometimes", "Often", "Almost Always"];
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
  const videos = [
    {
      id: "video1",
      url: "https://www.youtube.com/embed/tgbNymZ7vqY",
    },
    {
      id: "video2",
      url: "https://www.youtube.com/embed/sBws8MSXN7A",
    },
    {
      id: "video3",
      url: "https://www.youtube.com/embed/sBws8MSXN7A",
    },
  ];
  return (
    <>
      <section className="health-test">
        <div className="container">
          <div className="health-test-breadcrumb">
            <h2>Take a Mental Health Test</h2>
            <p>
              Online screening is one of the quickest and easiest ways to
              determine whether you are experiencing symptoms of a mental health
              condition.
            </p>
            <p>
              <b>
                Mental health conditions, such as depression or anxiety, are
                real, common, and treatable. And recovery is possible.
              </b>
            </p>
          </div>
        </div>
      </section>
      <section className="test-section">
        <div className="test-heading">
          <h2>
            Stress, Anxiety & Depression Test

          </h2>
        </div>
        <div className="container">
          {questions.map((question, index) => (
            <div key={index} className="test-main">
              <p>
                {index + 1}. {question}
              </p>
              <div className="d-flex justify-content-between custom-button-group">
                {options.map((option, idx) => (
                  <button
                    key={idx}
                    className={`custom-button ${answers[index] === option ? "selected" : ""
                      }`}
                    onClick={() => handleAnswerChange(index, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="text-center">
            <button
              className="custom-submit-button"
              onClick={() => alert(`Your answers: ${JSON.stringify(answers)}`)}
            >
              Submit Test
            </button>
          </div>
        </div>
      </section>
      <section className="doctor-advice-videos">
        <div className="container">
          <h2>Doctor's Advice</h2>
          <div className="row">
            {videos.map((video) => (
              <div className="col-md-4" key={video.id}>
                <div className="video-card">
                  <iframe
                    width="100%"
                    height="250"
                    src={video.url}
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
          <ReviewSection />
      </section>
    </>
  );
};

export default page;



// "use client";
// import React, { useState } from "react";
// import "./test.css";
// import reviewImage from "../../Images/reviewImage1.png";
// import Image from "next/image";

// const page = () => {
//   const [answers, setAnswers] = useState({});

//   const handleAnswerChange = (questionNumber, answer) => {
//     setAnswers((prev) => ({ ...prev, [questionNumber]: answer }));
//   };

//   // Questions to ask the user
//   const questions = [
//     "How often do you feel overwhelmed by daily tasks or responsibilities?",
//     "How often do you feel overwhelmed by daily tasks or responsibilities?",
//     "Do you find it hard to concentrate or focus on tasks, even when they're important?",
//     "How frequently do you feel restless or find it hard to relax?",
//     "Do you often feel sad, down, or hopeless for no clear reason?",
//     "How often do you feel excessively worried about the future or things outside your control?",
//     "Do you lose interest in activities or hobbies you once enjoyed?",
//     "How often do you experience physical symptoms like headaches, muscle tension, or stomach aches?",
//     "Do you have difficulty falling asleep or staying asleep at night?",
//     "How often do you feel fatigued or tired, even after getting enough sleep?",
//     "Do you feel guilt or shame over things that are out of your control?",
//     "How often do you feel alone or isolated from others?",
//     "Do you feel that you lack the motivation to start new tasks or pursue goals?",
//   ];

//   // Options for answers
//   const options = ["Rarely", "Sometimes", "Often", "Almost Always"];

//   // Review data
//   const review = [
//     {
//       name: "Arti Kumari",
//       date: "December 18, 2023",
//       profileImage: reviewImage,
//       rating: 5,
//       reviewTitle:
//         "Lorem Ipsum is Simply Dummy Text of The nd Typesetting Industry.",
//       reviewText:
//         "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text...",
//       likes: 123,
//       dislikes: 123,
//     },
//     // Additional reviews...
//   ];

//   const reviews = [
//     { stars: 5, percentage: 10, count: 249 },
//     { stars: 4, percentage: 10, count: 0 },
//     // Additional review data...
//   ];

//   // Video data
//   const videos = [
//     { id: "video1", url: "https://www.youtube.com/embed/tgbNymZ7vqY" },
//     // Additional video data...
//   ];

//   // Function to calculate the score based on the answers
//   const calculateScore = () => {
//     let score = 0;
//     const scores = {
//       Rarely: 0,
//       Sometimes: 25,
//       Often: 50,
//       "Almost Always": 75,
//     };

//     // Iterate through the answers to calculate the score
//     for (let key in answers) {
//       score += scores[answers[key]] || 0; // Default to 0 if no answer
//     }

//     return score;
//   };

//   // Function to provide suggestions based on score
//   const getSuggestions = (score) => {
//     if (score <= 200) {
//       return {
//         message:
//           "Based on your responses, it seems like you're experiencing moderate stress or anxiety. We recommend trying relaxation exercises or speaking with a mental health professional for further advice.",
//         treatment: "Consider Cognitive Behavioral Therapy (CBT), or mindfulness techniques.",
//       };
//     } else if (score <= 300) {
//       return {
//         message:
//           "You seem to be facing significant stress or anxiety. It's essential to address these symptoms with professional help.",
//         treatment: "Consult a doctor or therapist for a detailed treatment plan. Medication might be required for a while.",
//       };
//     } else {
//       return {
//         message:
//           "Your responses indicate that you might be experiencing severe symptoms of stress, anxiety, or depression. Immediate attention is recommended.",
//         treatment: "Consult a therapist or psychiatrist for a comprehensive treatment plan, including medication if necessary.",
//       };
//     }
//   };

//   const handleSubmit = () => {
//     const score = calculateScore();
//     const suggestions = getSuggestions(score);

//     // Display the score and suggestions
//     alert(
//       `Your score is: ${score}/300\n\n${suggestions.message}\n\nSuggested Treatment: ${suggestions.treatment}`
//     );
//   };

//   return (
//     <>
//       <section className="health-test">
//         <div className="container">
//           <div className="health-test-breadcrumb">
//             <h2>Take a Mental Health Test</h2>
//             <p>
//               Online screening is one of the quickest and easiest ways to
//               determine whether you are experiencing symptoms of a mental health
//               condition.
//             </p>
//             <p>
//               <b>
//                 Mental health conditions, such as depression or anxiety, are
//                 real, common, and treatable. And recovery is possible.
//               </b>
//             </p>
//           </div>
//         </div>
//       </section>

//       <section className="test-section">
//         <div className="test-heading">
//           <h2>Stress, Anxiety & Depression Test</h2>
//         </div>
//         <div className="container">
//           {questions.map((question, index) => (
//             <div key={index} className="test-main">
//               <p>{index + 1}. {question}</p>
//               <div className="d-flex justify-content-between custom-button-group">
//                 {options.map((option, idx) => (
//                   <button
//                     key={idx}
//                     className={`custom-button ${answers[index] === option ? "selected" : ""}`}
//                     onClick={() => handleAnswerChange(index, option)}
//                   >
//                     {option}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ))}
//           <div className="text-center">
//             <button className="custom-submit-button" onClick={handleSubmit}>
//               Submit Test
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Add other sections like Doctor's Advice, Customer Reviews, etc. */}

//     </>
//   );
// };

// export default page;
