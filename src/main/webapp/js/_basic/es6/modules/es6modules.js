// es6modules.js
import { square, tag } from './html.js'

let a = square(12);
const h1 = tag('h1', ' from Js code:' + a);
document.body.appendChild(h1);
