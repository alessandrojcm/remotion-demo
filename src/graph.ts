import dagre, {Edge, Node} from 'dagre';
import {makeCircle} from '@remotion/shapes';

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
		data: {label: 'node 5', update: '1'},
		position,
	},
	{
		id: '6',
		type: 'output',
		data: {label: 'output', update: '2'},
		position,
	},
	{
		id: '7',
		type: 'output',
		data: {label: 'output', update: '2'},
		position,
	},
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

export {circles, layoutedEdges, layoutedNodes};
