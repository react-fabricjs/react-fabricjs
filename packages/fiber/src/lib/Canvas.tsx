import fabric from 'fabric'
import { FiberProvider, useContextBridge } from 'its-fine'
import React from 'react'
import { ReconcilerRoot, createRoot, unmountComponentAtNode } from './index'
import { extend } from './renderer'
import { Block, ErrorBoundary, SetBlock } from './utils'

export interface CanvasProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode
	/** Canvas fallback content, similar to img's alt prop */
	fallback?: React.ReactNode
	/** Callback after the canvas has rendered (but not yet committed) */
	onCreated?: () => void
}

export interface Props extends CanvasProps {}

const CanvasImpl = /*#__PURE__*/ React.forwardRef<HTMLCanvasElement, Props>(function Canvas(
	{ children, fallback, style, ...props },
	forwardedRef
) {
	React.useMemo(() => extend(fabric.fabric), [])

	const Bridge = useContextBridge()

	const divRef = React.useRef<HTMLDivElement>(null!)
	const canvasRef = React.useRef<HTMLCanvasElement>(null!)
	const containerRef = React.useRef<HTMLDivElement>(null!)

	React.useImperativeHandle(forwardedRef, () => canvasRef.current)

	const [block, setBlock] = React.useState<SetBlock>(false)
	const [error, setError] = React.useState<any>(false)

	// Suspend this component if block is a promise (2nd run)
	if (block) throw block
	// Throw exception outwards if anything within canvas throws
	if (error) throw error

	const root = React.useRef<ReconcilerRoot<HTMLCanvasElement>>(null!)

	React.useLayoutEffect(() => {
		const canvas = canvasRef.current
		if (canvas) {
			if (!root.current) root.current = createRoot<HTMLCanvasElement>(canvas)

			root.current.configure()

			root.current.render(
				<Bridge>
					<ErrorBoundary set={setError}>
						<React.Suspense fallback={<Block set={setBlock} />}>{children}</React.Suspense>
					</ErrorBoundary>
				</Bridge>
			)
		}
	})

	React.useEffect(() => {
		const canvas = canvasRef.current
		if (canvas) return () => unmountComponentAtNode(canvas)
	}, [])

	return (
		<div
			ref={divRef}
			style={{
				position: 'relative',
				width: '100%',
				height: '100%',
				overflow: 'hidden',
				...style,
			}}
			{...props}
		>
			<div ref={containerRef} style={{ width: '100%', height: '100%' }}>
				<canvas ref={canvasRef} style={{ display: 'block' }}>
					{fallback}
				</canvas>
			</div>
		</div>
	)
})

/**
 * A DOM canvas which accepts fabric elements as children.
 */
export const Canvas = React.forwardRef<HTMLCanvasElement, Props>(function CanvasWrapper(
	props,
	ref
) {
	return (
		<FiberProvider>
			<CanvasImpl {...props} ref={ref} />
		</FiberProvider>
	)
})
