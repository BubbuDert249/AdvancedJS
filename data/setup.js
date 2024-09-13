const { javascript } = require('advancer')
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const chalk = require('chalk');
const figlet = require('figlet');
const open = require('open');
const axios = require('axios');
const minimist = require('minimist');
const moment = require('moment');

// Configuration
const PORT = 3000;
const STATIC_DIR = path.join(__dirname, 'public');

// Print a fancy header
function printHeader() {
  figlet('Advanced Shell', (err, data) => {
    if (err) {
      console.error('Something went wrong with figlet...');
      console.error(err);
      return;
    }
    console.log(chalk.green(data));
  });
}

// Start a simple HTTP server
function startServer() {
  const server = http.createServer((req, res) => {
    const filePath = path.join(STATIC_DIR, req.url === '/' ? 'index.html' : req.url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  });

  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
}

// Open a URL in the default browser
function openUrl(url) {
  open(url).then(() => {
    console.log(chalk.blue(`Opened URL: ${url}`));
  }).catch(err => {
    console.error(chalk.red(`Error opening URL: ${err.message}`));
  });
}

// Execute a shell command
function runCommand(command) {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(chalk.red(`Error: ${error.message}`));
      return;
    }
    if (stderr) {
      console.error(chalk.yellow(`stderr: ${stderr}`));
      return;
    }
    console.log(chalk.green(`stdout: ${stdout}`));
  });
}

// Fetch data from a URL
async function fetchData(url) {
  try {
    const response = await axios.get(url);
    console.log(chalk.cyan(`Fetched data from ${url}:`));
    console.log(response.data);
  } catch (error) {
    console.error(chalk.red(`Error fetching data: ${error.message}`));
  }
}

// Print system information
function printSystemInfo() {
  console.log(chalk.magenta('System Information:'));
  console.log(`OS: ${os.type()} ${os.release()}`);
  console.log(`CPU: ${os.cpus().length} cores`);
  console.log(`Memory: ${Math.round(os.totalmem() / (1024 * 1024))} MB`);
  console.log(`Uptime: ${moment.duration(os.uptime(), 'seconds').humanize()}`);
}

// Command-line arguments handling
const argv = minimist(process.argv.slice(2));
const command = argv._[0];
const args = argv._.slice(1);

printHeader();

switch (command) {
  case 'start':
    startServer();
    break;
  case 'open':
    if (args.length > 0) {
      openUrl(args[0]);
    } else {
      console.error(chalk.red('Please provide a URL to open.'));
    }
    break;
  case 'exec':
    if (args.length > 0) {
      runCommand(args.join(' '));
    } else {
      console.error(chalk.red('Please provide a command to execute.'));
    }
    break;
  case 'fetch':
    if (args.length > 0) {
      fetchData(args[0]);
    } else {
      console.error(chalk.red('Please provide a URL to fetch.'));
    }
    break;
  case 'sysinfo':
    printSystemInfo();
    break;
  default:
    console.log(chalk.yellow('Usage:'));
    console.log('  start                - Start the HTTP server');
    console.log('  open <url>           - Open a URL in the default browser');
    console.log('  exec <command>       - Execute a shell command');
    console.log('  fetch <url>          - Fetch data from a URL');
    console.log('  sysinfo              - Print system information');
    break;
}
