import React from 'react';
import ReputationCalculator from './components/ReputationCalculator';
import EnhancedMathExplanations from './components/EnhancedMathExplanations';
import ReputationExplainer from './components/ReputationExplainer';

function App() {
  return (
    <div className="App">
      <ReputationExplainer />
      <ReputationCalculator />
      <EnhancedMathExplanations />

    </div>
  );
}

export default App;