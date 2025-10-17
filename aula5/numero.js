function receiveNumbers() {
    var n1 = parseInt(document.getElementById("n1").value);
    var n2 = parseInt(document.getElementById("n2").value);
    var soma = "";
 
    soma = (n1 + n2);
    alert("A soma é: " + soma);
}
function subtractNumbers() {
    var n1 = parseInt(document.getElementById("n1").value);
    var n2 = parseInt(document.getElementById("n2").value);
    var soma = "";
    soma = (n1 - n2);
    alert("A subtração é: " + soma);
}
function multiplyNumbers() {
    var n1 = parseInt(document.getElementById("n1").value);
    var n2 = parseInt(document.getElementById("n2").value);
    var soma = "";
 
    soma = (n1 * n2);
    alert("A multiplicação é: " + soma);
}
function divideNumbers() {
    var n1 = parseInt(document.getElementById("n1").value);
    var n2 = parseInt(document.getElementById("n2").value);
    var soma = "";
 
    soma = (n1 / n2);
    alert("A divisão é: " + soma);
} 