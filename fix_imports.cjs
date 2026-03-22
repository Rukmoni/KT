const fs = require('fs');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/^import React from 'react';\n?/gm, '');
  content = content.replace(/^import React, \{ /gm, 'import { ');
  content = content.replace(/import \{ motion, HTMLMotionProps \} from 'framer-motion';/g, "import { motion } from 'framer-motion';\nimport type { HTMLMotionProps } from 'framer-motion';");
  fs.writeFileSync(file, content);
});
console.log('Fixed imports');
