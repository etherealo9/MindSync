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

  // Background
  ctx.fillStyle = '#000000';
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

  // Draw accent circle in the middle
  ctx.fillStyle = '#ffdd00';
  const circleSize = size * 0.7;
  ctx.beginPath();
  ctx.arc(size/2, size/2, circleSize/2, 0, Math.PI * 2);
  ctx.fill();

  // Draw brain paths
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

  // Brain paths
  const paths = [
    // Left hemisphere
    'M9.5 4A2.5 2.5 0 0 1 12 6.5V7a2 2 0 0 1 2 2v1a2 2 0 0 1 2 2v1a2 2 0 0 1 2 2',
    // Right hemisphere
    'M12 6.5A2.5 2.5 0 0 1 14.5 4A2.5 2.5 0 0 1 17 6.5C17 7.89 17 9.33 17 10.5C17 13.5 20 13.5 20 14',
    // Center line
    'M12 6.5C12 9 12 12 12 14c0 1.38 2 1.5 2 3',
    // Left side
    'M4 14c0-.5 3-1 3-3.5C7 9.33 7 7.89 7 6.5A2.5 2.5 0 0 1 9.5 4',
    // Bottom left
    'M4 14c0 .5 3 1 3 3.5',
    // Bottom right
    'M20 14c0 .5-3 1-3 3.5',
    // Bottom left curve
    'M7 18c0 2.5 3 2.5 3 5',
    // Bottom right curve
    'M17 18c0 2.5-3 2.5-3 5',
    // Bottom center
    'M12 14c0 3 0 4 0 5'
  ];

  // Draw each path
  paths.forEach(pathData => {
    ctx.beginPath();
    const commands = pathData.split(' ');
    let index = 0;
    while (index < commands.length) {
      const cmd = commands[index];
      if (cmd === 'M') {
        ctx.moveTo(parseFloat(commands[index + 1]), parseFloat(commands[index + 2]));
        index += 3;
      } else if (cmd === 'A') {
        const [rx, ry, angle, largeArc, sweep, x, y] = commands.slice(index + 1, index + 8).map(parseFloat);
        ctx.arcTo(rx, ry, x, y, angle);
        index += 8;
      } else if (cmd === 'C') {
        const [cp1x, cp1y, cp2x, cp2y, x, y] = commands.slice(index + 1, index + 7).map(parseFloat);
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
        index += 7;
      } else if (cmd === 'L') {
        ctx.lineTo(parseFloat(commands[index + 1]), parseFloat(commands[index + 2]));
        index += 3;
      } else {
        index++;
      }
    }
    ctx.stroke();
  });

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