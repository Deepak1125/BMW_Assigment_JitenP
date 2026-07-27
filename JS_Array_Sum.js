// Take a 3d array

// assign values and find the sun of all elements in the 3d array

let Array3D = [[[1,2],[3,4]],[[5,6],[7,8]],[[9,10],[11,12]]];
let sum1=0;
Array3D.forEach(function(value){
    value.forEach(function (value1){
        value1.forEach(function(value2){
            sum1 += value2;
        })
    })
})

console.log(sum1);