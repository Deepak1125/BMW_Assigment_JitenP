// take 4 kids of variables

// 2 numbers (float and int)
// 2 string (float and int)
// 1 bool 

// if bool variable is true , treat it as 1 else 0 

// The sum of all the variables. 

// let sum = a+b+c+d+e 

// sum should be in the form of float. The float decimal value should be only 2 digits.
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