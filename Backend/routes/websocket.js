const express = require('express');
const router = express.Router();
const { wsService } = global;

// Get WebSocket service status
router.get('/health', (req, res) => {
  const status = {
    websocket: {
      running: !!wsService,
      connectedClients: wsService ? wsService.io.engine.clientsCount : 0,
      uptime: wsService ? Math.floor(process.uptime()) : 0,
    }
  };

  res.json(status);
});

// Get currently connected clients
router.get('/clients', (req, res) => {
  if (!wsService) {
    return res.status(503).json({ error: 'WebSocket service not available' });
  }

  const clients = Array.from(wsService.io.sockets.sockets.values()).map(socket => ({
    id: socket.id,
    connected: socket.connected,
    handshake: {
      address: socket.handshake.address,
      time: socket.handshake.time,
      query: socket.handshake.query
    }
  }));

  res.json({ clients });
});

// Broadcast a test message
router.post('/broadcast', (req, res) => {
  if (!wsService) {
    return res.status(503).json({ error: 'WebSocket service not available' });
  }

  try {
    const { event, data } = req.body;
    if (!event) {
      return res.status(400).json({ error: 'Event name is required' });
    }

    wsService.broadcast(event, data || {});
    res.json({ success: true, message: 'Broadcast sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
