import { ReactNode } from 'react'
import { ConcurrentRoot } from 'react-reconciler/constants'
import { createRenderer, extend } from './renderer'

const roots = new Map<any, any>()
const { reconciler } = createRenderer()

export type ReconcilerRoot<TCanvas extends any> = {
	configure: (config?: any) => ReconcilerRoot<TCanvas>
	render: (element: React.ReactNode) => any
	unmount: () => void
}
function createRoot(canvas: any) {
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
		configure: () => {},
		render(children: ReactNode) {
			reconciler.updateContainer(children, fiber, null, () => undefined)
		},
		unmount() {},
	}
}

export { createRoot, extend, reconciler }
