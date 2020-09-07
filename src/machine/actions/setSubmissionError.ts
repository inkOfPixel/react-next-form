import { assign } from "@xstate/fsm";
import produce, { Draft } from "immer";
import { EventType, MachineContext, MachineEvent } from "../types";

function setSubmissionErrorRecipe<Values, SubmissionResult>(
  context: Draft<MachineContext<Values, SubmissionResult>>,
  event: MachineEvent<Values, SubmissionResult>
) {
  if (event.type !== EventType.SubmissionError) {
    throw new Error(`unknown event type "${event.type}"`);
  }
  context.submission.error = event.payload.error;
}

export const setSubmissionError = assign(produce(setSubmissionErrorRecipe));
