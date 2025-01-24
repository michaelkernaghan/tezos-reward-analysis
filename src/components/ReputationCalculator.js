import React, { useState, useMemo } from 'react';

const AccurateReputationCalculator = () => {
  const [review, setReview] = useState({
    stake: 100,
    currentReputation: 1.0,
    tokenHoldings: 1000,
    reviewSubmitTime: 0, // 0 to 100 representing order in review sequence
    averageScore: 5, // 0-10 scale as shown in UI
  });

  // System state
  const [systemState, setSystemState] = useState({
    maxStake: 200,
    medianScore: 5,
    totalHoldings: 10000,
    numberOfReviewers: 5,
  });

  // Calculate time score (1.0 for first, 0.001 for last)
  const calculateTimeScore = (submitTime) => {
    const scale = (1 - (submitTime / 100));
    return Math.max(0.001, scale);
  };

  // Calculate stake score (stake/maxStake)
  const calculateStakeScore = (stake, maxStake) => {
    return Math.min(maxStake > 0 ? stake / maxStake : 0, 1);
  };

  // Calculate holdings score
  const calculateHoldingsScore = (holdings, totalHoldings) => {
    return Math.min(holdings / totalHoldings, 1);
  };

  // Calculate stake ratio
  const calculateStakeRatio = (stake, holdings) => {
    return Math.min(holdings > 0 ? stake / holdings : stake > 0 ? 1 : 0, 1);
  };

  // Calculate reputation score
  const calculateReputationScore = (currentRep) => {
    return Math.min(currentRep / 2.0, 1);
  };

  // Calculate final weight using actual API weightings
  const calculatedScores = useMemo(() => {
    const timeScore = Math.min(calculateTimeScore(review.reviewSubmitTime), 1);
    const stakeScore = calculateStakeScore(review.stake, systemState.maxStake);
    const holdingsScore = calculateHoldingsScore(review.tokenHoldings, systemState.totalHoldings);
    const stakeRatio = calculateStakeRatio(review.stake, review.tokenHoldings);
    const reputationScore = calculateReputationScore(review.currentReputation);

    const finalWeight = (
      (stakeScore * 0.40) +          // 40% stake weight
      (reputationScore * 0.40) +     // 40% reputation weight
      (holdingsScore * 0.05) +       // 5% holdings weight
      (timeScore * 0.10) +           // 10% timing weight
      (stakeRatio * 0.05)            // 5% stake ratio weight
    );

    return {
      timeScore,
      stakeScore,
      holdingsScore,
      stakeRatio,
      reputationScore,
      finalWeight
    };
  }, [review, systemState]);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reputation Calculator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Review Parameters */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className="text-lg font-semibold mb-3">Review Parameters</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Your Stake: {review.stake}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={review.stake}
                  onChange={(e) => setReview({...review, stake: Number(e.target.value)})}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Current Reputation: {review.currentReputation}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={review.currentReputation}
                  onChange={(e) => setReview({...review, currentReputation: Number(e.target.value)})}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Token Holdings: {review.tokenHoldings}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={review.tokenHoldings}
                  onChange={(e) => setReview({...review, tokenHoldings: Number(e.target.value)})}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Review Timing (0=first, 100=last): {review.reviewSubmitTime}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={review.reviewSubmitTime}
                  onChange={(e) => setReview({...review, reviewSubmitTime: Number(e.target.value)})}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* System State */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className="text-lg font-semibold mb-3">System State</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Maximum Stake in System: {systemState.maxStake}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={systemState.maxStake}
                  onChange={(e) => setSystemState({...systemState, maxStake: Number(e.target.value)})}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Total System Holdings: {systemState.totalHoldings}
                </label>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  value={systemState.totalHoldings}
                  onChange={(e) => setSystemState({...systemState, totalHoldings: Number(e.target.value)})}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className="text-lg font-semibold mb-3">Component Scores</h2>
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-2">
                Raw scores (before applying weights):
              </div>
              <div>
                <span className="font-medium">Stake Score: </span>
                <span>{calculatedScores.stakeScore.toFixed(4)}</span>
              </div>
              <div>
                <span className="font-medium">Reputation Score: </span>
                <span>{calculatedScores.reputationScore.toFixed(4)}</span>
              </div>
              <div>
                <span className="font-medium">Time Score: </span>
                <span>{calculatedScores.timeScore.toFixed(4)}</span>
              </div>
              <div>
                <span className="font-medium">Holdings Score: </span>
                <span>{calculatedScores.holdingsScore.toFixed(4)}</span>
              </div>
              <div>
                <span className="font-medium">Stake Ratio Score: </span>
                <span>{calculatedScores.stakeRatio.toFixed(4)}</span>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="text-sm text-gray-600 mb-2">
                  Weighted scores (after applying weights):
                </div>
                <div>
                  <span className="font-medium">Stake (40%): </span>
                  <span>{(calculatedScores.stakeScore * 0.4).toFixed(4)}</span>
                </div>
                <div>
                  <span className="font-medium">Reputation (40%): </span>
                  <span>{(calculatedScores.reputationScore * 0.4).toFixed(4)}</span>
                </div>
                <div>
                  <span className="font-medium">Time (10%): </span>
                  <span>{(calculatedScores.timeScore * 0.1).toFixed(4)}</span>
                </div>
                <div>
                  <span className="font-medium">Holdings (5%): </span>
                  <span>{(calculatedScores.holdingsScore * 0.05).toFixed(4)}</span>
                </div>
                <div>
                  <span className="font-medium">Stake Ratio (5%): </span>
                  <span>{(calculatedScores.stakeRatio * 0.05).toFixed(4)}</span>
                </div>
              </div>

              <div className="pt-4 border-t mt-4">
                <span className="font-medium">Final Weight: </span>
                <span>{calculatedScores.finalWeight.toFixed(4)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg shadow-sm border p-4">
            <h2 className="text-lg font-semibold mb-3">How This Works</h2>
            <div className="space-y-2 text-sm">
              <p>Your review's weight is calculated using the exact formulas from the API:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>40% from stake relative to maximum stake in system</li>
                <li>40% from your current reputation (capped at 2x median)</li>
                <li>10% from review timing (1.0 for first, 0.001 for last)</li>
                <li>5% from holdings relative to total system holdings</li>
                <li>5% from stake-to-holdings ratio</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccurateReputationCalculator;