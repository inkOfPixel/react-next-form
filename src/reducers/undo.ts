import { produceWithPatches } from "immer";
import { State, UndoAction } from "../types";
import { getDirtyFields } from "../utils";

export const undo = <V>(state: State<V>, action: UndoAction) => {
  const [nextValues, patches, inversePatches] = produceWithPatches(
    state.values,
    (draft) => {
      throw new Error("undo not implemented yet");
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
