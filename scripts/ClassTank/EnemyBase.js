/**
 * the born point of the enemies
 */

export default class EnemyBase{
	constructor(base) {
		this.posX = base.x
		this.posY = base.y
		this.type = base.type
		this.count = 0                 //has born
		this.total = base.total || 5   //the number of tank that would be born here
		this.blinkStage = 0            //associated with bornPic
		this.frameCounter = 0          //enemy would born if fC % bI = 0
		this.bornInterval = 8 * Math.floor(Math.random() * 60 + 60)
		this.bornStarted = false
	}
	readyToBear(){
		if(this.count === this.total) return -1
		else return 1
	}
	bearOne(){
		this.count ++
		this.bornStarted = false
		return this
	}
	static get bornPic() {
		/**
		 * show 'born' picture step by step
		 */
		return [1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,2,2,2,2,2,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4]
	}
}
