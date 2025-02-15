import React from 'react';
import BearCallSpreadVisualizer from './BearCallSpread/BearCallSpreadVisualizer';
import ShortPutVisualizer from './ShortPut/ShortPutVisualizer';
import BullPutSpreadVisualizer from './BullPutSpread/BullPutSpreadVisualizer';
import LongPutVisualizer from './LongPut/LongPutVisualizer';
import BearPutSpreadVisualizer from './BearPutSpread/BearPutSpreadVisualizer';
import ShortCallVisualizer from './ShortCall/ShortCallVisualizer';
import LongCallVisualizer from './LongCall/LongCallVisualizer'; 
import BullCallSpreadVisualizer from './BullCallSpread/BullCallSpreadVisualizer';
import LongStraddleVisualizer from './LongStraddle/LongStraddleVisualizer'; 
import ShortStraddleVisualizer from './ShortStraddle/ShortStraddleVisualizer';
import LongStrangleVisualizer from './LongStrangle/LongStrangleVisualizer';
import ShortStrangleVisualizer from './ShortStrangle/ShortStrangleVisualizer';
import BlackScholesCode from './BlackScholes/BlackScholesCode';

function App() {
  return (
    <div className="App" style={{ padding: '1rem' }}>
      <h1>Option Strategies</h1>
      
      <h2>Bear Call Spread</h2>
      <BearCallSpreadVisualizer />

      <h2>Short Put</h2>
      <ShortPutVisualizer />

      <h2>Bull Put Spread</h2>
      <BullPutSpreadVisualizer />

      <h2>Long Put</h2>
      <LongPutVisualizer />

      <h2>Bear Put Spread</h2>
      <BearPutSpreadVisualizer />

      <h2>Short Call</h2>
      <ShortCallVisualizer />

      <h2>Long Call</h2>
      <LongCallVisualizer /> 

      <h2>Bull Call Spread</h2>
      <BullCallSpreadVisualizer />

      <h2>Long Straddle</h2>
      <LongStraddleVisualizer />

      <h2>Short Straddle</h2>
      <ShortStraddleVisualizer />

      <h2>Long Strangle</h2>
      <LongStrangleVisualizer />

      <h2>Short Strangle</h2>
      <ShortStrangleVisualizer /> 

      <h2>Black Scholes</h2>
      <BlackScholesCode />
    </div>
  );
}

export default App;