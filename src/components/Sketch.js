import React from 'react';
import { useEffect, useRef } from 'react';
import p5 from 'p5';

function Sketch(props) {
    const myRef = useRef(null);

    const Sketch = (p) => {
        p.setup = () => {
            p.canvas = p.createCanvas(p.windowWidth-4, p.windowHeight-4);
        }

        p.draw = () => {
            p.background(0);
            p.fill(255);
            p.rect(50, 50, 50, 50);
        }

        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth-4, p.windowHeight-4);
        }
    }

    useEffect(() => {
        let myp5 = new p5(Sketch, myRef.current);
    }, []);

    return (
        <div ref={myRef}>

        </div>
    )
}

export default Sketch