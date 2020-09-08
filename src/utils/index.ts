import produce, { applyPatches, Patch, produceWithPatches } from "immer";
import { get, isEqual, set, unset } from "lodash";
import { Schema, ValidationError } from "yup";
import { MachineContext } from "../machine/types";

export function isEvent(
  obj: unknown
): obj is React.ChangeEvent<HTMLInputElement> {
  return typeof obj === "object" && (obj as any)?.nativeEvent instanceof Event;
}

export const getDirtyFields = <Values, SubmissionResult>(
  context: MachineContext<Values, SubmissionResult>,
  fieldPath: string,
  nextValues: Values
) => {
  return produce(context.dirtyFields, (draft) => {
    if (
      isEqual(get(nextValues, fieldPath), get(context.initialValues, fieldPath))
    ) {
      unset(draft, fieldPath);
    } else {
      set(draft, fieldPath, true);
    }
  });
};

export function compressPatches<V>(initialValues: V, currentPatches: Patch[]) {
  const [_, patches] = produceWithPatches(initialValues, (draft) => {
    return applyPatches(draft, currentPatches);
  });
  return patches || [];
}

export const validate = async <V>(
  schema: Schema<V>,
  values: V,
  onDone: (error?: ValidationError) => void
) => {
  try {
    await schema.validate(values, {
      abortEarly: false,
      strict: true,
    });
    onDone();
  } catch (error) {
    onDone(error);
  }
};

export function assertNever(x: never): never {
  throw new Error("Unexpected action: " + x);
}
