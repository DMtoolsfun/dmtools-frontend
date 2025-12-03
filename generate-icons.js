// Quick script to generate placeholder PWA icons
// Run with: node generate-icons.js

const fs = require('fs');
const path = require('path');

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG-based placeholder icons
function generateIcon(size) {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#06b6d4;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#grad)" rx="${size * 0.1}"/>
    <text x="50%" y="50%" font-size="${size * 0.4}" text-anchor="middle"
          dominant-baseline="middle" fill="white" font-family="Arial, sans-serif" font-weight="bold">
        DM
    </text>
</svg>`;

    return svg;
}

// Generate icons
const sizes = [192, 512];
sizes.forEach(size => {
    const filename = `icon-${size}x${size}.svg`;
    const filepath = path.join(iconsDir, filename);
    fs.writeFileSync(filepath, generateIcon(size));
    console.log(`✅ Generated ${filename}`);
});

console.log('\n📝 Note: SVG icons created. For better PWA support, convert to PNG:');
console.log('   - Use an online tool like cloudconvert.com');
console.log('   - Or install imagemagick: convert icon-192x192.svg icon-192x192.png');
console.log('\n🎨 Or create custom PNG icons at https://realfavicongenerator.net/');
