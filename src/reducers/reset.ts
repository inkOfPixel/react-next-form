import produce, { applyPatches, Draft } from "immer";
import React from "react";
import { State, ResetAction } from "../types";

export interface ResetOptions<V> {
  initialValues?: V;
  keepDirtyFields?: boolean;
  keepTouchedStatus?: boolean;
}

export const reset_ = <V>(
  state: FormState<V>,
  setState: React.Dispatch<React.SetStateAction<FormState<V>>>
) => (options: ResetOptions<V> = {}) => {
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
};

export const reset = produce(
  <V>(draft: Draft<State<V>>, action: ResetAction<V>) => {
    const {
      initialValues,
      keepDirtyFields = false,
      keepTouchedStatus = false,
    } = action.options;
  }
);
