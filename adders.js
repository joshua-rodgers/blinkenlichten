// BOTH BUILT AS DESCRIBED BY DIAGRAM ON PGS 137-8 OF PETZOLD BOOK
var half_adder = function(a, b){
    return [xor_gate(a, b), and_gate(a, b)];
}

var full_adder = function(carry, a, b){
    var first_half = half_adder(a, b);
    var next_half = half_adder(carry, first_half[0]);
    return [next_half[0], or_gate(first_half[1], next_half[1])];
}