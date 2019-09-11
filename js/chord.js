var id = getQuery('chord');
		
$.getJSON("chords.json", function(json) {
	$('h1').append('No BS <u>' +json[id].name+ '</u> Chord');
	assignVal(json[id].name, json[id].code);
});
		 
function assignVal(name, code){
	var chord = {"name": name, "code" : code}; //this is where you'll have to pass the search result chord
	math(chord);
}
	
function getQuery(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		if (decodeURIComponent(pair[0]) == variable) {
			return decodeURIComponent(pair[1]);
		}
	}
}

function math(chord){
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");
		
	window.addEventListener('resize', resizeCanvas, false);
		
	var x = [false, false, false, false, false, false];
	var start = 0;
	var end = 0;
		
	mathChord();
		
	function mathChord(){
		code = chord.code.split(""); //split code into individual array values
			
		var temp = [];
		for (var i=0; i<6; i++){ 
			if(code[i]=="x"){ //check for an x, change that value to a 0 and save the fact that column had an x (var x = [false,false,false,false,false,false]; by default, make x[i] true if needed)
				x[i]=true;
				code[i]=0;
			}
				
				code[i]=parseInt(code[i], 16); //convert hex values to base 10 numbers
				
			if(code[i]>0){ //add number to array if not 0 to find the minimum later
				temp.push(code[i]);
			}
		} 
			
		start = Math.min.apply(Math, temp); //find start, save start location (var start = 0; by default)
		end = Math.max.apply(Math, temp); //find end
			
		if (end>4){
			for (var i=0; i<6; i++){
				code[i]=code[i]-start+1; //convert to placement values (subtract 555555 if start is 5)
			}
		}
	}
		
	function drawBoard(){
		var bw = document.body.clientWidth/1.6;
		var bh = document.body.clientHeight/1.6;
		
		var h = bh/4;
		var w = bw/5;
		var tmp;
		var d =0;
			
		if (end>4) {
			context.font = "20px Arial";
			context.fillText(start, 0, 40);
		}
			
		for (var i = 20; i <= bw+20; i += w) { //vertical lines
			context.moveTo(i, 20);
			context.lineTo(i, bh+20);
		}

		for (var j = 20; j <= bh+20; j += h) { //horizontal lines
			context.moveTo(20, j);
			context.lineTo(bw+20, j);
		}

		context.strokeStyle = "black";
		context.stroke();
			
		for (var i = 20; i <= bw+20; i += w) { //dots
			if (code[d] > 0){ //draw dots only if not open or muted
				tmp = h * (code[d]-0.5);
				drawDot(i, tmp+20, 20);
			}
			if(x[d]==true){ //draw X for muted string
				context.font = "20px Arial";
				context.fillText("X", i, 15);
			}
			d++;
		}
			
		function drawDot(x, y, radius) {
			context.beginPath();
			context.arc(x, y, radius, 0, 2 * Math.PI, false);
			context.fillStyle = '#000';
			context.fill();
		}
			
	}
		
	function resizeCanvas() { //keeping chord display proportional to window size
		canvas.width = window.innerWidth/1.08;
		canvas.height = window.innerHeight/1.08;

		drawBoard(); 
	}
		
	resizeCanvas();
	
};