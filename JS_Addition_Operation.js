function task2(){
    let I_float = 123.123
    let I_int = 246
    let S_float = "123.123"
    let s_int = "246"
    let bool = true;
    let sum;
    if(bool === true){
        sum  = parseInt(S_float)+parseInt(s_int)+I_float+I_int+1
    }else{
        sum = parseInt(S_float)+parseInt(s_int)+I_float+I_int+0
    }
    console.log(parseFloat(sum).toFixed(2))
}
task2();