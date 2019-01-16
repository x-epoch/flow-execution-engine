!function(w){
var isAddLine = false;
var isMouseDown = false;
var grappedObject;
var lastSelectedObject;


var addObject = function(type) {
    var text = prompt("Please input the instance name");
    diagram.addObject(type, text);
    diagram.render();
}

var addLine = function(){
	isAddLine = true;
}

var mouseDown = function(e){
  	x = e.clientX;
    y = e.clientY;
	isMouseDown = true;
	
	grappedObject = diagram.findObject(x,y);
	
	
	
	if(isAddLine){
		var selectedObject = diagram.findObject(x,y);
		if(lastSelectedObject != null) {
			lastSelectedObjectId = lastSelectedObject?lastSelectedObject.id:"";
			selectedObjectId = selectedObject?selectedObject:"";
			diagram.addLine(lastSelectedObjectId,selectedObjectId);
			diagram.render();
			lastSelectedObject = null;
			isAddLine = false;
		}else{
			lastSelectedObject = selectedObject;
		}
	}
}

var mouseMove = function(e){
	var x = e.clientX;
    var y = e.clientY;
    if(isMouseDown && grappedObject !=null){
    
		var startLine = diagram.getLinesByStartText(grappedObject.id);
		var endLine = diagram.getLinesByEndText(grappedObject.id);
	
		if(startLine){
			for(var i=0;i<startLine.length;i++){
				startLine[i].positions=[];
			}
		}
		if(endLine){
			for(var i=0;i<endLine.length;i++){
				endLine[i].positions=[];
			}
		}
    
    
    	grappedObject.x = x;
    	grappedObject.y = y;
    	diagram.render();
    	
    	$("#output").html(JSON.stringify(diagram.getAll()))
    }
}

var mouseUp = function(){
	isMouseDown = false;
	grappedObject = null;
}

var initialize = function(){
	canvas.onmousedown = mouseDown;
	canvas.onmousemove = mouseMove;
	canvas.onmouseup = mouseUp;
	diagram.render();
	exportFun();
}
var exportFun = function(){
	window.addObject = addObject;
	window.addLine = addLine;
}
initialize();

}(window)