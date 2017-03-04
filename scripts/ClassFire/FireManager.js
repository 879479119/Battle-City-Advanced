export default class FireManager{
	constructor() {
		this.fireArr = []
	}
	addFire(fireObj){
		this.fireArr.push(fireObj)
	}
	fireGone(index){
		this.fireArr.splice(index,1)
	}
}