import "./HTML.js"

const { h, app } = hyperapp

const state = {
    count: 0
}

const actions = {
    down: value => function ( state ) {
        return { count: state.count - value }
    },
    up: value => function ( state ) {
        return { count: state.count + value }
    }
}

const view = ( state, actions ) => h( "div", {}, [
    h( "h1", {}, state.count ),
    h( "button", { onclick: () => actions.down( 1 ) }, [ "-" ] ),
    h( "button", { onclick: () => actions.up( 1 ) }, [ "+" ] ),
    h( "div", {}, [
        h( "img", { src: "images/nodejs-logo.png" } )
    ] )
] )

app( state, actions, view, document.querySelector( "main" ) )
