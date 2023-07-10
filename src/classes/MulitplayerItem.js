class MultiplayerItem{
    types = {
        common:{
            spawnRate: 50,
            items:[
                {
                    name:'getPoints',
                    value:5
                },{
                    name:'removePoints',
                    value:-5
                }                
            ],            
            lifetime:20000            
        },
        rare:{
            spawnRate: 30,            
            items:[
                {
                    name:"shorten",
                    value:6              
                }                                
            ],
            lifetime:15000            
        },
        ultra:{
            spawnRate: 20,
            items:[
                {
                    name:"elongate",
                    value:8
                },{
                    name:"stealPoints",
                    value:8
                }                
            ],
            lifetime:10000            
        }
    }                          
    type=''
    config;
    constructor(){
        this.setType()        
    }
    setType(){
        let value = Math.floor(Math.random() * 100);
        let config = [];
        if(value<this.types.common.spawnRate){            
            config = this.types.common;
        }else if(value<this.types.rare.spawnRate+this.types.common.spawnRate){
            config = this.types.rare
        }else{
            config = this.types.ultra
        }
        this.getItemData(config)
    }
    getItemData(config){
        let index = 0
        if(config.items.length!==1){        
            index = Math.floor(Math.random() * 2);            
        }                
        this.item = config.items[index]
        this.type = config.items[index].name                
        this.lifetime = config.lifetime;            
    }
    getValue(){
        return this.item.value;
    }
    getMpItemType(){
        return this.type;
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
        return 'multiplayer';
    }
}