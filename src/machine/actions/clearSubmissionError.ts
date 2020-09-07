import { assign } from "@xstate/fsm";
import produce, { Draft } from "immer";
import { MachineContext, MachineEvent } from "../types";

function clearSubmissionErrorRecipe<Values, SubmissionResult>(
  context: Draft<MachineContext<Values, SubmissionResult>>,
  event: MachineEvent<Values, SubmissionResult>
) {
  context.submission.error = undefined;
}

export const clearSubmissionError = assign(produce(clearSubmissionErrorRecipe));
