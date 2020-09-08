import { assign } from "@xstate/fsm";
import { EventType, MachineContext, MachineEvent } from "../types";
import produce, { Draft } from "immer";
import { set, unset, get } from "lodash";

function setFieldTouchedRecipe<Values, SubmissionResult>(
  context: Draft<MachineContext<Values, SubmissionResult>>,
  event: MachineEvent<Values, SubmissionResult>
) {
  if (event.type !== EventType.FieldTouched) {
    throw new Error(`unknown event type "${event.type}"`);
  }
  const { fieldPath, touched } = event.payload;
  if (touched) {
    set(context.touchedFields, fieldPath, true);
  } else {
    unset(context.touchedFields, fieldPath);
    const path = fieldPath.replace(/\[|(\]\.)/g, ".").split(".");
    path.pop();
    let parentFieldPath = path.join(".");
    let parent = get(context.touchedFields, parentFieldPath);
    while (path.length > 0 && Object.keys(parent).length === 0) {
      unset(context.touchedFields, parentFieldPath);
      path.pop();
      parentFieldPath = path.join(".");
      parent = get(context.touchedFields, parentFieldPath);
    }
  }
}

export const setFieldTouched = assign(produce(setFieldTouchedRecipe));
