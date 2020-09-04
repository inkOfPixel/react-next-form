import produce, { produceWithPatches } from "immer";
import { get, isEqual, set, unset, update } from "lodash";
import { ListPrependAction, State } from "../../types";

export const prepend = <V>(state: State<V>, action: ListPrependAction) => {
  const { path, value } = action.payload;

  const [nextValues, patches, inversePatches] = produceWithPatches(
    state.values,
    (draft) => {
      update(draft as any, path, (list) => {
        const updatedList = list || [];
        updatedList.unshift(value);
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
