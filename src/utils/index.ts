import { applyPatches, Patch, produceWithPatches } from "immer";
import { ObjectSchema, ValidationError } from "yup";

export function isEvent(
  obj: unknown
): obj is React.ChangeEvent<HTMLInputElement> {
  return typeof obj === "object" && (obj as any)?.nativeEvent instanceof Event;
}

export function compressPatches<V>(initialValues: V, currentPatches: Patch[]) {
  const [_, patches] = produceWithPatches(initialValues, (draft) => {
    return applyPatches(draft, currentPatches);
  });
  return patches || [];
}

export const validate = async <V extends object>(
  schema: ObjectSchema<V>,
  values: V,
  onDone: (error?: ValidationError) => void
) => {
  try {
    await delay(2000);
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

export async function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
