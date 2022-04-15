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

            p.song = p.loadSound(songFile);
            p.env = new p5.Envelope();
            p.fft = new p5.FFT();
            p.fft.setInput(p.song);
        }

        p.draw = () => {
            p.background(135, 206, 235);
            //move 0,0 to center
            p.translate(p.width/2, p.height/2);
            const r = 100;
            const ampFactor = .3;
            const rayAmpFactor = .1;
            const numRays = 80; //number of sun rays
            const rayLength = 180;

            let spectrum = p.fft.analyze();

            // lets set aside the most active frequencies to use in the sun rays
            let rayPool = [...spectrum].sort((a,b) => { return a - b; }).slice(0,numRays);
            const minRay = rayPool[rayPool.length-1];
            let rays = spectrum.filter((ray) => ray >= minRay);

            // make the rays
            let rayStep = p.TWO_PI/numRays;
            let rayTerminals = rays.map((ray, i) => {
                return { x: (0 - p.cos(i*rayStep)) * (rayLength + ray), y: (0 - p.sin(i*rayStep)) * (rayLength + ray) };
            });

            // draw the background of rays
            // p.fill('#f48037');
            // //p.noStroke();
            // p.beginShape();
            // rayTerminals.forEach((terminal) => {
            //     p.vertex(terminal.x, terminal.y);
            // });
            // p.endShape(p.CLOSE);

            //draw the rays
            // p.stroke(0);
            // p.strokeWeight(p.width / 500);
            // rayTerminals.forEach((terminal, i) => {
            //     p.line(0, 0, terminal.x, terminal.y);
            // });

            // we want to cutoff the unused end of the spectrum to make it prettier
            for(let i=spectrum.length;i>=0;i--) { 
                if(spectrum[i] > 0) {
                    spectrum = spectrum.slice(2, i);
                    break;
                }
            }
            let step = p.PI/spectrum.length;

            let halfPoints = spectrum.map((amp, i) => {
                // get carts from polar coords
                const angle = step * i;
                const x = (r + (amp * ampFactor)) * p.sin(angle);
                const y = (r + (amp * ampFactor)) * p.cos(angle);
                return { x: x, y: y };
            });

            let points = [...halfPoints].concat(halfPoints.reverse().map((pair, i) => {
                return { x: 0 - pair.x, y: pair.y };
            }));

            // draw big sun
            p.fill('#f48037');
            p.noStroke();
            //p.stroke(0);
            p.strokeWeight(p.width / 280);
            p.beginShape();
            for(let i=0;i<points.length;i++) {
                p.vertex(points[i].x * 2, points[i].y * 2);
            }
            p.endShape();

            //draw the rays
            // p.stroke(0);
            // p.strokeWeight(p.width / 500);
            // rayTerminals.forEach((terminal, i) => {
            //     p.line(0, 0, terminal.x, terminal.y);
            // });

            // draw sun
            p.fill('#fafd0f');
            p.noStroke();
            //p.stroke(0);
            p.strokeWeight(p.width / 280);
            p.beginShape();
            for(let i=0;i<points.length;i++) {
                p.vertex(points[i].x, points[i].y);
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