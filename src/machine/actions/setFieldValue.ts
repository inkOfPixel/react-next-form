import { produceWithPatches } from "immer";
import { set, unset } from "lodash";
import { MachineContext, SetPayload } from "../types";

export const setFieldValue = <Values, SubmissionResult>(
  context: MachineContext<Values, SubmissionResult>,
  payload: SetPayload
) => {
  const { fieldPath, value } = payload;

  console.log("SET", payload);

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

  return {
    ...context,
    values: nextValues,
    patches: context.patches.concat(patches),
    inversePatches: context.inversePatches.concat(inversePatches),
  };
};
