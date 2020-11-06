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

# Documentation

There are 4 classes exported by this module, and this section contains documentation for all 4. 

*__A quick note:__ npm's styling makes this documentation somewhat difficult to read, it may be easier to read it on [github](https://github.com/liambloom/command-line-draw#readme).*

## Table of contents

  - [Class: `Terminal`](#class-terminal)
    - [`new Terminal([config])`](#new-terminalconfig)
    - [Static: `Terminal.BORDERS`](#static-terminalborders)
    - [Static: `Terminal.BOTTOM`](#static-terminalbottom)
    - [Static: `Terminal.FULL`](#static-terminalfull)
    - [Static: `Terminal.LEFT`](#static-terminalleft)
    - [Static: `Terminal.RIGHT`](#static-terminalright)
    - [Static: `Terminal.TOP`](#static-terminaltop)
    - [Static: `Terminal.bitmapPresets`](#static-terminalbitmappresets)
      - [Static: `Terminal.bitmapPresets.letters`](#static-terminalbitmappresetsletters)
      - [Static: `Terminal.bitmapPresets.punctuation`](#static-terminalbitmappresetspunctuation)
    - [Static: `Terminal.sevenSegmentPresets`](#static-terminalsevensegmentpresets)
      - [Static: `Terminal.sevenSegmentPresets.numbers`](#static-terminalsevensegmentpresetsnumbers)
    - [Event: `'<keyName>'`](#event-keyname)
    - [Event: `'resize'`](#event-resize)
    - [`terminal.addSprite(sprite)`](#terminaladdSpritesprite)
    - [`terminal.bitmap(x, y[, color], ...matrixes)`](#terminalbitmapx-y-color-matrixes)
    - [`terminal.borderChars`](#terminalborderchars)
    - [`terminal.borderStyle`](#terminalborderstyle)
    - [`terminal.clear()`](#terminalclear)
    - [`terminal.color`](#terminalcolor)
    - [`terminal.dev`](#terminaldev)
    - [`terminal.drawBox(x, y, width, height[, color])`](#terminaldrawBoxx-y-width-height-color)
    - [`terminal.drawLine(x1, y1, x2, y2[, color][, thickness][, dashed][, dashThickness][, spaceColor])`](#terminaldrawLinex1-y1-x2-y2-color-thickness-dashed-dashThickness-spaceColor)
    - [`terminal.hasBorder`](#terminalhasborder)
    - [`terminal.height`](#terminalheight)
    - [`terminal.in`](#terminalin)
    - [`terminal.largestBorder`](#terminallargestborder)
    - [`terminal.log([data][, ...args])`](#terminallogdata-args)
    - [`terminal.margin`](#terminalmargin)
    - [`terminal.out`](#terminalout)
    - [`terminal.sevenSegment(x, y, a, b, c, d, e, f, g[, color])`](#terminalsevensegmentx-y-a-b-c-d-e-f-g-color)
    - [`terminal.sevenSegmentToBitmap(a, b, c, d, e, f, g)`](#terminalsevensegmenttobitmapa-b-c-d-e-f-g)
    - [`terminal.time`](#terminaltime)
    - [`terminal.tooBig`](#terminaltoobig)
    - [`terminal.width`](#terminalwidth)
    - [`terminal.write(text, x, y[, color])`](#terminalwritetext-x-y-color)
    - [`terminal.writeLarge(text, x, y[, color])`](#terminalwritelargetext-x-y-color)
  - [Class: `Sprite`](#class-sprite)
    - [`new Sprite(callback[, config])`](#new-spritecallback-config)
    - [`sprite.callback`](#spritecallback)
    - [`sprite.clear()`](#spriteclear)
    - [`sprite.draw(x, y[, ...args])`](#spritedrawx-y-args)
    - [`sprite.move(x1, y1, x2, y2[, t])`](#spritemovex1-y1-x2-y2-t)
    - [`sprite.moveRelative(dx, dy[, t])`](#spritemoverelativedx-dy-t)
    - [`sprite.moveTo(x, y[, t])`](#spritemovetox-y-t)
    - [`sprite.showing`](#sprite.showing)
    - [`sprite.speed`](#spritespeed)
    - [`sprite.stop()`](#spritestop)
    - [`sprite.x`](#spritex)
    - [`sprite.xRounder`](#spritexrounder)
    - [`sprite.y`](#spritey)
    - [`sprite.yRounder`](#spriteyrounder)
  - [Class: `Box`](#class-box)
    - [`new Box(width, height, config)`](#new-boxwidth-height-config)
    - [`box.height`](#boxheight)
    - [`box.touching(box)`](#boxtouchingbox)
    - [`box.width`](#boxwidth)
  - [Class: `Menu`](#class-menu)
    - [`new Menu(callback, options[, style])`](#new-menucallback-options-style)
    - [`menu.borderChars`](#menuborderchars)
    - [`menu.height`](#menuheight)
    - [`menu.options`](#menuoptions)
    - [`menu.style`](#menustyle)
    - [`menu.width`](#menuwidth)
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
  - [Class `Margin` ***Not Exported***](#class-margin-not-exported)
    - [`new Margin(out, width, height)`](#new-marginout-width-height)
    - [`margin.lr`](#marginlr)
    - [`margin.tb`](#margintb)
  - [Types ![ts](./img/ts-def-18.png)](#types)
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

### Static: `Terminal.BORDERS`

  - [`<Object>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

An object containing several [unicode box drawing characters](https://en.wikipedia.org/wiki/Box-drawing_character#Unicode), sorted into different [border types](#borders)

### Static: `Terminal.BOTTOM`

  - [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A constant equal to the unicode character [U+2584 (Lower half block)](https://www.fileformat.info/info/unicode/char/2584/index.htm).

### Static: `Terminal.FULL`

  - [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A constant equal to the unicode character [U+2588 (Full block)](https://www.fileformat.info/info/unicode/char/2588/index.htm).

### Static: `Terminal.LEFT`

  - [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A constant equal to the unicode character [U+258C (Left half block)](https://www.fileformat.info/info/unicode/char/258c/index.htm)

### Static: `Terminal.RIGHT`

  - [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A constant equal to the unicode character [U+2590 (Right half block)](https://www.fileformat.info/info/unicode/char/2590/index.htm)

### Static: `Terminal.TOP`

  - [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

A constant equal to the unicode character [U+2580 (Upper half block)](https://www.fileformat.info/info/unicode/char/2580/index.htm).

### Static: `Terminal.bitmapPresets`

  - [`<Object>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

An object containing [`boolean[][]`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)s that can be passed into [`terminal.bitmap()`](#terminalbitmapx-y-color-matrixes) to print letters and punctuation.

```js
const { Terminal } = require("command-line-draw");

const terminal = new Terminal();
terminal.bitmap(0, 0, ...Terminal.bitmapPresets.letters.A);
```

### Static: `Terminal.bitmapPresets.letters`

  - [`<Object>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

An object containing letters that can be passed into [`terminal.bitmap()`](#terminalbitmapx-y-color-matrixes). They are indexed `"A"`-`"Z"`.

```js
const { Terminal } = require("command-line-draw");

const terminal = new Terminal();
terminal.bitmap(0, 0, ...Terminal.bitmapPresets.letters.A); // Prints a large letter "A" to the terminal
```

### Static: `Terminal.bitmapPresets.punctuation`

  - [`<Object>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

An object containing punctuation that can be passed into [`terminal.bitmap()`](#terminalbitmapx-y-color-matrixes). Included punctuation is `"."`, `"?"`, and `"!"`.

```js
const { Terminal } = require("command-line-draw");

const terminal = new Terminal();
terminal.bitmap(0, 0, ...Terminal.bitmapPresets.punctuation["!"]); // Prints a large exclamation point to the terminal
```

### Static: `Terminal.sevenSegmentPresets`

  - [`<Object>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

An object containing [`boolean[]`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)s that, using the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), can be passed into [`terminal.sevenSegment()`](#terminalsevensegmentx-y-a-b-c-d-e-f-g-color) or [`terminal.sevenSegmentToBitmap()`](#terminalsevensegmenttobitmapa-b-c-d-e-f-g).

```js
const { Terminal } = require("command-line-draw");

const terminal = new Terminal();
terminal.sevenSegment(0, 0, ...Terminal.sevenSegmentPresets.numbers[0]); // Prints a large number 0 to the terminal
```

### Static: `Terminal.sevenSegmentPresets.numbers`

  - [`<Object>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

An object containing [`boolean[]`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)s that, using the [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), can be passed into [`terminal.sevenSegment()`](#terminalsevensegmentx-y-a-b-c-d-e-f-g-color) or [`terminal.sevenSegmentToBitmap()`](#terminalsevensegmenttobitmapa-b-c-d-e-f-g). They are indexed `"0"`-`"9"`.

```js
const { Terminal } = require("command-line-draw");

const terminal = new Terminal();
terminal.sevenSegment(0, 0, ...Terminal.sevenSegmentPresets.numbers[0]);
```

### Event: `'<keyName>'`

On all key presses, with the exception of `ctrl+c`, an event is emitted. The implementation is as follows:

```js
terminal.in.on("keypress", (chunk, key) => {
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
```

For example, if the user were to press the up arrow, the event `'up'` would be emitted. If they held shift while pressing up, the event `'shift+up'` would be emitted.

### Event: `'resize'`

The `'resize'` event is emitted whenever `terminal.out` is resized.

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

  - [`<Object>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

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

### `terminal.dev`

  - [`<boolean>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

When `false`, [`terminal.log()`](#terminallogdata-args) has no affect. 

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

### `terminal.margin`

  - [`<Margin>`](#class-margin-not-exported)

A `Margin` object containing information about the `terminal`'s margin

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

### `terminal.write(text, x, y[, color][, backgroundColor])`

  - `text` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The text to be written to the terminal.
  - `x` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The x coordinate at which to print the text.
  - `y` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The y coordinate at which to print the text.
  - `color` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The color of the text **Default:** `terminal.color.foreground`.
  - `backgroundColor` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The background color of the text **Default:** `terminal.color.background`.

Writes text to the terminal at a particular position. If the text is too long and goes outside the terminal, it will not wrap, it will instead throw an error.

### `terminal.writeLarge(text, x, y[, color])`

  - `text` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The text to be written to the terminal.
  - `x` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The x coordinate at which to print the text.
  - `y` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The y coordinate at which to print the text.
  - `color` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The color of the text **Default:** `terminal.color.foreground`.

Prints large text to the terminal at a particular position. Each character is a seven segment display with a 2 character space between characters and 6 character space between words. Allowed characters are letters, numbers, and basic punctuation (`.!?`).

```js
const { Terminal } = require('command-line-draw');

const terminal = new Terminal({
  dev: true // Do not use this in production, as logging is a simple debugging tool and may not produce desireable results
});

terminal.log('Hello World');
```

## Class: `Sprite`

  - Extends: [`<EventEmitter>`](https://nodejs.org/api/events.html#events_class_eventemitter)

### `new Sprite(callback[, config])`

  - `callback` [`<Function>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) This callback is called to draw the shape
    - `x` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The x coordinate that the `sprite` should be drawn at.
    - `y` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The y coordinate that the `sprite` should be drawn at.
    - `...args` [`<any>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Any other arguments passed into the callback.
  - `config` [`<Object>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preciseAxis` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'x'`, `'y'`, or `'neither'`. The axis to use decimal coordinates on. **Default:** `'neither'`.
    - `speed` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [`<undefined>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The speed the `sprite` should move if a time is not provided in [`sprite.move()`](#spritemovex1-y1-x2-y2-t).

### `sprite.callback`

  - [`<Function>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

The callback that was passed into the [constructor](#new-spritecallback-config)

Creates a new `sprite` object.

```js
const { Terminal, Sprite } = require("command-line-draw");

const terminal = new Terminal();
const mySprite = new Sprite((x, y) => {
  terminal.drawBox(x, y, 10, 10);
});

terminal.addSprite(mySprite);
sprite.draw(0, 0); // Draws a 10x10 box at (0, 0)
```

### `sprite.clear()`

Clears the sprite from the terminal.

### `sprite.draw(x, y[, ...args])`

  - `x` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The x coordinate to draw the `sprite` at. This is passed into [`sprite.callback`](#spritecallback).
  - `y` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The y coordinate to draw the `sprite` at. This is passed into [`sprite.callback`](#spritecallback).
  - `...args` [`<any>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Data_types) Other arguments to pass into [`sprite.callback`](#spritecallback).

Calls [`sprite.callback`](#spritecallback) in order to draw the `sprite`.

### `sprite.move(x1, y1, x2, y2[, t])`

  - `x1` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The x position for the box to start at.
  - `y1` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The y position for the box to start at.
  - `x2` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The x position for the box to end at.
  - `y2` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The y position for the box to end at.
  - `t` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The time (in seconds) that the movement should take. **Default:** `distance / terminal.speed * 1000`. *Required if `this.speed === undefined`*.

Moves the `sprite` from (x1, y1) to (x2, y2).

```js
const { Terminal, Sprite } = require("command-line-draw");

const terminal = new Terminal();
const mySprite = new Sprite((x, y) => {
  terminal.drawBox(x, y, 10, 10);
});

terminal.addSprite(mySprite);
sprite.move(0, 0, 10, 10, 2); // Moves the sprite from (0, 0) to (10, 10) in 2 seconds
```

### `sprite.moveRelative(dx, dy[, t])`

  - `dx` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The distance to move on the x axis (can be negative).
  - `dy` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The distance to move on the y axis (can be negative).
  - `t` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The time (in seconds) that the movement should take. **Default:** `distance / terminal.speed * 1000`. *Required if `this.speed === undefined`*.

Move the `sprite` to a new position relative to it's current position. Or, in simple english, moves it a certain distance from its current position.

### `sprite.moveTo(x, y[, t])`

  - `x` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The x position to move to.
  - `y` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The y position to move to.
  - `t` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The time (in seconds) that the movement should take. **Default:** `distance / terminal.speed * 1000`. *Required if `this.speed === undefined`*.

Moves the `sprite` from its current position to the new (x, y) position.

### `sprite.preciseAxis`

  - [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The precise axis passed into the config in the [constructor](#new-spritecallback-config).

### `sprite.showing`

  - [`<boolean>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type)

A boolean indicating if the `sprite` is currently viable.

### `sprite.speed`

  - [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The current speed of the `sprite`. Is only used by [`sprite.move()`](#spritemovex1-y1-x2-y2-t) if `time` is not provided.

### `sprite.stop()`

Stops the `sprite` if it is moving. No effect if the sprite isn't currently moving.

### `sprite.x`

  - [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The current x position of the `sprite`

### `sprite.xRounder`

  - [`<Function>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

The function that rounds the x position. If `sprite.preciseAxis === 'x'`, this is a function that rounds to the nearest `0.5`, otherwise it is equal to [Math.round()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round)

### `sprite.y`

  - [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The current y position of the `sprite`

### `sprite.yRounder`

  - [`<Function>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)

The function that rounds the y position. If `sprite.preciseAxis === 'y'`, this is a function that rounds to the nearest `0.5`, otherwise it is equal to [Math.round()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round)

## Class: `Box`

  - Extends: [`<Sprite>`](#class-sprite)

### `new Box(width, height, config)`

  - `width` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The width of the box.
  - `height` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The height of the box.
  - `config` [`<Object>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `preciseAxis` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) `'x'`, `'y'`, or `'neither'`. The axis to use decimal coordinates on. **Default:** `'y'`.
    - `speed` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) | [`<undefined>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Undefined_type) The speed the `sprite` should move if a time is not provided in [`sprite.move()`](#spritemovex1-y1-x2-y2-t).

Creates a new `box` object. A `box` is a `sprite` where the callback draws a box of a particular `width` and `height` on the canvas.

```js
const { Terminal, Box } = require("command-line-draw");

const terminal = new Terminal();
const myBox = new Box(10, 10);

terminal.addSprite(myBox);
myBox.draw(0, 0); // Draws a 10x10 box at (0, 0)
```

### `box.height`

  - [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The height passed into the constructor. It is readonly, meaning it cannot be set.

### `box.touching(box)`

  - `box` [`<Box>`](#class-box) The box to check the position against.

Checks if two boxes are touching.

```js
const { Terminal, Box } = require("command-line-draw");

const terminal = new Terminal();
const box1 = new Box(5, 5);
const box2 = new Box(5, 5);

terminal.addSprite(box1);
terminal.addSprite(box2);

box1.draw(0, 0);
box2.draw(5, 0);

box1.touching(box2); // true, the boxes are touching
```

### `box.width`

  - [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The width passed into the constructor. It is readonly, meaning it cannot be set.

## Class: `Menu`

  - Extends: [`<Sprite>`](#class-sprite)

### `new Menu(callback, options[, style])`

  - `callback` [`<Function>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function) The function called when a menu option is selected
    - `i` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The index of the menu option selected
  - `options` [`<string[]>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) A list of menu options
  - `style` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The style of the border. It can be any style on [this list](#borders) except for `'none'` or `'solid'`. **Default:** `terminal.borderStyle`, or `'light'` if that is invalid.

Creates a new `menu` object. A menu can be drawn and allows the user to select an option from your list of `options`. When the user selects an option, the menu is cleared and the callback is run with the argument `i` being the index of the selected option.

```js
const { Terminal, Menu } = require("command-line-draw");

const terminal = new Terminal();
const myMenu = new Menu(i => {
  // Do something here
}, [
  "First option",
  "Option 2",
  "The 3rd option",
  "Option D"
]);

terminal.addSprite(myMenu);
myMenu.draw(0, 0);

/**
 * Prints:
 * ┌────────────────┬────────────┬──────────────────┬────────────┐
 * │ 1:First option │ 2:Option 2 │ 3:The 3rd option │ 4:Option D │
 * └────────────────┴────────────┴──────────────────┴────────────┘
 * 
 * When an option is selected, this is removed and callback is called.
 * For example, if the user presses 1, the first option, at index 0, was selected.
 * This means that callback(0) is called.
 */ 
```

### `menu.borderChars`

  - [`<Object>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The characters the border is made up of. Equal to `Terminal.BORDERS[menu.style]`. If accessed before this is added to a terminal, it will throw and error if a `style` was not passed into the [constructor](#new-menucallback-options-style).

### `menu.height`

  - [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The height of the menu. Always set to `3`.

### `menu.options`

  - [`<string[]>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The list of options passed into the [constructor](#new-menucallback-options-style).

### `menu.style`

  - [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type)

The style passed into the [constructor](#new-menucallback-options-style). If no style was passed into the constructor, it will throw an error before it has been added to a terminal. After it has been added, it will default to `terminal.borderStyle`, and, if that is invalid, will default to `'light'`.

### `menu.width`

  - [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The width of the menu.

## Class: `Color` *Not Exported*

  - Extends: [`<EventEmitter>`](https://nodejs.org/api/events.html#events_class_eventemitter)

The class `Color` is not exported, however, [`terminal.color`](#terminalcolor) is an instance of it, so its properties and methods are still available to you.

### `new Color(out)`

  - `out` [`<tty.WriteStream>`](https://nodejs.org/api/tty.html#tty_class_tty_writestream) The write stream to add colors to.

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

The class `Color` is not exported, however, [`terminal.margin`](#terminalmargin) is an instance of it, so its properties and methods are still available to you.

### `new Margin(out, width, height)`

  - `out` [`<tty.WriteStream>`](https://nodejs.org/api/tty.html#tty_class_tty_writestream) The write stream that the `terminal` is on.
  - `width` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The width of the `terminal`.
  - `height` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The height of the `terminal`.

Creates a new `Margin` object. There is no reason for you to *ever* use this, I just included it for completion

```js
const { Terminal } = require("command-line-draw");

const terminal = new Terminal();

const Margin = terminal.margin.constructor;
const myMargin = new Margin(process.stdout, terminal.width, terminal.height); // There is no reason for you to ever do this.
```

### `margin.lr`

  - [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The left-right margin of the `terminal`. If this is less than `terminal.largestBorder`, then the terminal will disappear and `terminal.tooBig` will be set to `true`

### `margin.tb`

  - [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type)

The top-bottom margin of the `terminal`. If this is less than `1`, then the terminal will disappear and `terminal.tooBig` will be set to `true`

## Types

A type deceleration file has been included at [`./lib/cmdDraw.d.ts`](https://github.com/liambloom/command-line-draw/blob/master/lib/cmdDraw.d.ts). I tried, but I don&apos;t know typescript, so it likely has mistakes. If you find them, please report them to the github [issues page](https://github.com/liambloom/command-line-draw/issues).

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