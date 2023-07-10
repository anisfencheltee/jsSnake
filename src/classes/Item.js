class Item{    
    types = {
        normal:{
            spawnRate: 90,
            points: 1,
            lifetime: -999
        },
        rare:{
            spawnRate: 8,
            points: 5,
            lifetime: 20000
        },
        ultra:{
            spawnRate: 2,
            points: 10,
            lifetime: 10000
        }
    }
    type;
    lifetime;
    constructor(row,col){
        this.setType()  
        this.currentPosition=[row,col]
    }
    setType(){
        let value = Math.floor(Math.random() * 100);
        if(value < this.types.normal.spawnRate){
            this.type = 'normal';
        }else if(value<this.types.rare.spawnRate+this.types.normal.spawnRate){
            this.type = 'rare';
        }else{
            this.type = 'ultra';
        }
        this.lifetime = this.types[this.type].lifetime;
    }
    getPointValue(){
        return this.types[this.type].points
    }
    
    getLifetime(){
        return this.lifetime;
    }
    reduceLifetime(milSeconds){
        this.lifetime -= milSeconds
    }
    isItemAlive(){
        return this.lifetime===-999||this.lifetime>0
    }
    getType(){
        return this.type;
    }
}