class MenuManager{
    showOverlay(name){
        let visible = Array.from(document.querySelectorAll( '.visible:not(.overlay)'));
        console.log(visible);
        visible.forEach(item=>{
            console.log(item)
            item.classList.remove('visible');
            item.classList.add('hidden');
        })
        console.log(name)
        document.getElementById('overlay').classList.add('visible');
        document.getElementById('overlay').classList.remove('hidden');
        document.getElementById(name).classList.add('visible');
        document.getElementById(name).classList.remove('hidden');
        console.log(document.getElementById(name))
    }
    showScoreboard(player){
        document.getElementById('scoreContainer'+player).classList.remove('hidden');
        document.getElementById('finalScore'+player).classList.remove('hidden');    
    }
    chickenDinner(show,playerIndex){
        let dinner = document.getElementById('chickenDinner');
        if(show){
            dinner.classList.remove('hidden');
            document.getElementById('winner').innerHTML = playerIndex+1;
        }else{
            dinner.classList.add('hidden');
        }        
    }
    hideOverlay(){
        let visible = Array.from(document.getElementsByClassName('visible'));        
        document.getElementById('overlay').style.backgroundColor = null;
        console.log(visible);
        visible.forEach(item=>{
            console.log(item)
            item.classList.remove('visible');
            item.classList.add('hidden');
        })                                
    }

    setPointCounter(snake){
        let player = snake.getPlayer();
        document.getElementById('scorePlayer'+player).innerHTML = snake.getPoints();
        document.getElementById('finalScore'+player).innerHTML = snake.getPoints();
    }

    setTimerVisibility(visible){
        if(visible){
            document.getElementById('time').classList.remove('hidden')
        }else{
            document.getElementById('time').classList.add('hidden')
        }
    }
    setTimer(time){
        document.getElementById('timeLeft').innerHTML = time;
    }
}