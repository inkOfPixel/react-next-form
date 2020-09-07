import { produceWithPatches } from "immer";
import { update } from "lodash";
import { getDirtyFields } from "../../../utils";
import { ListMovePayload, MachineContext } from "../../types";

export const move = <Values, SubmissionResult>(
  context: MachineContext<Values, SubmissionResult>,
  payload: ListMovePayload
) => {
  const { fieldPath, from, to } = payload;

  const [nextValues, patches, inversePatches] = produceWithPatches(
    context.values,
    (draft) => {
      update(draft as any, fieldPath, (list) => {
        const updatedList = list || [];
        if (!Array.isArray(updatedList)) {
          throw new Error(`value at path "${fieldPath}" is not an array`);
        }
        const [item] = updatedList.splice(from, 1);
        updatedList.splice(to, 0, item);
        return updatedList;
      });
    }
  );

  const dirtyFields = getDirtyFields(context, fieldPath, nextValues);

  return {
    ...context,
    values: nextValues,
    dirtyFields,
    patches: context.patches.concat(patches),
    inversePatches: context.inversePatches.concat(inversePatches),
  };
};
