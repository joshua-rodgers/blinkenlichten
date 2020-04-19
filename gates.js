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
// NEGATION
var not_gate = function(i){
    if(i){
        return false;
    }else{
        return true;
    }
}
// NEGATED AND
var nand_gate = function(a, b){
    return not_gate(and_gate(a, b));
}
// AS DESCRIBED BY DIAGRAM ON PAGE 135 OF PETZOLD BOOK
var xor_gate = function(a, b){
    return and_gate(or_gate(a, b), nand_gate(a, b));
}

