export default class {
    constructor ( private name: string ) {

    }

    printTo ( console ) {
        console.log( `hello, ${this.name}` )
    }
}