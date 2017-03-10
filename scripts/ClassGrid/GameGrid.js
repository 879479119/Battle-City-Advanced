import ImageManager from '../ClassManager/ImageManager'
import EnemyBase from '../ClassTank/EnemyBase'
import Enemy from '../ClassTank/Enemy'
import Grid from './Grid'
import Map from './Map'
import DummyGrid from './DummyGrid'

export default class GameGrid extends Grid{
	constructor(...props){
		super(...props)
		this.oX = 0
		this.oY = 0

		//it's an Matrix which shows where the tanks could go
		this.alley = []

		const mapSourceList = Map.getMapList(),
			{ material } = mapSourceList[0]
		this.map = mapSourceList[0]
		this.material = material
	}
	/*basic methods*/
	init(){
		super.init()
		this.dummyGrid = new DummyGrid()
	}
	_geneAlley(){
		const material = this.material,
			width = material[0].length,
			height = material.length
		let gridValid = []

		/**
		 * there is three types of 'small blocks':
		 *  0 - void, fire & tank could pass, e.g: VOID
		 *  1 - void, fire & tank could pass, e.g: GRASS
		 *  2 - unreachable, fire can pass, but tank doesn't, e.g: WATER
		 *  3 - hard, only level 3 fire can destroy, e.g: STEEL
		 *  4 - destroyable, fire can destroy, e.g: BLOCK
		 */

		for(let row = 0;row < height;row ++){
			let rowArr = []

			for(let col = 0;col < width;col ++){
				if (material[row][col] === 0 || material[row][col] === 1){
					rowArr.push(1)
				}else {
					rowArr.push(0)
				}
			}

			//store the data and clear cache
			//TIP: I used to write like 'gridValid.push(rowArr1, rowArr2)', grid gets the references instead
			//     once set rowArr.length to 0, grid turns to be void
			gridValid.push([...rowArr])
			rowArr.length = 0
		}
		//not only the constructions, but the base
		try{
			let { x, y } = this.map.base
			gridValid[y][x] = 0
			gridValid[y][x+1] = 0
			gridValid[y+1][x] = 0
			gridValid[y+1][x+1] = 0
		}catch(e){
			alert("There is no base in map, please build a new one!")
		}

		this.alley = gridValid
		return gridValid
	}
	/*some special methods*/
	_drawTank(){
		const mapSourceList = Map.getMapList(),
			{ startPosition : [{ x, y }] } = mapSourceList[0]

		this._drawPlayer(x,y)
	}
	_drawPlayer(x, y){
		this._drawGiantBlock(x, y, 'p1tankU')
	}
	_drawFire(x, y, size = 4){
		let	img = ImageManager.getBitMap('ball2')
		img && this.c.drawImage(img, x, y, size, size)
	}
	/*export methods*/
	getAlley(init = false){
		if(init) this._geneAlley()
		else return this.alley
	}
	drawConstruction(){

		const { size: { width, height}, base: { x, y } } = this.map,
			material = this.material

		let blocks = Grid._adaptor(material)

		// basic blocks
		for(let row = 0;row < height;row ++){
			for(let col = 0;col < width;col ++){
				this._drawBlock(row, col, blocks[row][col])
			}
		}
		// base and other giant blocks
		this._drawGiantBlock(x, y, 'base')

	}
	updateEnemy(enemy){
		this.updateTank(enemy)
	}
	birthAnimation(enemyBase, init= false){
		if(init === true) enemyBase.blinkStage = 0
		let { posX, posY, blinkStage } = enemyBase
		this._drawGiantBlock(posX,posY,"born"+EnemyBase.bornPic[blinkStage],this)
		enemyBase.blinkStage ++
	}
	blastAnimation(tank, init= false){
		//TODO: blast animation
		if(init === true) tank.deadStage = 1
		else tank.deadStage ++
		const { posX, posY, offsetX, offsetY } = tank
		let aX = posX * this.step + offsetX
		let aY = posY * this.step + offsetY
		this._drawGiantBlock(aX,aY,"blast"+tank.deadStage,this,true)
	}
	updateTank(tank, run = false, fireC){
		//in ideal situation(60Hz), the tank can go $speed*10 pixel one second
		let {posX, posY, offsetX, offsetY, speed, direction, type, ally} = tank
		let move = speed * 10 / 60
		let tankName = ally ? 'p1tankU' : ['p1tankU','enemy1','enemy2','enemy3','p2tankF'][type]

		//TIP: DummyGrid is a canvas buffer which provides a transformed image
		let dummy = this.dummyGrid
		let degree = 0

		if(run === false){
			//interesting usage
			let d = [0,90,180,270]['wdsa'.indexOf(direction)]

			/**
			 * when tanks are crushing straight into the block, we can do some
			 * compatible work to make it easier to pass an alley
			 */

			if(offsetX < 2) tank.offsetX = 0
			else if(offsetX > 6){
				tank.posX ++
				tank.offsetX = 0
			}

			if(offsetY < 2) tank.offsetY = 0
			else if(offsetY > 6){
				tank.posY ++
				tank.offsetY = 0
			}

			this.c.drawImage(
				dummy._getRotateBlock(tankName,d),
				posX * this.step + offsetX,
				posY * this.step + offsetY,
				this.len, this.len
			)

			if(tank instanceof Enemy) tank.stayInPosition()

			return
		}
		switch (true){
			case direction == 'w':
				if(offsetY < 0){
					tank.posY --
					tank.offsetY = 7.9
				}else tank.offsetY = offsetY - move
				//TIP: because calculating pixel will cause some colored pixel left,
				//     so we just clear a double size of it
				// this._clearArea(posX,tank.posY,offsetX,tank.offsetY + 2 * move)
				degree = 0
				break
			case direction == 's':
				if(offsetY >= 8){
					tank.posY ++
					tank.offsetY = 0
				}else tank.offsetY = offsetY + move
				// this._clearArea(posX,tank.posY,offsetX,tank.offsetY - 2 * move)
				degree = 180
				break
			case direction == 'a':
				if(offsetX < 0){
					tank.posX --
					tank.offsetX = 7.9
				}else tank.offsetX = offsetX - move
				// this._clearArea(tank.posX,posY,tank.offsetX + 2 * move,offsetY)
				degree = 270
				break
			case direction == 'd':
				if(offsetX >= 8){
					tank.posX ++
					tank.offsetX = 0
				}else tank.offsetX = offsetX + move
				// this._clearArea(tank.posX,posY,tank.offsetX - 2 * move,offsetY)
				degree = 90
				break
		}
		this.c.drawImage(
			dummy._getRotateBlock(tankName,degree),
			tank.posX * this.step + tank.offsetX,
			tank.posY * this.step + tank.offsetY,
			this.len, this.len
		)
	}
	updateFire(fireC){
		if(fireC.fireArr.length === 0) return
		//TIP: to make sure there is least calculation, the code is redundant

		this.c.fillStyle = "#000"
		for(let fire of fireC.fireArr){
			let { direction, speed, size } = fire
			speed = speed / 5
			switch (direction){
				case "w":
					this._drawFire(fire.accuracyX,fire.accuracyY,size)
					fire.accuracyY -= speed
					break
				case "s":
					this._drawFire(fire.accuracyX,fire.accuracyY,size)
					fire.accuracyY += speed
					break
				case "a":
					this._drawFire(fire.accuracyX,fire.accuracyY,size)
					fire.accuracyX -= speed
					break
				case "d":
					this._drawFire(fire.accuracyX,fire.accuracyY,size)
					fire.accuracyX += speed
					break
				default:
					throw Error("WRONG DIRECTION")
			}
		}
	}
	fireOnBlock(fire, col, row){
		const { accuracyX, accuracyY } = fire
		let	img = ImageManager.getBitMap('blast7')
		img && this.c.drawImage(img, accuracyX - 2, accuracyY - 2, 6, 6)
		if(col !== undefined){
			this.destroyBlock(col,row)
		}
	}
	destroyBlock(col, row){
		this.alley[row][col] = 1
		this.material[row][col] = 0
	}
}

const MAP_TEMPLATE = {
	size: {
		width: 36,
		height: 22
	},
	startPosition: [{
		x: 2,
		y: 2
	}],
	enemies: [
		{ x: 0, y: 0, type: [3,4] },
		{ x: 15, y: 9, type: [0,1,2,3,4] },
		{ x: 30, y: 14, type: [0,1,2] },
	],
	material: [
		[0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
		[0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
		[0,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,],
		[0,0,0,0,2,2,0,0,4,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
		[0,0,0,0,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
		[0,0,0,0,3,3,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
		[0,0,0,0,3,3,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,0,0,0,0,0,0,0,],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,4,4,4,],
	]
}