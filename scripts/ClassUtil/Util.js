export function merge(self, init) {
	for(let attr in init){
		if(init.hasOwnProperty(attr))
			self[attr] = init[attr]
	}
	return 1;
}

export function getPath2D(char) {
	let result = ""
}