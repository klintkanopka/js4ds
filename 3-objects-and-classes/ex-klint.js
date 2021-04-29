#!/usr/bin/node

// Delays
//
// I think there is probably a more elegant way to handle the switcheroo in 
// the call() function, but this works fine. i overloaded some names to make 
// a point that this.last and last are different things!

console.log('\n === Delays ===\n')

class Delay {
    constructor (start) {
        this.last = start
    }

    call (current) {
        const last = this.last
        this.last = current
        return last
    }
}

const example = new Delay('a')
for (let value of ['b', 'c', 'd']) {
  console.log(value, '->', example.call(value))
}


// Filtering
console.log('\n === Filtering ===\n')

class Filter {
    constructor () {
        this.filter = []
        for (let i = 0; i < arguments.length; i++){
            this.filter.push(arguments[i])
        }
    }

    call (val) {
        if (this.filter.includes(val)){
            return null
        } else {
            return val
        }
    }
}

const example2 = new Filter('a', 'e', 'i', 'o', 'u')
for (let value of ['a', 'b', 'c', 'd', 'e']) {
  console.log(value, '->', example2.call(value))
}


// Pipelines

console.log('\n === Pipelines ===\n')

class Pipeline {
    constructor () {
        this.functions = []
        for (let i = 0; i < arguments.length; i++){
            this.functions.push(arguments[i])
        }
    }

    call (val) {
         let output = this.functions.reduce((accum, func) => {
             if (accum !== null){
                accum = func.call(accum)
             }
             return accum
         }, val)
         return output
    }
}

const example3 = new Pipeline(new Filter('a', 'e', 'i', 'o', 'u'),
                              new Delay('a'))
for (let value of ['a' ,'b', 'c', 'd', 'e']) {
  console.log(value, '->', example3.call(value))
}

/*
// Active Expressions
//

class Active {
  constructor (name, transform) {
    this.name = name
    this.transform = transform
    this.subscribers = []
  }

  subscribe (someone) {
    this.subscribers.push(someone)
  }

  update (input) {
    console.log(this.name, 'got', input)
    const output = this.transform(input)
    for (let s of this.subscribers) {
      s.update(output)
    }
  }
}

const start = new Active('start', (x) => Math.min(x, 10))
const left = new Active('left', (x) => 2 * x)
const right = new Active('right', (x) => x + 1)
const final = new Active('final', (x) => x)
start.subscribe(left)
start.subscribe(right)
left.subscribe(final)
right.subscribe(final)

start.update(123)
*/
