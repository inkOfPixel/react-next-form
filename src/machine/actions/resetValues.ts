import { assign } from "@xstate/fsm";
import produce, { Draft, applyPatches, castDraft } from "immer";
import { MachineContext, MachineEvent, EventType } from "../types";

function resetValuesRecipe<Values, SubmissionResult>(
  context: Draft<MachineContext<Values, SubmissionResult>>,
  event: MachineEvent<Values, SubmissionResult>
) {
  if (event.type === EventType.Reset) {
    const { values: newInitialValues, options } = event.payload;
    const { keepDirtyFields = false, keepTouchedStatus = false } = options;

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
  } else if (event.type === EventType.SubmissionSuccess) {
    context.initialValues = context.values;
    context.dirtyFields = {};
    context.touchedFields = {};
    context.patches = [];
    context.inversePatches = [];
  } else {
    throw new Error(`unknown event type "${event.type}"`);
  }
}

export const resetValues = assign(produce(resetValuesRecipe));
