// class Delay
console.log('\n=== Delay exercise ===\n')

class Delay {
  constructor (firstVal) {
    this._currentVal = firstVal;
  }

  call (newVal) {
    let oldVal = this._currentVal;  // temporarily store the old current value so we can return it
    this._currentVal = newVal; // update the current value to the new value in this call
    return oldVal; // return the old call
  }
}

console.log('\nPrint result of Delay example\n')
const example = new Delay('a')

for (let value of ['b', 'c', 'd']) {
  console.log(value, '->', example.call(value))
}


console.log('\nPrint result of exampleD2\n')
const exampleD2 = new Delay('kenny')

for (let value of ['klint', 'clem', 'anya']) {
  console.log(value, '->', exampleD2.call(value))
}

// class Filter
console.log('\n=== Filter Exercise ===\n')

class Filter {
  constructor() {
    this.filter = [];
    for (let i = 0; i < arguments.length; i++) {
      this.filter.push(arguments[i]);
    }
  }

  checkType () {
    return typeof(this.filter)
  }

  call (item) {
    if (this.filter.includes(item)) {
      return null;
    } else {
      return item;
    }
  }
}

const exampleF = new Filter('a', 'e', 'i', 'o', 'u')
console.log('The type of argument passed into instance exampleF is ' + exampleF.checkType() + '\n');

for (let value of ['a', 'b', 'c', 'd', 'e']) {
  console.log(value, '->', exampleF.call(value))
}

// class Pipeline
console.log('\n=== Pipeline exercise ===\n')

class Pipeline {
  constructor() {
    this.actions = [] // initialize list of functions of unspecified length as empty array
    for (let i = 0; i < arguments.length; i++) {
      this.actions.push(arguments[i]) // builds array of functions that were inputted
    }
  }

  call (val) { // create call method for Pipeline
      for (let i = 0; i < this.actions.length; i++) { // iterate through the array of functions
          if (val !== null) {
            val = this.actions[i].call(val) // if value is not null, give result of calling the function with the value
          } else {
              return null // if value is null, exit pipeline and return null
          }
      }
      return val
  }
}

const exampleP = new Pipeline(new Filter('a', 'e', 'i', 'o', 'u'),
                             new Delay('a'))
for (let value of ['a' ,'b', 'c', 'd', 'e']) {
  console.log(value, '->', exampleP.call(value))
}


console.log("\n---See Klint's elegant solution with array.reduce()---\n")

class Pipeline2 {
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

// Active expressions Exercise
console.log('\n=== Active Expressions exercise ===\n')

/* 1) what happens when the last line is called?
 Math.min() returns the lowest value passed into it, or NaN if any parameter isn't a number.
 start.subscribe(left) adds the new instance of Active with name 'left' and transform expression 2*x
 to start's array of subscribers. start.subscribe(right) adds the instance with name 'right' and x+1 to that array.
 The last line, start.update(123), then prints out what each instance in start's subscribers array got
 when start was given the input 123. So, start got 123, output became the result of Math.min(123,10) returning 10,
 which was then fed into the instances in start's subscribers array. Now update goes through each of the subscribers.
 So, start's left gets 10, left's final gets 20, start's right gets 10, right's final gets 11. */

class Active {
  constructor (name, transform) {
    this.name = name
    if (arguments.length > 1) { this.transform = transform }
    else { this.transform = (x) => x*100 }
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

const start = new Active('start', (x) => Math.min(x, 10), (x) => x - 5) // ignores the extra argument
const left = new Active('left', (x) => 2 * x)
const right = new Active('right', (x) => x + 1)
const final = new Active('final', (x) => x)
start.subscribe(left)
start.subscribe(right)
left.subscribe(final)
right.subscribe(final)

start.update(123);

console.log('\n=== Delay Transform ===\n')

class TransDelay {
  constructor (name, transform, initial) {
    this.name = name
    this.transform = transform
    this.initial = initial
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

  transform (newVal) {
    let oldVal = this.initial;  // temporarily store the old current value so we can return it
    this.initial = newVal; // update the current value to the new value in this call
    return oldVal; // return the old call
  }
}
}

const start1 = new Active('start1', (x) => Math.min(x, 10), 1) // ignores the extra argument
const left1 = new Active('left1', (x) => 2 * x, 1)
const right1 = new Active('right1', (x) => x + 1, 1)
const final1 = new Active('final1', (x) => x, 1)
start1.subscribe(left1)
start1.subscribe(right1)
left1.subscribe(final1)
right1.subscribe(final1)

start1.update(123);

console.log('\n=== Kenny Delay Transform ===\n')

class KennyDelay {
  constructor (name, transform, initial) {
    this.name = name
    this.transform = transform
    this.subscribers = []
    this.initial = initial
  }

  subscribe (someone) {
    this.subscribers.push(someone)
  }

  update (input) {
    console.log(this.name, 'got', input)
    const output = this.transform(this.initial)
    this.initial = input
    for (let s of this.subscribers) {
      s.update(output)
    }
  }
}

const start2 = new KennyDelay('start2', (x) => Math.min(x, 10), 5) // ignores the extra argument
const left2 = new KennyDelay('left2', (x) => 2 * x, 5)
const right2 = new KennyDelay('right2', (x) => x + 1, 5)
const final2 = new KennyDelay('final2', (x) => x, 5)
start2.subscribe(left2)
start2.subscribe(right2)
left2.subscribe(final2)
right2.subscribe(final2)

start2.update(123);
start2.update(4);
start2.update(8);
