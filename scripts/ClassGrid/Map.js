import Grid from './Grid'

export default class Map extends Grid{
	constructor(...props){
		super(...props)
		this.width = props[0] || 80
		this.height = props[1] || 40
		//store the map we are drawing
		this.mapData = []
		this.base = {}
		this.player = {}
		this.friend = {}
		this.enemies = []
		this.init()
	}
	//init the map
	init(){
		let arr = []
		for(let i = 0;i < this.height;i ++){
			let tempArr = []
			for(let j = 0;j < this.width;j ++){
				tempArr.push(0)
			}
			arr.push([...tempArr])
		}
		this.mapData = arr
	}
	changeBlock(col, row, type){
		this.mapData[row][col] = type
	}
	changeItem(col, row, type, del= false){
		if (col === undefined || row === undefined) return
		if(type === "p1tankU") {
			let lastPos = {x: this.player.x, y: this.player.y}
			this.player = {x: col, y: row}
			return lastPos
		}else if(type === "p2tankF"){
			let lastPos = {x: this.friend.x, y: this.friend.y}
			this.friend = {x: col, y: row}
			return lastPos
		}else if(type === "base"){
			let lastPos = {x: this.base.x, y: this.base.y}
			this.base = {x: col, y: row}
			return lastPos
		}else if(type === "enemy1") {
			if(del === true){
				this.enemies.some((item, index)=>{
					if(item.x === col && item.y === row){
						this.enemies.splice(index,1)
						return true
					}
				})
			}else {
				this.enemies.push({x:col,y:row,type:[1,2,3,4]})
			}
			//maybe we can constrain the number of bases
			return this.enemies.length
		}
	}
	clearAll(){
		this.base = {}
		this.player = {}
		this.friend = {}
		this.enemies = []
		this.init()
	}
	insertMap(){
		let map = {
			size: {
				width: this.width,
				height: this.height
			},
			startPosition: [this.player],
			enemies: this.enemies,
			material: this.mapData
		}
		window.localStorage.setItem('mapList',JSON.stringify([map]))
	}
	//draw from local storage
	static getMapList(){
		let maps = window.localStorage.getItem('mapList')
		return JSON.parse(maps)
	}
}