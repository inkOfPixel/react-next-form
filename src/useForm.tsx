import { get } from "lodash";
import React from "react";
import { reducer } from "./reducers";
import {
  Action,
  ActionType,
  FieldProps,
  FieldPropsOptions,
  FormContext,
  FormOptions,
  ResetOptions,
  State,
  FormStatus,
} from "./types";
import { isEvent, compressPatches, validate } from "./utils";
import { enablePatches } from "immer";

enablePatches();

export function useForm<V extends Record<string, any> = any>(
  options: FormOptions<V>
): FormContext<V> {
  const [state, dispatch] = React.useReducer<
    React.Reducer<State<V>, Action<V>>
  >(reducer, {
    initialValues: options.initialValues,
    values: options.initialValues,
    patches: [],
    inversePatches: [],
    dirtyFields: {},
    touchedFields: {},
    errors: {},
    status: FormStatus.Idle,
    submitCount: 0,
  });

  React.useEffect(() => {
    if (options.validationSchema) {
      dispatch({
        type: ActionType.VALIDATE,
      });
      validate(options.validationSchema, state.values, (error) => {
        dispatch({
          type: ActionType.VALIDATION_ERRORS,
          payload: {
            error,
          },
        });
      });
    }
  }, [state.values]);

  const submit = React.useCallback(() => {
    dispatch({
      type: ActionType.SUBMIT,
    });
  }, []);

  const reset = React.useCallback((options: ResetOptions<V> = {}) => {
    dispatch({
      type: ActionType.RESET,
      options,
    });
  }, []);

  const fieldProps = React.useCallback(
    (options: FieldPropsOptions | string): FieldProps => {
      let name: string;
      let type: string | undefined;
      let value: string | number | undefined;
      if (typeof options === "string") {
        name = options;
      } else {
        name = options.name;
        type = options.type;
        value = options.value;
      }
      const stateValue = get(state.values, name);
      const props: FieldProps = {
        name,
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
          dispatch({
            type: ActionType.CHANGE,
            payload: {
              name,
              value: nextValue,
            },
          });
        },
        onBlur: () =>
          dispatch({
            type: ActionType.BLUR,
            payload: { name },
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
    [state.values]
  );

  const list = React.useCallback<FormContext<V>["list"]>((path) => {
    return {
      append: (value) =>
        dispatch({
          type: ActionType.LIST_APPEND,
          payload: { path, value },
        }),
      swap: (indexA, indexB) =>
        dispatch({
          type: ActionType.LIST_SWAP,
          payload: { path, indexA, indexB },
        }),
      move: (from, to) =>
        dispatch({
          type: ActionType.LIST_MOVE,
          payload: { path, from, to },
        }),
      insert: (index, value) =>
        dispatch({
          type: ActionType.LIST_INSERT,
          payload: { path, value, index },
        }),
      prepend: (value) =>
        dispatch({
          type: ActionType.LIST_PREPEND,
          payload: { path, value },
        }),
      remove: (index) =>
        dispatch({
          type: ActionType.LIST_REMOVE,
          payload: { path, index },
        }),
      replace: (index, value) =>
        dispatch({
          type: ActionType.LIST_REPLACE,
          payload: { path, value, index },
        }),
    };
  }, []);

  const changes = React.useMemo(() => {
    const compressedPatches = compressPatches(
      state.initialValues,
      state.patches
    );
    return compressedPatches;
  }, [state]);

  const form = React.useMemo<FormContext<V>>(() => {
    return {
      initialValues: state.initialValues,
      values: state.values,
      dirtyFields: state.dirtyFields,
      touchedFields: state.touchedFields,
      submit,
      reset,
      fieldProps,
      changes,
      list,
      errors: state.errors,
      status: state.status,
      isValidating: state.status === FormStatus.Validating,
      isSubmitting: state.status === FormStatus.Submitting,
      submitCount: state.submitCount,
    };
  }, [state, submit, fieldProps, list, changes]);

  return form;
}
