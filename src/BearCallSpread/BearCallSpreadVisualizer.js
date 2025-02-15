import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { Input } from "../components/ui/input";

const BearCallSpreadVisualizer = () => {
  const [shortStrike, setShortStrike] = useState(100); // Lower strike - we sell this call
  const [longStrike, setLongStrike] = useState(110); // Higher strike - we buy this call
  const [shortPremium, setShortPremium] = useState(7); // Premium we receive
  const [longPremium, setLongPremium] = useState(4); // Premium we pay
  const [currentPrice, setCurrentPrice] = useState(105);

  // Generate payoff data points
  const generatePayoffData = () => {
    const data = [];
    for (let price = 0; price <= 200; price += 1) {
      // Short call payoff (lower strike)
      const shortCallPayoff = Math.min(shortPremium, shortPremium - (price - shortStrike));
      // Long call payoff (higher strike)
      const longCallPayoff = Math.max(-longPremium, price - longStrike - longPremium);
      // Combined payoff
      const totalPayoff = shortCallPayoff + longCallPayoff;
      
      data.push({
        price,
        payoff: totalPayoff,
        shortCallPayoff,
        longCallPayoff
      });
    }
    return data;
  };

  const data = generatePayoffData();
  const netCredit = shortPremium - longPremium;
  const maxProfit = netCredit;
  const maxLoss = (longStrike - shortStrike) - netCredit;
  const breakEvenPrice = shortStrike + netCredit;

  // Calculate current position value
  const getCurrentValue = () => {
    const shortValue = Math.min(shortPremium, shortPremium - (currentPrice - shortStrike));
    const longValue = Math.max(-longPremium, currentPrice - longStrike - longPremium);
    return (shortValue + longValue).toFixed(2);
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4">Bear Call Spread Strategy Payoff</h2>
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
                  dataKey="shortCallPayoff" 
                  stroke="#dc2626" 
                  name="Short Call (Lower Strike)"
                  strokeWidth={1}
                  dot={false}
                  strokeDasharray="5 5"
                />
                <Line 
                  type="linear" 
                  dataKey="longCallPayoff" 
                  stroke="#16a34a" 
                  name="Long Call (Higher Strike)"
                  strokeWidth={1}
                  dot={false}
                  strokeDasharray="5 5"
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
            {/* Short Call Controls (Lower Strike) */}
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-2">
                  Short Call Strike (Lower): ${shortStrike}
                </label>
                <Slider
                  value={[shortStrike]}
                  onValueChange={(value) => setShortStrike(value[0])}
                  min={0}
                  max={200}
                  step={1}
                  className="mb-6"
                />
              </div>
              <Input
                type="number"
                value={shortStrike}
                onChange={(e) => setShortStrike(Number(e.target.value))}
                className="w-24"
                min={0}
                max={200}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-2">
                  Short Call Premium: ${shortPremium.toFixed(2)}
                </label>
                <Slider
                  value={[shortPremium]}
                  onValueChange={(value) => setShortPremium(value[0])}
                  min={0}
                  max={20}
                  step={0.01}
                  className="mb-6"
                />
              </div>
              <Input
                type="number"
                value={shortPremium}
                onChange={(e) => setShortPremium(Number(e.target.value))}
                className="w-24"
                step={0.01}
                min={0}
                max={20}
              />
            </div>

            {/* Long Call Controls (Higher Strike) */}
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-2">
                  Long Call Strike (Higher): ${longStrike}
                </label>
                <Slider
                  value={[longStrike]}
                  onValueChange={(value) => setLongStrike(value[0])}
                  min={0}
                  max={200}
                  step={1}
                  className="mb-6"
                />
              </div>
              <Input
                type="number"
                value={longStrike}
                onChange={(e) => setLongStrike(Number(e.target.value))}
                className="w-24"
                min={0}
                max={200}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-2">
                  Long Call Premium: ${longPremium.toFixed(2)}
                </label>
                <Slider
                  value={[longPremium]}
                  onValueChange={(value) => setLongPremium(value[0])}
                  min={0}
                  max={20}
                  step={0.01}
                  className="mb-6"
                />
              </div>
              <Input
                type="number"
                value={longPremium}
                onChange={(e) => setLongPremium(Number(e.target.value))}
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
                <li>Short Call Strike (Lower): ${shortStrike}</li>
                <li>Long Call Strike (Higher): ${longStrike}</li>
                <li>Net Credit Received: ${netCredit.toFixed(2)}</li>
                <li>Break-even Price: ${breakEvenPrice.toFixed(2)}</li>
                <li>Current Product Price: ${currentPrice}</li>
                <li>Current Position Value: ${getCurrentValue()}</li>
                <li>Maximum Profit: ${maxProfit.toFixed(2)} (net credit received)</li>
                <li>Maximum Loss: ${maxLoss.toFixed(2)}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">How This Strategy Works</h3>
          <ul className="space-y-2 list-disc pl-4">
            <li>Sell a call at a lower strike price and buy a call at a higher strike price</li>
            <li>You receive a net credit upfront (premium from short call minus cost of long call)</li>
            <li>Maximum profit is achieved when price stays below lower strike (keep full credit)</li>
            <li>Maximum loss occurs at higher strike (difference in strikes minus net credit)</li>
            <li>Break-even point is lower strike plus net credit received</li>
            <li>This is a bearish strategy - you profit when the price stays below break-even</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BearCallSpreadVisualizer;