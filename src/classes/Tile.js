class Tile {
    field;
    item = false;
    itemObject;
    active = false;
    setField(field){
        this.field = field;
    }
    activate(player){
        this.active = true;
        this.field.classList.add('player'+player);
    }
    deactivate(){
        this.active = false;
        let list = this.field.classList;
        for(let i=0; i<list.length; i++){
            if(list[i].startsWith('player')){
                this.field.classList.remove(list[i]);

            }
        }
    }
    addItem(row,col){
        this.item = true;
        this.itemObject = new Item(row,col);
        this.field.classList.add('item');
        this.field.classList.add(this.itemObject.getType());
    }
    removeItem(){
        this.item = false;        
        this.field.classList.remove('item');
        this.field.classList.remove(this.itemObject.getType());
        delete this.itemObject;
    }
    setItemClass(urgency){
        this.field.classList.add(urgency);
    }
    getItem(){
        return this.itemObject;
    }
    
}
