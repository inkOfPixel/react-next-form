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
  ListAppend = "list_append",
  ListSwap = "list_swap",
  ListMove = "list_move",
  ListInsert = "list_insert",
  ListPrepend = "list_prepend",
  ListRemove = "list_remove",
  ListReplace = "list_replace",
}

export type ChangeEventPayload =
  | SetPayload
  | ListAppendPayload
  | ListSwapPayload
  | ListMovePayload
  | ListInsertPayload
  | ListPrependPayload
  | ListRemovePayload
  | ListReplacePayload;

export interface SetPayload {
  type: ChangeType.Set;
  fieldPath: string;
  value: unknown;
}

export interface ListAppendPayload {
  type: ChangeType.ListAppend;
  fieldPath: string;
  value: unknown;
}

export interface ListSwapPayload {
  type: ChangeType.ListSwap;
  fieldPath: string;
  indexA: number;
  indexB: number;
}

export interface ListMovePayload {
  type: ChangeType.ListMove;
  fieldPath: string;
  from: number;
  to: number;
}

export interface ListInsertPayload {
  type: ChangeType.ListInsert;
  fieldPath: string;
  index: number;
  value: unknown;
}

export interface ListPrependPayload {
  type: ChangeType.ListPrepend;
  fieldPath: string;
  value: unknown;
}

export interface ListRemovePayload {
  type: ChangeType.ListRemove;
  fieldPath: string;
  index: number;
}

export interface ListReplacePayload {
  type: ChangeType.ListReplace;
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
