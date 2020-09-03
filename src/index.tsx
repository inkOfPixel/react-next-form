import React from "react";
import { produceWithPatches, produce, applyPatches, Patch, Draft } from "immer";
import { get, set, update, unset, isEqual } from "lodash";
import { UseFormOptions, FormState } from "./types";

export interface FormContext<V> {
  initialValues: V;
  values: V;
  patches: Patch[];
  inversePatches: Patch[];
  dirtyFields: DeepFlagMap;
  touchedFields: DeepFlagMap;
  fieldProps: (name: FieldPropsOptions | string) => FieldProps;
  submit: () => void;
  /** Reset to initial values */
  reset: (options?: ResetOptions<V>) => void;
  list: <T>(name: string) => ListField<T>;
}

interface ListField<T> {
  push: (value: T) => void;
  swap: (indexA: number, indexB: number) => void;
  move: (from: number, to: number) => void;
  insert: (index: number, value: T) => void;
  /** Add value at the beginning */
  unshift: (value: T) => number;
  remove: (index: number) => T | undefined;
  pop: () => T | undefined;
  replace: (index: number, value: T) => void;
}

// form.listField("addresses").push(value)
// const form = useForm()

interface DeepFlagMap {
  [key: string]: boolean | DeepFlagMap;
}

interface ResetOptions<V> {
  initialValues?: V;
  keepDirtyFields?: boolean;
  keepTouchedStatus?: boolean;
}

interface FieldPropsOptions {
  name: string;
  type?: string;
  /** Used for checkboxes */
  value?: string | number;
}

interface FieldProps {
  name: string;
  type?: string;
  onChange(event: React.ChangeEvent<HTMLInputElement>): void;
  onChange(value: any): void;
  onBlur: (event?: React.FocusEvent<HTMLInputElement>) => void;
  value?: string | number | string[];
  checked?: boolean;
}

export function useForm<V = any>(options: UseFormOptions<V>): FormContext<V> {
  const [state, setState] = React.useState<FormState<V>>({
    initialValues: options.initialValues,
    values: options.initialValues,
    patches: [],
    inversePatches: [],
    dirtyFields: {},
    touchedFields: {},
  });

  const submit = React.useCallback(() => {
    console.log("submit");
  }, []);

  const reset = React.useCallback(
    (options: ResetOptions<V> = {}) => {
      const {
        initialValues,
        keepDirtyFields = false,
        keepTouchedStatus = false,
      } = options;

      if (initialValues) {
        let nextValues = initialValues;
        if (keepDirtyFields) {
          nextValues = applyPatches(initialValues, state.patches);
        }
        setState(
          produce((draft: Draft<FormState<any>>) => {
            draft.initialValues = initialValues;
            draft.values = nextValues;
            if (!keepDirtyFields) {
              draft.dirtyFields = {};
              draft.patches = [];
              draft.inversePatches = [];
            }
            if (!keepTouchedStatus) {
              draft.touchedFields = {};
            }
          })
        );
      } else {
        setState(
          produce((draft: Draft<FormState<any>>) => {
            draft.values = draft.initialValues;
            draft.dirtyFields = {};
            if (!keepTouchedStatus) {
              draft.touchedFields = {};
            }
            draft.patches = [];
            draft.inversePatches = [];
          })
        );
      }
    },
    [state]
  );

  const onChange = React.useCallback(
    (value: unknown, name: string) => {
      const [nextValues, patches, inversePatches] = produceWithPatches(
        state.values,
        (draft) => {
          if (value === undefined) {
            unset(draft, name);
          } else {
            set(draft as any, name, value);
          }
        }
      );
      const nextDirtyFields = produce(state.dirtyFields, (draft) => {
        if (isEqual(get(nextValues, name), get(state.initialValues, name))) {
          unset(draft, name);
        } else {
          set(draft, name, true);
        }
      });
      setState((currentState) => {
        return {
          ...currentState,
          values: nextValues,
          dirtyFields: nextDirtyFields,
          patches: currentState.patches.concat(patches),
          inversePatches: currentState.inversePatches.concat(inversePatches),
        };
      });
    },
    [state]
  );

  const onBlur = React.useCallback((name: string) => {
    setState(
      produce((draft: Draft<FormState<any>>) => {
        set(draft.touchedFields, name, true);
      })
    );
  }, []);

  const handleChangeEvent = React.useCallback(
    (options: FieldPropsOptions) => (
      x: React.ChangeEvent<HTMLInputElement> | unknown
    ) => {
      let type = options.type;
      let value: any = options.value;
      if (isEvent(x)) {
        type = type || x.currentTarget.type;
        if (type === "checkbox") {
          const nextChecked = x.currentTarget.checked;
          console.log({ value, nextChecked });
          if (value === undefined) {
            value = nextChecked;
          } else if (nextChecked === false) {
            value = undefined;
          }
        } else {
          value = value || x.currentTarget.value;
        }
      } else {
        value = x;
      }
      onChange(value, options.name);
    },
    [onChange]
  );

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
        onChange: handleChangeEvent({ name, type, value }),
        onBlur: () => onBlur(name),
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
    [state.values, onBlur, handleChangeEvent]
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

function isEvent(obj: unknown): obj is React.ChangeEvent<HTMLInputElement> {
  return typeof obj === "object" && (obj as any)?.nativeEvent instanceof Event;
}
