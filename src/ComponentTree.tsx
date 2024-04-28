import {circles, layoutedEdges, layoutedNodes} from './graph';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import React, {ReactNode} from 'react';

const nodes = circles
	.sort((c1, c2) => c1.node.position.y - c2.node.position.y)
	.map(({circle, node: {id, position}}) => {
		return (
			<path
				key={id}
				data-nodeid={id}
				d={circle.path}
				strokeWidth={2}
				fill="black"
				style={{
					padding: `100px`,
					transformOrigin: circle.transformOrigin.replace(' ', 'px ') + 'px',
					transform: `translate(${position.x}px,${position.y}px)`,
					transformBox: 'fill-box',
				}}
			/>
		);
	});
export const Tree = ({
	animate = 'none',
	style = {},
	children,
}: {
	animate: 'nodes' | 'none';
	style: Record<string, string>;
	children?: ReactNode;
}) => {
	const {width, height, fps} = useVideoConfig();
	const frame = useCurrentFrame();
	return (
		<svg
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			style={style}
		>
			{animate === 'nodes'
				? circles
						.sort((c1, c2) => c1.node.position.y - c2.node.position.y)
						.map(({circle, node: {id, position}}, i) => {
							const delay = i * 5;

							const scale = spring({
								fps,
								frame: frame - delay,
								config: {
									damping: 200,
								},
							});
							return (
								<path
									key={id}
									data-nodeid={id}
									d={circle.path}
									strokeWidth={2}
									fill="black"
									style={{
										padding: `100px`,
										transformOrigin:
											circle.transformOrigin.replace(' ', 'px ') + 'px',
										transform: `translate(${position.x}px,${position.y}px) scale(${scale})`,
										transformBox: 'fill-box',
									}}
								/>
							);
						})
				: null}
			{animate === 'none' ? (
				<>
					{nodes}
					{layoutedEdges
						.sort((e1, e2) => e1!.id!.localeCompare(e2!.id!))
						.map((edge) => {
							const sourceNode = layoutedNodes.find(
								({id}) => edge.source === id
							)!;
							const targetNode = layoutedNodes.find(
								({id}) => edge.target === id
							)!;
							return (
								<line
									key={edge.name}
									stroke="black"
									strokeWidth={2}
									x1={sourceNode.position.x + 50}
									y1={sourceNode.position.y + 50}
									x2={targetNode.position.x + 50}
									y2={targetNode.position.y + 50}
								/>
							);
						})}
				</>
			) : null}
			{children}
		</svg>
	);
};
