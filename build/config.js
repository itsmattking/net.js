({
	"baseUrl": "../src",
	"name": "../build/almond.js",
	"include": ["net"],
	"out": "../net.js",
	"wrap": {
		"startFile": ["start.frag", "license.frag"],
		"endFile": "end.frag"
	}
})
