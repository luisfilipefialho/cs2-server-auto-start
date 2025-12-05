module.exports = function createCs2Watcher(client, options) {
  const {
    guildId,
    userId,
    checkInterval = 5000,
    requiredTime = 20000,
    onStartPlaying = null,
    onStopPlaying = null,
    onStablePlaying = null,
  } = options;

  let state = {
    isPlaying: false,
    startTimestamp: null,
    triggered: false,
  };

  async function check() {
    const guild = client.guilds.cache.get(guildId);
    if (!guild) return;

    const member = await guild.members.fetch(userId).catch(() => null);
    if (!member) return;

    const presence = member.presence;
    const isPlayingCS2 = presence?.activities?.some(a => a.name === process.env.ACTIVITY_NAME) || false;

    if (isPlayingCS2 && !state.isPlaying) {
      state.isPlaying = true;
      state.startTimestamp = Date.now();
      state.triggered = false;

      if (onStartPlaying) onStartPlaying();
    }

    if (isPlayingCS2 && state.isPlaying && !state.triggered) {
      const elapsed = Date.now() - state.startTimestamp;

      if (elapsed >= requiredTime) {
        state.triggered = true;

        if (onStablePlaying) {
          await onStablePlaying();
        }
      }
    }

    if (!isPlayingCS2 && state.isPlaying) {
      state.isPlaying = false;
      state.startTimestamp = null;
      state.triggered = false;

      if (onStopPlaying) onStopPlaying();
    }
  }

  setInterval(check, checkInterval);

  return {
    getState: () => ({ ...state })
  };
};
