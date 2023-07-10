var game = new Game();
var cookieManager = new CookieManager();
var touchManager = new TouchManager(game);
var players = 1;
let gameMode = 'classic';
let options = {
    difficulty:{
        elementId:'difficultySelect',
        elementType:'select',
        gameFunction:game.setDifficulty.bind(game)
    },
    mode:{
        elementId:'gamemodeSelect',
        elementType:'select',
        gameFunction:game.setMode.bind(game)
    },
    size:{
        elementId:'sizeSelect',
        elementType:'select',
        gameFunction:game.setTiles.bind(game)
    },
    mpItems:{
        elementId:'mpItems',
        elementType:'checkbox',
        gameFunction:game.setMpItems.bind(game)
    },
    mpSpawnRate:{
        elementId:'mpSpawnRate',
        elementType:'select',
        gameFunction:game.setMpSpawnrate.bind(game)
    },
    mpHyper:{
        elementId:'mpHyper',
        elementType:'checkbox',
        gameFunction:game.setHyperMode.bind(game)

    }

}
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
    for(let option in options){
        let optionDetails = options[option]
        let cookieValue = cookieManager.getCookie(option);
        if(cookieValue!==''){
            if(optionDetails.elementType !== 'checkbox'){
                optionDetails.gameFunction(cookieValue);
            }else{
                optionDetails.gameFunction(cookieValue==='true');
            }
        }        
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
    for(let option in options){
        let optionDetails = options[option]
        let cookieValue = cookieManager.getCookie(option);
        if(cookieValue!==''){
            if(optionDetails.elementType !== 'checkbox'){
                setSelect(optionDetails.elementId,cookieValue)
            }else{
                document.getElementById(optionDetails.elementId).checked = cookieValue==='true'
            }
        }        
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
    for(let option in options){
        let optionDetails = options[option]          
        let cookieValue = '';      
        if(optionDetails.elementType !== 'checkbox'){
            cookieValue = document.getElementById(optionDetails.elementId).value;;                
        }else{
            cookieValue = document.getElementById(optionDetails.elementId).checked;                
        }
        cookieManager.setCookie(option,cookieValue,365);                
    }    
    back();
}

back=function(){
    game.menuManager.showOverlay('menu');
}

unpauseGame=function(){
    game.unpause();
}

document.addEventListener("keydown", (e) => {
    e = e || window.event;
    if (Object.keys(controls).includes(e.key) &&  game.allowMovement(controls[e.key].player)) {
        game.restrictMovement(controls[e.key].player);
        game.setDirection(controls[e.key].player,controls[e.key].direction);
    } else if(e.key==='Escape'){
        if(game.pause){            
            unpauseGame();
        }else if(!game.gameOver){            
            game.pauseGame();        
        }        
    }
});
setOptions();

