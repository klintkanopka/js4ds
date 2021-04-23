#!/usr/bin/node

const array = [true, undefined, null]

// using of gets you the items in the array
for (let value of array) {
    console.log('the type of', value, 'is', typeof value)
}


// using in gets you indexes in the array
for (let value in array) {
    console.log('the type of', value, 'is', typeof value)
}


// checking the inherent truth values of a bunch of things in js
const values = [0, 1, '', 'text', undefined, null, [], [2,3]]
for (let element of values) {
    if (element) {
        console.log(element, 'of type', typeof element, 'is truthy')
    } else {
        console.log(element, 'of type', typeof element, 'is falsy')
    }
}



