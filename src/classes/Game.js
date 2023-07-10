class Game {
    initialized = false;
    modes={
        snake1:1,
        snake2:2        
    }
    counting = false;
    mode = 2;
    ruleset = 'snake2'
    countdown = 5;
    movementAllowed = false;
    minInterval = 6;
    countDownDuration = 1000;
    gameMode = classic;
    timer = 90000;    
    difficulty = {
        impossible: {
            speed:15,
            modifier:40
        },
        hard:{
            speed:30,
            modifier:20,
        },
        medium:{
            speed:50,
            modifier:10
        },
        easy:{
            speed:100,
            modifier:10
        }
        ,
        debug:{
            speed:10000,
            modifier:10
        }
    }
    tiles = 40;
    difficultySettings = {
        speed:50,
        modifier:10
    }
    items = [];
    snakes = [];
    currentInterval;
    points = 0;
    field = [];
    lastReduced = 0;
    reducer = 0;
    multiplayerItems = false;
    multiplayerItemsSpawnRate = 10;
    multiplayerHyperMode = false;
    multiplayerHyperModifier = 2;
    gameOver = false;
    constructor(){
        console.log('Creating Game');
        this.timeManager = new TimeManager();
        this.menuManager = new MenuManager();
    }
    initialize = function(tiles=40){
        this.initialized = true;
        this.initializeValues();
        this.tiles = tiles;
        this.createTiles(tiles);
        this.initializeField(tiles);        
    }
    initializeValues(){
        const elements = document.querySelectorAll('.active');
        elements.forEach((element) => {
            element.classList.remove('active');
        });
        const items = document.querySelectorAll('.item');
        items.forEach((item) => {
            item.classList.remove('item');
        });
        this.points = 0;
        this.positions = [];
        this.snakes = [];
        this.currentInterval = 0;
        this.lastReduced = 0;
        this.reducer = 0;
        this.countdown = 5;
        this.direction = 'right';
        this.timer = 90000;
        this.items = [];        
        this.resetField();
    }
    clearField(){
        var field = document.getElementById("field");
        while (field.firstChild) {
            field.removeChild(field.lastChild);
        }
        this.field = [];
    }
    createTiles = function(tiles){
        var field = document.getElementById("field");
        field.style.gridTemplateColumns = "repeat("+tiles+",1fr)";
        for(var i = 0; i<tiles*tiles; i++){
            var element = document.createElement('div');
            element.classList.add('tile');
            field.append(element);
        }      
    }
    initializeField(tiles=40){
        var index = 0;
        for(var i = 0; i<tiles; i++){
            var cols = [];
            for(var j = 0; j<tiles; j++){
                var tile = new Tile();
                var elements = document.getElementsByClassName('tile');    
                tile.setField(elements[index])                
                cols.push(tile);
                index++;
            }
            this.field.push(cols);
        }
    }
    resetField(){
        for(let i =0;i<this.field.length;i++){
            for(var j = 0; j<this.field.length; j++){
                this.field[i][j].deactivate();
            }
        }
        let scores = Array.from(document.getElementsByClassName('scores'))
        scores.forEach(score=>score.classList.add('hidden'))

    }
    start = function(players = 1){
        if(!this.initialized){
            this.initialize(this.tiles);
        }else{
            this.initializeValues();
        }       
        for(let i = 0; i< players; i++){
            this.snakes.push(new Snake(i));
        } 
        document.getElementById('field').classList.add(this.ruleset)     
        let countDown = document.getElementById('countDown');
        countDown.innerHTML = this.countdown; 
        countDown.offsetHeight;
        this.snakes.forEach((snake,index)=>{
            this.setStartPosition(snake);
            this.menuManager.showScoreboard(index)
        })  
        this.menuManager.setTimer(this.timeManager.millisToMinutesAndSeconds(this.timer))
        this.menuManager.setTimerVisibility(this.gameMode==='timeAttack')
        this.currentInterval = this.difficultySettings['speed'];
        countDown.classList.add('animate')
        setTimeout(this.countDown.bind(this),this.countDownDuration)
    }

    countDown(){
        let countDown = document.getElementById('countDown');
        this.counting = true;       
        this.countdown --;        
        countDown.classList.remove('animate')
        countDown.offsetHeight;
        countDown.innerHTML = this.countdown;         
        this.fadeOutOverlay(this.countdown);      
        countDown.classList.add('animate')   
        if(this.countdown===0){
            countDown.classList.remove('animate')
            this.menuManager.hideOverlay();            
            this.gameOver = false;              
            this.tick();            
            var gameLoop = setTimeout(this.loop.bind(this),this.currentInterval);   
        }else if(this.counting){              
            setTimeout(this.countDown.bind(this),this.countDownDuration)

        }
    }

    fadeOutOverlay(reducer){        
        let opacity = 0.8
        if(reducer > 0){
            opacity = opacity - (0.8 / (reducer+0.5));        
        }else{
            opacity = 0;
        }
        let bg = 'rgba(0, 0, 0, '+opacity+')'        
        document.getElementById('overlay').style.backgroundColor = bg;
    }
    loop(){
        this.counting = false;
        this.tick();
        var reducer = this.reducer;
        if(this.points >this.lastReduced && this.points%this.difficultySettings['modifier']===0){
            reducer = this.points/this.difficultySettings['modifier'];
            this.currentInterval = this.currentInterval-reducer>=this.minInterval?this.currentInterval-reducer:this.minInterval;
            this.lastReduced = this.points;
        }
        if(!this.gameOver){
            setTimeout(this.loop.bind(this),this.currentInterval);
        }
    }
    tick(){
        this.updateItems();
        if(this.gameMode==='timeAttack'){
            this.updateTimer();        
        }        
        this.snakes.forEach((snake)=>{
            this.move(snake)    
            if(!snake.allowMovement()){
                snake.setMovementFree();
            }
            this.menuManager.setPointCounter(snake);            
        })      
        let length = this.items.length
        if(Object.entries(this.items).length===0 || this.noNormalItemsOnField()){            
            let itemType = 'normal'
            if(this.multiplayerItemWillBeSpawned()){
                itemType = 'multiplayer'
            }
            this.spawnItem(itemType);
        }
    }
    multiplayerItemWillBeSpawned(){
        if(this.snakes.length > 1 && this.multiplayerItems){
            let probability = Math.floor(Math.random() * 100);        
            return probability < this.multiplayerItemsSpawnRate;  
        }        
        return false;
    }
    move = function(snake){
        let positions = snake.getPosition()
        let nextPos = snake.getNextPosition();
        var row = this.mode===2?this.saveGetPosition(nextPos[0]):nextPos[0];
        var col = this.mode===2?this.saveGetPosition(nextPos[1]):nextPos[1];  
        let player = snake.getPlayer();
        let newPos = [row,col]             
        let event = this.collisionDetection(newPos,player);
        switch(event){
            case 'item':                
                let field = this.field[newPos[0]][newPos[1]];
                let item = field.getItem();
                field.removeItem()
                delete this.items[newPos[0]+','+newPos[1]]
                field.activate(player);
                if(item.getType()!=='multiplayer'){
                    snake.increasePoints(item.getPointValue());  
                    this.points +=1;              
                }else{
                    this.handleMpItem(snake, item);
                }             
                break;
            case 'blocked':
            case 'snake':
            case 'outOfBounds':                
                if(this.gameMode === 'classic'){
                    this.gameOver = true;
                    this.gameIsOverNow(player);                
                }else{
                    if(event==='outOfBounds'){
                        this.playDamageAnimation();                       
                        row = nextPos[0];
                        col = nextPos[1];  
                        newPos = [row,col]
                        this.field[positions[0][0]][positions[0][1]].deactivate();
                        this.field[newPos[0]][newPos[1]].activate(player);
                        positions.splice(0,1);                                 
                        let points = snake.getPoints() - 10;
                        snake.setPoints(points)                                               
                    }else{
                        this.playDamageAnimation(); 
                        row = this.saveGetPosition(nextPos[0]);
                        col = this.saveGetPosition(nextPos[1]);  
                        newPos = [row,col]
                        this.field[positions[0][0]][positions[0][1]].deactivate();
                        this.field[newPos[0]][newPos[1]].activate(player);
                        positions.splice(0,1);                            
                        let points = snake.getPoints() - 10;
                        snake.setPoints(points)                                                                      
                    }        
                } 
                break;
            default:                
                this.field[newPos[0]][newPos[1]].activate(player);
                if(snake.willBeLonger()){
                    snake.gotElongated();
                }else{
                    let reducer = 1;
                    if(snake.willBeShorter() && positions.length>1){
                        snake.gotShortened();   
                        reducer = 2;                     
                    }else if(snake.willBeShorter()){
                        snake.shorten(-1)
                    }
                    while(reducer>0){
                        this.field[positions[0][0]][positions[0][1]].deactivate();
                        positions.splice(0,1);
                        reducer --
                    }                    
                }                
        }     
        positions[positions.length]=newPos;        
        snake.updatePosition(positions);
    }

    handleMpItem(snake,item){
        let points = 0;        
        let player = snake.getPlayer();
        let index = player===0?1:0;
        let otherPlayer = this.snakes[index]        
        let value = this.multiplayerHyperMode?item.getValue()*this.multiplayerHyperModifier:item.getValue()
        switch(item.getMpItemType()){            
            case 'getPoints':                
                points = snake.getPoints() + value;
                snake.setPoints(points)          
                break;
            case 'removePoints':                          
                points = otherPlayer.getPoints() + value;
                otherPlayer.setPoints(points)                          
                break;
            case 'stealPoints':
                points = snake.getPoints() + value;
                snake.setPoints(points)                          
                points = otherPlayer.getPoints() - value;
                otherPlayer.setPoints(points)                          
                break;
            case 'shorten':
                snake.shorten(value)
                break;
            case 'elongate':                
                otherPlayer.elongate(value)                          
                break;
            default:
                console.log("Not knowing how to handle:")
                console.log(item.getMpItemType())
        }        
    }

    noNormalItemsOnField(){
        var noNormalItems=true;
        for(const[index,item] of Object.entries(this.items)){
            if(item.getType()==='normal'){
                noNormalItems = false;
                break;
            }
        }
        return noNormalItems;
    }
    updateItems(){
        let removeItems = [];
        for(let index in this.items){
            let item = this.items[index];
            let position = index.split(',');                      
            if(!item.isItemAlive()){
                removeItems.push(index);
            }else{
                if(item.getLifetime()!==-999){
                    item.reduceLifetime(this.currentInterval);  
                }
            }
            if(item.getLifetime()<5000 && item.getLifetime()>-999){
                this.field[position[0]][position[1]].setItemClass('evenCloser')
            } else if(item.getLifetime()<10000 && item.getLifetime()>-999){
                this.field[position[0]][position[1]].setItemClass('almosteGone')
            }
        }
        for(let index in removeItems){
            let pos = removeItems[index].split(',');
            let field = this.field[pos[0]][pos[1]];
            field.removeItem()            
            delete this.items[removeItems[index]];
        }
    }

    playDamageAnimation(){
        let circle = document.getElementById('damage');  
        circle.classList.add('animate')  
        circle.innerHTML = "-10"
        setTimeout(function(){            
            let circle = document.getElementById('damage');  
            circle.innerHTML = ""
            circle.classList.remove('animate')
        },450)  
    }
    updateTimer(){
        this.timer = this.timer - this.currentInterval;
        let timeInMinutes = this.timeManager.millisToMinutesAndSeconds(this.timer);                
        if(this.timer<0){
            this.gameOver = true;
            this.gameIsOverNow();    
        }else{
            this.menuManager.setTimer(timeInMinutes)      
        }
    }
    gameIsOverNow(crashedPlayer=0){                
        if(this.snakes.length>1){              
            this.winner = 0;       
            if(this.gameMode==='classic'){
                for(const[index, snake] of this.snakes.entries()){
                    if(index!==crashedPlayer)this.winner=index;
                }   
            }else{
                let winningPoints = 0;
                for(const[index, snake] of this.snakes.entries()){
                    if(snake.getPoints()>winningPoints)this.winner=index;
                }   
            }                          
            this.menuManager.chickenDinner(true,this.winner)
        }else{
            this.menuManager.chickenDinner(false);
        }
        this.menuManager.showOverlay('gameOver');
    }
    spawnItem(type = 'normal'){
        var spawnRow = Math.floor(Math.random() * this.tiles);
        var spawnCol = Math.floor(Math.random() * this.tiles);  
        while(this.field[spawnRow][spawnCol].active){
            var spawnRow = Math.floor(Math.random() * this.tiles);
            var spawnCol = Math.floor(Math.random() * this.tiles);
        }         
        if(type==='normal'){
            this.field[spawnRow][spawnCol].addItem(spawnRow,spawnCol);                   
        }else{
            this.field[spawnRow][spawnCol].addMPItem(spawnRow,spawnCol);                   
        }
        let item = this.field[spawnRow][spawnCol].getItem()        
        this.items[spawnRow+','+spawnCol] = item;
        if(item.getType()!=='normal' &&this.items.length<10){
            this.spawnItem();
        }
    }
    
    setStartPosition = function(snake){    
        var offset = Math.floor(this.tiles/4);
        var startRow = this.getRandomInInterval(offset,this.tiles-offset);
        var startCol = this.getRandomInInterval(offset,this.tiles-offset);        
        this.field[startRow][startCol].activate(snake.getPlayer());        
        snake.setPosition([startRow,startCol])
    }
    
    collisionDetection(pos,player){
        let problem = '';
        if(pos[0]<0
            ||pos[1]<0
            ||pos[0]>=this.field.length
            ||pos[1]>=this.field[0].length){
            problem = 'outOfBounds';
            console.log(problem)
            return problem;
        }
        var field = this.field[pos[0]][pos[1]]
        if(field.item){            
            problem = 'item';
        }else if(field.active){
            problem = 'snake';
        }        
        return problem;
    }
    saveGetPosition(pos){
        var position= 0;
        if(pos>0 && pos<this.tiles){
            position = pos
        }else{
            position = pos<0?this.tiles-1:0;
        }
        return position;
    }
    
    getCurrentInterval(){
        return this.currentInterval;
    }
    
    getRandomInInterval(min = 0, max = this.tiles){
        return Math.floor(Math.random() * (max - min) + min);
    }
    
    setDifficulty(difficulty){
        this.difficultySettings = this.difficulty[difficulty];
    }
    setMode(mode){
        this.mode = this.modes[mode]
    }
    setTiles(size){
        this.clearField();
        this.initialize(parseInt(size))
    }
    setMpItems(mpItems){
        this.multiplayerItems = mpItems;
    }
    setHyperMode(hyper){
        this.multiplayerHyperMode = hyper;
    }
    setMpSpawnrate(rate){
        this.multiplayerItemsSpawnRate = rate
    }
    setDirection(player,direction){
        player = player-1
        if(this.snakes[player]){
            this.snakes[player].setDirection(direction);
        }
    }
    allowMovement(player){
        player = player-1
        if(this.snakes[player]){
            return this.snakes[player].allowMovement();
        }
        return false;
    }

    restrictMovement(player){
        player = player-1
        if(this.snakes[player]){
            this.snakes[player].restrictMovement();
        }
    }
    setGameMode(gameMode){
        this.gameMode = gameMode;
    }    
}
