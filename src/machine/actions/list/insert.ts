import { produceWithPatches } from "immer";
import { update } from "lodash";
import { getDirtyFields } from "../../../utils";
import { ListInsertPayload, MachineContext } from "../../types";

export const insert = <Values, SubmissionResult>(
  context: MachineContext<Values, SubmissionResult>,
  payload: ListInsertPayload
) => {
  const { fieldPath, value, index } = payload;

  const [nextValues, patches, inversePatches] = produceWithPatches(
    context.values,
    (draft) => {
      update(draft as any, fieldPath, (list) => {
        const updatedList = list || [];
        updatedList.splice(index, 0, value);
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
