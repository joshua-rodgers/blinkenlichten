// SAVE REFERENCE TO CANVAS ELEMENT FOR EASY ACCESS
var canvas = document.getElementById("canvas");
// SAVE REFERENCE TO CANVAS GRAPHICS CONTEXT
// THIS IS THE ACTUAL DRAWING API
var context = canvas.getContext("2d");

// LIGHT BULB CLASS
// METHODS/VARIABLES DECLARED WITH VAR KEYWORD 
// AND NAMES STARTING WITH UNDERSCORE ARE PRIVATE
// AND NOT ACCESSIBLE OUTSIDE THE CLASS
var panel_light = function(x, y, s){
    // WIDTH AND HEIGHT OF LIGHT
    var _size = 20;
    // LOCATION OF TOP LEFT CORNER
    this.locX = x;
    this.locY = y;
    // THIS IS USED TO MAP TO OUTPUT ARRAY
    // DETERMINES WHICH LIGHT CORRESPONDS TO WHICH 
    // SWITCH
    this.socket = s;
    
    // CALLED BY APP CLASS' METHOD DRAW()
    this.draw = function(){
        if(app.get_state(this.socket)){ // GET_STATE() LOOKS INTO OUTPUT ARRAY
            context.fillStyle = "#fc8338"; // LIGHT ON COLOR
            context.fillRect(this.locX, this.locY, _size, _size);
        }else{
            context.fillStyle = "#854219"; // LIGHT OFF COLOR
            context.fillRect(this.locX, this.locY, _size, _size);
        }
    }
}

