const sharp = require('sharp');
const fs = require('fs');

async function compress() {
  const files = [
    { name: 'logo.png', width: 600 },
    { name: 'background.png', width: 800 },
  ];

  for (const file of files) {
    const inputPath = `assets/${file.name}`;
    const tempPath = `assets/temp_${file.name}`;
    
    if (fs.existsSync(inputPath)) {
      await sharp(inputPath)
        .resize({ width: file.width, withoutEnlargement: true })
        .png({ quality: 80, compressionLevel: 9 })
        .toFile(tempPath);
      
      fs.renameSync(tempPath, inputPath);
      console.log(`Compressed ${file.name}`);
    }
  }
}

compress().catch(console.error);
