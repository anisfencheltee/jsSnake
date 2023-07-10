var game = new Game();
var cookieManager = new CookieManager();
var touchManager = new TouchManager(game);
var players = 1;
let gameMode = 'classic';
var controls = {
    ArrowUp:{
        player:1,
        direction:'up'
    },
    ArrowDown:{
        player:1,
        direction:'down'
    },
    ArrowLeft:{
        player:1,
        direction:'left'
    },
    ArrowRight:{
        player:1,
        direction:'right'
    },
    w:{
        player:2,
        direction:'up'
    },
    s:{
        player:2,
        direction:'down'
    },
    a:{
        player:2,
        direction:'left'
    },
    d:{
        player:2,
        direction:'right'
    },
}
play = function(e){    
    console.log(e.id)
    let difficulty = cookieManager.getCookie('difficulty')
    let mode = cookieManager.getCookie('mode')
    let size = cookieManager.getCookie('size')        
    let mpItems = cookieManager.getCookie('mpItems')     
    let mpSpawnRate = cookieManager.getCookie('mpSpawnRate');
    let mpHyper = cookieManager.getCookie('mpHyper');
    if(difficulty!==''){
        game.setDifficulty(difficulty);
    }
    if(mode!==''){
        game.setMode(mode);
    }
    if(size!==''){
        game.setTiles(size);
    }    
    if(mpItems!==''){
        game.setMpItems(mpItems==='true');
    }
    if(mpSpawnRate !== ''){
        game.setMpSpawnrate(mpSpawnRate);
    }
    if(mpHyper !== ''){
        game.setHyperMode(mpHyper==='true');
    }
    if(e.id==='classic'){
        gameMode = e.id;
    }else if(e.id === 'timeAttack'){
        gameMode = e.id;
    }    
    game.menuManager.showOverlay('countDown') 
    game.setGameMode(gameMode);
    game.start(players)    
}

setSelect=function(id,value){
    let select = document.getElementById(id)
    for(var i, j = 0; i = select.options[j]; j++) {
        if(i.value == value) {
            select.selectedIndex = j;
            break;
        }
    }
}
setOptions = function(){
    let difficulty = cookieManager.getCookie('difficulty');
    let mode = cookieManager.getCookie('mode');
    let size = cookieManager.getCookie('size');
    let mpItems = cookieManager.getCookie('mpItems');
    let mpSpawnRate = cookieManager.getCookie('mpSpawnRate')
    let mpHyper = cookieManager.getCookie('mpHyper')
    if(difficulty!==''){
        setSelect('difficultySelect',difficulty);
    }
    if(mode!==''){
        setSelect('gamemodeSelect',mode);
    }
    if(size!==''){
        setSelect('sizeSelect',size);
    }
    if(mpItems !==''){
        document.getElementById('mpItems').checked = mpItems==='true'
    }    
    if(mpSpawnRate!==''){
        setSelect('mpSpawnRate',mpSpawnRate);
    }
    if(mpHyper !==''){
        document.getElementById('mpHyper').checked = mpHyper==='true'
    }
}

showMenu=function(e){    
    if(e.id ==='single'){
        players = 1;
    }else if(e.id!=='playAgain'){        
        players = 2;            
    }
    game.menuManager.showOverlay(e.dataset.target);
    if(e.id==='options'){
        setOptions();
    }    
}

saveAndBack=function(){
    let difficulty = document.getElementById('difficultySelect').value;
    let mode = document.getElementById('gamemodeSelect').value;
    let size = document.getElementById('sizeSelect').value;
    let mpItems = document.getElementById('mpItems').checked;
    let mpSpawnRate = document.getElementById('mpSpawnRate').value;
    let mpHyper = document.getElementById('mpHyper').checked;
    cookieManager.setCookie('difficulty',difficulty,365);
    cookieManager.setCookie('mode',mode,365);
    cookieManager.setCookie('size',size,365);
    cookieManager.setCookie('mpSpawnRate',mpSpawnRate,365);
    cookieManager.setCookie('mpItems',mpItems,365);
    cookieManager.setCookie('mpHyper',mpHyper,365);
    back();
}

back=function(){
    game.menuManager.showOverlay('menu');
}


document.addEventListener("keydown", (e) => {
    e = e || window.event;
    if (Object.keys(controls).includes(e.key) &&  game.allowMovement(controls[e.key].player)) {
        game.restrictMovement(controls[e.key].player);
        game.setDirection(controls[e.key].player,controls[e.key].direction);
    } else if((game.gameOver || game.allowMovement(1)) && e.key==='Enter'){
        game.restrictMovement(1);
        game.gameOver = true;
        game.start();
    }
});
setOptions();

