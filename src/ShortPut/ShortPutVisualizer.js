import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { Input } from "../components/ui/input";

const ShortPutVisualizer = () => {
  const [strikePrice, setStrikePrice] = useState(100);
  const [premium, setPremium] = useState(5);
  const [currentPrice, setCurrentPrice] = useState(100);

  // Generate payoff data points
  const generatePayoffData = () => {
    const data = [];
    for (let price = 0; price <= 200; price += 1) {  // Changed increment to 1 for smoother line
      const payoff = Math.min(premium, premium - (strikePrice - price));
      
      data.push({
        price,
        payoff
      });
    }
    return data;
  };

  const data = generatePayoffData();
  const breakEvenPrice = strikePrice - premium;

  // Calculate current position value
  const getCurrentValue = () => {
    return Math.min(premium, premium - (strikePrice - currentPrice)).toFixed(2);
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4">Short Put Strategy Payoff</h2>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="price" 
                  label={{ value: 'Product Price ($)', position: 'bottom' }}
                  domain={[0, 200]}
                />
                <YAxis 
                  label={{ value: 'Profit/Loss ($)', angle: -90, position: 'left' }}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  formatter={(value) => `$${value.toFixed(2)}`}
                  labelFormatter={(value) => `Product Price: ${value}`}
                  wrapperStyle={{ zIndex: 100 }}
                  position={{ y: 50 }}
                />
                <Legend />
                <Line 
                  type="linear" 
                  dataKey="payoff" 
                  stroke="#2563eb" 
                  name="Short Put Payoff"
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
                  stroke="#666" 
                  strokeDasharray="3 3"
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
                  step={0.01}  // Changed to 0.01 for cent increments
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
                <li>Premium Received: ${premium.toFixed(2)}</li>
                <li>Break-even Price: ${breakEvenPrice.toFixed(2)}</li>
                <li>Current Product Price: ${currentPrice}</li>
                <li>Current Position Value: ${getCurrentValue()}</li>
                <li>Maximum Profit: ${premium.toFixed(2)}</li>
                <li>Maximum Loss: ${(strikePrice - premium).toFixed(2)}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">How This Strategy Works</h3>
          <ul className="space-y-2 list-disc pl-4">
            <li>You sell a put option and receive a premium upfront</li>
            <li>If the product price stays above the strike price, you keep the full premium</li>
            <li>Below the strike price, you start losing money (but offset by premium)</li>
            <li>Break-even point is strike price minus premium received</li>
            <li>Maximum loss occurs if the stock price goes to zero</li>
            <li>This strategy is bullish - you profit when the stock stays above strike</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShortPutVisualizer;