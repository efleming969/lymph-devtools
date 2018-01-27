import GreetingBuilder from "./GreetingBuilder"
import * as R from "ramda"
import Simple from "../../components/Simple"

const builder = new GreetingBuilder()

console.log( builder.build() )

console.log( R.map( x => x.toString() ), [ "one", "two" ] )

const simple = new Simple( "joe" )

simple.printTo( console )
