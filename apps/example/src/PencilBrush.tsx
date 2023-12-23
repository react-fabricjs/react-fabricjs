import { useCanvas } from '@react-fabricjs/fiber'
import { fabric } from 'fabric'
import { useEffect } from 'react'

export function PencilBrush() {
	const canvas = useCanvas()
	useEffect(() => {
		const pencil = new fabric.PencilBrush(canvas)
		pencil.width = 5
		canvas.freeDrawingBrush = pencil
		canvas.isDrawingMode = true

		return () => {
			canvas.isDrawingMode = false
			canvas.freeDrawingBrush = null!
		}
	}, [])
	return null
}
