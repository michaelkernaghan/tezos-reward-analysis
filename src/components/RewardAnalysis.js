import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Weight systems based on community discussion
const WEIGHT_SYSTEMS = {
    current: {
        name: "Current System (From Smart Contracts)",
        weights: {
            reputation: 0.40,
            stake: 0.40,
            timing: 0.10,
            holdings: 0.05,
            confidence: 0.05
        },
        description: "Current system implemented in smart contracts. Emphasizes reputation and stake equally."
    },
    proposed: {
        name: "Community Focused (Proposed)",
        weights: {
            community: 0.50,
            impact: 0.25,
            staking: 0.15,
            ranking: 0.10
        },
        description: "Community proposal emphasizing direct participation and project impact."
    }
};

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
    // State for parameters
    const [weightSystem, setWeightSystem] = useState('current');
    const [baseStake, setBaseStake] = useState(PRESET_SCENARIOS.casual.baseStake);
    const [projectPool, setProjectPool] = useState(PRESET_SCENARIOS.casual.projectPool);
    const [reviewsPerCycle, setReviewsPerCycle] = useState(PRESET_SCENARIOS.casual.reviewsPerCycle);
    const [totalReviewers, setTotalReviewers] = useState(PRESET_SCENARIOS.casual.totalReviewers);
    const [filmHoldings, setFilmHoldings] = useState(PRESET_SCENARIOS.casual.filmHoldings);
    const [reputation, setReputation] = useState(PRESET_SCENARIOS.casual.reputation);
    const [avgReviewTime, setAvgReviewTime] = useState(PRESET_SCENARIOS.casual.avgReviewTime);
    const [showFormulas, setShowFormulas] = useState(false);

    // Formula documentation from smart contracts
    const formulaDoc = {
        weight: `
   // From smart contract KT1HnUrq3KkSbjM92vypZhXqznUxQkBgapJu
   calculateReviewWeight = (reviewData) => {
     const reputationScore = Math.min(reputation / 2.0, 1);     // Cap at 1.0
     const stakeScore = stake / totalStake;                     // Relative stake
     const timingScore = Math.max(0, 1 - (reviewTime / 24));    // Earlier = better
     const holdingsScore = Math.min(holdings / 10000, 1);       // Cap at 10000 FILM
     const confidenceScore = Math.min(stake / holdings, 1);     // Stake to holdings ratio
     
     return (
       (reputationScore * 0.40) +   // 40% weight
       (stakeScore * 0.40) +        // 40% weight
       (timingScore * 0.10) +       // 10% weight
       (holdingsScore * 0.05) +     // 5% weight
       (confidenceScore * 0.05)     // 5% weight
     );
   }`,
        reward: `
   // Reward calculation
   const reviewReward = projectPool * weight;
   
   // Total reward factors:
   // 1. Project pool size
   // 2. Your weight relative to total system weight
   // 3. Number of reviews in cycle
   // 4. Reputation growth over time
   `,
        reputation: `
   // Reputation growth
   reputation *= (1 + 0.02 * reviewsPerCycle / Math.sqrt(cycle));
   reputation = Math.min(reputation, MAX_REPUTATION);  // Cap at 5.0
   `
    };

    const calculateReviewWeight = (reviewData) => {
        const {
            reputation,
            stake,
            reviewTime,
            holdings,
            totalStake
        } = reviewData;

        if (weightSystem === 'current') {
            const reputationScore = Math.min(reputation / 2.0, 1);
            const stakeScore = stake / totalStake;
            const timingScore = Math.max(0, 1 - (reviewTime / 24));
            const holdingsScore = Math.min(holdings / 10000, 1);
            const confidenceScore = Math.min(stake / holdings, 1);

            return (
                (reputationScore * WEIGHT_SYSTEMS.current.weights.reputation) +
                (stakeScore * WEIGHT_SYSTEMS.current.weights.stake) +
                (timingScore * WEIGHT_SYSTEMS.current.weights.timing) +
                (holdingsScore * WEIGHT_SYSTEMS.current.weights.holdings) +
                (confidenceScore * WEIGHT_SYSTEMS.current.weights.confidence)
            );
        } else {
            // Proposed community-focused system
            const communityScore = Math.min(reputation / 2.0, 1); // Using reputation as proxy for now
            const impactScore = Math.random(); // Placeholder - would need real impact metrics
            const stakingScore = stake / totalStake;
            const rankingScore = Math.min(reputation / 5.0, 1);

            return (
                (communityScore * WEIGHT_SYSTEMS.proposed.weights.community) +
                (impactScore * WEIGHT_SYSTEMS.proposed.weights.impact) +
                (stakingScore * WEIGHT_SYSTEMS.proposed.weights.staking) +
                (rankingScore * WEIGHT_SYSTEMS.proposed.weights.ranking)
            );
        }
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
        let reviewBalance = filmHoldings;
        const initialBalance = filmHoldings;

        // Validation checks
        const MAX_REPUTATION = 5.0;
        const MIN_PROJECT_SHARE = 0.01;
        const MAX_REVIEW_SHARE = 0.40;

        let totalStake = baseStake * totalReviewers;

        const averageWeight = calculateReviewWeight({
            reputation: 1.0,
            stake: baseStake,
            reviewTime: 12,
            holdings: filmHoldings,
            totalStake
        });

        for (let cycle = 1; cycle <= 73; cycle++) {
            let cycleReviewReward = 0;
            const totalSystemWeight = totalReviewers * averageWeight;

            const systemCheck = {
                totalStakeValid: totalStake > 0,
                reputationValid: currentReputation <= MAX_REPUTATION,
                weightValid: totalSystemWeight > 0
            };

            if (!Object.values(systemCheck).every(Boolean)) {
                console.warn('System check failed:', systemCheck);
                break;
            }

            const yourWeight = calculateReviewWeight({
                reputation: currentReputation,
                stake: baseStake,
                reviewTime: avgReviewTime,
                holdings: filmHoldings,
                totalStake
            });

            for (let review = 0; review < reviewsPerCycle; review++) {
                let shareOfPool = yourWeight / totalSystemWeight;
                shareOfPool = Math.max(MIN_PROJECT_SHARE, shareOfPool);
                shareOfPool = Math.min(MAX_REVIEW_SHARE, shareOfPool);

                const reviewReward = projectPool * shareOfPool;

                if (reviewReward >= 0 && reviewReward <= projectPool) {
                    cycleReviewReward += reviewReward;
                } else {
                    console.warn('Invalid reward calculated:', {
                        cycle,
                        review,
                        shareOfPool,
                        reviewReward
                    });
                }
            }

            const reputationGrowth = 0.02 * reviewsPerCycle / Math.sqrt(cycle);
            const newReputation = currentReputation * (1 + reputationGrowth);
            currentReputation = Math.min(newReputation, MAX_REPUTATION);

            const stakeRequirement = baseStake * reviewsPerCycle;
            if (reviewBalance >= stakeRequirement) {
                reviewBalance -= stakeRequirement;
                reviewBalance += cycleReviewReward;
                reviewBalance += stakeRequirement;
            } else {
                console.warn('Insufficient balance for stakes:', {
                    cycle,
                    balance: reviewBalance,
                    required: stakeRequirement
                });
                break;
            }

            data.push({
                cycle,
                days: Math.round(cycle * 2.84),
                reviewBalance: Math.round(reviewBalance * 100000) / 100000,
                reputation: Math.round(currentReputation * 100) / 100,
                reviewReward: Math.round(cycleReviewReward * 100000) / 100000,
                reviewROI: ((reviewBalance - initialBalance) / initialBalance) * 100,
                shareOfPool: Math.round((yourWeight / totalSystemWeight) * 100),
                reputationGrowth: Math.round(reputationGrowth * 10000) / 10000
            });
        }
        return data;
    };

    const data = generateData();

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Review Strategy Analysis</h2>

            {/* Formula Documentation Section */}
            <div className="mb-8 p-4 border rounded-lg bg-blue-50">
                <div className="flex justify-between items-center">
                    <h3 className="text-xl mb-2">Smart Contract Formulas</h3>
                    <button
                        onClick={() => setShowFormulas(!showFormulas)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {showFormulas ? 'Hide' : 'Show'} Formulas
                    </button>
                </div>

                {showFormulas && (
                    <div className="mt-4 space-y-4">
                        <div>
                            <h4 className="font-bold">Weight Calculation</h4>
                            <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
                                {formulaDoc.weight}
                            </pre>
                        </div>
                        <div>
                            <h4 className="font-bold">Reward Calculation</h4>
                            <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
                                {formulaDoc.reward}
                            </pre>
                        </div>
                        <div>
                            <h4 className="font-bold">Reputation Growth</h4>
                            <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto">
                                {formulaDoc.reputation}
                            </pre>
                        </div>
                    </div>
                )}
            </div>

            {/* Weight System Selector */}
            <div className="mb-8 p-4 border rounded-lg bg-green-50">
                <h3 className="text-xl mb-4">Weight System</h3>
                <select
                    value={weightSystem}
                    onChange={(e) => setWeightSystem(e.target.value)}
                    className="w-full p-2 border rounded mb-4"
                >
                    {Object.entries(WEIGHT_SYSTEMS).map(([key, system]) => (
                        <option key={key} value={key}>{system.name}</option>
                    ))}
                </select>
                <div className="grid grid-cols-2 gap-4">
                    {Object.entries(WEIGHT_SYSTEMS[weightSystem].weights).map(([name, value]) => (
                        <div key={name} className="flex justify-between">
                            <span className="capitalize">{name}:</span>
                            <span>{value * 100}%</span>
                        </div>
                    ))}
                </div>
                <p className="mt-4 text-sm text-gray-600">
                    {WEIGHT_SYSTEMS[weightSystem].description}
                </p>
            </div>

            {/* Preset Scenarios */}
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

            {/* Review Parameters */}
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
                        <p className="text-sm text-gray-600 mt-1">
                            Number of reviewers competing for the project pool. Affects your stake weight.
                        </p>
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

            {/* Charts */}
            <div className="mb-8">
                <h3 className="text-xl mb-4">Review Balance Over Time</h3>
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
                    <Line type="monotone" dataKey="reviewBalance" stroke="#82ca9d" name="Review Balance" />
                </LineChart>
            </div>

            <div className="mb-8">
                <h3 className="text-xl mb-4">Review ROI</h3>
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
                    <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
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
                    <Line type="monotone" dataKey="reviewReward" stroke="#82ca9d" name="Review Reward" />
                </LineChart>
            </div>
        </div>
    );
};

export default RewardAnalysis;

