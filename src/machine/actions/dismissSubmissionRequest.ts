import { assign } from "@xstate/fsm";
import produce, { Draft } from "immer";
import { MachineContext, MachineEvent } from "../types";

function dismissSubmissionRequestRecipe<Values, SubmissionResult>(
  context: Draft<MachineContext<Values, SubmissionResult>>,
  event: MachineEvent<Values, SubmissionResult>
) {
  context.submission.waitingValidation = false;
}

export const dismissSubmissionRequest = assign(
  produce(dismissSubmissionRequestRecipe)
);
