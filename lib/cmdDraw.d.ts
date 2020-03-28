import { WriteStream, ReadStream } from "tty";
import { EventEmitter } from "events";

type ColorString = "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white";
type BorderStyle = "light" | "heavy" | "double" | "round" | "solid" | "none";
type Axis = "x" | "y" | "neither";
//type Boolean7 = [boolean, boolean, boolean, boolean, boolean, boolean, boolean];
interface BorderChars {
  vertical: string,
  horizontal: string,
  topLeft: string,
  topRight: string,
  bottomLeft: string,
  bottomRight: string
}
interface MenuBorderChars {
  horizontalUp: string,
  horizontalDown: string
}

declare class Margin {
  constructor (out: WriteStream, width: number, height: number);
  get lr(): number;
  get tb(): number;
  #out: WriteStream;
  #width: number;
  #height: number;
}

declare class Color extends EventEmitter {
  constructor(out: WriteStream);
  reset(): void;
  refresh(): void;
  get foreground(): ColorString | undefined;
  set foreground(color: ColorString);
  get background(): ColorString | undefined;
  set background(color: ColorString);
  #out: WriteStream;
  #foreground?: ColorString;
  #background?: ColorString;
  static getForegroundColor(color: ColorString): string;
  static getBackgroundColor(color: ColorString): string;
  static RESET: string;
  static #COLORS: ColorString[];
}

export class Terminal extends EventEmitter {
  constructor(config?: {
    in?: ReadStream;
    out?: WriteStream;
    width?: number;
    height?: number;
    border?: BorderStyle;
    color?: {
      foreground?: ColorString;
      background?: ColorString;
    }
    dev?: boolean;
  });
  drawLine(x1: number, y1: number, x2: number, y2: number, color?: ColorString, thickness?: number, dashed?: boolean, dashThickness?: number, spaceColor?: ColorString): void;
  drawBox(x: number, y: number, width: number, height: number, color?: ColorString): void;
  write(text: string, x: number, y: number, color?: ColorString): void;
  clear(): void;
  addSprite(sprite: Sprite): void;
  sevenSegment(x: number, y: number, a: boolean, b: boolean, c: boolean, d: boolean, e: boolean, f: boolean, g: boolean, color?: ColorString): void;
  sevenSegmentToBitmap(a: boolean, b: boolean, c: boolean, d: boolean, e: boolean, f: boolean, g: boolean): boolean[][];
  writeLarge(text: string, x: number, y: number, color?: ColorString): void;
  bitmap(x: number, y: number, ...matrixes: boolean[][][]): void;
  bitmap(x: number, y: number, color?: ColorString, ...matrixes: boolean[][][]): void;
  log(data: any, ...args: any[]): void;
  #clear: () => void;
  #refresh: () => void;
  #onresize: () => void;
  #drawLineAcross: () => void;
  #drawBorder: () => void;
  get tooBig (): boolean;
  get largestBorder (): number;
  get time (): number;
  clearMode: boolean;
  readonly in: ReadStream;
  readonly out: WriteStream;
  readonly width: number;
  readonly height: number;
  readonly borderStyle: BorderStyle;
  readonly borderChars: BorderChars | Partial<MenuBorderChars>;
  readonly hasBorder: boolean
  readonly color: Color;
  readonly margin: Margin;
  readonly dev: boolean;
  #frozenStartTime: number;
  #logHeight: number;
  #frozen: number;
  #sprites: Set<Sprite>;
  static FULL: string;
  static TOP: string;
  static BOTTOM: string;
  static LEFT: string;
  static RIGHT: string;
  static BORDERS: {
    light: BorderChars | MenuBorderChars,
    heavy: BorderChars | MenuBorderChars,
    double: BorderChars | MenuBorderChars,
    solid: BorderChars | MenuBorderChars,
    round: BorderChars
  }
  static sevenSegmentPresets: {
    numbers: {
      "0": [boolean, boolean, boolean, boolean, boolean, boolean, boolean],
      "1": [boolean, boolean, boolean, boolean, boolean, boolean, boolean],
      "2": [boolean, boolean, boolean, boolean, boolean, boolean, boolean],
      "3": [boolean, boolean, boolean, boolean, boolean, boolean, boolean],
      "4": [boolean, boolean, boolean, boolean, boolean, boolean, boolean],
      "5": [boolean, boolean, boolean, boolean, boolean, boolean, boolean],
      "6": [boolean, boolean, boolean, boolean, boolean, boolean, boolean],
      "7": [boolean, boolean, boolean, boolean, boolean, boolean, boolean],
      "8": [boolean, boolean, boolean, boolean, boolean, boolean, boolean],
      "9": [boolean, boolean, boolean, boolean, boolean, boolean, boolean]
    }
  }
  static bitmapPresets: {
    letters: {
      A: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ],
      B: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ],
      C: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ],
      D: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ],
      E: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ],
      F: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
      ],
      G: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ],
      H: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ],
      I: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
      ],
      J: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ],
      K: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ],
      L: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ],
      M: [
        [boolean, boolean, boolean, boolean, boolean],
        [boolean, boolean, boolean, boolean, boolean],
        [boolean, boolean, boolean, boolean, boolean],
        [boolean, boolean, boolean, boolean, boolean],
        [boolean, boolean, boolean, boolean, boolean]
      ],
      N: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ],
      O: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ],
      P: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ],
      Q: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ],
      R: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ],
      S: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ],
      T: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ],
      U: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
      ],
      V: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
      ],
      W: [
        [boolean, boolean, boolean, boolean, boolean],
        [boolean, boolean, boolean, boolean, boolean],
        [boolean, boolean, boolean, boolean, boolean],
        [boolean, boolean, boolean, boolean, boolean],
        [boolean, boolean, boolean, boolean, boolean],
      ],
      X: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ],
      Y: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
      ],
      Z: [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ]
    },
    punctuation: {
      ".": [
        [boolean],
        [boolean],
        [boolean],
        [boolean],
        [boolean]
      ],
      "!": [
        [boolean],
        [boolean],
        [boolean],
        [boolean],
        [boolean]
      ],
      "?": [
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean],
        [boolean, boolean, boolean]
      ]
    }
  }
}

