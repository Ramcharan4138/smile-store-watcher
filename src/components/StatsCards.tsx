
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Clock, Target } from "lucide-react";

interface StatsCardsProps {
  isRecording: boolean;
}

const StatsCards = ({ isRecording }: StatsCardsProps) => {
  const [stats, setStats] = useState({
    totalDetections: 156,
    activeCustomers: 12,
    averageStayTime: "8.5 min",
    happinessScore: 78
  });

  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setStats(prev => ({
        totalDetections: prev.totalDetections + Math.floor(Math.random() * 3),
        activeCustomers: Math.max(1, prev.activeCustomers + (Math.random() > 0.5 ? 1 : -1)),
        averageStayTime: `${(8.5 + Math.random() * 2 - 1).toFixed(1)} min`,
        happinessScore: Math.max(50, Math.min(95, prev.happinessScore + (Math.random() * 6 - 3)))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isRecording]);

  const cards = [
    {
      title: "Total Detections",
      value: stats.totalDetections,
      icon: Users,
      description: "Today",
      trend: "+12%"
    },
    {
      title: "Active Customers",
      value: stats.activeCustomers,
      icon: Target,
      description: "Currently in store",
      trend: "Live"
    },
    {
      title: "Avg. Stay Time",
      value: stats.averageStayTime,
      icon: Clock,
      description: "Per customer",
      trend: "+5%"
    },
    {
      title: "Happiness Score",
      value: `${Math.round(stats.happinessScore)}%`,
      icon: TrendingUp,
      description: "Customer satisfaction",
      trend: "+8%"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-xs text-muted-foreground">{card.description}</p>
              <span className="text-xs text-green-600 font-medium">{card.trend}</span>
            </div>
          </CardContent>
          {isRecording && (
            <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-green-500 to-blue-500 animate-pulse"></div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
