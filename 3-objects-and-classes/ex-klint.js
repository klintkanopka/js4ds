#!/usr/bin/node

// Delays
//
// I think there is probably a more elegant way to handle the switcheroo in 
// the call() function, but this works fine. i overloaded some names to make 
// a point that this.last and last are different things!

console.log('\n=== Delays ===\n')

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
console.log('\n=== Filtering ===\n')

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

console.log('\n=== Pipelines ===\n')

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

// Active Expressions

console.log('\n=== Active Experessions ===\n')

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

// When calling start.update(123), here's what happens:
// 1. you print what "start" gets (123)
// 2. call the transform function on the input 
//   (for start, this produces output = 10)
// 3. you feed that input to each of start's subscribers 
//   (this is where it gets tricky)
//   Note that now start has two subscribers: left and right, in that order.
// 4. left gets called with input 10, and left has one subscriber (final)
//   a. the left transform doubles the (10 -> 20) and passes it to final
//   b. final does not transform input (20) and has no subscribers, so final
//     terminates after printing what its input was
// 5. right gets called with input 10
//   a. right transforms the input (10 -> 11) and has one subscriber (final)
//   b. final does not transform the input and has no subscribers, so terminates

class NewActive {
  constructor (name) {
    this.name = name

    if (arguments.length > 1) {
        this.trans = arguments[1]
        this.custom = true
    } else {
        this.custom = false
    }

    this.subscribers = []
  }

  transform (input) {
    let output = input ** -2
    return output
  }

  subscribe (someone) {
    this.subscribers.push(someone)
  }

  update (input) {
    console.log(this.name, 'got', input)
    var output
    if (this.custom) {
        output = this.trans(input)
    } else {
        output = this.transform(input)
    }
    for (let s of this.subscribers) {
      s.update(output)
    }
  }
}

// this works, but it's important that you don't try to assign variables within
// the if/else brackets - declare them above and set the values later. scope is
// weird here!!

const start2 = new NewActive('start with transform', (x) => Math.min(x, 10))
start2.subscribe(left)
start2.subscribe(right)
start2.update(123)

const start3 = new NewActive('start no transform')
start3.subscribe(left)
start3.subscribe(right)
start3.update(123)


class NewDelay {
  constructor (name, start) {
    this.name = name
    this.previous = start
    this.subscribers = []
  }

  transform (input) {
    let output = this.previous
    this.previous = input
    return output
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


const startdelay = new NewDelay('start delay', 75)
const finaldelay = new NewDelay('final delay', 25)
startdelay.subscribe(left)
startdelay.subscribe(right)
startdelay.subscribe(finaldelay)
left.subscribe(finaldelay)
right.subscribe(finaldelay)

startdelay.update(12)
