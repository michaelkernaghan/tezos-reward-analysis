import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Preset scenarios definition
const PRESET_SCENARIOS = {
 casual: {
   name: "Casual Reviewer",
   baseStake: 100,
   projectPool: 1000,
   reviewsPerCycle: 3,
   totalReviewers: 5,
   filmHoldings: 1000,
   reputation: 1.0,
   avgReviewTime: 12,
   description: "A part-time reviewer doing a few reviews per cycle"
 },
 dedicated: {
   name: "Dedicated Reviewer",
   baseStake: 250,
   projectPool: 1000,
   reviewsPerCycle: 8,
   totalReviewers: 5,
   filmHoldings: 2500,
   reputation: 1.5,
   avgReviewTime: 6,
   description: "An active reviewer with higher stakes and faster response"
 },
 professional: {
   name: "Professional Reviewer",
   baseStake: 500,
   projectPool: 1000,
   reviewsPerCycle: 10,
   totalReviewers: 5,
   filmHoldings: 5000,
   reputation: 2.0,
   avgReviewTime: 1,
   description: "Full-time reviewer with maximum engagement"
 }
};

const RewardAnalysis = () => {
 // Baker parameters from real data
 const [bakingStats] = useState({
   stakingBalance: 1889.165879,
   fillRate: 0.10,
   shareRate: 0.00019,
   baseOpportunity: 0.03,
   cycleLength: 2.84,
   efficiency: 1.0002,
   reliability: 0.7737,
   luckRange: {
     min: -0.589,
     max: 27.3053
   },
   actualROI: 2.3948
 });
 
 const [baseStake, setBaseStake] = useState(PRESET_SCENARIOS.casual.baseStake);
 const [projectPool, setProjectPool] = useState(PRESET_SCENARIOS.casual.projectPool);
 const [reviewsPerCycle, setReviewsPerCycle] = useState(PRESET_SCENARIOS.casual.reviewsPerCycle);
 const [totalReviewers, setTotalReviewers] = useState(PRESET_SCENARIOS.casual.totalReviewers);
 const [filmHoldings, setFilmHoldings] = useState(PRESET_SCENARIOS.casual.filmHoldings);
 const [reputation, setReputation] = useState(PRESET_SCENARIOS.casual.reputation);
 const [avgReviewTime, setAvgReviewTime] = useState(PRESET_SCENARIOS.casual.avgReviewTime);

 const WEIGHTS = {
   reputation: 0.40,
   stake: 0.40,
   timing: 0.10,
   holdings: 0.05,
   confidence: 0.05
 };

 const calculateBakingReward = (balance) => {
   const baseReward = balance * bakingStats.shareRate;
   const opportunityReward = bakingStats.baseOpportunity;
   const luckMultiplier = 1 + (Math.random() * 
       (bakingStats.luckRange.max - bakingStats.luckRange.min) + 
       bakingStats.luckRange.min);
   
   return (baseReward + opportunityReward) * 
          luckMultiplier * 
          bakingStats.efficiency;
 };

 const calculateReviewWeight = (reviewData) => {
   const {
     reputation,
     stake,
     reviewTime,
     holdings,
     totalStake
   } = reviewData;

   const reputationScore = Math.min(reputation / 2.0, 1);
   const stakeScore = stake / totalStake;
   const timingScore = Math.max(0, 1 - (reviewTime / 24));
   const holdingsScore = Math.min(holdings / 10000, 1);
   const confidenceScore = Math.min(stake / holdings, 1);

   return (
     (reputationScore * WEIGHTS.reputation) +
     (stakeScore * WEIGHTS.stake) +
     (timingScore * WEIGHTS.timing) +
     (holdingsScore * WEIGHTS.holdings) +
     (confidenceScore * WEIGHTS.confidence)
   );
 };

 const loadPreset = (scenario) => {
   setBaseStake(scenario.baseStake);
   setProjectPool(scenario.projectPool);
   setReviewsPerCycle(scenario.reviewsPerCycle);
   setTotalReviewers(scenario.totalReviewers);
   setFilmHoldings(scenario.filmHoldings);
   setReputation(scenario.reputation);
   setAvgReviewTime(scenario.avgReviewTime);
 };

 const generateData = () => {
   const data = [];
   let currentReputation = reputation;
   let bakingBalance = bakingStats.stakingBalance;
   let reviewBalance = bakingStats.stakingBalance;
   let totalStake = baseStake * totalReviewers;
   let initialBalance = bakingStats.stakingBalance;

   for (let cycle = 1; cycle <= 73; cycle++) {
     const bakingReward = calculateBakingReward(bakingBalance);
     bakingBalance += bakingReward;

     let cycleReviewReward = 0;
     for (let review = 0; review < reviewsPerCycle; review++) {
       const weight = calculateReviewWeight({
         reputation: currentReputation,
         stake: baseStake,
         reviewTime: avgReviewTime,
         holdings: filmHoldings,
         totalStake
       });

       const reviewReward = projectPool * weight;
       cycleReviewReward += reviewReward;
     }

     reviewBalance += cycleReviewReward;
     reviewBalance -= (baseStake * reviewsPerCycle);
     currentReputation *= (1 + 0.05 * reviewsPerCycle);

     data.push({
       cycle,
       days: Math.round(cycle * bakingStats.cycleLength),
       bakingBalance: Math.round(bakingBalance * 100000) / 100000,
       reviewBalance: Math.round(reviewBalance * 100000) / 100000,
       reputation: Math.round(currentReputation * 100) / 100,
       bakingReward: Math.round(bakingReward * 100000) / 100000,
       reviewReward: Math.round(cycleReviewReward * 100000) / 100000,
       weight: Math.round(calculateReviewWeight({
         reputation: currentReputation,
         stake: baseStake,
         reviewTime: avgReviewTime,
         holdings: filmHoldings,
         totalStake
       }) * 100),
       bakingROI: ((bakingBalance - initialBalance) / initialBalance) * 100,
       reviewROI: ((reviewBalance - initialBalance) / initialBalance) * 100
     });
   }
   return data;
 };

 const data = generateData();

 return (
   <div className="p-4 max-w-4xl mx-auto">
     <h2 className="text-2xl font-bold mb-4">Review vs Baking Returns (With Real Baking Data)</h2>

     <div className="mb-8 p-4 border rounded-lg bg-blue-50">
       <h3 className="text-xl mb-4">Current Baking Statistics</h3>
       <div className="grid grid-cols-2 gap-4">
         <div>
           <p className="font-semibold">Staking Balance: {bakingStats.stakingBalance} φ</p>
           <p>Fill Rate: {bakingStats.fillRate * 100}%</p>
           <p>Share Rate: {bakingStats.shareRate * 100}%</p>
         </div>
         <div>
           <p>Efficiency: {(bakingStats.efficiency * 100).toFixed(2)}%</p>
           <p>Reliability: {(bakingStats.reliability * 100).toFixed(2)}%</p>
           <p>ROI: {(bakingStats.actualROI * 100).toFixed(2)}%</p>
         </div>
       </div>
     </div>

     <div className="mb-8 p-4 border rounded-lg bg-green-50">
       <h3 className="text-xl mb-4">Preset Scenarios</h3>
       <div className="grid grid-cols-3 gap-4">
         {Object.entries(PRESET_SCENARIOS).map(([key, scenario]) => (
           <button
             key={key}
             onClick={() => loadPreset(scenario)}
             className="p-4 border rounded hover:bg-green-100 transition-colors"
           >
             <h4 className="font-bold">{scenario.name}</h4>
             <p className="text-sm text-gray-600">{scenario.description}</p>
           </button>
         ))}
       </div>
     </div>

     <div className="mb-8 p-4 border rounded-lg bg-gray-50">
       <h3 className="text-xl mb-4">Review Parameters</h3>
       <div className="grid grid-cols-2 gap-4">
         <div>
           <label className="block mb-2">Base Stake per Review (φ)</label>
           <input 
             type="number"
             value={baseStake}
             onChange={(e) => setBaseStake(Number(e.target.value))}
             className="w-full p-2 border rounded"
             min="0"
           />
           <p className="text-sm text-gray-600 mt-1">
             Amount you lock while reviewing. Higher stakes = larger share of rewards (40% weight). 
             Your stake is always returned after review completion.
           </p>
         </div>
         <div>
           <label className="block mb-2">Project Pool (φ)</label>
           <input 
             type="number"
             value={projectPool}
             onChange={(e) => setProjectPool(Number(e.target.value))}
             className="w-full p-2 border rounded"
             min="0"
           />
           <p className="text-sm text-gray-600 mt-1">
             Total rewards available for a project. Distributed among reviewers based on their 
             stake, reputation, timing, and holdings.
           </p>
         </div>
         <div>
           <label className="block mb-2">Reviews per Cycle (2.84 days)</label>
           <select
             value={reviewsPerCycle}
             onChange={(e) => setReviewsPerCycle(Number(e.target.value))}
             className="w-full p-2 border rounded"
           >
             <option value="1">Light (1 review per cycle)</option>
             <option value="3">Moderate (3 reviews per cycle)</option>
             <option value="5">Active (5 reviews per cycle)</option>
             <option value="8">Very Active (8 reviews per cycle)</option>
             <option value="10">Full Time (10+ reviews per cycle)</option>
           </select>
           <p className="text-sm text-gray-600 mt-1">
             More reviews increase total rewards but require more time and stake commitment.
           </p>
         </div>
         <div>
           <label className="block mb-2">Total Reviewers</label>
           <input 
             type="number"
             value={totalReviewers}
             onChange={(e) => setTotalReviewers(Math.max(1, Number(e.target.value)))}
             className="w-full p-2 border rounded"
             min="1"
           />
         </div>
         <div>
           <label className="block mb-2">FILM Holdings (φ)</label>
           <input 
             type="number"
             value={filmHoldings}
             onChange={(e) => setFilmHoldings(Number(e.target.value))}
             className="w-full p-2 border rounded"
             min="0"
           />
           <p className="text-sm text-gray-600 mt-1">
             Total FILM in your wallet. Affects rewards weighting (5%) and confidence ratio.
           </p>
         </div>
         <div>
           <label className="block mb-2">Review Response Time</label>
           <select
             value={avgReviewTime}
             onChange={(e) => setAvgReviewTime(Number(e.target.value))}
             className="w-full p-2 border rounded"
           >
             <option value="1">Very Fast (1 hour - 96% timing bonus)</option>
             <option value="6">Fast (6 hours - 75% timing bonus)</option>
             <option value="12">Medium (12 hours - 50% timing bonus)</option>
             <option value="18">Slow (18 hours - 25% timing bonus)</option>
             <option value="23">Very Slow (23 hours - 4% timing bonus)</option>
           </select>
           <p className="text-sm text-gray-600 mt-1">
             Earlier reviews receive higher rewards. Timing accounts for 10% of total reward weight.
           </p>
         </div>
         <div>
           <label className="block mb-2">Starting Reputation</label>
           <input 
             type="number"
             value={reputation}
             onChange={(e) => setReputation(Number(e.target.value))}
             className="w-full p-2 border rounded"
             step="0.1"
             min="0"
           />
           <p className="text-sm text-gray-600 mt-1">
             Your reputation score impacts rewards (40% weight). Grows with successful reviews.
           </p>
         </div>
       </div>
     </div>

     <div className="mb-8">
       <h3 className="text-xl mb-4">Balance Comparison</h3>
       <LineChart 
         width={800}
         height={400}
         data={data}
         margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
       >
         <CartesianGrid strokeDasharray="3 3" />
         <XAxis 
           dataKey="cycle" 
           label={{ value: 'Cycle', position: 'insideBottom', offset: -10 }} 
         />
         <YAxis 
           label={{ value: 'Balance (φ)', angle: -90, position: 'insideLeft', offset: -50 }}
         />
         <Tooltip />
         <Legend />
         <Line type="monotone" dataKey="bakingBalance" stroke="#8884d8" name="Baking Balance" />
         <Line type="monotone" dataKey="reviewBalance" stroke="#82ca9d" name="Review Balance" />
       </LineChart>
     </div>

     <div className="mb-8">
       <h3 className="text-xl mb-4">ROI Comparison</h3>
       <LineChart
         width={800}
         height={300}
         data={data}
         margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
       >
         <CartesianGrid strokeDasharray="3 3" />
         <XAxis dataKey="cycle" />
         <YAxis 
           label={{ value: 'ROI %', angle: -90, position: 'insideLeft', offset: -50 }}
           tickFormatter={(value) => `${value.toFixed(1)}%`}
         />
         <Tooltip formatter={(value) => `${value.toFixed(2)}%`}/>
         <Legend />
         <Line type="monotone" dataKey="bakingROI" stroke="#8884d8" name="Baking ROI" />
         <Line type="monotone" dataKey="reviewROI" stroke="#82ca9d" name="Review ROI" />
       </LineChart>
     </div>

     <div className="mb-8">
        <h3 className="text-xl mb-4">Rewards per Cycle</h3>
        <LineChart
          width={800}
          height={300}
          data={data}
          margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="cycle" />
          <YAxis label={{ value: 'Rewards (φ)', angle: -90, position: 'insideLeft', offset: -50 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="bakingReward" stroke="#8884d8" name="Baking Reward" />
          <Line type="monotone" dataKey="reviewReward" stroke="#82ca9d" name="Review Reward" />
        </LineChart>
      </div>
    </div>
  );
};

export default RewardAnalysis;