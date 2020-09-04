import produce, { produceWithPatches } from "immer";
import { get, isEqual, set, unset, update } from "lodash";
import { ListMoveAction, State } from "../../types";

export const move = <V>(state: State<V>, action: ListMoveAction) => {
  const { path, from, to } = action.payload;

  const [nextValues, patches, inversePatches] = produceWithPatches(
    state.values,
    (draft) => {
      update(draft as any, path, (list: unknown) => {
        const updatedList = list || [];
        if (!Array.isArray(updatedList)) {
          throw new Error(`value at path "${path}" is not an array`);
        }
        const [item] = updatedList.splice(from, 1);
        updatedList.splice(to, 0, item);
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
