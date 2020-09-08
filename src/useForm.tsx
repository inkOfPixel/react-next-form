import { enablePatches } from "immer";
import { get } from "lodash";
import React from "react";
import { createFormMachine } from "./machine";
import { ChangeType, EventType, FormStatus } from "./machine/types";
import { FieldProps, FormContext, FormOptions, ResetOptions } from "./types";
import { compressPatches, isEvent, validate } from "./utils";
import { useMachine } from "./utils/useMachine";

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
  }, [state.context.initialValues, state.context.patches]);

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

  const submit = React.useCallback(() => {
    send({
      type: EventType.Submit,
    });
  }, []);

  const reset = React.useCallback(
    (values?: Values, options: ResetOptions = {}) => {
      send({
        type: EventType.Reset,
        payload: { values, options },
      });
    },
    []
  );

  const fieldProps = React.useCallback<
    FormContext<Values, SubmissionResult>["fieldProps"]
  >(
    (options) => {
      let fieldPath: string;
      let type: string | undefined;
      let value: any;
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
            payload: { fieldPath: fieldPath, touched: true },
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

  const setFieldValue = React.useCallback<
    FormContext<Values, SubmissionResult>["setFieldValue"]
  >((fieldPath, newValue) => {
    send({
      type: EventType.Change,
      payload: {
        type: ChangeType.Set,
        fieldPath,
        value: newValue,
      },
    });
  }, []);

  const setFieldTouched = React.useCallback<
    FormContext<Values, SubmissionResult>["setFieldTouched"]
  >((fieldPath, touched = true) => {
    send({
      type: EventType.FieldTouched,
      payload: { fieldPath, touched },
    });
  }, []);

  const resetField = React.useCallback<
    FormContext<Values, SubmissionResult>["resetField"]
  >((fieldPath) => {
    const initialValue = get(state.context.initialValues, fieldPath);
    send({
      type: EventType.Change,
      payload: {
        type: ChangeType.Set,
        fieldPath,
        value: initialValue,
      },
    });
  }, []);

  const isTouched = React.useCallback<
    FormContext<Values, SubmissionResult>["isTouched"]
  >(
    (fieldPath) => {
      const touched = get(state.context.touchedFields, fieldPath);
      return touched != null && touched !== false;
    },
    [state.context.touchedFields]
  );

  const isDirty = React.useCallback<
    FormContext<Values, SubmissionResult>["isDirty"]
  >(
    (fieldPath) => {
      const dirty = get(state.context.dirtyFields, fieldPath);
      return dirty != null && dirty !== false;
    },
    [state.context.dirtyFields]
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
      setFieldValue,
      setFieldTouched,
      resetField,
      isTouched,
      isDirty,
      changes,
      list,
      validationErrors: state.context.validationErrors,
      status: state.value,
      isValidating: state.value === FormStatus.Validate,
      isSubmitting: state.value === FormStatus.Submit,
      submission: state.context.submission,
    };
  }, [
    state.context,
    state.value,
    submit,
    fieldProps,
    list,
    changes,
    setFieldValue,
    setFieldTouched,
    resetField,
    isTouched,
    isDirty,
  ]);

  return form;
}
