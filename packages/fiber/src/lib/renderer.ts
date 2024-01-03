/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prefer-const */
import { fabric as FABRIC } from 'fabric'
import Reconciler from 'react-reconciler'
import { DefaultEventPriority } from 'react-reconciler/constants'
import { UseBoundStore } from 'zustand'
import { RootState } from './store'
import { DiffSet, applyProps, diffProps, is, prepare } from './utils'

export type Root = { fiber: Reconciler.FiberRoot; store: UseBoundStore<RootState> }

export type LocalState = {
	type: string
	root: UseBoundStore<RootState>
	memoizedProps: { [key: string]: any }
	autoRemovedBeforeAppend?: boolean
}
interface HostConfig {
	type: string
	props: InstanceProps
	container: UseBoundStore<RootState>
	instance: Instance
	textInstance: void
	suspenseInstance: Instance
	hydratableInstance: Instance
	publicInstance: Instance
	hostContext: never
	updatePayload: Array<boolean | number | DiffSet>
	childSet: never
	timeoutHandle: number | undefined
	noTimeout: -1
}

export type Instance = Omit<FABRIC.Object, 'children'> & {
	children: Instance[]
	[key: string]: any
}

export type InstanceProps = {
	[key: string]: any
}

interface Catalogue {
	[name: string]: {
		new (...args: any): Instance
	}
}

export const catalogue: Catalogue = {}
const extend = (objects: object): void => void Object.assign(catalogue, objects)

