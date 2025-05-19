
import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import ColorDetector from '@/components/ColorDetector';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      
      <header className="bg-white shadow-sm py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800">Clothing Color Detector</h1>
          <p className="text-gray-600 mt-1">Upload an image to detect dominant colors in clothing</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-lg font-medium mb-4">How it works</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Upload an image of clothing or fashion item</li>
              <li>Our AI will remove the background automatically</li>
              <li>The system analyzes and identifies the dominant colors</li>
              <li>Results show color names, hexadecimal codes and proportions</li>
            </ol>
          </div>
          
          <ColorDetector />
        </div>
      </main>
      
      <footer className="bg-white mt-12 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Clothing Color Detector - AI-powered color analysis tool</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
