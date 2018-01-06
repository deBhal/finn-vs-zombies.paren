## Mithril > React
I do want a virtual dom

### Context
https://github.com/helmutkian/cl-react exists and I had it working, but it hadn't kept up with javascript or react, and has some issues:
- factories are gone. I fixed this locally without too much hassle
- psx messes up nested code. psx struggles to tell properties from children, and as a result makes mistakes with nested components. A thing component sometimes just throws a 'function not found error' (because it evaluates some code in the lisp context instead of the js one), sometimes works correctly, and sometimes sort of works, where it passes the props to the component like { children: props }.

Flawed magic is worse than no magic

Mithril seems lighter, and "lispier" to begin with. The format explicitly separates props and children, so that shouldn't be a problem for macros, but it's light enough that I can use it for a while without even finding/writing wrappers.

