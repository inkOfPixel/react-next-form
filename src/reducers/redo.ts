import { produceWithPatches } from "immer";
import { State, RedoAction } from "../types";
import { getDirtyFields } from "../utils";

export const redo = <V>(state: State<V>, action: RedoAction) => {
  const [nextValues, patches, inversePatches] = produceWithPatches(
    state.values,
    (draft) => {
      throw new Error("redo not implemented yet");
    }
  );
  const dirtyFields = getDirtyFields(
    state.dirtyFields,
    nextValues,
    state.initialValues
  );
  return {
    ...state,
    values: nextValues,
    dirtyFields,
    patches: state.patches.concat(patches),
    inversePatches: state.inversePatches.concat(inversePatches),
  };
};
