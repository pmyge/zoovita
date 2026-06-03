const { spawn } = require('child_process');
const net = require('net');
const os = require('os');
const qrcode = require('qrcode-terminal');
const path = require('path');
const fs = require('fs');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => {
      resolve(false);
    });
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '0.0.0.0');
  });
}

async function findPort(start = 19000, end = 19100) {
  for (let port = start; port <= end; port += 1) {
    if (await checkPort(port)) {
      return port;
    }
  }
  throw new Error(`No open ports found between ${start} and ${end}`);
}

async function run() {
  try {
    const port = await findPort();
    const ip = getLocalIP();
    const url = `exp://${ip}:${port}`;
    
    console.log(`Starting Expo on ${url}...`);
    console.log(`Scan the QR code below using Expo Go:`);
    
    qrcode.generate(url, { small: true });

    const npxPath = path.join(os.homedir(), '.nvm', 'versions', 'node', 'v22.22.3', 'bin', 'npx');
    const nodePath = path.join(os.homedir(), '.nvm', 'versions', 'node', 'v22.22.3', 'bin', 'node');
    const hasNvmNpx = fs.existsSync(npxPath);
    
    const commandToRun = hasNvmNpx ? npxPath : 'npx';
    const execEnv = Object.assign({}, process.env);
    if (hasNvmNpx) {
       execEnv.PATH = path.dirname(nodePath) + ':' + execEnv.PATH;
    }
    // Disable devtools to avoid sandbox issues on linux
    execEnv.EXPO_NO_DEVTOOLS = '1';
    execEnv.EXPO_OFFLINE = '1';

    const proc = spawn(commandToRun, ['expo', 'start', '--lan', '--clear', '--port', String(port)], {
      stdio: 'inherit',
      shell: true,
      env: execEnv
    });

    proc.on('exit', (code) => {
      process.exit(code);
    });
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

run();
