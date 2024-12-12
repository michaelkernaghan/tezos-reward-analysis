import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

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
            min: -0.589, // Current -58.9%
            max: 27.3053 // Historic +2,730.53%
        },
        actualROI: 2.3948 // 239.48%
    });

    // Review parameters
    const [baseStake, setBaseStake] = useState(100);
    const [projectPool, setProjectPool] = useState(1000);
    const [reviewsPerCycle, setReviewsPerCycle] = useState(8);
    const [totalReviewers, setTotalReviewers] = useState(5);
    const [filmHoldings, setFilmHoldings] = useState(1000);
    const [reputation, setReputation] = useState(1.0);
    const [avgReviewTime, setAvgReviewTime] = useState(12); // hours

    // Weight constants
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

        // Normalized scores (0-1)
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

    const generateData = () => {
        const data = [];
        let currentReputation = reputation;
        let bakingBalance = bakingStats.stakingBalance;
        let reviewBalance = bakingStats.stakingBalance;
        let totalStake = baseStake * totalReviewers;

        for (let cycle = 1; cycle <= 73; cycle++) {
            // Baking rewards
            const bakingReward = calculateBakingReward(bakingBalance);
            bakingBalance += bakingReward;

            // Review rewards
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

            // Update balances and reputation
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
                }) * 100)
            });
        }
        return data;
    };

    const data = generateData();

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Review vs Baking Returns (With Real Baking Data)</h2>

            {/* Baking Stats Display */}
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

            {/* Parameters Section */}
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
                    </div>
                    <div>
                        <label className="block mb-2">Reviews per Cycle</label>
                        <input
                            type="number"
                            value={reviewsPerCycle}
                            onChange={(e) => setReviewsPerCycle(Number(e.target.value))}
                            className="w-full p-2 border rounded"
                            min="0"
                        />
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
                    </div>
                    <div>
                        <label className="block mb-2">Average Review Time (hours)</label>
                        <input
                            type="number"
                            value={avgReviewTime}
                            onChange={(e) => setAvgReviewTime(Number(e.target.value))}
                            className="w-full p-2 border rounded"
                            min="0"
                            max="24"
                        />
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
                    </div>
                </div>
            </div>

            {/* Charts */}
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