import produce, { produceWithPatches } from "immer";
import { get, isEqual, set, unset, update } from "lodash";
import { ListSwapAction, State } from "../../types";

export const swap = <V>(state: State<V>, action: ListSwapAction) => {
  const { path, indexA, indexB } = action.payload;

  const [nextValues, patches, inversePatches] = produceWithPatches(
    state.values,
    (draft) => {
      update(draft as any, path, (list) => {
        const updatedList = list || [];
        const tmp = updatedList[indexA];
        updatedList[indexA] = updatedList[indexB];
        updatedList[indexB] = tmp;
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
