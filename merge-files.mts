import * as fs from 'fs';

const folderPath = './models'; // Replace with your desired folder path

const mergeFiles = (folderPath: string) => {
  const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.ts'));

  let mergedContent = '';

  files.forEach(file => {
    const filePath = `${folderPath}/${file}`;
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const contentWithoutImports = fileContent.replace(/import\s.*?;/g, '');

    mergedContent += `${contentWithoutImports}\n\n`;
  });
  !fs.existsSync(`build/models/`) && fs.mkdirSync(`build/models/`, { recursive: true })
  fs.writeFileSync(`build/models/merged.ts`, mergedContent, 'utf-8');
};

mergeFiles(folderPath);
