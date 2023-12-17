import { fabric } from 'fabric'

export type Properties<T> = Pick<
	T,
	{ [K in keyof T]: T[K] extends (_: any) => any ? never : K }[keyof T]
>
export type NonFunctionKeys<T> = { [K in keyof T]-?: T[K] extends Function ? never : K }[keyof T]
export type Overwrite<T, O> = Omit<T, NonFunctionKeys<O>> & O

type Args<T> = T extends new (...args: any) => any ? ConstructorParameters<T> : T

export interface NodeProps<T, P> {
	args?: Args<P>
	children?: React.ReactNode
	ref?: React.Ref<T>
	key?: React.Key
	onUpdate?: (self: T) => void
}

export type Node<T, P> = Overwrite<Partial<T>, NodeProps<T, P>>

export type ObjectNode<T, P> = Overwrite<Node<T, P>, {}>

export type ObjectProps = ObjectNode<fabric.Object, typeof fabric.Object>
export type CircleProps = ObjectNode<fabric.Circle, typeof fabric.Circle>
export type RectProps = ObjectNode<fabric.Rect, typeof fabric.Rect>
export type TextProps = ObjectNode<fabric.Text, typeof fabric.Text>
export type ImageProps = ObjectNode<fabric.Image, typeof fabric.Image>
export type PathProps = ObjectNode<fabric.Path, typeof fabric.Path>
export type GroupProps = ObjectNode<fabric.Group, typeof fabric.Group>
export type EllipseProps = ObjectNode<fabric.Ellipse, typeof fabric.Ellipse>
export type LineProps = ObjectNode<fabric.Line, typeof fabric.Line>
export type TextBoxProps = ObjectNode<fabric.Textbox, typeof fabric.Textbox>

export interface FabricElements {
	'f-circle': CircleProps
	'f-object': ObjectProps
	'f-rect': RectProps
	'f-text': TextProps
	'f-image': ImageProps
	'f-path': PathProps
	'f-group': GroupProps
	'f-ellipse': EllipseProps
	'f-line': LineProps
	'f-textbox': TextBoxProps
}

declare global {
	namespace JSX {
		interface IntrinsicElements extends FabricElements {}
	}
}

// Events https://github.com/fabricjs/fabric.js/wiki/Working-with-events
type ObjectEvents =
	| 'added'
	| 'removed'
	| 'mousedown'
	| 'mouseup'
	| 'mouseover'
	| 'mouseout'
	| 'modified'
	| 'moving'
	| 'scaling'
	| 'rotating'
	| 'skewing'
	| 'deselected'
	| 'selected'
	| 'rotated'

type TextEvents =
	| 'editingEntered'
	| 'editingExited'
	| 'electionChanged'
	| 'changed'
	| 'dblclick'
	| 'tripleclick'

type CanvasEvents =
	| 'after:render'
	| 'before:render'
	| 'canvas:cleared'
	| 'mouse:over'
	| 'mouse:out'
	| 'mouse:down'
	| 'mouse:up'
	| 'mouse:move'
	| 'mouse:wheel'
	| 'object:added'
	| 'object:modified'
	| 'object:moving'
	| 'object:over'
	| 'object:out'
	| 'object:removed'
	| 'object:rotating'
	| 'object:scaling'
	| 'object:selected'
	| 'path:created'
	| 'before:selection:cleared'
	| 'selection:cleared'
	| 'selection:created'
	| 'text:editing:entered'
	| 'text:editing:exited'
	| 'text:selection:changed'
	| 'text:changed'
