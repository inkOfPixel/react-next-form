import { Patch } from "immer";
import { Schema } from "yup";
import { DeepFlagMap, FormStatus } from "./machine/types";

export interface FormOptions<Values, SubmissionResult> {
  initialValues: Values;
  enableReinitialize?: boolean;
  reinitializeOptions?: ResetOptions;
  onSubmit: (
    values: Values,
    context: SubmissionContext<Values>
  ) => Promise<SubmissionResult>;
  validationSchema?: Schema<Values>;
}

export interface FormContext<Values, SubmissionResult> {
  initialValues: Values;
  values: Values;
  validationErrors: Record<string, string>;
  changes: Patch[];
  dirtyFields: DeepFlagMap;
  touchedFields: DeepFlagMap;
  status: FormStatus;
  isValidating: boolean;
  isSubmitting: boolean;
  submission: {
    result?: SubmissionResult;
    error?: string;
    count: number;
  };
  fieldProps: (path: FieldPropsOptions | string) => FieldProps;
  submit: () => void;
  reset: (values?: Values, options?: ResetOptions) => void;
  list: <T>(path: string) => ListField<T>;
  // undo: () => void;
  // redo: () => void;
}

export interface ListField<ItemValue> {
  append: (value: ItemValue) => void;
  swap: (indexA: number, indexB: number) => void;
  move: (from: number, to: number) => void;
  insert: (index: number, value: ItemValue) => void;
  prepend: (value: ItemValue) => void;
  remove: (index: number) => void;
  replace: (index: number, value: ItemValue) => void;
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

export interface ResetOptions {
  keepDirtyFields?: boolean;
  keepTouchedStatus?: boolean;
}

export interface SubmissionContext<Values> {
  initialValues: Values;
  changes: Patch[];
}
