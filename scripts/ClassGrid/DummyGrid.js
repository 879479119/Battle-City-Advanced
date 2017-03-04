import Grid from './Grid'

export default class DummyGrid extends Grid{
	constructor(width, height) {
		super(width, height);
		this.width = 16
		this.height = 16
		this.len = 16
		this.init()
	}
	init() {
		this.ele = window.document.createElement("canvas")
		this.ele.width = this.width
		this.ele.height = this.height
		this.c = this.ele.getContext('2d')
	}
	_getRotateBlock(type, degree){
		this.c.clearRect(0,0,this.len,this.len)
		//we must draw the bitmap on 'this.c' ,so just take this as a param
		this.c.save()

		switch (degree){
			case 90:
				this.c.translate(this.len, 0)
				this.c.rotate(Math.PI/2)
				break
			case 180:
				this.c.translate(this.len, this.len)
				this.c.rotate(Math.PI)
				break
			case 270:
				this.c.translate(0, this.len)
				this.c.rotate(-Math.PI/2)
				break
			default:
		}

		super._drawGiantBlock(0,0,type,this)

		this.c.restore()
		return this.ele
	}
}