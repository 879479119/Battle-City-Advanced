import Canvas from './Canvas'

export default class DetailGrid extends Canvas{
	constructor(...props){
		super(...props)
		this.oX = props[0].oX
		this.oY = props[0].oY
	}
	removeElement(){
		this.ele.remove()
	}
}