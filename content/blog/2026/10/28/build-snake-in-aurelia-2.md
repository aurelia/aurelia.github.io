+++
title = "Build Snake in Aurelia 2"
authors = ["Dwayne Charrington"]
description = "A playable Snake game in one Aurelia 2 component: a CSS grid board, a requestAnimationFrame loop, keyboard and touch controls, and a high score that survives a refresh. Under 300 lines, and no game engine."
date = 2026-10-28T08:00:00+10:00
lastmod = 2026-10-28T08:00:00+10:00
tags = ["aurelia2", "tutorial"]
toc = true
+++

Snake is a good weekend project. The rules fit on a napkin, and a playable version still needs a game loop, keyboard input, collision checks and some saved state. It also happens to be a nice way to see how far a plain Aurelia 2 component gets you.

By the end of this post you'll have a full game in one component: a 20 by 20 board, a snake that grows when it eats, arrow key and WASD controls, an on-screen pad for phones, and a high score kept in `localStorage`. There are three files, under 300 lines in total, and no dependencies beyond Aurelia.

## Setting up

Start with a new project:

```bash
npx makes aurelia snake
```

Choose TypeScript and Vite when it asks. Then create three files in `src`: `snake-game.ts`, `snake-game.html` and `snake-game.css`. Aurelia's conventions pair them up for you. The class and the template share a name, so they become one component, and a CSS file with the same name is imported automatically.

To make the game the whole app, point `main.ts` at it:

```ts
import Aurelia from 'aurelia';
import { SnakeGame } from './snake-game';

Aurelia.app(SnakeGame).start();
```

## The board

The board doesn't need 400 cells. It's a CSS grid with 20 columns and 20 rows, and each snake segment places itself with `grid-column` and `grid-row`. Only the snake and the food are actual elements.

```html
<div class="snake-game">
  <div class="snake-scores">
    <span>Score: ${score}</span>
    <span>Best: ${highScore}</span>
  </div>

  <div class="snake-board" style="--size: ${size}">
    <div
      class="snake-food"
      style="grid-column: ${food.x + 1}; grid-row: ${food.y + 1}"></div>

    <div
      repeat.for="part of snake"
      class="snake-part ${$first ? 'snake-head' : ''}"
      style="grid-column: ${part.x + 1}; grid-row: ${part.y + 1}"></div>

    <div class="snake-overlay" if.bind="state !== 'playing'">
      <p if.bind="state === 'over'">Game over. You scored ${score}.</p>
      <button click.trigger="start()">
        ${state === 'over' ? 'Play again' : 'Start'}
      </button>
      <p class="snake-hint">Arrow keys or WASD to steer. Space to start.</p>
    </div>
  </div>

  <div class="snake-pad">
    <button pointerdown.trigger="turn('up')" aria-label="Up">▲</button>
    <button pointerdown.trigger="turn('left')" aria-label="Left">◀</button>
    <button pointerdown.trigger="turn('down')" aria-label="Down">▼</button>
    <button pointerdown.trigger="turn('right')" aria-label="Right">▶</button>
  </div>
</div>
```

A few things are worth pointing out:

- **Interpolation works inside `style`.** `style="grid-column: ${part.x + 1}"` updates whenever `part.x` changes. Grid lines start at 1, so the `+ 1` turns zero-based coordinates into grid positions.
- **`$first` marks the head.** `repeat.for` gives every row `$index`, `$first`, `$last` and a few others, so the head gets its own colour without any extra state.
- **The overlay sits on the board.** It covers the whole grid (see the CSS below) and only exists while the game isn't running. It shows the start button before the first game and your score after each one.
- **The pad uses `pointerdown`.** On a phone, `click` waits for the finger to lift. `pointerdown` fires the moment you touch the button, which matters when you're two cells from a wall.

The CSS sets up the grid and colours:

