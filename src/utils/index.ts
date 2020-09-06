import produce, { Draft, Patch, produceWithPatches, applyPatches } from "immer";
import { isEqual, get, unset, set } from "lodash";
import { DeepFlagMap } from "../types";
import { Schema, ValidationError } from "yup";

export function isEvent(
  obj: unknown
): obj is React.ChangeEvent<HTMLInputElement> {
  return typeof obj === "object" && (obj as any)?.nativeEvent instanceof Event;
}

export const getDirtyFields = produce(
  <V>(dirtyFieldsDraft: Draft<DeepFlagMap>, values: V, initialValues: V) => {
    if (isEqual(get(values, name), get(initialValues, name))) {
      unset(dirtyFieldsDraft, name);
    } else {
      set(dirtyFieldsDraft, name, true);
    }
  }
);

export function compressPatches<V>(initialValues: V, currentPatches: Patch[]) {
  const [_, patches] = produceWithPatches(initialValues, (draft) => {
    return applyPatches(draft, currentPatches);
  });
  return patches;
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
