
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ImagePreviewProps {
  originalImage: string | null;
  processedImage: string | null;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ originalImage, processedImage }) => {
  if (!originalImage) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Tabs defaultValue="processed" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="processed">Processed Image</TabsTrigger>
            <TabsTrigger value="original">Original Image</TabsTrigger>
          </TabsList>
          
          <TabsContent value="processed" className="flex justify-center">
            {processedImage ? (
              <div className="relative max-h-96 overflow-hidden rounded-md bg-gray-100">
                <img 
                  src={processedImage} 
                  alt="Processed" 
                  className="object-contain w-full max-h-96"
                />
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center">
                <div className="animate-pulse-soft">Processing image...</div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="original" className="flex justify-center">
            <div className="relative max-h-96 overflow-hidden rounded-md">
              <img 
                src={originalImage} 
                alt="Original" 
                className="object-contain w-full max-h-96"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ImagePreview;
