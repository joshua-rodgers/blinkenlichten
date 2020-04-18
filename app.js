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

var panel = function(){
    
}

var app = function() {
    var lights = new Array(9);
    var switches = new Array(16);
    
    var upper_inputs = new Array(8);
    var lower_inputs = new Array(8);
    
    var outputs = new Array(9);

    this.init_app = function(){
        var x_pos = 50;
        var y_pos = 100;
        var counter = 0;
        
        for(var i = 0; i < 8; i++){
            upper_inputs[i] = false;
            lower_inputs[i] = false;
            outputs[i] = false;
        }
        
        // PLACE 9 LIGHTS, SET SOCKETS TO MATCH INDEX OF OUTPUTS ARRAY
        for(var i = 8; i >= 0; i--){
            lights[i] = new panel_light(x_pos, y_pos + 125, i );
            x_pos += 50;
        }
        
        // REST X POSITION FOR PLACING SWITCHES
        x_pos = 110
        
        // PLACE 16 SWITCHES IN TWO ROWS OF 8
        for(var i = 15; i >= 0; i--){
            if(i == 7){
                x_pos = 110;
                y_pos += 50;
            }
            
            // THIS STARTS SOCKET NUMBERS OVER FOR LOWER SWITCHES
            // HELPS WITH MAPPING TO INPUT ARRAYS
            if(i >= 7){
                switches[i] = new panel_switch(x_pos, y_pos, counter, i);
                counter++;
                x_pos += 50;
            }else{
                switches[i] = new panel_switch(x_pos, y_pos, i, i);
                x_pos += 50;
            }
            
            
        }
        
        _draw();
        
        canvas.addEventListener("click", function(e){_flip(e);});
    }
    
    var _draw = function(){
        context.clearRect(0,0,canvas.width, canvas.height);
        for(var i = 0; i < switches.length; i++){
            if(i < 9){
                lights[i].draw();
                switches[i].draw();
            }else{
                switches[i].draw();
            }
        }
    }
    
    var _flip = function(event){
        var location = convertCoordinates(canvas, event.clientX, event.clientY);
        for(var i = 0; i < switches.length; i++){
            //console.log(switches[i]);
            if(switches[i].contains(location.x, location.y)){
                switches[i].flip();
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
        
        for(var i = 7; i >= 0; i--){
            if(i == 7){
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
        //console.log(outputs);
        console.log(lights);
        console.log(switches);
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
                lower_inputs[this.socket] = _state;
            }else{
                upper_inputs[this.socket] = _state;
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




