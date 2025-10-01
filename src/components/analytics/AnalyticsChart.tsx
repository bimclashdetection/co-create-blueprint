import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsChartProps {
  title: string;
  data: any[];
  type: 'line' | 'bar';
  dataKeys: { key: string; color: string; name: string }[];
}

export const AnalyticsChart = ({ title, data, type, dataKeys }: AnalyticsChartProps) => {
  const ChartComponent = type === 'line' ? LineChart : BarChart;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ChartComponent data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis 
              className="text-xs"
              stroke="hsl(var(--muted-foreground))"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            {dataKeys.map(({ key, color, name }) => (
              type === 'line' ? (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={color}
                  strokeWidth={2}
                  name={name}
                />
              ) : (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={color}
                  name={name}
                />
              )
            ))}
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
