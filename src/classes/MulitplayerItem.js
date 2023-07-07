class MultiplayerItem{
    types = {
        50:[
            "+10",
            "-10"
        ],
        30:[
            "shorten"
        ],
        20:[
            "elongate"
        ]                                    
    }
    type=''
    constructor(){
        this.setType()        
    }
    setType(){
        let value = Math.floor(Math.random() * 100);
        for(const[propability,type] in this.types){
            if(value>propability){
                this.type = type;
                console.log(type)
                break;
            }
            //this.lifetime = this.types[this.type].lifetime;
        }                        
    }
}