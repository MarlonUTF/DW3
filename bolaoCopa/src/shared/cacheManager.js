const cache = {
  jogos: { lastUpdate: null }
};
const TTL = 30 * 60 * 1000; // 30 minutos em milissegundos

export const cacheManager = {
  isStale: (feature) => {
    const now = Date.now();
    return !cache[feature].lastUpdate || (now - cache[feature].lastUpdate) > TTL;
  },
  update: (feature) => {
    cache[feature].lastUpdate = Date.now();
  }
};
