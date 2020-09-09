import { get } from "lodash";
import React from "react";
import { useFormContext } from "./FormContext";
import { ArrayField, FieldError } from "./types";

export function useArrayField<ItemValue = any>(
  fieldPath: string
): ArrayField<ItemValue> {
  const form = useFormContext();

  const initialValue = React.useMemo<ItemValue[]>(() => {
    return get(form.initialValues, fieldPath);
  }, [fieldPath, form.initialValues]);

  const value = React.useMemo<ItemValue[]>(() => {
    return get(form.values, fieldPath);
  }, [fieldPath, form.values]);

  const error = React.useMemo<FieldError>(() => {
    return form.validationErrors[fieldPath];
  }, [fieldPath, form.validationErrors]);

  const set = React.useCallback<ArrayField<ItemValue>["set"]>(
    (newValue) => {
      form.setFieldValue(fieldPath, newValue);
    },
    [fieldPath, form.setFieldValue]
  );

  const reset = React.useCallback<ArrayField<ItemValue>["reset"]>(() => {
    form.resetField(fieldPath);
  }, [fieldPath, form.resetField]);

  const isDirty = React.useMemo(() => {
    return form.isFieldDirty(fieldPath);
  }, [fieldPath, form.isFieldDirty]);

  const append = React.useCallback<ArrayField<ItemValue>["append"]>(
    (value) => form.append(fieldPath, value),
    []
  );

  const swap = React.useCallback<ArrayField<ItemValue>["swap"]>(
    (indexA, indexB) => form.swap(fieldPath, indexA, indexB),
    []
  );

  const move = React.useCallback<ArrayField<ItemValue>["move"]>(
    (from, to) => form.move(fieldPath, from, to),
    []
  );

  const insert = React.useCallback<ArrayField<ItemValue>["insert"]>(
    (index, value) => form.insert(fieldPath, index, value),
    []
  );

  const prepend = React.useCallback<ArrayField<ItemValue>["prepend"]>(
    (value) => form.prepend(fieldPath, value),
    []
  );

  const remove = React.useCallback<ArrayField<ItemValue>["remove"]>(
    (index) => form.remove(fieldPath, index),
    []
  );

  const replace = React.useCallback<ArrayField<ItemValue>["replace"]>(
    (index, value) => form.replace(fieldPath, index, value),
    []
  );

  return {
    value,
    initialValue,
    error,
    set,
    reset,
    isDirty,
    append,
    swap,
    move,
    insert,
    prepend,
    remove,
    replace,
  };
}
