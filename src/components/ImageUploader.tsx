
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  isProcessing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected, isProcessing }) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndProcessFile(file);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      validateAndProcessFile(file);
    }
  };
  
  const validateAndProcessFile = (file: File) => {
    // Validate file is an image
    if (!file.type.match('image.*')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.).",
        variant: "destructive",
      });
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }
    
    onImageSelected(file);
  };
  
  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div 
      className={`relative w-full h-48 md:h-64 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors
        ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag} 
      onDragLeave={handleDrag} 
      onDrop={handleDrop}
    >
      <input 
        ref={inputRef}
        type="file" 
        className="hidden" 
        accept="image/*"
        onChange={handleChange} 
      />
      
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
        <div>
          <p className="text-sm text-gray-600">Drag and drop your image here, or</p>
          <Button 
            type="button" 
            onClick={onButtonClick} 
            className="mt-2"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Select File"}
          </Button>
        </div>
        <p className="text-xs text-gray-500">Supports: JPG, PNG, WebP (Max 10MB)</p>
      </div>
    </div>
  );
};

export default ImageUploader;
