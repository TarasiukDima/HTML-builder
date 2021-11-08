const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const newfolderPath = path.join(__dirname, 'files-copy');


const readFolderDoCb = (folderName, cb, agsListCb = []) => {
  fsPromises.readdir(folderName, { withFileTypes: true })
    .then((data) => {
      cb(data, folderName, ...agsListCb);
    })
    .catch(err => {
      throw err;
    });
};

const copyFiles = (filesList, folderName, newFolderName) => {
  if (!filesList) return;

  filesList.forEach(oneFile => {
    if (oneFile.isFile()) {
      fs.copyFile(
        path.join(folderName, oneFile.name),
        path.join(newFolderName, oneFile.name),
        () => { }
      );
    } else {
      const newFolderPath = path.join(newFolderName, oneFile.name);

      fsPromises.mkdir(newFolderPath, { recursive: true })
        .then(() => {
          readFolderDoCb(
            path.join(folderName, oneFile.name),
            copyFiles,
            [newFolderPath]
          );
        })
        .catch(err => {
          throw err;
        });
    }
  });
};

const copyDir = (folderName, newFolderName) => {
  fsPromises.rm( newFolderName, { force: true, recursive: true } )
    .then(() => {
      fsPromises.mkdir(newFolderName, { recursive: true })
        .then(() => {
          readFolderDoCb(folderName, copyFiles, [newFolderName]);
        })
        .catch((err) => {
          throw err;
        });
    });
};

copyDir(folderPath, newfolderPath);

module.exports = copyDir;