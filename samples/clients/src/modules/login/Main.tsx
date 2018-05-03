import { h } from "../../utils/HTML"

import Header from "./Header"

export const view = ( name ) => <main>
    <Header name={ name }/>
    <p>This is the paragraph</p>
</main>
