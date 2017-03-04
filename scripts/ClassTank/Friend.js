import Tank from './Tank'
import { merge } from '../ClassUtil/Util'

export default class Friend extends Tank{
	constructor(props){
		super(props)
		const initAttr = {
			ally: true,
			type: 2,
			speed: 2,
			health: 5,
			damage: 5
		}
		merge(this, initAttr)
	}
}
