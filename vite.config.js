import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function vanitiBroadcastPlugin() {
  const clients = new Set();
  let currentEventState = null;

  return {
    name: 'vaniti-broadcast-plugin',
    configureServer(server) {
      // SSE Real-Time Event Stream for Connected Phones, Projectors, and Browsers
      server.middlewares.use('/api/vaniti/stream', (req, res) => {
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
        });
        res.write('retry: 1500\n\n');
        clients.add(res);

        // Welcome payload with connection stats
        const welcome = {
          type: 'INIT_SYNC',
          clientsCount: clients.size,
          serverTime: Date.now(),
          state: currentEventState,
        };
        res.write(`data: ${JSON.stringify(welcome)}\n\n`);

        req.on('close', () => {
          clients.delete(res);
        });
      });

      // Broadcast POST endpoint: Receives spray actions, host commands, announcements
      server.middlewares.use('/api/vaniti/broadcast', (req, res) => {
        if (req.method === 'OPTIONS') {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          });
          res.end();
          return;
        }

        if (req.method === 'POST') {
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

              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              });
              res.end(JSON.stringify({ success: true, receivers: clients.size }));
            } catch (err) {
              res.writeHead(400, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.writeHead(405, { 'Access-Control-Allow-Origin': '*' });
          res.end();
        }
      });

      // Status health check
      server.middlewares.use('/api/vaniti/status', (req, res) => {
        res.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        });
        res.end(JSON.stringify({
          status: 'online',
          port: 5174,
          clientsCount: clients.size,
          timestamp: Date.now(),
        }));
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), vanitiBroadcastPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
  },
})

