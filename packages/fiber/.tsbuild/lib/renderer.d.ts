import { fabric as FABRIC } from 'fabric';
import Reconciler from 'react-reconciler';
import { UseBoundStore } from 'zustand';
import { RootState } from './store';
export type Root = {
    fiber: Reconciler.FiberRoot;
    store: UseBoundStore<RootState>;
};
export type LocalState = {
    type: string;
    root: UseBoundStore<RootState>;
    memoizedProps: {
        [key: string]: any;
    };
    autoRemovedBeforeAppend?: boolean;
};
export type Instance = Omit<FABRIC.Object, 'children'> & {
    children: Instance[];
    [key: string]: any;
};
export type InstanceProps = {
    [key: string]: any;
};
interface Catalogue {
    [name: string]: {
        new (...args: any): Instance;
    };
}
export declare const catalogue: Catalogue;
declare const extend: (objects: object) => void;
declare function createRenderer(): {
    reconciler: Reconciler.Reconciler<UseBoundStore<RootState>, Instance, void, Instance, Instance>;
};
export { createRenderer, extend };
//# sourceMappingURL=renderer.d.ts.map