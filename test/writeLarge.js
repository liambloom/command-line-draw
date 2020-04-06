const { Terminal } = require("../lib/cmdDraw");

const terminal = new Terminal({
  width: 6,
  height: 5
});
terminal.writeLarge("H", 0, 0);
