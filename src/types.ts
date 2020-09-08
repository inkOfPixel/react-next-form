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
  validationErrors: Record<string, FieldError>;
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
  fieldProps: <FieldValue = any>(
    options: FieldPropsOptions<FieldValue> | string
  ) => FieldProps;
  setFieldValue: <FieldValue = any>(
    fieldPath: string,
    newValue: FieldValue
  ) => void;
  setFieldTouched: (fieldPath: string, touched?: boolean) => void;
  resetField: (fieldPath: string) => void;
  isTouched(fieldPath: string): boolean;
  isDirty(fieldPath: string): boolean;
  list: <T>(fieldPath: string) => ListField<T>;
  submit: () => void;
  reset: (values?: Values, options?: ResetOptions) => void;
  // undo: () => void;
  // redo: () => void;
}

export interface Field<FieldValue = any> {
  initialValue: FieldValue;
  value: FieldValue;
  error?: FieldError;
  setValue: (newValue: FieldValue) => void;
  setTouched: (touched?: boolean) => void;
  reset: () => void;
  isTouched: boolean;
  isDirty: boolean;
  props: FieldProps;
}

export interface ListField<ItemValue = any> {
  initialValue?: ItemValue[];
  value?: ItemValue[];
  append: (value: ItemValue) => void;
  swap: (indexA: number, indexB: number) => void;
  move: (from: number, to: number) => void;
  insert: (index: number, value: ItemValue) => void;
  prepend: (value: ItemValue) => void;
  remove: (index: number) => void;
  replace: (index: number, value: ItemValue) => void;
}

export interface FieldPropsOptions<FieldValue = any> {
  name: string;
  type?: string;
  /** Used for checkboxes */
  value?: FieldValue;
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

export type FieldError = string;
