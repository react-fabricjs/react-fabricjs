import { fabric } from 'fabric';
import React from 'react';
import { RenderProps } from './index';
export interface CanvasProps extends Omit<RenderProps<HTMLCanvasElement>, 'options'>, React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    /** Canvas fallback content, similar to img's alt prop */
    fallback?: React.ReactNode;
    options?: Omit<fabric.ICanvasOptions, 'width' | 'height'>;
    events?: CanvasEventListener;
}
export interface Props extends CanvasProps {
}
/**
 * A DOM canvas which accepts fabric elements as children.
 */
export declare const Canvas: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLCanvasElement>>;
//# sourceMappingURL=Canvas.d.ts.map