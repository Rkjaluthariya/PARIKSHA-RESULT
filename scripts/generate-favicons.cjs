const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F4C81" />
      <stop offset="100%" stop-color="#0A3459" />
    </linearGradient>
    <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF6B00" />
      <stop offset="100%" stop-color="#E05B00" />
    </linearGradient>
  </defs>

  <!-- Shield Base -->
  <path
    d="M 50 8 L 90 22 C 90 64 66 86 50 96 C 34 86 10 64 10 22 Z"
    fill="url(#shieldGrad)"
  />

  <!-- Inner Border Highlight -->
  <path
    d="M 50 13 L 85 25 C 85 61 63 81 50 90 C 37 81 15 61 15 25 Z"
    fill="none"
    stroke="#1D6FB8"
    stroke-width="2.5"
    opacity="0.6"
  />

  <!-- Letter P -->
  <path
    d="M 36 28 L 36 74 M 36 28 L 58 28 C 67 28 73 34 73 42 C 73 50 67 56 58 56 L 36 56"
    fill="none"
    stroke="#FFFFFF"
    stroke-width="10"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <!-- Graduation Cap -->
  <path
    d="M 50 16 L 76 26 L 50 33 L 24 26 Z"
    fill="url(#orangeGrad)"
  />

  <!-- Golden Checkmark inside P -->
  <path
    d="M 46 43 L 52 49 L 62 37"
    fill="none"
    stroke="#FF6B00"
    stroke-width="4.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>`;

async function generate() {
  const publicDir = path.join(__dirname, '../public');
  
  // Save favicon.svg
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgContent);
  console.log('Saved favicon.svg');

  const svgBuffer = Buffer.from(svgContent);

  // Generate PNGs
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 }
  ];

  for (const item of sizes) {
    await sharp(svgBuffer)
      .resize(item.size, item.size)
      .toFile(path.join(publicDir, item.name));
    console.log(`Generated ${item.name}`);
  }

  // Create a valid binary favicon.ico from 32x32 PNG
  // We can write a simple ICO header embedding PNGs or 32x32 PNG as ico
  const png32Buffer = await sharp(svgBuffer).resize(32, 32).toFormat('png').toBuffer();
  
  // ICO file header for 1 image (32x32 PNG embedded)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // ICO type
  header.writeUInt16LE(1, 4); // 1 image

  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(32, 0); // Width
  dirEntry.writeUInt8(32, 1); // Height
  dirEntry.writeUInt8(0, 2);  // Color palette
  dirEntry.writeUInt8(0, 3);  // Reserved
  dirEntry.writeUInt16LE(1, 4); // Color planes
  dirEntry.writeUInt16LE(32, 6); // Bits per pixel
  dirEntry.writeUInt32LE(png32Buffer.length, 8); // Size of image data
  dirEntry.writeUInt32LE(22, 12); // Offset (6 + 16 = 22)

  const icoBuffer = Buffer.concat([header, dirEntry, png32Buffer]);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('Generated binary favicon.ico');
}

generate().catch(console.error);
