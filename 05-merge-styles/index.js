const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const cssFolder = path.join(__dirname, 'styles');
const outputFolder = path.join(__dirname, 'project-dist', 'bundle.css');

const bundleCss = (inputF, outputF) => {

  const newFile = fs.createWriteStream(outputF);

  fs.access(inputF, (err) => {
    if (err) throw err;

    fsPromises.readdir(inputF, { withFileTypes: true })
      .then(data => {
        data.forEach(el => {
          if (!el.isFile() || path.extname(el.name) !== '.css') return;

          let content = fs.createReadStream(path.join(inputF, el.name), 'utf-8');
          content.on('data', (text) => newFile.write(text.trim() + '\n\n'));
        });
      })
      .catch(err => console.log(err));
  });
};

bundleCss(cssFolder, outputFolder);

module.exports = bundleCss;