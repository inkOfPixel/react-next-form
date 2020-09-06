import { produceWithPatches } from "immer";
import { update } from "lodash";
import { getDirtyFields } from "../../../utils";
import { ListReplacePayload, MachineContext } from "../../types";

export const replace = <Values, SubmissionResult>(
  context: MachineContext<Values, SubmissionResult>,
  payload: ListReplacePayload
) => {
  const { fieldPath, value, index } = payload;

  const [nextValues, patches, inversePatches] = produceWithPatches(
    context.values,
    (draft) => {
      update(draft as any, fieldPath, (list) => {
        const updatedList = list || [];
        updatedList[index] = value;
        return updatedList;
      });
    }
  );

  const dirtyFields = getDirtyFields(
    context.dirtyFields,
    nextValues,
    context.initialValues
  );

  return {
    ...context,
    values: nextValues,
    dirtyFields,
    patches: context.patches.concat(patches),
    inversePatches: context.inversePatches.concat(inversePatches),
  };
};
