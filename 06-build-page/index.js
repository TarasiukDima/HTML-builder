const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const copyDir = require('../04-copy-directory');
const bundleCss = require('../05-merge-styles');


/* check folder exist or not and do something start */
const checkFolderExistDoCb = (folderName, cb, arrArgsForCB) => {
  fs.access(folderName, (err) => {
    if (err) {
      fsPromises.mkdir(folderName, { recursive: true })
        .then(() => cb(...arrArgsForCB));
    } else {
      cb(...arrArgsForCB);
    }
  });
};
/* check folder exist or not and do something end */


/* read folder and do something start */
const readFolderDoCb = (readFolderUrl, cbForData, arrArgsForCB) => {
  fsPromises.readdir(readFolderUrl, { withFileTypes: true })
    .then(data => cbForData(data, ...arrArgsForCB))
    .catch(err => console.log(err));
};
/* read folder and do something end */


/* copy all files and folders from folder start */
const copyAllFromTo = (data, fromFolder, toFolder) => {
  data.forEach(el => {
    if (el.isFile()) {
      fsPromises.copyFile(
        path.join(fromFolder, el.name),
        path.join(toFolder, el.name)
      )
        .catch(err => console.log(err));

    } else {
      checkFolderExistDoCb(
        path.join(toFolder, el.name),
        copyDir,
        [
          path.join(fromFolder, el.name),
          path.join(toFolder, el.name)
        ]
      );
    }
  });
};
/* copy all files and folders from folder end */


/* copy all from asssets folder start */
const readAndCopyAssetsFolder = (folderNameForRead, outputFolderName) => {
  const folderAssets = path.join(__dirname, folderNameForRead);
  const newfolderAssets = path.join(__dirname, outputFolderName, folderNameForRead);

  checkFolderExistDoCb(
    newfolderAssets,
    readFolderDoCb,
    [
      folderAssets,
      copyAllFromTo,
      [
        folderAssets,
        newfolderAssets
      ]

    ]
  );
};
/* copy all from asssets folder end */


/* build html file start */
const cbForComponents = (data, outputFileHtml) => {
  const outputHTMLContent = fs.createReadStream(outputFileHtml, 'utf-8');
  const regForVarients = /{{.*}}/gi;


  outputHTMLContent.on('data', (text) => {
    const arrComponentsInHTML = text.match(regForVarients);
    let newContent = text;

    arrComponentsInHTML.forEach(el => {
      const elName = el.slice(2, -2);

      data.forEach(oneCompomemt => {
        if (oneCompomemt.name == elName + '.html') {
          const needComponentPath = path.join(__dirname, 'components', oneCompomemt.name);
          const componentComtent = fs.createReadStream(needComponentPath, 'utf-8');

          componentComtent.on('data', (input) => {
            newContent = newContent.replace(el, input);
          });

          componentComtent.on('end', () => {
            fs.writeFile(outputFileHtml, newContent, (err) => {
              if (err) throw err;
            });
          });
        }
      });
    });
  });
};

const bundleHtmlFile = () => {
  const inputFileHtml = path.join(__dirname, 'template.html');
  const outputFileHtml = path.join(__dirname, 'project-dist', 'index.html');
  const componentsFolder = path.join(__dirname, 'components');

  fsPromises.copyFile(inputFileHtml, outputFileHtml)
    .then(() => {
      readFolderDoCb(componentsFolder, cbForComponents, [outputFileHtml]);
    })
    .catch(err => console.log(err));

};
/* build html file end */



/* add content in new build folder start */
const buildContentInNewDirectory = (outputPlaceAssets, outputFolderName) => {
  const cssFolder = path.join(__dirname, 'styles');
  const outputCssFolder = path.join(__dirname, 'project-dist', 'style.css');

  checkFolderExistDoCb(
    outputPlaceAssets,
    readAndCopyAssetsFolder,
    [
      'assets',
      outputFolderName
    ]
  );

  bundleCss(cssFolder, outputCssFolder);
  bundleHtmlFile();
};
/* add content in new build folder end */


/* build script start */
const bundlePage = (outputFolderName) => {
  const outputPlace = path.join(__dirname, outputFolderName);
  const outputPlaceAssets = path.join(outputPlace, 'assets');

  checkFolderExistDoCb(
    outputPlace,
    buildContentInNewDirectory,
    [
      outputPlaceAssets,
      outputFolderName
    ]

  );
};
/* build script end */
bundlePage('project-dist');