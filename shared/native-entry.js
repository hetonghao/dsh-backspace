// Static-dist adapter for the shared skin controller.
(() => {
  'use strict';
  const KEYS = {
    enabled: 'bsEnabled', sea: 'bsSea', time: 'bsTime', glass: 'bsGlass', autoCycle: 'bsAutoCycle',
  };
  const read = (key, fallback) => {
    try {
      const value = localStorage.getItem(KEYS[key]);
      if (value === null) return fallback;
      if (key === 'enabled' || key === 'autoCycle') return value !== 'false';
      return Number(value);
    } catch { return fallback; }
  };
  const controller = globalThis.BackspaceSkinCore.createController({
    assetUrl: (path) => `/dsh-backspace/${path}`,
    storage: {
      get: async (defaults) => ({
        enabled: read('enabled', defaults.enabled),
        sea: read('sea', defaults.sea),
        time: read('time', defaults.time),
        glass: read('glass', defaults.glass),
        autoCycle: read('autoCycle', defaults.autoCycle),
      }),
      set: async (patch) => {
        try {
          for (const [key, value] of Object.entries(patch)) localStorage.setItem(KEYS[key], String(value));
        } catch { /* private or locked-down storage: keep the live value */ }
      },
    },
  });
  void controller.start();
})();
