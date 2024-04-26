import {
	AbsoluteFill,
	Easing,
	interpolate,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {makeCircle} from '@remotion/shapes';
import dagre, {Edge, Node} from 'dagre';

type NodeProps = Node<{
	id: string;
	position: {
		x: number;
		y: number;
	};
}>;
type EdgeProps = Edge & {source: string; target: string};
const position = {x: 0, y: 0};

const initialNodes = [
	{
		id: '1',
		type: 'input',
		data: {label: 'input'},
		position,
	},
	{
		id: '2',
		data: {label: 'node 2'},
		position,
	},
	{
		id: '2a',
		data: {label: 'node 2a'},
		position,
	},
	{
		id: '2b',
		data: {label: 'node 2b'},
		position,
	},
	{
		id: '2c',
		data: {label: 'node 2c'},
		position,
	},
	{
		id: '2d',
		data: {label: 'node 2d'},
		position,
	},
	{
		id: '3',
		data: {label: 'node 3'},
		position,
	},
	{
		id: '5',
		data: {label: 'node 5'},
		position,
	},
	{
		id: '6',
		type: 'output',
		data: {label: 'output'},
		position,
	},
	{id: '7', type: 'output', data: {label: 'output'}, position},
];

const initialEdges = [
	{
		id: 'e12',
		source: '1',
		target: '2',
	},
	{
		id: 'e13',
		source: '1',
		target: '3',
	},
	{
		id: 'e22a',
		source: '2',
		target: '2a',
	},
	{
		id: 'e22b',
		source: '2',
		target: '2b',
	},
	{
		id: 'e22c',
		source: '2',
		target: '2c',
	},
	{
		id: 'e22d',
		source: '2',
		target: '2d',
	},
	{
		id: 'e35',
		source: '3',
		target: '5',
	},
	{
		id: 'e56',
		source: '5',
		target: '6',
	},
	{
		id: 'e67',
		source: '6',
		target: '7',
	},
];

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
const NODE_SIZE = 50;
const getLayoutedElements = (nodes: Array<NodeProps>, edges: EdgeProps[]) => {
	dagreGraph.setGraph({
		rankdir: 'TB',
		width: 1920,
		height: 1080,
		nodesep: 190,
		ranksep: 400,
	});

	nodes.forEach((node) => {
		dagreGraph.setNode(node.id, {width: NODE_SIZE, height: NODE_SIZE});
	});

	edges.forEach((edge) => {
		dagreGraph.setEdge(edge.source, edge.target);
	});

	dagre.layout(dagreGraph);

	nodes.forEach((node) => {
		const nodeWithPosition = dagreGraph.node(node.id);

		// We are shifting the dagre node position (anchor=center center) to the top left
		// so it matches the React Flow node anchor point (top left).
		node.position = {
			x: nodeWithPosition.x - NODE_SIZE / 2,
			y: nodeWithPosition.y - NODE_SIZE / 2,
		};

		return node;
	});

	return {nodes, edges};
};

const {nodes: layoutedNodes, edges: layoutedEdges} = getLayoutedElements(
	// @ts-expect-error it is fine
	initialNodes,
	initialEdges
);

const circles = layoutedNodes.map((node) => {
	return {
		circle: makeCircle({
			radius: 50,
		}),
		node,
	};
});

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
