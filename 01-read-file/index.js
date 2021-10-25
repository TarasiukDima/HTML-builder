const fs = require('fs');
const path = require('path');

let content = fs.createReadStream(path.join(__dirname, './text.txt'), 'utf-8');

content.on('data', (text) => {
  console.log(text);
  content.close();
});