function createRenderer() {
	function createInstance(type: string, { args = [], ...props }: InstanceProps, root: any) {
		const fabricType = type.split('rf')[1]
		const name = `${fabricType[0].toUpperCase()}${fabricType.slice(1)}`
		let instance: Instance

		const target = catalogue[name]
		if (!target) {
			throw new Error(`ReactFabric: Unknown type ${name}!`)
		}

		// Throw if an object or literal was passed for args
		if (!Array.isArray(args)) throw new Error('RF: The args prop must be an array!')

		// create new object, add it to the root
		// append memoized props with args so it;s not forgotten
		instance = prepare(new target(...args), {
			type,
			root,
			memoizedProps: {
				args,
			},
		})

		applyProps(instance, props)

		return instance
	}

	function appendChildToContainer(
		container: HostConfig['container'],
		child: HostConfig['instance']
	) {
		const scene = container.getState().scene as unknown as Instance
		scene.add(child)
	}

	function appendChild(parentInstance: HostConfig['instance'], child: HostConfig['instance']) {
		parentInstance.add(child)
	}

	function insertBefore(
		parentInstance: HostConfig['instance'],
		child: HostConfig['instance'],
		_beforeChild: HostConfig['instance']
	) {
		parentInstance.add(child)
	}

	const handleTextInstance = () =>
		console.warn(
			'Text is not allowed in the R3F tree! This could be stray whitespace or characters.'
		)

	function removeChildFromContainer(
		container: HostConfig['container'],
		child: HostConfig['instance']
	) {
		const scene = container.getState().scene as unknown as Instance

		scene.remove(child)
	}

	function switchInstance(
		instance: HostConfig['instance'],
		type: HostConfig['type'],
		newProps: HostConfig['props'],
		fiber: Reconciler.Fiber
	) {
		const parent = instance.__rf?.parent
		if (!parent) return

		const newInstance = createInstance(type, newProps, instance.__rf.root)

		// When args change the instance has to be re-constructed, which then
		// forces r3f to re-parent the children and non-scene objects
		if (instance.children) {
			for (const child of instance.children) {
				if (child.__rf) appendChild(newInstance, child)
			}
			instance.children = instance.children.filter((child) => !child.__rf)
		}

		appendChild(parent, newInstance)

		// Re-bind event handlers
		// TODO

		// This evil hack switches the react-internal fiber node
		// https://github.com/facebook/react/issues/14983
		// https://github.com/facebook/react/pull/15021
		;[fiber, fiber.alternate].forEach((fiber) => {
			if (fiber !== null) {
				fiber.stateNode = newInstance
				if (fiber.ref) {
					if (typeof fiber.ref === 'function') (fiber as unknown as any).ref(newInstance)
					else (fiber.ref as Reconciler.RefObject).current = newInstance
				}
			}
		})
	}

	const reconciler = Reconciler<
		HostConfig['type'],
		HostConfig['props'],
		HostConfig['container'],
		HostConfig['instance'],
		HostConfig['textInstance'],
		HostConfig['suspenseInstance'],
		HostConfig['hydratableInstance'],
		HostConfig['publicInstance'],
		HostConfig['hostContext'],
		HostConfig['updatePayload'],
		HostConfig['childSet'],
		HostConfig['timeoutHandle'],
		HostConfig['noTimeout']
	>({
		createInstance,
		removeChild: () => {},
		appendChild: appendChild,
		appendInitialChild: appendChild,
		insertBefore,
		supportsMutation: true,
		isPrimaryRenderer: false,
		supportsPersistence: false,
		supportsHydration: false,
		noTimeout: -1,
		appendChildToContainer,
		removeChildFromContainer,
		insertInContainerBefore: (
			container: HostConfig['container'],
			child: HostConfig['instance'],
			beforeChild: HostConfig['instance']
		) => {
			if (!child || !beforeChild) return
			const scene = container.getState().scene as unknown as Instance

			scene.add(child)
		},
		getRootHostContext: () => null,
		getChildHostContext: (parentHostContext: HostConfig['hostContext']) => parentHostContext,
		finalizeInitialChildren: () => false,
		prepareUpdate(
			instance: HostConfig['instance'],
			_type: HostConfig['type'],
			oldProps: HostConfig['props'],
			newProps: HostConfig['props']
		) {
			// This is a data object, let's extract critical information about it
			const { args: argsNew = [], ...restNew } = newProps
			const { args: argsOld = [], ...restOld } = oldProps

			// Throw if an object or literal was passed for args
			if (!Array.isArray(argsNew)) throw new Error('RF: the args prop must be an array!')

			// If it has new props or arguments, then it needs to be re-instantiated
			if (argsNew.some((value, index) => value !== argsOld[index])) return [true]
			// Create a diff-set, flag if there are any changes
			const diff = diffProps(instance, restNew, restOld, true)
			if (diff.changes.length) return [false, diff]

			// Otherwise do not touch the instance
			return null
		},
		commitUpdate(
			instance: HostConfig['instance'],
			[reconstruct, diff]: [boolean, DiffSet],
			type: HostConfig['type'],
			_oldProps: HostConfig['props'],
			newProps: HostConfig['props'],
			fiber: any
		) {
			if (reconstruct) switchInstance(instance, type, newProps, fiber)
			else applyProps(instance, diff)
		},
		commitMount: () => {},
		getPublicInstance: (instance: HostConfig['instance']) => instance!,
		prepareForCommit: () => null,
		preparePortalMount: (_container: HostConfig['container']) => {},
		resetAfterCommit: () => {},
		shouldSetTextContent: () => false,
		clearContainer: () => false,
		hideInstance: (_instance: HostConfig['instance']) => {
			// Detach while the instance is hidden
			// TODO
		},
		createTextInstance: handleTextInstance,
		hideTextInstance: handleTextInstance,
		unhideTextInstance: handleTextInstance,
		getCurrentEventPriority: () => DefaultEventPriority,
		beforeActiveInstanceBlur: () => {},
		afterActiveInstanceBlur: () => {},
		detachDeletedInstance: () => {},
		scheduleTimeout: (is.fun(setTimeout) ? setTimeout : undefined) as any,
		cancelTimeout: (is.fun(clearTimeout) ? clearTimeout : undefined) as any,
	} as any)

	return { reconciler }
}

export { createRenderer, extend }
