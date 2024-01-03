import { fabric } from 'fabric'
import React from 'react'
import create, { GetState, SetState, UseBoundStore } from 'zustand'

export type Size = {
	width: number
	height: number
	top: number
	left: number
}
export type RootState = {
	/** Set current state */
	set: SetState<RootState>
	/** Get current state */
	get: GetState<RootState>
	scene: fabric.Canvas
	size: Size
}

const context = React.createContext<UseBoundStore<RootState>>(null!)

const createStore = () => {
	const rootState = create<RootState>((set, get) => {
		const rootState: RootState = {
			get,
			set,
			scene: null!,
			size: { width: 0, height: 0, top: 0, left: 0 },
		}

		return rootState
	})

	// const state = rootState.getState()

	return rootState
}

export { context, createStore }
