import { assign } from "@xstate/fsm";
import produce, { Draft } from "immer";
import { MachineContext, MachineEvent, EventType } from "../types";

function dismissValidationErrorsRecipe<Values, SubmissionResult>(
  context: Draft<MachineContext<Values, SubmissionResult>>,
  event: MachineEvent<Values, SubmissionResult>
) {
  if (event.type === EventType.DismissValidationError && event.payload) {
    event.payload.fieldPaths.forEach((fieldPath) => {
      context.dismissedErrors[fieldPath] = true;
    });
  }
}

export const dismissValidationErrors = assign(
  produce(dismissValidationErrorsRecipe)
);
