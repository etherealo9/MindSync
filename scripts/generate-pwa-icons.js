const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Generate icons for each size
sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background with gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#3b82f6'); // primary color
  gradient.addColorStop(1, '#8b5cf6'); // secondary color
  ctx.fillStyle = gradient;
  
  // Create rounded rectangle
  const radius = size * 0.12; // Rounded corners
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(size - radius, 0);
  ctx.quadraticCurveTo(size, 0, size, radius);
  ctx.lineTo(size, size - radius);
  ctx.quadraticCurveTo(size, size, size - radius, size);
  ctx.lineTo(radius, size);
  ctx.quadraticCurveTo(0, size, 0, size - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.fill();

  // Draw brain icon (simplified)
  ctx.fillStyle = '#ffffff';
  const iconSize = size * 0.6;
  const padding = (size - iconSize) / 2;
  
  // Draw main circle
  ctx.beginPath();
  ctx.arc(padding + iconSize * 0.4, padding + iconSize * 0.4, iconSize * 0.4, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw small circle
  ctx.beginPath();
  ctx.arc(padding + iconSize * 0.75, padding + iconSize * 0.75, iconSize * 0.15, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw connecting arc
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = size * 0.05;
  ctx.beginPath();
  ctx.arc(padding + iconSize * 0.4, padding + iconSize * 0.4, iconSize * 0.4, Math.PI, Math.PI * 1.5);
  ctx.stroke();

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.png`), buffer);
  
  console.log(`Generated icon: ${size}x${size}`);
});

console.log('All PWA icons generated successfully!'); 