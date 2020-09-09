import { assign } from "@xstate/fsm";
import produce, { Draft } from "immer";
import { MachineContext, MachineEvent, EventType } from "../types";

function clearValidationErrorsRecipe<Values, SubmissionResult>(
  context: Draft<MachineContext<Values, SubmissionResult>>,
  event: MachineEvent<Values, SubmissionResult>
) {
  if (event.type === EventType.DismissValidationError && event.payload) {
    event.payload.fieldPaths.forEach((fieldPath) => {
      delete context.validationErrors[fieldPath];
    });
  } else {
    context.validationErrors = {};
  }
}

export const clearValidationErrors = assign(
  produce(clearValidationErrorsRecipe)
);
