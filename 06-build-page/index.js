const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const copyDir = require('../04-copy-directory');
const bundleCss = require('../05-merge-styles');


/* read folder and do something start */
const readFolderDoCb = (readFolderUrl, cbForData, arrArgsForCB) => {
  fsPromises.readdir(readFolderUrl, { withFileTypes: true })
    .then(data => cbForData(data, ...arrArgsForCB))
    .catch(err => console.log(err));
};
/* read folder and do something end */


/* build html file start */
const writeTextInFile = (content, compName, text, file) => {
  content = content.replace(compName, text);
  fs.writeFile(file, content, (err) => {
    if (err) throw err;
  });

  return content;
};

const cbForComponents = (listHtmlComponents, outputFileHtml) => {
  const outputHTMLContent = fs.createReadStream(outputFileHtml, 'utf-8');

  outputHTMLContent.on('data', (text) => {
    const regForVarients = /{{.*}}/gi;
    const arrNamesComponentsInHtml = text.match(regForVarients);
    let arrComponentsFilesName = [];
    let newContent = text;

    listHtmlComponents.forEach(el => arrComponentsFilesName.push(el.name));

    arrNamesComponentsInHtml.forEach(oneComponent => {
      const elName = oneComponent.slice(2, -2);

      if (arrComponentsFilesName.indexOf(elName + '.html') !== -1) {
        const needComponentPath = path.join(__dirname, 'components', elName + '.html');
        const componentComtent = fs.createReadStream(needComponentPath, 'utf-8');

        componentComtent.on('data', (input) => {
          newContent = writeTextInFile(newContent, oneComponent, input, outputFileHtml);
        });
      } else {
        newContent = writeTextInFile(newContent, oneComponent, '', outputFileHtml);
      }
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
    });
};
/* build html file end */



/* add content in new build folder start */
const buildContentInNewDirectory = (outputPathFolder) => {
  const folderAssets = path.join(__dirname, 'assets');
  const outputPathFolderAssets = path.join(outputPathFolder, 'assets');
  const cssFolder = path.join(__dirname, 'styles');
  const outputCssFolder = path.join(__dirname, 'project-dist', 'style.css');

  copyDir(folderAssets, outputPathFolderAssets);
  bundleCss(cssFolder, outputCssFolder);
  bundleHtmlFile();
};
/* add content in new build folder end */


/* build script start */
const bundlePage = (outputFolderName) => {
  const outputPathFolder = path.join(__dirname, outputFolderName);

  fsPromises.rm(outputPathFolder, { force: true, recursive: true })
    .then(() => {
      fsPromises.mkdir(outputPathFolder, { recursive: true })
        .then(() => {
          buildContentInNewDirectory(outputPathFolder);
        })
        .catch((err) => {
          throw err;
        });
    });
};
/* build script end */
bundlePage('project-dist');