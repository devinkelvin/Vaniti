/**
 * Vaniti Real-Time Cross-Device Synchronization Engine
 * 
 * Synchronizes Sprayer Phone (Guest) ⇄ Host Projector (Stage) ⇄ Browser Tabs in real-time.
 * Uses Server-Sent Events (SSE) + HTTP POST for cross-device & mobile communication,
 * and BroadcastChannel for zero-latency instant intra-browser tab communication.
 */

const CHANNEL_NAME = 'vaniti_live_sync';
const RECENT_ID_CACHE_SIZE = 100;

class VanitiSyncEngine {
  constructor() {
    this.listeners = new Set();
    this.recentIds = new Set();
    this.broadcastChannel = null;
    this.eventSource = null;
    this.isConnected = false;
    this.connectedPeers = 1;
    this.serverUrl = this.detectServerUrl();
    this.statusListeners = new Set();
    this.reconnectTimeout = null;
    this.deviceId = 'dev-' + Math.random().toString(36).substr(2, 6);

    this.initBroadcastChannel();
    this.initServerEvents();
  }

  detectServerUrl() {
    // If running in browser or webview on localhost / LAN
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      if (origin && origin.startsWith('http')) {
        return origin;
      }
    }
    // Fallback for file:///android_asset or standalone
    return 'http://localhost:5174';
  }

  initBroadcastChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
        this.broadcastChannel.onmessage = (event) => {
          if (event.data) {
            this.handleIncomingMessage(event.data, 'broadcast_channel');
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel not supported in this environment:', err);
      }
    }
  }

  initServerEvents() {
    if (typeof window === 'undefined' || !('EventSource' in window)) return;

    if (this.eventSource) {
      try {
        this.eventSource.close();
      } catch (e) {}
    }

    const sseUrl = `${this.serverUrl}/api/vaniti/stream`;

    try {
      this.eventSource = new EventSource(sseUrl);

      this.eventSource.onopen = () => {
        this.isConnected = true;
        this.notifyStatusChange();
      };

      this.eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'INIT_SYNC') {
            this.connectedPeers = Math.max(1, payload.clientsCount || 1);
            this.isConnected = true;
            this.notifyStatusChange();
            if (payload.state) {
              this.handleIncomingMessage({ type: 'STATE_SYNC', state: payload.state }, 'sse');
            }
          } else {
            this.handleIncomingMessage(payload, 'sse');
          }
        } catch (err) {
          console.warn('Failed to parse SSE payload:', err);
        }
      };

      this.eventSource.onerror = () => {
        this.isConnected = false;
        this.notifyStatusChange();
        // If localhost failed (e.g. running on Android Wi-Fi without ADB reverse), try LAN IP
        if (this.serverUrl.includes('localhost')) {
          this.serverUrl = 'http://192.168.1.197:5174';
        }
        if (!this.reconnectTimeout) {
          this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            this.initServerEvents();
          }, 3000);
        }
      };
    } catch (err) {
      console.warn('EventSource initialization error:', err);
    }
  }

  handleIncomingMessage(msg, source) {
    if (!msg || !msg.type) return;

    // Deduplicate if already handled
    if (msg._syncId) {
      if (this.recentIds.has(msg._syncId)) return;
      this.recentIds.add(msg._syncId);
      if (this.recentIds.size > RECENT_ID_CACHE_SIZE) {
        const first = this.recentIds.values().next().value;
        this.recentIds.delete(first);
      }
    }

    // Ignore self-echoed messages
    if (msg._senderDeviceId === this.deviceId) return;

    // Dispatch to registered listeners
    for (const listener of this.listeners) {
      try {
        listener(msg, source);
      } catch (err) {
        console.error('VanitiSync listener error:', err);
      }
    }
  }

  async broadcast(action) {
    const syncId = 'sync-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
    const enrichedAction = {
      ...action,
      _syncId: syncId,
      _senderDeviceId: this.deviceId,
      _timestamp: Date.now(),
    };

    // Mark as seen locally to prevent self processing
    this.recentIds.add(syncId);

    // 1. Send via local BroadcastChannel (for other tabs / dual screen in < 1ms)
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(enrichedAction);
      } catch (e) {}
    }

    // 2. Send via HTTP POST to Vite / Server endpoint (for cross-device phone ⇄ projector)
    try {
      const endpoint = `${this.serverUrl}/api/vaniti/broadcast`;
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrichedAction),
      });
    } catch (err) {
      // Fallback: If primary URL failed, attempt LAN IP
      if (!this.serverUrl.includes('192.168.1.197')) {
        try {
          await fetch('http://192.168.1.197:5174/api/vaniti/broadcast', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(enrichedAction),
          });
        } catch (e) {}
      }
    }
  }

  // High-level API
  broadcastSpray(sprayAction) {
    return this.broadcast({
      type: 'SPRAY_EVENT',
      spray: sprayAction,
    });
  }

  broadcastHostControl(controlType, data = {}) {
    return this.broadcast({
      type: 'HOST_CONTROL',
      control: controlType,
      data,
    });
  }

  broadcastAnnouncement(message) {
    return this.broadcast({
      type: 'ANNOUNCEMENT',
      message,
    });
  }

  broadcastStateSync(state) {
    return this.broadcast({
      type: 'SYNC_STATE',
      state,
    });
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  onStatusChange(callback) {
    this.statusListeners.add(callback);
    callback(this.getStatus());
    return () => this.statusListeners.delete(callback);
  }

  notifyStatusChange() {
    const status = this.getStatus();
    for (const listener of this.statusListeners) {
      try {
        listener(status);
      } catch (e) {}
    }
  }

  getStatus() {
    return {
      isConnected: this.isConnected,
      peers: this.connectedPeers,
      serverUrl: this.serverUrl,
      deviceId: this.deviceId,
      hasChannel: !!this.broadcastChannel,
    };
  }
}

export const vanitiSync = new VanitiSyncEngine();
export default vanitiSync;
