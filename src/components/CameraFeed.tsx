
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Users, MapPin } from "lucide-react";

interface CameraFeedProps {
  isRecording: boolean;
  onDataUpdate: (updateFn: (prev: any[]) => any[]) => void;
}

const CameraFeed = ({ isRecording, onDataUpdate }: CameraFeedProps) => {
  const [currentDetection, setCurrentDetection] = useState(null);
  const [detectionCount, setDetectionCount] = useState(0);

  // Extended emotion categories including all facial expressions
  const emotions = ["Happy", "Sad", "Angry", "Surprised", "Fear", "Disgust", "Neutral", "Sadness"];
  const locations = ["Entry Door", "Exit Door", "Checkout Area"];

  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      const emotion = emotions[Math.floor(Math.random() * emotions.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
      
      const detection = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        emotion,
        location,
        confidence,
      };

      setCurrentDetection(detection);
      setDetectionCount(prev => prev + 1);
      
      // Update parent component with new data
      onDataUpdate(prev => [...(prev || []).slice(-99), detection]); // Keep last 100 records
    }, 2000 + Math.random() * 3000); // Random interval 2-5 seconds

    return () => clearInterval(interval);
  }, [isRecording, onDataUpdate]);

  const getEmotionColor = (emotion: string) => {
    const colors = {
      "Happy": "bg-green-500",
      "Sad": "bg-blue-500",
      "Sadness": "bg-blue-600",
      "Angry": "bg-red-500",
      "Surprised": "bg-yellow-500",
      "Fear": "bg-purple-500",
      "Disgust": "bg-orange-500",
      "Neutral": "bg-gray-500"
    };
    return colors[emotion] || "bg-gray-500";
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis = {
      "Happy": "😊",
      "Sad": "😢",
      "Sadness": "😔",
      "Angry": "😠",
      "Surprised": "😲",
      "Fear": "😨",
      "Disgust": "🤢",
      "Neutral": "😐"
    };
    return emojis[emotion] || "😐";
  };

  return (
    <Card className="h-[500px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Live Camera Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mock Camera Feed */}
        <div className="relative bg-black rounded-lg aspect-video flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-green-900/20"></div>
          
          {/* Simulated camera interface */}
          <div className="text-white text-center z-10">
            <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-sm opacity-75">Camera Feed Simulation</p>
            {isRecording && (
              <div className="mt-4">
                <div className="w-3 h-3 bg-red-500 rounded-full mx-auto animate-pulse"></div>
                <p className="text-xs mt-1">Recording</p>
              </div>
            )}
          </div>

          {/* Detection Overlay */}
          {isRecording && currentDetection && (
            <div className="absolute top-4 left-4 bg-black/80 rounded-lg p-3 text-white text-xs animate-in fade-in duration-500">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Face Detected</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getEmotionEmoji(currentDetection.emotion)}</span>
                  <span>{currentDetection.emotion}</span>
                  <Badge variant="secondary" className="text-xs">
                    {currentDetection.confidence}%
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-gray-300">
                  <MapPin className="w-3 h-3" />
                  <span>{currentDetection.location}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Current Detection Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-muted rounded-lg">
            <Users className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <div className="text-2xl font-bold">{detectionCount}</div>
            <div className="text-xs text-muted-foreground">Detections Today</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="text-2xl font-bold">
              {currentDetection ? `${getEmotionEmoji(currentDetection.emotion)}` : "😐"}
            </div>
            <div className="text-xs text-muted-foreground">
              {currentDetection ? currentDetection.emotion : "No Detection"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraFeed;
