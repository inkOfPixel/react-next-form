import { Patch } from "immer";
import { Schema, ValidationError } from "yup";

export interface FormOptions<V> {
  initialValues: V;
  onSubmit?: () => void;
  validationSchema?: Schema<V>;
}

export interface FormContext<V> {
  initialValues: V;
  values: V;
  changes: Patch[];
  dirtyFields: DeepFlagMap;
  touchedFields: DeepFlagMap;
  isValidating: boolean;
  errors: Record<string, string>;
  fieldProps: (path: FieldPropsOptions | string) => FieldProps;
  submit: () => void;
  reset: (options?: ResetOptions<V>) => void;
  list: <T>(path: string) => ListField<T>;
  // undo: () => void;
  // redo: () => void;
}

export interface ListField<T> {
  append: (value: T) => void;
  swap: (indexA: number, indexB: number) => void;
  move: (from: number, to: number) => void;
  insert: (index: number, value: T) => void;
  prepend: (value: T) => void;
  remove: (index: number) => void;
  replace: (index: number, value: T) => void;
}

export interface DeepFlagMap {
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
  isValidating: boolean;
  errors: Record<string, string>;
}

export enum ActionTypes {
  CHANGE = "CHANGE",
  BLUR = "BLUR",
  RESET = "RESET",
  SUBMIT = "SUBMIT",
  LIST_APPEND = "LIST_APPEND",
  LIST_SWAP = "LIST_SWAP",
  LIST_MOVE = "LIST_MOVE",
  LIST_INSERT = "LIST_INSERT",
  LIST_PREPEND = "LIST_PREPEND",
  LIST_REMOVE = "LIST_REMOVE",
  LIST_REPLACE = "LIST_REPLACE",
  UNDO = "UNDO",
  REDO = "REDO",
  VALIDATE = "VALIDATE",
  VALIDATION_ERRORS = "VALIDATION_ERRORS",
}

export type Action<V> =
  | ChangeAction
  | BlurAction
  | SubmitAction
  | ResetAction<V>
  | ListAppendAction
  | ListSwapAction
  | ListMoveAction
  | ListInsertAction
  | ListPrependAction
  | ListRemoveAction
  | ListReplaceAction
  | UndoAction
  | RedoAction
  | ValidateAction
  | ValidationErrorsAction;

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

export interface ListSwapAction {
  type: ActionTypes.LIST_SWAP;
  payload: {
    path: string;
    indexA: number;
    indexB: number;
  };
}

export interface ListMoveAction {
  type: ActionTypes.LIST_MOVE;
  payload: {
    path: string;
    from: number;
    to: number;
  };
}

export interface ListInsertAction {
  type: ActionTypes.LIST_INSERT;
  payload: {
    path: string;
    index: number;
    value: unknown;
  };
}

export interface ListPrependAction {
  type: ActionTypes.LIST_PREPEND;
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

export interface ListReplaceAction {
  type: ActionTypes.LIST_REPLACE;
  payload: {
    path: string;
    index: number;
    value: unknown;
  };
}

export interface UndoAction {
  type: ActionTypes.UNDO;
}

export interface RedoAction {
  type: ActionTypes.REDO;
}

export interface ValidateAction {
  type: ActionTypes.VALIDATE;
}

export interface ValidationErrorsAction {
  type: ActionTypes.VALIDATION_ERRORS;
  payload: {
    error?: ValidationError;
  };
}

export interface ResetOptions<V> {
  initialValues?: V;
  keepDirtyFields?: boolean;
  keepTouchedStatus?: boolean;
}
