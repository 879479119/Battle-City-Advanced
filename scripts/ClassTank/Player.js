import Tank from './Tank'
import PLayerFire from '../ClassFire/PlayerFire'
import { merge } from '../ClassUtil/Util'
import { enter } from '../mode'

/**
 * User tank types:
 *  0. faster than other kinds of tanks with less power
 *  1. start with a shell which will cover after a while since broken
 *  2. tank with more powerful cannon which may break the irony wall
 *  3.
 */

export default class Player extends Tank{
	constructor(...props){
		super(...props)
		const initAttr = {
			ally: true,
			type: "p1tankU",
			speed: 8,
			health: 5,
			damage: 5,
			key_down: false,        //the tank can run only when some key is pressed
			running: false,         //shows whether the tank is moving during key down
			now_fire: false,
			fire_time: 0,
			key_buffer: [],
			last_key: '',
			game: props[2]
		}
		merge(this, initAttr)
	}
	init(controller){
		this._listenKeyboard(controller)
	}
	_listenKeyboard(controller){
		this.direction = 'w'
		let that = this
		const listen = window.document.addEventListener
		//once player press down a button,we should
		listen('keydown', listenKeyDown)
		listen('keyup', listenKeyUp)

		function listenKeyDown (e) {
			if(e.keyCode === 27){

				//remove the listeners to make sure that the garbage collection collect it
				that.game.status = "profile"
				that.game.animation = false
				window.document.removeEventListener('keydown', listenKeyDown)
				window.document.removeEventListener('keyup', listenKeyUp)
			}
			switch (e.key){
				case 'w':
				case 's':
				case 'a':
				case 'd':
					if(that.last_key != e.key) {
						that.key_buffer.push(e.key)
						that.last_key = e.key
						that.direction = e.key
					}
					that.key_down = true
					break
				case 'j':
					// that.key_down = true
					// that.now_fire = true
					if(Date.now() - that.fire_time > 500) {
						controller.addFire(new PLayerFire(that))
						that.fire_time = Date.now()
					}
					break
			}
		}

		function listenKeyUp (e) {
			if(that.key_buffer.length <= 1){
				that.key_buffer.length = 0
				that.key_down = false
			}else if(that.key_buffer.length > 1){
				let k = that.key_buffer.pop()
				if(e.key === k){
					that.direction = that.key_buffer[that.key_buffer.length - 1]
				}
			}
			that.last_key = ''
		}
	}
	getAttacked(){
		super.getAttacked()
	}
}
