const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const svgPath = path.join(__dirname, '../public/favicon.svg');
const publicDir = path.join(__dirname, '../public');

async function generateIcons() {
  const svgBuffer = fs.readFileSync(svgPath);
  
  for (const size of sizes) {
    const outputPath = path.join(publicDir, `icon-${size}x${size}.png`);
    
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    
    console.log(`Generated: icon-${size}x${size}.png`);
  }
  
  console.log('PWA icons generated successfully!');
}

generateIcons().catch(console.error);
