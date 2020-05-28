function pong () {
  "use strict";
  const flags = require("./flags")();
  const { Terminal, Box, Menu } = require("../lib/cmdDraw");
  console = require("./colorConsole");

  const random = (min, max) => Math.random() * (max - min) + min;
  const randomSlope = (min, max) => Math.tan(random(Math.atan(min), Math.atan(max)));
  function directionFunc (n, direction) {
    const min = 0;
    const max = terminal.width - ball.width;
    if (Math.abs(n) === Infinity) {
      if (direction === "right") return max;
      else return min;
    }
    else return Math.min(Math.max(n, min), max);
  }
  function nextPoint (slope, direction) {
    const directionMod = direction === "right" ? 1 : -1;
    const ballYInt = -slope * ball.x + ball.y;
    const x = directionFunc(directionMod * slope < 0 ? -ballYInt / slope : (terminal.height - ball.height - ballYInt) / slope, direction);
    const y = ball.yRounder(slope * x + ballYInt);
    if (automatePlayer2) {
      if (x > paddleX + paddleWidth) leftPaddle.moveTo(paddleX, Math.min(Math.max(y + 1 - paddleHeight / 2, 0), terminal.height - paddleHeight));
      else leftPaddle.moveTo(paddleX, ball.yRounder(Math.min(Math.max(slope * (paddleX + paddleWidth) + ballYInt + 1 - paddleHeight / 2, 0), terminal.height - paddleHeight)));
    }
    return [ball.xRounder(x), y];
  }
  const writeScore = (score, location) => terminal.sevenSegment(location === "right" ? rightScoreX : leftScoreX, 1, ...Terminal.sevenSegmentPresets.numbers[score]);

  const terminal = new Terminal({
    width: flags.w || flags.width || 110,
    height: flags.h || flags.height || 30,
    border: "solid",
    dev: flags.d || flags.dev,
    color: {
      foreground: flags.c || flags.color || flags.fg || flags.foreground || "white",
      background: flags.bg || flags.background || flags.backgroundColor || "black"
    }
  });

  const centerX = terminal.width / 2;
  const centerY = terminal.height / 2;
  const paddleHeight = 8;
  const paddleWidth = 2;
  const paddleX = 7;
  const leftScoreX = Math.floor(terminal.width / 4 - 3);
  const rightScoreX = Math.ceil(3 * terminal.width / 4 - 3);
  const borders = Terminal.BORDERS.double;
  borders.horizontalDown = "\u2566";
  borders.horizontalUp = "\u2569";
  let cpuScore, playerScore, ballDirection, ballSlope, bouncedOff, automatePlayer2;

  const drawCenterLine = () => terminal.drawLine(centerX, 0, centerX, terminal.height, null, 2, true, 0.5);

  const leftPaddle = new Box(paddleWidth, paddleHeight);
  const rightPaddle = new Box(paddleWidth, paddleHeight, { speed: 30 });
  const ball = new Box(2, 1, { speed: 30 });

  terminal.addSprite(leftPaddle);
  terminal.addSprite(rightPaddle);
  terminal.addSprite(ball);

  function reset () {
    // paddles
    leftPaddle.stop();
    rightPaddle.stop();
    leftPaddle.draw(paddleX, centerY - paddleHeight / 2);
    rightPaddle.draw(terminal.width - paddleX - paddleWidth, centerY - paddleHeight / 2);

    // ball
    bouncedOff = undefined;
    ballSlope = randomSlope(-0.5, 0.5);
    ball.speed = 30;
    ball.clear();
    setTimeout(() => {
      ball.draw(centerX - 1, centerY);
      bounce();
    }, 200);
  }
  function bounce() {
    ball.moveTo(...nextPoint(ballSlope, ballDirection));
  }
  function onresize() {
    drawCenterLine();
    writeScore(cpuScore, "left");
    writeScore(playerScore, "right");
  }

  function init () {
    cpuScore = 0;
    playerScore = 0;
    ballDirection = Math.round(Math.random()) ? "left" : "right";

    ball.removeAllListeners();
    terminal.removeAllListeners();
    terminal.clear();

    if (!automatePlayer2) {
      terminal.on("w", () => {
        leftPaddle.moveTo(leftPaddle.x, Math.max(leftPaddle.y - 1, 0));
      });
      terminal.on("s", () => {
        leftPaddle.moveTo(leftPaddle.x, Math.min(leftPaddle.y + 1, terminal.height - leftPaddle.height));
      });
    }
    terminal.on("up", () => {
      rightPaddle.moveTo(rightPaddle.x, Math.max(rightPaddle.y - 1, 0));
    });
    terminal.on("down", () => {
      rightPaddle.moveTo(rightPaddle.x, Math.min(rightPaddle.y + 1, terminal.height - rightPaddle.height));
    });
    terminal.on("resize", onresize);

    ball.on("clear", (x, y) => {
      if (x <= centerX && x >= centerX - 2) drawCenterLine();
      else if (!(y + ball.height < 1 || y > 6)) {
        if (!(x + ball.width < leftScoreX || x >= leftScoreX + 6)) writeScore(cpuScore, "left");
        else if (!(x + ball.width < rightScoreX || x >= rightScoreX + 6)) writeScore(playerScore, "right");
      }
    });
    ball.on("frame", () => {
      const touching = ball.touching(rightPaddle) ? rightPaddle : ball.touching(leftPaddle) ? leftPaddle : null;
      if (touching) {
        touching.draw();
        if (bouncedOff !== touching) {
          ball.stop();
          let x;
          if (touching === rightPaddle) {
            x = terminal.width - paddleX - 1;
            ballDirection = "left";
          }
          else {
            x = paddleX + 1;
            ballDirection = "right";
          }
          ballSlope = ((rightPaddle.y + paddleHeight / 2) - (ball.y + 0.5)) / ((terminal.width - paddleX) - Math.min(ball.x + 1, x)) / 1.5 + (Math.random() - 0.5) / 5;
          ball.speed += 10;
          bouncedOff = touching;
          bounce();
        }
      }
    });
    ball.on("moveEnded", () => {
      const playerScored = ball.x === 0;
      const cpuScored = ball.x === terminal.width - ball.width;
      if (playerScored || cpuScored) {
        let score;
        if (playerScored) score = ++playerScore;
        else if (cpuScored) score = ++cpuScore;
        if (score === 10) {
          let x = playerScored ? terminal.width / 2 - 29 : terminal.width / 2 - 33;
          const y = terminal.height / 2 - 2.5;
          terminal.removeAllListeners();
          terminal.clear();
          terminal.writeLarge(playerScored ? "You Win!" : "You Loose", x, y);
          terminal.write("Press R to restart, Q to quit", terminal.width / 2 - 15.5, terminal.height / 2 + 3.5);
          terminal.once("r", init);
          terminal.on("q", () => process.exit());
        }
        else {
          ballDirection = playerScored ? "left" : "right";
          writeScore(score, playerScored ? "right" : "left");
          reset();
        }
      }
      else if (ball.y === 0 || ball.y === terminal.height - 1) {
        ballSlope *= -1;
        bounce();
      }
    });

    reset();
    onresize();
  }

  function drawTitleScreen () {
    terminal.writeLarge("PONG", terminal.width / 2 - 15, terminal.height / 3 - 2.5);
    terminal.write("\x1b[4mBy Liam Bloom\x1b[0m", terminal.width / 2 - 6.5, terminal.height / 3 + 3.5);
    terminal.color.refresh();
    terminal.write("\x1b[2m\xa9 2020 Liam Bloom\x1b[0m", terminal.width - 17, terminal.height - 1);
    terminal.color.refresh();
  }
  terminal.on("resize", drawTitleScreen);
  drawTitleScreen();
  const difficultyMenu = new Menu(i => {
    leftPaddle.speed = [10, 15, 20, 30][i];
    init();
  }, ["easy", "medium", "hard", "impossible"], "double");
  const playerCountMenu = new Menu(i => {
    if (i === "0") {
      automatePlayer2 = true;
      difficultyMenu.draw((terminal.width - difficultyMenu.width) / 2, 2 * terminal.height / 3 - difficultyMenu.height / 2);
    }
    else {
      automatePlayer2 = false;
      leftPaddle.speed = 30;
      init();
    }
  }, ["One player", "Two player"], "double");
  terminal.addSprite(difficultyMenu);
  terminal.addSprite(playerCountMenu);
  playerCountMenu.draw((terminal.width - playerCountMenu.width) / 2, 2 * terminal.height / 3 - playerCountMenu.height / 2);
}

pong();