import React from 'react';

const ReputationExplainer = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Understanding the Reputation System</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-lg font-semibold mb-3">The Big Picture</h2>
          <p className="mb-4">
            The reputation system works like a professional film festival jury. Instead of just counting votes, 
            it considers how well a reviewer's assessment aligns with other experienced reviewers, when they submit 
            their review relative to others, and how much they've invested in their role as a reviewer. Just as 
            established film critics build credibility over time, reviewers in this system build reputation through 
            consistent, well-timed, and well-reasoned evaluations.
          </p>
          <div className="mt-4">
            <p className="font-medium mb-2">To optimize reputation growth, reviewers should:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-600">
              <li>Submit evaluations that demonstrate careful analysis - reviews closer to the consensus can earn up to 100 reputation points, while significant outliers can lose up to 10 points</li>
              <li>Review early in the cycle - being among the first reviewers earns a timing score of 1.0, while late reviews score as low as 0.001</li>
              <li>Maintain meaningful stake amounts - your stake determines 40% of your review's weight</li>
              <li>Build and maintain reputation - your existing reputation affects 40% of your review's weight</li>
              <li>Balance stake with holdings - your stake-to-holdings ratio affects 5% of weight</li>
            </ol>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-lg font-semibold mb-3">Review Weight Components</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">1. Stake Weight (40%)</h3>
              <p className="text-gray-600">
                Like committing resources to thorough film analysis, your staked amount relative to other reviewers 
                shows your commitment level. Higher stakes demonstrate greater investment in the review process.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">2. Reputation Weight (40%)</h3>
              <p className="text-gray-600">
                Similar to how experienced film critics earn more influence over time, your accumulated reputation 
                compared to other reviewers determines your impact on project evaluations.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">3. Timing Weight (10%)</h3>
              <p className="text-gray-600">
                Just as early festival reviews help shape discussion, early project reviews carry more weight. 
                First reviewers score 1.0, decreasing to 0.001 for the latest reviews, encouraging independent 
                analysis rather than following popular opinion.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">4. Holdings Weight (5%)</h3>
              <p className="text-gray-600">
                Your token holdings relative to total holdings reflect your long-term investment in the film 
                project ecosystem.
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">5. Stake Ratio Weight (5%)</h3>
              <p className="text-gray-600">
                How much you stake relative to your holdings shows your confidence in your review, like a critic 
                willing to put their reputation on the line for their assessment.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-lg font-semibold mb-3">Reputation Growth</h2>
          <div className="space-y-2">
            <p>Your reputation grows based on the quality of your project evaluations:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              <li>Reviews that align well with other experienced reviewers can gain up to 100 reputation points</li>
              <li>Reviews that significantly deviate from consensus can lose up to 10 reputation points</li>
              <li>The system uses the top 10% of reviews as a quality benchmark</li>
              <li>Growth is proportional to how well your assessment aligns with the median evaluation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReputationExplainer;