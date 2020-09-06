import { assign } from "@xstate/fsm";
import produce, { Draft } from "immer";
import { MachineContext, MachineEvent } from "../types";

function clearValidationErrorsRecipe<Values, SubmissionResult>(
  context: Draft<MachineContext<Values, SubmissionResult>>,
  event: MachineEvent<Values, SubmissionResult>
) {
  context.validationErrors = {};
}

export const clearValidationErrors = assign(
  produce(clearValidationErrorsRecipe)
);
