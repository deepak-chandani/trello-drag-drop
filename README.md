## Trello Clone Drag Drop functionality

https://user-images.githubusercontent.com/15975603/128753262-10c30411-018a-44af-9ec6-da6676200c30.mov

- I wanted to implement custom drag & drop functionality in VanillaJS without using any external dependency so build this small application.
- We are persisting task data inside `localStorage`, so board will be re-hydrated even when browser is refreshed.
- I tried to make it reusable so all the drag & drop related code is inside separate file & is decoupled from HTML layout

### Things I learned while working on this project:
- DOM manipulation methods in VanillaJS, for example:
  - `node.append(element)`
  - `parentNode.insertBefore(newChild: Node, refChild: Node): Node`
  - `node.cloneNode(deep?: boolean): Node`
  - `node.classList.add(className:String)` `node.classList.remove(className:String)`
  - `node.getBoundingClientRect()`
  - mouse events like `mousedown`, `mousemove` and `mouseup`
  - `node.dataset` hash map of custom data attributes
