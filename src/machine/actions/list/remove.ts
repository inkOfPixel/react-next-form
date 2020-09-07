import { produceWithPatches } from "immer";
import { update } from "lodash";
import { getDirtyFields } from "../../../utils";
import { ListRemovePayload, MachineContext } from "../../types";

export const remove = <Values, SubmissionResult>(
  context: MachineContext<Values, SubmissionResult>,
  payload: ListRemovePayload
) => {
  const { fieldPath, index } = payload;

  const [nextValues, patches, inversePatches] = produceWithPatches(
    context.values,
    (draft) => {
      update(draft as any, fieldPath, (list) => {
        const updatedList = list || [];
        if (updatedList.length > 0) {
          updatedList.splice(index, 1);
        }
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
