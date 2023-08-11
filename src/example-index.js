import './style.css';
import { Component, h, render } from 'preact';
import { useState } from 'preact/hooks';

console.log("useState", useState);

function App() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <p>Embedded Preact template is working!</p>
        </div>
    );
}

render(<App />, document.body);