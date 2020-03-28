const { performance } = require("perf_hooks");

if (!global.requestAnimationFrame) {
  module.exports.requestAnimationFrame = callback => {
    return setImmediate(() => {
      callback(performance.now());
    });
  };
  module.exports.cancelAnimationFrame = global.clearImmediate;
}
else module.exports = { requestAnimationFrame, cancelAnimationFrame };