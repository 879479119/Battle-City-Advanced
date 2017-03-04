import Grid from './Grid'
import ImageManager from '../ClassManager/ImageManager'
import { init, editMap } from '../mode'

/**
 * a grid which shows the profile screen and others
 */

export default class ProfileGrid extends Grid{
	constructor(...props){
		super(...props)
		this.game = props[2]
	}
	init(){
		super.init()
		this.startListener()
	}
	_drawPath(){
		this.c.save()
		let str = ProfileGrid.BATTLE_CITY.join(" ")
		//noinspection JSUnresolvedFunction
		let path = new Path2D(str)
		this.c.fill(path)
		this.c.clip(path)
		for(let i = 60;i < this.width;i += 60){
			for(let j = 60;j < this.height;j += 60){
				this.c.drawImage(ImageManager.getBitMap("walls"),i,j)
			}
		}
	}
	drawText(x,y,text,size){
		/**
		 * you must give a value to font first,
		 * or the method 'measureText' does not work well as thought
		 */
		this.c.font = size+"px 微软雅黑"
		this.c.fillStyle = "#fff"

		if(x === undefined){
			let width = this.c.measureText(text).width
			x = (this.width - width) / 2
		}
		if(y === undefined){
			let height = this.c.measureText(text).height
			y = (this.height - height) / 2
		}

		this.c.fillText(text,x,y)
	}
	drawSplashScreen(){
		this.drawText(...ProfileGrid.MAPPER[0])
		this.drawText(...ProfileGrid.MAPPER[1])
		this._drawPath()
	}
	startListener(){
		let callback = e => {
			//TODO: here, we need some algorithm instead of magic number
			let x = e.x - this.ele.parentElement.offsetLeft,
				y = e.y - this.ele.parentElement.offsetTop

			if(x > 300 && x < 500 && y > 240 && y < 280){
				this.c.restore()
				this.ele.removeEventListener("click",callback)
				this.game.status = "running"
			}
			if(x > 260 && x < 540 && y > 300 && y < 360){
				this.c.restore()
				this.ele.removeEventListener("click",callback)
				this.game.status = "edit"
			}
		}

		this.ele.addEventListener("click",callback)
	}
	static get MAPPER() {
		/**
		 * if posX or posY is undefined, we should draw the text on the middle of page
		 * [posX, posY, text, font-size]
		 */
		return [
			[undefined,250,"NEW GAME",30],
			[undefined,320,"CONSTRUCTION",30]
		]
	}
	static get BATTLE_CITY(){
		return[
			`M67.047,70.688H95.66c5.664,0,9.888,0.236,12.671,0.708c2.783,0.472,5.273,1.457,7.471,2.954
		c2.197,1.498,4.028,3.491,5.493,5.981s2.197,5.282,2.197,8.374c0,3.353-0.903,6.429-2.71,9.229c-1.807,2.8-4.256,4.899-7.349,6.299
		c4.362,1.27,7.715,3.435,10.059,6.494c2.344,3.06,3.516,6.657,3.516,10.791c0,3.255-0.757,6.421-2.271,9.497
		s-3.581,5.534-6.201,7.373c-2.621,1.839-5.852,2.971-9.692,3.394c-2.409,0.261-8.22,0.423-17.432,0.488H67.047V70.688z
		 M81.5,82.603v16.553h9.473c5.631,0,9.131-0.081,10.498-0.244c2.474-0.293,4.419-1.147,5.835-2.563s2.124-3.279,2.124-5.591
		c0-2.213-0.61-4.012-1.831-5.396c-1.221-1.383-3.036-2.222-5.444-2.515c-1.433-0.163-5.55-0.244-12.354-0.244H81.5z M81.5,111.069
		v19.141h13.379c5.208,0,8.512-0.146,9.912-0.439c2.148-0.391,3.898-1.343,5.249-2.856c1.351-1.514,2.026-3.54,2.026-6.079
		c0-2.148-0.521-3.971-1.563-5.469c-1.042-1.497-2.547-2.588-4.517-3.271c-1.97-0.684-6.242-1.025-12.817-1.025H81.5z`,
			`M203.766,142.271h-15.723l-6.25-16.26H153.18l-5.908,16.26h-15.332l27.881-71.582h15.283L203.766,142.271z M177.154,113.95
		l-9.863-26.563l-9.668,26.563H177.154z`,
			`M220.123,142.271V82.798h-21.24V70.688h56.885v12.109h-21.191v59.473H220.123z`,
			`M281.207,142.271V82.798h-21.24V70.688h56.885v12.109H295.66v59.473H281.207z`,
			`M326.568,142.271V71.274h14.453v58.936h35.938v12.061H326.568z`,
			`M387.262,142.271V70.688h53.076v12.109h-38.623v15.869h35.938v12.061h-35.938v19.482h39.99v12.061H387.262z`,
			`M527.545,115.952l14.014,4.443c-2.148,7.813-5.722,13.615-10.718,17.407c-4.997,3.792-11.337,5.688-19.019,5.688
		c-9.506,0-17.318-3.247-23.438-9.741c-6.12-6.494-9.18-15.373-9.18-26.636c0-11.914,3.076-21.167,9.229-27.759
		s14.241-9.888,24.268-9.888c8.756,0,15.869,2.588,21.338,7.764c3.255,3.06,5.696,7.455,7.324,13.184l-14.307,3.418
		c-0.847-3.711-2.612-6.641-5.298-8.789s-5.949-3.223-9.79-3.223c-5.307,0-9.611,1.904-12.915,5.713
		c-3.305,3.809-4.956,9.978-4.956,18.506c0,9.05,1.627,15.495,4.883,19.336c3.255,3.841,7.486,5.762,12.695,5.762
		c3.841,0,7.145-1.221,9.912-3.662C524.354,125.034,526.34,121.193,527.545,115.952z`,
			`M553.521,142.271V70.688h14.453v71.582H553.521z`,
			`M597.857,142.271V82.798h-21.24V70.688h56.885v12.109h-21.191v59.473H597.857z`,
		`M661.627,142.271v-30.127l-26.221-41.455h16.943l16.846,28.32l16.504-28.32h16.65l-26.318,41.553v30.029H661.627z`]
	}
}
