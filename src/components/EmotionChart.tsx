
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface EmotionChartProps {
  isRecording: boolean;
  showHistorical?: boolean;
}

const EmotionChart = ({ isRecording, showHistorical = false }: EmotionChartProps) => {
  const [emotionData, setEmotionData] = useState([
    { emotion: "Happy", count: 25, percentage: 35 },
    { emotion: "Neutral", count: 30, percentage: 42 },
    { emotion: "Surprised", count: 8, percentage: 11 },
    { emotion: "Sad", count: 5, percentage: 7 },
    { emotion: "Angry", count: 3, percentage: 5 },
  ]);

  const colors = ["#10b981", "#6b7280", "#f59e0b", "#3b82f6", "#ef4444"];

  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setEmotionData(prev => prev.map(item => ({
        ...item,
        count: item.count + Math.floor(Math.random() * 3),
      })).map(item => {
        const total = emotionData.reduce((sum, e) => sum + e.count, 0);
        return {
          ...item,
          percentage: Math.round((item.count / total) * 100)
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {showHistorical ? "Historical Emotion Analysis" : "Real-time Emotion Distribution"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={emotionData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="emotion" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [value, "Count"]}
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px"
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Emotion Percentage Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={emotionData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="percentage"
                label={({ emotion, percentage }) => `${emotion}: ${percentage}%`}
              >
                {emotionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, "Percentage"]}
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionChart;
