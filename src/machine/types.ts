import { Patch } from "immer";
import { ValidationError } from "yup";
import { ResetOptions } from "../types";

export interface MachineContext<Values, SubmissionResult = unknown> {
  initialValues: Values;
  values: Values;
  validationErrors: Record<string, string>;
  submission: {
    result?: SubmissionResult;
    error?: string;
    count: number;
  };
  patches: Patch[];
  inversePatches: Patch[];
  touchedFields: DeepFlagMap;
}

export interface DeepFlagMap {
  [key: string]: boolean | DeepFlagMap;
}

export enum EventType {
  ValidationSuccess = "VALIDATION_SUCCESS",
  ValidationError = "VALIDATION_ERROR",
  Reset = "RESET",
  FieldTouched = "FIELD_TOUCHED",
  Change = "CHANGE",
  Submit = "SUBMIT",
  SubmissionSuccess = "SUBMISSION_SUCCESS",
  SubmissionError = "SUBMISSION_ERROR",
}

export type MachineEvent<Values, SubmissionResult> =
  | ValidationSuccessEvent
  | ValidationErrorEvent
  | ResetEvent<Values>
  | FieldTouchedEvent
  | ChangeEvent
  | SubmitEvent
  | SubmitSuccessEvent<SubmissionResult>
  | SubmitErrorEvent;

export interface ValidationSuccessEvent {
  type: EventType.ValidationSuccess;
}

export interface ValidationErrorEvent {
  type: EventType.ValidationError;
  payload: {
    error: ValidationError;
  };
}

export interface ResetEvent<Values> {
  type: EventType.Reset;
  payload: { values?: Values; options: ResetOptions };
}

export interface FieldTouchedEvent {
  type: EventType.FieldTouched;
  payload: {
    fieldPath: string;
    touched: boolean;
  };
}

export interface SubmitEvent {
  type: EventType.Submit;
}

export interface SubmitSuccessEvent<SubmissionResult> {
  type: EventType.SubmissionSuccess;
  payload: {
    result: SubmissionResult;
  };
}

export interface SubmitErrorEvent {
  type: EventType.SubmissionError;
  payload: {
    error: string;
  };
}

export interface ChangeEvent {
  type: EventType.Change;
  payload: ChangeEventPayload;
}

export enum ChangeType {
  Set = "set",
  ArrayAppend = "array_append",
  ArraySwap = "array_swap",
  ArrayMove = "array_move",
  ArrayInsert = "array_insert",
  ArrayPrepend = "array_prepend",
  ArrayRemove = "array_remove",
  ArrayReplace = "array_replace",
}

export type ChangeEventPayload =
  | SetPayload
  | ArrayAppendPayload
  | ArraySwapPayload
  | ArrayMovePayload
  | ArrayInsertPayload
  | ArrayPrependPayload
  | ArrayRemovePayload
  | ArrayReplacePayload;

export interface SetPayload {
  type: ChangeType.Set;
  fieldPath: string;
  value: unknown;
}

export interface ArrayAppendPayload {
  type: ChangeType.ArrayAppend;
  fieldPath: string;
  value: unknown;
}

export interface ArraySwapPayload {
  type: ChangeType.ArraySwap;
  fieldPath: string;
  indexA: number;
  indexB: number;
}

export interface ArrayMovePayload {
  type: ChangeType.ArrayMove;
  fieldPath: string;
  from: number;
  to: number;
}

export interface ArrayInsertPayload {
  type: ChangeType.ArrayInsert;
  fieldPath: string;
  index: number;
  value: unknown;
}

export interface ArrayPrependPayload {
  type: ChangeType.ArrayPrepend;
  fieldPath: string;
  value: unknown;
}

export interface ArrayRemovePayload {
  type: ChangeType.ArrayRemove;
  fieldPath: string;
  index: number;
}

export interface ArrayReplacePayload {
  type: ChangeType.ArrayReplace;
  fieldPath: string;
  index: number;
  value: unknown;
}

export enum FormStatus {
  Validate = "validate",
  Valid = "valid",
  Invalid = "invalid",
  Submit = "submit",
  Submitted = "submitted",
  SubmissionError = "submissionError",
}

export type MachineState = any;
