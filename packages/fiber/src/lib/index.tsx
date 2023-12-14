import { ReactNode } from 'react'
import { ConcurrentRoot } from 'react-reconciler/constants'
import { Root, createRenderer, extend } from './renderer'

type Canvas = HTMLCanvasElement | OffscreenCanvas

const roots = new Map<Canvas, Root>()
const { reconciler } = createRenderer()

export type Size = {
	width: number
	height: number
	top: number
	left: number
}
export type RenderProps<TCanvas extends Canvas> = {
	size?: Size
	/** Callback after the canvas has rendered (but not yet committed) */
	onCreated?: () => void
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

	if (prevRoot) console.warn(`ReactFabric.createRoot should only be called once`)

	// Report errors
	const logRecoverableError =
		typeof reportError === 'function'
			? // In modern browsers, reportError will dispatch an error event,
			  // emulating an uncaught JavaScript error.
			  reportError
			: // In older browsers and test environments, fallback to console.error.
			  console.error

	const fiber =
		prevFiber ||
		reconciler.createContainer({}, ConcurrentRoot, null, false, null, '', logRecoverableError, null)
	if (!prevRoot) roots.set(canvas, { fiber })

	return {
		configure(config?: RenderProps<TCanvas>) {
			return this
		},
		render(children: ReactNode) {
			reconciler.updateContainer(children, fiber, null, () => undefined)
		},
		unmount() {
			unmountComponentAtNode(canvas)
		},
	}
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

export { createRoot, extend, reconciler, unmountComponentAtNode }
