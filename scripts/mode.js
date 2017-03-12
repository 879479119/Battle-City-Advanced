import Judge from './judge'

import Map from './ClassGrid/Map'
import Canvas from './ClassGrid/Canvas'
import GameGrid from './ClassGrid/GameGrid'
import EditorGrid from './ClassGrid/EditorGrid'
import ProfileGrid from './ClassGrid/ProfileGrid'

import Player from './ClassTank/Player'
import EnemyBase from './ClassTank/EnemyBase'
import EnemyController from './ClassTank/EnemyController'

import FireManager from './ClassFire/FireManager'

/**
 * there are four layers in a screen that should be rendered in order:
 *  1.block, steel, water
 *  2.tank, fire
 *  3.grass, fire-boom
 *  4.powerful items
 */

export function enter(game) {
	let grid = new ProfileGrid(800,400,game)
	grid.init()
	grid.drawSplashScreen()
}

export function init(game) {

	//get map source
	let grid = new GameGrid(800,400)
	let map = new Map(800,400)

	const mapSourceList = Map.getMapList(),
		{ startPosition: [{ x, y }], enemies} = mapSourceList[0]

	let player = new Player(x,y,game)
	let enemyBases = enemies.map(item => new EnemyBase(item))
	let fireController = new FireManager()
	let enemyController = new EnemyController()
	//draw construction

	//draw tanks
	// grid.init()
	// grid.drawConstruction()
	grid.getAlley(true)
	grid._drawPlayer(x,y)
	player.init(fireController)

	//start moving frame by frame
	let frame = new Judge(grid, map, player, fireController, enemyBases, enemyController)

	grid.init(map)
	let keyFrame = () => {
		grid.clearAll()
		frame.go()
		animation = requestAnimationFrame(keyFrame)
		if(!game.animation) {
			/**
			 * END OF THIS GAME
			 * reset the canvas and remove all the listeners
			 */
			grid.reset()
			cancelAnimationFrame(animation)
		}
	}
	let animation = window.requestAnimationFrame(keyFrame)
}

export function editMap(game, width, height) {
	//get map source
	let grid = new EditorGrid(800,400,game)
	let map = new Map(width, height)
	let canvas = new Canvas(grid, map)

	grid.init(map,canvas)
	grid.calOffset()
	grid.drawBorder()
	// grid.drawLine()
	//create some samples for user to pick
	grid.drawToolBar()
}
