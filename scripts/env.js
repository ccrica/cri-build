const readline = require('readline');
const fs = require('fs');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the port number: ', (port) => {
  rl.question('Enter the Node.js version: ', (nodeVersion) => {
    fs.appendFileSync('.env', `PORT=${port}\nNODE_VERSION=${nodeVersion}\n`);
    console.log('Environment variables updated!');
    rl.close();
  });
});