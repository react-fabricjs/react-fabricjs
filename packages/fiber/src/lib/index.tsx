import { fabric } from 'fabric'
import { ReactNode, useLayoutEffect } from 'react'
import { ConcurrentRoot } from 'react-reconciler/constants'
import { UseBoundStore } from 'zustand'
import { Root, createRenderer, extend } from './renderer'
import { RootState, context, createStore } from './store'
import { decamelize } from './utils'

type Canvas = HTMLCanvasElement

const roots = new Map<Canvas, Root>()
const { reconciler } = createRenderer()

export type RenderProps<_TCanvas extends Canvas> = {
	options?: fabric.ICanvasOptions
	events?: CanvasEventListener
	/** Callback after the canvas has rendered (but not yet committed) */
	onCreated?: (state: RootState) => void
}

export type ReconcilerRoot<TCanvas extends Canvas> = {
	configure: (config?: RenderProps<TCanvas>) => ReconcilerRoot<TCanvas>
	render: (element: React.ReactNode) => any
	unmount: () => void
}
function createRoot<TCanvas extends Canvas>(canvas: TCanvas): ReconcilerRoot<TCanvas> {
	// check against mistaken use of createRoot
	const prevRoot = roots.get(canvas)
	const prevFiber = prevRoot?.fiber
	const prevStore = prevRoot?.store

	if (prevRoot) console.warn(`ReactFabric.createRoot should only be called once`)

	// Report errors
	const logRecoverableError =
		typeof reportError === 'function'
			? // In modern browsers, reportError will dispatch an error event,
			  // emulating an uncaught JavaScript error.
			  reportError
			: // In older browsers and test environments, fallback to console.error.
			  console.error

	// Create store
	const store = prevStore || createStore()
	// Create fiber
	const fiber =
		prevFiber ||
		reconciler.createContainer(
			store,
			ConcurrentRoot,
			null,
			false,
			null,
			'',
			logRecoverableError,
			null
		)
	if (!prevRoot) roots.set(canvas, { store, fiber })

	// Locals
	let onCreated: ((state: RootState) => void) | undefined
	let configured = false

	return {
		configure(config: RenderProps<TCanvas> = {}) {
			const { onCreated: onCreatedCallback, events } = config
			const state = store.getState()

			// Set up scene (one time only!)
			if (!state.scene) {
				const scene: fabric.Canvas = new fabric.Canvas(canvas, config.options)

				state.set({ scene })
			}

			if (events) {
				// Add event listeners
				const scene = state.get().scene
				for (const [key, value] of Object.entries(events)) {
					const eventName = decamelize(key.split('on')[1])
					if (eventName === 'mouse:wheel') {
						scene.on(eventName, value)
					} else {
						scene.on(eventName as fabric.EventName, value)
					}
				}
			}

			// Set locals
			onCreated = onCreatedCallback
			configured = true
			return this
		},
		render(children: ReactNode) {
			if (!configured) this.configure()
			reconciler.updateContainer(
				<Provider store={store} children={children} rootElement={canvas} onCreated={onCreated} />,
				fiber,
				null,
				() => undefined
			)
		},
		unmount() {
			unmountComponentAtNode(canvas)
		},
	}
}

function render<TCanvas extends Canvas>(
	children: React.ReactNode,
	canvas: TCanvas,
	config: RenderProps<TCanvas>
): UseBoundStore<RootState> {
	console.warn(`RF.render is deprecated. Use createRoot and render instead.`)
	const root = createRoot(canvas)
	root.configure(config)
	return root.render(children)
}

function Provider<TCanvas extends Canvas>({
	store,
	children,
	onCreated,
}: {
	store: UseBoundStore<RootState>
	rootElement: TCanvas
	children: React.ReactNode
	onCreated?: (state: RootState) => void
}) {
	useLayoutEffect(() => {
		const state = store.getState()

		if (onCreated) onCreated(state)
	}, [onCreated, store])

	return <context.Provider value={store}>{children}</context.Provider>
}
function unmountComponentAtNode<TCanvas extends Canvas>(
	canvas: TCanvas,
	callback?: (canvas: TCanvas) => void
) {
	const root = roots.get(canvas)
	const fiber = root?.fiber
	if (fiber) {
		reconciler.updateContainer(null, fiber, null, () => {
			roots.delete(canvas)
			if (callback) callback(canvas)
		})
	}
}

export { createRoot, extend, reconciler, render, unmountComponentAtNode }