export class Sprite extends EventEmitter {
  constructor(callback: (x: number, y: number, ...args: any[]) => void, config?: {
    preciseAxis: Axis;
    speed: number;
  });
  draw(x?: number, y?: number, ...args: any[]): void;
  clear(): void;
  stop(): void;
  move(x1: number, y1: number, x2: number, y2: number, t?: number): void;
  moveTo(x: number, y: number, t?: number): void;
  moveRelative(dx: number, dy: number, t?: number): void;
  readonly preciseAxis: Axis;
  readonly callback: (x: number, y: number, ...args: any[]) => void;
  readonly xRounder: (x: number) => number;
  readonly yRounder: (x: number) => number;
  get x(): number;
  get y(): number;
  get showing(): boolean;
  get speed(): number;
  set speed(speed: number);
  #x: number;
  #y: number;
  #speed: number;
  #frameId: number;
}

export class Box extends Sprite {
  constructor(width: number, height: number, config?: {
    preciseAxis: Axis;
    speed: number;
  });
  touching(box: Box, log?: boolean): boolean;
  readonly width: number;
  readonly height: number;
}

export class Menu extends Sprite {
  constructor (callback: (i: number) => void, options: string[], style: Omit<BorderStyle, "round" | "none">);
  readonly options: string[];
  readonly height: number;
  get width(): number;
  get borderChars(): BorderChars | MenuBorderChars;
  get style(): BorderStyle;
  #drawTop: (color?: ColorString) => void;
  #drawBottom: (color?: ColorString) => void;
  #drawTopBottom: (borders: {
    left: string;
    horizontal: string;
    connect: string;
    right: string;
  }, color: ColorString | undefined, dy: number) => void;
}