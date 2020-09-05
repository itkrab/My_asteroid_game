const turret = document.querySelector("#turret");
const game = document.querySelector(".game")
const GameHeight = parseFloat(window.getComputedStyle(document.querySelector(".game")).height);
const turretMoveSpeed = 10;
var gameStarted = false;

var turretMoveUpInterval;
var turretMoveDownInterval;

var upFlag = false;
var downFlag = false;


// turret movement---------------------------------------------------------
document.addEventListener("keydown",function(e){
	//moveUp
	if(e.keyCode == 38 || e.keyCode == 87) {
		if (!upFlag) {
			upFlag = true
			turretMoveUpInterval = setInterval(moveUp,40)
		} else {
			return
		}
	}
	//moveDown
	if (e.keyCode == 40 || e.keyCode == 83) {
		if(!downFlag) {
			downFlag = true
			turretMoveDownInterval = setInterval(moveDown,40)
		} else {
			return
		}
	}
});

document.addEventListener("keyup",function(e){
	if(e.keyCode == 38 || e.keyCode == 87) {
		upFlag = false;
		clearInterval(turretMoveUpInterval)
	}
	if (e.keyCode == 40 || e.keyCode == 83) {
		downFlag = false;
		clearInterval(turretMoveDownInterval)
	}
})

function moveUp(){
	let turretStyle = window.getComputedStyle(turret);
	let turretFromTop = parseFloat(turretStyle.top);
	if(turretFromTop < turretMoveSpeed) {
		turret.style.top = 0;
		return
	}
	turret.style.top = `${turretFromTop - turretMoveSpeed}px`
}

function moveDown() {
	let turretStyle = window.getComputedStyle(turret);
	let turretFromTop = parseFloat(turretStyle.top);
	let turretHeight = parseFloat(turretStyle.height);

	if(turretFromTop + turretHeight + turretMoveSpeed > GameHeight) {
		turret.style.top = `calc(100% - ${turretHeight}px)`
		return
	}
	turret.style.top = `${turretFromTop + turretMoveSpeed}px`
}
// turret movement end-----------------------------------------------------

// turret shoot------------------------------------------------------------
var shootInterval;
var shootFlag = false
var shootSpeed = 150; // ms
var bulletSpeed = 10; // px
var moveBulletsInterval = setInterval(moveBullets,20)



document.addEventListener("keypress",function(e){
	if(e.keyCode == 32) {
		shoot()
		if (!shootFlag) {
			shootFlag = true
			shootInterval = setInterval(shoot,shootSpeed);
		} else {
			return
		}
	}
})
document.addEventListener("keyup",function(e){
	if(e.keyCode == 32) {
		shootFlag = false;
		clearInterval(shootInterval)
	}
})

function shoot () {
	let turretStyle = window.getComputedStyle(turret);
	let turretFromTop = parseFloat(turretStyle.top) + (parseFloat(turretStyle.height) / 2) - 2.5;
	let turretFromRight = parseFloat(turretStyle.right);

	let divString = `<div class="bullet" style="top:${turretFromTop}px; right:${turretFromRight}px;"></div> `
	game.insertAdjacentHTML("afterBegin",divString);
}

function moveBullets () {
	document.querySelectorAll(".bullet").forEach((item)=> {
		bulletFromRight = parseFloat(item.style.right);
		if (bulletFromRight <= 0) {
			item.remove()
		}
		item.style.right = `${bulletFromRight - bulletSpeed}px`
	})
}

// turret shoot end--------------------------------------------------------

// enemies spawn-----------------------------------------------------------

var SpawnEnemiesInterval;
var EnemiesSpawnSpeed = 1000 // ms

function spawnEnemy1 (top) {
	if (top >= GameHeight - 30) {
		top -= 30
	}
	let enemyString = `<div class="enemy1 enemy" style="top:${top}px"></div>`
	game.insertAdjacentHTML("afterBegin",enemyString);
}
function spawnEnemy2 (top) {
	if (top >= GameHeight - 25) {
		top -= 25
	}
	let enemyString = `<div class="enemy2 enemy" style="top:${top}px"></div>`
	game.insertAdjacentHTML("afterBegin",enemyString);
}
function RandomTop () {
	return Math.floor(Math.random() * GameHeight)
}
function spawnThemAll () {
	let whotoSpawn = Math.round(Math.random());
	whotoSpawn === 1 ? spawnEnemy1(RandomTop()) : spawnEnemy2(RandomTop())
}

document.addEventListener("keydown",function() {
	if (!gameStarted) {
		SpawnEnemiesInterval = setInterval(spawnThemAll,EnemiesSpawnSpeed);
		gameStarted = true
	}
})

