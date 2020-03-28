# CMD Draw

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
  - `width` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The width of the `Terminal`.**Default:** `this.out.columns - 2`.
  - `height` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) The height of the `Terminal`. **Default:** `this.out.rows - 2`.
  - `border` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The border style of the terminal. See [here](#borders) for a list of valid border styles. **Default:** `"light"`.
  - `color` [`<Object>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
    - `foreground` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The foreground color of the `Terminal`. See [here](#colors) for a list of valid colors. **Default:** `"black"`.
    - `background` [`<string>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#String_type) The background color of the `Terminal`. See [here](#colors) for a list of valid colors. **Default:** `"white"`.
  - `dev` [`<boolean>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Boolean_type) Determines behavior of [`terminal.log`](#terminal.log). **Default:** `false`.

Creates a new `Terminal` object.

```js
const { Terminal } = require("command-line-draw");

const terminal = new Terminal();
```

### `terminal.drawLine(x1, y1, x2, y2[, color])`

  - `x1` [`<number>`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type) 

THIS METHOD IS NOT FULLY DOCUMENTED

#### Borders
One of:
  - `"light"` **(Default)**
  - `"heavy"`
  - `"double"`
  - `"round"`
  - `"solid"`
  - `"none"`

#### Colors
One of:
  - ![#000000](https://placehold.it/15/000000?text=+) `black`
  - ![#ff0000](https://placehold.it/15/ff0000?text=+) `red`
  - ![#00ff00](https://placehold.it/15/00ff00?text=+) `green`
  - ![#ffff00](https://placehold.it/15/ffff00?text=+) `yellow`
  - ![#0000ff](https://placehold.it/15/0000ff?text=+) `blue`
  - ![#ff00ff](https://placehold.it/15/ff00ff?text=+) `magenta`
  - ![#00ffff](https://placehold.it/15/00ffff?text=+) `cyan`
  - ![#ffffff](https://placehold.it/15/ffffff?text=+) `white`

### `terminal.log(data[, ...args])`