import { fabric } from 'fabric';
export type Properties<T> = Pick<T, {
    [K in keyof T]: T[K] extends (_: any) => any ? never : K;
}[keyof T]>;
export type NonFunctionKeys<T> = {
    [K in keyof T]-?: T[K] extends Function ? never : K;
}[keyof T];
export type Overwrite<T, O> = Omit<T, NonFunctionKeys<O>> & O;
type Args<T> = T extends new (...args: any) => any ? ConstructorParameters<T> : T;
export interface NodeProps<T, P> {
    args?: Args<P>;
    children?: React.ReactNode;
    ref?: React.Ref<T>;
    key?: React.Key;
    onUpdate?: (self: T) => void;
}
export type Node<T, P> = Overwrite<Partial<T>, NodeProps<T, P>>;
export type ObjectNode<T, P> = Overwrite<Node<T, P>, {}>;
export type ObjectProps = ObjectNode<fabric.Object, typeof fabric.Object>;
export type CircleProps = ObjectNode<fabric.Circle, typeof fabric.Circle>;
export type RectProps = ObjectNode<fabric.Rect, typeof fabric.Rect>;
export type TextProps = ObjectNode<fabric.Text, typeof fabric.Text>;
export type ImageProps = ObjectNode<fabric.Image, typeof fabric.Image>;
export type PathProps = ObjectNode<fabric.Path, typeof fabric.Path>;
export type GroupProps = ObjectNode<fabric.Group, typeof fabric.Group>;
export type EllipseProps = ObjectNode<fabric.Ellipse, typeof fabric.Ellipse>;
export type LineProps = ObjectNode<fabric.Line, typeof fabric.Line>;
export type TextBoxProps = ObjectNode<fabric.Textbox, typeof fabric.Textbox>;
export interface FabricElements {
    rfCircle: CircleProps & ObjectEventListener;
    rfObject: ObjectProps & ObjectEventListener;
    rfRect: RectProps & ObjectEventListener;
    rfText: TextProps & ObjectEventListener & TextEventListener;
    rfImage: ImageProps & ObjectEventListener;
    rfPath: PathProps & ObjectEventListener;
    rfGroup: GroupProps & ObjectEventListener;
    rfEllipse: EllipseProps & ObjectEventListener;
    rfLine: LineProps & ObjectEventListener;
    rfTextbox: TextBoxProps & ObjectEventListener & TextEventListener;
}
declare global {
    namespace JSX {
        interface IntrinsicElements extends FabricElements {
        }
    }
    type CanvasEventListener = {
        [K in CanvasEventsType]?: (e: fabric.IEvent<MouseEvent>) => void;
    } & {
        onMouseWheel?: (e: fabric.IEvent<WheelEvent>) => void;
    };
}
type ObjectEventType = `on${Capitalize<ObjectEvents>}`;
type CanvasEventsType = `on${Capitalize<CanvasEvents>}`;
type TextEventsType = `on${Capitalize<TextEvents>}`;
type ObjectEventListener = {
    [K in ObjectEventType]?: (e: fabric.IEvent<MouseEvent>) => void;
};
type TextEventListener = {
    [K in TextEventsType]?: (e: fabric.IEvent<MouseEvent>) => void;
};
type ObjectEvents = 'added' | 'removed' | 'mouseDown' | 'mouseUp' | 'mouseOver' | 'mouseOut' | 'modified' | 'moving' | 'scaling' | 'rotating' | 'skewing' | 'deselected' | 'selected' | 'rotated';
type TextEvents = 'editingEntered' | 'editingExited' | 'electionChanged' | 'changed' | 'dblClick' | 'tripleClick';
type CanvasEvents = 'afterRender' | 'beforeRender' | 'canvasCleared' | 'mouseOver' | 'mouseOut' | 'mouseDown' | 'mouseUp' | 'mouseMove' | 'mouseWheel' | 'objectAdded' | 'objectModified' | 'objectMoving' | 'objectOver' | 'objectOut' | 'objectRemoved' | 'objectRotating' | 'objectScaling' | 'objectSelected' | 'pathCreated' | 'beforeSelectionCleared' | 'selectionCleared' | 'selectionCreated' | 'textEditingEntered' | 'textEditingExited' | 'textEelectionChanged' | 'textChanged';
export {};
//# sourceMappingURL=fabric-types.d.ts.map