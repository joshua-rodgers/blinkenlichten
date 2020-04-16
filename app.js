var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.addEventListener("click", function(e){print_location(e);});

function print_location(event){
    console.log(event.clientX - canvas.offsetLeft);
    console.log(event.clientY - canvas.offsetTop);
}

var panel_switch = function(x, y){
    var _state = false;
    this.locX = x;
    this.locY = y;
    
    this.get_state = function(){
        return _state;
    }
    
    this.draw = function(){
        if(_state){
            context.beginPath();
            context.arc(this.locX, this.locY, 10, 0, 2*Math.PI);
            context.fillStyle = "#888";
            context.fill();
            context.beginPath()
            context.moveTo(this.locX, this.locY);
            context.lineTo(this.locX, this.locY - 12);
            context.strokeStyle = "#777";
            context.lineWidth = 5;
            context.lineCap = "round";
            context.stroke();
        }else{
            context.beginPath();
            context.arc(this.locX, this.locY, 10, 0, 2*Math.PI);
            context.fillStyle = "#888";
            context.fill();
            context.beginPath()
            context.moveTo(this.locX, this.locY);
            context.lineTo(this.locX, this.locY + 12);
            context.strokeStyle = "#777";
            context.lineWidth = 5;
            context.lineCap = "round";
            context.stroke();
        }

    }
    
}

var panel_light = function(x, y, control){
    var _size = 20;
    this.locX = x;
    this.locY = y;
    
    this.draw = function(){
        if(control.get_state()){
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


var my_switch = new panel_switch(90, 90);
var my_light = new panel_light(80, 40, my_switch);

my_switch.draw();
my_light.draw();



