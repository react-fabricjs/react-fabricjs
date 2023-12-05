'use strict'

import { fabric } from 'fabric'
import { useContextBridge } from 'its-fine'
import React from 'react'

const CanvasWrap = (props: fabric.Canvas) => {
	const container = React.useRef()
	const canvas = React.useRef<fabric.Canvas>()
	const fiberRef = React.useRef()

	const Bridge = useContextBridge()

	const _setRef = (canvas: fabric.Canvas) => {
		const { forwardedRef } = props
		if (!forwardedRef) {
			return
		}

		if (typeof forwardedRef === 'function') {
			forwardedRef(canvas)
		} else {
			forwardedRef.current = canvas
		}
	}

	React.useLayoutEffect(() => {
		canvas.current = new fabric.Canvas(props.containerClass, {
			...props,
		})
	})
}
