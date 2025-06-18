
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image as ImageIcon, Video, Play } from "lucide-react";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  emotion?: string;
  confidence?: number;
}

interface PhotoUploadProps {
  onPhotoAnalyzed?: (data: any) => void;
}

const PhotoUpload = ({ onPhotoAnalyzed }: PhotoUploadProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extended emotion categories including all facial expressions
  const emotions = [
    "Happy", "Sad", "Angry", "Surprised", "Fear", "Disgust", "Neutral", "Sadness"
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    Array.from(selectedFiles).forEach((file) => {
      // Check if it's an image or MP4 video
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type === 'video/mp4';
      
      if (!isImage && !isVideo) {
        toast.error("Please select only image files or MP4 videos");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random(),
          file,
          preview,
          type: isImage ? 'image' : 'video',
        };
        setFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });
  };

  const analyzeFile = async (uploadedFile: UploadedFile) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis with longer processing time for videos
    const processingTime = uploadedFile.type === 'video' ? 4000 : 2000;
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    const confidence = Math.floor(Math.random() * 30) + 70;
    
    const analyzedFile = {
      ...uploadedFile,
      emotion,
      confidence,
    };

    setFiles(prev => prev.map(f => f.id === uploadedFile.id ? analyzedFile : f));
    
    // Notify parent component
    if (onPhotoAnalyzed) {
      onPhotoAnalyzed({
        id: uploadedFile.id,
        timestamp: new Date().toLocaleTimeString(),
        emotion,
        confidence,
        location: `${uploadedFile.type === 'video' ? 'Video' : 'Photo'} Upload`,
        source: "upload",
        fileType: uploadedFile.type
      });
    }

    setIsAnalyzing(false);
    toast.success(`Emotion detected: ${emotion} (${confidence}% confidence) in ${uploadedFile.type}`);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
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

  const getEmotionColor = (emotion: string) => {
    const colors = {
      "Happy": "bg-green-100 text-green-800",
      "Sad": "bg-blue-100 text-blue-800",
      "Sadness": "bg-blue-200 text-blue-900",
      "Angry": "bg-red-100 text-red-800",
      "Surprised": "bg-yellow-100 text-yellow-800",
      "Fear": "bg-purple-100 text-purple-800",
      "Disgust": "bg-orange-100 text-orange-800",
      "Neutral": "bg-gray-100 text-gray-800"
    };
    return colors[emotion] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Photo & Video Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div 
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex justify-center gap-4 mb-4">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <Video className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-lg font-medium mb-2">Upload Photos & MP4 Videos</p>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop images or MP4 videos for facial emotion analysis
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
          accept="image/*,video/mp4"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Uploaded Files ({files.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.map((uploadedFile) => (
                <div key={uploadedFile.id} className="border rounded-lg p-4 space-y-3">
                  <div className="relative">
                    {uploadedFile.type === 'image' ? (
                      <img 
                        src={uploadedFile.preview} 
                        alt="Uploaded" 
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="relative">
                        <video 
                          src={uploadedFile.preview} 
                          className="w-full h-48 object-cover rounded-lg"
                          controls={false}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                          <Play className="w-12 h-12 text-white opacity-80" />
                        </div>
                        <Badge className="absolute top-2 left-2 bg-black/70 text-white">
                          MP4 Video
                        </Badge>
                      </div>
                    )}
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={() => removeFile(uploadedFile.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground truncate">
                      {uploadedFile.file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {(uploadedFile.file.size / 1024 / 1024).toFixed(1)} MB
                    </span>
                  </div>

                  {uploadedFile.emotion ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getEmotionEmoji(uploadedFile.emotion)}</span>
                          <span className="font-medium">{uploadedFile.emotion}</span>
                        </div>
                        <Badge variant="secondary">
                          {uploadedFile.confidence}% confidence
                        </Badge>
                      </div>
                      <Badge className={getEmotionColor(uploadedFile.emotion)}>
                        Facial Expression Detected
                      </Badge>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => analyzeFile(uploadedFile)}
                      disabled={isAnalyzing}
                      className="w-full"
                    >
                      {isAnalyzing ? 
                        `Analyzing ${uploadedFile.type}...` : 
                        `Analyze ${uploadedFile.type === 'video' ? 'Video' : 'Photo'} Emotions`
                      }
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
