import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot } from 'recharts';

const EnhancedReputationCalculator = () => {
  // Basic reputation inputs
  const [baseRep, setBaseRep] = useState(100);
  const [confidence, setConfidence] = useState(50);
  const [voteValue, setVoteValue] = useState(50);
  const [medianVote, setMedianVote] = useState(50);
  
  // Timing and voter inputs
  const [totalVoters, setTotalVoters] = useState(10);
  const [voteTime, setVoteTime] = useState(50); // 0-100 scale where lower is earlier
  const [otherVotersRep, setOtherVotersRep] = useState(500); // Sum of other voters' reputation
  const [totalVotes, setTotalVotes] = useState(1000); // Total votes in the system
  
  // Relative reputation inputs
  const [systemAvgRep, setSystemAvgRep] = useState(100);

  const calculateConfidence = (value) => {
    const camp = 1;
    const ccenter = 50;
    const cgain = 0.02;
    return camp * Math.exp(-cgain * Math.pow(value - ccenter, 2));
  };

  const calculateAccuracy = (vote, median, totalVotes) => {
    const aamp = 1;
    const again = 0.02;
    return (aamp * Math.exp(-again * Math.pow(vote - median, 2))) / totalVotes;
  };

  const calculateTOR = (voters, currentRep, otherRep) => {
    return (voters * currentRep) / (otherRep || 1);
  };

  const calculateRelativeRep = (rep, avgRep) => {
    return rep / (avgRep || 1);
  };

  const calculateFinalReputation = (baseReputation, confScore, accScore, torScore, relRepScore) => {
    return baseReputation * confScore * accScore * torScore / relRepScore;
  };

  const reputationData = useMemo(() => {
    const calculateRepForGraph = (confValue) => {
      const confScore = calculateConfidence(confValue);
      const accScore = calculateAccuracy(voteValue, medianVote, totalVotes);
      const torScore = calculateTOR(totalVoters, baseRep, otherVotersRep);
      const relRepScore = calculateRelativeRep(baseRep, systemAvgRep);
      return calculateFinalReputation(baseRep, confScore, accScore, torScore, relRepScore);
    };

    return Array.from({ length: 101 }, (_, i) => ({
      x: i,
      value: calculateRepForGraph(i)
    }));
  }, [baseRep, voteValue, medianVote, totalVoters, otherVotersRep, totalVotes, systemAvgRep]);

  // Calculate current values for display
  const currentConfidenceScore = calculateConfidence(confidence);
  const currentAccuracyScore = calculateAccuracy(voteValue, medianVote, totalVotes);
  const currentTORScore = calculateTOR(totalVoters, baseRep, otherVotersRep);
  const currentRelRepScore = calculateRelativeRep(baseRep, systemAvgRep);
  const finalReputation = calculateFinalReputation(
    baseRep,
    currentConfidenceScore,
    currentAccuracyScore,
    currentTORScore,
    currentRelRepScore
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Complete Reputation Calculator</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Controls */}
        <div className="space-y-6">
          {/* Base Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className="text-lg font-semibold mb-3">Base Reputation</h2>
            <p className="text-sm mb-3 text-gray-600">
              Starting reputation value before adjustments
            </p>
            <div className="space-y-2">
              <label className="block">Base Reputation: {baseRep}</label>
              <input
                type="range"
                min="0"
                max="1000"
                value={baseRep}
                onChange={(e) => setBaseRep(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Confidence Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className="text-lg font-semibold mb-3">Confidence Settings</h2>
            <p className="text-sm mb-3 text-gray-600">
              Self-reported confidence in vote (optimal at 50%)
            </p>
            <div className="space-y-2">
              <label className="block">Confidence: {confidence}</label>
              <input
                type="range"
                min="0"
                max="100"
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Vote Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className="text-lg font-semibold mb-3">Vote Settings</h2>
            <p className="text-sm mb-3 text-gray-600">
              Your vote and the system's median vote
            </p>
            <div className="space-y-4">
              <div>
                <label className="block">Your Vote: {voteValue}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={voteValue}
                  onChange={(e) => setVoteValue(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block">Median Vote: {medianVote}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={medianVote}
                  onChange={(e) => setMedianVote(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Timing Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className="text-lg font-semibold mb-3">Timing and Voter Settings</h2>
            <p className="text-sm mb-3 text-gray-600">
              Factors related to voting timing and other voters
            </p>
            <div className="space-y-4">
              <div>
                <label className="block">Total Voters: {totalVoters}</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={totalVoters}
                  onChange={(e) => setTotalVoters(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block">Vote Timing (0=early, 100=late): {voteTime}</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={voteTime}
                  onChange={(e) => setVoteTime(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block">Other Voters' Total Reputation: {otherVotersRep}</label>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={otherVotersRep}
                  onChange={(e) => setOtherVotersRep(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h2 className="text-lg font-semibold mb-3">System Settings</h2>
            <p className="text-sm mb-3 text-gray-600">
              Global system parameters
            </p>
            <div className="space-y-4">
              <div>
                <label className="block">System Average Reputation: {systemAvgRep}</label>
                <input
                  type="range"
                  min="1"
                  max="1000"
                  value={systemAvgRep}
                  onChange={(e) => setSystemAvgRep(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block">Total Votes in System: {totalVotes}</label>
                <input
                  type="range"
                  min="1"
                  max="10000"
                  value={totalVotes}
                  onChange={(e) => setTotalVotes(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-blue-50 rounded-lg shadow-sm border p-4">
            <h2 className="text-lg font-semibold mb-3">Calculated Components</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Confidence Score: </span>
                <span>{currentConfidenceScore.toFixed(4)}</span>
              </div>
              <div>
                <span className="font-medium">Accuracy Score: </span>
                <span>{currentAccuracyScore.toFixed(4)}</span>
              </div>
              <div>
                <span className="font-medium">Timing of Reputation Score: </span>
                <span>{currentTORScore.toFixed(4)}</span>
              </div>
              <div>
                <span className="font-medium">Relative Reputation Score: </span>
                <span>{currentRelRepScore.toFixed(4)}</span>
              </div>
              <div className="pt-2 border-t">
                <span className="font-medium">Final Reputation: </span>
                <span>{finalReputation.toFixed(4)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Graph */}
        <div className="sticky top-6">
          <div className="bg-blue-50 rounded-lg shadow-sm border p-4">
            <h2 className="text-lg font-semibold mb-3">Reputation Graph</h2>
            <p className="text-sm mb-3 text-gray-600">
              Shows how reputation changes with confidence values under current settings
            </p>
            <LineChart width={550} height={400} data={reputationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="x"
                label={{ value: 'Confidence Value', position: 'bottom', offset: -5 }}
              />
              <YAxis
                label={{ value: 'Final Reputation', angle: -90, position: 'left', offset: 10 }}
              />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#2563eb" 
                dot={false} 
              />
              <ReferenceDot
                x={confidence}
                y={finalReputation}
                r={4}
                fill="red"
                stroke="none"
              />
            </LineChart>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedReputationCalculator;