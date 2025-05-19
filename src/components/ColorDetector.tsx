
import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import ImagePreview from './ImagePreview';
import ColorDisplay from './ColorDisplay';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { removeBackground, loadImage } from '@/utils/imageProcessing';
import { getColorsFromImage, getImageData, ColorInfo } from '@/utils/colorDetection';
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";

const ColorDetector: React.FC = () => {
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [detectedColors, setDetectedColors] = useState<ColorInfo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const processImage = async (file: File) => {
    try {
      setIsProcessing(true);
      setError(null);
      setProgress(0);
      setProcessedImageUrl(null);
      setDetectedColors([]);
      
      // Create URL for original image display
      const originalUrl = URL.createObjectURL(file);
      setOriginalImageUrl(originalUrl);
      setProgress(10);
      
      // Load image
      const img = await loadImage(file);
      setProgress(20);
      
      // Process background removal
      toast({
        title: "Processing image...",
        description: "Removing background and analyzing colors. This may take a moment.",
      });
      
      setProgress(30);
      const processedBlob = await removeBackground(img);
      setProgress(60);
      
      // Create URL for processed image display
      const processedUrl = URL.createObjectURL(processedBlob);
      setProcessedImageUrl(processedUrl);
      setProgress(70);
      
      // Analyze colors from processed image
      const processedImg = await loadImage(processedBlob);
      const imageData = getImageData(processedImg);
      const colors = getColorsFromImage(imageData);
      setProgress(90);
      
      // Update state with detected colors
      setDetectedColors(colors);
      setProgress(100);
      
      toast({
        title: "Processing complete!",
        description: `Detected ${colors.length} dominant colors.`,
      });
    } catch (err) {
      console.error('Error processing image:', err);
      setError('An error occurred while processing the image. Please try again with a different image.');
      toast({
        title: "Processing failed",
        description: "There was an error analyzing the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardContent className="p-6">
          <ImageUploader onImageSelected={processImage} isProcessing={isProcessing} />
          
          {isProcessing && (
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-gray-500 text-center mt-2">
                {progress < 100 ? 'Processing...' : 'Completing analysis...'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {originalImageUrl && (
        <div className="space-y-6">
          <ImagePreview 
            originalImage={originalImageUrl} 
            processedImage={processedImageUrl} 
          />
          
          <ColorDisplay colors={detectedColors} />
        </div>
      )}
    </div>
  );
};

export default ColorDetector;
