const fs = require('fs');
const path = require('path');

function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && !file.startsWith('.')) {
        getFiles(filePath, fileList);
      }
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const errors = [];

  // Basic Frontmatter Check
  if (!content.startsWith('---')) {
    errors.push('Missing YAML frontmatter separator');
  } else {
    const frontmatter = content.split('---')[1];
    if (!frontmatter.includes('title:')) errors.push('Missing title in metadata');
    if (!frontmatter.includes('type:')) errors.push('Missing type in metadata');
    if (!frontmatter.includes('timestamp:')) errors.push('Missing timestamp in metadata');
  }

  // WikiLink Check
  if (/\[\[.*?\]\]/.test(content)) {
    errors.push('Found WikiLinks [[...]] - use standard Markdown [links](./path.md) instead');
  }

  return errors;
}

const allMdFiles = getFiles('.');
let totalErrors = 0;

allMdFiles.forEach(file => {
  const fileErrors = validateFile(file);
  if (fileErrors.length > 0) {
    console.error(`\x1b[31mFAIL\x1b[0m: ${file}`);
    fileErrors.forEach(err => console.error(`  - ${err}`));
    totalErrors += fileErrors.length;
  } else {
    console.log(`\x1b[32mPASS\x1b[0m: ${file}`);
  }
});

if (totalErrors > 0) {
  console.error(`\nValidation failed with ${totalErrors} errors.`);
  process.exit(1);
} else {
  console.log('\nValidation successful.');
}
