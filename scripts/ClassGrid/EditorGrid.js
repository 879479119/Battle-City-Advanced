import ImageManager from '../ClassManager/ImageManager'
import Grid from './Grid'

/**
 * there is three types of 'small blocks':
 *  0 - void, fire & tank could pass, e.g: VOID
 *  1 - void, fire & tank could pass, e.g: GRASS
 *  2 - unreachable, fire can pass, but tank doesn't, e.g: WATER
 *  3 - hard, only level 3 fire can destroy, e.g: STEEL
 *  4 - destroyable, fire can destroy, e.g: BLOCK
 */

export default class EditorGrid extends Grid{
	constructor(...props){
		super(...props)

		this.activePicker = "walls"
		this.key_down = false
		this.giantBlock = false
		//noinspection JSUnresolvedVariable
		this.game = props[2]
		this.mode = "select"        //select rect area or pencil

		//init the toolBar picker
	}
	init(map, canvas){
		super.init()
		window.document.addEventListener("resize",()=>{
			this.startPicker()
		})
		this.map = map
		this.partner = canvas
		this.startPicker()
	}
	drawInnerGiantBlock(col, row, type){
		let x = col * this.step + this.oX,
			y = row * this.step + this.oY,
			img = ImageManager.getBitMap(type)
		img && this.c.drawImage(img, x, y, this.len, this.len)
	}
	clearInnerGiant(col, row){
		let x = col * this.step + this.oX,
			y = row * this.step + this.oY
		this.c.fillStyle = "#000"
		this.c.fillRect(x,y,this.len,this.len)
	}
	drawBorder(){
		let w = this.step * this.map.width + 4,
			h = this.step * this.map.height + 4,
			x = (this.width - w) / 2 - 2,
			y = (this.height - h) / 2 - 2
		this.c.strokeStyle = "#ccc"
		this.c.lineWidth = 4
		this.c.strokeRect(x,y,w,h)
		this.oX = x + 2
		this.oY = y + 2
		this.partner.setOffset(this.oX,this.oY)
	}
	drawLine(self){
		/**
		 * there are three ways to draw a grid:
		 *  1.draw a single path or a few paths to constrain usage of CANVAS API
		 *  2.draw several rectangles to keep balance
		 *  3.draw a giant count of lines
		 *
		 *  TODO:check which method perform the best
		 *
		 * solution:
		 *  1.not yet
		 *  2.since each border of a rectangle is at least 2px, give up
		 *  3.may be the most effective API
		 */
		if(self === undefined) self = this
		let w = self.step * self.map.width + 4,
			h = self.step * self.map.height + 4,
			x = (self.width - w) / 2,
			y = (self.height - h) / 2

		self.c.strokeStyle = "#333"
		self.c.lineWidth = 1

		for(let row = 0;row < self.map.width;row += 2){
			self.c.moveTo(x+row*self.step+0.5,y)
			self.c.lineTo(x+row*self.step+0.5,h+y-4)
		}
		for(let col = 0;col < self.map.height;col += 2){
			self.c.moveTo(x,y+col*self.step+0.5,)
			self.c.lineTo(w+x-4,y+col*self.step+0.5,)
		}
		self.c.stroke()
	}
	drawItem(){
		let { partner: {sX, sY}, map} = this
		//this method returns the old position
		let { x, y } = map.changeItem(sX,sY,this.activePicker)
		if(x != undefined) this.clearInnerGiant(x,y)
		this.clearInnerGiant(sX,sY)
		//draw a new item
		this.drawInnerGiantBlock(sX,sY,this.activePicker)
	}
	drawArea(){
		const { partner: {endCol, endRow, sX, sY}, map} = this
		if(sX === endCol && sY === endRow){
			map.changeBlock(endCol,endRow,EditorGrid.MAPPER[this.activePicker][1])
			this._drawBlock(endRow,endCol,EditorGrid.MAPPER[this.activePicker][0])
			return
		}

		let xA = [sX,endCol],yA = [sY,endRow]

		//exchange the order of the numbers
		if(sX > endCol) {xA = [endCol,sX]}
		if(sY > endRow) {yA = [endRow,sY]}

		for(let i = xA[0];i < xA[1];i ++){
			for(let j = yA[0];j < yA[1];j ++){
				map.changeBlock(i,j,EditorGrid.MAPPER[this.activePicker][1])
				this._drawBlock(j,i,EditorGrid.MAPPER[this.activePicker][0])
			}
		}

		this.partner.clearSelection()
	}
	drawToolBar(){
		EditorGrid.PICKER.map(item=>{
			this._drawGiantBlock(item[0],item[1],item[2])
		})
	}
	startPicker(){
		let { map, width, height, step, ele: { offsetLeft, offsetTop } } = this

		// offsetLeft += offsetLeft
		offsetTop += this.ele.parentNode.offsetTop
		let listen = this.partner.ele.addEventListener

		let fnMouseMove = e=>{
			let dX = e.x - offsetLeft - (width - step * map.width) / 2,
				dY = e.y - offsetTop - (height - step * map.height) / 2

			//in the range of a grid
			if(dX >= 0 && dX <= map.width * step && dY >= 0 && dY <= map.height * step){
				let col = (dX / step) >>> 0, row = (dY / step) >>> 0
				//press down a key
				if(this.key_down === true && this.giantBlock === false) {

					if (this.mode === "select") {
						this.partner.drawSelection(col, row)
					} else {
						//TODO
						this._drawBlock(row, col, EditorGrid.MAPPER[this.activePicker][0])
						this.map.changeBlock(col, row, EditorGrid.MAPPER[this.activePicker][1])
					}
				}else{
					// point out where the cursor is,
					if(col >= this.map.width || row >= this.map.height) return
					this.partner.drawSelection(col, row, false)
				}
			}
		}

		let fnMouseUp = e=>{

			//rest the mouse and return
			this.key_down = false
			if(this.outterClick === true) return

			const {
				partner: {endCol, endRow, sX, sY},
				map: { player, friend, base, enemies }
			} = this, posArr = []

			const MAPPER = ["p1tankU","p2tankF","base","enemy1"]

			let xA = [sX,endCol],yA = [sY,endRow]

			//exchange the order of the numbers
			if(sX > endCol) {xA = [endCol,sX]}
			if(sY > endRow) {yA = [endRow,sY]}
			//serialize the items
			posArr.push(player,friend,base,...enemies)

			for(let index in posArr){
				let item = posArr[index],{x,y} = item
				let type = undefined

				if(x > xA[0] - 2 && x <= xA[1] && y > yA[0] - 2 && y <= yA[1]){
					if(index < 3) type = MAPPER[index]
					else type = MAPPER[3]
					//set a "undefined" value to make sure it's removed
					this.map.changeItem(undefined,undefined,type)
					this.clearInnerGiant(x,y)
				}
			}

			if(this.giantBlock === true){
				this.drawItem()
			}else{
				if(this.mode === "select"){
					this.drawArea()
				}else{
					//TODO
				}
			}
			e.preventDefault()
		}

		let fnClick = e=>{
			let x = e.x - offsetLeft,
				y = e.y - offsetTop

			//choose a picker to build
			EditorGrid.PICKER.map((item)=>{
				if((item[0] - 1) * step < x && (item[0] + 3) * step > x
					&& (item[1] - 1) * step < y && (item[1] + 3) * step > y) {

					switch(item[3]){
						case 1:
							this.activePicker = item[2]
							this.giantBlock = false
							break
						case 2:
							this.activePicker = item[2]
							this.giantBlock = true
							break
						case 3:
							if(item[2] === "quit"){
								fnKeyDown({keyCode:27})
							}else if(item[2] === "save"){
								this.map.insertMap()
							}else if(item[2] === "pencil"){
								this.mode = "pencil"
							}else if(item[2] === "select"){
								this.mode = "select"
							}else if(item[2] === "revoke"){
								this.revoke()
							}
							break
						default:
							throw Error("NEW ERROR!")
					}
				}
			})
		}

		let fnMouseDown = e=>{
			let dX = e.x - offsetLeft - (width - step * map.width) / 2,
				dY = e.y - offsetTop - (height - step * map.height) / 2

			this.key_down = true
			let col = (dX / step) >>> 0,
				row = (dY / step) >>> 0

			if(col > this.map.width || row > this.map.height){
				this.outterClick = true
				return
			}else {
				this.outterClick = false
				if(this.giantBlock === false){
					if(this.mode === "select"){
						this.partner.startSelection(col,row)
						this.partner.drawSelection(col,row)
					}else{
						//TODO
						this._drawBlock(row,col,EditorGrid.MAPPER[this.activePicker][0])
						this.map.changeBlock(col,row,EditorGrid.MAPPER[this.activePicker][1])
					}
				}else{
					this.partner.startSelection(col,row)
					this.partner.drawSelection(col,row)
				}
			}

			e.preventDefault()
		}

		let fnKeyDown = e=>{
			if(e.keyCode === 27){
				let remove = this.partner.ele.removeEventListener
				this.game.status = "profile"

				this.partner.ele.remove()
				remove("mousemove", fnMouseMove)
				remove("mouseup", fnMouseUp)
				remove("click", fnClick)
				remove("mousedown", fnMouseDown)
				remove("keydown", fnKeyDown)
			}
		}

		listen("mousemove", fnMouseMove)
		listen("mouseup", fnMouseUp)
		listen("click", fnClick)
		listen("mousedown", fnMouseDown)
		listen("keydown", fnKeyDown)
	}
	revoke(){
		this.map.clearAll()
		super.init()
		this.drawBorder()
		this.drawToolBar()
	}
	static get PICKER(){
		return [
			[72,47,"bin",1],
			[22,47,"save",3],
			[32,47,"quit",3],
			[42,47,"pencil",3],
			[52,47,"revoke",3],
			[62,47,"select",3],
			[4,10,"base",2],
			[4,20,"p1tankU",2],
			[4,30,"p2tankF",2],
			[4,40,"enemy1",2],
			[94,10,"steels",1],
			[94,20,"grass",1],
			[94,30,"water",1],
			[94,40,"walls",1],
		]
	}
	static get MAPPER(){
		return {
			steels: ["stee",3],
			grass: ["gra",1],
			water: ["wate",2],
			walls: ["wall",4],
			bin: ["void",0]
		}
	}
}