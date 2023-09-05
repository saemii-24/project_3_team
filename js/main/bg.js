const mainTitle = document.querySelector('.main__title');
const sentence = [
  ['현지인들의', '휴식', '공간', '시드니하버에서', '와인', '한', '잔'],
  ['별이', '쏟아지는', '광활한', '사막', '울룰루에서의', '눈부신', '하루'],
  ['바다가', '보이는', '블루오션로드에서', '시원한', '드라이브'],
  ['크루즈에서', '상쾌한', '바닷바람과', '함께하는', '돌고래', '감상'],
  ['20세기', '증기기관차를', '타고', '떠나는', '숲속', '모험'],
];


let callTime = 0;
let wordNum = 0;
let sentenceNum = 0;

function show(timeStamp) {
  if (!callTime) {
    callTime = timeStamp;
  }

  const elapsed = timeStamp - callTime;
  const requestId = requestAnimationFrame(show);

  if (elapsed >= 300) {
    mainTitle.classList.remove('fadeOut');
    let span = document.createElement('span');
    span.innerHTML = `
  ${sentence[sentenceNum][wordNum]}
  `;
    mainTitle.append(span);
    mainTitle.classList.add('fadeOut');

      if (wordNum === sentence[sentenceNum].length - 1) {
        cancelAnimationFrame(requestId); // 모든 줄을 출력하면 애니메이션 종료
      }
      wordNum++;
      if (wordNum > sentence[sentenceNum].length - 1) { wordNum = 0; };
      callTime = timeStamp;
    }
  }


  requestAnimationFrame(show);
  setInterval(function () {
    requestAnimationFrame(show);
    sentenceNum++;

    mainTitle.innerText = '';
    mainTitle.classList.remove('fadeOut');

    if (sentenceNum > sentence.length - 1) {
      sentenceNum = 0;
    }
  }, 5000);



let gageBg = document.getElementById("main__bar--bg");
let gage = document.getElementById("main__bar--gage");
let gageWidth = gageBg.offsetWidth; 
window.addEventListener('resize',()=>{
  gageWidth = gageBg.offsetWidth; 
})

//mainBgChange
const mainBg = document.querySelector('.main__bg');
const mainBgImgs = [
  './images/main/main_1.png',
  './images/main/main_2.png',
  './images/main/main_3.png',
  './images/main/main_4.png',
  './images/main/main_5.png',
];
let index = 0;
let startTime = null;
let duration = 0;

function mainChange(callbackTime) {

  if (!startTime) startTime = callbackTime;
  duration = callbackTime - startTime;

  if(duration<5000){
      requestAnimationFrame(mainChange); 
    }else{
      startTime=null;
  }

  //mainbg부분
  if(index>mainBgImgs.length-1) index = 0;
  mainBg.style.backgroundImage = `url('${mainBgImgs[index]}')`;

  //단어
}
requestAnimationFrame(mainChange);
setInterval(()=>{requestAnimationFrame(mainChange); index++;},5000);
