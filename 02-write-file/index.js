const fs = require('fs');
const path = require('path');
const readline = require('readline');

const process = require('process');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const newFileName = path.join(__dirname, 'text.txt');
const newFile = fs.createWriteStream(newFileName);

console.log('Write something, please!');

rl.on('line', (input) => {
  (input.toString().trim() == 'exit')
    ? rl.close()
    : newFile.write(input + '\n');
});

rl.on('SIGINT', () => rl.close());

rl.on('close', () => {
  console.log('The end!!!!!');
  newFile.end();
});
