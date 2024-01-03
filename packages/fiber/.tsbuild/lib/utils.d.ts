import { fabric } from 'fabric';
import React from 'react';
import { Instance, InstanceProps, LocalState } from './renderer';
export type ConstructorOf<T> = new (...args: any[]) => T;
export type DiffSet = {
    memoized: {
        [key: string]: any;
    };
    changes: [key: string, value: unknown, isEvent: boolean, keys: string[]][];
};
export declare const isDiffSet: (def: any) => def is DiffSet;
export declare const DEFAULT = "__default";
export declare function diffProps(instance: Instance, { children, key, ref, ...props }: InstanceProps, { children, key, ref, ...previous }?: InstanceProps, remove?: boolean): DiffSet;
export type EquConfig = {
    /** Compare arrays by reference equality a === b (default), or by shallow equality */
    arrays?: 'reference' | 'shallow';
    /** Compare objects by reference equality a === b (default), or by shallow equality */
    objects?: 'reference' | 'shallow';
    /** If true the keys in both a and b must match 1:1 (default), if false a's keys must intersect b's */
    strict?: boolean;
};
export declare const is: {
    obj: (a: any) => boolean;
    fun: (a: any) => a is Function;
    str: (a: any) => a is string;
    num: (a: any) => a is number;
    boo: (a: any) => a is boolean;
    und: (a: any) => boolean;
    arr: (a: any) => boolean;
    equ(a: any, b: any, { arrays, objects, strict }?: EquConfig): boolean;
};
export type SetBlock = false | Promise<null> | null;
export type UnblockProps = {
    set: React.Dispatch<React.SetStateAction<SetBlock>>;
    children: React.ReactNode;
};
export declare function Block({ set }: Omit<UnblockProps, 'children'>): null;
export declare class ErrorBoundary extends React.Component<{
    set: React.Dispatch<Error | undefined>;
    children: React.ReactNode;
}, {
    error: boolean;
}> {
    state: {
        error: boolean;
    };
    static getDerivedStateFromError: () => {
        error: boolean;
    };
    componentDidCatch(err: Error): void;
    render(): React.ReactNode;
}
export declare function prepare<T = fabric.Object>(object: T, state?: Partial<LocalState>): T;
/**
 * Apply props to an instance
 */
export declare function applyProps(instance: Instance, data: InstanceProps | DiffSet): void;
export declare function decamelize(string: string, separator?: string): string;
//# sourceMappingURL=utils.d.ts.map