const fs = require('fs');
const path = require('path');
const readline = require('readline');

const process = require('process');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Write something, please!\n'
});

const newFileName = path.join(__dirname, 'text.txt');
const newFile = fs.createWriteStream(newFileName);

rl.prompt();

rl.on('line', (input) => {
  (input.trim() == 'exit')
    ? rl.close()
    : newFile.write(input + '\n');
});

rl.on('SIGINT', () => rl.close());

rl.on('close', () => {
  process.stdout.write('The end!!!!!');
  newFile.end();
});