```css
.snake-game {
  max-width: 420px;
  margin: 0 auto;
  font-family: system-ui, sans-serif;
}

.snake-scores {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: 600;
}

.snake-board {
  display: grid;
  grid-template-columns: repeat(var(--size), 1fr);
  grid-template-rows: repeat(var(--size), 1fr);
  aspect-ratio: 1;
  background: #1d2b1f;
  border-radius: 6px;
}

.snake-part {
  background: #8bd17c;
  border-radius: 3px;
  margin: 1px;
}

.snake-head {
  background: #c5f2b6;
}

.snake-food {
  background: #f25c54;
  border-radius: 50%;
  margin: 2px;
}

.snake-overlay {
  grid-area: 1 / 1 / -1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgb(0 0 0 / 0.6);
  color: white;
  border-radius: 6px;
  text-align: center;
}

.snake-hint {
  font-size: 0.85rem;
  opacity: 0.8;
}

.snake-pad {
  display: grid;
  grid-template-columns: repeat(3, 56px);
  grid-template-areas:
    ". up ."
    "left down right";
  gap: 6px;
  justify-content: center;
  margin-top: 12px;
}

.snake-pad button {
  height: 56px;
  font-size: 1.25rem;
  touch-action: manipulation;
}

.snake-pad [aria-label="Up"] { grid-area: up; }
.snake-pad [aria-label="Left"] { grid-area: left; }
.snake-pad [aria-label="Down"] { grid-area: down; }
.snake-pad [aria-label="Right"] { grid-area: right; }
```

`aspect-ratio: 1` keeps the board square at any width, and `grid-area: 1 / 1 / -1 / -1` stretches the overlay across every row and column. The board size comes from the view model through the `--size` custom property, so changing `SIZE` in one place resizes everything. The component's CSS is global, which is why every class starts with `snake-`.

## The view model

The rest of the game lives in `snake-game.ts`. It's a plain class with no decorators and no base class. The snippets below make up the whole file, in order.

### Constants

```ts
type Point = { x: number; y: number };
type Direction = 'up' | 'down' | 'left' | 'right';

const SIZE = 20;
const STEP_MS = 120;
const HIGH_SCORE_KEY = 'snake-high-score';

const MOVES: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

const KEYS: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right',
};

const same = (a: Point, b: Point) => a.x === b.x && a.y === b.y;
```

`STEP_MS` is the game speed: the snake moves one cell every 120 milliseconds. Lower it for a harder game.

### State

```ts
export class SnakeGame {
  size = SIZE;
  snake: Point[] = [];
  food: Point = { x: 0, y: 0 };
  score = 0;
  highScore = Number(localStorage.getItem(HIGH_SCORE_KEY) ?? 0);
  state: 'ready' | 'playing' | 'over' = 'ready';

  private direction: Direction = 'right';
  private turns: Direction[] = [];
  private frame = 0;
  private lastStep = 0;

  constructor() {
    this.reset();
  }
```

The public fields are what the template binds to. The private ones only matter to the game loop. The snake is an array of points with the head first. `highScore` reads from `localStorage` when the component is created, so your best score survives a refresh.

Calling `reset()` from the constructor puts the snake and food on the board before the first game, so the start screen shows the snake behind the overlay instead of an empty board.

### Starting and the game loop

```ts
  start() {
    this.reset();
    this.state = 'playing';
    this.lastStep = performance.now();
    this.frame = requestAnimationFrame(this.loop);
  }

  private reset() {
    this.snake = [
      { x: 6, y: 10 },
      { x: 5, y: 10 },
      { x: 4, y: 10 },
    ];
    this.direction = 'right';
    this.turns = [];
    this.score = 0;
    this.placeFood();
  }

  private loop = (time: number) => {
    if (time - this.lastStep >= STEP_MS) {
      this.lastStep = time;
      this.step();
    }
    if (this.state === 'playing') {
      this.frame = requestAnimationFrame(this.loop);
    }
  };
```

The loop runs on `requestAnimationFrame`, which fires once per display frame, usually 60 times a second. Snake doesn't want to move 60 cells a second, so the loop only calls `step()` once at least `STEP_MS` has passed since the last move. On every other frame it does nothing.

There are two reasons to prefer this over `setInterval`. Moves line up with the browser's repaints, so the snake doesn't stutter. And the browser pauses `requestAnimationFrame` in background tabs, so the game stops when you switch away instead of running your snake into a wall where you can't see it. When you come back, it carries on from the same spot.

`loop` is an arrow function stored in a field, so `this` still points at the component when the browser calls it.

### Moving, eating and dying

