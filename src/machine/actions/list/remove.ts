import { produceWithPatches } from "immer";
import { update } from "lodash";
import { ArrayRemovePayload, MachineContext } from "../../types";

export const remove = <Values, SubmissionResult>(
  context: MachineContext<Values, SubmissionResult>,
  payload: ArrayRemovePayload
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

  return {
    ...context,
    values: nextValues,
    patches: context.patches.concat(patches),
    inversePatches: context.inversePatches.concat(inversePatches),
  };
};
