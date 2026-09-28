/**
 * `npm run dev` from the project root: starts everything needed for local development
 * in one terminal. Output is prefixed per process; Ctrl+C stops them all.
 *
 *   db   local MongoDB (only if MONGODB_URI points at this machine and nothing is running yet)
 *   api  Express server on :5000
 *   web  Vite dev server on :5173 (or the next free port)
 */
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const isWindows = process.platform === 'win32';
const colors = { db: '\x1b[35m', api: '\x1b[33m', web: '\x1b[36m' };
const children = [];

function fail(message) {
  console.error(`\n\x1b[31m[dev]\x1b[0m ${message}\n`);
  process.exit(1);
}

for (const dir of ['server', 'client']) {
  if (!fs.existsSync(path.join(root, dir, 'node_modules'))) fail(`Dependencies missing in ${dir}/. Run: npm run install:all`);
}
const envPath = path.join(root, 'server', '.env');
if (!fs.existsSync(envPath)) fail('server/.env not found. Copy server/.env.example to server/.env and fill it in (see README).');

const mongoUri = (fs.readFileSync(envPath, 'utf8').match(/^MONGODB_URI=(.*)$/m)?.[1] || '').trim();
const local = mongoUri.match(/^mongodb:\/\/(?:localhost|127\.0\.0\.1)(?::(\d+))?\//);
const mongoPort = local ? Number(local[1] || 27017) : null;

const portOpen = (port) =>
  new Promise((resolve) => {
    const socket = net.connect({ port, host: '127.0.0.1' });
    socket.once('connect', () => (socket.destroy(), resolve(true)));
    socket.once('error', () => resolve(false));
  });

function run(name, command) {
  // A single command string (no args array) avoids Node's DEP0190 warning when a shell is used.
  const { NO_COLOR, ...parentEnv } = process.env; // NO_COLOR + FORCE_COLOR together make Node print warnings
  const child = spawn(command, { cwd: root, shell: true, env: { ...parentEnv, FORCE_COLOR: '1' } });
  const prefix = `${colors[name]}[${name}]\x1b[0m `;
  for (const stream of [child.stdout, child.stderr]) {
    let buffer = '';
    stream.on('data', (chunk) => {
      buffer += chunk;
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        console.log(prefix + line);
        const url = name === 'web' && line.replace(/\x1b\[[0-9;]*m/g, '').match(/Local:\s+(http\S+)/)?.[1];
        if (url) {
          console.log(`\n\x1b[42m\x1b[30m  WEBSITE READY  \x1b[0m  Open \x1b[1m${url}\x1b[0m in your browser  (admin: ${url}admin)`);
          console.log('                   Keep this terminal open. Press Ctrl+C to stop everything.\n');
        }
      }
    });
  }
  child.on('exit', (code) => {
    if (!shuttingDown) {
      console.log(`${prefix}exited with code ${code}. Stopping everything.`);
      shutdown(code || 1);
    }
  });
  children.push(child);
  return child;
}

let shuttingDown = false;
function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (child.exitCode !== null) continue;
    // npm runs scripts in a sub-shell, so kill the whole process tree.
    if (isWindows) spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    else child.kill('SIGINT');
  }
  process.exit(code);
}
process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

if (mongoPort && !(await portOpen(mongoPort))) {
  console.log('\x1b[35m[db]\x1b[0m starting local MongoDB...');
  run('db', 'npm run db:local --prefix server');
  const deadline = Date.now() + 10 * 60 * 1000; // the first run may download MongoDB
  while (!(await portOpen(mongoPort))) {
    if (Date.now() > deadline) fail('MongoDB did not start. Try `npm run db:local` on its own to see why.');
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.log('\x1b[35m[db]\x1b[0m MongoDB is ready');
} else if (mongoPort) {
  console.log(`\x1b[35m[db]\x1b[0m MongoDB already running on port ${mongoPort}`);
} else {
  console.log('\x1b[35m[db]\x1b[0m using remote database from MONGODB_URI');
}

const apiPort = Number(fs.readFileSync(envPath, 'utf8').match(/^PORT=(\d+)/m)?.[1] || 5000);
if (await portOpen(apiPort)) {
  console.error(`\n\x1b[31m[dev]\x1b[0m Port ${apiPort} is already in use, probably by another copy of this site that is still running.
      Close the other terminal running "npm run dev" (or restart VS Code) and try again.\n`);
  shutdown(1);
}

run('api', 'npm run dev --prefix server');
run('web', 'npm run dev --prefix client');
