import Tank from './Tank'
import EnemyFire from '../ClassFire/EnemyFire'
import { merge } from '../ClassUtil/Util'

/**
 * Enemy tank types:
 *     speed | power | health
 *  0.  fast  normal   less
 *  1. normal normal  normal
 *  2. normal higher   more
 *  3. slow  one beat  highest
 *  4. normal normal  normal (always blinking and if destroy it, you can get useful items)
 */

export default class Enemy extends Tank{
	constructor(...props){
		super(...props)
		const initAttr = {
			type: props[2] || 0, //like this?
			speed: 5,
			health: 5,
			damage: 1
		}
		merge(this, initAttr)
	}
	_chaseUser(){
		/**
		 * when enemies chases users, the A* algorithm will take much time to find the way out,
		 * therefore, we should do the most complicated part only while user moves a step.
		 *
		 * Update: the tanks should not be so talent, they should choose a way and go straight till ending,
		 * but the ending of their travel cannot locate in anywhere except the 'base'
		 *
		 *
		 */
	}
	getAttacked(){
		super.getAttacked()
	}
	releaseRandomFire(controller){
		if(Tank.randomBool === false)controller.addFire(new EnemyFire(this))
	}
}
