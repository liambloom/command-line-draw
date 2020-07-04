import { WriteStream, ReadStream } from "tty";
import { EventEmitter } from "events";

type ColorString = "black" | "red" | "green" | "yellow" | "blue" | "magenta" | "cyan" | "white";
type BorderStyle = "light" | "heavy" | "double" | "round" | "solid" | "none";
type Axis = "x" | "y" | "neither";
type bm3by5 = [
    [boolean, boolean, boolean],
    [boolean, boolean, boolean],
    [boolean, boolean, boolean],
    [boolean, boolean, boolean],
    [boolean, boolean, boolean]
];
type sevenSegment = [boolean, boolean, boolean, boolean, boolean, boolean, boolean];

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
  set foreground(color: ColorString | undefined);
  get background(): ColorString | undefined;
  set background(color: ColorString | undefined);
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
  write(text: string, x: number, y: number, color?: ColorString, backgroundColor?: ColorString): void;
  clear(): void;
  addSprite(sprite: Sprite): void;
  sevenSegment(x: number, y: number, a: boolean, b: boolean, c: boolean, d: boolean, e: boolean, f: boolean, g: boolean, color?: ColorString): void;
  sevenSegmentToBitmap(a: boolean, b: boolean, c: boolean, d: boolean, e: boolean, f: boolean, g: boolean): bm3by5;
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
  readonly hasBorder: boolean;
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
      "0": sevenSegment,
      "1": sevenSegment,
      "2": sevenSegment,
      "3": sevenSegment,
      "4": sevenSegment,
      "5": sevenSegment,
      "6": sevenSegment,
      "7": sevenSegment,
      "8": sevenSegment,
      "9": sevenSegment
    }
  }
  static bitmapPresets: {
    letters: {
      A: bm3by5,
      B: bm3by5,
      C: bm3by5,
      D: bm3by5,
      E: bm3by5,
      F: bm3by5,
      G: bm3by5,
      H: bm3by5,
      I: bm3by5,
      J: bm3by5,
      K: bm3by5,
      L: bm3by5,
      M: [
        [boolean, boolean, boolean, boolean, boolean],
        [boolean, boolean, boolean, boolean, boolean],
        [boolean, boolean, boolean, boolean, boolean],
        [boolean, boolean, boolean, boolean, boolean],
        [boolean, boolean, boolean, boolean, boolean]
      ],
      N: bm3by5,
      O: bm3by5,
      P: bm3by5,
      Q: bm3by5,
      R: bm3by5,
      S: bm3by5,
      T: bm3by5,
      U: bm3by5,
      V: bm3by5,
      W: [
        [boolean, boolean, boolean, boolean, boolean],
        [boolean, boolean, boolean, boolean, boolean],
        [boolean, boolean, boolean, boolean, boolean],
        [boolean, boolean, boolean, boolean, boolean],
        [boolean, boolean, boolean, boolean, boolean],
      ],
      X: bm3by5,
      Y: bm3by5,
      Z: bm3by5
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
      "?": bm3by5
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
  touching(box: Box): boolean;
  readonly width: number;
  readonly height: number;
}

export class Menu extends Sprite {
  constructor (callback: (i: number) => void, options: string[], style?: Omit<BorderStyle, "round" | "none">);
  height: number;
  readonly options: string[];
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
  #open: boolean;
}