import { Patch } from "immer";

export interface UseFormOptions<V> {
  initialValues: V;
  onSubmit: () => void;
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
  RESET = "RESET",
  SUBMIT = "SUBMIT",
}

export type Action<V> = SubmitAction | ResetAction<V>;

export interface ResetAction<V> {
  type: ActionTypes.RESET;
  options: ResetOptions<V>;
}

export interface SubmitAction {
  type: ActionTypes.SUBMIT;
}

export interface ResetOptions<V> {
  initialValues?: V;
  keepDirtyFields?: boolean;
  keepTouchedStatus?: boolean;
}
