import React from 'react';
import './styles.css'
import { calculateTotalScore, categorizeScore, getRecommendation } from './calculateScore'; // Importing the utility functions

const ResultsPage = ({ responses }) => {
  const maxScore = 60;  // 15 questions * 4 points per question (maximum score per question)

  // Calculate the total score
  const totalScore = calculateTotalScore(responses);

  // Categorize the score
  const category = categorizeScore(totalScore, maxScore);

  // Get recommendation based on the category
  const recommendation = getRecommendation(category);

  // Handle navigation after displaying results (for example, redirecting to the medicine recommendation page)
  const handleRedirect = () => {
    // router.push('/medicine-recommendation');  // Assuming there's a page for medicine recommendations
  };

  return (
    <div className={`results-container ${category.toLowerCase()}`}>
      <h1>Your Anxiety Test Results</h1>

      {/* Category Box */}
      <div className={`category-box ${category.toLowerCase()}`}>
        <h2>{category}</h2>
        <p>Your symptoms suggest {category.toLowerCase()} anxiety.</p>
      </div>

      {/* Total Score */}
      <p>Your total score: {totalScore} / {maxScore}</p>

      {/* Recommendation */}
      <p>{recommendation}</p>

      {/* Button to View Recommended Medicines */}
      <button onClick={handleRedirect}>View Recommended Medicines</button>

      {/* Optional Lifestyle Suggestions */}
      <div className="lifestyle-tips">
        <h3>Lifestyle Suggestions:</h3>
        <ul>
          <li>Practice deep breathing daily.</li>
          <li>Consider consulting a professional for support.</li>
        </ul>
      </div>

      <footer>
        <p>Taking the first step is important. We’re here to support you.</p>
        <button onClick={''}>Contact Us</button>
      </footer>
    </div>
  );
};

export default ResultsPage;
