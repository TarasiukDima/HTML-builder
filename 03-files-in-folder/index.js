const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fsPromises.readdir(folderPath, { withFileTypes: true })
  .then(data => {
    data.forEach(el => {
      fs.stat(path.join(folderPath, el.name), (err, stats) => {
        if (err) throw err;
        if (!stats.isFile()) return;

        const fileExtName = path.extname(el.name);
        const fileName = path.basename(el.name, fileExtName);
        const fileSize = Math.ceil(stats.size / 1024);

        console.log(`${fileName} - ${fileExtName.slice(1)} - ${fileSize}kb`);
      });
    });
  })
  .catch(err => console.log(err));
