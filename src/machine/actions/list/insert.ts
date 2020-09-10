import { produceWithPatches } from "immer";
import { update } from "lodash";
import { ArrayInsertPayload, MachineContext } from "../../types";

export const insert = <Values, SubmissionResult>(
  context: MachineContext<Values, SubmissionResult>,
  payload: ArrayInsertPayload
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

  return {
    ...context,
    values: nextValues,
    patches: context.patches.concat(patches),
    inversePatches: context.inversePatches.concat(inversePatches),
    lastChangedAt: Date.now(),
  };
};
