import { get } from "lodash";
import React from "react";
import { useFormContext } from "./FormContext";
import { Field, FieldConfig, FieldError } from "./types";

export function useField<Value = any>(
  options: string | FieldConfig<Value>
): Field<Value> {
  const state = useFormContext();
  let fieldPath = typeof options === "string" ? options : options.name;

  const initialValue = React.useMemo<Value>(() => {
    return get(state.initialValues, fieldPath);
  }, [fieldPath, state.initialValues]);

  const value = React.useMemo<Value>(() => {
    return get(state.values, fieldPath);
  }, [fieldPath, state.values]);

  const error = React.useMemo<FieldError>(() => {
    return state.validationErrors[fieldPath];
  }, [fieldPath, state.validationErrors]);

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

  const dismissError = React.useCallback<Field<Value>["dismissError"]>(() => {
    state.dismissValidationErrors(fieldPath);
  }, [fieldPath, state.dismissValidationErrors]);

  const isErrorDismissed = React.useMemo(() => {
    return state.isErrorDismissed(fieldPath);
  }, [fieldPath, state.isErrorDismissed]);

  const isTouched = React.useMemo(() => {
    return state.isTouched(fieldPath);
  }, [fieldPath, state.isTouched]);

  const isDirty = React.useMemo(() => {
    return state.isFieldDirty(fieldPath);
  }, [fieldPath, state.isFieldDirty]);

  const props = React.useMemo(() => {
    return state.fieldProps(fieldPath);
  }, [fieldPath, state.fieldProps]);

  return {
    value,
    initialValue,
    error,
    setValue,
    setTouched,
    reset,
    dismissError,
    isErrorDismissed,
    isTouched,
    isDirty,
    props,
  };
}
