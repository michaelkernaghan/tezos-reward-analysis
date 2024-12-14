import React, { useState, useCallback, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// BigNumber wrapper for calculations
const createBigNumber = (value) => {
    return {
        plus: (v) => createBigNumber(Number(value) + Number(v)),
        minus: (v) => createBigNumber(Number(value) - Number(v)),
        multipliedBy: (v) => createBigNumber(Number(value) * Number(v)),
        dividedBy: (v) => createBigNumber(Number(value) / Number(v)),
        toFixed: (decimals) => Number(value).toFixed(decimals),
        gte: (v) => Number(value) >= Number(v),
        toNumber: () => Number(value)
    };
};

// Constants from the API
const MAX_REPUTATION = 5.0;
const REPUTATION_GROWTH_RATE = 0.02;

const createTimeScale = (start, end) => {
    const range = end - start;
    return (value) => {
        if (range === 0) return 1;
        const scaled = 1 - ((value - start) / range);
        return Math.max(0.001, Math.min(1, scaled));
    };
};

const WeightSystem = {
    STAKE: 0.40,      // 40% stake weight
    REPUTATION: 0.40, // 40% reputation weight
    TIMING: 0.10,     // 10% timing weight
    HOLDINGS: 0.05,   // 5% holdings weight
    STAKE_RATIO: 0.05 // 5% stake/holdings ratio weight
};

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
    const [baseStake, setBaseStake] = useState(PRESET_SCENARIOS.casual.baseStake);
    const [projectPool, setProjectPool] = useState(PRESET_SCENARIOS.casual.projectPool);
    const [reviewsPerCycle, setReviewsPerCycle] = useState(PRESET_SCENARIOS.casual.reviewsPerCycle);
    const [totalReviewers, setTotalReviewers] = useState(PRESET_SCENARIOS.casual.totalReviewers);
    const [filmHoldings, setFilmHoldings] = useState(PRESET_SCENARIOS.casual.filmHoldings);
    const [reputation, setReputation] = useState(PRESET_SCENARIOS.casual.reputation);
    const [avgReviewTime, setAvgReviewTime] = useState(PRESET_SCENARIOS.casual.avgReviewTime);
    const [projectionData, setProjectionData] = useState([]);

    const calculateNormalWeight = useCallback((review) => {
        const {
            stake,
            maxStake,
            reputation,
            time,
            holdings,
            totalHoldings,
            avgStakeRatio
        } = review;

        const stakeScore = maxStake > 0 ? createBigNumber(stake).dividedBy(maxStake) : createBigNumber(0);
        const reputationScore = createBigNumber(Math.min(reputation / 2.0, 1));
        const holdingsScore = createBigNumber(Math.min(holdings / totalHoldings, 1));
        const timeScore = createBigNumber(time);
        const stakeRatio = createBigNumber(avgStakeRatio);

        return stakeScore.multipliedBy(WeightSystem.STAKE)
            .plus(reputationScore.multipliedBy(WeightSystem.REPUTATION))
            .plus(holdingsScore.multipliedBy(WeightSystem.HOLDINGS))
            .plus(timeScore.multipliedBy(WeightSystem.TIMING))
            .plus(stakeRatio.multipliedBy(WeightSystem.STAKE_RATIO));
    }, []);

    const calculateRewardForCycle = useCallback((cycle, currentReputation, reviewBalance) => {
        const maxStake = baseStake * totalReviewers;
        const totalHoldings = filmHoldings * totalReviewers;

        const timeScale = createTimeScale(0, 24);
        const timeScore = timeScale(avgReviewTime);

        const stakeRatio = filmHoldings > 0 ? baseStake / filmHoldings : baseStake > 0 ? 1 : 0;

        const normalWeight = calculateNormalWeight({
            stake: baseStake,
            maxStake,
            reputation: currentReputation,
            time: timeScore,
            holdings: filmHoldings,
            totalHoldings,
            avgStakeRatio: stakeRatio
        });

        const cycleReward = createBigNumber(projectPool)
            .multipliedBy(normalWeight.toNumber())
            .dividedBy(totalReviewers)
            .multipliedBy(reviewsPerCycle);

        const reputationGrowth = REPUTATION_GROWTH_RATE * reviewsPerCycle / Math.sqrt(cycle);
        const newReputation = Math.min(currentReputation * (1 + reputationGrowth), MAX_REPUTATION);

        const stakeRequirement = createBigNumber(baseStake).multipliedBy(reviewsPerCycle);
        let newBalance = createBigNumber(reviewBalance);
        
        if (newBalance.gte(stakeRequirement.toNumber())) {
            newBalance = newBalance
                .minus(stakeRequirement.toNumber())
                .plus(cycleReward.toNumber())
                .plus(stakeRequirement.toNumber());
        }

        return {
            newReputation,
            newBalance: newBalance.toNumber(),
            cycleReward: cycleReward.toNumber(),
            reputationGrowth
        };
    }, [baseStake, projectPool, reviewsPerCycle, totalReviewers, filmHoldings, avgReviewTime, calculateNormalWeight]);

    useEffect(() => {
        const data = [];
        let currentReputation = reputation;
        let reviewBalance = filmHoldings;
        const initialBalance = filmHoldings;

        for (let cycle = 1; cycle <= 73; cycle++) {
            const {
                newReputation,
                newBalance,
                cycleReward,
                reputationGrowth
            } = calculateRewardForCycle(cycle, currentReputation, reviewBalance);

            currentReputation = newReputation;
            reviewBalance = newBalance;

            data.push({
                cycle,
                days: Math.round(cycle * 2.84),
                reviewBalance: parseFloat(newBalance.toFixed(6)),
                reputation: Math.round(currentReputation * 100) / 100,
                reviewReward: parseFloat(cycleReward.toFixed(6)),
                reviewROI: parseFloat(((newBalance - initialBalance) / initialBalance * 100).toFixed(2)),
                reputationGrowth: Math.round(reputationGrowth * 10000) / 10000
            });
        }

        console.log("Projection data updated:", data.length, "entries");
        setProjectionData(data);
    }, [baseStake, projectPool, reviewsPerCycle, totalReviewers, filmHoldings, reputation, avgReviewTime, calculateRewardForCycle]);

    const loadPreset = useCallback((scenario) => {
        setBaseStake(scenario.baseStake);
        setProjectPool(scenario.projectPool);
        setReviewsPerCycle(scenario.reviewsPerCycle);
        setTotalReviewers(scenario.totalReviewers);
        setFilmHoldings(scenario.filmHoldings);
        setReputation(scenario.reputation);
        setAvgReviewTime(scenario.avgReviewTime);
    }, []);


    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Review Strategy Analysis</h2>

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

            {/* Parameters */}
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
                            Affects rewards ({WeightSystem.STAKE * 100}% weight)
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
                    </div>
                    <div>
                        <label className="block mb-2">Reviews per Cycle</label>
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
                            Affects rewards ({WeightSystem.HOLDINGS * 100}% weight)
                        </p>
                    </div>
                    <div>
                        <label className="block mb-2">Review Response Time</label>
                        <select
                            value={avgReviewTime}
                            onChange={(e) => setAvgReviewTime(Number(e.target.value))}
                            className="w-full p-2 border rounded"
                        >
                            <option value="1">Very Fast (1 hour)</option>
                            <option value="6">Fast (6 hours)</option>
                            <option value="12">Medium (12 hours)</option>
                            <option value="18">Slow (18 hours)</option>
                            <option value="23">Very Slow (23 hours)</option>
                        </select>
                        <p className="text-sm text-gray-600 mt-1">
                            Earlier reviews receive higher rewards ({WeightSystem.TIMING * 100}% weight)
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
                            max={MAX_REPUTATION}
                        />
                        <p className="text-sm text-gray-600 mt-1">
                            Affects rewards ({WeightSystem.REPUTATION * 100}% weight). Max: {MAX_REPUTATION}
                        </p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="space-y-8">
                <div className="p-4 border rounded-lg">
                    <h3 className="text-xl mb-4">Balance Projection</h3>
                    <LineChart
                        width={800}
                        height={400}
                        data={projectionData}
                        margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="cycle"
                            label={{ value: 'Review Cycle', position: 'insideBottom', offset: -10 }}
                        />
                        <YAxis 
                            label={{ value: 'Balance (φ)', angle: -90, position: 'insideLeft', offset: -50 }}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip formatter={(value) => Number(value).toFixed(2)} />
                        <Line 
                            type="monotone" 
                            dataKey="reviewBalance" 
                            stroke="#2563eb" 
                            name="Balance"
                            dot={false}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </div>

                <div className="p-4 border rounded-lg">
                    <h3 className="text-xl mb-4">Return on Investment</h3>
                    <LineChart
                        width={800}
                        height={300}
                        data={projectionData}
                        margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="cycle" />
                        <YAxis 
                            label={{ value: 'ROI %', angle: -90, position: 'insideLeft', offset: -50 }}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
                        <Line 
                            type="monotone" 
                            dataKey="reviewROI" 
                            stroke="#16a34a" 
                            name="ROI"
                            dot={false}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </div>

                <div className="p-4 border rounded-lg">
                    <h3 className="text-xl mb-4">Rewards per Cycle</h3>
                    <LineChart
                        width={800}
                        height={300}
                        data={projectionData}
                        margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="cycle" />
                        <YAxis 
                            label={{ value: 'Rewards (φ)', angle: -90, position: 'insideLeft', offset: -50 }}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip formatter={(value) => Number(value).toFixed(2)} />
                        <Line 
                            type="monotone" 
                            dataKey="reviewReward" 
                            stroke="#82ca9d" 
                            name="Cycle Reward"
                            dot={false}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </div>

                <div className="p-4 border rounded-lg">
                    <h3 className="text-xl mb-4">Reputation Growth</h3>
                    <LineChart
                        width={800}
                        height={300}
                        data={projectionData}
                        margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="cycle" />
                        <YAxis 
                            label={{ value: 'Reputation', angle: -90, position: 'insideLeft', offset: -50 }}
                            domain={[0, MAX_REPUTATION]}
                        />
                        <Tooltip formatter={(value) => Number(value).toFixed(2)} />
                        <Line 
                            type="monotone" 
                            dataKey="reputation" 
                            stroke="#8b5cf6" 
                            name="Reputation"
                            dot={false}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </div>
            </div>
        </div>
    );
};

export default RewardAnalysis;
