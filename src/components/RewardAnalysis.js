import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const RewardAnalysis = () => {
 // Baker parameters
 const [bakerBalance, setBakerBalance] = useState(10000); // Default 10,000 φ
 const [cycleLength] = useState(2.84); // Days per cycle
 const [baseStakingRate] = useState(0.10); // 10% base rate
 const [opportunityVariance] = useState({
   min: -0.592, // -59.2% worst case
   max: 27.305  // +2,730.5% best case
 });
 const [efficiencyTarget] = useState(0.9845); // 98.45% target from history

 // DCP Review parameters
 const [baseStake, setBaseStake] = useState(100);
 const [projectPool, setProjectPool] = useState(1000);
 const [reviewsPerCycle, setReviewsPerCycle] = useState(8); // Adjusted for cycle length
 const [totalReviewers, setTotalReviewers] = useState(5);

 // Format numbers with φ symbol
 const formatFilm = (value) => `φ ${value.toLocaleString()}`;

 const calculateCycleReward = (balance) => {
   const baseReward = balance * (baseStakingRate / 73); // 73 cycles per year
   // Randomly simulate opportunity variance within historic range
   const opportunityMultiplier = 1 + (Math.random() * (opportunityVariance.max - opportunityVariance.min) + opportunityVariance.min);
   const efficiency = Math.random() * (1 - efficiencyTarget) + efficiencyTarget;
   return baseReward * opportunityMultiplier * efficiency;
 };

 const generateData = () => {
   const data = [];
   let currentReputation = 1;
   let bakingBalance = bakerBalance;
   let reviewBalance = bakerBalance;
   let totalStake = baseStake * totalReviewers;
   let cycleEfficiency = [];

   // Simulate 73 cycles (1 year)
   for (let cycle = 1; cycle <= 73; cycle++) {
     // Baking strategy with real variance
     const cycleReward = calculateCycleReward(bakingBalance);
     bakingBalance += cycleReward;
     
     // Track efficiency
     const efficiency = cycleReward / (bakingBalance * (baseStakingRate / 73));
     cycleEfficiency.push(efficiency);

     // Review strategy
     let cycleReviewReward = 0;
     for (let review = 0; review < reviewsPerCycle; review++) {
       const reviewReward = (baseStake * (projectPool / totalStake)) * currentReputation;
       cycleReviewReward += reviewReward;
     }

     reviewBalance += cycleReviewReward;
     reviewBalance -= (baseStake * reviewsPerCycle); // Account for staking costs

     // Update reputation based on successful reviews
     currentReputation *= (1 + 0.05 * reviewsPerCycle);

     data.push({
       cycle,
       days: Math.round(cycle * cycleLength),
       bakingBalance: Math.round(bakingBalance),
       reviewBalance: Math.round(reviewBalance),
       reputation: Math.round(currentReputation * 100) / 100,
       cycleReward: Math.round(cycleReward),
       efficiency: Math.round(efficiency * 10000) / 100, // Convert to percentage
       accumulatedRewards: Math.round(bakingBalance - bakerBalance)
     });
   }
   return data;
 };

 const data = generateData();

 // Custom tooltip to show cycle details
 const CustomTooltip = ({ active, payload, label }) => {
   if (active && payload && payload.length) {
     return (
       <div className="bg-white p-2 border rounded shadow">
         <p className="text-sm font-bold">Cycle: {label} (Day {payload[0]?.payload.days})</p>
         {payload.map((entry, index) => (
           <p key={index} style={{ color: entry.color }}>
             {entry.name}: {entry.name.includes('Balance') || entry.name.includes('Reward') ? 
               formatFilm(entry.value) : 
               entry.name === 'Efficiency' ? 
                 `${entry.value}%` : 
                 entry.value}
           </p>
         ))}
       </div>
     );
   }
   return null;
 };

 return (
   <div className="p-4 max-w-4xl mx-auto">
     <h2 className="text-2xl font-bold mb-4">Baking vs Review Analysis (Cycle-based)</h2>

     <div className="mb-8 p-4 border rounded-lg bg-gray-50">
       <h3 className="text-xl mb-4">Parameters</h3>
       <div className="grid grid-cols-2 gap-4">
         <div>
           <label className="block mb-2 font-medium">Baker's Balance (φ)</label>
           <input 
             type="number" 
             value={bakerBalance}
             onChange={(e) => setBakerBalance(Number(e.target.value))}
             className="w-full p-2 border rounded"
             min="0"
             step="1000"
           />
         </div>
         <div>
           <label className="block mb-2 font-medium">Reviews per Cycle</label>
           <input 
             type="number"
             value={reviewsPerCycle}
             onChange={(e) => setReviewsPerCycle(Number(e.target.value))}
             className="w-full p-2 border rounded"
             min="0"
           />
         </div>
         <div>
           <label className="block mb-2 font-medium">Base Stake (φ)</label>
           <input 
             type="number"
             value={baseStake}
             onChange={(e) => setBaseStake(Number(e.target.value))}
             className="w-full p-2 border rounded"
             min="0"
           />
         </div>
         <div>
           <label className="block mb-2 font-medium">Project Pool (φ)</label>
           <input 
             type="number"
             value={projectPool}
             onChange={(e) => setProjectPool(Number(e.target.value))}
             className="w-full p-2 border rounded"
             min="0"
           />
         </div>
         <div>
           <label className="block mb-2 font-medium">Total Reviewers</label>
           <input 
             type="number"
             value={totalReviewers}
             onChange={(e) => setTotalReviewers(Math.max(1, Number(e.target.value)))}
             className="w-full p-2 border rounded"
             min="1"
           />
         </div>
       </div>
     </div>

     <div className="mb-8">
       <h3 className="text-xl mb-4">Balance Comparison by Cycle</h3>
       <LineChart 
         width={800}
         height={400}
         data={data}
         margin={{
           top: 20,
           right: 30,
           left: 60,
           bottom: 20
         }}
       >
         <CartesianGrid strokeDasharray="3 3" />
         <XAxis 
           dataKey="cycle" 
           label={{ 
             value: 'Cycle', 
             position: 'insideBottom',
             offset: -10
           }} 
         />
         <YAxis 
           label={{ 
             value: 'Balance (φ)', 
             angle: -90, 
             position: 'insideLeft',
             offset: -50
           }}
           tickFormatter={formatFilm}
         />
         <Tooltip content={<CustomTooltip />} />
         <Legend verticalAlign="top" height={36} />
         <Line type="monotone" dataKey="bakingBalance" stroke="#8884d8" name="Baking Balance" />
         <Line type="monotone" dataKey="reviewBalance" stroke="#82ca9d" name="Review Balance" />
       </LineChart>
     </div>

     <div className="mb-8">
       <h3 className="text-xl mb-4">Baking Efficiency by Cycle</h3>
       <LineChart 
         width={800}
         height={300}
         data={data}
         margin={{
           top: 20,
           right: 30,
           left: 60,
           bottom: 20
         }}
       >
         <CartesianGrid strokeDasharray="3 3" />
         <XAxis dataKey="cycle" />
         <YAxis 
           label={{ 
             value: 'Efficiency (%)', 
             angle: -90, 
             position: 'insideLeft',
             offset: -50
           }}
         />
         <Tooltip content={<CustomTooltip />} />
         <Legend verticalAlign="top" height={36} />
         <Line type="monotone" dataKey="efficiency" stroke="#ff7300" name="Efficiency" />
       </LineChart>
     </div>

     <div className="space-y-4">
       <h3 className="text-xl">Historic Performance Metrics</h3>
       <ul className="list-disc pl-6">
         <li>Base Staking Rate: {baseStakingRate * 100}%</li>
         <li>Cycle Length: {cycleLength} days</li>
         <li>Historic Efficiency Range: {efficiencyTarget * 100}%</li>
         <li>Opportunity Range: {opportunityVariance.min * 100}% to +{opportunityVariance.max * 100}%</li>
       </ul>
     </div>
   </div>
 );
};

export default RewardAnalysis;