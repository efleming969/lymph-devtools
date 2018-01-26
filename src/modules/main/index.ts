import GreetingBuilder from "./GreetingBuilder"
import map from "ramda/es/map"
import Simple from "../../components/Simple"

const builder = new GreetingBuilder()

console.log( builder.build() )

console.log( map( x => x.toString() ), [ "one", "two" ] )

const simple = new Simple("joe")

simple.printTo(console)
