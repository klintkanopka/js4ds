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

console.log('\nPipelines!\n')

class Pipeline {
    constructor (filter, delay) {
      this.filter = []
      for (let i = 0; i < arguments.length; i++){
        this.filter.push(arguments[i])
        }
    }

    call (val) {
      for (let i = 0; i < this.filter.length; i++){
          if (val !== null){
            val = this.filter[i].call(val)
          } else {
              return null
          }
      }
      return val
    }
}

const example3 = new Pipeline(new Filter('a', 'e', 'i', 'o', 'u'),
                                  new Delay('a'))
for (let value of ['a' ,'b', 'c', 'd', 'e']) {
    console.log(value, '->', example3.call(value))
}
/*
    a -> null
    b -> a
    c -> b
    d -> e
    e -> null
*/
