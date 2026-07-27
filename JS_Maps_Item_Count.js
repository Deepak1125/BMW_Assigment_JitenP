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