const { performance } = require("perf_hooks");

if (!global.requestAnimationFrame) {
  global.requestAnimationFrame = callback => {
    return setImmediate(() => {
      callback(performance.now());
    });
  };
  global.cancelAnimationFrame = global.clearImmediate;
}