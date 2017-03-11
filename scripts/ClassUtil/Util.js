export function merge(self, init) {
	for(let attr in init){
		if(init.hasOwnProperty(attr))
			self[attr] = init[attr]
	}
	return 1;
}

export const MOE_BUNNY = `
	,.‐‐､　　　　　　 ,.-‐-､
　く__,.ヘヽ.　　　　/　,ー､ 〉
　　　＼ ', !-─‐-i　/　/´
　 　 ／｀ｰ'　　　 L/／｀ヽ､
　 /　 ／,　 /|　 ,　 ,　　　 ',
　ｲ 　/ /-‐/　ｉ　L_ ﾊ ヽ!　 i
　 ﾚ ﾍ 7ｲ｀ﾄ　 ﾚ'ｧ-ﾄ､!ハ|　 |
　　 !,/7 'ゞ'　　 ´i__rﾊiソ| 　 |
　　 |.从"　 ､__ ,　,,,, / |./ 　 |
　　 ﾚ'| i＞.､,,__　_,.イ / 　.i 　|
　　　 ﾚ'| | / k_７_/ﾚ'ヽ,　ﾊ.　|
　　　　 | |/i 〈|/　 i　,.ﾍ |　i　|
　　　　.|/ /　ｉ： 　 ﾍ!　　＼　|
　 　 　 kヽ>､ﾊ 　 _,.ﾍ､ 　 /､!
　　　　 !'〈//｀Ｔ´', ＼ ｀'7'ｰr'
　　　　 ﾚ'ヽL__|___i,___,ンﾚ|ノ
　　　 　　　ﾄ-,/　|___./
　　　 　　　'ｰ'　　!_,./               YOU ARE DEAD ! SERIOUSLY !`