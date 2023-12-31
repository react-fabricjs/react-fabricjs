import React from 'react'
import { context } from './store'

export function useStore() {
	const store = React.useContext(context)
	if (!store)
		throw new Error('RF: Hooks can only be used within the Canvas/StaticCanvas component!')
	return store
}

export function useRawCanvas() {
	const store = useStore()
	return store.getState().scene
}

export function useCanvas() {
	const _rawCanvas = useRawCanvas()
	// attach utils to canvas
	// TODO: add utils
}
