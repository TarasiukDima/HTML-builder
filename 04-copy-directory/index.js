const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const newfolderPath = path.join(__dirname, 'files-copy');

const copyDir = (folderName, newFilderName) => {
  fs.access(newFilderName, (err) => {
    if (err) {
      fsPromises.mkdir(newFilderName, { recursive: true })
        .catch(err => console.log(err));
    }

    fsPromises.readdir(folderName, { withFileTypes: true })
      .then(data => {
        data.forEach(el => {
          fsPromises.copyFile(path.join(folderName, el.name), path.join(newFilderName, el.name));
        });
      })
      .catch(err => console.log(err));
  });
};

copyDir(folderPath, newfolderPath);