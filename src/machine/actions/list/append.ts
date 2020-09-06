import { produceWithPatches } from "immer";
import { update } from "lodash";
import { getDirtyFields } from "../../../utils";
import { ListAppendPayload, MachineContext } from "../../types";

export const append = <Values, SubmissionResult>(
  context: MachineContext<Values, SubmissionResult>,
  payload: ListAppendPayload
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
