// 캔버스 설정하기
// 캔버스에 그리기위해서 2D rendering context 를 ctx에 저장한다.
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// 변수로 arc의 x, y를 지정해준다 움직이는 좌표값도 지정해준다
let arcPosX = canvas.width / 2; // arc의 시작점
let arcPosY = canvas.height / 2;
let arcMoveX = 1; // arc의 방향
let arcMoveY = 1;
let arcRadius = 20; // arc의 반지름 값



//공만들기
function drawArc() {
  ctx.beginPath();
  // 공을 움직이기 위해서는 x, y를 숫자가아닌 좌표로 만들어야된다.
  ctx.arc(arcPosX, arcPosY, arcRadius, 0, Math.PI * 2); // (x, y, 반지름, 시작 도수)
  ctx.fillStyle = "red"; // 공의 색깔
  ctx.fill();
  ctx.closePath();
}

function upDate() {
  //데이터 수정 도형의 위치 이동
  if (arcPosX - arcRadius< 0) 
  {
    arcMoveX = 1;
  } 
  else if (arcPosX + arcRadius> canvas.width) 
  {
    arcMoveX = -1;
  }

  if (arcPosY - arcRadius < 0) 
  {
    arcMoveY = 1;
  } 
  else if (arcPosY + arcRadius > canvas.height) 
  {
    arcMoveY = -1;
  }
}

// 그리는 함수를 만들어준다.
function draw() {
  // 다른 도형 그리는곳 벽돌이나 공 같은 것들 여기에 바로그려도 되지만 여러가지를 그려야함으로 함수를 호출하는 방식으로 한다
  // 화면 클리어
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawArc();
  arcPosX += arcMoveX;
  arcPosY += arcMoveY;
}

// 자바스크립트 타이밍 함수인  setInterval() 로 계속 반복실행할수있게 해준다
// 앞에는 계속 그릴 함수 뒤에는 몇초마다 실행될지 슷지(단위는 밀리초)
setInterval(upDate, 10);
setInterval(draw, 10);
