#!/usr/bin/node

// typeof is an operator
// Array.push appends values 
// += adds a value to the LHS and stores it in the same place
// Array.reverse reverse a list

function isTruthy (thing) {
    if (typeof thing === 'object' && !thing.length) {
        return false 
    } else if (thing) {
        return true
    } else {
        return false
    }
}

console.log(isTruthy(1))
console.log(isTruthy(0))
console.log(isTruthy([]))

// having it return the array keeps the shape correct - so that downstream code
// that depends on the output doesn't break
