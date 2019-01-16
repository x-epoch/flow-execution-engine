!function(w){
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var width = window.innerWidth;
var height = window.innerHeight;
var init_object_y = 240; 
var objects = [];
var lines = [];
var objectTextIndex = {};
var startTextIndexForLine = {};
var endTextIndexForLine = {};

canvas.width = width;
canvas.height = height;

var getObjectWidth = function(text){
	return context.measureText(text).width + 60;
}

var getObjectHeight = function(text){
	return 30;
}

var drawGrid = function(size) {
    context.beginPath();
    for (var i = 0; i <= width / size + 1; i++) {
        var tmp = i * size + 0.5 ;
        context.moveTo(tmp, 0);
        context.lineTo(tmp, height);

    }
    for (var i = 0; i <= height / size + 1; i++) {
        var tmp = i * size + 0.5 ;
        context.moveTo(0, tmp);
        context.lineTo(width, tmp);
    }
    context.strokeStyle = "silver";
    context.stroke();
}

var drawObject = function(o) {
    context.beginPath();
    
    var type = o.type;
    var x = o.x;
    var y = o.y;
    var id = o.id;

	var w = o.width;
	var h = o.height;
	
	x = x-w/2;
	y = y-h/2;
	
    switch(type) {
        case 0: // process
            context.moveTo(x, y);
            context.lineTo(x + w, y);
            context.lineTo(x + w, y + h);
            context.lineTo(x, y + h);
            context.lineTo(x, y);
            break;
        case 1: // data
            context.moveTo(x, y + h / 2);
            context.lineTo(x + w / 2, y);
            context.lineTo(x + w, y + h / 2);
            context.lineTo(x + w / 2, y + h);
            context.closePath();
            break;
        case 2: // predefined process
            context.moveTo(x, y + h);
            context.lineTo(x + w - 32, y + h);
            context.lineTo(x + w, y);
            context.lineTo(x + 32, y);
            context.closePath();
            break;
        case 3: // decision
            context.moveTo(x, y);
            context.lineTo(x + w, y);
            context.lineTo(x + w, y + h);
            context.lineTo(x, y + h);
            context.closePath();
            context.moveTo(x + 16, y);
            context.lineTo(x + 16, y + h);
            context.moveTo(x + w - 16, y);
            context.lineTo(x + w - 16, y + h);
            break;
        case 4: // cycle1
            context.moveTo(x, y + 16);
            context.lineTo(x + 16, y);
            context.lineTo(x + w - 16, y);
            context.lineTo(x + w, y + 16);
            context.lineTo(x + w, y + h);
            context.lineTo(x, y + h);
            context.closePath();
            break;
        case 5: // cycle2
            context.moveTo(x, y);
            context.lineTo(x + w, y);
            context.lineTo(x + w, y + h - 16);
            context.lineTo(x + w - 16, y + h);
            context.lineTo(x + 16, y + h);
            context.lineTo(x, y + h - 16);
            context.closePath();
            break;
        case 6: // terminator
            context.arc(x + 16, y + 24, 16, 0.5 * Math.PI, 1.5 * Math.PI);
            context.arc(x + w - 16, y + 24, 16, 1.5 * Math.PI, 0.5 * Math.PI);
            context.closePath();
            break;
    }

    context.lineWidth = 2;
    context.fillStyle = "#fff";
    context.strokeStyle = "black";
    context.fill();
    context.stroke();
    context.fillStyle = "black";
    context.font = "16px monospace";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(id, x + w / 2, y + h / 2);
}

var drawLine = function(line) {	
    context.beginPath();
    var startObjectId = line.from;
    var endObjectId = line.to;
    var positions = line.positions;

    
    var startObject = objectTextIndex[startObjectId];
    var endObject = objectTextIndex[endObjectId];
	var o_w_first = startObject.width;
	var o_h_first = startObject.height;
	var first = {
		x: startObject.x,
		y: startObject.y,
		w: o_w_first,
		h: o_h_first
	};
	var o_w_second = endObject.width;
	var o_h_second = endObject.height;
	var second = {
		x: endObject.x,
		y: endObject.y,
		w: o_w_second,
		h: o_h_second
	};

	var halfX = (first.x - second.x) / 2;
	var halfY = Math.abs(first.y - second.y) / 2;
	
	
	var addPoint = function(x,y){
		line.positions.push({"x":x, "y":y});
	}
	
	if(positions.length <= 1 ){
		line.positions = [];
		if (first.y + first.h/2 < second.y - second.h/2) {
		
			addPoint(first.x, first.y+ first.h/2);
			addPoint(first.x, first.y + halfY);
			addPoint(first.x, second.y - halfY);
			addPoint(second.x, second.y - halfY);
			addPoint(second.x, second.y- second.h/2);
		}else {
			addPoint(first.x, first.y + first.h/2);
			addPoint(first.x, first.y + first.h);
			addPoint(first.x, first.y + first.h);
			addPoint(second.x + halfX, first.y + first.h);
			addPoint(second.x + halfX, second.y - second.h);
			addPoint(second.x, second.y - second.h);
			addPoint(second.x, second.y- second.h/2);
		}
	}
	

	for(var i=0;i<line.positions.length;i++){
		if(i == 0){
			context.moveTo(line.positions[i].x, line.positions[i].y);
		}else{
			context.lineTo(line.positions[i].x, line.positions[i].y);
		}
	}
    
	

    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.stroke();
}



var drawObjects = function() {
    objects.forEach(function(e) {
        drawObject(e);
    });
}

var drawLines = function() {
    lines.forEach(function(line) {
        drawLine(line);
    });
}

var findObject = function(mX, mY) {
    for (var i = 0; i < objects.length; i++) {
    	var w = objects[i].width;
		var	h = objects[i].height;
        var x = objects[i].x - w/2;
        var y = objects[i].y - h/2;
        	
        if (mX >= x && mX <= x + w && mY >= y && mY <= y + h) {
            currentObject = i;
            return objects[i];
        }
    }
    return null;
}

var addObject = function(type, id ,x, y){
	var object = {};
	object.type = type;
	object.id = id;
	object.width = getObjectWidth(id);
	object.height = getObjectHeight(id);
	object.x = x || 150+diagram.getAllObjects().length*100;
	object.y = y || 250;
	objects.push(object);
	buildTextIndexForObject();
}

var addLine = function(lastSelectedObjectId,selectedObjectId, positionArr){
	var line = {};
	var positions = [];
	var position = {};
	position.x = 0;
	position.y = 0;
	positions.push(position);
	
	line.from = lastSelectedObjectId;
	line.to = selectedObjectId;
	line.positions = positionArr || positions;
	lines.push(line);
	buildTextIndexForLine();
}

var buildTextIndexForObject = function(){
	objectTextIndex = {};
	objects.forEach(function(o){
		objectTextIndex[o.id] = o;
	})
}

var buildTextIndexForLine = function(){
	startTextIndexForLine = {};
	endTextIndexForLine = {};
	lines.forEach(function(line){
		var startObject = line.from;
		var endObject = line.to;
		
		var startLineArr = startTextIndexForLine[startObject];
		if(!startLineArr){
			startLineArr = [];
		}
		startLineArr.push(line)
		startTextIndexForLine[startObject] = startLineArr;
		
		var endLineArr = endTextIndexForLine[endObject];
		if(!endLineArr){
			endLineArr = [];
		}
		endLineArr.push(line)
		endTextIndexForLine[endObject] = endLineArr;
	})
}

var render = function(){
	canvas.width = canvas.width;
	drawGrid(20);
    drawObjects();
    drawLines();
}

var getAllObjects = function(){
	return objects;
}

var getObjectByText = function(text){
	return objectTextIndex[text];
}

var getLinesByStartText = function(text){
	return startTextIndexForLine[text];
}

var getLinesByEndText = function(text){
	return endTextIndexForLine[text];
}

var getAllLines = function(){
	return lines;
}

var getObjectTextIndex = function(){
	return objectTextIndex;
}

var getAll = function(){
	var overall = {};
	overall.objects = objectTextIndex;
	overall.lines = lines;
	return overall;
}

var reset = function(){
	objects = [];
	lines = [];
}

var diagram = {};

var exportFun = function(){
	diagram.render = render;
	diagram.addObject = addObject;
	diagram.addLine = addLine;
	diagram.findObject = findObject;
	diagram.getAllObjects = getAllObjects;
	diagram.getObjectByText = getObjectByText;
	diagram.getLinesByStartText = getLinesByStartText;
	diagram.getLinesByEndText = getLinesByEndText;
	diagram.getAllLines = getAllLines;
	diagram.getObjectTextIndex = getObjectTextIndex;
	diagram.getAll = getAll;
	diagram.reset = reset;
	window.diagram = diagram;
}

exportFun();
}(window)