import React from 'react';

const ReputationExplainer = () => {
    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Understanding the Reputation System</h1>

            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h2 className="text-lg font-semibold mb-3">The Big Picture</h2>
                    <p className="mb-4">
                        Think of the reputation system as a teacher evaluating students. Instead of just grading final answers,
                        the teacher considers students' confidence in their answers, when they submit their work, and how their
                        performance compares to their classmates. Similarly, when participants review project proposals, the
                        system evaluates not only their assessment of the project but also their level of certainty, their
                        timing (whether they contributed early enough to influence others or waited to follow the crowd), and
                        how their judgment compares to the consensus of other reviewers.
                    </p>
                    <div className="mt-4">
                        <p className="font-medium mb-2">To optimize reputation growth, reviewers should:</p>
                        <ol className="list-decimal list-inside space-y-1 text-gray-600">
                            <li>Maintain a balanced confidence level around 50% in their assessments (avoiding both overconfidence and underconfidence)</li>
                            <li>Make accurate assessments that align with the median vote (the accuracy component)</li>
                            <li>Submit reviews early in the cycle (as shown in the rewards code's timing weight)</li>
                            <li>Maintain consistent activity (as seen in the reviewsPerCycle parameter)</li>
                            <li>Balance their stake and holdings (as indicated by the stake ratio weight)</li>
                        </ol>
                    </div>
                </div>

                {/* <div>
                    <h3 className="font-medium mb-2">2. Confidence and Certainty</h3>
                    <p className="text-gray-600 mb-3">
                        The system uses a mathematical bell curve to evaluate confidence. Think of it like a seasoned expert
                        versus an overconfident novice. The expert knows enough to recognize the complexities and might say
                        "I'm about 50% confident in my assessment because there are several factors to consider." The novice
                        might claim "I'm 100% certain!" without recognizing the nuances.
                    </p>
                    <div className="bg-gray-50 p-4 rounded">
                        <h4 className="font-medium mb-2">How Confidence Is Calculated:</h4>
                        <ul className="list-disc list-inside space-y-2">
                            <li>The ideal confidence level is around 50%</li>
                            <li>The score drops as confidence approaches either 0% or 100%</li>
                            <li>This creates a bell-shaped curve where:
                                <ul className="list-disc list-inside ml-6 mt-1">
                                    <li>Very low confidence (0-20%) suggests insufficient knowledge</li>
                                    <li>Very high confidence (80-100%) suggests potential overconfidence</li>
                                    <li>Moderate confidence (40-60%) receives the highest scores</li>
                                </ul>
                            </li>
                            <li>The calculation uses the formula: C(x) = Camp × e^(-Cgain × (ψ(x) - Ccenter)²)
                                <ul className="list-disc list-inside ml-6 mt-1">
                                    <li>Camp (1.0) sets the maximum possible score</li>
                                    <li>Cgain (0.02) controls how quickly scores drop off from the center</li>
                                    <li>Ccenter (50) sets the peak of the curve at 50% confidence</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <p className="mt-3 text-gray-600">
                        In project proposal reviews, this means a reviewer who acknowledges uncertainty while providing
                        thoughtful analysis is often more valuable than one who claims absolute certainty. For example,
                        a reviewer might say "I'm moderately confident (50%) this is a good project because while the
                        technical approach is solid, market conditions add some uncertainty." This balanced assessment
                        would score better than "I'm 100% certain this will succeed" or "I'm only 10% confident in my
                        review."
                    </p>
                </div> */}

                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h2 className="text-lg font-semibold mb-3">Core Components</h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium mb-2">1. Base Reputation</h3>
                            <p className="text-gray-600">
                                Like academic credits you've already earned, this is your starting point based on past performance. It's
                                what you bring to the table before any new evaluation.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-medium mb-2">2. Confidence Score</h3>
                            <p className="text-gray-600">
                                Imagine a weather forecaster. The best ones aren't those who always predict extreme weather, but those who
                                accurately gauge their certainty. The system rewards realistic self-assessment, with the sweet spot being
                                around 50% confidence. Too much or too little confidence can hurt your score.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-medium mb-2">3. Accuracy Score</h3>
                            <p className="text-gray-600">
                                Like "The Price is Right" game show, this measures how close your answer is to the collective wisdom
                                (median vote). The closer you are to what most people think is right, the better your score.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-medium mb-2">4. Timing of Reputation</h3>
                            <p className="text-gray-600">
                                Think of this like participating in a class discussion. While you want to be thoughtful, waiting until
                                everyone else has spoken (and copying their insights) isn't as valuable as being an early contributor
                                to the conversation.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-medium mb-2">5. Relative Reputation</h3>
                            <p className="text-gray-600">
                                Like grading on a curve, this compares your performance to the community average. It helps maintain
                                balance in the system by considering your standing relative to others.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h2 className="text-lg font-semibold mb-3">How They Work Together</h2>
                    <p className="mb-4">
                        These components combine to create a balanced evaluation system that:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Rewards accurate assessments</li>
                        <li>Encourages honest self-evaluation</li>
                        <li>Promotes timely participation</li>
                        <li>Maintains system fairness through relative scoring</li>
                    </ul>
                </div>

                <div className="bg-blue-50 rounded-lg shadow-sm border p-4">
                    <h2 className="text-lg font-semibold mb-3">Why This Matters</h2>
                    <p>
                        The goal is to create a trustworthy community evaluation system. Just like how we trust restaurant reviews
                        more when they come from experienced reviewers who have proven to be fair and accurate, this system helps
                        identify and reward reliable evaluators. It encourages thoughtful, honest participation while discouraging
                        rushed judgments or overconfident assessments.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ReputationExplainer;