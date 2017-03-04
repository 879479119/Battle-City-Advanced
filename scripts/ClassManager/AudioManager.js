import Manager from './Manager'

export default class AudioManager extends Manager{
	constructor(id){
		super(id)
		this.audioEle = window.document.querySelector("#"+id)
		//noinspection JSUnresolvedVariable
		const AudioContext = window.AudioContext || window.webkitAudioContext
		let context = new AudioContext()
	}
}
