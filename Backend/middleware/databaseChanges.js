const { wsService } = global;

const databaseChangesMiddleware = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (body) {
    // Check if this is a response from a database modification
    if (req.method !== 'GET' && body) {
      let data;
      try {
        data = typeof body === 'string' ? JSON.parse(body) : body;
      } catch (e) {
        console.error('Error parsing response body:', e);
        return originalSend.apply(res, arguments);
      }

      // Determine the type of update based on the request path
      let updateType = 'databaseUpdate';
      if (req.path.includes('/campaigns')) {
        updateType = 'campaignUpdate';
      } else if (req.path.includes('/metrics')) {
        updateType = 'metricsUpdate';
      } else if (req.path.includes('/analytics')) {
        updateType = 'analyticsUpdate';
      }

      // Emit real-time update through WebSocket
      if (wsService) {
        wsService.broadcast(updateType, {
          path: req.path,
          method: req.method,
          data: data
        });
      }
    }

    originalSend.apply(res, arguments);
  };

  next();
};

module.exports = databaseChangesMiddleware;
