
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CameraFeed from "@/components/CameraFeed";
import EmotionChart from "@/components/EmotionChart";
import DataTable from "@/components/DataTable";
import StatsCards from "@/components/StatsCards";
import PhotoUpload from "@/components/PhotoUpload";
import { Download, Play, Pause, Settings } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [data, setData] = useState([]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast(isRecording ? "Detection stopped" : "Detection started", {
      description: isRecording ? "Facial expression monitoring paused" : "Real-time emotion analysis active"
    });
  };

  const exportData = () => {
    // Simulate CSV export
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Timestamp,Location,Expression,Confidence,Source\n" +
      data.map(row => `${row.timestamp},${row.location},${row.expression || row.emotion},${row.confidence},${row.source || 'live'}`).join("\n");
    
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "retail_analytics_data.csv");
    link.click();
    
    toast("Data exported successfully", {
      description: "CSV file downloaded to your device"
    });
  };

  const handlePhotoAnalyzed = (photoData: any) => {
    setData(prev => [...prev, photoData]);
  };

  // Fix the callback to properly handle the function signature
  const handleDataUpdate = (updateFn: (prev: any[]) => any[]) => {
    setData(updateFn);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Retail Analytics
            </h1>
            <p className="text-muted-foreground mt-2">
              AI-Powered Customer Emotion Detection & Store Analytics
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={toggleRecording}
              variant={isRecording ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isRecording ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRecording ? "Stop Detection" : "Start Detection"}
            </Button>
            <Button onClick={exportData} variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          <Badge variant={isRecording ? "default" : "secondary"} className="animate-pulse">
            {isRecording ? "🟢 Live Detection Active" : "🔴 Detection Paused"}
          </Badge>
        </div>

        {/* Stats Cards */}
        <StatsCards isRecording={isRecording} />

        {/* Main Content */}
        <Tabs defaultValue="live" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="live">Live Monitoring</TabsTrigger>
            <TabsTrigger value="upload">Photo Upload</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="data">Data Records</TabsTrigger>
            <TabsTrigger value="settings">Configuration</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CameraFeed isRecording={isRecording} onDataUpdate={handleDataUpdate} />
              <EmotionChart isRecording={isRecording} />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <PhotoUpload onPhotoAnalyzed={handlePhotoAnalyzed} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EmotionChart isRecording={isRecording} showHistorical={true} />
              <Card>
                <CardHeader>
                  <CardTitle>Peak Hours Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["9:00 AM - Happy customers entering", "2:00 PM - Peak neutral expressions", "6:00 PM - Tired expressions increasing"].map((insight, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm">{insight}</span>
                        <Badge variant="outline">{Math.floor(Math.random() * 50) + 10}%</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="data">
            <DataTable data={data} />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Detection Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Detection Sensitivity</label>
                    <div className="flex items-center gap-2">
                      <input type="range" min="0" max="100" defaultValue="75" className="flex-1" />
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confidence Threshold</label>
                    <div className="flex items-center gap-2">
                      <input type="range" min="0" max="100" defaultValue="60" className="flex-1" />
                      <span className="text-sm text-muted-foreground">60%</span>
                    </div>
                  </div>
                </div>
                <Button className="w-full">Save Configuration</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
