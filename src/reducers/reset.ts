import produce, { applyPatches, Draft, castDraft } from "immer";
import { State, ResetAction } from "../types";

export const reset = produce(
  <V>(draft: Draft<State<V>>, action: ResetAction<V>) => {
    const {
      initialValues,
      keepDirtyFields = false,
      keepTouchedStatus = false,
    } = action.options;

    if (initialValues) {
      let nextValues = initialValues;
      if (keepDirtyFields) {
        nextValues = applyPatches(initialValues, draft.patches);
      }
      draft.initialValues = castDraft(initialValues);
      draft.values = castDraft(nextValues);
      if (!keepDirtyFields) {
        draft.dirtyFields = {};
        draft.patches = [];
        draft.inversePatches = [];
      }
      if (!keepTouchedStatus) {
        draft.touchedFields = {};
      }
    } else {
      draft.values = draft.initialValues;
      draft.dirtyFields = {};
      if (!keepTouchedStatus) {
        draft.touchedFields = {};
      }
      draft.patches = [];
      draft.inversePatches = [];
    }
  }
);