// enemies spawn end-------------------------------------------------------

// enemies movement--------------------------------------------------------
var enemyMoveSpeed = 3; //px
var moveEnemiesFlag = false;
var moveEnemiesInterval;

function moveEnemies () {
	document.querySelectorAll(".enemy").forEach((enemy) => {
		let enemyFromRight = parseFloat(window.getComputedStyle(enemy).right);
		if(enemyFromRight >=350) {
			enemyBreach(enemy)
			enemy.remove()
		}
		enemy.style.right = `${enemyFromRight + enemyMoveSpeed}px`
	})
}
document.addEventListener("keydown",function() {
	if(!moveEnemiesFlag) {
		moveEnemiesFlag = true;
		moveEnemiesInterval = setInterval(moveEnemies,40)
	}
})

// enemies movement end----------------------------------------------------

// collison detection------------------------------------------------------
var checkCollisionInterval;
var checkFlag = false;

document.addEventListener("keydown",function(){
	if(!checkFlag) {
		checkFlag = true;
		checkCollisionInterval = setInterval(checkAll,20)
	}
})

function collisionDetection (enemy,bullet) {
	let enemyStyles = window.getComputedStyle(enemy);
	let enemyTop = parseFloat(enemyStyles.top)
	let enemyRight = parseFloat(enemyStyles.right)
	let enemyBottom = parseFloat(enemyStyles.bottom)
	let enemyLeft = parseFloat(enemyStyles.left)
	let enemyHeight = parseFloat(enemyStyles.height)
	let enemyWidth = parseFloat(enemyStyles.width)

	let bulletStyles = window.getComputedStyle(bullet);
	let bulletTop = parseFloat(bulletStyles.top)
	let bulletRight = parseFloat(bulletStyles.right)
	let bulletBottom = parseFloat(bulletStyles.bottom)
	let bulletLeft = parseFloat(bulletStyles.left)
	let bulletHeigth = parseFloat(bulletStyles.heigth)
	let bulletwidth = parseFloat(bulletStyles.width)

	if(enemyTop > bulletTop || enemyRight > bulletRight || enemyBottom > bulletBottom || enemyLeft > bulletLeft) {
		return false
	} else {
		return true
	}
}
function checkAll () {
	let arrForDel = []
	document.querySelectorAll(".enemy").forEach((enemy)=>{
		document.querySelectorAll(".bullet").forEach((bullet) => {
			if(collisionDetection(enemy,bullet)) {
				arrForDel.push(bullet);
				arrForDel.push(enemy);
				sortEnemyDeath(enemy)
			}
		})
	})
	arrForDel.forEach(item => item.remove())
}


// points/img after kill----------------------------
function sortEnemyDeath (enemy) {
	if(enemy.classList.value.indexOf("enemy1") !== -1) {
		enemy1Death(enemy);
		return
	}
	if(enemy.classList.value.indexOf("enemy2") !== -1) {
		enemy2Death(enemy);
		return
	}
}

function enemy1Death (enemy) {
	let Etop = parseFloat(window.getComputedStyle(enemy).top)
	let Eleft = parseFloat(window.getComputedStyle(enemy).left)
	let plus100 = `<div class="plus100" style="top:${Etop}px; left:${Eleft}px;);"></div>`
	game.insertAdjacentHTML("afterBegin",plus100);
	let currentExp = document.querySelector(".plus100")
	setTimeout(removeDeathBlock,200,currentExp)
	addPoints(100)
}
function enemy2Death (enemy) {
	let Etop = parseFloat(window.getComputedStyle(enemy).top)
	let Eleft = parseFloat(window.getComputedStyle(enemy).left)
	let plus200 = `<div class="plus200" style="top:${Etop}px; left:${Eleft}px;);"></div>`
	game.insertAdjacentHTML("afterBegin",plus200);
	let currentExp = document.querySelector(".plus200")
	setTimeout(removeDeathBlock,200,currentExp)
	addPoints(200)
}
function removeDeathBlock(enemy) {
	enemy.remove()
}
// points/img after kill end------------------------

// addPoints -----------------------
var spanScore = document.querySelector(".spanScore")
function addPoints(val) {
	let currScore = parseFloat(spanScore.innerText);
	spanScore.innerText = currScore + val
}
// addPoints end--------------------------

// enemyBreach--------------------------
function enemyBreach (enemy) {
	let Etop = parseFloat(window.getComputedStyle(enemy).top)
	let portal = `<div class="portal" style="top:${Etop}px;);"></div>`;
	game.insertAdjacentHTML("afterBegin",portal);
	let currentPortal = document.querySelector(".portal")
	setTimeout(removeDeathBlock,300,currentPortal)
}