import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { Input } from "../components/ui/input"

const PutSpreadVisualizer = () => {
  const [shortStrike, setShortStrike] = useState(100);
  const [longStrike, setLongStrike] = useState(90);
  const [shortPremium, setShortPremium] = useState(5);
  const [longPremium, setLongPremium] = useState(3);
  const [currentPrice, setCurrentPrice] = useState(100);

  // Generate payoff data points
  const generatePayoffData = () => {
    const data = [];
    for (let price = 0; price <= 200; price += 1) {
      // Short put payoff
      const shortPutPayoff = Math.min(shortPremium, shortPremium - (shortStrike - price));
      // Long put payoff
      const longPutPayoff = Math.max(-longPremium, price - longStrike - longPremium);
      // Combined payoff
      const totalPayoff = shortPutPayoff + longPutPayoff;
      
      data.push({
        price,
        payoff: totalPayoff,
        shortPutPayoff,
        longPutPayoff
      });
    }
    return data;
  };

  const data = generatePayoffData();
  const netPremium = shortPremium - longPremium;
  const maxLoss = (shortStrike - longStrike) - netPremium;
  const maxProfit = netPremium;
  const breakEvenPrice = shortStrike - netPremium;

  // Calculate current position value
  const getCurrentValue = () => {
    const shortValue = Math.min(shortPremium, shortPremium - (shortStrike - currentPrice));
    const longValue = Math.max(-longPremium, currentPrice - longStrike - longPremium);
    return (shortValue + longValue).toFixed(2);
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4">Put Spread Strategy Payoff</h2>
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
                  dataKey="shortPutPayoff" 
                  stroke="#dc2626" 
                  name="Short Put"
                  strokeWidth={1}
                  dot={false}
                  strokeDasharray="5 5"
                />
                <Line 
                  type="linear" 
                  dataKey="longPutPayoff" 
                  stroke="#16a34a" 
                  name="Long Put"
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
            {/* Short Put Controls */}
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-2">
                  Short Put Strike: ${shortStrike}
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
                  Short Put Premium: ${shortPremium.toFixed(2)}
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

            {/* Long Put Controls */}
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-2">
                  Long Put Strike: ${longStrike}
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
                  Long Put Premium: ${longPremium.toFixed(2)}
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
                <li>Short Put Strike: ${shortStrike}</li>
                <li>Long Put Strike: ${longStrike}</li>
                <li>Net Premium Received: ${netPremium.toFixed(2)}</li>
                <li>Break-even Price: ${breakEvenPrice.toFixed(2)}</li>
                <li>Current Product Price: ${currentPrice}</li>
                <li>Current Position Value: ${getCurrentValue()}</li>
                <li>Maximum Profit: ${maxProfit.toFixed(2)}</li>
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
            <li>You sell a put option at a higher strike price and buy a put option at a lower strike price</li>
            <li>The premium received from the short put helps offset the cost of the long put</li>
            <li>Maximum profit is achieved when price stays above short strike (net premium received)</li>
            <li>Maximum loss is limited to the difference between strikes minus net premium</li>
            <li>Break-even point is the short strike minus the net premium received</li>
            <li>This is a bullish strategy with defined risk/reward</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PutSpreadVisualizer;