var sp = require('./shortestPath.js');
var $ = require('jquery');
var canvas = document.getElementById('map');
var ctx;
var hours = $('#hours')
var minutes = $('#minutes')
var seconds = $('#seconds')
if (canvas.getContext) {
    ctx = canvas.getContext('2d');
}
var from = 0;
var to = 0;

var pathChoiceArray = [];
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

var calculatedTimeAddedInMinutes = [5, 6, 2, 4, 6, 5, 6, 5, 6, 3, 5, 3, 8, 9 , 6, 10, 8, 1, 8, 14];
var selectedTimeAdded = ['00','00','00','00','00','00','00','00','00','00','00','00','00','00','00','00','00','00','00','00'];

function processArray(){
    pathChoiceArray.sort(function(a, b) {
        return a - b;
    });
    from = pathChoiceArray[0];
    to = pathChoiceArray[pathChoiceArray.length - 1];
    //console.log(pathChoiceArray,"Shortest path from " + from + " to " + to + " is:");
    drawEverything();
}

function addPoint(val){
    if(pathChoiceArray.indexOf(val) == -1){
        pathChoiceArray.push(val);
    }
    processArray();
}
function addPoint(val){
    if(pathChoiceArray.indexOf(val) == -1){
        pathChoiceArray.push(val);
    }
    processArray();
}

function removePoint(val){
    var i = pathChoiceArray.indexOf(val);
    if(i >= 0 ){
        pathChoiceArray.splice(i,1);
    }
    processArray();
}


var roomList = $('#roomList');
roomList.on('click','input[type="checkbox"]',function(e){
    var val = parseInt(this.value)
    if(this.checked){
        addPoint(val);
        selectedTimeAdded[val] = calculatedTimeAddedInMinutes[val];

    }else{
        selectedTimeAdded[val] = '00';
        removePoint(val);
    }

    updateTime();


});
for (var room in graph ){
 var item =  roomList.append('<li><label>Artwork '+(parseInt(room)+1)+'<input data-search-type="room" type="checkbox" value="'+room+'" /></label></li>')

}


function drawNodes() {
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
		for (var i = verts.length - 1; i >= 0; i--) {
			var vert = verts[i];
			ctx.beginPath();
			ctx.arc(vert[0],vert[1],3,0,Math.PI*2,true);
			ctx.stroke();
            ctx.fillStyle = "blue";
            ctx.font = "bold 16px Arial";
            ctx.fillText((i+1)+'', vert[0]+8,vert[1]+5);
		}

}


function drawEverything(){
         ctx.clearRect(0, 0, 800, 800);
        drawNodes();
        //var path = sp.shortestPath(graph, from, to);
        var userPosition = 0; // hard coded for now
       // console.log(pathChoiceArray, "Selected points: ");
        var path = sp.pathToNavigate(graph, verts, pathChoiceArray, userPosition);
        path.shortestPath = path;
        if(path.shortestPath != null){
            for (var i = 1; i< path.shortestPath.length; i++) {
                var last = verts[path.shortestPath[i-1]];
                var current = verts[path.shortestPath[i]];
                ctx.beginPath();
                ctx.arc(last[0],last[1],3,0,Math.PI*2,true);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(last[0],last[1]);
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'red';
                ctx.lineTo(current[0],current[1]);
                ctx.stroke();
                ctx.beginPath();
                ctx.arc(current[0],current[1],3,0,Math.PI*2,true);
                ctx.stroke();
            }
        }
}

function getTimeRemaining(time){
    var t = time * 60 * 1000;
    var seconds = Math.floor( (t/1000) % 60 );
    var minutes = Math.floor( (t/1000/60) % 60 );
    var hours = Math.floor( (t/(1000*60*60)) % 24 );
    var days = Math.floor( t/(1000*60*60*24) );
    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

function updateTime(){
    var count=0;
    for (var i=selectedTimeAdded.length; i--;) {
        var item = selectedTimeAdded[i]
        if(item == '00'){
            item = 0;
        }
        count+= item;
    }

    var d = getTimeRemaining(count);
    console.log(d);
    hours.text(d.hours < 10 ? '0'+ d.hours : d.hours);
    minutes.text(d.minutes < 10 ? '0'+ d.minutes : d.minutes)
    seconds.text(d.seconds < 10 ? '0'+ d.seconds : d.seconds)

}

//drawNodes();
updateTime();
drawEverything();

// Edit mode
// $('.container').click(function(e){
// 	verts.push([e.offsetX,e.offsetY]);
// 	console.log(JSON.stringify(verts));
// 	drawNodes();
// })
