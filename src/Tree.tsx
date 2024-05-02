import {
	AbsoluteFill,
	Easing,
	interpolate,
	interpolateColors,
	Series,
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
			<Series>
				<Series.Sequence durationInFrames={70} layout="none">
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
				</Series.Sequence>
				<Series.Sequence durationInFrames={70} layout="none">
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
				</Series.Sequence>
				<Series.Sequence durationInFrames={50} layout="none">
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
						{circles
							.filter((a) => a.node.data.update === '1')
							.sort((c1, c2) => c1.node.position.y - c2.node.position.y)
							.map(({circle, node: {id, position}}, i) => {
								const delay = i * 5;
								const factor = spring({
									fps,
									frame: frame - SECOND_ANIMATION_START * 2 - delay,
									durationInFrames: 50,
									config: {
										damping: 200,
									},
								});
								const scale = interpolate(factor, [0, 0.5, 1], [1, 1.5, 1], {
									easing: Easing.bezier(0.17, 0.67, 0.83, 0.67),
									extrapolateRight: 'extend',
								});
								const color = interpolateColors(
									factor,
									[0, 0.5, 1],
									['black', 'red', 'black']
								);
								return (
									<path
										key={id}
										data-nodeid={id}
										d={circle.path}
										strokeWidth={2}
										fill={color}
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
				</Series.Sequence>
				<Series.Sequence durationInFrames={50} layout="none">
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
						{circles
							.filter((a) => a.node.data.update === '2')
							.sort((c1, c2) => c1.node.position.y - c2.node.position.y)
							.map(({circle, node: {id, position}}) => {
								const factor = spring({
									fps,
									frame: frame - SECOND_ANIMATION_START * 3,
									config: {
										damping: 50,
									},
								});
								const scale = interpolate(factor, [0, 0.5, 1], [1, 1.5, 1], {
									easing: Easing.bezier(0.17, 0.67, 0.83, 0.67),
								});
								const color = interpolateColors(
									factor,
									[0, 0.01, 0.25, 0.5, 0.75, 1],
									['black', 'red', 'red', 'red', 'red', 'black']
								);
								return (
									<path
										key={id}
										data-nodeid={id}
										d={circle.path}
										strokeWidth={2}
										fill={color}
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
				</Series.Sequence>
			</Series>
		</AbsoluteFill>
	);
};

export default Tree;
