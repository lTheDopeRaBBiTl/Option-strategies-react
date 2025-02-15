import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { Input } from "../components/ui/input"

const LongStrangleVisualizer = () => {
  const [callStrike, setCallStrike] = useState(110);
  const [putStrike, setPutStrike] = useState(90);
  const [callPremium, setCallPremium] = useState(4);
  const [putPremium, setPutPremium] = useState(4);
  const [currentPrice, setCurrentPrice] = useState(100);

  // Generate payoff data points
  const generatePayoffData = () => {
    const data = [];
    for (let price = 0; price <= 200; price += 1) {
      // Long call payoff (higher strike)
      const callPayoff = Math.max(-callPremium, price - callStrike - callPremium);
      // Long put payoff (lower strike)
      const putPayoff = Math.max(-putPremium, putStrike - price - putPremium);
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
  const upperBreakeven = callStrike + totalPremium;
  const lowerBreakeven = putStrike - totalPremium;

  // Calculate current position value
  const getCurrentValue = () => {
    const callValue = Math.max(-callPremium, currentPrice - callStrike - callPremium);
    const putValue = Math.max(-putPremium, putStrike - currentPrice - putPremium);
    return (callValue + putValue).toFixed(2);
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4">Long Strangle Strategy Payoff</h2>
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
                  stroke="#16a34a" 
                  name="Long Call"
                  strokeWidth={1}
                  dot={false}
                  strokeDasharray="5 5"
                />
                <Line 
                  type="linear" 
                  dataKey="putPayoff" 
                  stroke="#dc2626" 
                  name="Long Put"
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
            {/* Call Controls */}
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-2">
                  Call Strike (Higher): ${callStrike}
                </label>
                <Slider
                  value={[callStrike]}
                  onValueChange={(value) => setCallStrike(value[0])}
                  min={0}
                  max={200}
                  step={1}
                  className="mb-6"
                />
              </div>
              <Input
                type="number"
                value={callStrike}
                onChange={(e) => setCallStrike(Number(e.target.value))}
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

            {/* Put Controls */}
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-2">
                  Put Strike (Lower): ${putStrike}
                </label>
                <Slider
                  value={[putStrike]}
                  onValueChange={(value) => setPutStrike(value[0])}
                  min={0}
                  max={200}
                  step={1}
                  className="mb-6"
                />
              </div>
              <Input
                type="number"
                value={putStrike}
                onChange={(e) => setPutStrike(Number(e.target.value))}
                className="w-24"
                min={0}
                max={200}
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
                <li>Call Strike (Higher): ${callStrike}</li>
                <li>Put Strike (Lower): ${putStrike}</li>
                <li>Total Premium Paid: ${totalPremium.toFixed(2)}</li>
                <li>Upper Break-even: ${upperBreakeven.toFixed(2)}</li>
                <li>Lower Break-even: ${lowerBreakeven.toFixed(2)}</li>
                <li>Current Product Price: ${currentPrice}</li>
                <li>Current Position Value: ${getCurrentValue()}</li>
                <li>Maximum Loss: ${totalPremium.toFixed(2)} (total premium paid)</li>
                <li>Maximum Profit: Unlimited (increases as price moves beyond break-evens)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">How This Strategy Works</h3>
          <ul className="space-y-2 list-disc pl-4">
            <li>Buy a call option at a higher strike price and a put option at a lower strike price</li>
            <li>Total cost is the sum of both option premiums</li>
            <li>Profit increases as price moves significantly beyond either strike price</li>
            <li>Maximum loss occurs when price stays between the strike prices</li>
            <li>Less expensive than a straddle but requires larger price movement for profit</li>
            <li>Two break-even points: higher strike + total premium and lower strike - total premium</li>
            <li>This is a volatility strategy - you profit from large price movements in either direction</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default LongStrangleVisualizer;