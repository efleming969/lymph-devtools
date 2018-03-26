import { Utils, HTML } from "lymph-client"

import GreetingBuilder from "./GreetingBuilder"
import Simple from "./Simple"

const builder = new GreetingBuilder()

console.log( builder.build() )

const person = { name: "joe", age: 20 }

console.log( Utils.merge( person, { age: 40 } ) )

const simple = new Simple( "joe" )

simple.printTo( console )

console.log( HTML )

const img = document.createElement("img")
img.src = "images/nodejs-logo.png"

document.body.appendChild(img)
