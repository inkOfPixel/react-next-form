import { get } from "lodash";
import React from "react";
import { useFormContext } from "./FormContext";
import { Field, FieldPropsOptions } from "./types";

export function useField<Value>(
  options: string | FieldPropsOptions<Value>
): Field<Value> {
  const state = useFormContext();
  let fieldPath = typeof options === "string" ? options : options.name;

  const initialValue = React.useMemo<Value>(() => {
    return get(state.initialValues, fieldPath);
  }, [fieldPath, state.initialValues]);

  const value = React.useMemo<Value>(() => {
    return get(state.values, fieldPath);
  }, [fieldPath, state.values]);

  const setValue = React.useCallback<Field<Value>["setValue"]>(
    (newValue) => {
      state.setFieldValue(fieldPath, newValue);
    },
    [fieldPath, state.setFieldValue]
  );

  const setTouched = React.useCallback<Field<Value>["setTouched"]>(
    (touched) => {
      state.setFieldTouched(fieldPath, touched);
    },
    [fieldPath, state.setFieldTouched]
  );

  const reset = React.useCallback<Field<Value>["reset"]>(() => {
    state.resetField(fieldPath);
  }, [fieldPath, state.resetField]);

  const isTouched = React.useMemo(() => {
    return state.isTouched(fieldPath);
  }, [fieldPath, state.isTouched]);

  const isDirty = React.useMemo(() => {
    return state.isDirty(fieldPath);
  }, [fieldPath, state.isDirty]);

  const props = React.useMemo(() => {
    return state.fieldProps(fieldPath);
  }, [fieldPath, state.fieldProps]);

  return {
    value,
    initialValue,
    setValue,
    setTouched,
    reset,
    isTouched,
    isDirty,
    props,
  };
}
