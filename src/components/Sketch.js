import React from 'react';
import { useEffect, useRef } from 'react';
import './globals';
import "p5/lib/addons/p5.sound";
import p5 from 'p5';

import songFile from '../assets/guitar_jam1.wav';

function Sketch(props) {
    const myRef = useRef(null);

    const Sketch = (p) => {
        p.setup = () => {
            p.canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            p.noFill();

            p.song = p.loadSound(songFile);
            p.env = new p5.Envelope();
            p.fft = new p5.FFT();
            p.fft.setInput(p.song);
        }

        p.draw = () => {
            p.background(200);
            let spectrum = p.fft.analyze();

            p.beginShape();
            for(let i=0;i<spectrum.length;i++) {
                p.vertex(i*2, p.map(spectrum[i], -100, p.width, p.height, 0));
            }
            p.endShape();
        }

        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        }

        p.mousePressed = () => {
            if(p.song.isPlaying()) {
                p.song.stop();
            } else {
                p.song.play();
            }
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