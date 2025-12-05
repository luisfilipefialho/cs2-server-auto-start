const axios = require('axios');

module.exports = function createCs2ServerManager(serverId) {
  let serverState = {
    isRunning: false,
  };

  async function start() {
    if (!serverState.isRunning) {
      await powerControl(serverId, 'start');
      serverState.isRunning = true;
    }
  }

  async function stop() {
    if (serverState.isRunning) {
      await powerControl(serverId, 'stop');
      serverState.isRunning = false;
    }
  }

  return {
    start,
    stop,
    getState: () => ({ ...serverState }),
  };
}

async function powerControl(serverId, action) {
  console.log(`Starting server with ID: ${serverId}`);
  const response = await axios.post(`https://${process.env.PTERODACTYL_FQDN}/api/client/servers/${serverId}/power`, {
    signal: action
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.PTERODACTYL_API_KEY}`,
      'Accept': 'Application/vnd.pterodactyl.v1+json',
      'Content-Type': 'application/json'
    }
  });
  console.log(`Server ${action} response:`, response.data);
}
