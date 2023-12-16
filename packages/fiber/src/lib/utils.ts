import React from 'react'
import { UseBoundStore } from 'zustand'
import { Instance, InstanceProps, LocalState } from './renderer'
import { RootState } from './store'

export type DiffSet = {
	memoized: { [key: string]: any }
	changes: [key: string, value: unknown, isEvent: boolean, keys: string[]][]
}

export const isDiffSet = (def: any): def is DiffSet =>
	def && !!(def as DiffSet).memoized && !!(def as DiffSet).changes

export const DEFAULT = '__default'

// This function prepares a set of changes to be applied to the instance
export function diffProps(
	instance: Instance,
	{ children: cN, key: kN, ref: rN, ...props }: InstanceProps,
	{ children: cP, key: kP, ref: rP, ...previous }: InstanceProps = {},
	remove = false
): DiffSet {
	const entries = Object.entries(props)
	const changes: [key: string, value: unknown, isEvent: boolean, keys: string[]][] = []

	// Catch removed props, prepend them so they can be reset or removed
	if (remove) {
		const previousKeys = Object.keys(previous)
		for (let i = 0; i < previousKeys.length; i++) {
			if (!props.hasOwnProperty(previousKeys[i]))
				entries.unshift([previousKeys[i], DEFAULT + 'remove'])
		}
	}

	entries.forEach(([key, value]) => {
		// When props match bail out
		if (is.equ(value, previous[key])) return
		// Collect handlers and bail out
		if (/^on(Pointer|Click|DoubleClick|ContextMenu|Wheel)/.test(key))
			return changes.push([key, value, true, []])
		// Split dashed props
		let entries: string[] = []
		if (key.includes('-')) entries = key.split('-')
		changes.push([key, value, false, entries])

		// Reset pierced props
		for (const prop in props) {
			const value = props[prop]
			if (prop.startsWith(`${key}-`)) changes.push([prop, value, false, prop.split('-')])
		}
	})

	const memoized: { [key: string]: any } = { ...props }

	return { memoized, changes }
}

export type EquConfig = {
	/** Compare arrays by reference equality a === b (default), or by shallow equality */
	arrays?: 'reference' | 'shallow'
	/** Compare objects by reference equality a === b (default), or by shallow equality */
	objects?: 'reference' | 'shallow'
	/** If true the keys in both a and b must match 1:1 (default), if false a's keys must intersect b's */
	strict?: boolean
}

// A collection of compare functions
export const is = {
	obj: (a: any) => a === Object(a) && !is.arr(a) && typeof a !== 'function',
	fun: (a: any): a is Function => typeof a === 'function',
	str: (a: any): a is string => typeof a === 'string',
	num: (a: any): a is number => typeof a === 'number',
	boo: (a: any): a is boolean => typeof a === 'boolean',
	und: (a: any) => a === void 0,
	arr: (a: any) => Array.isArray(a),
	equ(
		a: any,
		b: any,
		{ arrays = 'shallow', objects = 'reference', strict = true }: EquConfig = {}
	) {
		// Wrong type or one of the two undefined, doesn't match
		if (typeof a !== typeof b || !!a !== !!b) return false
		// Atomic, just compare a against b
		if (is.str(a) || is.num(a)) return a === b
		const isObj = is.obj(a)
		if (isObj && objects === 'reference') return a === b
		const isArr = is.arr(a)
		if (isArr && arrays === 'reference') return a === b
		// Array or Object, shallow compare first to see if it's a match
		if ((isArr || isObj) && a === b) return true
		// Last resort, go through keys
		let i
		// Check if a has all the keys of b
		for (i in a) if (!(i in b)) return false
		// Check if values between keys match
		if (isObj && arrays === 'shallow' && objects === 'shallow') {
			for (i in strict ? b : a)
				if (!is.equ(a[i], b[i], { strict, objects: 'reference' })) return false
		} else {
			for (i in strict ? b : a) if (a[i] !== b[i]) return false
		}
		// If i is undefined
		if (is.und(i)) {
			// If both arrays are empty we consider them equal
			if (isArr && a.length === 0 && b.length === 0) return true
			// If both objects are empty we consider them equal
			if (isObj && Object.keys(a).length === 0 && Object.keys(b).length === 0) return true
			// Otherwise match them by value
			if (a !== b) return false
		}
		return true
	},
}

export type SetBlock = false | Promise<null> | null
export type UnblockProps = {
	set: React.Dispatch<React.SetStateAction<SetBlock>>
	children: React.ReactNode
}

export function Block({ set }: Omit<UnblockProps, 'children'>) {
	React.useLayoutEffect(() => {
		set(new Promise(() => null))
		return () => set(false)
	}, [set])
	return null
}

export class ErrorBoundary extends React.Component<
	{ set: React.Dispatch<Error | undefined>; children: React.ReactNode },
	{ error: boolean }
> {
	state = { error: false }
	static getDerivedStateFromError = () => ({ error: true })
	componentDidCatch(err: Error) {
		this.props.set(err)
	}
	render() {
		return this.state.error ? null : this.props.children
	}
}

// Each object in the scene carries a small LocalState descriptor
export function prepare<T = fabric.Object>(object: T, state?: Partial<LocalState>) {
	const instance = object as unknown as Instance
	instance.__rf = {
		type: '',
		root: null as unknown as UseBoundStore<RootState>,
		memoizedProps: {},
		...state,
	}

	return object
}

// When changing position/dimension -related properties (left, top, scale, angle, etc.) `set` does not update position of object's borders/controls.
function isPositionOrDimensionRelated(
	key: string
): key is 'left' | 'top' | 'scaleX' | 'scaleY' | 'angle' {
	return key === 'left' || key === 'top' || key === 'scaleX' || key === 'scaleY' || key === 'angle'
}

/**
 * Apply props to an instance
 */
export function applyProps(instance: Instance, data: InstanceProps | DiffSet) {
	// Filter equals, events and reserved props
	const localState = (instance.__rf ?? {}) as LocalState
	const root = localState.root
	const rootState = root?.getState?.() ?? {}
	const { memoized, changes } = isDiffSet(data) ? data : diffProps(instance, data)

	// Prepare memoized props
	if (instance.__rf) instance.__rf.memoizedProps = memoized

	for (let i = 0; i < changes.length; i++) {
		let [key, value, isEvent, keys] = changes[i]

		if (isEvent) {
			// TODO: add event listeners
			continue
		} else {
			// Apply value
			instance.set(key as any, value)
			if (isPositionOrDimensionRelated(key)) {
				instance.setCoords()
			}
		}
	}
	if (changes.length > 0) {
		rootState.scene.requestRenderAll()
	}
}

export function updateScene(instance: Instance) {
	// batch updates
	instance.canvas?.requestRenderAll()
}
