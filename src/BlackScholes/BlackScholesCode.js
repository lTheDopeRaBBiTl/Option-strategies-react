import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent } from "../components/ui/card";
import { Slider } from "../components/ui/slider";
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";

const OptionStrategyCalculator = () => {
  const [legs, setLegs] = useState([
    {
      type: 'call',
      position: 'short',
      strikePrice: 100,
      premium: 0
    }
  ]);
  
  const [currentPrice, setCurrentPrice] = useState(100);
  const [timeToExpiry, setTimeToExpiry] = useState(30);
  const [volatility, setVolatility] = useState(20);
  const [riskFreeRate, setRiskFreeRate] = useState(3);

  // Black-Scholes Option Pricing Model
  const calculatePremium = (type, strike, current, days, vol, rate) => {
    const S = current;
    const K = strike;
    const t = days / 365;
    const v = vol / 100;
    const r = rate / 100;
    
    const d1 = (Math.log(S/K) + (r + Math.pow(v,2)/2)*t) / (v*Math.sqrt(t));
    const d2 = d1 - v*Math.sqrt(t);
    
    const cdf = (x) => {
      let t = 1/(1+.2316419*Math.abs(x));
      let d = .3989423*Math.exp(-x*x/2);
      let p = d*t*(.3193815+t*(-.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));
      return x > 0 ? 1-p : p;
    };
    
    if (type === 'call') {
      return S*cdf(d1) - K*Math.exp(-r*t)*cdf(d2);
    } else {
      // Put option using put-call parity
      return K*Math.exp(-r*t)*cdf(-d2) - S*cdf(-d1);
    }
  };

  // Update premiums whenever inputs change
  useEffect(() => {
    const updatedLegs = legs.map(leg => ({
      ...leg,
      premium: calculatePremium(
        leg.type,
        leg.strikePrice,
        currentPrice,
        timeToExpiry,
        volatility,
        riskFreeRate
      )
    }));
    setLegs(updatedLegs);
  }, [currentPrice, timeToExpiry, volatility, riskFreeRate, legs.length]);

  // Generate payoff data points
  const generatePayoffData = () => {
    const data = [];
    for (let price = 0; price <= currentPrice * 2; price += 1) {
      let totalPayoff = 0;
      
      legs.forEach(leg => {
        let legPayoff = 0;
        if (leg.type === 'call') {
          if (leg.position === 'long') {
            legPayoff = Math.max(-leg.premium, price - leg.strikePrice - leg.premium);
          } else {
            legPayoff = Math.min(leg.premium, leg.premium - (price - leg.strikePrice));
          }
        } else { // put
          if (leg.position === 'long') {
            legPayoff = Math.max(-leg.premium, leg.strikePrice - price - leg.premium);
          } else {
            legPayoff = Math.min(leg.premium, leg.premium - (leg.strikePrice - price));
          }
        }
        totalPayoff += legPayoff;
      });
      
      data.push({
        price,
        payoff: totalPayoff
      });
    }
    return data;
  };

  const addLeg = () => {
    setLegs([...legs, {
      type: 'call',
      position: 'long',
      strikePrice: currentPrice,
      premium: 0
    }]);
  };

  const removeLeg = (index) => {
    setLegs(legs.filter((_, i) => i !== index));
  };

  const updateLeg = (index, field, value) => {
    const updatedLegs = [...legs];
    updatedLegs[index] = {
      ...updatedLegs[index],
      [field]: value
    };
    setLegs(updatedLegs);
  };

  // Calculate strategy metrics
  const calculateMetrics = () => {
    let maxProfit = 0;
    let maxLoss = 0;
    let breakEvens = [];
    // Add calculation logic here based on strategy type
    
    return { maxProfit, maxLoss, breakEvens };
  };

  const data = generatePayoffData();

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardContent className="pt-6">
          <h2 className="text-xl font-bold mb-4">Option Strategy Calculator</h2>
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="price" 
                  label={{ value: 'Price ($)', position: 'bottom' }}
                />
                <YAxis 
                  label={{ value: 'Profit/Loss ($)', angle: -90, position: 'left' }}
                />
                <Tooltip 
                  formatter={(value) => `$${value.toFixed(2)}`}
                  labelFormatter={(value) => `Price: $${value}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="payoff" 
                  stroke="#2563eb" 
                  name="Strategy Payoff"
                  dot={false}
                />
                <ReferenceLine y={0} stroke="#dc2626" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Market Parameters</h3>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-2">
                  Current Price: ${currentPrice}
                </label>
                <Slider
                  value={[currentPrice]}
                  onValueChange={(value) => setCurrentPrice(value[0])}
                  min={1}
                  max={200}
                  step={1}
                />
              </div>
              <Input
                type="number"
                value={currentPrice}
                onChange={(e) => setCurrentPrice(Number(e.target.value))}
                className="w-24"
                min={1}
                max={200}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-2">
                  Days to Expiry: {timeToExpiry}
                </label>
                <Slider
                  value={[timeToExpiry]}
                  onValueChange={(value) => setTimeToExpiry(value[0])}
                  min={1}
                  max={365}
                  step={1}
                />
              </div>
              <Input
                type="number"
                value={timeToExpiry}
                onChange={(e) => setTimeToExpiry(Number(e.target.value))}
                className="w-24"
                min={1}
                max={365}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-2">
                  Volatility: {volatility}%
                </label>
                <Slider
                  value={[volatility]}
                  onValueChange={(value) => setVolatility(value[0])}
                  min={1}
                  max={100}
                  step={1}
                />
              </div>
              <Input
                type="number"
                value={volatility}
                onChange={(e) => setVolatility(Number(e.target.value))}
                className="w-24"
                min={1}
                max={100}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-2">
                  Risk-Free Rate: {riskFreeRate}%
                </label>
                <Slider
                  value={[riskFreeRate]}
                  onValueChange={(value) => setRiskFreeRate(value[0])}
                  min={0}
                  max={10}
                  step={0.1}
                />
              </div>
              <Input
                type="number"
                value={riskFreeRate}
                onChange={(e) => setRiskFreeRate(Number(e.target.value))}
                className="w-24"
                min={0}
                max={10}
                step={0.1}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Strategy Legs</h3>
          <div className="space-y-4">
            {legs.map((leg, index) => (
              <div key={index} className="flex gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <Select 
                    value={leg.type}
                    onValueChange={(value) => updateLeg(index, 'type', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="put">Put</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Position</label>
                  <Select 
                    value={leg.position}
                    onValueChange={(value) => updateLeg(index, 'position', value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="long">Long</SelectItem>
                      <SelectItem value="short">Short</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Strike</label>
                  <Input
                    type="number"
                    value={leg.strikePrice}
                    onChange={(e) => updateLeg(index, 'strikePrice', Number(e.target.value))}
                    className="w-24"
                    min={0}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Premium</label>
                  <Input
                    type="number"
                    value={leg.premium.toFixed(2)}
                    readOnly
                    className="w-24 bg-gray-50"
                  />
                </div>
                
                <Button 
                  variant="destructive"
                  onClick={() => removeLeg(index)}
                  disabled={legs.length === 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            
            <Button onClick={addLeg}>Add Leg</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Strategy Summary</h3>
          <div className="space-y-2">
            <p>Total Premium: ${legs.reduce((sum, leg) => 
              sum + (leg.position === 'short' ? leg.premium : -leg.premium), 0).toFixed(2)}</p>
            <p>Max Profit: ${calculateMetrics().maxProfit.toFixed(2)}</p>
            <p>Max Loss: ${calculateMetrics().maxLoss.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptionStrategyCalculator;