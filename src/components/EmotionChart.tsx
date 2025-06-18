
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface EmotionChartProps {
  isRecording: boolean;
  showHistorical?: boolean;
}

const EmotionChart = ({ isRecording, showHistorical = false }: EmotionChartProps) => {
  const [emotionData, setEmotionData] = useState([
    { emotion: "Happy", count: 25, percentage: 25 },
    { emotion: "Neutral", count: 20, percentage: 20 },
    { emotion: "Surprised", count: 15, percentage: 15 },
    { emotion: "Sad", count: 12, percentage: 12 },
    { emotion: "Angry", count: 10, percentage: 10 },
    { emotion: "Fear", count: 8, percentage: 8 },
    { emotion: "Disgust", count: 6, percentage: 6 },
    { emotion: "Sadness", count: 4, percentage: 4 },
  ]);

  const colors = ["#10b981", "#6b7280", "#f59e0b", "#3b82f6", "#ef4444", "#8b5cf6", "#f97316", "#06b6d4"];

  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setEmotionData(prev => {
        const updated = prev.map(item => ({
          ...item,
          count: item.count + Math.floor(Math.random() * 3),
        }));
        
        const total = updated.reduce((sum, e) => sum + e.count, 0);
        return updated.map(item => ({
          ...item,
          percentage: Math.round((item.count / total) * 100)
        }));
      });
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
              <XAxis 
                dataKey="emotion" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
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
                fontSize={10}
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
