import produce, { produceWithPatches } from "immer";
import { get, isEqual, set, unset } from "lodash";
import { ChangeAction, State } from "../types";

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
  const nextDirtyFields = produce(state.dirtyFields, (draft) => {
    if (isEqual(get(nextValues, name), get(state.initialValues, name))) {
      unset(draft, name);
    } else {
      set(draft, name, true);
    }
  });
  return {
    ...state,
    values: nextValues,
    dirtyFields: nextDirtyFields,
    patches: state.patches.concat(patches),
    inversePatches: state.inversePatches.concat(inversePatches),
  };
};
