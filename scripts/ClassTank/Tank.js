import { merge } from '../ClassUtil/Util'
/**
 * we may need tanks count between 1 and 10
 * our tank, alis and enemies extend class Tank
 */

export default class Tank{
	constructor(x,y){
		const initAttr = {
			id: Date.now(),       //TODO: replace this with symbol
			ally: false,
			posX: x || 0,         //tank's position on axis X
			posY: y || 0,         //position on axis Y
			offsetX: 0,           //it's the atomic unit - 'px'
			offsetY: 0,           //that shows where the block is precisely
			type: 0,
			speed: 1,
			health: 5,
			defence: 0,      //decrease the damage
			shell: 0,        //shell may keep out some attack
			damage: 1,
			stage: 0,        //tank acts different
			direction: 'w',   //0-3 for the clockwise direction
			key_down: false,        //the tank can run only when some key is pressed
			running: false,         //shows whether the tank is moving during key down
			now_fire: false,
			fire_time: 0,
			deadStage: 1
		}
		merge(this, initAttr)
	}
	changeDirection(reverse= false){
		if(reverse){
			this.direction = {'w':'s','s':'w','a':'d','d':'a'}[this.direction]
		}else {
			this.direction = "wasd"[Math.random()*4>>>0]
		}
	}
	getAttacked(){
		this.health = 0
	}
	static get randomBool(){
		return !!(Math.random() * 100 >>> 0)
	}
}