

// let diceEntries = new Set();
//  console.log(diceEntries)
// //Add Values
// diceEntries.add(1);
// diceEntries.add(2);
// diceEntries.add(3);
// diceEntries.add(4).add(5).add(6);   //Chaining of add() method is allowed
// console.log(diceEntries)

const { sort } = require("core-js/fn/array")

// //Check value is present or not
// diceEntries.has(1);                 //true
// diceEntries.has(10);                //false
 
// //Size of Set 
// diceEntries.size;                   //6
 
// //Delete a value from set
// diceEntries.delete(6);              // true
 
// //Clear whole Set
// diceEntries.clear();                //Clear all entries

dd = ["นำ","รถ","มา","ประเมินราคา","มา","ไก่"]
dd = sort(dd)
console.log(dd)
ss = new Set(dd)
console.log(ss)

const sortThaiDictionary = list => {
    const newList = [...list]
    newList.sort((a, b) => a.localeCompare(b, 'th'))
    return newList
  }

const list = ['ข', 'ค', 'ก']
const sortedList = sortThaiDictionary(dd)
console.log(sortedList)
