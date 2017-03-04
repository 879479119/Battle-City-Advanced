/**
 * this is just a canvas that helps to provide higher performance
 */

export default class Canvas{
	constructor(grid, map){

		let dom = grid.ele
		this.grid = grid
		this.step = 8
		this.map = map
		this.width = dom.width
		this.height = dom.height
		this.sX = 0
		this.sY = 0
		this.oX = 0
		this.oY = 0
		//the params that we use to draw
		this.endCol = 0
		this.endRow = 0

		//create a new canvas and set some attributes
		this.ele = document.createElement("canvas")
		this.ele.width = dom.width
		this.ele.height = dom.height
		this.ele.style.position = "absolute"
		this.ele.style.left = "50%"
		this.ele.style.marginLeft = -dom.width/2+"px"
		this.ele.style.top = 0
		document.querySelector("#canvas-container").appendChild(this.ele)

		this.c = this.ele.getContext('2d')
	}
	setOffset(oX,oY){
		this.oX = oX
		this.oY = oY
	}
	startSelection(col, row){
		this.sX = col
		this.sY = row
	}
	/**
	 * draw a grid when run 'drawSelection' is what a low performance,
	 * to avoid unnecessary CPU cost, this function is closed by annotated
	 */
	drawSelection(col, row, fromStart= true){
		const { oX, oY, sX, sY } = this
		this.c.clearRect(0,0,this.ele.width,this.ele.height)
		// this.grid.drawLine(this)
		this.c.fillStyle = "rgba(255,255,255,0.5)"
		fromStart ? this.c.fillRect(oX+sX*8,oY+sY*8,(col-sX)*8,(row-sY)*8) : this.c.fillRect(oX+col*8,oY+row*8,8,8)

		//TIP: the selection tool sometimes is not the same as what we draw
		//therefore, we can store the status in memory
		this.endCol = col
		this.endRow = row
	}
	clearSelection(){
		this.c.clearRect(0,0,this.ele.width,this.ele.height)
		// this.grid.drawLine(this)
	}
}