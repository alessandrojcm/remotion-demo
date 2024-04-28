import {
	AbsoluteFill,
	Easing,
	interpolate,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {circles, layoutedEdges, layoutedNodes} from './graph';

const SECOND_ANIMATION_START = 70;
const Tree = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	return (
		<AbsoluteFill
			style={{
				backgroundColor: 'white',
				justifyContent: 'center',
				alignItems: 'center',
				padding: '50px',
			}}
		>
			<Sequence durationInFrames={70} layout="none">
				<svg
					width={width}
					height={height}
					viewBox={`0 0 ${width} ${height}`}
					style={{
						transform: 'translateX(25px)',
					}}
				>
					{circles
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
						})}
				</svg>
			</Sequence>
			<Sequence
				from={SECOND_ANIMATION_START}
				durationInFrames={70}
				layout="none"
			>
				<svg
					width={width}
					height={height}
					viewBox={`0 0 ${width} ${height}`}
					style={{
						transform: 'translateX(25px)',
					}}
				>
					{circles
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
										transformOrigin:
											circle.transformOrigin.replace(' ', 'px ') + 'px',
										transform: `translate(${position.x}px,${position.y}px)`,
										transformBox: 'fill-box',
									}}
								/>
							);
						})}
					{layoutedEdges
						.sort((e1, e2) => e1!.id!.localeCompare(e2!.id!))
						.map((edge, i) => {
							const sourceNode = layoutedNodes.find(
								({id}) => edge.source === id
							)!;
							const targetNode = layoutedNodes.find(
								({id}) => edge.target === id
							)!;
							const delay = i * 5;
							const x2Spring = spring({
								fps,
								frame: frame - SECOND_ANIMATION_START - delay,
								config: {
									mass: 0.1,
									damping: 5,
								},
							});
							const y2Spring = spring({
								fps,
								frame: frame - SECOND_ANIMATION_START - delay,
								config: {
									mass: 0.1,
									damping: 5,
								},
							});
							const x2 = interpolate(
								x2Spring,
								[0, 1],
								[sourceNode.position.x + 50, targetNode.position.x + 50],
								{
									easing: Easing.bezier(0.17, 0.67, 0.83, 0.67),
									extrapolateRight: 'extend',
								}
							);
							const y2 = interpolate(
								y2Spring,
								[0, 1],
								[sourceNode.position.y + 50, targetNode.position.y + 50],
								{
									easing: Easing.bezier(0.17, 0.67, 0.83, 0.67),
									extrapolateRight: 'extend',
								}
							);

							return (
								<line
									key={edge.name}
									stroke="black"
									strokeWidth={2}
									x1={sourceNode.position.x + 50}
									y1={sourceNode.position.y + 50}
									x2={x2}
									y2={y2}
								/>
							);
						})}
				</svg>
			</Sequence>
		</AbsoluteFill>
	);
};

export default Tree;
