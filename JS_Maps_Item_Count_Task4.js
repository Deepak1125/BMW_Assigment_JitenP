// Create an array for 10 elements.

// Give random values in that array 

// Using maps, find out each value how many times it is existed in the map

// arr1 = [10,4,10,3,5,6,7,3,4,7,8,9,10,4,5,2,1,10,5,6,7,3,5];
// Use maps and findout 

let CountUsingMap = new Map();
let ArrayCount = [1,2,3,4,1,2,3,4,1,2,3,4,1,2,3,4,1,3,2,4,1,1,1,2,3,4,3,2,4];

ArrayCount.forEach(function (value) {
    if (CountUsingMap.has(value)) {
        CountUsingMap.set(value, CountUsingMap.get(value) + 1);
    } else {
        CountUsingMap.set(value, 1);
    }
});

console.log(CountUsingMap);