import { produce, produceWithPatches } from "immer";
import { get, isEqual, set, unset, update } from "lodash";
import React from "react";
import { reducer } from "./reducers";
import {
  Action,
  ActionTypes,
  FieldProps,
  FieldPropsOptions,
  FormContext,
  FormOptions,
  ResetOptions,
  State,
} from "./types";
import { isEvent } from "./utils";

export function useForm<V = any>(options: FormOptions<V>): FormContext<V> {
  const [state, dispatch] = React.useReducer<
    React.Reducer<State<V>, Action<V>>
  >(reducer, {
    initialValues: options.initialValues,
    values: options.initialValues,
    patches: [],
    inversePatches: [],
    dirtyFields: {},
    touchedFields: {},
  });

  const submit = React.useCallback(() => {
    dispatch({
      type: ActionTypes.SUBMIT,
    });
  }, []);

  const reset = React.useCallback((options: ResetOptions<V> = {}) => {
    dispatch({
      type: ActionTypes.RESET,
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
            nextValue = x.currentTarget.value;
            if (x.currentTarget.type === "checkbox") {
              if (x.currentTarget.value == null) {
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
            type: ActionTypes.CHANGE,
            payload: {
              name,
              value: nextValue,
            },
          });
        },
        onBlur: () =>
          dispatch({
            type: ActionTypes.BLUR,
            payload: { name },
          }),
      };
      if (type === "checkbox") {
        props.checked =
          value === undefined ? stateValue === true : stateValue === value;
        if (value !== undefined) {
          props.value = value;
        }
      } else {
        props.value = stateValue;
      }
      return props;
    },
    [state.values]
  );

  const push = React.useCallback(
    (name: string, value: any) => {
      const [nextValues, patches, inversePatches] = produceWithPatches(
        state.values,
        (draft) => {
          update(draft as any, name, (list) => {
            const newList = list || [];
            newList.push(value);
            return newList;
          });
        }
      );
      const nextDirtyFields = produce(state.dirtyFields, (draft) => {
        if (isEqual(get(nextValues, name), get(state.initialValues, name))) {
          unset(draft, name);
        } else {
          set(draft, name, true);
        }
      });
      setState((currentState) => ({
        ...currentState,
        values: nextValues,
        dirtyFields: nextDirtyFields,
        patches: currentState.patches.concat(patches),
        inversePatches: currentState.inversePatches.concat(inversePatches),
      }));
    },
    [state]
  );

  const remove = React.useCallback(
    (name: string, index: number) => {
      const [nextValues, patches, inversePatches] = produceWithPatches(
        state.values,
        (draft) => {
          update(draft as any, name, (list) => {
            const newList = list || [];
            if (newList.length > 0) {
              newList.splice(index, 1);
            }
            return newList;
          });
        }
      );
      const nextDirtyFields = produce(state.dirtyFields, (draft) => {
        if (isEqual(get(nextValues, name), get(state.initialValues, name))) {
          unset(draft, name);
        } else {
          set(draft, name, true);
        }
      });
      setState((currentState) => ({
        ...currentState,
        values: nextValues,
        dirtyFields: nextDirtyFields,
        patches: currentState.patches.concat(patches),
        inversePatches: currentState.inversePatches.concat(inversePatches),
      }));
    },
    [state]
  );

  const form = React.useMemo<FormContext<V>>(() => {
    return {
      initialValues: state.initialValues,
      values: state.values,
      dirtyFields: state.dirtyFields,
      touchedFields: state.touchedFields,
      submit,
      reset: reset(state, setState),
      fieldProps,
      patches: state.patches,
      inversePatches: state.inversePatches,
      push,
      remove,
    };
  }, [state, submit, fieldProps, push, remove]);

  return form;
}

export interface UseListFieldOptions<V> {}

export interface UseListFieldReturn<V> {}

export function useListField<V = any>(
  options: UseListFieldOptions<V>
): UseListFieldReturn<V> {
  return {};
}
