import { assign } from "@xstate/fsm";
import produce, { Draft } from "immer";
import { EventType, MachineContext, MachineEvent } from "../types";

function setValidationErrorsRecipe<Values, SubmissionResult>(
  context: Draft<MachineContext<Values, SubmissionResult>>,
  event: MachineEvent<Values, SubmissionResult>
) {
  if (event.type !== EventType.ValidationError) {
    throw new Error(`unknown event type "${event.type}"`);
  }
  context.validationErrors = {};
  event.payload.error?.inner.forEach((error) => {
    context.validationErrors[error.path] = error.message;
  });
}

export const setValidationErrors = assign(produce(setValidationErrorsRecipe));
