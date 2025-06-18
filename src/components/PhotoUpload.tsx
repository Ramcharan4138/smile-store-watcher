
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  emotion?: string;
  confidence?: number;
}

interface PhotoUploadProps {
  onPhotoAnalyzed?: (data: any) => void;
}

const PhotoUpload = ({ onPhotoAnalyzed }: PhotoUploadProps) => {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emotions = ["Happy", "Neutral", "Surprised", "Sad", "Angry"];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select only image files");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        const newPhoto: UploadedPhoto = {
          id: Date.now().toString() + Math.random(),
          file,
          preview,
        };
        setPhotos(prev => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    });
  };

  const analyzePhoto = async (photo: UploadedPhoto) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    const confidence = Math.floor(Math.random() * 30) + 70;
    
    const analyzedPhoto = {
      ...photo,
      emotion,
      confidence,
    };

    setPhotos(prev => prev.map(p => p.id === photo.id ? analyzedPhoto : p));
    
    // Notify parent component
    if (onPhotoAnalyzed) {
      onPhotoAnalyzed({
        id: photo.id,
        timestamp: new Date().toLocaleTimeString(),
        emotion,
        confidence,
        location: "Photo Upload",
        source: "upload"
      });
    }

    setIsAnalyzing(false);
    toast.success(`Emotion detected: ${emotion} (${confidence}% confidence)`);
  };

  const removePhoto = (photoId: string) => {
    setPhotos(prev => prev.filter(p => p.id !== photoId));
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis = {
      "Happy": "😊",
      "Neutral": "😐",
      "Surprised": "😲",
      "Sad": "😢",
      "Angry": "😠"
    };
    return emojis[emotion] || "😐";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Photo Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div 
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">Upload Photos for Analysis</p>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop images or click to browse
          </p>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Uploaded Photos */}
        {photos.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Uploaded Photos ({photos.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="border rounded-lg p-4 space-y-3">
                  <div className="relative">
                    <img 
                      src={photo.preview} 
                      alt="Uploaded" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => removePhoto(photo.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground truncate">
                      {photo.file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(photo.file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>

                  {photo.emotion ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getEmotionEmoji(photo.emotion)}</span>
                        <span className="font-medium">{photo.emotion}</span>
                      </div>
                      <Badge variant="secondary">
                        {photo.confidence}% confidence
                      </Badge>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => analyzePhoto(photo)}
                      disabled={isAnalyzing}
                      className="w-full"
                    >
                      {isAnalyzing ? "Analyzing..." : "Analyze Emotion"}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoUpload;
