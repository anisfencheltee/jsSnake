class Snake{
    forbidden = {
        up:'down',
        down:'up',
        right:'left',
        left:'right'
    }
    player = 0;
    direction = 'right';    
    directions = {
        right:[0,1],
        left:[0,-1],
        up:[-1,0],
        down:[1,0]
    }
    positions = [];
    points = 0;

    constructor(player){
        console.log('Creating Snake');
        this.player = player
    }
    
    getNextPosition(){
        var pos = this.positions[this.positions.length-1];
        var vektor = this.directions[this.direction];
        let row = pos[0]+vektor[0];
        let col = pos[1]+vektor[1];
        return [row,col];
    }

    getPosition(){
        return this.positions;
    }
    setPosition(pos){
        this.positions.push(pos);
    }

    updatePosition(positions){
        this.positions = positions;
    }

    allowMovement(){
        return this.movementAllowed;
     }
     restrictMovement(){
         this.movementAllowed = false;
     }
     setMovementFree(){
         this.movementAllowed =true;
     }

     setDirection(direction){
        if(direction!==this.forbidden[this.direction]){
            this.direction = direction
        }
    }
    getPlayer(){
        return this.player;
    }
    setPoints(points){
        this.points = points;
    }
    increasePoints(points){
        this.points = this.points+points;
    }
    getPoints(){
        return this.points;
    }
}