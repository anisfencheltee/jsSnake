class TouchManager{
    xDown = null;                                                        
    yDown = null;
    constructor(game){
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), false);        
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), false);
        this.game = game;
    }
    getTouches(evt) {
        return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
    }                                                     
                                                                         
    handleTouchStart(evt) {
        const firstTouch = this.getTouches(evt)[0];                                      
        this.xDown = firstTouch.clientX;                                      
        this.yDown = firstTouch.clientY;                                      
    };                                                
                                                                         
    handleTouchMove(evt) {
        if ( ! this.xDown || ! this.yDown ) {
            return;
        }
        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;

        var xDiff = this.xDown - xUp;
        var yDiff = this.yDown - yUp;                                                                                    
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                this.handleMovement('left')
            } else {
                this.handleMovement('right')
            }                       
        } else {
            if ( yDiff > 0 ) {
                this.handleMovement('up')
            } else { 
                this.handleMovement('down')
            }                                                                 
        }        
        /* reset values */
        this.xDown = null;
        this.yDown = null;                                             
    };
    handleMovement(direction){
        if(this.game.allowMovement(1)) {
            game.restrictMovement(1);
            game.setDirection(1,direction);
        }
    }
}