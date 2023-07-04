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
        xDown = firstTouch.clientX;                                      
        yDown = firstTouch.clientY;                                      
    };                                                
                                                                         
    handleTouchMove(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }
        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;                                                                                    
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                this.handleMovement('right')
            } else {
                this.handleMovement('left')
            }                       
        } else {
            if ( yDiff > 0 ) {
                this.handleMovement('down')
            } else { 
                this.handleMovement('up')
            }                                                                 
        }        
        /* reset values */
        xDown = null;
        yDown = null;                                             
    };
    handleMovement(direction){
        if(this.game.allowMovement(0)) {
            game.restrictMovement(0);
            game.setDirection(0,direction);
        }
    }
}