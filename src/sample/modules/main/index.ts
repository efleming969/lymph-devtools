import GreetingBuilder from "./GreetingBuilder"
import Simple from "../../components/Simple"
import { merge } from "lymph-client/lib/Utils"
import * as Lymph from "lymph-client"

const builder = new GreetingBuilder()

console.log( builder.build() )

const person = { name: "joe", age: 20 }
console.log( merge( person, { age: 40 } ) )

const simple = new Simple( "joe" )

simple.printTo( console )

console.log( Lymph.HTML )
