import { Patch } from "immer";
import { ObjectSchema } from "yup";
import { DeepFlagMap, FormStatus } from "./machine/types";

export interface FormConfig<Values extends object, SubmissionResult = any> {
  initialValues: Values;
  enableReinitialize?: boolean;
  reinitializeOptions?: ResetOptions;
  onSubmit: (
    values: Values,
    context: SubmissionContext<Values>
  ) => Promise<SubmissionResult> | SubmissionResult;
  validationSchema?: ObjectSchema<Values>;
}

export interface FormContext<
  Values extends Record<string, any>,
  SubmissionResult = any
> {
  // Form
  initialValues: Values;
  values: Values;
  validationErrors: Record<string, FieldError>;
  changes: Patch[];
  touchedFields: DeepFlagMap;
  status: FormStatus;
  isValidating: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
  submission: {
    result?: SubmissionResult;
    error?: string;
    count: number;
  };
  submit: () => void;
  dismissSubmissionError: () => void;
  reset: (values?: Values, options?: ResetOptions) => void;
  // Field
  fieldProps: <FieldValue = any>(
    options: FieldConfig<FieldValue> | string
  ) => FieldProps;
  setFieldValue: <FieldValue = any>(
    fieldPath: string,
    newValue: FieldValue
  ) => void;
  setFieldTouched: (fieldPath: string, touched?: boolean) => void;
  resetField: (fieldPath: string) => void;
  dismissValidationErrors: (fieldPaths?: string[] | string) => void;
  isTouched(fieldPath: string): boolean;
  isFieldDirty(fieldPath: string): boolean;
  // Array field
  append: <ItemValue = any>(fieldPath: string, value: ItemValue) => void;
  swap: (fieldPath: string, indexA: number, indexB: number) => void;
  move: (fieldPath: string, from: number, to: number) => void;
  insert: <ItemValue = any>(
    fieldPath: string,
    index: number,
    value: ItemValue
  ) => void;
  prepend: <ItemValue = any>(fieldPath: string, value: ItemValue) => void;
  remove: (fieldPath: string, index: number) => void;
  replace: <ItemValue = any>(
    fieldPath: string,
    index: number,
    value: ItemValue
  ) => void;
}

export interface Field<FieldValue = any> {
  initialValue: FieldValue;
  value: FieldValue;
  error?: FieldError;
  setValue: (newValue: FieldValue) => void;
  setTouched: (touched?: boolean) => void;
  reset: () => void;
  dismissError: () => void;
  isTouched: boolean;
  isDirty: boolean;
  props: FieldProps;
}

export interface ArrayField<ItemValue = any> {
  initialValue?: ItemValue[];
  value?: ItemValue[];
  error?: FieldError;
  isDirty: boolean;
  /** Replace the entire array */
  set: (array: ItemValue[]) => void;
  reset: () => void;
  dismissError: () => void;
  append: (value: ItemValue) => void;
  swap: (indexA: number, indexB: number) => void;
  move: (from: number, to: number) => void;
  insert: (index: number, value: ItemValue) => void;
  prepend: (value: ItemValue) => void;
  remove: (index: number) => void;
  replace: (index: number, value: ItemValue) => void;
}

export interface FieldConfig<FieldValue = any> {
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
