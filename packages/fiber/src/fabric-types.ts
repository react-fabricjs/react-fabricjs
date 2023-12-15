import { fabric } from 'fabric'

export type Properties<T> = Pick<
	T,
	{ [K in keyof T]: T[K] extends (_: any) => any ? never : K }[keyof T]
>
export type NonFunctionKeys<T> = { [K in keyof T]-?: T[K] extends Function ? never : K }[keyof T]
export type Overwrite<T, O> = Omit<T, NonFunctionKeys<O>> & O

/**
 * If **T** contains a constructor, @see ConstructorParameters must be used, otherwise **T**.
 */
type Args<T> = T extends new (...args: any) => any ? ConstructorParameters<T> : T

export interface NodeProps<T, P> {
	/** Constructor arguments */
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

export interface FabricElements {
	'f-circle': fabric.ICircleOptions
}

declare global {
	namespace JSX {
		interface IntrinsicElements extends FabricElements {}
	}
}
