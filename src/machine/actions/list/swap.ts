import { produceWithPatches } from "immer";
import { update } from "lodash";
import { getDirtyFields } from "../../../utils";
import { ListSwapPayload, MachineContext } from "../../types";

export const swap = <Values, SubmissionResult>(
  context: MachineContext<Values, SubmissionResult>,
  payload: ListSwapPayload
) => {
  const { fieldPath, indexA, indexB } = payload;

  const [nextValues, patches, inversePatches] = produceWithPatches(
    context.values,
    (draft) => {
      update(draft as any, fieldPath, (list) => {
        const updatedList = list || [];
        const tmp = updatedList[indexA];
        updatedList[indexA] = updatedList[indexB];
        updatedList[indexB] = tmp;
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
