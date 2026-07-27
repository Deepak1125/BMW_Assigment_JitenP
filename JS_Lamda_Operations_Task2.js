// Take an array fill with data 

// use methods like filter,find, some, reduce etc.. 

let names = ["Alice", "Bob", "Charlie", "David", "Emma", "Frank", "Grace", "Henry", "Isabella", "Jack"];

//for Each Method
names.forEach(name => console.log(name));

//for Map Function
let Shockednames = names.map(name => name+'!');
console.log(Shockednames);

let reversedname = names.map(name => name.split('').reverse().join(''));
console.log(reversedname);

//for filter Function
let nameslength = names.filter(name => name.length>5);
console.log(nameslength);

//for find Function
let namefinder = names.find(name => name.startsWith('D'));
console.log(namefinder);
