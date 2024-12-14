import React, { useState } from 'react';

const EnhancedMathExplanations = () => {
  const [selectedFunction, setSelectedFunction] = useState('confidence');

  const functions = {
    confidence: {
      title: "Confidence Function",
      formula: "C(x) = Camp × e^(-Cgain × (ψ(x) - Ccenter)²)",
      explanation: [
        "This is a Gaussian (bell curve) function that measures user confidence.",
        "• Camp = 1 (maximum amplitude of the curve)",
        "• Cgain = 0.02 (controls how quickly the curve drops off)",
        "• Ccenter = 50 (centers the curve at 50%)",
        "• ψ(x) is the user's confidence value between 0 and 100"
      ],
      realWorld: "Think of this like grading on a curve in a class. The highest scores are near the middle (50%), and very high or low confidence values are treated with skepticism.",
      details: "This function creates a bell curve that peaks at 50% confidence. Very low or very high confidence values result in lower scores, encouraging realistic confidence assessments."
    },
    accuracy: {
      title: "Accuracy Function",
      formula: "A(x) = (Aamp × e^(-Again × (vote(x) - MedVote(V))²)) / AllVotes(V-x)",
      explanation: [
        "This function measures how close a user's vote is to the median vote.",
        "• vote(x) is the user's vote",
        "• MedVote(V) is the median of all votes",
        "• AllVotes(V-x) is the sum of all votes except the user's",
        "• Aamp and Again are similar to Camp and Cgain"
      ],
      realWorld: "Similar to determining how accurate a price guess is by comparing it to what most people think is the right price.",
      details: "The accuracy function rewards votes that are close to the consensus (median) while penalizing outliers. It's normalized by the total votes to ensure fair comparison across different voting pools."
    },
    timing: {
      title: "Timing of Reputation",
      formula: "TOR(V,v) = (|V| × Rep(v:T)) / Σ(w∈(V-v)) Rep(w:T)",
      explanation: [
        "This function evaluates when users cast their votes relative to their reputation.",
        "• |V| is the total number of voters",
        "• Rep(v:T) is user v's reputation at time T",
        "• The denominator sums the reputation of all other voters",
        "• T(v) represents the time when user v cast their vote"
      ],
      realWorld: "Like measuring not just a student's test score, but also considering whether they submitted their work on time.",
      details: "The timing function helps ensure that high-reputation users can't simply wait to see how others vote before casting their own vote."
    },
    gains: {
      title: "User Gains Function",
      formula: "Gain(V,x) = (Stake(x) + L(x) + Deleg(x)) × A(x) + C(x) / TOR(V,x)",
      explanation: [
        "Calculates the total gain for a user's participation.",
        "• Stake(x) is the user's staked amount",
        "• L(x) and Deleg(x) are currently always zero",
        "• A(x) is the accuracy score",
        "• C(x) is the confidence score",
        "• TOR(V,x) is the timing of reputation"
      ],
      realWorld: "Similar to calculating a final grade that considers multiple factors: attendance (stake), test scores (accuracy), and participation timing.",
      details: "The gain function combines multiple aspects of user participation into a single score that determines their reward."
    },
    reviewerGains: {
      title: "Reviewer Gain Function",
      formula: "ReviewerGain(R,r) = Stake(x) / Tor(R,r)",
      explanation: [
        "Calculates the gain for reviewers who evaluate content.",
        "• R is the set of upvoters for reviewer r",
        "• Stake(x) is the reviewer's staked amount",
        "• Tor(R,r) is the timing factor for the review"
      ],
      realWorld: "Like evaluating teaching assistants based on both their expertise and how quickly they grade assignments.",
      details: "Reviewers are rewarded based on their stake and the timing of their reviews, encouraging both careful and timely evaluations."
    },
    reputation: {
      title: "Reputation Functions",
      formula: "Rep'(x) = Rep(x) × CA(x) × CC(x) / RelRep(U,x)",
      explanation: [
        "Calculates a user's updated reputation.",
        "• Rep(x) is the current reputation",
        "• CA(x) is curator accuracy",
        "• CC(x) is curator confidence",
        "• RelRep(U,x) is relative reputation compared to others"
      ],
      realWorld: "Similar to how academic reputation depends on both past achievements and recent performance.",
      details: "The reputation system adjusts user standing based on their performance as curators, including both their accuracy and confidence in assessments."
    },
    tokenHoldings: {
      title: "Token Holdings Score",
      formula: "HldingScore(x) = (Holdings(x) / Σ(u∈U) Holdings(u)) × Vth",
      explanation: [
        "Calculates a score based on token holdings.",
        "• Holdings(x) is the number of tokens held by user x",
        "• The denominator sums all users' holdings",
        "• Vth is a scaling factor"
      ],
      realWorld: "Like shareholder voting rights where voting power is proportional to shares held.",
      details: "This score ensures that users with more tokens have proportionally more influence in the system, while the scaling factor Vth prevents any single holder from having too much power."
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Understanding the Math</h1>
      
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {Object.keys(functions).map((func) => (
          <button
            key={func}
            onClick={() => setSelectedFunction(func)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap ${
              selectedFunction === func 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {functions[func].title}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold mb-4">{functions[selectedFunction].title}</h2>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Formula:</h3>
            <code className="block text-lg">{functions[selectedFunction].formula}</code>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">How it works:</h3>
            {functions[selectedFunction].explanation.map((point, idx) => (
              <p key={idx} className="mb-2">{point}</p>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded">
            <h3 className="text-lg font-semibold mb-2">Real World Example:</h3>
            <p>{functions[selectedFunction].realWorld}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Detailed Explanation:</h3>
            <p>{functions[selectedFunction].details}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMathExplanations;