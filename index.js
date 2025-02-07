const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 800;
const gravity = 0.01;
class Vector1 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  static fromAngle(angle) {
    return new Vector1(Math.cos(angle), Math.sin(angle));
  }
  add(that) {
    return new Vector1(this.x + that.x, this.y + that.y);
  }
}
class Player {
  constructor(position, velocity, next) {
    this.position = position;
    this.velocity = velocity;
    this.next = next;
  }
  getDirection() {
    return Math.atan2(this.velocity.x, this.velocity.y);
  }
  distance(that) {
    return Math.sqrt(
      Math.pow(that.x - this.position.x, 2) +
        Math.pow(that.y - this.position.y, 2)
    );
  }
}
class Circle {
  constructor(state, start, end, r, center, next) {
    this.state = state;
    this.start = start;
    this.end = end;
    this.r = r;
    this.center = center;
    this.next = next;
  }
}
// const circle = new Circle(
//   true,
//   Math.PI * 1.8,
//   Math.PI * 1.9,
//   2,
//   new Vector1(4, 4)
// );
// const circle1 = new Circle(
//   true,
//   Math.PI,
//   Math.PI * 1.1,
//   2.2,
//   new Vector1(4, 4)
// );
// const circle2 = new Circle(
//   true,
//   Math.PI / 2,
//   (Math.PI / 2) * 1.1,
//   2.4,
//   new Vector1(4, 4)
// );

const circle = new Circle(
  true,
  Math.PI * 1.1,
  Math.PI * 1.15,
  2,
  new Vector1(4, 4)
);
const circle1 = new Circle(
  true,
  Math.PI * 1.15,
  Math.PI * 1.2,
  2.2,
  new Vector1(4, 4)
);
const circle2 = new Circle(
  true,
  Math.PI * 1.2,
  Math.PI * 1.25,
  2.4,
  new Vector1(4, 4)
);
const circle3 = new Circle(
  true,
  Math.PI * 1.25,
  Math.PI * 1.3,
  2.6,
  new Vector1(4, 4)
);

const circle4 = new Circle(
  true,
  Math.PI * 1.3,
  Math.PI * 1.35,
  2.8,
  new Vector1(4, 4)
);

const circle5 = new Circle(
  true,
  Math.PI * 1.35,
  Math.PI * 1.4,
  3,
  new Vector1(4, 4)
);
const circle6 = new Circle(
  true,
  Math.PI * 1.45,
  Math.PI * 1.5,
  3.2,
  new Vector1(4, 4)
);
const circle7 = new Circle(
  true,
  Math.PI * 1.5,
  Math.PI * 1.55,
  3.4,
  new Vector1(4, 4)
);
circle.next = circle1;
circle1.next = circle2;
circle2.next = circle3;
circle3.next = circle4;
circle4.next = circle5;
circle5.next = circle6;
circle6.next = circle7;
circle7.next = 0;

function renderCircle(ctx, circle) {
  ctx.beginPath();
  ctx.arc(400, 400, circle.r * 100 + 30, circle.end, circle.start);
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#3498db";
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.closePath();
}
function drawLine(ctx, p1, p2) {
  ctx.beginPath();
  ctx.moveTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.closePath();
  ctx.stroke();
}
function renderPlayerPosition(ctx, R, center) {
  ctx.beginPath();
  ctx.arc(center.x * 100, center.y * 100, R, 0, Math.PI * 2);

  ctx.fillStyle = "#e74c3c";
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  ctx.shadowBlur = 10;

  ctx.fill();
  ctx.closePath();
}

function render(ctx, circle, newPlayer) {
  ctx.save();
  // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.strokeStyle = "black";
  ctx.lineWidth = 10;
  let curr = circle;
  while (curr.next) {
    renderCircle(ctx, curr);
    curr = curr.next;
  }
  ctx.fillStyle = "red";
  renderPlayerPosition(ctx, 15, newPlayer.position);
  ctx.restore();
}
function iscollide(newPlayer, circle, i) {
  const prevPos = new Vector1(newPlayer.position.x, newPlayer.position.y);
  const circleCenter = circle.center;
  const circleRadius = circle.r;

  const distanceToCenter = Math.sqrt(
    Math.pow(newPlayer.position.x - circleCenter.x, 2) +
      Math.pow(newPlayer.position.y - circleCenter.y, 2)
  );

  if (distanceToCenter > circleRadius) {
    const dy = newPlayer.position.y - circle.center.y;
    const dx = newPlayer.position.x - circle.center.x;
    let angle = Math.atan2(dy, dx);
    if (angle < 0) angle += Math.PI * 2;
    if (angle < circle.end && angle > circle.start) {
      ++i;
      Object.assign(circle, circle.next);
      return;
    }

    newPlayer.position = prevPos;

    const normalX = (newPlayer.position.x - circleCenter.x) / distanceToCenter;
    const normalY = (newPlayer.position.y - circleCenter.y) / distanceToCenter;

    const dotProduct =
      newPlayer.velocity.x * normalX + newPlayer.velocity.y * normalY;

    newPlayer.velocity.x -= Math.min(2 * dotProduct * normalX, 0.5);
    newPlayer.velocity.y -= Math.min(2 * dotProduct * normalY, 0.5);

    newPlayer.position.x = circleCenter.x + (circleRadius - 0.01) * normalX;
    newPlayer.position.y = circleCenter.y + (circleRadius - 0.01) * normalY;
  }
}
async function startGame(ctx, circle, newPlayer, i) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset scaling to avoid cumulative scaling
  ctx.scale(ctx.canvas.width / SCREEN_WIDTH, ctx.canvas.height / SCREEN_HEIGHT);
  let curr = newPlayer;
  while (curr.next) {
    curr.velocity.y += gravity;
    iscollide(curr, circle, i);
    curr.position = curr.position.add(curr.velocity);

    render(ctx, circle, curr);
    curr = curr.next;
  }
}

(() => {
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  let i = -1;
  const newPlayer = new Player(new Vector1(4, 4), new Vector1(0.02, 0.0));
  const newPlayer1 = new Player(new Vector1(1, 4), new Vector1(0.02, 0.0));
  const newPlayer2 = new Player(new Vector1(3, 4), new Vector1(0.02, 0.0));
  const newPlayer3 = new Player(new Vector1(5, 0), new Vector1(0.02, 0.0));
  const newPlayer4 = new Player(new Vector1(6, 1), new Vector1(0.02, 0.0));
  const newPlayer5 = new Player(new Vector1(4, 1), new Vector1(0.02, 0.0));
  const newPlayer6 = new Player(new Vector1(6, 1), new Vector1(0.02, 0.0));
  newPlayer.next = newPlayer1;
  newPlayer1.next = newPlayer2;
  newPlayer2.next = newPlayer3;
  newPlayer3.next = newPlayer4;
  newPlayer4.next = newPlayer5;
  newPlayer5.next = 0;
  let prevTimestamp = 0;
  const targetFPS = 120;
  const frameInterval = 1000 / targetFPS;

  let prevTime = performance.now();

  const frame = () => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - prevTime) / 1000;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.beginPath();

    ctx.shadowBlur = 0;
    ctx.rect(10, 10, 790, 790);
    ctx.stroke();
    let curr = circle;
    while (curr.next) {
      curr.start += 0.01;
      curr.end += 0.01;
      curr.start = curr.start % (Math.PI * 2);
      curr.end = curr.end % (Math.PI * 2);
      renderCircle(ctx, curr);
      curr = curr.next;
    }
    startGame(ctx, circle, newPlayer, i);
    prevTime = currentTime;

    setTimeout(frame, frameInterval);
  };

  frame();
})();
