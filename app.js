var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var panel_light = function(x, y, s){
    var _size = 20;
    this.locX = x;
    this.locY = y;
    this.socket = s;
    
    this.draw = function(){
        if(app.get_state(this.socket)){
            context.fillStyle = "#fc8338";
            context.fillRect(this.locX, this.locY, _size, _size);
        }else{
            context.fillStyle = "#854219";
            context.fillRect(this.locX, this.locY, _size, _size);
        }
    }
}

var app = function() {
    var lights = new Array(9);
    // var switches = new Array(16);
		var upper_switches = new Array(8);
		var lower_switches = new Array(8);
    
    var upper_inputs = new Array(8);
    var lower_inputs = new Array(8);
    
    var outputs = new Array(9);

    this.init_app = function(){
        var x_pos = 460;
        var y_pos = 50;
        var counter = 0;
        
        for(var i = 0; i < 8; i++){
            upper_inputs[i] = false;
            lower_inputs[i] = false;
            outputs[i] = false;
        }
        
        // PLACE 9 LIGHTS, SET SOCKETS TO MATCH INDEX OF OUTPUTS ARRAY
        for(var i = 0; i < lights.length; i++){
            lights[i] = new panel_light(x_pos - 10, y_pos + 125, i );
            x_pos -= 50;
        }
        
        x_pos = 460;
			
				for(var i = 0; i < upper_switches.length; i++){
            upper_switches[i] = new panel_switch(x_pos, y_pos, i, counter);
            x_pos -= 50;
            counter++;
				}
			
				x_pos = 460;
				y_pos += 50;
			
				for(var i = 0; i < lower_switches.length; i++){
            lower_switches[i] = new panel_switch(x_pos, y_pos, i, counter);
				    x_pos -= 50;
            counter++;
				}
        
        _draw();
        
        canvas.addEventListener("click", function(e){_flip(e);});
    }
    
    var _draw = function(){
        context.clearRect(0,0,canvas.width, canvas.height);
        for(var i = 0; i < upper_switches.length; i++){
            upper_switches[i].draw();
            lower_switches[i].draw();
        }
        
        context.fillStyle = "#000";
        
        context.fillText("1", 80, 45);
        context.fillText("0", 80, 65);
        
        context.fillText("1", 80, 95);
        context.fillText("0", 80, 115);
        
        context.beginPath();
        context.lineWidth = 2;
        context.strokeStyle = "#000";
        context.moveTo(50, 90);
        context.lineTo(50, 110);
        context.stroke();
        
        context.beginPath();
        context.moveTo(40, 100);
        context.lineTo(60, 100);
        context.stroke();
        
        context.beginPath();
        context.lineWidth = 2;

        context.moveTo(20, 150);
        context.lineTo(480, 150);
        context.stroke();
        
        for(var i = 0; i < lights.length; i++){
            lights[i].draw();
        }
    }
    
    var _flip = function(event){
        var location = convertCoordinates(canvas, event.clientX, event.clientY);
        for(var i = 0; i < upper_switches.length; i++){
            //console.log(switches[i]);
            if(upper_switches[i].contains(location.x, location.y)){
                upper_switches[i].flip();
                _compute();
                _draw();
                break;
            }
            
            if(lower_switches[i].contains(location.x, location.y)){
                lower_switches[i].flip();
                _compute();
                _draw();
                break;
            }
        }
    }
    
    this.get_state = function(socket){
        return outputs[socket];
    }
    
    var _compute = function(){
        var buffer = {};
        var carry; 
        
        for(var i = 0; i < outputs.length; i++){
            if(i == 0){
                buffer = full_adder(false, upper_inputs[i], lower_inputs[i]);
                outputs[i] = buffer[0];
                //console.log("buffer: " + buffer);
                carry = buffer[1];
                //console.log("carry in if: " + carry);
            }else{
                //console.log("carry in else: " + carry);
                buffer = full_adder(carry, upper_inputs[i], lower_inputs[i]);
                outputs[i] = buffer[0];
                carry = buffer[1];
            }
            
        }
        // console.log(outputs);
         console.log(lower_switches);
         console.log(upper_switches);
    }
    
    function convertCoordinates(canvas, x, y){
        var container = canvas.getBoundingClientRect();
        return {x: x - container.left * (canvas.width / container.width),
        y: y - container.top  * (canvas.height / container.height)};
    }
    
    var panel_switch = function(x, y, s, n){
        var _state = false;
        this.locX = x;
        this.locY = y;
        this.topX = this.locX - 10;
        this.topY = this.locY - 10;
        this.width = 20;
        this.height = 20;
        this.socket = s;
        this.number = n;

        this.get_state = function(){
            return _state;
        }

        this.flip = function(){
            _state = !_state;
            if(this.number <= 7){
                upper_inputs[this.socket] = _state;
            }else{
                lower_inputs[this.socket] = _state;
            }
            
            //console.log(upper_inputs);
            //console.log(lower_inputs);
        }

        this.draw = function(){
            if(_state){
                context.beginPath();
                context.arc(this.locX, this.locY, 10, 0, 2*Math.PI);
                context.fillStyle = "#888";
                context.fill();
                context.beginPath();
                context.arc(this.locX, this.locY, 10, 0, 2*Math.PI);
                context.strokeStyle = "#aaa";
                context.lineWidth = 5;
                context.stroke();
                context.beginPath()
                context.moveTo(this.locX, this.locY);
                context.lineTo(this.locX, this.locY - 12);
                context.strokeStyle = "#aaa";
                context.lineWidth = 5;
                context.lineCap = "round";
                context.stroke();
            }else{
                context.beginPath();
                context.arc(this.locX, this.locY, 10, 0, 2*Math.PI);
                context.fillStyle = "#888";
                context.fill();
                context.beginPath();
                context.arc(this.locX, this.locY, 10, 0, 2*Math.PI);
                context.strokeStyle = "#aaa";
                context.lineWidth = 5;
                context.stroke();
                context.beginPath()
                context.moveTo(this.locX, this.locY);
                context.lineTo(this.locX, this.locY + 12);
                context.strokeStyle = "#aaa";
                context.lineWidth = 5;
                context.lineCap = "round";
                context.stroke();
            }
        }
    }

    panel_switch.prototype.contains = function(mx, my){
        //console.log(mx);
        //console.log(my);
        return (this.topX <= mx) && (this.topX + this.width >= mx) &&
           (this.topY <= my) && (this.topY + this.height >= my);
    }
}

var adder_logic = function(){
    
}




