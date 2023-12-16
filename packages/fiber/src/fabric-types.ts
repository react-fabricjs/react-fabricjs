import { fabric } from 'fabric'

export type Properties<T> = Pick<
	T,
	{ [K in keyof T]: T[K] extends (_: any) => any ? never : K }[keyof T]
>
export type NonFunctionKeys<T> = { [K in keyof T]-?: T[K] extends Function ? never : K }[keyof T]
export type Overwrite<T, O> = Omit<T, NonFunctionKeys<O>> & O

export interface NodeProps<T, P> {
	children?: React.ReactNode
	ref?: React.Ref<T>
	key?: React.Key
	onUpdate?: (self: T) => void
}

export type Node<T, P> = Overwrite<Partial<T>, NodeProps<T, P>>

export type ObjectNode<T, P> = Overwrite<Node<T, P>, {}>

export type ObjectProps = ObjectNode<fabric.IObjectOptions, typeof fabric.Object>
export type CircleProps = ObjectNode<fabric.ICircleOptions, typeof fabric.Circle>
export type RectProps = ObjectNode<fabric.IRectOptions, typeof fabric.Rect>
export type TextProps = ObjectNode<fabric.ITextOptions, typeof fabric.Text>
export type ImageProps = ObjectNode<fabric.IImageOptions, typeof fabric.Image>
export type PathProps = ObjectNode<fabric.IPathOptions, typeof fabric.Path>
export type GroupProps = ObjectNode<fabric.IGroupOptions, typeof fabric.Group>
export type EllipseProps = ObjectNode<fabric.IEllipseOptions, typeof fabric.Ellipse>
export type LineProps = ObjectNode<fabric.ILineOptions, typeof fabric.Line>

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
}

declare global {
	namespace JSX {
		interface IntrinsicElements extends FabricElements {}
	}
}
