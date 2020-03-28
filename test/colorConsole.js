const util = require("util");

if (process.stdout.getColorDepth() === 1) module.exports = console;
else {
  const colorConsole = new console.Console(process.stdout, process.stderr);
  colorConsole.error = function error(data, ...args) {
    this._stderr.write("\x1b[31m" + util.format(data, ...args) + "\x1b[0m\n");
  };
  colorConsole.warn = function warn(data, ...args) {
    this._stderr.write("\x1b[33m" + util.format(data, ...args) + "\x1b[0m\n");
  };
  colorConsole.debug = function debug(data, ...args) {
    this._stdout.write("\x1b[36m" + util.format(data, ...args) + "\x1b[0m\n");
  };
  module.exports = colorConsole;
}