var sp = require('./shortestPath.js');

var verts = [];

verts = [[215,119],[161,229],[292,228],[438,230],[545,182],[666,202],[670,270],[672,371],[665,444],[583,452],[476,454],[286,445],[157,446],[148,351],[100,376],[313,643],[440,336],[538,241],[526,331],[573,361],[575,399]];

var graph = {
	'0':{'1':1,'2':1},
	'1':{'0':1,'2':1,'13':1},
	'2':{'0':1,'1':1,'3':1},
	'3':{'2':1,'4':1,'16':1},
	'4':{'3':1,'5':1,'17':1},
	'5':{'4':1,'6':1},
	'6':{'5':1,'17':1,'7':1},
	'7':{'6':1,'8':1,'18':1},
	'8':{'7':1,'9':1},
	'9':{'10':1,'8':1},
	'10':{'9':1,'18':1,'11':1},
	'11':{'10':1,'15':1,'12':1},
	'12':{'11':1,'13':1},
	'13':{'12':1,'1':1,'14':1},
	'14':{'13':1},
	'15':{'11':1},
	'16':{'3':1,'18':1},
	'17':{'4':1,'6':1,'18':1},
	'18':{'17':1,'16':1,'7':1,'19':1,'20':1,'10':1},
	'19':{'18':1},
	'20':{'18':1}
}

var canvas = document.getElementById('map');

function drawNodes() {
	if (canvas.getContext) {
		var ctx = canvas.getContext('2d');
		ctx.clearRect(0, 0, 800, 800);
		for (var i = verts.length - 1; i >= 0; i--) {
			var vert = verts[i];
			ctx.beginPath();
			ctx.arc(vert[0],vert[1],3,0,Math.PI*2,true);
			ctx.stroke();
		}
	}
}

// Path mode
drawNodes();

var from = 5;
var to = 15;

console.log("Shortest path from " + from + " to " + to + " is:");

//var path = sp.shortestPath(verts, from, to);
var path = sp.shortestPath(graph, from, to);

console.log(path);

if (canvas.getContext) {
	var ctx = canvas.getContext('2d');
	
	for (var i = 1; i<path.shortestPath.length; i++) {
		var last = verts[path.shortestPath[i-1]];
		var current = verts[path.shortestPath[i]];
		ctx.beginPath();
		ctx.moveTo(last[0],last[1]);
		ctx.lineWidth = 5;
		ctx.strokeStyle = 'red';
		ctx.lineTo(current[0],current[1]);
		ctx.stroke();
	}

}

// Edit mode
// $('.container').click(function(e){
// 	verts.push([e.offsetX,e.offsetY]);
// 	console.log(JSON.stringify(verts));
// 	drawNodes();
// })