// MAIN APPLICATION CLASS
var app = function() {
    // HOLDS ALL LIGHTS, 9 IN TOTAL
    // INCLUDING THE FINAL CARRY 
    // LIGHT ON THE LEFT
    var lights = new Array(9);
    
    // TWO BANKS OF SWITCHES
    var upper_switches = new Array(8);
    var lower_switches = new Array(8);
    
    // SWITCH STATES WRITTEN HERE
    var upper_inputs = new Array(8);
    var lower_inputs = new Array(8);
    
    // RESULTS OF LOGIC OPERATIONS WRITTEN HERE
    var outputs = new Array(9);
    
    // INITIALIZES ARRAYS, GENERATES NEW OBJECTS, 
    // SETS UP EVENT LISTENER, MAKES FIRST CALL TO DRAW
    // ITEMS ON SCREEN
    this.init_app = function(){
        // VARIABLES FOR POSITIONING SWITCHES AND
        // LIGHTS. START AT RIGHT SIDE OF CANVAS
        var x_pos = 460;
        var y_pos = 50;
        var counter = 0;// WILL INCR. FROM 0 TO 15, MAPS SWITCH PAIRS
        
        // INITIALIZE ARRAYS
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
        // BACK TO RIGHT
        x_pos = 460;

        // CREATE TOP SWITCH BANK
        for(var i = 0; i < upper_switches.length; i++){
            upper_switches[i] = new panel_switch(x_pos, y_pos, i, counter);
            x_pos -= 50;
            counter++;
        }
			
        // BACK TO RIGHT AND DOWN A ROW
        x_pos = 460;
        y_pos += 50;

        // CREATE LOWER SWITCH BANK
        for(var i = 0; i < lower_switches.length; i++){
            lower_switches[i] = new panel_switch(x_pos, y_pos, i, counter);
            x_pos -= 50;
            counter++;
        }
        
        // CALLS DRAW METHOD OF SWITCHES AND LIGHTS
        _draw();
        
        // LISTEN FOR CLICKS ON CANVAS
        canvas.addEventListener("click", function(e){_flip(e);});
    }
    
    // MAIN DRAWING METHOD
    var _draw = function(){
        // BLANK CANVAS
        context.clearRect(0,0,canvas.width, canvas.height);
        
        // MAKE EACH SWITCH DRAW ITSELF
        for(var i = 0; i < upper_switches.length; i++){
            upper_switches[i].draw();
            lower_switches[i].draw();
        }
        
        // DECORATIVE ELEMENTS
        // ADDER LOGO
        context.font = "20px 'Sonsie One'";
        context.fillStyle = "#555";
        context.fillText("Adder", 40, 25);
        
        // NUMBERS TO LEFT OF SWITCHES
        context.font = "10px sans-serif"; 
        context.fillStyle = "#aaa";
        context.fillText("1", 80, 45);
        context.fillText("0", 80, 65);
        
        context.fillText("1", 80, 95);
        context.fillText("0", 80, 115);
        
        // PLUS SIGN
        context.beginPath();
        context.lineWidth = 5;
        context.strokeStyle = "#d7f9f9";
        context.moveTo(50, 90);
        context.lineTo(50, 110);
        context.stroke();
        
        context.beginPath();
        context.moveTo(40, 100);
        context.lineTo(60, 100);
        context.stroke();
        
        // EQUALS LINE
        context.beginPath();
        context.moveTo(20, 150);
        context.lineTo(480, 150);
        context.lineWidth = 5;
        context.strokeStyle = "#d7f9f9";
        context.stroke();
        
        // PLACE VALUES
        context.fillStyle = "#aaa";
        var num_cursor = 457;
        var num = 2;
        var pow = 0
        for(var i = 0; i < 9; i++){
            context.fillText(Math.pow(num, pow), num_cursor, 210);
            pow++;
            
            if(i >= 3 && i < 5){
                num_cursor -= 52;
            }else if(i >= 5){
                num_cursor -= 51;
            }else{
                num_cursor -= 50;
            }
        }
        
        // REDRAW LIGHTS
        for(var i = 0; i < lights.length; i++){
            lights[i].draw();
        }
    }
    
    var _flip = function(event){
        // STORE LOCATION OF CLICK EVENT 
        // WITH OFFSET FROM EDGE OF BROWSER
        // WINDOW FACTORED IN
        var location = convertCoordinates(canvas, event.clientX, event.clientY);
        
        // CHECK WHICH SWITCH WAS CLICKED BY CALLING
        // EACH SWITCH'S CONTAINS() METHOD IF IT RETURNS TRUE,
        // CALL ITS FLIP METHOD WHICH CHANGES THE VALUES IN INPUTS
        // THEN CALL COMPUTE WHICH USES THOSE VALUES TO CHANGE
        // OUTPUTS. THEN REDRAW TO DISPLAY THE UPDATES AND END THE LOOP
        for(var i = 0; i < upper_switches.length; i++){
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
    
    // USED BY LIGHTS TO DETERMINE STATE
    this.get_state = function(socket){
        return outputs[socket];
    }
    
    // THE ACTUAL ADDER LOGIC
    var _compute = function(){
        var buffer = []; // EMPTY ARRAY TO HOLD RUNNING RESULTS
        var carry; // WILL HOLD CARRIES
        
        // CASCADE THRU EACH SWITCH PAIR STARTING FROM LOW ORDER BIT
        // USING OUTPUTS.LENGTH TO INCLUDE FINAL CARRY LIGHT
        for(var i = 0; i < outputs.length; i++){
            // FIRST FULL ADDER NEVER HAS A CARRY SO ZERO IS HARD-WIRED
            if(i == 0){
                buffer = full_adder(false, upper_inputs[i], lower_inputs[i]);
                outputs[i] = buffer[0]; // FIRST ITEM IN BUFFER IS SUM, IF 1 SET LIGHT
                carry = buffer[1]; // SECOND ITEM IS CARRY
            }else{
                // LAST ITERATION TAKES ADVANTAGE OF JS. INPUTS ARE ONLY
                // 8 LONG SO WHEN I = 8 IT IS OUT OF BOUNDS FOR INPUT ARRAYS. JS 
                // DOESN'T ERROR OUT AS ITEM 8 IS SIMPLY CONSIDERED 
                // UNDEFINED, SO CARRY BIT IS WRITTEN TO 9TH LIGHT.
                // COULD BE FIXED PROPERLY, BUT I LIKE IT.
                buffer = full_adder(carry, upper_inputs[i], lower_inputs[i]);
                outputs[i] = buffer[0];
                carry = buffer[1];
            }
        }
    }
    
    // THIS GIVES US PROPER X, Y VALUES FOR CLICKS BY RETURNING
    // X AND Y WITH WINDOW OFFSETS REMOVED. NECESSARY BECAUSE
    // MOUSE POSITION IS CALCULATED RELATIVE TO THE WINDOW, 
    // NOT THE CANVAS. SO 0, 0 IN THE CANVAS MAY ACTUALLY BE 
    // 30, 48 OR SOMETHING TO THE BROWSER.
    function convertCoordinates(canvas, x, y){
        var container = canvas.getBoundingClientRect();
        return {x: x - container.left * (canvas.width / container.width),
        y: y - container.top  * (canvas.height / container.height)};
    }
    
    // SWITCH CLASS
    var panel_switch = function(x, y, s, n){
        var _state = false;
        // CENTER OF CIRCLE
        this.locX = x;
        this.locY = y;
        // TOP LEFT CORNER OF SURROUNDING SQUARE
        this.topX = this.locX - 10;
        this.topY = this.locY - 10;
        
        this.width = 20;
        this.height = 20;
        // INDEX WITHIN SWITCH BANK, 0 - 7, MAPS TO INPUTS
        this.socket = s;
        // 0 - 15 DETERMINES WHICH BANK UPPER (N<7) OR LOWER (N>7)
        this.number = n;

        this.get_state = function(){
            return _state;
        }
        // CALLED WHEN CLICKED
        this.flip = function(){
            _state = !_state;
            if(this.number <= 7){
                upper_inputs[this.socket] = _state;
            }else{
                lower_inputs[this.socket] = _state;
            }
        }

        // DRAWA A DARK FILLED CIRCLE, THEN A LIGHTER UNFILLED ONE,
        // THEN A 5PX LINE FROM THE CENTER TO REPRESENT THE STICK, 
        // STICK POINTS UP WHEN _STATE IS TRUE
        this.draw = function(){
            if(_state){
                // DARK FILLED CIRCLE
                context.beginPath();
                context.arc(this.locX, this.locY, 10, 0, 2*Math.PI);
                context.fillStyle = "#888";
                context.fill();
                // LIGHT UNFILLED CIRCLE
                context.beginPath();
                context.arc(this.locX, this.locY, 10, 0, 2*Math.PI);
                context.strokeStyle = "#aaa";
                context.lineWidth = 5;
                context.stroke();
                // STICK
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
    // CALLED IN FLIP METHOD ACTIVATED WHEN A CLICK OCCURS.
    // MX, MY ARE MOUSE CLICK COORDINATES. IF COORDINATES 
    // FALL WITHIN THE SQUARE SURROUNDING THE SWITCH BODY
    // RETURNS TRUE
    panel_switch.prototype.contains = function(mx, my){
        return (this.topX <= mx) && (this.topX + this.width >= mx) &&
           (this.topY <= my) && (this.topY + this.height >= my);
    }
}




