import { h } from "../../utils/HTML"
import { message } from "../../widgets/ultradom/HelloWorld"

export default ( { name } ) => h( "header", {}, [
    message( `Welcome ${ name }!` )
] )

