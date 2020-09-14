import { assign } from "@xstate/fsm";
import produce, { Draft } from "immer";
import { MachineContext, MachineEvent } from "../types";

function resetDismissedValidationErrorRecipe<Values, SubmissionResult>(
  context: Draft<MachineContext<Values, SubmissionResult>>,
  event: MachineEvent<Values, SubmissionResult>
) {
  context.dismissedErrors = {};
}

export const resetDismissedValidationErrors = assign(
  produce(resetDismissedValidationErrorRecipe)
);