```ts
  private step() {
    this.direction = this.turns.shift() ?? this.direction;

    const head = this.snake[0];
    const move = MOVES[this.direction];
    const next = { x: head.x + move.x, y: head.y + move.y };
    const eating = same(next, this.food);

    // The tail moves out of the way this step, unless the snake is growing.
    const body = eating ? this.snake : this.snake.slice(0, -1);
    const outside = next.x < 0 || next.y < 0 || next.x >= SIZE || next.y >= SIZE;

    if (outside || body.some(part => same(part, next))) {
      this.gameOver();
      return;
    }

    this.snake.unshift(next);

    if (eating) {
      this.score++;
      this.placeFood();
    } else {
      this.snake.pop();
    }
  }
```

Each step adds a new head in the current direction. If the snake just ate, the tail stays and the snake is one cell longer. Otherwise the tail comes off, and the length stays the same.

The collision check has one subtle part. Moving into the cell your tail is leaving is legal, because the tail won't be there by the end of the step. So unless the snake is eating, the check ignores the last segment. Without that, a snake chasing its own tail in a tight loop would die for no reason.

The step mutates the array in place with `unshift` and `pop`, and the template keeps up without the array ever being reassigned. Aurelia observes those array methods directly. [How Aurelia Knows Something Changed](/blog/2026/10/14/how-aurelia-knows-something-changed/) covers how that works.

### Food and game over

```ts
  private placeFood() {
    let food: Point;
    do {
      food = {
        x: Math.floor(Math.random() * SIZE),
        y: Math.floor(Math.random() * SIZE),
      };
    } while (this.snake.some(part => same(part, food)));
    this.food = food;
  }

  private gameOver() {
    this.state = 'over';
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem(HIGH_SCORE_KEY, String(this.score));
    }
  }
```

Food goes on a random cell, and the loop picks again if that cell is under the snake. Setting `state` to `'over'` is enough to end the game. The loop sees it and stops requesting frames, and the template shows the overlay with your score.

### Turning

```ts
  turn(direction: Direction) {
    const current = this.turns.at(-1) ?? this.direction;
    if (direction === current || direction === OPPOSITE[current]) return;
    if (this.turns.length < 2) this.turns.push(direction);
  }
```

This is the easiest part to get wrong. The obvious version sets `this.direction` straight away and ignores the opposite direction. It breaks when two keys arrive inside one 120 ms step.

Say the snake is heading right, and you press up and then left quickly. With the obvious version, up is accepted, and left is accepted too because it's compared against up. Then the next step moves left, straight back into the snake's own neck.

Queuing the turns fixes it. Each new turn is checked against the last queued turn, not the current direction, and `step()` takes one turn from the queue each move. Up and then left now plays out as up for one step, then left, which is what the player meant. The queue holds at most two turns, so mashing the keys can't line up moves for a second from now.

### Keyboard input

```ts
  attached() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  detaching() {
    window.removeEventListener('keydown', this.onKeyDown);
    cancelAnimationFrame(this.frame);
  }

  private onKeyDown = (event: KeyboardEvent) => {
    const direction = KEYS[event.key];

    if (direction) {
      event.preventDefault();
      if (this.state === 'playing') this.turn(direction);
    } else if (event.key === ' ' && this.state !== 'playing') {
      event.preventDefault();
      this.start();
    }
  };
}
```

Keyboard events go on `window` so the game responds whatever has focus. `keydown.trigger` on an element would only fire while that element, or something inside it, has focus. The listener is added in `attached` and removed in `detaching`, along with any pending frame, so nothing keeps running if the component is removed from the page (behind a route, say).

`preventDefault()` stops the arrow keys and space bar from scrolling the page while you play.

## Where to take it next

That's the whole game. If you want to keep going, a few ideas:

- **Speed up as the score climbs.** Make `STEP_MS` a field and take a few milliseconds off it each time the snake eats.
- **Wrap around the edges.** Replace the wall check with `(next.x + SIZE) % SIZE` and see if it makes the game easier or harder.
- **Pause.** Add a `'paused'` state and stop requesting frames while it's set. The loop already stops whenever the state isn't `'playing'`.
- **Swipe controls.** Listen for `pointerdown` and `pointerup` on the board and turn in the direction of the larger movement.

If you build something with it, share it with us on [Discord](https://discord.gg/TPV3cvCZhz). We'd love to see high scores too.
