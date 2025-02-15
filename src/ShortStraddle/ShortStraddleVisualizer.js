import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { Input } from "../components/ui/input"

const ShortStraddleVisualizer = () => {
  const [strikePrice, setStrikePrice] = useState(100);
  const [callPremium, setCallPremium] = useState(5);
  const [putPremium, setPutPremium] = useState(5);
  const [currentPrice, setCurrentPrice] = useState(100);

  // Generate payoff data points
  const generatePayoffData = () => {
    const data = [];
    for (let price = 0; price <= 200; price += 1) {
      // Short call payoff
      const callPayoff = Math.min(callPremium, callPremium - (price - strikePrice));
      // Short put payoff
      const putPayoff = Math.min(putPremium, putPremium - (strikePrice - price));
      // Combined payoff
      const totalPayoff = callPayoff + putPayoff;
      
      data.push({
        price,
        payoff: totalPayoff,
        callPayoff,
        putPayoff
      });
    }
    return data;
  };

  const data = generatePayoffData();
  const totalPremium = callPremium + putPremium;
  const upperBreakeven = strikePrice + totalPremium;
  const lowerBreakeven = strikePrice - totalPremium;

  // Calculate current position value
  const getCurrentValue = () => {
    const callValue = Math.min(callPremium, callPremium - (currentPrice - strikePrice));
    const putValue = Math.min(putPremium, putPremium - (strikePrice - currentPrice));
    return (callValue + putValue).toFixed(2);
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4">Short Straddle Strategy Payoff</h2>
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
                  name="Total Payoff"
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="linear" 
                  dataKey="callPayoff" 
                  stroke="#dc2626" 
                  name="Short Call"
                  strokeWidth={1}
                  dot={false}
                  strokeDasharray="5 5"
                />
                <Line 
                  type="linear" 
                  dataKey="putPayoff" 
                  stroke="#16a34a" 
                  name="Short Put"
                  strokeWidth={1}
                  dot={false}
                  strokeDasharray="5 5"
                />
                <ReferenceLine 
                  x={upperBreakeven} 
                  stroke="#dc2626" 
                  strokeDasharray="5 5" 
                  label={{ value: 'Upper Break-even', position: 'top' }}
                />
                <ReferenceLine 
                  x={lowerBreakeven} 
                  stroke="#dc2626" 
                  strokeDasharray="5 5" 
                  label={{ value: 'Lower Break-even', position: 'top' }}
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
                  Call Premium: ${callPremium.toFixed(2)}
                </label>
                <Slider
                  value={[callPremium]}
                  onValueChange={(value) => setCallPremium(value[0])}
                  min={0}
                  max={20}
                  step={0.01}
                  className="mb-6"
                />
              </div>
              <Input
                type="number"
                value={callPremium}
                onChange={(e) => setCallPremium(Number(e.target.value))}
                className="w-24"
                step={0.01}
                min={0}
                max={20}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-2">
                  Put Premium: ${putPremium.toFixed(2)}
                </label>
                <Slider
                  value={[putPremium]}
                  onValueChange={(value) => setPutPremium(value[0])}
                  min={0}
                  max={20}
                  step={0.01}
                  className="mb-6"
                />
              </div>
              <Input
                type="number"
                value={putPremium}
                onChange={(e) => setPutPremium(Number(e.target.value))}
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
                <li>Total Premium Received: ${totalPremium.toFixed(2)}</li>
                <li>Upper Break-even: ${upperBreakeven.toFixed(2)}</li>
                <li>Lower Break-even: ${lowerBreakeven.toFixed(2)}</li>
                <li>Current Product Price: ${currentPrice}</li>
                <li>Current Position Value: ${getCurrentValue()}</li>
                <li>Maximum Profit: ${totalPremium.toFixed(2)} (total premium received)</li>
                <li>Maximum Loss: Unlimited (increases as price moves away from strike)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">How This Strategy Works</h3>
          <ul className="space-y-2 list-disc pl-4">
            <li>Sell both a call and a put option at the same strike price</li>
            <li>Receive premium upfront for both options</li>
            <li>Maximum profit achieved when price equals strike at expiration</li>
            <li>Two break-even points: strike ± total premium received</li>
            <li>Losses increase as price moves significantly in either direction</li>
            <li>This is a non-directional strategy - you profit when price remains near the strike price</li>
            <li>High risk strategy due to unlimited potential losses</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShortStraddleVisualizer;