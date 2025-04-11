export const calculateTotalScore = (responses) => {
    // Assign scores to the answers
    const scoreMapping = {
        "Rarely": 1,
        "Sometimes": 2,
        "Often": 3,
        "Almost Always": 4
    };

    // Calculate total score based on responses
    let totalScore = 0;
    responses?.forEach(response => {
        totalScore += scoreMapping[response];
    });

    return totalScore;
};

export const categorizeScore = (totalScore, maxScore) => {
    const percentage = (totalScore / maxScore) * 100;

    if (percentage <= 33) {
        return "Mild";
    } else if (percentage <= 66) {
        return "Moderate";
    } else {
        return "Severe";
    }
};

export const getRecommendation = (category) => {
    switch (category) {
        case "Mild":
            return "We recommend taking the anxiety medicines combo for 4-6 months.";
        case "Moderate":
            return "We recommend taking the anxiety medicines combo for 6 months to 1 year.";
        case "Severe":
            return "We recommend taking the anxiety medicines combo for 1 to 2 years.";
        default:
            return "Please consult a healthcare provider for more information.";
    }
};
