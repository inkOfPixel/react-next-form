import { assign } from "@xstate/fsm";
import produce, { Draft } from "immer";
import { MachineContext, MachineEvent } from "../types";

function resetSubmissionCountRecipe<Values, SubmissionResult>(
  context: Draft<MachineContext<Values, SubmissionResult>>,
  event: MachineEvent<Values, SubmissionResult>
) {
  context.submission.count = 0;
}

export const resetSubmissionCount = assign(produce(resetSubmissionCountRecipe));
