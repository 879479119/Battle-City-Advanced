import Manager from './Manager'

let requireContext = require.context("../../assets/image/",true,/^\.\/.*\.gif$/)
const allGif = requireContext.keys().map(requireContext)

export default class ImageManager extends Manager{
	constructor(props){
		super(props)
	}

	//store all the images in memory, or browser will load all images again and again
	static init(){
		let i = 0
		this.imgStore = []
		this.nameStore = []
		requireContext.keys().map((key)=>{
			let image = new Image()
			image.src = allGif[i ++]
			this.nameStore.push(key.match(/\.\/(.*?)\.gif/)[1])
			this.imgStore.push(image)
		})
	}

	static getBitMap(file) {
		let k = 0
		while (k++ < this.imgStore.length && !(this.nameStore[k] === file)){}
		return this.imgStore[k]
	}
}

ImageManager.init()

/*
 image source map:
 ball.gif    blast4.gif  born2.gif    enemy32.gif  p2tankF.gif     steels.gif
 ball2.gif   blast5.gif  born3.gif    enemy33.gif  quit.gif        timer.gif
 base.gif    blast6.gif  born4.gif    enemy34.gif  save.gif        wall.gif
 bin.gif     blast7.gif  destroy.gif  gra.gif      selecttank.gif  walls.gif
 blast1.gif  blast8.gif  enemy1.gif   grass.gif    star.gif        wate.gif
 blast2.gif  bomb.gif    enemy2.gif   over.gif     stee.gif        water.gif
 blast3.gif  born1.gif   enemy3.gif   p1tankU.gif  steel.gif
 */