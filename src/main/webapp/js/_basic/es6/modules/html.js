// html.js

function square(x) {
    return Math.pow(x,2)
}

function cow() {
    console.log("Mooooo!!!")
}

export function tag (tag, text) {
  const el = document.createElement(tag)
  el.textContent = text

  return el
}



export {square, cow};
