import { fabric } from 'fabric';
import { UseBoundStore } from 'zustand';
import { extend } from './renderer';
import { RootState } from './store';
type Canvas = HTMLCanvasElement;
declare const reconciler: import("react-reconciler").Reconciler<UseBoundStore<RootState>, import("./renderer").Instance, void, import("./renderer").Instance, import("./renderer").Instance>;
export type RenderProps<TCanvas extends Canvas> = {
    options?: fabric.ICanvasOptions;
    events?: CanvasEventListener;
    /** Callback after the canvas has rendered (but not yet committed) */
    onCreated?: (state: RootState) => void;
};
export type ReconcilerRoot<TCanvas extends Canvas> = {
    configure: (config?: RenderProps<TCanvas>) => ReconcilerRoot<TCanvas>;
    render: (element: React.ReactNode) => any;
    unmount: () => void;
};
declare function createRoot<TCanvas extends Canvas>(canvas: TCanvas): ReconcilerRoot<TCanvas>;
declare function render<TCanvas extends Canvas>(children: React.ReactNode, canvas: TCanvas, config: RenderProps<TCanvas>): UseBoundStore<RootState>;
declare function unmountComponentAtNode<TCanvas extends Canvas>(canvas: TCanvas, callback?: (canvas: TCanvas) => void): void;
export { createRoot, extend, reconciler, render, unmountComponentAtNode };
//# sourceMappingURL=index.d.ts.map