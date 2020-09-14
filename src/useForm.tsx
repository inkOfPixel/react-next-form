import { enablePatches } from "immer";
import { get, isEqual } from "lodash";
import React from "react";
import { createFormMachine } from "./machine";
import { ChangeType, EventType, FormStatus } from "./machine/types";
import { FieldProps, FormContext, FormConfig, ResetOptions } from "./types";
import { compressPatches, isEvent, validate, isPromise } from "./utils";
import { useMachine } from "./utils/useMachine";
import { useLatestRef } from "./utils/useLatestRef";
import useDebounce from "./utils/useDebounce";

enablePatches();

export function useForm<
  Values extends Record<string, any> = any,
  SubmissionResult = any
>(
  config: FormConfig<Values, SubmissionResult>
): FormContext<Values, SubmissionResult> {
  const [state, send] = useMachine(() => {
    return createFormMachine<Values, SubmissionResult>({
      initialValues: config.initialValues || {},
      values: config.initialValues || {},
      validationErrors: {},
      dismissedErrors: {},
      submission: {
        result: undefined,
        error: undefined,
        count: 0,
      },
      patches: [],
      inversePatches: [],
      touchedFields: {},
      shouldValidate: config.validationSchema != null,
    });
  });

  const lastChangedAtRef = useLatestRef(state.context.lastChangedAt);

  useDebounce(
    () => {
      if (state.value === FormStatus.PendingValidation) {
        send({
          type: EventType.Validate,
        });
      }
    },
    400,
    [state.context.lastChangedAt, state.value]
  );

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
        if (config.validationSchema) {
          validate(config.validationSchema, state.context.values, (error) => {
            if (state.context.lastChangedAt === lastChangedAtRef.current) {
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
            }
          });
        }
        break;
      }
      case FormStatus.Submit: {
        try {
          const result = config.onSubmit(state.context.values, {
            initialValues: state.context.initialValues,
            changes,
          });
          if (isPromise(result)) {
            result
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
          } else {
            send({
              type: EventType.SubmissionSuccess,
              payload: {
                result,
              },
            });
          }
        } catch (error) {
          console.log(error);
          send({
            type: EventType.SubmissionError,
            payload: {
              error: error.message,
            },
          });
        }

        break;
      }
      default:
        break;
    }
  }, [state.value]);

  React.useEffect(() => {
    if (config.enableReinitialize) {
      send({
        type: EventType.Reset,
        payload: {
          values: config.initialValues,
          options: {
            keepDirtyFields: true,
            keepTouchedStatus: true,
          },
        },
      });
    }
  }, [config.initialValues]);

  const submit = React.useCallback(() => {
    send({
      type: EventType.Submit,
    });
  }, []);

  const dismissSubmissionError = React.useCallback<
    FormContext<Values, SubmissionResult>["dismissSubmissionError"]
  >(() => {
    send({
      type: EventType.DismissSubmissionError,
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

  const dismissValidationErrors = React.useCallback<
    FormContext<Values, SubmissionResult>["dismissValidationErrors"]
  >((fieldPaths) => {
    send({
      type: EventType.DismissValidationError,
      payload:
        typeof fieldPaths === "string"
          ? { fieldPaths: [fieldPaths] }
          : Array.isArray(fieldPaths) && fieldPaths.length > 0
          ? { fieldPaths }
          : undefined,
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

  const isFieldDirty = React.useCallback<
    FormContext<Values, SubmissionResult>["isFieldDirty"]
  >(
    (fieldPath) => {
      const initialValue = get(state.context.initialValues, fieldPath);
      const value = get(state.context.values, fieldPath);
      return !isEqual(initialValue, value);
    },
    [state.context.initialValues, state.context.values]
  );

  const isErrorDismissed = React.useCallback<
    FormContext<Values, SubmissionResult>["isTouched"]
  >(
    (fieldPath) => {
      return state.context.dismissedErrors[fieldPath] === true;
    },
    [state.context.dismissedErrors]
  );

  const isDirty = React.useMemo<boolean>(() => {
    return !isEqual(state.context.initialValues, state.context.values);
  }, [state.context.initialValues, state.context.values]);

  //////////////////////////////////////////////////////////////////////////////////////
  // ARRAY METHODS
  //////////////////////////////////////////////////////////////////////////////////////

  const append = React.useCallback<
    FormContext<Values, SubmissionResult>["append"]
  >(
    (fieldPath, value) =>
      send({
        type: EventType.Change,
        payload: { type: ChangeType.ArrayAppend, fieldPath, value },
      }),
    []
  );

  const swap = React.useCallback<FormContext<Values, SubmissionResult>["swap"]>(
    (fieldPath, indexA, indexB) =>
      send({
        type: EventType.Change,
        payload: { type: ChangeType.ArraySwap, fieldPath, indexA, indexB },
      }),
    []
  );

  const move = React.useCallback<FormContext<Values, SubmissionResult>["move"]>(
    (fieldPath, from, to) =>
      send({
        type: EventType.Change,
        payload: { type: ChangeType.ArrayMove, fieldPath, from, to },
      }),
    []
  );

  const insert = React.useCallback<
    FormContext<Values, SubmissionResult>["insert"]
  >(
    (fieldPath, index, value) =>
      send({
        type: EventType.Change,
        payload: { type: ChangeType.ArrayInsert, fieldPath, value, index },
      }),
    []
  );

  const prepend = React.useCallback<
    FormContext<Values, SubmissionResult>["prepend"]
  >(
    (fieldPath, value) =>
      send({
        type: EventType.Change,
        payload: { type: ChangeType.ArrayPrepend, fieldPath, value },
      }),
    []
  );

  const remove = React.useCallback<
    FormContext<Values, SubmissionResult>["remove"]
  >(
    (fieldPath, index) =>
      send({
        type: EventType.Change,
        payload: { type: ChangeType.ArrayRemove, fieldPath, index },
      }),
    []
  );

  const replace = React.useCallback<
    FormContext<Values, SubmissionResult>["replace"]
  >(
    (fieldPath, index, value) =>
      send({
        type: EventType.Change,
        payload: {
          type: ChangeType.ArrayReplace,
          fieldPath,
          value,
          index,
        },
      }),
    []
  );

  const form = React.useMemo<FormContext<Values, SubmissionResult>>(() => {
    return {
      initialValues: state.context.initialValues,
      values: state.context.values,
      touchedFields: state.context.touchedFields,
      submit,
      dismissSubmissionError,
      reset,
      fieldProps,
      setFieldValue,
      setFieldTouched,
      resetField,
      isTouched,
      isFieldDirty,
      isDirty,
      isErrorDismissed,
      changes,
      validationErrors: state.context.validationErrors,
      dismissValidationErrors,
      status: state.value,
      isValidating: state.value === FormStatus.Validate,
      isSubmitting: state.value === FormStatus.Submit,
      submission: state.context.submission,
      append,
      swap,
      move,
      insert,
      prepend,
      remove,
      replace,
    };
  }, [
    state.context,
    state.value,
    submit,
    dismissSubmissionError,
    fieldProps,
    changes,
    setFieldValue,
    setFieldTouched,
    dismissValidationErrors,
    resetField,
    isTouched,
    isFieldDirty,
    append,
    swap,
    move,
    insert,
    prepend,
    remove,
    replace,
  ]);

  return form;
}
