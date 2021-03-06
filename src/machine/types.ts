import { Patch } from "immer";
import { ValidationError } from "yup";
import { ResetOptions } from "../types";

export interface MachineContext<Values, SubmissionResult = unknown> {
  initialValues: Values;
  values: Values;
  validationErrors: Record<string, string>;
  dismissedErrors: Record<string, boolean>;
  submission: {
    waitingValidation?: boolean;
    result?: SubmissionResult;
    error?: string;
    count: number;
  };
  patches: Patch[];
  inversePatches: Patch[];
  touchedFields: DeepFlagMap;
  lastChangedAt?: number;
  shouldValidate: boolean;
}

export interface DeepFlagMap {
  [key: string]: boolean | DeepFlagMap;
}

export enum EventType {
  Transient = "",
  Validate = "VALIDATE",
  ValidationSuccess = "VALIDATION_SUCCESS",
  ValidationError = "VALIDATION_ERROR",
  DismissValidationError = "DISMISS_VALIDATION_ERROR",
  Reset = "RESET",
  FieldTouched = "FIELD_TOUCHED",
  Change = "CHANGE",
  Submit = "SUBMIT",
  SubmissionSuccess = "SUBMISSION_SUCCESS",
  SubmissionError = "SUBMISSION_ERROR",
  DismissSubmissionError = "DISMISS_SUBMISSION_ERROR",
}

export type MachineEvent<Values, SubmissionResult> =
  | TransientEvent
  | ValidateEvent
  | ValidationSuccessEvent
  | ValidationErrorEvent
  | DismissValidationErrorEvent
  | ResetEvent<Values>
  | FieldTouchedEvent
  | ChangeEvent
  | SubmitEvent
  | SubmitSuccessEvent<SubmissionResult>
  | SubmitErrorEvent
  | DismissSubmissionErrorEvent;

export interface TransientEvent {
  type: EventType.Transient;
}

export interface ValidateEvent {
  type: EventType.Validate;
}

export interface ValidationSuccessEvent {
  type: EventType.ValidationSuccess;
}

export interface ValidationErrorEvent {
  type: EventType.ValidationError;
  payload: {
    error: ValidationError;
  };
}

export interface DismissValidationErrorEvent {
  type: EventType.DismissValidationError;
  payload?: {
    fieldPaths: string[];
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
    result?: SubmissionResult;
  };
}

export interface SubmitErrorEvent {
  type: EventType.SubmissionError;
  payload: {
    error: string;
  };
}

export interface DismissSubmissionErrorEvent {
  type: EventType.DismissSubmissionError;
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
  PendingValidation = "pendingValidation",
  Validate = "validate",
  Valid = "valid",
  Invalid = "invalid",
  Submit = "submit",
  Submitted = "submitted",
  SubmissionError = "submissionError",
}

export type MachineState = any;
