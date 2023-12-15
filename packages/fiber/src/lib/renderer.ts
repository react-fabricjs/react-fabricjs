import { fabric as FABRIC } from 'fabric'
import Reconciler from 'react-reconciler'
import { DefaultEventPriority } from 'react-reconciler/constants'
import { UseBoundStore } from 'zustand'
import { RootState } from './store'
import { DiffSet, is } from './utils'

export type Root = { fiber: Reconciler.FiberRoot; store: UseBoundStore<RootState> }

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
	function createInstance(type: string, { ...props }: InstanceProps, root: any) {
		let fabricType = type.split('-')[1]
		let name = `${fabricType[0].toUpperCase()}${fabricType.slice(1)}`
		let instance: Instance

		const target = catalogue[name]
		if (!target) {
			throw new Error(`ReactFabric: Unknown type ${name}!`)
		}

		// create new object, add it to the root
		// append memoized props with args so it;s not forgotten
		instance = new target(props)

		return instance
	}

	function appendChildToContainer(
		container: HostConfig['container'],
		child: HostConfig['instance']
	) {
		console.log(container, child)
		const scene = container.getState().scene as unknown as Instance

		scene.add(child)
	}

	function appendInitialChild(
		parentInstance: HostConfig['instance'],
		child: HostConfig['instance']
	) {
		parentInstance.add(child)
	}

	function appendChild(parentInstance: HostConfig['instance'], child: HostConfig['instance']) {
		parentInstance.add(child)
	}

	function insertBefore(
		parentInstance: HostConfig['instance'],
		child: HostConfig['instance'],
		beforeChild: HostConfig['instance']
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
		appendChild: () => {},
		appendInitialChild: () => {},
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
		prepareUpdate: () => {
			return null
		},
		commitUpdate: () => {},
		commitMount: () => {},
		getPublicInstance: (instance: HostConfig['instance']) => instance!,
		prepareForCommit: () => null,
		preparePortalMount: (container: HostConfig['container']) => {},
		resetAfterCommit: () => {},
		shouldSetTextContent: () => false,
		clearContainer: () => false,
		hideInstance: (instance: HostConfig['instance']) => {
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
