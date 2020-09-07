import { produceWithPatches } from "immer";
import { set, unset } from "lodash";
import { MachineContext, SetPayload } from "../types";
import { getDirtyFields } from "../../utils";

export const setFieldValue = <Values, SubmissionResult>(
  context: MachineContext<Values, SubmissionResult>,
  payload: SetPayload
) => {
  const { fieldPath, value } = payload;

  const [nextValues, patches, inversePatches] = produceWithPatches(
    context.values,
    (draft) => {
      if (value === undefined) {
        unset(draft, fieldPath);
      } else {
        set(draft as any, fieldPath, value);
      }
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
