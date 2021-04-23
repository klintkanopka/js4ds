#!/usr/bin/node

// Side Effects With forEach
//
// First I'll do it with a "double in place" function

console.log('\nSide Effects With forEach')

const doubleInPlace = (array) => {
    array.forEach((v, l) => {
        array[l] = 2*v
    }) 
}

const vals = [1, 2, 3]
console.log(`vals before doubleInPlace: ${vals}`)
doubleInPlace(vals)
console.log(`vals after doubleInPlace: ${vals}`)

// Next I'll write a function that doubles in place and apply it using forEach
// This is the same as above, basically. 

const dbl = (value, loc, container) => {
    container[loc] = 2*value
}

console.log(`vals before .forEach(dbl): ${vals}`)
vals.forEach(dbl)
console.log(`vals after .forEach(dbl): ${vals}`)

// both of these are super weird and not what I'd ever do, so let's respect the
// "data in, data out" bit of functional programming and try using an anonymous
// function with map:

console.log(`vals before using .map: ${vals}`)
new_vals = vals.map((x) => {return 2*x})
console.log(`vals after using .map: ${vals}`)
console.log(`vals returned using .map: ${new_vals}`)

// Annotating Data
//
// Method one provides the exact output

console.log('\nAnnotating data')

const data = [
  {'date': '1977-7-16', 'sex': 'M', 'species': 'NL'},
  {'date': '1977-7-16', 'sex': 'M', 'species': 'NL'},
  {'date': '1977-7-16', 'sex': 'F', 'species': 'DM'},
  {'date': '1977-7-16', 'sex': 'M', 'species': 'DM'},
  {'date': '1977-7-16', 'sex': 'M', 'species': 'DM'},
  {'date': '1977-7-16', 'sex': 'M', 'species': 'PF'},
  {'date': '1977-7-16', 'sex': 'F', 'species': 'PE'},
  {'date': '1977-7-16', 'sex': 'M', 'species': 'DM'}
]

console.log('starting data:')
data.forEach((x) => {console.log(x)})

newData = data
           .reduce((accum, row) => {
               const newRow = {
                   'seq': accum.length + 1,
                   'year': row.date.split('-')[0],
                   'sex': row.sex,
                   'species': row.species
               }
               accum.push(newRow)
               return accum
           }, [])
           .filter((row) => {return row.sex == 'F'})

console.log('new data:')
newData.forEach((row) => {console.log(row)})

// This method seems more efficient, but has a weird side effect

newData2 = data
           .reduce((accum, row) => {
               row.seq = accum.length + 1
               row.year = row.date.split('-')[0]
               delete row.date
               accum.push(row)
               return accum
           }, [])
           .filter((row) => {return row.sex == 'F'})

console.log('\n\'efficient\' new data:')
newData2.forEach((row) => {console.log(row)})

console.log('starting data after \'efficient\' method:')
data.forEach((x) => {console.log(x)})

// what happens here is that the .reduce() function will modify data in place
// if you let it! defining the new object to catch the results is safer
