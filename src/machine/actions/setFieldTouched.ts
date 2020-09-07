import { assign } from "@xstate/fsm";
import { EventType, MachineContext, MachineEvent } from "../types";
import produce, { Draft } from "immer";
import { set } from "lodash";

function setFieldTouchedRecipe<Values, SubmissionResult>(
  context: Draft<MachineContext<Values, SubmissionResult>>,
  event: MachineEvent<Values, SubmissionResult>
) {
  if (event.type !== EventType.FieldTouched) {
    throw new Error(`unknown event type "${event.type}"`);
  }
  set(context.touchedFields, event.payload.fieldPath, true);
}

export const setFieldTouched = assign(produce(setFieldTouchedRecipe));
