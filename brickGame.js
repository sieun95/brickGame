// 캔버스 설정하기
// 캔버스에 그리기위해서 2D rendering context 를 ctx에 저장한다.
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// arc
// 변수로 arc의 x, y를 지정해준다 움직이는 좌표값도 지정해준다
let arcPosX = 200; // arc의 시작점
let arcPosY = 360;
let arcMoveX = -1; // arc의 방향
let arcMoveY = -1;
let arcSpd = 10;
const arcRadius = 20; // arc의 반지름 값
let ball = { left: 0, right: 0, top: 0, bottom: 0 };

// paddle
const paddleWidth = 100;
const paddleHeight = 20;
let paddlePosX = canvas.width / 2 - paddleWidth / 2;
let paddlePosY = canvas.height - paddleHeight;
let paddleSpd = 30;
let paddle = { left: 0, right: 0, top: 0, bottom: 0 };

// brick
const brickWidth = 50;
const brickHeight = 25;
const brickColumn = 5; // 열
const brickRow = 4; // 행
let bricks = []; // 여러개를 만들기 위해서 빈 배열을 선언해준다.
let bricksCount = brickColumn * brickRow;

// 스페이스를 눌렀을때 한번만 실행될수있게 Boolean 값으로 조건을 걸어준다 true일때만 실해하도록
let setStart = true;

// key로 paddle 컨트롤
document.addEventListener("keydown", keyDownEventHandler);

function keyDownEventHandler(e) {
  if (e.key == " " && setStart) {
    setInterval(update, 10);
    setStart = false;
  }
  if (e.keyCode == 39) {
    // 바를 오른쪽으로 이동
    if (paddlePosX + paddleWidth < canvas.width) {
      paddlePosX += paddleSpd;
    }
  } else if (e.keyCode == 37) {
    // 바를 왼쪽으로 이동
    if (paddlePosX > 0) {
      paddlePosX -= paddleSpd;
    }
  }
  if (e.keyCode == 37 || e.keyCode == 39) {
    paddle.left = paddlePosX;
    paddle.right = paddlePosX + paddleWidth;
    paddle.top = paddlePosY;
    paddle.bottom = paddlePosY + paddleHeight;
  }
}

// gameWin 함수
function gameWin() {
  if (bricksCount == 0) {
    window.location.reload(true);
    alert("Game Win");
  }
}

// gameOver 함수
function gameOver() {
  if (arcPosY > 380) {
    window.location.reload(true);
    alert("Game Over");
  }
}

// arc만들기
function drawArc() {
  ctx.beginPath();
  // 공을 움직이기 위해서는 x, y를 숫자가아닌 좌표로 만들어야된다.
  ctx.arc(arcPosX, arcPosY, arcRadius, 0, Math.PI * 2); // (x, y, 반지름, 시작 도수)
  ctx.fillStyle = "red"; // 공의 색깔
  ctx.fill();
  ctx.closePath();
}

// paddle만들기
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddlePosX, paddlePosY, paddleWidth, paddleHeight);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

// bricks만들기
function setBricks() {
  for (let i = 0; i < brickRow; i++) {
    //위에서부터 5줄
    bricks[i] = [];
    for (let j = 0; j < brickColumn; j++) {
      //가로로 4개
      bricks[i][j] = {
        left: 55 + j * (brickWidth + 10),
        right: 55 + j * (brickWidth + 10) + 50,
        top: 30 + i * (brickHeight + 5),
        bottom: 30 + i * (brickHeight + 5) + 25,
        isAlive: true, //벽돌 생존 확인
      };
    }
  }
}

function drawBricks() {
  ctx.beginPath();
  for (let i = 0; i < brickRow; i++) {
    for (let j = 0; j < brickColumn; j++) {
      if (bricks[i][j].isAlive) {
        ctx.rect(bricks[i][j].left, bricks[i][j].top, brickWidth, brickHeight);
        ctx.fillStyle = "gray";
        ctx.fill();
      }
    }
  }
  ctx.closePath();
}

// 충돌부분
function update() {
  //데이터 수정 도형의 위치 이동
  if (arcPosX - arcRadius < 0) {
    arcMoveX *= -1;
  } else if (arcPosX + arcRadius > canvas.width) {
    arcMoveX *= -1;
  }
  if (arcPosY - arcRadius < 0) {
    arcMoveY *= -1;
  } else if (arcPosY + arcRadius > canvas.height) {
    arcMoveY *= -1;
  }

  arcPosX += arcMoveX * arcSpd;
  arcPosY += arcMoveY * arcSpd;

  ball.left = arcPosX - arcRadius;
  ball.right = arcPosX + arcRadius;
  ball.top = arcPosY - arcRadius;
  ball.bottom = arcPosY + arcRadius;

  // ball이랑 paddle의 충돌부분
  if (isCollisionRectToRect(ball, paddle)) {
    arcMoveY *= -1;
    arcPosY = paddle.top - arcRadius;
  }
  // bricks와 ball의 충돌부분
  for (let i = 0; i < brickRow; i++) {
    for (let j = 0; j < brickColumn; j++) {
      if (bricks[i][j].isAlive && isCollisionRectToRect(ball, bricks[i][j])) {
        bricks[i][j].isAlive = false;
        arcMoveY = -arcMoveY;
        bricksCount--;
      }
    }
  }
  // gameWin();
  // gameOver();
}

// paddle이랑 arc의 좌표를 지정해서 통과되지 않게 해준다.
function isCollisionRectToRect(rectA, rectB) {
  // a의 완쪽과 b의 오른쪽
  // a의 오른쪽과 b의 왼쪽
  // a의 아래쪽과 b의 위쪽
  // a의 위쪽과 b의 아래쪽
  if (
    rectA.left > rectB.right || // a의 왼쪽이 더 클때
    rectA.right < rectB.left || // b의 왼쪽이 더 클때
    rectA.top > rectB.bottom || // a의 탑이 더 클때
    rectA.bottom < rectB.top
  ) {
    // b의 탑이 더 클때
    return false;
  }
  return true;
}

// 그리는 함수를 만들어준다.
function draw() {
  // 다른 도형 그리는곳 벽돌이나 공 같은 것들 여기에 바로그려도 되지만 여러가지를 그려야함으로 함수를 호출하는 방식으로 한다
  // 화면 클리어
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawArc();
  drawPaddle();
  drawBricks();
}

// 자바스크립트 타이밍 함수인  setInterval() 로 계속 반복실행할수있게 해준다
// 앞에는 계속 그릴 함수 뒤에는 몇초마다 실행될지 슷지(단위는 밀리초)
setBricks();
setInterval(draw, 10);
