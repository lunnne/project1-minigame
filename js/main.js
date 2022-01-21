const itemSize = 75
const bug_count = 7
const idea_count = 4

const gameField = document.querySelector('.game-field');
const fieldRect = gameField.getBoundingClientRect();
const gameBtn = document.querySelector('.btn-play');
const gameTimer = document.querySelector('.timer');
const gameCounter = document.querySelector('.counter');
const statusBoard = document.querySelector('.status-board');
const replayBtn = document.querySelector('.btn-replay');
const statusMessage = document.querySelector('.status-message')
const introMessage = document.querySelector('.intro-message');
const intro = document.querySelector('.intro')
const closeBtn = document.querySelector('.btn-close')


introMessage.innerText = `Welcome to the programmer's office.
It is your first day of work. Your mission is to fix bugs in the code.

Catch the bugs in a limited time. 
Good luck😉.  

Be careful! 
Once you click the bomb💥, 
the game ends.
`

closeBtn.addEventListener('click', function(){
  intro.style.visibility = 'hidden'
})


//게임의 상태
let started = false; 
let counter = 0;
let myTimer = undefined;
let bugsTimer = 1000;


// BACKGROUND MUSIC 
let sound = {
  catchBug : new Howl ({
    src : ["../sound/Whooah.wav"]
  }),
  catchBomb : new Howl ({
    src : ["../sound/Cartoon Boing.mp3"]
  }),
  lose : new Howl ({
    src : ["../sound/lose.wav"],
  }),
  loselaugh : new Howl ({
    src : ["../sound/loselaugh.wav"]
  }) ,
  wow : new Howl ({
    src : ["../sound/Cheer.wav"]
  })

}

let bgm = {
  gameStart : new Howl ({
    src : ["../sound/Amazing Plan.mp3"],
    loop : false 
  })
}


gameField.addEventListener('click', (event) => onFieldClick(event));
gameField.addEventListener('mouseover', (event) => onFieldMouseOver(event));
gameField.addEventListener('mouseout', (event) => onFieldMouseOut(event));



// 이부분 로직을 꼭 기억하자, 
gameBtn.addEventListener('click', () => {
  if (started) {
    stopGame();
    gameField.innerHTML = ''
  } else {
    startGame();
  }
  // started = !started;
})

replayBtn.addEventListener('click', () => {
  hideStatusBoard();
  clearTimeout(myTimer);
  bugsTimer = 1000;
  startGame();
})

function startGame() {
  bugsTimer = 1000;
  started = true;
  counter = 0;
  playbgm();
  initGame();
  moveTimer();
  showStopButton();
  showTimerandCounter();
  startGameTimer();
}

function stopGame() {
  started = false;
  stopbgm();
  stopGameTimer();
  hideGameButton();
  gameField.innerHTML = ''
  showStatusBoard(`😉
  TRY AGAIN?`);
  clearTimeout(myTimer); 
}

function finishGame(win) {
  started = false;
  stopGameTimer();
  hideGameButton();
  stopbgm();
  gameField.innerHTML = ''
  playSoundEffect(win);
  showStatusBoard(win? 
  `👍 WOW 👍 
  ALL CLEAR!` 
  : `😈
  CODE ERROR`);
}

function playSoundEffect(win){
  if(win) {
    sound.wow.play();
  } else { sound.lose.play();
  sound.loselaugh.play();}
}

function showStopButton() {
  let icon = gameBtn.querySelector('.fas');
  icon.classList.add("fa-stop");
  icon.classList.remove("fa-play");
  gameBtn.style.visibility = 'visible';
}

function showTimerandCounter() {
  gameTimer.style.visibility = 'visible';
  gameCounter.style.visibility = 'visible';
}

function hideTimerandCounter() {
  gameTimer.style.visibility = 'hidden';
  gameCounter.style.visibility = 'hidden';
}

function startGameTimer() {
  let timeleft = 10;
  downloadTimer = setInterval(function () {  
    if (timeleft <= 0) {
      clearInterval(downloadTimer);
      clearTimeout(myTimer);
      finishGame(counter === bug_count);
    }
    gameTimer.innerText = `00:${('0' + timeleft).substr(-2)}`;
    timeleft -= 1;
  }, 1000);
}

function stopGameTimer() {
  clearInterval(downloadTimer);
}

function hideGameButton() {
  gameBtn.style.visibility = 'hidden'
}

function showStatusBoard(text) {
  statusMessage.innerText = text;
  statusBoard.classList.remove('status--hidden');
}

function hideStatusBoard() {
  statusBoard.classList.add('status--hidden');
}

// gamefield 안에서 일어나는 logic 

function onFieldClick(event) {
  if (!started) {
    return;
  }
  const target = event.target;
  if (target.matches('.bug')) {
    target.remove();
    sound.catchBug.play();
    counter++
    updateCounterBoard();
    if (counter === bug_count) {
      finishGame(true);
    }
  } else if (target.matches('.idea')) {
    sound.catchBomb.play();
    stopGameTimer(); 
    finishGame(false);
  }
}

function onFieldMouseOver (event) {
  const target = event.target;
  target.style.cursor = 'pointer';
  if (target.matches('.bug')) {
  target.style.transform = `scale(1.2, 1.2)`
  };
}

function onFieldMouseOut (event) {
  const target = event.target;
  target.style.transform = `scale(1, 1)`
}

function updateCounterBoard() {
  gameCounter.innerText = bug_count - counter;
}

function playbgm () {
 if(!bgm.gameStart.playing()) {
   bgm.gameStart.play();
 }
}

function stopbgm () {
    bgm.gameStart.stop();
 }

// x axis = [0 - 800];
// y axis = [350, 500]

function initGame() {
  gameField.innerHTML = ''
  gameCounter.innerText = bug_count
  addItem('idea', idea_count, '../images/explosion.png');
  addItem('bug', bug_count, '../images/bug-report.png');
}

function addItem(className, itemNumber, imgPath) {
  for (let i = 0; i < itemNumber; i++) {
    const itemImg = document.createElement('img')
    itemImg.setAttribute('class', className)
    itemImg.src = imgPath
    itemImg.style.width = `${itemSize}px`
    itemImg.style.height = `${itemSize}px`
    itemImg.style.position = 'absolute'
    gameField.appendChild(itemImg)

    const x = fieldRect.x
    const y = fieldRect.y - 150
    const maxX = fieldRect.right - itemSize
    const maxY = fieldRect.height - itemSize
    
    itemImg.style.left = `${Math.floor(Math.random() * (maxX - x))}px`
    itemImg.style.top = `${y + Math.floor(Math.random() * (maxY - y))}px`
  }
}

function moveItems() {
  let bug = document.getElementsByClassName('bug');
  
  for (let i = 0; i < bug.length ; i++) {

    const x = fieldRect.x
    const y = fieldRect.y - 150
    const maxX = fieldRect.right - itemSize
    const maxY = fieldRect.height - itemSize

    bug[i].style.left= `${Math.floor(Math.random() * (maxX - x))}px`; // horizontal  movment
    bug[i].style.top= `${y + Math.floor(Math.random() * (maxY - y))}px`; // vertical movment
  }
}

function moveTimer() {
  moveItems();
  myTimer = setTimeout('moveTimer()', bugsTimer);
}
