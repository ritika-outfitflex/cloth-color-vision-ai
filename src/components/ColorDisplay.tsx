
import React from 'react';
import { ColorInfo } from '@/utils/colorDetection';
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getColorName } from '@/utils/colorNames';

interface ColorDisplayProps {
  colors: ColorInfo[];
}

const ColorDisplay: React.FC<ColorDisplayProps> = ({ colors }) => {
  const { toast } = useToast();
  const [copiedColor, setCopiedColor] = React.useState<string | null>(null);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    toast({
      title: "Copied to clipboard",
      description: `Color code ${hex} has been copied.`,
    });
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedColor(null);
    }, 2000);
  };

  if (!colors.length) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-lg font-medium">Detected Colors</h3>
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colors.map((color, index) => {
            // Get the color name for this hex code
            const colorName = getColorName(color.hex);
            
            return (
              <div key={index} className="flex flex-col space-y-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div 
                      className="h-20 rounded-md flex items-end justify-end p-2 cursor-pointer transition-transform hover:scale-105"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => copyToClipboard(color.hex)}
                    >
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="opacity-80"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(color.hex);
                        }}
                      >
                        {copiedColor === color.hex ? <Check size={16} /> : <Copy size={16} />}
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Click to copy hex value</TooltipContent>
                </Tooltip>
                
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm">{color.hex}</span>
                    <span className="text-xs text-gray-500">{color.percentage.toFixed(1)}%</span>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{colorName}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorDisplay;
