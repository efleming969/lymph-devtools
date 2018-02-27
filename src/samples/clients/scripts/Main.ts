import GreetingBuilder from "./GreetingBuilder"
import Simple from "./Simple"
import { Utils } from "lymph-client"

const builder = new GreetingBuilder()

console.log( builder.build() )

const person = { name: "joe", age: 20 }

console.log( Utils.merge( person, { age: 40 } ) )

const simple = new Simple( "joe" )

simple.printTo( console )

// console.log( HTML )
