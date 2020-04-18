var and_gate = function(a, b){
    if(a && b){
        return true;
    }else{
        return false;
    }
}

var or_gate = function(a, b){
    if(a || b){
        return true;
    }else{
        return false;
    }
}

var not_gate = function(i){
    if(i){
        return false;
    }else{
        return true;
    }
}

var nand_gate = function(a, b){
    return not_gate(and_gate(a, b));
}

var xor_gate = function(a, b){
    return and_gate(or_gate(a, b), nand_gate(a, b));
}

