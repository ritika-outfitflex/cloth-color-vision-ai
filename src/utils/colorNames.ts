
// Common color names mapped to their approximate hex values
const COLOR_MAP: { [key: string]: string } = {
  '#FF0000': 'Red',
  '#FF4500': 'Orange Red',
  '#FFA500': 'Orange',
  '#FFFF00': 'Yellow',
  '#FFFFE0': 'Light Yellow',
  '#ADFF2F': 'Green Yellow',
  '#008000': 'Green',
  '#00FF00': 'Lime',
  '#00FFFF': 'Cyan',
  '#008080': 'Teal',
  '#0000FF': 'Blue',
  '#000080': 'Navy',
  '#800080': 'Purple',
  '#FF00FF': 'Magenta',
  '#FFC0CB': 'Pink',
  '#FFB6C1': 'Light Pink',
  '#800000': 'Maroon',
  '#A52A2A': 'Brown',
  '#FFFFFF': 'White',
  '#F5F5F5': 'White Smoke',
  '#DCDCDC': 'Gainsboro',
  '#D3D3D3': 'Light Gray',
  '#C0C0C0': 'Silver',
  '#A9A9A9': 'Dark Gray',
  '#808080': 'Gray',
  '#696969': 'Dim Gray',
  '#000000': 'Black',
  '#F5F5DC': 'Beige',
  '#FFE4C4': 'Bisque',
  '#FFDEAD': 'Navajo White',
  '#D2B48C': 'Tan',
  '#BC8F8F': 'Rosy Brown'
};

// Helper function to find the closest color in our map
export const getColorName = (hexColor: string): string => {
  // Convert to uppercase for consistent comparison
  const formattedHex = hexColor.toUpperCase();
  
  // Check if we have an exact match
  if (COLOR_MAP[formattedHex]) {
    return COLOR_MAP[formattedHex];
  }
  
  // If no exact match, find the closest color
  const colorEntries = Object.entries(COLOR_MAP);
  let closestColor = colorEntries[0][0];
  let smallestDistance = Number.MAX_VALUE;
  
  // Convert hex to RGB for comparison
  const targetRGB = hexToRgb(formattedHex);
  if (!targetRGB) return 'Unknown';
  
  for (const [hex, _name] of colorEntries) {
    const currentRGB = hexToRgb(hex);
    if (!currentRGB) continue;
    
    const distance = colorDistanceRGB(targetRGB, currentRGB);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestColor = hex;
    }
  }
  
  return COLOR_MAP[closestColor] || 'Unknown';
};

// Helper to convert hex to RGB
const hexToRgb = (hex: string): [number, number, number] | null => {
  // Remove # if present
  const cleanHex = hex.charAt(0) === '#' ? hex.substring(1) : hex;
  
  // Parse hex values
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null;
  }
  
  return [r, g, b];
};

// Calculate distance between two RGB colors
const colorDistanceRGB = (rgb1: [number, number, number], rgb2: [number, number, number]): number => {
  // Using a weighted Euclidean distance formula for perceptual color difference
  const rWeight = 0.3;
  const gWeight = 0.59;
  const bWeight = 0.11;
  
  const rDiff = rgb1[0] - rgb2[0];
  const gDiff = rgb1[1] - rgb2[1];
  const bDiff = rgb1[2] - rgb2[2];
  
  return Math.sqrt(
    rWeight * rDiff * rDiff +
    gWeight * gDiff * gDiff +
    bWeight * bDiff * bDiff
  );
};
