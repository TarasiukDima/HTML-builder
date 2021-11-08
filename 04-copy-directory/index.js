const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const newfolderPath = path.join(__dirname, 'files-copy');


const readFolderDoCb = (folderName, cb, agsListCb=[]) => {
  fs.readdir(folderName, (err, filesList) => {
    if (err) throw err;
    cb(filesList, folderName, ...agsListCb);
  });
};

const copyFiles = (filesList, folderName, newFolderName) => {
  filesList.forEach(oneFile => {
    fs.copyFile(
      path.join(folderName, oneFile),
      path.join(newFolderName, oneFile),
      () => {}
    );
  });
};

const deleteFiles = (filesList, deletefolderName) => {
  filesList.forEach(el => {
    fs.unlink(
      path.join(deletefolderName, el),
      (err) => {
        if (err) throw err;
      }
    );
  });
};

const copyDir = (folderName, newFolderName) => {
  fsPromises.mkdir(newFolderName, { recursive: true })
    .then(() => {
      readFolderDoCb(newFolderName, deleteFiles);
    })
    .then(() => {
      readFolderDoCb(folderName, copyFiles, [newFolderName]);
    })
    .catch((err) => {
      throw err;
    });
};

copyDir(folderPath, newfolderPath);

module.exports = copyDir;