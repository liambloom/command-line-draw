const EventEmitter = require('events');
const readline = require("readline");
const util = require("util");
const { performance } = require("perf_hooks");
const { requestAnimationFrame, cancelAnimationFrame } = require("./animation");
const verify = require("./verifyType");

const roundToNearest = (num, nearest) => Math.round(num / nearest) * nearest;
const distance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

class Margin {
  constructor (out, width, height) {
    this.#out = out;
    this.#width = width;
    this.#height = height;
  }
  get lr() {
    return Math.floor((this.#out.columns - this.#width) / 2);
  }
  get tb() {
    return Math.floor((this.#out.rows - this.#height) / 2);
  }
  #out;
  #width;
  #height;
}

class Color extends EventEmitter {
  constructor (out) {
    super();
    this.#out = out;
  }
  reset () {
    this.#foreground = undefined;
    this.#background = undefined;
    this.#out.write(Color.RESET);
    this.emit("change");
  }
  refresh () {
    this.#out.write(Color.RESET);
    if (this.foreground) this.#out.write(Color.getForegroundColor(this.foreground));
    if (this.background) this.#out.write(Color.getBackgroundColor(this.background));
  }
  get foreground () {
    return this.#foreground;
  }
  set foreground (color) {
    if (color === undefined) {
      this.#foreground = undefined;
      this.refresh();
    }
    else {
      this.#out.write(Color.getForegroundColor(color));
      this.#foreground = color;
      this.emit("change");
    }
  }
  get background () {
    return this.#background;
  }
  set background (color) {
    if (color === undefined) {
      this.#background = undefined;
      this.refresh();
    }
    else {
      this.#out.write(Color.getBackgroundColor(color));
      this.#background = color;
      this.emit("change");
    }
  }
  #out;
  #foreground;
  #background;
  static getForegroundColor (color) {
    const index = this.#COLORS.indexOf(color);
    if (index === -1) throw new Error(color + " is not a valid color");
    else return `\x1b[3${index}m`;
  }
  static getBackgroundColor(color) {
    const index = this.#COLORS.indexOf(color);
    if (index === -1) throw new Error(color + " is not a valid color");
    else return `\x1b[4${index}m`;
  }
  static RESET = "\x1b[0m";
  static #COLORS = ["black", "red", "green", "yellow", "blue", "magenta", "cyan", "white"];
}

class Terminal extends EventEmitter {
  constructor (config = {}) {
    super();
    Object.defineProperties(this, {
      out: {
        value: verify.config(config, "out", process.stdout),
        enumerable: true
      },
      borderStyle: {
        value: verify.config(config, "border", "light"),
        writable: false,
        configurable: false,
        enumerable: true
      },
      // The following 2 could go in any set of property definitions
      in: {
        value: verify.config(config, "in", process.stdin),
        writable: false,
        configurable: false,
        enumerable: true
      },
      hasBorder: {
        value: !(config.border === "none"),
        writable: false,
        configurable: false,
        enumerable: true
      },
      dev: {
        value: verify.config(config, "dev", false),
        writable: false,
        configurable: false,
        enumerable: true
      }
    });
    Object.defineProperties(this, {  
      color: {
        value: new Color(this.out),
        writable: false,
        configurable: false,
        enumerable: true
      },
      borderChars: {
        value: Terminal.BORDERS[this.borderStyle] || (() => { throw new Error(`config.${config.border} is not a valid border type`); })(),
        writable: false,
        configurable: false,
        enumerable: true
      }
    });
    config.width = verify.config(config, "width", this.out.columns - 2 * this.largestBorder, false, -this.out.columns + 1, this.out.columns);
    config.height = verify.config(config, "height", this.out.rows - 2, false, -this.out.rows + 1, this.out.rows);
    Object.defineProperties(this, {
      width: {
        value: config.width < 0 ? this.out.columns - 2 * this.largestBorder + config.width : config.width,
        writable: false,
        configurable: false,
        enumerable: true
      },
      height: {
        value: config.height < 0 ? this.out.rows - 2 + config.height : config.height,
        writable: false,
        configurable: false,
        enumerable: true
      }
    });
    Object.defineProperty(this, "margin", {
      value: new Margin(this.out, this.width, this.height),
      writable: false,
      configurable: false,
      enumerable: true
    });
    if (config.color) {
      if (config.color.foreground) this.color.foreground = config.color.foreground;
      if (config.color.background) this.color.background = config.color.background;
    }
    this.out.on("resize", () => {
      this.#onresize()
      this.emit("resize");
    });
    this.color.on("change", () => this.#refresh());
    this.#onresize();
    readline.emitKeypressEvents(process.stdin);
    this.in.setRawMode(true);
    this.in.on("keypress", (str, key) => {
      if (key.ctrl && !key.meta && !key.shift && key.name === "c") process.exit();
      else if (!this.tooBig) {
        let eventName = "";
        if (key.ctrl) eventName += "ctrl+";
        if (key.meta) eventName += "alt+";
        if (key.shift) eventName += "shift+";
        eventName += key.name;
        this.emit(eventName, key);
      }
    });
    process.on("exit", () => {
      this.out.write(Color.RESET);
      this.out.cursorTo(0, this.out.rows - 1);
      this.out.clearLine(0);
      //if (this.dev) this.out.write("\x1b[33m\x1b[41m" + this.#consoleBuffer.toString("utf8") + "\x1b[0m");
      this.out.cursorTo(0, this.out.rows - 2);
    })
  }
  drawLine (x1, y1, x2, y2, color, thickness = 1, dashed = false, dashThickness = 0.5, spaceColor) {
    if (this.clearMode) {
      color = this.color.background;
      spaceColor = this.color.background; 
    }
    if (this.tooBig) return;
    x1 = verify(x1, Number, "x1");
    y1 = verify(y1, Number, "y1");
    x2 = verify(x2, Number, "x2");
    y2 = verify(y2, Number, "y2");
    if (color) this.out.write(Color.getForegroundColor(color));
    thickness = verify(thickness, 1, "thickness", false);
    dashed = verify(dashed, false, "dashed", false);
    dashThickness = verify(dashThickness, 0.5, "dashThickness", false);
    if (spaceColor) this.out.write(Color.getBackgroundColor(spaceColor));
    if (x1 < 0 || x1 > this.width || x2 < 0 || x2 > this.width || y1 < 0 || y1 > this.height || y2 < 0 || y2 > this.height) throw new Error("Cannot draw line outside of box");
    const m = (y2 - y1) / (x2 - x1);
    const b = y1 - m * x1;
    const xMin = Math.min(x1, x2);
    const yMin = Math.min(y1, y2);
    thickness = Math.round(thickness);
    if (m === 0) { // Horizontal line
      if (y1 + Math.ceil(-thickness / 2) < 0 || y1 + Math.ceil(thickness / 2) > this.height) throw new Error("Cannot draw line outside of box");
      for (let row = Math.ceil(-thickness / 2); row < Math.ceil(thickness / 2); row++) {
        if (dashed) {
          let dash = "";
          const startWithHalf = roundToNearest(xMin, 0.5) % 1;
          if (startWithHalf) dash += Terminal.RIGHT;
          for (let column = 0; column < Math.floor(startWithHalf ? dashThickness - 0.5 : dashThickness); column++) dash += Terminal.FULL;
          if (roundToNearest(xMin + dashThickness, 0.5) % 1) dash += Terminal.LEFT;
          for (let column = 0; column < Math.floor(Math.abs(x2 - x1) / dashThickness) * dashThickness; column += dashThickness * 2) {
            this.out.cursorTo(this.margin.lr + Math.floor(xMin) + column, this.margin.tb + Math.floor(y1) + row);
            this.out.write(dash);
          }
        }
        else {
          this.out.cursorTo(this.margin.lr + Math.round(xMin), this.margin.tb + Math.round(y1) + row);
          for (let column = 0; column < Math.abs(x2 - x1); column++) this.out.write(Terminal.FULL);
        }
      }
      this.out.write(Color.RESET);
      this.out.write(Color.getForegroundColor(this.color.foreground));
      this.out.write(Color.getBackgroundColor(this.color.background));
    }
    else if (m === Infinity) { // Vertical line
      if (x1 + Math.ceil(-thickness / 2) < 0 || x1 + Math.ceil(thickness / 2) > this.width) throw new Error("Cannot draw line outside of box");
      for (let column = Math.ceil(-thickness / 2); column < Math.ceil(thickness / 2); column++) {
        if (dashed) {
          let dash = [];
          const startWithHalf = roundToNearest(yMin, 0.5) % 1;
          if (startWithHalf) dash.push(Terminal.BOTTOM);
          for (let row = 0; row < Math.floor(startWithHalf ? dashThickness - 0.5 : dashThickness); row++) dash.push(Terminal.FULL);
          if (roundToNearest(yMin + dashThickness, 0.5) % 1) dash.push(Terminal.TOP);
          for (let row = 0; row < Math.floor(Math.abs(y2 - y1) / dashThickness) * dashThickness; row += dashThickness * 2) {
            for (let i = 0; i < dash.length; i++) {
              this.out.cursorTo(this.margin.lr + Math.floor(x1) + column, this.margin.tb + Math.floor(yMin) + row + i);
              this.out.write(dash[i]);
              /*console.log(this.#consolePos);
              process.exit();*/
            }
          }
        }
        else {
          for (let row = 0; row < Math.abs(y2 - y1); row++) {
            this.out.cursorTo(this.margin.lr + Math.round(x1) + column, this.margin.tb + Math.round(yMin) + row);
            this.out.write(Terminal.FULL);
          }
        }
      }
    }
    else throw new Error("Diagonal lines are not supported.");
    if (color || spaceColor) this.color.refresh();
  }
  drawBox (x, y, width, height, color) {
    if (this.clearMode) color = this.color.background;
    if (this.tooBig) return;
    x = verify(x, Number, "x");
    y = verify(y, Number, "y");
    width = verify(width, Number, "width", true, 0.5);
    height = verify(height, Number, "height", true, 0.5);
    if (color) this.out.write(Color.getForegroundColor(color));
    if (x < 0 || y < 0 || x + width > this.width || y + height > this.height) throw new Error(`Box cannot be outside terminal, was at (${x}, ${y})`);
    x = roundToNearest(x, 0.5);
    y = roundToNearest(y, 0.5);
    width = roundToNearest(width, 0.5);
    height = roundToNearest(height, 0.5);
    if ((x % 1 || width % 1) && (y % 1 || height % 1)) throw new Error("Can only use 0.5 block precision on one axis");
    if (y % 1 !== 0) {
      this.out.cursorTo(this.margin.lr + x, Math.floor(this.margin.tb + y))
      for (let column = 0; column < width; column++) {
        this.out.write(Terminal.BOTTOM);
      }
    }
    for (let row = 0; row < Math.floor(height - y % 1); row++) {
      this.out.cursorTo(Math.floor(this.margin.lr + x), Math.floor(this.margin.tb + row + Math.ceil(y)));
      if (x % 1 !== 0) this.out.write(Terminal.RIGHT);
      for (let column = 0; column < Math.floor(width - x % 1); column++) {
        this.out.write(Terminal.FULL);
      }
      if ((x + width) % 1 !== 0) this.out.write(Terminal.LEFT);
    }
    if ((y + height) % 1 !== 0) {
      this.out.cursorTo(this.margin.lr + x, Math.floor(this.margin.tb + y + height))
      for (let column = 0; column < width; column++) {
        this.out.write(Terminal.TOP);
      }
    }
    if (color) this.color.refresh();
  }
  write (text, x, y, color) {
    if (this.clearMode) color = this.color.background;
    if (this.tooBig) return;
    text = text.toString().replace(/[\n\t]/g, "  ");
    x = verify(x, 0, "x", false);
    y = verify(y, 0, "y", false);
    if (color) this.out.write(Color.getForegroundColor(color));
    if (x < 0 || x + text.replace(/\x1b\[\d*[a-z]/g, "").length > this.width || y < 0 || y >= this.height) throw new Error("Text cannot be outside terminal");
    this.out.cursorTo(this.margin.lr + Math.round(x), this.margin.tb + Math.round(y));
    this.out.write(text);
    if (color) this.color.refresh();
  }
  clear () {
    for (let sprite of this.#sprites) {
      sprite.stop();
      sprite.clear();
    }
    this.#clear();
    this.#drawBorder();
  }
  addSprite (sprite) {
    sprite = verify(sprite, Sprite, "sprite");
    Object.defineProperty(sprite, "terminal", {
      value: this
    });
    this.#sprites.add(sprite);
  }
  sevenSegment (x, y, a, b, c, d, e, f, g, color) {
    this.bitmap(x, y, color, this.sevenSegmentToBitmap(a, b, c, d, e, f, g));
  }
  sevenSegmentToBitmap (a, b, c, d, e, f, g) {
    return [
      [a || f, a, a || b],
      [f, false, b],
      [e || f || g, g, b || c || g],
      [e, false, c],
      [d || e, d, c || d]
    ];
  }
  writeLarge (text, x, y, color) {
    let matrixes = [];
    text = verify(text, String, "text").toUpperCase();
    for (let i of text) {
      if (/\d/.test(i)) matrixes.push(this.sevenSegmentToBitmap(Terminal.sevenSegmentPresets.numbers[i]));
      else if (/[a-z]/i.test(i)) matrixes.push(Terminal.bitmapPresets.letters[i]);
      else if (/[\.!?]/.test(i)) matrixes.push(Terminal.bitmapPresets.punctuation[i]);
      else if (/\s/.test(i)) matrixes.push([[false], [false], [false], [false], [false]]);
      else throw new Error(`Character "${i}" is not recognized, in order to print it you must create your own bitmap`);
    }
    this.bitmap(x, y, color, ...matrixes);
  }
  bitmap (x, y, color, ...matrixes) {
    if (this.clearMode) color = this.color.background;
    if (this.tooBig) return;
    x = Math.round(verify(x, Number, "x"));
    y = Math.round(verify(y, Number, "y"));
    const outsideTerminalError = new RangeError("bitmap must be drawn inside of terminal");
    if (x < 0 || y < 0) throw outsideTerminalError;
    const on = Terminal.FULL.repeat(2);
    const off = "  ";
    if (color) {
      if (Array.isArray(color)) {
        matrixes.push(color);
        color = undefined;
      }
      else this.out.write(Color.getForegroundColor(color));
    }
    if (matrixes.length < 1) throw new Error("At least one matrix is required by the bitmap function");
    for (let matrix of matrixes) {
      matrix = verify(matrix, Array, "matrix");
      if (y + matrix.length >= this.height) throw outsideTerminalError;
      for (let row in matrix) {
        row = parseInt(row);
        if (!Array.isArray(matrix[row])) throw new Error("3rd argument of bitmap must be a 2-dimensional array (a matrix)");
        if (matrix[row].length >= this.width) throw outsideTerminalError;
        this.out.cursorTo(x + this.margin.lr, y + row + this.margin.tb);
        for (let column of matrix[row]) {
          this.out.write(column ? on : off);
        }
      }
      x += (matrix.sort((a, b) => b.length - a.length)[0].length + 1) * 2;
    }
    if (color) this.color.refresh();
  }
  log(data, ...args) {
    this.out.cursorTo(this.margin.lr + this.width + 2 * this.largestBorder, this.#logHeight++);
    this.out.write("\x1b[36m" + util.format(data, ...args) + "\x1b[0m");
  };
  #clear = function () {
    this.out.cursorTo(0, 0);
    this.out.clearScreenDown();
  }
  #refresh = function () {
    this.#drawBorder();
    for (let sprite of this.#sprites) {
      if (sprite.showing) sprite.draw(sprite.x, sprite.y);
    }
    /*for (let row = 0; row < this.height; row++) {
      this.out.cursorTo(this.margin.lr, this.margin.tb + row);
      this.out.write(this.#consoleBuffer.slice(row * this.width, (row + 1) * this.width - 1).toString("utf8"));
    }*/
  }
  #onresize = function () {
    this.#clear(); 
    if (this.tooBig) {
      if (!this.#frozenStartTime) this.#frozenStartTime = performance.now();
      this.out.write(`Playing field is larger than terminal. Please make terminal larger to continue.`);
    }
    else {
      if (this.#frozenStartTime) {
        this.#frozen += performance.now() - this.#frozenStartTime;
        this.#frozenStartTime = undefined;
      }
      this.#refresh();
    }
  }
  #drawLineAcross = function () {
    for (let column = 0; column < this.width - this.borderChars.horizontal.length + 1; column += this.borderChars.horizontal.length) process.stdout.write(this.borderChars.horizontal);
  }
  #drawBorder = function () {
    if (this.hasBorder) {
      this.out.cursorTo(this.margin.lr - this.borderChars.topLeft.length, this.margin.tb - 1);
      this.out.write(this.borderChars.topLeft);
      this.#drawLineAcross();
      this.out.write(this.borderChars.topRight);
      for (let row = 0; row < this.height; row++) {
        this.out.cursorTo(this.margin.lr - this.borderChars.vertical.length, this.margin.tb + row);
        this.out.write(this.borderChars.vertical);
        this.out.cursorTo(this.margin.lr + this.width);
        this.out.write(this.borderChars.vertical);
      }
      this.out.cursorTo(this.margin.lr - this.borderChars.bottomLeft.length, this.margin.tb + this.height);
      this.out.write(this.borderChars.bottomLeft);
      this.#drawLineAcross();
      this.out.write(this.borderChars.bottomRight);
    }
  }
  get tooBig () {
    return this.margin.lr < this.largestBorder || this.margin.tb < 1;
  }
  get largestBorder () {
    return this.hasBorder ? Math.max(this.borderChars.topLeft.length, this.borderChars.vertical.length, this.borderChars.bottomLeft.length) : 0;
  }
  get time () {
    return performance.now() - this.#frozen;
  }
  in;
  out;
  width;
  height;
  borderStyle;
  borderChars;
  hasBorder;
  color;
  margin;
  dev;
  clearMode = false;
  #frozenStartTime;
  #logHeight = 0;
  #frozen = 0;
  #sprites = new Set();
  static FULL = "\u2588";
  static TOP = "\u2580";
  static BOTTOM = "\u2584";
  static LEFT = "\u258C";
  static RIGHT = "\u2590";
  static BORDERS = {
    light: {
      vertical: "\u2502",
      horizontal: "\u2500",
      topLeft: "\u250c",
      topRight: "\u2510",
      bottomLeft: "\u2514",
      bottomRight: "\u2518",
      horizontalUp: "\u2534",
      horizontalDown: "\u252c"
    },
    heavy: {
      vertical: "\u2503",
      horizontal: "\u2501",
      topLeft: "\u250f",
      topRight: "\u2513",
      bottomLeft: "\u2517",
      bottomRight: "\u251b",
      horizontalUp: "\u253b",
      horizontalDown: "\u2533"
    },
    double: {
      vertical: "\u2551",
      horizontal: "\u2550",
      topLeft: "\u2554",
      topRight: "\u2557",
      bottomLeft: "\u255a",
      bottomRight: "\u255d",
      horizontalUp: "\u2569",
      horizontalDown: "\u2566"
    },
    round: {
      vertical: "\u2502",
      horizontal: "\u2500",
      topLeft: "\u256d",
      topRight: "\u256e",
      bottomLeft: "\u2570",
      bottomRight: "\u256f"
    },
    solid: {
      vertical: "\u2588\u2588",
      horizontal: "\u2588",
      topLeft: "\u2588\u2588",
      topRight: "\u2588\u2588",
      bottomLeft: "\u2588\u2588",
      bottomRight: "\u2588\u2588",
      horizontalUp: "\u2588\u2588",
      horizontalDown: "\u2588\u2588"
    }
  }
  static sevenSegmentPresets = {
    numbers: {
      "0": [true, true, true, true, true, true, false],
      "1": [false, true, true, false, false, false, false],
      "2": [true, true, false, true, true, false, true],
      "3": [true, true, true, true, false, false, true],
      "4": [false, true, true, false, false, true, true],
      "5": [true, false, true, true, false, true, true],
      "6": [true, false, true, true, true, true, true],
      "7": [true, true, true, false, false, false, false],
      "8": [true, true, true, true, true, true, true],
      "9": [true, true, true, true, false, true, true]
    }
  }
  static bitmapPresets = {
    letters: {
      A: [
        [false, true, false],
        [true, false, true],
        [true, false, true],
        [true, true, true],
        [true, false, true]
      ],
      B: [
        [true, true, false],
        [true, false, true],
        [true, true, false],
        [true, false, true],
        [true, true, false]
      ],
      C: [
        [false, true, true],
        [true, false, false],
        [true, false, false],
        [true, false, false],
        [false, true, true]
      ],
      D: [
        [true, true, false],
        [true, false, true],
        [true, false, true],
        [true, false, true],
        [true, true, false]
      ],
      E: [
        [true, true, true],
        [true, false, false],
        [true, true, true],
        [true, false, false],
        [true, true, true]
      ],
      F: [
        [true, true, true],
        [true, false, false],
        [true, true, true],
        [true, false, false],
        [true, false, false],
      ],
      G: [
        [false, true, true],
        [true, false, false],
        [true, false, true],
        [true, false, true],
        [false, true, true]
      ],
      H: [
        [true, false, true],
        [true, false, true],
        [true, true, true],
        [true, false, true],
        [true, false, true]
      ],
      I: [
        [true, true, true],
        [false, true, false],
        [false, true, false],
        [false, true, false],
        [true, true, true],
      ],
      J: [
        [true, true, true],
        [false, false, true],
        [false, false, true],
        [true, false, true],
        [false, true, false]
      ],
      K: [
        [true, false, true],
        [true, false, true],
        [true, true, false],
        [true, false, true],
        [true, false, true]
      ],
      L: [
        [true, false, false],
        [true, false, false],
        [true, false, false],
        [true, false, false],
        [true, true, true]
      ],
      M: [
        [true, true, true, true, true],
        [true, false, true, false, true],
        [true, false, true, false, true],
        [true, false, true, false, true],
        [true, false, false, false, true]
      ],
      N: [
        [true, true, true],
        [true, false, true],
        [true, false, true],
        [true, false, true],
        [true, false, true]
      ],
      O: [
        [true, true, true],
        [true, false, true],
        [true, false, true],
        [true, false, true],
        [true, true, true]
      ],
      P: [
        [true, true, false],
        [true, false, true],
        [true, true, false],
        [true, false, false],
        [true, false, false]
      ],
      Q: [
        [true, true, false],
        [true, false, true],
        [true, true, false],
        [false, false, true],
        [false, false, true]
      ],
      R: [
        [true, true, false],
        [true, false, true],
        [true, true, false],
        [true, false, true],
        [true, false, true]
      ],
      S: [
        [true, true, true],
        [true, false, false],
        [true, true, true],
        [false, false, true],
        [true, true, true]
      ],
      T: [
        [true, true, true],
        [false, true, false],
        [false, true, false],
        [false, true, false],
        [false, true, false]
      ],
      U: [
        [true, false, true],
        [true, false, true],
        [true, false, true],
        [true, false, true],
        [true, true, true],
      ],
      V: [
        [true, false, true],
        [true, false, true],
        [true, false, true],
        [true, false, true],
        [false, true, false],
      ],
      W: [
        [true, false, true, false, true],
        [true, false, true, false, true],
        [true, false, true, false, true],
        [true, false, true, false, true],
        [false, true, false, true, false],
      ],
      X: [
        [true, false, true],
        [true, false, true],
        [false, true, false],
        [true, false, true],
        [true, false, true]
      ],
      Y: [
        [true, false, true],
        [true, false, true],
        [true, true, true],
        [false, true, false],
        [false, true, false],
      ],
      Z: [
        [true, true, true],
        [false, false, true],
        [false, true, false],
        [true, false, false],
        [true, true, true]
      ]
    },
    punctuation: {
      ".": [
        [false],
        [false],
        [false],
        [false],
        [true]
      ],
      "!": [
        [true],
        [true],
        [true],
        [false],
        [true]
      ],
      "?": [
        [true, true, false],
        [false, false, true],
        [false, true, false],
        [false, false, false],
        [false, true, false]
      ]
    }
  }
};

class Sprite extends EventEmitter {
  constructor (callback, config) {
    super();
    if (callback instanceof (async () => {}).constructor) throw new Error("callback of a Sprite may not be an asynchronous function");
    config = verify(config, {}, "config", false);
    Object.defineProperties(this, {
      callback: {
        value: verify(callback, Function, "callback"),
        writable: false,
        configurable: false,
        enumerable: true
      },
      preciseAxis: {
        value: verify.config(config, "preciseAxis", "neither"),
        writable: false,
        configurable: false,
        enumerable: true
      }
    });
    Object.defineProperties(this, {
      xRounder: {
        value: this.preciseAxis === "x" ? x => roundToNearest(x, 0.5) : Math.round,
        writable: false,
        configurable: false,
        enumerable: true
      },
      yRounder: {
        value: this.preciseAxis === "y" ? y => roundToNearest(y, 0.5) : Math.round,
        writable: false,
        configurable: false,
        enumerable: true
      }
    });
    if (config.hasOwnProperty("speed")) {
      this.speed = config.speed;
    }
  }
  draw (x = this.x, y = this.y, ...args) {
    if (this.showing && !this.terminal.clearMode) this.clear();
    this.#x = x;
    this.#y = y;
    this.callback(x, y, ...args);
    this.emit("draw", x, y);
  }
  clear () {
    if (this.showing) {
      const x = this.x;
      const y = this.y;
      const clearMode = this.terminal.clearMode;
      this.terminal.clearMode = true;
      this.draw(x, y, this.terminal.color.background);
      this.terminal.clearMode = clearMode;
      this.#x = undefined;
      this.#y = undefined;
      this.emit("clear", x, y);
    }
  }
  stop () {
    cancelAnimationFrame(this.#frameId);
    this.emit("stop", this.terminal.time);
  }
  move (x1, y1, x2, y2, t) {
    this.stop();
    x1 = verify(x1, Number, "x1");
    y1 = verify(y1, Number, "y1");
    x2 = verify(x2, Number, "x2");
    y2 = verify(y2, Number, "y2");
    if (this.speed == null) t = verify(t, Number, "t") * 1000
    else t = verify(t, distance(x1, y1, x2, y2) / this.speed, "t", false) * 1000;
    const xv = (x2 - x1) / t;
    const yv = (y2 - y1) / t;
    const start = this.terminal.time;
    const frame = () => {
      const timeElapsed = this.terminal.time - start;
      if (timeElapsed > t) {
        this.stop();
        //this.clear();
        this.draw(x2, y2);
        this.emit("frame");
        this.emit("moveEnded", x2, y2);
      }
      else {
        const x = this.xRounder(x1 + xv * timeElapsed);
        const y = this.yRounder(y1 + yv * timeElapsed);
        if (x !== this.x || y !== this.y) {
          //this.clear();
          this.draw(x, y);
        }
        this.#frameId = requestAnimationFrame(frame);
        this.emit("frame");
      }
    }
    this.#frameId = requestAnimationFrame(frame);
  }
  moveTo (x, y, t) {
    this.move(this.x, this.y, x, y, t);
  }
  moveRelative (dx, dy, t) {
    this.moveTo(this.x + dx, this.y + dy, t);
  }
  get x () { return this.#x; }
  get y () { return this.#y; }
  get showing () {
    return this.x !== undefined && this.y !== undefined && !this.terminal.tooBig;
  }
  get speed () {
    return this.#speed;
  } 
  set speed (speed) {
    this.#speed = verify(speed, Number, "speed");
  }
  callback;
  preciseAxis;
  xRounder;
  yRounder;
  #x;
  #y;
  #speed;
  #frameId;
};
class Box extends Sprite {
  constructor (width, height, config) {
    width = verify(width, Number, "width");
    height = verify(height, Number, "height");
    config = verify(config, {}, "config", false);
    config.preciseAxis = verify.config(config, "preciseAxis", "y")
    super((x, y) => {
      this.terminal.drawBox(x, y, width, height, config.color);
    }, config);
    Object.defineProperties(this, {
      width: {
        value: width,
        writable: false,
        configurable: false,
        enumerable: true
      },
      height: {
        value: height,
        writable: false,
        configurable: false,
        enumerable: true
      }
    })
  }
  touching (box, log = false) {
    if (!(box instanceof Box)) throw new TypeError("Box.touching requires argument of type Box, received type " + box.constructor.name);
    if (log) {
      this.terminal.log("this.x:%d this.y:%d this.width:%d this.height:%d", this.x, this.y, this.width, this.height)
      this.terminal.log("box.x:%d box.y:%d box.width:%d box.height:%d", box.x, box.y, box.width, box.height);
      this.terminal.log(box.x > this.x + this.width, box.x + box.width < this.x, box.y > this.y + this.height, box.y + box.height < this.y);
    }
    return !(box.x > this.x + this.width || box.x + box.width < this.x || box.y > this.y + this.height || box.y + box.height < this.y);
  }
  width;
  height;
}
class Menu extends Sprite {
  constructor (callback, options, style) {
    options = verify(options, Array, "options");
    const numbers = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    super((x, y, color) => {
      if (x < 0 || y < 0 || x + this.width >= this.terminal.width || y + this.height >= this.terminal.height) throw new RangeError("Menu cannot be outside terminal");
      //if (color) this.terminal.out.write(Color.getForegroundColor(color));
      this.#drawTop(color);
      this.terminal.write(this.borderChars.vertical, x, y + 1, color);
      let dx = this.borderChars.vertical.length;
      for (let i in options) {
        const option = ` ${numbers[i]}:${options[i]} ${this.borderChars.vertical}`;
        this.terminal.write(option, x + dx, y + 1, color);
        dx += option.length;
      }
      this.#drawBottom(color);
      if (!this.terminal.clearMode && !this.#open) {
        this.#open = true;
        for (let i in options) {
          this.terminal.on(numbers[i], () => {
            this.emit(numbers[i], i);
          });
          this.on(numbers[i], cb);
        }
      }
      else if (this.terminal.clearMode && this.#open) {
        this.#open = false;
        for (let i in options) {
          this.removeListener(numbers[i], cb);
        }
      }
      //if (color) this.terminal.color.refresh();
    });
    Object.defineProperties(this, {
      options: {
        value: options,
        writable: false,
        configurable: false,
        enumerable: true
      },
      style: {
        get: function () { // this.terminal is not set at initialization, so I cannot use it
          if (style == null) {
            style = this.terminal.borderStyle
            return style === "round" ? "light" : style;
          }
          else if (style === "round") throw new Error("Menus cannot have round borders");
          else if (!Terminal.BORDERS.hasOwnProperty(style)) throw new Error(`${style} is not a valid border style`);
          else return style;
        },
        writable: false,
        configurable: false,
        enumerable: true
      }
    });
    const cb = i => {
      for (let i in options) {
        this.removeListener(numbers[i], cb);
      }
      this.clear();
      callback(i);
    }
  }
  #drawTop = function (color) {
    this.#drawTopBottom({
      left: this.borderChars.topLeft,
      horizontal: this.borderChars.horizontal,
      connect: this.borderChars.horizontalDown,
      right: this.borderChars.topRight
    }, color, 0)
  }
  #drawBottom = function (color) {
    this.#drawTopBottom({
      left: this.borderChars.bottomLeft,
      horizontal: this.borderChars.horizontal,
      connect: this.borderChars.horizontalUp,
      right: this.borderChars.bottomRight
    }, color, 2)
  }
  #drawTopBottom = function (borders, color, dy) {
    this.terminal.write(borders.left, this.x, this.y + dy, color);
    let dx = this.borderChars.vertical.length;
    for (let i in this.options) {
      const horizontals = borders.horizontal.repeat(this.options[i].length + 4);
      this.terminal.write(horizontals, this.x + dx, this.y + dy, color);
      dx += horizontals.length;
      if (parseInt(i) === this.options.length - 1) {
        this.terminal.write(borders.right, this.x + dx, this.y + dy, color);
        dx += borders.right.length;
      }
      else {
        this.terminal.write(borders.connect, this.x + dx, this.y + dy, color);
        dx += borders.connect.length;
      }
    }
  }
  get width() {
    return this.borderChars.vertical.length + this.options.map(e => e.length + 4 + this.borderChars.vertical.length).reduce((a, b) => a + b)
  }
  get borderChars() {
    return Terminal.BORDERS[this.style];
  }
  get style() {}; // this is only here so style is in the prototype
  options;
  height = 3;
  #open = false;
}

module.exports = { Terminal, Sprite, Box, Menu };