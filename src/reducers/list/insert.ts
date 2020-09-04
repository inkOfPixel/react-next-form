import produce, { produceWithPatches } from "immer";
import { get, isEqual, set, unset, update } from "lodash";
import { ListInsertAction, State } from "../../types";

export const insert = <V>(state: State<V>, action: ListInsertAction) => {
  const { path, value, index } = action.payload;

  const [nextValues, patches, inversePatches] = produceWithPatches(
    state.values,
    (draft) => {
      update(draft as any, path, (list) => {
        const updatedList = list || [];
        updatedList.splice(index, 0, value);
        return updatedList;
      });
    }
  );

  const nextDirtyFields = produce(state.dirtyFields, (draft) => {
    if (isEqual(get(nextValues, path), get(state.initialValues, path))) {
      unset(draft, path);
    } else {
      set(draft, path, true);
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
