// Generates favicon and apple-touch-icon from public/profile.png
import sharp from 'sharp';

const src = 'public/profile.png';
await sharp(src).resize(48, 48).png().toFile('public/favicon.png');
await sharp(src).resize(180, 180).png().toFile('public/apple-touch-icon.png');
console.log('icons written');
