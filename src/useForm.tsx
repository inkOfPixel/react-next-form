import React from "react";
import { enablePatches } from "immer";
import { createFormMachine } from "./machine";
import { useMachine } from "./utils/useMachine";
import { FormStatus, EventType, ChangeType } from "./machine/types";
import { compressPatches, isEvent, validate } from "./utils";
import {
  FieldPropsOptions,
  FieldProps,
  FormOptions,
  FormContext,
  ResetOptions,
} from "./types";
import { get } from "lodash";

enablePatches();

export function useForm<
  Values extends Record<string, any> = any,
  SubmissionResult = any
>(
  options: FormOptions<Values, SubmissionResult>
): FormContext<Values, SubmissionResult> {
  const [state, send] = useMachine(() => {
    return createFormMachine<Values, SubmissionResult>({
      initialValues: options.initialValues,
      values: options.initialValues,
      validationErrors: {},
      submission: {
        result: undefined,
        error: undefined,
        count: 0,
      },
      patches: [],
      inversePatches: [],
      dirtyFields: {},
      touchedFields: {},
    });
  });

  const changes = React.useMemo(() => {
    const compressedPatches = compressPatches(
      state.context.initialValues,
      state.context.patches
    );
    return compressedPatches;
  }, [state]);

  /** Handles callbacks on status changes, like validation and onSubmit */
  React.useEffect(() => {
    switch (state.value) {
      case FormStatus.Validate: {
        if (options.validationSchema) {
          validate(options.validationSchema, state.context.values, (error) => {
            if (error) {
              send({
                type: EventType.ValidationError,
                payload: {
                  error,
                },
              });
            } else {
              send({
                type: EventType.ValidationSuccess,
              });
            }
          });
        } else {
          // @TODO: handle missing validation schema: form is always valid
        }
        break;
      }
      case FormStatus.Submit: {
        options
          .onSubmit(state.context.values, {
            initialValues: state.context.initialValues,
            changes,
          })
          .then((result) => {
            send({
              type: EventType.SubmissionSuccess,
              payload: {
                result,
              },
            });
          })
          .catch((error) => {
            console.log(error);
            send({
              type: EventType.SubmissionError,
              payload: {
                error: error.message,
              },
            });
          });
        break;
      }
      default:
        break;
    }
  }, [state.context, changes, options]);

  React.useEffect(() => {
    if (options.enableReinitialize) {
      send({
        type: EventType.Reset,
        payload: {
          values: options.initialValues,
          options: {
            keepDirtyFields: true,
            keepTouchedStatus: true,
          },
        },
      });
    }
  }, [options.initialValues]);

  const submit = React.useCallback(async () => {
    send({
      type: EventType.Submit,
    });
  }, [state.context]);

  const reset = React.useCallback(
    (values?: Values, options: ResetOptions = {}) => {
      send({
        type: EventType.Reset,
        payload: { values, options },
      });
    },
    []
  );

  const fieldProps = React.useCallback(
    (options: FieldPropsOptions | string): FieldProps => {
      let fieldPath: string;
      let type: string | undefined;
      let value: string | number | undefined;
      if (typeof options === "string") {
        fieldPath = options;
      } else {
        fieldPath = options.name;
        type = options.type;
        value = options.value;
      }
      const stateValue = get(state.context.values, fieldPath);
      const props: FieldProps = {
        name: fieldPath,
        onChange: (x: React.ChangeEvent<HTMLInputElement> | unknown) => {
          let nextValue: unknown;
          if (isEvent(x)) {
            let eventValue: string | undefined = x.currentTarget.value;
            nextValue = eventValue == null ? value : eventValue;
            if (x.currentTarget.type === "checkbox") {
              if (eventValue === "") {
                eventValue = undefined;
              }
              if (eventValue == null && value == null) {
                nextValue = x.currentTarget.checked;
              } else if (x.currentTarget.checked === false) {
                nextValue = undefined;
              }
            }
          } else {
            if (type === "checkbox") {
              if (value == null) {
                nextValue = x;
              } else {
                if (x === false) {
                  nextValue = undefined;
                } else {
                  nextValue = value;
                }
              }
            }
          }
          send({
            type: EventType.Change,
            payload: {
              type: ChangeType.Set,
              fieldPath: fieldPath,
              value: nextValue,
            },
          });
        },
        onBlur: () =>
          send({
            type: EventType.FieldTouched,
            payload: { fieldPath: fieldPath },
          }),
      };
      if (type === "checkbox" || typeof stateValue === "boolean") {
        props.checked =
          value === undefined ? stateValue === true : stateValue === value;
        if (value != null) {
          props.value = value;
        }
      } else {
        props.value = stateValue;
      }
      return props;
    },
    [state.context.values]
  );

  const list = React.useCallback<FormContext<Values, SubmissionResult>["list"]>(
    (fieldPath) => {
      return {
        append: (value) =>
          send({
            type: EventType.Change,
            payload: { type: ChangeType.ListAppend, fieldPath, value },
          }),
        swap: (indexA, indexB) =>
          send({
            type: EventType.Change,
            payload: { type: ChangeType.ListSwap, fieldPath, indexA, indexB },
          }),
        move: (from, to) =>
          send({
            type: EventType.Change,
            payload: { type: ChangeType.ListMove, fieldPath, from, to },
          }),
        insert: (index, value) =>
          send({
            type: EventType.Change,
            payload: { type: ChangeType.ListInsert, fieldPath, value, index },
          }),
        prepend: (value) =>
          send({
            type: EventType.Change,
            payload: { type: ChangeType.ListPrepend, fieldPath, value },
          }),
        remove: (index) =>
          send({
            type: EventType.Change,
            payload: { type: ChangeType.ListRemove, fieldPath, index },
          }),
        replace: (index, value) =>
          send({
            type: EventType.Change,
            payload: { type: ChangeType.ListReplace, fieldPath, value, index },
          }),
      };
    },
    []
  );

  const form = React.useMemo<FormContext<Values, SubmissionResult>>(() => {
    return {
      initialValues: state.context.initialValues,
      values: state.context.values,
      dirtyFields: state.context.dirtyFields,
      touchedFields: state.context.touchedFields,
      submit,
      reset,
      fieldProps,
      changes,
      list,
      validationErrors: state.context.validationErrors,
      status: state.value,
      isValidating: state.value === FormStatus.Validate,
      isSubmitting: state.value === FormStatus.Submit,
      submission: state.context.submission,
    };
  }, [state, submit, fieldProps, list, changes]);

  return form;
}
