import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { Input } from "../components/ui/input"

const LongCallVisualizer = () => {
  const [strikePrice, setStrikePrice] = useState(100);
  const [premium, setPremium] = useState(5);
  const [currentPrice, setCurrentPrice] = useState(100);

  // Generate payoff data points
  const generatePayoffData = () => {
    const data = [];
    for (let price = 0; price <= 200; price += 1) {
      // Long call payoff = max(-premium, price - strike - premium)
      const payoff = Math.max(-premium, price - strikePrice - premium);
      
      data.push({
        price,
        payoff
      });
    }
    return data;
  };

  const data = generatePayoffData();
  const breakEvenPrice = strikePrice + premium;

  // Calculate current position value
  const getCurrentValue = () => {
    return Math.max(-premium, currentPrice - strikePrice - premium).toFixed(2);
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4">Long Call Strategy Payoff</h2>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="price" 
                  label={{ value: 'Product Price ($)', position: 'bottom' }}
                  domain={[0, 200]}
                  ticks={[0, 25, 50, 75, 100, 125, 150, 175, 200]}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  label={{ value: 'Profit/Loss ($)', angle: -90, position: 'left' }}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  formatter={(value) => `$${value.toFixed(2)}`}
                  labelFormatter={(value) => `Product Price: $${value}`}
                  wrapperStyle={{ zIndex: 100 }}
                  position={{ y: 50 }}
                />
                <Legend />
                <Line 
                  type="linear" 
                  dataKey="payoff" 
                  stroke="#2563eb" 
                  name="Long Call Payoff"
                  strokeWidth={2}
                  dot={false}
                />
                <ReferenceLine 
                  x={breakEvenPrice} 
                  stroke="#dc2626" 
                  strokeDasharray="5 5" 
                  label={{ value: 'Break-even', position: 'top' }}
                />
                <ReferenceLine 
                  y={0} 
                  stroke="#dc2626" 
                  strokeDasharray="5 5"
                  label={{ value: 'Break-even', position: 'right' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Strategy Controls</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-2">
                  Strike Price: ${strikePrice}
                </label>
                <Slider
                  value={[strikePrice]}
                  onValueChange={(value) => setStrikePrice(value[0])}
                  min={0}
                  max={200}
                  step={1}
                  className="mb-6"
                />
              </div>
              <Input
                type="number"
                value={strikePrice}
                onChange={(e) => setStrikePrice(Number(e.target.value))}
                className="w-24"
                min={0}
                max={200}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-2">
                  Option Premium: ${premium.toFixed(2)}
                </label>
                <Slider
                  value={[premium]}
                  onValueChange={(value) => setPremium(value[0])}
                  min={0}
                  max={20}
                  step={0.01}
                  className="mb-6"
                />
              </div>
              <Input
                type="number"
                value={premium}
                onChange={(e) => setPremium(Number(e.target.value))}
                className="w-24"
                step={0.01}
                min={0}
                max={20}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-2">
                  Current Product Price: ${currentPrice}
                </label>
                <Slider
                  value={[currentPrice]}
                  onValueChange={(value) => setCurrentPrice(value[0])}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>
              <Input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(Number(e.target.value))}
                className="w-24"
                min={0}
                max={200}
              />
            </div>
            
            <div className="p-4 bg-gray-100 rounded-lg">
              <h4 className="font-medium mb-2">Position Summary:</h4>
              <ul className="space-y-2">
                <li>Strike Price: ${strikePrice}</li>
                <li>Premium Paid: ${premium.toFixed(2)}</li>
                <li>Break-even Price: ${breakEvenPrice.toFixed(2)}</li>
                <li>Current Product Price: ${currentPrice}</li>
                <li>Current Position Value: ${getCurrentValue()}</li>
                <li>Maximum Profit: Unlimited (increases as price rises)</li>
                <li>Maximum Loss: ${premium.toFixed(2)} (premium paid)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">How This Strategy Works</h3>
          <ul className="space-y-2 list-disc pl-4">
            <li>You buy a call option and pay a premium upfront</li>
            <li>You have the right (but not obligation) to buy at the strike price</li>
            <li>If price rises above strike plus premium, you profit</li>
            <li>Break-even point is strike price plus premium paid</li>
            <li>Maximum loss is limited to the premium paid</li>
            <li>Maximum profit is theoretically unlimited</li>
            <li>This strategy is bullish - you profit when the price rises above strike</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LongCallVisualizer;