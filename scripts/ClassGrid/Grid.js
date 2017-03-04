import ImageManager from '../ClassManager/ImageManager'

/**
 * TIP: if you want to deconstruct a class, you may use 'const' instead of
 *      'let', because its prop may be changed though it's a number or string
 */

/**
 * the canvas is divided into lots of pieces called 'block',
 * and one block consists of 16 step boxes,
 * a step box is made up of 2 * 2 pixel square.
 *
 * for tanks,it can go several steps instead of pixel,
 * you can simply get an idea that passing a block needs four steps.
 *
 * since the canvas does need to draw from head to toe,we just clear
 * the area needed to save time for complication of calculation
 */

export default class Grid{
	constructor(width, height){
		// localStorage.setItem('mapList',JSON.stringify([MAP_TEMPLATE]))
		/*the canvas must be width 800px,height 400px*/
		this.width = width || 800
		this.height = height || 400
		this.ele = window.document.querySelector("#canvas")
		this.c = this.ele.getContext('2d')
		this.step = 8       //step means how many pixels tank goes when press button, it's like "control resolution ratio"
		this.gridBlock = 2  //a block consists of 16 pixels
		this.len = this.gridBlock * this.step
	}
	init(){
		this.c.textBaseline = "top"
		this.c.fillStyle = "#000"
		this.c.fillRect(0,0,this.width,this.height)
	}
	/*basic methods*/
	_drawBlock(row, col, type, self){
		if(self === undefined) self = this
		let x = col * self.step + this.oX,
			y = row * self.step + this.oY,
			img = ImageManager.getBitMap(type)
		if(type === "void"){
			self.c.fillStyle = "#000"
			self.c.fillRect(x, y, self.step, self.step)
			return
		}
		img && self.c.drawImage(img, x, y, self.step, self.step)
	}
	_drawGiantBlock(col, row, type, self, accuracy= false){
		if(self === undefined) self = this
		let x = accuracy ? col : col * self.step,
			y = accuracy ? row : row * self.step,
			img = ImageManager.getBitMap(type)
		img && self.c.drawImage(img, x, y, self.len, self.len)
	}
	static _adaptor(material){
		return material.map(k=>{
			return k.map(k=>Grid.materialData[k])
		})
	}
	//add all the blocks here
	static get materialData(){
		return {
			0: 0,
			1: "gra",
			2: "wate",
			3: "stee",
			4: "wall"
		}
	}
}