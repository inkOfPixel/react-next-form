import { produceWithPatches } from "immer";
import { update } from "lodash";
import { getDirtyFields } from "../../../utils";
import { ListPrependPayload, MachineContext } from "../../types";

export const prepend = <Values, SubmissionResult>(
  context: MachineContext<Values, SubmissionResult>,
  payload: ListPrependPayload
) => {
  const { fieldPath, value } = payload;

  const [nextValues, patches, inversePatches] = produceWithPatches(
    context.values,
    (draft) => {
      update(draft as any, fieldPath, (list) => {
        const updatedList = list || [];
        updatedList.unshift(value);
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
