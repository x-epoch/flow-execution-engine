!function(w){
var objectDefPrefix = "def";
var lineDefInfix = "=>";
var scriptArr = [];

var trim = function(str){
    return str.trim();
}

var contains = function(source, chars){
	return source.indexOf(chars) >= 0;
}

var scripts2Array = function(scripts){
	return scripts.split("\n");
}

var startWith = function(script, chars){
	return script.indexOf(chars) == 0; 
}

var endWith = function(script, chars){
	return script.indexOf(chars) == chars.length-1; 
}

var isLine = function(script){
	return contains(script, lineDefInfix);
}

var isObject = function(script){
	return startWith(script, objectDefPrefix); 
}

var addObject = function(script){
	if(isObject(script)) {
		var name = script.split(" ")[1];
		diagram.addObject(0, name);
	}
}

var addLine = function(script){
	if(isLine(script)) {
		var line = script.split(lineDefInfix);
		var start = diagram.getObjectByText(line[0])?diagram.getObjectByText(line[0]).id:"";
		var end = diagram.getObjectByText(line[1])?diagram.getObjectByText(line[1]).id:"";
		if(start && end){
			diagram.addLine(start, end);
		}
	}
}

var repair = function(){
	var beginObject;
	var endObject;
	diagram.getAllObjects().forEach(function(o){
		var isInStartObject = diagram.getLinesByStartText(o[3]) != null
		var isInEndObject = diagram.getLinesByEndText(o[3]) != null
		if(isInStartObject && !isInEndObject){
			beginObject = o;
		}
		
		if(!isInStartObject && isInEndObject){
			endObject = o;
		}
	})
	//beginObject[1] = 300
	//beginObject[2] = 150	
}

var renderNextObject = function(o){
	var lines = diagram.getLinesByStartText(o[3]);
	lines.forEach(function(line){
		line[1]
	})
}


var parse =function(scripts){
	diagram.reset();
	if(scripts) {
		scripts = trim(scripts);
	}
	if(scripts !== ""){
		if(contains(scripts, "\n")){
			var tmpScriptArr = scripts2Array(scripts);
			tmpScriptArr.forEach(function(script){
				if(trim(script) !== "") {
					scriptArr.push(trim(script));
				}
			})
		}else{
			scriptArr.push(trim(scripts));
		}
	}
	scriptArr.forEach(function(o){
		addObject(o);
		addLine(o);
	})
}

var render = function(scripts){
	parse(scripts)
	//repair();
	diagram.render();
	scriptArr = [];
}

window.render = render;

}(window)