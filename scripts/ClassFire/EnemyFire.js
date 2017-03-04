import Fire from './Fire'

export default class EnemyFire extends Fire{
	constructor(props) {
		super(props)
		this.from_ally = false
	}
}

