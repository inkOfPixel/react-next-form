import { produceWithPatches } from "immer";
import { update } from "lodash";
import { ArrayReplacePayload, MachineContext } from "../../types";

export const replace = <Values, SubmissionResult>(
  context: MachineContext<Values, SubmissionResult>,
  payload: ArrayReplacePayload
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

  return {
    ...context,
    values: nextValues,
    patches: context.patches.concat(patches),
    inversePatches: context.inversePatches.concat(inversePatches),
    lastChangedAt: Date.now(),
  };
};
