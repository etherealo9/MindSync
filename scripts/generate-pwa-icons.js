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

  // Background circle
  ctx.fillStyle = '#000000';
  
  // Create rounded rectangle
  const radius = size * 0.24; // Rounded corners
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

  // Draw yellow circle in the middle
  ctx.fillStyle = '#ffdd00';
  const circleSize = size * 0.7;
  const padding = (size - circleSize) / 2;
  ctx.beginPath();
  ctx.arc(size/2, size/2, circleSize/2, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw brain icon
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = size * 0.05;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  const scale = size / 24;
  const offsetX = size * 0.175;
  const offsetY = size * 0.1;
  
  // Scale drawing operations
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale * 0.65, scale * 0.65);
  
  // Brain paths from the svg
  ctx.beginPath();
  // Top left to middle
  ctx.moveTo(9.5, 2);
  ctx.bezierCurveTo(10.9, 2, 12, 3.1, 12, 4.5);
  ctx.lineTo(12, 5);
  ctx.bezierCurveTo(13.1, 5, 14, 5.9, 14, 7);
  ctx.lineTo(14, 8);
  ctx.bezierCurveTo(15.1, 8, 16, 8.9, 16, 10);
  ctx.lineTo(16, 11);
  ctx.bezierCurveTo(17.1, 11, 18, 11.9, 18, 13);
  ctx.stroke();
  
  // Top right to middle
  ctx.beginPath();
  ctx.moveTo(12, 4.5);
  ctx.bezierCurveTo(12, 3.1, 13.1, 2, 14.5, 2);
  ctx.bezierCurveTo(15.9, 2, 17, 3.1, 17, 4.5);
  ctx.lineTo(17, 8.5);
  ctx.bezierCurveTo(17, 11.5, 20, 11.5, 20, 12);
  ctx.stroke();
  
  // Middle sections
  ctx.beginPath();
  ctx.moveTo(12, 4.5);
  ctx.lineTo(12, 12);
  ctx.bezierCurveTo(12, 13.38, 14, 13.5, 14, 15);
  ctx.stroke();
  
  // Left side of brain
  ctx.beginPath();
  ctx.moveTo(4, 12);
  ctx.bezierCurveTo(4, 11.5, 7, 11, 7, 8.5);
  ctx.lineTo(7, 4.5);
  ctx.bezierCurveTo(7, 3.1, 8.1, 2, 9.5, 2);
  ctx.stroke();
  
  // Bottom sections
  ctx.beginPath();
  ctx.moveTo(4, 12);
  ctx.bezierCurveTo(4, 12.5, 7, 13, 7, 15.5);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(20, 12);
  ctx.bezierCurveTo(20, 12.5, 17, 13, 17, 15.5);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(7, 16);
  ctx.bezierCurveTo(7, 18.5, 10, 18.5, 10, 21);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(17, 16);
  ctx.bezierCurveTo(17, 18.5, 14, 18.5, 14, 21);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(12, 12);
  ctx.lineTo(12, 17);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(12, 22);
  ctx.bezierCurveTo(11, 22, 10, 21.5, 10, 20);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(12, 22);
  ctx.bezierCurveTo(13, 22, 14, 21.5, 14, 20);
  ctx.stroke();
  
  ctx.restore();
  
  // Bottom accent diagonal stripe
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(0, size * 0.85);
  ctx.lineTo(size, size * 0.7);
  ctx.lineTo(size, size);
  ctx.lineTo(0, size);
  ctx.closePath();
  ctx.fill();

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.png`), buffer);
  console.log(`Generated ${size}x${size} icon`);
});

console.log('All PWA icons generated successfully!'); 