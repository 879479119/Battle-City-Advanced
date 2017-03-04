/**
 * EnemyController controls all the enemies, which are stored here
 */

export default class EnemyController{
	constructor() {
		this.tankArr = []
	}
	addTank(enemy){
		this.tankArr.push(enemy)
	}
	removeItem(id){
		this.tankArr.forEach((item, index)=>{
			if(item.id === id) this.tankArr.splice(index, 1)
		})
	}
}
