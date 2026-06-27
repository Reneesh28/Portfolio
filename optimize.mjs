import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const processImages = async () => {
  const files = await glob('src/assets/images/**/*.{png,jpg,jpeg}');
  
  for (const file of files) {
    const ext = path.extname(file);
    const webpPath = file.replace(ext, '.webp');
    
    console.log(`Optimizing ${file} -> ${webpPath}`);
    
    await sharp(file)
      .resize(800, null, { withoutEnlargement: true }) // max width 800px
      .webp({ quality: 80 })
      .toFile(webpPath);
      
    // Delete original to save space
    fs.unlinkSync(file);
  }
  
  console.log('Optimization complete!');
};

processImages().catch(console.error);
