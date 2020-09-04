import { Patch } from "immer";

export interface FormOptions<V> {
  initialValues: V;
  onSubmit?: () => void;
}

export interface FormContext<V> {
  initialValues: V;
  values: V;
  patches: Patch[];
  inversePatches: Patch[];
  dirtyFields: DeepFlagMap;
  touchedFields: DeepFlagMap;
  fieldProps: (name: FieldPropsOptions | string) => FieldProps;
  submit: () => void;
  /** Reset to initial values */
  reset: (options?: ResetOptions<V>) => void;
  list: <T>(name: string) => ListField<T>;
}

export interface ListField<T> {
  append: (value: T) => void;
  // swap: (indexA: number, indexB: number) => void;
  // move: (from: number, to: number) => void;
  // insert: (index: number, value: T) => void;
  /** Add value at the beginning */
  // unshift: (value: T) => number;
  remove: (index: number) => void;
  // pop: () => T | undefined;
  // replace: (index: number, value: T) => void;
}

interface DeepFlagMap {
  [key: string]: boolean | DeepFlagMap;
}

export interface FieldPropsOptions {
  name: string;
  type?: string;
  /** Used for checkboxes */
  value?: string | number;
}

export interface FieldProps {
  name: string;
  type?: string;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
  onChange(value: any): void;
  onBlur: (event?: React.FocusEvent<HTMLElement>) => void;
  value?: string | number;
  checked?: boolean;
}

export interface State<V> {
  initialValues: V;
  values: V;
  patches: Patch[];
  inversePatches: Patch[];
  dirtyFields: Record<string, boolean>;
  touchedFields: Record<string, boolean>;
}

export enum ActionTypes {
  CHANGE = "CHANGE",
  BLUR = "BLUR",
  RESET = "RESET",
  SUBMIT = "SUBMIT",
  LIST_APPEND = "LIST_APPEND",
  LIST_REMOVE = "LIST_REMOVE",
}

export type Action<V> =
  | ChangeAction
  | BlurAction
  | SubmitAction
  | ResetAction<V>
  | ListAppendAction
  | ListRemoveAction;

export interface ChangeAction {
  type: ActionTypes.CHANGE;
  payload: {
    name: string;
    value: unknown;
  };
}

export interface BlurAction {
  type: ActionTypes.BLUR;
  payload: {
    name: string;
  };
}

export interface ResetAction<V> {
  type: ActionTypes.RESET;
  options: ResetOptions<V>;
}

export interface SubmitAction {
  type: ActionTypes.SUBMIT;
}

export interface ListAppendAction {
  type: ActionTypes.LIST_APPEND;
  payload: {
    path: string;
    value: unknown;
  };
}

export interface ListRemoveAction {
  type: ActionTypes.LIST_REMOVE;
  payload: {
    path: string;
    index: number;
  };
}

export interface ResetOptions<V> {
  initialValues?: V;
  keepDirtyFields?: boolean;
  keepTouchedStatus?: boolean;
}
