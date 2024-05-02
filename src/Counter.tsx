import React from 'react';
import {
	AbsoluteFill,
	interpolate,
	interpolateColors,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

import './counter.css';

const Counter = () => {
	const frame = useCurrentFrame();
	const {durationInFrames} = useVideoConfig();
	const scaleMinus = interpolate(
		frame,
		[0, durationInFrames / 4, durationInFrames / 2],
		[1, 1.25, 1]
	);
	const scalePlus = interpolate(
		frame,
		[
			durationInFrames / 2,
			durationInFrames - durationInFrames / 4,
			durationInFrames,
		],
		[1, 1.25, 1]
	);
	const colorMinus = interpolateColors(
		frame,
		[0, durationInFrames / 4, durationInFrames / 2],
		['black', 'red', 'black']
	);
	const colorPlus = interpolateColors(
		frame,
		[
			durationInFrames / 2,
			durationInFrames - durationInFrames / 4,
			durationInFrames,
		],
		['black', 'red', 'black']
	);
	const count = interpolate(
		frame,
		[
			0,
			durationInFrames / 4,
			durationInFrames / 2,
			durationInFrames - durationInFrames / 4,
			durationInFrames,
		],
		[0, -1, -1, -1, 0],
		{
			extrapolateRight: 'identity',
			extrapolateLeft: 'identity',
		}
	);
	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
				fontFamily: 'serif',
			}}
		>
			<div className="container">
				<h1>
					Current state:&nbsp;
					<p
						style={{
							display: 'inline-block',
						}}
					>
						{Math.trunc(count)}
					</p>
				</h1>
				<div>
					<button
						type="button"
						style={{
							outline: `10px solid ${colorMinus}`,
							outlineOffset: `${scaleMinus * 25}px`,
						}}
					>
						-
					</button>
					<span>{Math.trunc(count)}</span>
					<button
						type="button"
						style={{
							outline: `10px solid ${colorPlus}`,
							outlineOffset: `${(scalePlus < 1 ? 1 : scalePlus) * 25}px`,
						}}
					>
						+
					</button>
				</div>
			</div>
		</AbsoluteFill>
	);
};

export default Counter;
