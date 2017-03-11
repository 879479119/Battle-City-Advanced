/**
 * this class should store all the status that affect the game,
 */

import Enemy from './ClassTank/Enemy'
import { MOE_BUNNY } from './ClassUtil/Util'

export default class Judge{
	constructor(grid, map, player, fireController, enemyBases, enemyController){
		//user data
		this._player = player || {}
		//enemies data
		this._enemyBases = enemyBases || {}
		//map data
		this._map = map || {}
		//grid data
		this._grid = grid || {}
		//fire data
		this._fireController = fireController || {}
		//shown enemies
		this._enemyController = enemyController || {}
	}
	//the most important part of this game
	go(){
		/**
		 * steps:
		 *  1.check if user control the tank crash direct into the wall,and move control(change states)
		 *  2.enemies go towards the base, as a whole, the ratio of getting closer is higher than getting further
		 *  3.check cannonball's position, judging if any tank were damaged or any construction damaged,
		 *      - user lose this game if the base were destroyed,
		 *      - blinking enemies leave items after destroyed,
		 *      - user can be more powerful when fetch blinking items,
		 *      - some construction will change state if attacked,
		 *      -
		 *  4.a
		 *
		 */
		const player = this._player,
			grid = this._grid,
			fireController = this._fireController,
			enemyBases = this._enemyBases,
			enemyController = this._enemyController

		if(player.health === 0){
			//TODO:calculate your score and restart the game
			alert(MOE_BUNNY)
			let event = new CustomEvent("keydown",{keyCode:27})
			document.dispatchEvent(event)
		}
		/*------------------------player part-------------------------*/

		//enemies are born after a period
		Judge._checkBirth(grid, enemyBases, player, enemyController)
		//check tanks and construction
		Judge._checkImpact(grid, player)
		//check fire & construction & tanks
		Judge._checkCannon(grid, player, enemyController, fireController)

		Judge._checkTanks(grid, player, enemyController)

		grid.updateTank(player, player.key_down && player.running)
		player.running = true

		/*------------------------enemy  part-------------------------*/

		enemyController.tankArr.map(item=>{
			if(item.health === 0){
				grid.blastAnimation(item)
				if(item.deadStage === 8) enemyController.removeItem(item.id)
				return
			}
			item.releaseRandomFire(fireController)
			Judge._checkImpact(grid, item)
			if(item.running === false) {
				// fire to the wall
				item.stopCount === 10 && item.releaseRandomFire(fireController, false)
				item.stopCount === 60 && item.continueRun()
			} else if(Judge.randomBool === false) item.changeDirection()
			grid.updateTank(item, item.running, fireController)
		})

		/*------------------------either  part-------------------------*/
		grid.updateFire(fireController)
		grid.drawConstruction()
	}
	static _checkImpact(grid, tank){

		const alley = grid.getAlley(),
			{ posX, posY, offsetX, offsetY, direction} = tank

		let row = posY, col = posX

		//check if any endpoint touch other construction
		if(direction === 'w' && offsetY <= 0){
			//TIP: all the constructions are located at the standard grid,
			//     but tanks may be located with a param 'offset'
			for (let c = col; c < 2 + col + (offsetX ? 1 : 0); c ++) {
				//either it's running straight into block or the edge of the map
				if (row <= 0 || alley[row - 1][c] === 0){
					tank.running = false
					tank.offsetY = 0
					return false
				}
			}
		}else if(direction === 's' && offsetY <= 1){
			for (let c = col; c < 2 + col + (offsetX ? 1 : 0); c ++) {
				if (row >= alley.length - 2 || alley[row + 2][c] === 0){
					tank.running = false
					tank.offsetY = 0
					return false
				}
			}
		}else if(direction === 'a' && offsetX <= 0){
			for (let r = row; r < 2 + row + (offsetY ? 1 : 0); r ++) {
				if (col <= 0 || alley[r][col - 1] === 0){
					tank.offsetX = 0
					tank.running = false
					return false
				}
			}
		}else if(direction === 'd' && offsetX <= 1){
			for (let r = row; r < 2 + row + (offsetY ? 1 : 0); r ++) {
				if (col >= alley[0].length - 2 || alley[r][col + 2] === 0) {
					tank.offsetX = 0
					tank.running = false
					return false
				}
			}
		}

		tank.running = true
		return true
	}
	static _checkTanks(grid, player, enemyC){
		/**
		 * there are some differences between 'grid & tank' and
		 * 'tank & tank', for the first one, we can easily check
		 * the neighborhood, but the second one, since there are
		 * few tanks, we could just detect impact in the group
		 * that takes a period of N^2
		 *
		 * TIP: _checkImpact is detecting ahead of time, but _check Tanks is detecting after crush
		 *      therefore this method is not related with direction
		 */

		enemyC.tankArr.map(item=>{
			if(detectOneTank(item, false)) {
				// switch (item.direction){
				// 	case 'w': item.offsetY += 4; break
				// 	case 's': item.offsetY -= 4; break
				// 	case 'a': item.offsetX += 4; break
				// 	case 'd': item.offsetX -= 4; break
				// }
				item.running = false
				item.changeDirection(true)
			}
		})

		if(detectOneTank(player, true)) {
			player.running = false
		}

		function detectOneTank(tank, isPlayer= false) {
			const step = grid.step, len = grid.len
			const { posX, posY, offsetX, offsetY} = tank,
				y = posY * step + offsetY,
				x = posX * step + offsetX,
				enemies = enemyC.tankArr

			for(let i = 0;i < enemies.length;i ++) {
				if(tank.id === enemies[i].id) continue
				let eX = enemies[i].posX * step + enemies[i].offsetX
				let eY = enemies[i].posY * step + enemies[i].offsetY
				if(x + len > eX && x - len < eX){
					if(y + len > eY && y - len < eY){
						return true
					}
				}
			}

			if(isPlayer === false){
				let pX = player.posX * step + player.offsetX
				let pY = player.posY * step + player.offsetY
				if(x + len + 3 > pX && x - len - 3< pX){
					if(y + len + 3 > pY && y - len - 3< pY){
						return true
					}
				}
			}

			return false
		}
	}
	static _checkBirth(grid, enemyBases, player, enemyC){
		enemyBases.forEach((item) => {
			const { len, step } = grid
			const { posX, posY } = item, enemies = enemyC.tankArr
			//flag is a variable that check if there is any tank above enemy base
			let flag = false
			let circle = 0
			let y = posY * step, x = posX * step

			//check if player locates above it
			let pX = player.posX * step + player.offsetX
			let pY = player.posY * step + player.offsetY
			if(x + len > pX && x - len < pX){
				if(y + len > pY && y - len < pY){
					flag = true
				}
			}

			//check enemies
			for(let i = 0;i < enemies.length;i ++) {
				let eX = enemies[i].posX * step + enemies[i].offsetX
				let eY = enemies[i].posY * step + enemies[i].offsetY
				if(x + len > eX && x - len < eX){
					if(y + len > eY && y - len < eY){
						flag = true
					}
				}
			}

			//after some time, enemies start to come out
			if(++ item.frameCounter % item.bornInterval === 0){
				if(item.readyToBear() === 1){
					grid.birthAnimation(item, true)
					item.bornStarted = true
				}
			}

			if(item.bornStarted === true) grid.birthAnimation(item)
			if(flag === true && item.blinkStage > 40){
				item.blinkStage = 0
				circle = 1
			}

			if(flag === false && item.bornStarted === true){
				if(item.blinkStage === 40 || circle === 1){
					let type = item.type[Math.random() * item.type.length >>> 0]
					let enemy = new Enemy(item.posX,item.posY,type)
					item.bearOne()
					enemyC.addTank(enemy)
					grid.updateEnemy(enemy)
				}
			}
		})
	}
	static _checkCannon(grid, player, enemyC, fireC) {
		/**
		 * the tank of player will be destroyed if enemy's fire reached and vice versa,
		 * because we can tell the fire whether it's friendly judging from 'from_ally'
		 */
		if (fireC.fireArr.length === 0) return
		const alley = grid.material

		for(let index in fireC.fireArr){
			const { accuracyX = 0, accuracyY = 0, direction, size, from_ally } = fireC.fireArr[index]
			let col = Math.floor(accuracyX / grid.step),
				row = Math.floor(accuracyY / grid.step),
				oX = accuracyX % grid.step,
				oY = accuracyY % grid.step

			let checkConstruction = () => {
				if((row == 0 || row == alley.length - 1) && (direction == 'w' || direction == 's')) return
				if((col == 0 || col == alley[0].length - 1) && (direction == 'a' || direction == 'd')) return
				if((accuracyY < 0) || (accuracyX < 0) || (accuracyY + size >= alley.length * grid.step) || (accuracyX + size >= alley[0].length * grid.step)) {
					fireOnBlock(index)
					fireC.fireGone(index)
					return
				}
				let over = false
				/**
				 * here we just check the top block but not the current one,
				 * to make sure the block would be destroyed no matter how fast the cannon is, we should inject some judge
				 */
				switch (direction){
					case 'w':
						let w1 = alley[row - 1][col], w2 = alley[row - 1][col + 1]
						if(w1 == 4 || w2 == 4){
							//the top block
							if(oY <= 3 && w1 == 4){fireOnBlock(index,col,row - 1)}
							//the block at right
							if(oY <= 3 && oX >= grid.step - size && w2 == 4){fireOnBlock(index,col + 1,row - 1)}
						}else if(w1 == 3 || w2 == 3){
							if(oY <= 3 && w1 == 3){fireOnBlock(index)} //draw a boom
							if(oY <= 3 && oX >= grid.step - size && w2 == 3){fireOnBlock(index)} //boom
						}
						break
					case 's':
						let s1 = alley[row + 1][col], s2 = alley[row + 1][col + 1]
						if(s1 == 4 || s2 == 4){
							if(oY + size >= grid.step && s1 == 4){fireOnBlock(index,col,row + 1)}
							if(oX >= grid.step - size && oY + size >= grid.step && s2 == 4){fireOnBlock(index,col + 1,row + 1)}
						}else if(s1 == 3 || s2 == 3){
							if(oY + size >= grid.step && s1 == 3){fireOnBlock(index)} //draw a boom
							if(oX >= grid.step - size && oY + size >= grid.step && s2 == 3){fireOnBlock(index)} //boom
						}
						break
					case 'a':
						let a1 = alley[row][col - 1], a2 = alley[row + 1][col - 1]
						if(a1 == 4 || a2 == 4){
							if(oX <= 3 && a1 == 4){fireOnBlock(index,col - 1,row)}
							if(oX <= 3 && oY >= grid.step - size && a2 == 4){fireOnBlock(index,col - 1,row + 1)}
						}else if(a1 == 3 || a2 == 3){
							if(oX <= 3 && a1 == 3){fireOnBlock(index)} //draw a boom
							if(oX <= 3 && oY >= grid.step - size && a2 == 3){fireOnBlock(index)} //boom
						}
						break
					case 'd':
						let d1 = alley[row][col + 1], d2 = alley[row + 1][col + 1]
						if(d1 == 4 || d2 == 4){
							if(oX + size >= grid.step && d1 == 4){fireOnBlock(index,col + 1,row)}
							if(oY >= grid.step - size && oX + size >= grid.step && d2 == 4){fireOnBlock(index,col + 1,row + 1)}
						}else if(d1 == 3 || d2 == 3){
							if(oX + size >= grid.step && d1 == 3){fireOnBlock(index)} //draw a boom
							if(oY >= grid.step - size && oX + size >= grid.step && d2 == 3){fireOnBlock(index)} //boom
						}
						break
					default:
						throw Error("WRONG DIRECTION")
				}

				if(over === true) fireC.fireGone(index)

				/**
				 * if user pass 'col',the block will be destroyed!
				 * and fire would be destroyed only when the function is called
				 */
				function fireOnBlock(index, col, row) {
					grid.fireOnBlock(fireC.fireArr[index], col, row)
					over = true
				}
			}

			let checkPlayer = () => {

				const { posX, posY, offsetX, offsetY } = player

				let pX = posX * grid.step + offsetX,
					pY = posY * grid.step + offsetY

				// if((Math.abs(pX - accuracyX)) > 10) return
				// if((Math.abs(pY - accuracyY)) > 10) return

				switch (direction){
					case 'w':case 's':

					//TIP: very complex logical judgement !!!!!
					if((pX - accuracyX < size && accuracyX - pX < grid.len)
						&& ((direction === 's' && pY - accuracyY <= size && pY - accuracyY >= 0)
						|| (direction === 'w' && accuracyY - pY <= grid.len && accuracyY - pY >= 0))){
						if(from_ally === false) tankDamaged(player)
						else fireC.fireGone(index)
					}
					break
					case 'a':case 'd':
					if((pY - accuracyY < size && accuracyY - pY < grid.len)
						&& ((direction === 'd' && pX - accuracyX <= size && pX - accuracyX >= 0)
						|| (direction === 'a' && accuracyX - pX <= grid.len && accuracyX - pX >= 0))){
						if(from_ally === false) tankDamaged(player)
						else fireC.fireGone(index)
					}
					break
					default:
						throw Error("WRONG DIRECTION")
				}
			}

			let checkEnemies = () => {
				for(let t in enemyC.tankArr){
					let e = enemyC.tankArr[t]
					const { posX, posY, offsetX, offsetY } = e

					let pX = posX * grid.step + offsetX,
						pY = posY * grid.step + offsetY

					// if((Math.abs(pX - accuracyX)) > 50) return
					// if((Math.abs(pY - accuracyY)) > 50) return

					switch (direction){
						case 'w':case 's':

							//TIP: very complex logical judgement !!!!!
							if((pX - accuracyX < size && accuracyX - pX < grid.len)
								&& ((direction === 's' && pY - accuracyY <= size && pY - accuracyY >= 0)
								|| (direction === 'w' && accuracyY - pY <= grid.len && accuracyY - pY >= 0))){
								if(from_ally === true) tankDamaged(e)
								else fireC.fireGone(index)
							}
							break
						case 'a':case 'd':
							if((pY - accuracyY < size && accuracyY - pY < grid.len)
								&& ((direction === 'd' && pX - accuracyX <= size && pX - accuracyX >= 0)
								|| (direction === 'a' && accuracyX - pX <= grid.len && accuracyX - pX >= 0))){
								if(from_ally === true) tankDamaged(e)
								else fireC.fireGone(index)
							}
							break
						default:
							throw Error("WRONG DIRECTION")
					}
				}
			}

			function tankDamaged(tank) {
				tank.getAttacked(grid)
				grid.fireOnBlock(fireC.fireArr[index])
				fireC.fireGone(index)
			}
			//check Construction first
			checkConstruction()
			//then the player
			checkPlayer()
			//and enemies
			checkEnemies()
		}
	}
	static get randomBool(){
		return !!(Math.random() * 600 >>> 0)
	}
}