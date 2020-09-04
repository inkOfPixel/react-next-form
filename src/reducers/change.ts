import { produceWithPatches } from "immer";
import { set, unset } from "lodash";
import { ChangeAction, State } from "../types";
import { getDirtyFields } from "../utils";

export const change = <V>(state: State<V>, action: ChangeAction) => {
  const { name, value } = action.payload;

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
