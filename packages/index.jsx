import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'))
let element = <div>
    <section style={{fontSize: 100}}> 
        section: 电子书：
        <a selfAtt='attr_a' style={{ color: 'blue' }} href="https://www.yangyitao.com/react18">a: https://www.yangyitao.com/react18</a>
    </section>
</div>
root.render(element)
// console.log("index.jsx", element);