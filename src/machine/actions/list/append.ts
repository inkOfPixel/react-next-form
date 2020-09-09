import { produceWithPatches } from "immer";
import { update } from "lodash";
import { ArrayAppendPayload, MachineContext } from "../../types";

export const append = <Values, SubmissionResult>(
  context: MachineContext<Values, SubmissionResult>,
  payload: ArrayAppendPayload
) => {
  const { fieldPath, value } = payload;

  const [nextValues, patches, inversePatches] = produceWithPatches(
    context.values,
    (draft) => {
      update(draft as any, fieldPath, (list) => {
        const updatedList = list || [];
        updatedList.push(value);
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
