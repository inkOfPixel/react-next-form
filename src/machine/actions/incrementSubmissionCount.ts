import { assign } from "@xstate/fsm";
import produce, { Draft } from "immer";
import { MachineContext, MachineEvent } from "../types";

function incrementSubmissionCountRecipe<Values, SubmissionResult>(
  context: Draft<MachineContext<Values, SubmissionResult>>,
  event: MachineEvent<Values, SubmissionResult>
) {
  context.submission.count++;
}

export const incrementSubmissionCount = assign(
  produce(incrementSubmissionCountRecipe)
);
