# CMD Draw

A library that allows you to draw and animate on the command line. I created it to make [this](https://www.npmjs.com/package/command-line-pong) version of pong for the command line.

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

*__A quick note:__ npm's css makes this documentation somewhat difficult to read, it may be easier to read it on [github](https://github.com/liambloom/command-line-draw#readme).*

## Table of contents

  - [Class: `Terminal` ***Documentation incomplete***](#class-terminal)
    - [`new Terminal([config])`](#new-terminalconfig)
    - [`terminal.addSprite(sprite)`](#terminaladdSpritesprite)
    - [`terminal.bitmap(x, y[, color], ...matrixes)`](#terminalbitmapx-y-color-matrixes)
    - [`terminal.borderStyle`](#terminalborderstyle)
    - [`terminal.clear()`](#terminalclear)
    - [`terminal.color`](#terminalcolor)
    - [`terminal.drawBox(x, y, width, height[, color])`](#terminaldrawBoxx-y-width-height-color)
    - [`terminal.drawLine(x1, y1, x2, y2[, color][, thickness][, dashed][, dashThickness][, spaceColor])`](#terminaldrawLinex1-y1-x2-y2-color-thickness-dashed-dashThickness-spaceColor)
    - [`terminal.hasBorder`](#terminalhasborder)
    - [`terminal.height`](#terminalheight)
    - [`terminal.in`](#terminalin)
    - [`terminal.largestBorder`](#terminallargestborder)
    - [`terminal.log([data][, ...args])`](#terminallogdata-args)
    - [`terminal.out`](#terminalout)
    - [`terminal.sevenSegment(x, y, a, b, c, d, e, f, g[, color])`](#terminalsevensegmentx-y-a-b-c-d-e-f-g-color)
    - [`terminal.sevenSegmentToBitmap(a, b, c, d, e, f, g)`](#terminalsevensegmenttobitmapa-b-c-d-e-f-g)
    - [`terminal.time`](#terminaltime)
    - [`terminal.tooBig`](#terminaltoobig)
    - [`terminal.width`](#terminalwidth)
    - [`terminal.write(text, x, y[, color])`](#terminalwritetext-x-y-color)
    - [`terminal.writeLarge(text, x, y[, color])`](#terminalwriteLargetext-x-y-color)
  - [Class: `Sprite` ***Documentation missing***](#class-sprite)
  - [Class: `Box` ***Documentation missing***](#class-box)
  - [Class: `Menu` ***Documentation missing***](#class-menu)
  - [Class: `Color` ***Not Exported***](#class-color-not-exported)
    - [`new Color(out)`](#new-colorout)
    - [Static: `Color.getBackgroundColor(color)`](#static-colorgetbackgroundcolorcolor)
    - [Static: `Color.getForegroundColor(color)`](#static-colorgetforegroundcolorcolor)
    - [Static: `Color.RESET`](#static-colorreset)
    - [Event: `'change'`](#event-change)
    - [`color.background`](#colorbackground)
    - [`color.foreground`](#colorforeground)
    - [`color.refresh()`](#colorrefresh)
    - [`color.reset()`](#colorreset)
  - [Class `Margin` ***Documentation missing, Not Exported***](#class-margin-not-exported)
  - [Types](#types)
  - [More Info](#more-info)
    - [Borders](#borders)
    - [Colors](#colors)

---

## Class: `Terminal`

  - Extends: [`<EventEmitter>`](https://nodejs.org/api/events.html#events_class_eventemitter)

The terminal object represents the drawing space.

```js
const { Terminal } = require('command-line-draw');
```

### `new Terminal([config])`

#### Arguments

- `config` [`<Object>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

  - `in` [`<tty.ReadStream>`](https://nodejs.org/api/tty.html#tty_class_tty_readstream) Where the `Terminal` reads user input from. **Default:** `process.stdin`.
  - `out` [`<tty.WriteStream>`](https://nodejs.org/api/tty.html#tty_class_tty_writestream) Where the `Terminal` writes to. **Default:** `process.stdout`.
  - `width` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The width of the `Terminal`. **Default:** `terminal.out.columns - 2`.
  - `height` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The height of the `Terminal`. **Default:** `terminal.out.rows - 2`.
  - `border` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The border style of the terminal. See [here](#borders) for a list of valid border styles. **Default:** `'light'`.
  - `color` [`<Object>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `foreground` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The foreground color of the `Terminal`. See [here](#colors) for a list of valid colors. **Default:** `'black'`.
    - `background` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The background color of the `Terminal`. See [here](#colors) for a list of valid colors. **Default:** `'white'`.
  - `dev` [`<boolean>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Determines behavior of [`terminal.log()`](#terminal.logdata-args). **Default:** `false`.

Creates a new `Terminal` object.

```js
const { Terminal } = require('command-line-draw');

const terminal = new Terminal();
```

### `terminal.addSprite(sprite)`

  - `sprite` [`<Sprite>`](#class-sprite) Sprite to be added.

The `Sprite` cannot be used until it is added to a terminal. When the terminal is resized, sprites that were showing will automatically be redrawn. Has no affect if sprite is already on the terminal,

```js
const { Terminal, Sprite } = require('command-line-draw');

const terminal = new Terminal();
const mySprite = new Sprite((x, y) => { // See the Sprite class for instructions on how to use this constructor
  terminal.drawBox(x, y, 10, 10);
});

terminal.addSprite(mySprite);
mySprite.draw(0, 0);
```

### `terminal.bitmap(x, y[, color], ...matrixes)`

  - `x` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The x coordinate at which to print the bitmap.
  - `y` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The y coordinate at which to print the bitmap.
  - `color` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The color of the bitmap **Default:** `terminal.color.foreground`.
  - `matrixes` [`<boolean[][]>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Matrix(es) that represent the bitmap you want to print

Prints a series of bitmaps at a particular position. The bitmaps are a matrix of booleans. `true` prints `██` in the foreground color, false prints two spaces in the background color.

```js
const { Terminal } = require('command-line-draw');

const terminal = new Terminal();

terminal.bitmap(0, 0, [
  [true, true, true],
  [true, false, true],
  [true, false, true],
  [true, false, true],
  [true, true, true]
]); // Prints a large '0' in the command line
```

### `terminal.borderChars`

  - [`<string[]>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The characters the border is made up of. Equal to `Terminal.BORDERS[terminal.borderStyle]`

### `terminal.borderStyle`

  - [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A string representing the type of border the `terminal` has. See [here](#borders) for a list of valid border styles.

### `terminal.clear()`

Clears the entire terminal (including logged messages). The border remains visible. Any moving [`sprites`](#class-sprite) also stop and are cleared.

### `terminal.drawBox(x, y, width, height[, color])`

  - `x` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The x coordinate of the top-left corner of the box.
  - `y` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The y coordinate of the top-left corner of the box.
  - `width` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The width of the box.
  - `height` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The height of the box.
  - `color` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The color of the box **Default:** `terminal.color.foreground`.

Draws a box on the terminal. 

### `terminal.color`

  - [`<Color>`](#class-color)

A `Color` object containing information about the `terminal`'s color

### `terminal.drawLine(x1, y1, x2, y2[, color][, thickness][, dashed][, dashThickness][, spaceColor])`

  - `x1` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The x coordinate of the starting point on the line.
  - `y1` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The y coordinate of the starting point on the line.
  - `x2` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The x coordinate of the ending point on the line.
  - `y2` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The y coordinate of the ending point on the line.
  - `color` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The color of the line. **Default:** `terminal.color.foreground`.
  - `thickness` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The thickness of the line. **Default:** `1`.
  - `dashed` [`<boolean>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) When `true`, the line will be dashed (alternating between the `foreground` and `background` color). **Default:** `false`.
  - `dashThickness` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) How thick the dash will be. (e.g, if this is `1`, the dash will look like this: `█ █ █ █`.) **Default:** `0.5`.
  - `spaceColor` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The color of the spaces between the dashes in a dashed line. **Default:** `terminal.color.background`.

Draws a line from point `(x1, y1)` to point `(x2, y2)`. Currently, only vertical and horizontal lines are supported, but not diagonals. The coordinates can be decimals, they will be rounded to the nearest `0.5`. Unfortunately, you can only have decimal coordinates on one axis. 

```js
const { Terminal } = require('command-line-draw');

const terminal = new Terminal();
terminal.drawLine(0, 1.5, 10, 1.5); // Draws a line from (0, 1.5) to (10, 1.5)
```

### `terminal.hasBorder`

  - [`<boolean>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

`true` if `terminal.borderStyle === 'none'`. Otherwise it is `false`.

### `terminal.height`

  - [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The height of the `terminal`.

### `terminal.in`

  - [`<tty.ReadStream>`](https://nodejs.org/api/tty.html#tty_class_tty_readstream)

The input for the `terminal`.

### `terminal.largestBorder`

  - [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The widest of `terminal.borderChars.vertical`, `terminal.borderChars.topLeft`, `terminal.borderChars.bottomLeft`. If `terminal.borderStyle === 'solid'`, it returns `2`, if `terminal.borderStyle === 'none'`, it returns `0`, otherwise it returns `1`.

### `terminal.log([data][, ...args])`

  - `data` [`<any>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) The data to be printed
  - `...args` [`<any>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Values to be added to the data

If `terminal.dev === true`, this method prints to `terminal.out` with a new line. If it is false, nothing is printed. Logged messages are not reprinted when the terminal is cleared. See [`console.log()`](https://nodejs.org/api/console.html#console_console_log_data_args) for more details. 

### `terminal.out`.

  - [`<tty.WriteStream>`](https://nodejs.org/api/tty.html#tty_class_tty_writestream)

The output for the `terminal`

### `terminal.sevenSegment(x, y, a, b, c, d, e, f, g[, color])`

  - `x` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The x coordinate at at which to write the seven segment display
  - `y` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The y coordinate at at which to write the seven segment display
  - `a`-`g` [`<boolean>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Boolean values representing each [segment](https://www.rogdham.net/media/correspondance_7seg.png) of the a seven segment display.

Prints a a seven segment display to the terminal. It is 5 characters tall and 6 wide (each segment is 2 characters wide).

```js
const { Terminal } = require('command-line-draw');

const terminal = new Terminal();
terminal.sevenSegment(0, 0, true, true, true, true, true, true, false); // Prints '0', although there multiple easier ways to do this
```

### `terminal.sevenSegmentToBitmap(a, b, c, d, e, f, g)`

  - `a`-`g` [`<boolean>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Boolean values representing each [segment](https://www.rogdham.net/media/correspondance_7seg.png) of the a seven segment display.
  - Returns: [`<boolean[][]>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Turns seven boolean values (representing the seven [segments](https://www.rogdham.net/media/correspondance_7seg.png) of a seven segment display) and returns a boolean matrix (2D [`<Array>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)) representing each pixel on a 5x3 grid to display the given values.

```js
const { Terminal } = require('command-line-draw');

const terminal = new Terminal();

const myBooleanMatrix = terminal.sevenSegmentDisplay(true, true, true, true, true, true, false);
terminal.bitmap(0, 0, myBooleanMatrix); // Prints '0', although there multiple easier ways to do this
```

### `terminal.time`

  - [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

Returns a time (high resolution time in milliseconds, same as [`performance.now()`](https://nodejs.org/api/perf_hooks.html#perf_hooks_performance_now)). The time does not increase when `terminal.tooBig === true`. It is recommended that you use this to time any animations on the `terminal`.

### `terminal.tooBig`

  - [`<boolean>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

Returns `true` when the `terminal`'s width and height exceed the actual size of the user's command line. Nothing will be drawn until the user's command line becomes larger.

### `terminal.width`

  - [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The width of the `terminal`.

### `terminal.write(text, x, y[, color])`

  - `text` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The text to be written to the terminal.
  - `x` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The x coordinate at which to print the text.
  - `y` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The y coordinate at which to print the text.
  - `color` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The color of the text **Default:** `terminal.color.foreground`.

Writes text to the terminal at a particular position. If the text is too long and goes outside the terminal, it will not wrap, it will instead throw an error.

### `terminal.writeLarge(text, x, y[, color])`

  - `text` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The text to be written to the terminal.
  - `x` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The x coordinate at which to print the text.
  - `y` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The y coordinate at which to print the text.
  - `color` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The color of the text **Default:** `terminal.color.foreground`.

Prints large text to the terminal at a particular position. Each character is a seven segment display with a 2 character space between characters and 6 character space between words. Allowed characters are letters, numbers, and basic punctuation (`.!?`).

```js
const { Terminal } = require('command-line-draw');

const terminal = new Terminal({
  dev: true // Do not use this in production, as logging is a simple debugging tool and may not produce desireable results
});

terminal.log('Hello World');
```

---

***`Terminal` class documentation is incomplete***

## Class: `Sprite`

  - Extends: [`<EventEmitter>`](https://nodejs.org/api/events.html#events_class_eventemitter)

***`Sprite` class has not yet been documented***

## Class: `Box`

  - Extends: [`<Sprite>`](#class-sprite)

***`Box` class has not yet been documented***

## Class: `Menu`

  - Extends: [`<Sprite>`](#class-sprite)

***`Menu` class has not yet been documented***

## Class: `Color` *Not Exported*

  - Extends: [`<EventEmitter>`](https://nodejs.org/api/events.html#events_class_eventemitter)

The class `Color` is not exported, however, [`terminal.color`](#terminalcolor) is an instance of it, so its properties and methods are still available to you.

### `new Color(out)`

  - `out` [`<tty.WriteStream>`](https://nodejs.org/api/tty.html#tty_class_tty_writestream) The stream to add colors to.

Creates a new `Color` object.

```js
const { Terminal } = require('command-line-draw');

const terminal = new Terminal();

const Color = terminal.color.constructor
const color = new Color(process.stdout); // There is literally no reason ever to do this
```

### Static: `Color.getBackgroundColor(color)`

  - `color` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The name of a color. See [here](#colors) for a list of valid colors.
  - Returns: [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A node.js color escape code. You can find a list of those [here](https://stackoverflow.com/a/41407246).

Returns the color code associated width the `color` you enter.

```js
const { Terminal } = require('command-line-draw');

const terminal = new Terminal();
terminal.color.constructor.getBackgroundColor('black'); // => '\x1b40m'
```

### Static: `Color.getForegroundColor(color)`

  - `color` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The name of a color. See [here](#colors) for a list of valid colors.
  - Returns: [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A node.js color escape code. You can find a list of those [here](https://stackoverflow.com/a/41407246).

Returns the color code associated width the `color` you enter.

```js
const { Terminal } = require('command-line-draw');

const terminal = new Terminal();
terminal.color.constructor.getForegroundColor('black'); // => '\x1b30m'
```

### Static: `Color.RESET`

  - [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The node.js escape code that clears all formatting from the console (`'\x1b[0m'`).

### Event: `'change'`

The `'change'` event is emitted whenever `color.reset()` is run or `color.foreground` or `color.background` are set

### `color.background`

  - [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`<undefined>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

The name of the current background color of the terminal. Is settable. See a list of valid color names [here](#colors).

### `color.foreground`

  - [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) | [`<undefined>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type)

The name of the current foreground color of the terminal. Is settable. See a list of valid color names [here](#colors).

### `color.refresh()`

Clears formatting, then reapplies `this.foreground` and `this.background` colors.

### `color.reset()`

Resets `this.foreground` and `this.background` to `undefined`

## Class: `Margin` *Not Exported*

***`Menu` class has not yet been documented***

## Types

A type deceleration file has been included at [`./lib/cmdDraw.d.ts`](https://github.com/liambloom/command-line-draw/blob/master/lib/cmdDraw.d.ts). I tried, but I do not know typescript, so it likely has mistakes. If you find them, please report them at the github [issues page](https://github.com/liambloom/command-line-draw/issues).

## More Info

### Borders
  - `'light'` **(Default)**
  - `'heavy'`
  - `'double'`
  - `'round'`
  - `'solid'`
  - `'none'`

### Colors
  - ![#000000](https://placehold.it/15/000000?text=+) `black`
  - ![#ff0000](https://placehold.it/15/ff0000?text=+) `red`
  - ![#00ff00](https://placehold.it/15/00ff00?text=+) `green`
  - ![#ffff00](https://placehold.it/15/ffff00?text=+) `yellow`
  - ![#0000ff](https://placehold.it/15/0000ff?text=+) `blue`
  - ![#ff00ff](https://placehold.it/15/ff00ff?text=+) `magenta`
  - ![#00ffff](https://placehold.it/15/00ffff?text=+) `cyan`
  - ![#ffffff](https://placehold.it/15/ffffff?text=+) `white`