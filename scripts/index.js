import { enter, init, editMap } from './mode'
import '../style.less'

let game = {status: "profile",animation:true}
setInterval(()=>{
    if(game.status === "profile"){
        game.animation = true
      enter(game)
        game.status = ""
    }else if(game.status === "running"){
      init(game)
        game.status = ""
    }else if(game.status === "edit"){
      editMap(game,80,40)
        game.status = ""
    }
},200)
