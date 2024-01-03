import { fabric } from 'fabric';
import React from 'react';
import { GetState, SetState, UseBoundStore } from 'zustand';
export type Size = {
    width: number;
    height: number;
    top: number;
    left: number;
};
export type RootState = {
    /** Set current state */
    set: SetState<RootState>;
    /** Get current state */
    get: GetState<RootState>;
    scene: fabric.Canvas;
    size: Size;
};
declare const context: React.Context<UseBoundStore<RootState>>;
declare const createStore: () => UseBoundStore<RootState, import("zustand").StoreApi<RootState>>;
export { context, createStore };
//# sourceMappingURL=store.d.ts.map