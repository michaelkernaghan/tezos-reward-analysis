import React from 'react';

const ReputationExplainer = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Understanding the Reputation System</h1>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-lg font-semibold mb-3">Reputation Tiers</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Newbie (0-100 points)</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>1 invite per month</li>
                <li>Limited review capabilities</li>
                <li>Must stay within review score limits (4.5 to 8.5)</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Beginner (100-1000 points)</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>10 invites per month</li>
                <li>Still has review score limits</li>
                <li>Increased participation opportunities</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Pro (1000+ points)</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>25 invites per month</li>
                <li>Unrestricted review score range</li>
                <li>Enhanced review privileges</li>
                <li>Eligible for special roles</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-lg font-semibold mb-3">Ways to Earn Reputation</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">1. Daily Quizzes</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>1 point per correct answer</li>
                <li>Minimum 10 answers required to earn rewards</li>
                <li>Daily opportunities for consistent growth</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">2. Proposal Participation</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Submit quality proposals</li>
                <li>Participate in proposal rounds</li>
                <li>Earn reputation through successful submissions</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">3. Review Activities</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Submit thoughtful reviews within allowed limits</li>
                <li>Build towards unlimited review privileges</li>
                <li>Maintain quality assessments</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-lg font-semibold mb-3">Special Privileges</h2>
          <div className="space-y-2">
            <div>
              <h3 className="font-medium mb-2">Moderator Eligibility</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Requires 500+ reputation points</li>
                <li>Must be in top 75% of users by reputation</li>
                <li>Application fee required</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium mb-2">Beta Testing Access</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Available to top 50% of users by reputation</li>
                <li>Early access to new features</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h2 className="text-lg font-semibold mb-3">Optimization Strategy</h2>
          <div className="space-y-2">
            <p>To maximize reputation growth:</p>
            <ol className="list-decimal list-inside space-y-1 text-gray-600">
              <li>Participate in daily quizzes consistently</li>
              <li>Answer at least 10 questions per quiz</li>
              <li>Submit quality proposals and reviews</li>
              <li>Work towards the 1000-point threshold for unlimited reviewing</li>
              <li>Consider moderator application at 500+ points</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReputationExplainer;