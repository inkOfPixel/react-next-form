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
  return produce(context.dirtyFields, (dirtyFieldsDraft) => {
    const branchPaths = getBranchFieldPaths(fieldPath);

    let currentFieldPath = branchPaths.pop();
    let initialValue = get(context.initialValues, fieldPath);
    let nextValue = get(nextValues, fieldPath);
    while (currentFieldPath !== undefined && isEqual(nextValue, initialValue)) {
      unset(dirtyFieldsDraft, currentFieldPath);
      currentFieldPath = branchPaths.pop();
      initialValue = get(context.initialValues, fieldPath);
      nextValue = get(nextValues, fieldPath);
    }

    // const initialValue = get(context.initialValues, fieldPath);
    // const nextValue = get(nextValues, fieldPath);
    if (isEqual(nextValue, initialValue)) {
      console.log("UNSET", fieldPath, nextValue);
      unset(dirtyFieldsDraft, fieldPath);
      let parentFieldPath = getParentFieldPath(fieldPath);
      let parent =
        parentFieldPath == null ? null : get(dirtyFieldsDraft, parentFieldPath);
      while (parent != null && Object.keys(parent).length === 0) {
        console.log("UNSET", parentFieldPath);
        unset(dirtyFieldsDraft, parentFieldPath!);
        parentFieldPath = getParentFieldPath(parentFieldPath!);
        parent =
          parentFieldPath == null
            ? null
            : get(dirtyFieldsDraft, parentFieldPath);
      }
    } else {
      set(dirtyFieldsDraft, fieldPath, true);
    }
  });
};

export function getFieldPathComponents(
  fieldPath: string
): Array<string | number> {
  return fieldPath.replace(/\[|(\]\.)/g, ".").split(".");
}

/** Returns null if parent fieldPath is root */
export function getParentFieldPath(childFieldPath: string): string | null {
  const components = getFieldPathComponents(childFieldPath);
  components.pop();
  return components.join(".");
}

/**
 * Given a path, returns all node paths (in dot notation)
 *
 * e.g. "address[0].name" returns ["address", "address.0", "address.0.name"]
 * */
export function getBranchFieldPaths(fieldPath: string): string[] {
  const paths: string[] = [];
  const components = getFieldPathComponents(fieldPath);
  while (components.length > 0) {
    paths.unshift(components.join("."));
    components.pop();
  }
  return paths;
}

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
