import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'))
let element = <div  onClick={(event) => console.log('onclick-parent-bubble', event)}
                    onClickCapture={(event) => {
                        console.log('onclick-parent-capture', event)
                        // event.stopPropagation()
                    }}
                    a='123'
>
        <p      onClick={(event) => console.log('onclick-child-bubble', event)}
                onClickCapture={(event) => {
                    console.log('onclick-child-capture', event)
                    // event.stopPropagation()
                }}>p content</p>
</div>
root.render(element)
// console.log("index.jsx", element);