import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5174;
const DIST_DIR = path.join(__dirname, 'dist');

const clients = new Set();
let currentEventState = null;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);

  // SSE Broadcast Stream Endpoint
  if (url.pathname === '/api/vaniti/stream') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    });
    res.write('retry: 1500\n\n');
    clients.add(res);

    res.write(`data: ${JSON.stringify({
      type: 'INIT_SYNC',
      clientsCount: clients.size,
      serverTime: Date.now(),
      state: currentEventState,
    })}\n\n`);

    req.on('close', () => {
      clients.delete(res);
    });
    return;
  }

  // Broadcast POST Trigger Endpoint
  if (url.pathname === '/api/vaniti/broadcast' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        if (payload.type === 'SYNC_STATE' && payload.state) {
          currentEventState = payload.state;
        }

        const msg = `data: ${JSON.stringify(payload)}\n\n`;
        for (const client of Array.from(clients)) {
          try {
            client.write(msg);
          } catch (e) {
            clients.delete(client);
          }
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, receivers: clients.size }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Status Check Endpoint
  if (url.pathname === '/api/vaniti/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      port: PORT,
      clientsCount: clients.size,
      timestamp: Date.now(),
    }));
    return;
  }

  // Serve static files from dist
  let filePath = path.join(DIST_DIR, url.pathname === '/' ? 'index.html' : url.pathname);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found. Run "npm run build" first.');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`📡 Vaniti Broadcast Server live on http://0.0.0.0:${PORT}`);
  console.log(`📱 Connected Android Phone: http://localhost:${PORT} or http://192.168.1.197:${PORT}`);
});
