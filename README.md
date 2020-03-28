# CMD Draw

![](https://badgen.net/npm/v/command-line-draw)
![](https://badgen.net/badge/node/>=12.0.0/green)
![](https://badgen.net/npm/dt/command-line-draw)
![](https://badgen.net/badge/licence/MIT)

# Installation

```
$ npm i command-line-draw
```

# Documentation (Incomplete)

There are 4 classes exported by this module, and this section contains documentation for all 4.

## Class: `Terminal`

The terminal object represents the drawing space.

```js
const { Terminal } = require("command-line-draw");
```

### `new Terminal([config])`

#### Arguments

- `config` [`<Object>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

  - `in` [`<tty.ReadStream>`](https://nodejs.org/api/tty.html#tty_class_tty_readstream) Where the `Terminal` reads user input from. **Default:** `process.stdin`.
  - `out` [`<tty.WriteStream>`](https://nodejs.org/api/tty.html#tty_class_tty_writestream) Where the `Terminal` writes to. **Default:** `process.stdout`.
  - `width` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The width of the `Terminal`. **Default:** `terminal.out.columns - 2`.
  - `height` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The height of the `Terminal`. **Default:** `terminal.out.rows - 2`.
  - `border` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The border style of the terminal. See [here](#borders) for a list of valid border styles. **Default:** `"light"`.
  - `color` [`<Object>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `foreground` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The foreground color of the `Terminal`. See [here](#colors) for a list of valid colors. **Default:** `"black"`.
    - `background` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The background color of the `Terminal`. See [here](#colors) for a list of valid colors. **Default:** `"white"`.
  - `dev` [`<boolean>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Determines behavior of [`terminal.log()`](#terminal.log[data][-args]). **Default:** `false`.

Creates a new `Terminal` object.

```js
const { Terminal } = require("command-line-draw");

const terminal = new Terminal();
```

### `terminal.drawLine(x1, y1, x2, y2[, color][, thickness][, dashed][, dashThickness][, spaceColor])`

  - `x1` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The x coordinate of the starting point on the line.
  - `y1` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The y coordinate of the starting point on the line.
  - `x2` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The x coordinate of the ending point on the line.
  - `y2` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The y coordinate of the ending point on the line.
  - `color` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The color of the line. **Default:** `terminal.color.foreground`.
  - `thickness` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The thickness of the line. **Default:** `1`.
  - `dashed` [`<boolean>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) When `true`, the line will be dashed (alternating between the `foreground` and `background` color). **Default:** `false`.
  - `dashThickness` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) How thick the dash will be. (e.g, if this is `1`, the dash will look like this: `█ █ █ █`.) **Default:** `0.5`.
  - `spaceColor` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The color of the spaces between the dashes in a dashed line. **Default:** `terminal.color.background`.

Draws a line from point `(x1, y1)` to point `(x2, y2)`. Currently, only vertical and horizontal lines are supported, but not diagonals. The coordinates can be decimals, they will be rounded to the nearest `0.5`. Unfortunately, you can only have decimal coordinates on one axis. 

```js
const { Terminal } = require("command-line-draw");

const terminal = new Terminal();
terminal.drawLine(0, 1.5, 10, 1.5); // Draws a line from (0, 1.5) to (10, 1.5)
```

### `terminal.drawBox(x, y, width, height[, color])`

  - `x` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The x coordinate of the top-left corner of the box.
  - `y` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The y coordinate of the top-left corner of the box.
  - `width` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The width of the box.
  - `height` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The height of the box.
  - `color` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The color of the box **Default:** `terminal.color.foreground`.

Draws a box on the terminal. 

```js
const { Terminal } = require("command-line-draw");

const terminal = new Terminal();
terminal.drawBox(0, 0, 10, 10); // Draws a 10x10 box with the top left corner at (0, 0)
```

### `terminal.write(text, x, y[, color])

  - `text` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The text to be written to the terminal.
  - `x` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The x coordinate at which to print the text.
  - `y` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The y coordinate at which to print the text.
  - `color` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The color of the text **Default:** `terminal.color.foreground`.

Writes text to the terminal at a particular position. If the text is too long and goes outside the terminal, it will not wrap, it will instead throw an error.

```js
const { Terminal } = require("command-line-draw");

const terminal = new Terminal();
terminal.write("Hello World", 0, 0); // Writes "Hello World" at (0, 0)
```

### `terminal.clear()`

Clears the entire terminal (including logged messages). The border remains visible. Any moving [`sprites`](#class:-sprite) also stop and are cleared.

```js
const { Terminal } = require("command-line-draw");

const terminal = new Terminal();
terminal.clear();
```

### `terminal.addSprite(sprite)`

  - `sprite` [`<Sprite>`](#class-sprite) Sprite to be added.

The `Sprite` cannot be used until it is added to a terminal. When the terminal is resized, sprites that were showing will automatically be redrawn. Has no affect if sprite is already on the terminal,

```js
const { Terminal, Sprite } = require("command-line-draw");

const terminal = new Terminal();
const mySprite = new Sprite((x, y) => { // See the Sprite class for instructions on how to use this constructor
  terminal.drawBox(x, y, 10, 10);
});

terminal.addSprite(mySprite);
mySprite.draw(0, 0);
```

### `terminal.sevenSegment(x, y, a, b, c, d, e, f, g[, color])`

  - `x` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The x coordinate at at which to write the seven segment display
  - `y` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The y coordinate at at which to write the seven segment display
  - `a`-`g` [`<boolean>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Boolean values representing each [segment](https://www.rogdham.net/media/correspondance_7seg.png) of the a seven segment display.

Prints a a seven segment display to the terminal. It is 5 characters tall and 6 wide (each segment is 2 characters wide)

```js
const { Terminal } = require("command-line-draw");

const terminal = new Terminal();
terminal.sevenSegment(0, 0, true, true, true, true, true, true, false); // Prints "0", although there multiple easier ways to do this
```

### `terminal.sevenSegmentToBitmap(a, b, c, d, e, f, g)`

  - `a`-`g` [`<boolean>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Boolean values representing each [segment](https://www.rogdham.net/media/correspondance_7seg.png) of the a seven segment display.
  - Returns: [`<boolean[][]>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Turns seven boolean values (representing the seven [segments](https://www.rogdham.net/media/correspondance_7seg.png) of a seven segment display) and returns a boolean matrix (2D [`<Array>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)) representing each pixel on a 5x3 grid to display the given values

```js
const { Terminal } = require("command-line-draw");

const terminal = new Terminal();

const myBooleanMatrix = terminal.sevenSegmentDisplay(true, true, true, true, true, true, false);
terminal.bitmap(0, 0, myBooleanMatrix); // Prints "0", although there multiple easier ways to do this
```

### `terminal.log([data][, ...args])`

  - `data` [`<any>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) The data to be printed
  - `...args` [`<any>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Values to be added to the data

If `terminal.dev === true`, this method prints to `terminal.out` with a new line. If it is false, nothing is printed. Logged messages are not reprinted when the terminal is cleared. See [`console.log()`](https://nodejs.org/api/console.html#console_console_log_data_args) for more details. 

```js
const { Terminal } = require("command-line-draw");

const terminal = new Terminal({
  dev: true // Do not use this in production, as logging is a simple debugging tool and may not produce desireable results
});

terminal.log("Hello World");
```
---

***`Terminal` class documentation is incomplete***

## class: `Sprite`

***`Sprite` class has not yet been documented***

## class: `Box`

***`Box` class has not yet been documented***

## class: `Menu`

***`Menu` class has not yet been documented***

## Types

A type deceleration file has been included at [`./lib/cmdDraw.d.ts`](https://github.com/liambloom/command-line-draw/blob/master/lib/cmdDraw.d.ts). I tried, but I do not know typescript, so it likely has mistakes. If you find them, please report them at the github [issues page](https://github.com/liambloom/command-line-draw/issues).

## More Info
### Borders
  - `"light"` **(Default)**
  - `"heavy"`
  - `"double"`
  - `"round"`
  - `"solid"`
  - `"none"`

### Colors
  - ![#000000](https://placehold.it/15/000000?text=+) `black`
  - ![#ff0000](https://placehold.it/15/ff0000?text=+) `red`
  - ![#00ff00](https://placehold.it/15/00ff00?text=+) `green`
  - ![#ffff00](https://placehold.it/15/ffff00?text=+) `yellow`
  - ![#0000ff](https://placehold.it/15/0000ff?text=+) `blue`
  - ![#ff00ff](https://placehold.it/15/ff00ff?text=+) `magenta`
  - ![#00ffff](https://placehold.it/15/00ffff?text=+) `cyan`
  - ![#ffffff](https://placehold.it/15/ffffff?text=+) `white`