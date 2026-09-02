const fs = require('fs');
const path = require('path');

const walk = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      if (!filepath.includes('node_modules') && !filepath.includes('.git') && !filepath.includes('.next')) {
        filelist = walk(filepath, filelist);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      filelist.push(filepath);
    }
  }
  return filelist;
};

const files = walk(path.join(__dirname, '../app'));
files.push(...walk(path.join(__dirname, '../components'))); // if exists

const issues = [];

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, i) => {
      // 1. Missing alt in Image or img
      if (line.match(/<Image[^>]*>/) && !line.match(/alt=/)) {
        // Warning: this regex fails if alt is on next line, but good enough for rough check
        if (!content.substring(content.indexOf(line), content.indexOf(line) + 200).match(/alt=/)) {
            issues.push(`${file}:${i + 1} - Missing alt attribute on Image`);
        }
      }
      if (line.match(/<img[^>]*>/) && !line.match(/alt=/)) {
        if (!content.substring(content.indexOf(line), content.indexOf(line) + 200).match(/alt=/)) {
            issues.push(`${file}:${i + 1} - Missing alt attribute on img`);
        }
      }

      // 2. Button without text or aria-label
      if (line.match(/<button[^>]*>\s*<\//)) {
         issues.push(`${file}:${i + 1} - Empty button without text`);
      }
      if (line.match(/<button[^>]*\/>/)) {
         if (!line.match(/aria-label/)) {
            issues.push(`${file}:${i + 1} - Self-closing button without aria-label`);
         }
      }

      // 3. Links with href="#"
      if (line.match(/<a[^>]*href=["']#["']/)) {
         issues.push(`${file}:${i + 1} - Link with href="#"`);
      }
      if (line.match(/<Link[^>]*href=["']#["']/)) {
         issues.push(`${file}:${i + 1} - Next Link with href="#"`);
      }

      // 4. Tabindex values other than 0 or -1
      if (line.match(/tabIndex=\{?[^0\-\}][^\}]*\}?/)) {
         issues.push(`${file}:${i + 1} - Suspicious tabIndex value`);
      }

      // 5. Invalid ARIA attributes (rough check)
      if (line.match(/aria-hidden=["'](?!true|false)["']/)) {
         issues.push(`${file}:${i + 1} - Invalid aria-hidden value`);
      }
      
      // 6. SVG without aria-hidden or role="img" (very rough, often cause issues)
      // We will skip this as it's too noisy
    });
  } catch(e) {}
});

console.log(issues.join('\n'));
console.log(`Total issues found: ${issues.length}`);
