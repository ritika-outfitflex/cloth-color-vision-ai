
export interface ColorInfo {
  hex: string;
  rgb: [number, number, number];
  percentage: number;
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Color distance using a weighted Euclidean distance in RGB space
function colorDistance(color1: [number, number, number], color2: [number, number, number]): number {
  const rWeight = 0.3;
  const gWeight = 0.59;
  const bWeight = 0.11;
  
  const rDiff = color1[0] - color2[0];
  const gDiff = color1[1] - color2[1];
  const bDiff = color1[2] - color2[2];
  
  return Math.sqrt(
    rWeight * rDiff * rDiff +
    gWeight * gDiff * gDiff +
    bWeight * bDiff * bDiff
  );
}

// Check if a color is close enough to be considered the same
function isColorSimilar(color1: [number, number, number], color2: [number, number, number], threshold = 20): boolean {
  return colorDistance(color1, color2) < threshold;
}

export const getColorsFromImage = (imageData: ImageData, sampleSize = 5, colorThreshold = 20): ColorInfo[] => {
  const { data, width, height } = imageData;
  const pixels = data.length / 4;
  
  // Skip transparent pixels and collect all colors
  const allColors: [number, number, number][] = [];
  
  // Sample pixels (for large images, we don't need to check every pixel)
  const skipFactor = Math.max(1, Math.floor(Math.sqrt(pixels) / sampleSize));
  
  for (let i = 0; i < pixels; i += skipFactor) {
    const offset = i * 4;
    const alpha = data[offset + 3];
    
    // Skip completely transparent pixels
    if (alpha < 128) continue;
    
    const r = data[offset];
    const g = data[offset + 1];
    const b = data[offset + 2];
    
    allColors.push([r, g, b]);
  }
  
  // No colors found (all transparent)
  if (allColors.length === 0) {
    return [];
  }
  
  // Group similar colors
  const colorGroups: { color: [number, number, number]; count: number }[] = [];
  
  for (const color of allColors) {
    let foundSimilar = false;
    
    for (const group of colorGroups) {
      if (isColorSimilar(color, group.color, colorThreshold)) {
        // Update the average color in the group
        const totalCount = group.count + 1;
        const weight = group.count / totalCount;
        
        group.color = [
          Math.round(group.color[0] * weight + color[0] / totalCount),
          Math.round(group.color[1] * weight + color[1] / totalCount),
          Math.round(group.color[2] * weight + color[2] / totalCount)
        ];
        
        group.count++;
        foundSimilar = true;
        break;
      }
    }
    
    if (!foundSimilar) {
      colorGroups.push({ color, count: 1 });
    }
  }
  
  // Convert to our color info format
  const totalPixels = allColors.length;
  const colorInfo = colorGroups.map(group => ({
    rgb: group.color,
    hex: rgbToHex(group.color[0], group.color[1], group.color[2]),
    percentage: (group.count / totalPixels) * 100
  }));
  
  // Sort by percentage (most common first)
  return colorInfo
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5); // Limit to top 5 colors
};

// Helper to extract ImageData from an Image element
export const getImageData = (image: HTMLImageElement): ImageData => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);
  
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};
