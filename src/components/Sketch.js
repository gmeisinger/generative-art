import React from 'react';
import { useEffect, useRef } from 'react';
import './globals';
import "p5/lib/addons/p5.sound";
import p5 from 'p5';

import songFile from '../assets/sliced_vocals2.wav';

function Sketch(props) {
	const myRef = useRef(null);

	const Sketch = (p) => {

		const r = 100;
		const ampFactor = .3;
		const rayAmpFactor = .1;
		const numRays = 80; //number of sun rays
		const rayLength = 200;
		const elongation = 1.1;

		//const 

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
			p.translate(p.width / 2, p.height / 2);


			let spectrum = p.fft.analyze();

			// lets set aside the most active frequencies to use in the sun rays
			let rayPool = [...spectrum].sort((a, b) => { return a - b; }).slice(0, numRays);
			const minRay = rayPool[rayPool.length - 1];
			let rays = spectrum.filter((ray) => ray >= minRay);
			// find a better way to do this... copy array, sort, slice, filter. Can we iterate once to get rays? (I doubt it)
			// idk its probably fine, lets get the average value of the spectrum to find a threshold
			
			// ok with the rays lets get an avg amplitude
			const average = (array) => array.reduce((a, b) => a + b) / array.length;
			const avgAmp = average(rays);

			// make the rays
			let rayStep = p.TWO_PI / numRays;
			let rayTerminals = rays.map((ray, i) => {
				return { x: (0 - p.cos(i * rayStep)) * (rayLength + ray), y: (0 - p.sin(i * rayStep)) * (rayLength + ray) };
			});

			// draw the background of rays
			p.fill('#c12600');
			p.noStroke();
			p.beginShape();
			rayTerminals.forEach((terminal) => {
			    p.vertex(terminal.x, terminal.y);
			});
			p.endShape(p.CLOSE);

			//draw the rays
			p.stroke(0);
			p.strokeWeight(p.width / 500);
			rayTerminals.forEach((terminal, i) => {
			    p.line(0, 0, terminal.x, terminal.y);
			});

			// we want to cutoff the unused end of the spectrum to make it prettier
			for (let i = spectrum.length; i >= 0; i--) {
				if (spectrum[i] > 0) {
					spectrum = spectrum.slice(2, i);
					break;
				}
			}
			let step = p.PI / spectrum.length;

			let halfPoints = spectrum.map((amp, i) => {
				// get carts from polar coords
				const angle = step * i;
				const x = (r + (amp * ampFactor)) * p.sin(angle);
				const y = (r + (amp * ampFactor)) * p.cos(angle);
				return { x: x, y: y };
			});

			let points = [...halfPoints].concat(halfPoints.reverse().map((pair, i) => {
				return { x: -pair.x, y: pair.y };
			}));

			// draw big sun
			p.fill('#f48037');
			//p.noStroke();
			p.stroke(0);
			p.strokeWeight(4);
			p.beginShape();
			for (let i = 0; i < points.length; i++) {
				p.vertex(points[i].x * 1.4, -points[i].y * 1.4);
			}
			p.endShape();

			// draw sun
			p.fill('#fafd0f');
			//p.noStroke();
			p.stroke(0);
			p.strokeWeight(4);
			p.beginShape();
			for (let i = 0; i < points.length; i++) {
				p.vertex(points[i].x, points[i].y);
			}
			p.endShape();

			// //draw face
			p.textAlign(p.CENTER);
			p.textSize(128);
			if (avgAmp <7) {
				p.text('😐', 0,48);
			} else if(avgAmp <19) {
				p.text('😮', 0,48);
			} else if(avgAmp <34) {
				p.text('😲', 0,48);
			} else {
				p.text('😵', 0,48);
			}

		}

		p.windowResized = () => {
			p.resizeCanvas(p.windowWidth, p.windowHeight);
		}

		p.mousePressed = () => {
			if (p.song.isPlaying()) {
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