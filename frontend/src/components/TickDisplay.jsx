import { useEffect, useState } from 'react';
import { subscribeToTicks } from '../api/ticks';
import useStore from '../store/useStore';
import { Card, CardContent, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export default function TickDisplay() {
  const symbol = useStore(s => s.selectedSymbol);
  const [ticks, setTicks] = useState([]);

  useEffect(() => {
    if (!symbol) return;
    const unsubscribe = subscribeToTicks(symbol, data => {
      setTicks(prev => [
        ...prev.slice(-19),
        { ...data, time: new Date().toLocaleTimeString() },
      ]);
    });
    return unsubscribe;
  }, [symbol]);

  if (!symbol) return null;

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6">{symbol} Live Price</Typography>
        {ticks.length > 0 && (
          <LineChart width={500} height={200} data={ticks}>
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#1976d2"
              dot={false}
            />
          </LineChart>
        )}
      </CardContent>
    </Card>
  );
}
