import { produceWithPatches } from "immer";
import { update } from "lodash";
import { ArrayPrependPayload, MachineContext } from "../../types";

export const prepend = <Values, SubmissionResult>(
  context: MachineContext<Values, SubmissionResult>,
  payload: ArrayPrependPayload
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

  return {
    ...context,
    values: nextValues,
    patches: context.patches.concat(patches),
    inversePatches: context.inversePatches.concat(inversePatches),
    lastChangedAt: Date.now(),
  };
};
