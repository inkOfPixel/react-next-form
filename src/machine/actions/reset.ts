import { assign } from "@xstate/fsm";
import produce, { Draft, applyPatches, castDraft } from "immer";
import { MachineContext, MachineEvent, EventType } from "../types";

function resetRecipe<Values, SubmissionResult>(
  context: Draft<MachineContext<Values, SubmissionResult>>,
  event: MachineEvent<Values, SubmissionResult>
) {
  if (event.type !== EventType.Reset) {
    throw new Error(`unknown event type "${event.type}"`);
  }
  const {
    newInitialValues,
    keepDirtyFields = false,
    keepTouchedStatus = false,
  } = event.payload;

  if (newInitialValues) {
    let nextValues = newInitialValues;
    if (keepDirtyFields) {
      nextValues = applyPatches(newInitialValues, context.patches);
    }
    context.initialValues = castDraft(newInitialValues);
    context.values = castDraft(nextValues);
    if (!keepDirtyFields) {
      context.dirtyFields = {};
      context.patches = [];
      context.inversePatches = [];
    }
    if (!keepTouchedStatus) {
      context.touchedFields = {};
    }
  } else {
    context.values = context.initialValues;
    context.dirtyFields = {};
    if (!keepTouchedStatus) {
      context.touchedFields = {};
    }
    context.patches = [];
    context.inversePatches = [];
  }
}

export const reset = assign(produce(resetRecipe));
