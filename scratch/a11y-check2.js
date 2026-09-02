const fs = require('fs');
const path = require('path');

const walk = (dir, filelist = []) => {
  if (!fs.existsSync(dir)) return filelist;
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

const issues = [];

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, i) => {
      // 1. Missing alt in Image or img
      if ((line.includes('<Image ') || line.includes('<img ')) && !line.includes('alt=')) {
        // Need to check next lines too. Let's just do a simple check.
        const snippet = lines.slice(i, i+5).join(' ');
        if (!snippet.includes('alt=')) {
            issues.push(`${file}:${i + 1} - Missing alt attribute`);
        }
      }

      // 2. Button without text or aria-label. Looking for empty buttons or icon buttons
      if (line.match(/<button[^>]*>\s*<\//)) {
         issues.push(`${file}:${i + 1} - Empty button without text`);
      }
      if (line.match(/<button[^>]*\/>/)) {
         if (!line.match(/aria-label/)) {
            issues.push(`${file}:${i + 1} - Self-closing button without aria-label`);
         }
      }

      // 3. Form inputs missing accessible labels (rough check)
      if (line.match(/<input\s/) || line.match(/<select\s/) || line.match(/<textarea\s/)) {
         const snippet = lines.slice(Math.max(0, i-5), i+5).join(' ');
         if (!snippet.includes('aria-label') && !snippet.includes('<label') && !snippet.includes('id=')) {
            issues.push(`${file}:${i + 1} - Input field might be missing a label`);
         }
      }

      // 4. Invalid ARIA attributes
      if (line.match(/role="([^"]+)"/)) {
         // rough check for valid roles
         const validRoles = ['button', 'presentation', 'img', 'navigation', 'banner', 'main', 'contentinfo', 'search', 'alert', 'dialog', 'form', 'tablist', 'tab', 'tabpanel', 'menu', 'menuitem', 'combobox', 'listbox', 'option', 'region', 'group', 'tooltip', 'status'];
         const role = line.match(/role="([^"]+)"/)[1];
         if (!validRoles.includes(role)) {
             issues.push(`${file}:${i + 1} - Suspicious or invalid role: ${role}`);
         }
      }

      // 5. Check empty links (like icon links)
      if (line.match(/<a[^>]*>\s*<[A-Z]/)) { // e.g. <a href...><Icon /></a>
         const snippet = lines.slice(i, i+3).join(' ');
         if (!snippet.includes('aria-label') && !snippet.includes('sr-only')) {
             issues.push(`${file}:${i + 1} - Link with an icon but no aria-label`);
         }
      }
    });
  } catch(e) {}
});

fs.writeFileSync(path.join(__dirname, 'a11y-issues.txt'), issues.join('\n'));
console.log(`Total issues found: ${issues.length}`);
