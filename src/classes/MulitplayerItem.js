class MultiplayerItem{
    types = [
        {
            propability:50,
            items:[
                "+10",
                "-10"
            ]
        },
        {
            propability:30,
            items:[
                "shorten"                
            ]
        },
        {
            propability:20,
            items:[
                "elongate"                
            ]
        },
    ];
    type=''
    constructor(){
        this.setType()        
    }
    setType(){
        let value = Math.floor(Math.random() * 100);
        for(const [index] in this.types){
            let config = this.types[index];
            if(value>config.propability){
                if(config.item.length===1){
                    this.type = config.item[0]
                }else{
                    this.type = config.item[1]
                }                
                console.log(config.item)
                break;
            }
            //this.lifetime = this.types[this.type].lifetime;
        }                        
    }
}