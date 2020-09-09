import { assign } from "@xstate/fsm";
import produce, { Draft, applyPatches, castDraft } from "immer";
import { MachineContext, MachineEvent, EventType } from "../types";
import { isEqual } from "lodash";

function resetValuesRecipe<Values, SubmissionResult>(
  context: Draft<MachineContext<Values, SubmissionResult>>,
  event: MachineEvent<Values, SubmissionResult>
) {
  if (event.type === EventType.Reset) {
    const { values: newInitialValues, options } = event.payload;
    const { keepDirtyFields = false, keepTouchedStatus = false } = options;

    if (newInitialValues) {
      if (isEqual(newInitialValues, context.initialValues)) {
        if (
          !keepDirtyFields &&
          !isEqual(context.initialValues, context.values)
        ) {
          context.values = context.initialValues;
          context.patches = [];
          context.inversePatches = [];
        }
      } else {
        let nextValues = newInitialValues;
        if (keepDirtyFields) {
          nextValues = applyPatches(newInitialValues, context.patches);
        }
        context.initialValues = castDraft(newInitialValues);
        context.values = castDraft(nextValues);
        if (!keepDirtyFields) {
          context.patches = [];
          context.inversePatches = [];
        }
      }
    } else {
      if (!keepDirtyFields) {
        context.values = context.initialValues;
        context.patches = [];
        context.inversePatches = [];
      }
    }
    if (!keepTouchedStatus) {
      context.touchedFields = {};
    }
  } else if (event.type === EventType.SubmissionSuccess) {
    context.initialValues = context.values;
    context.touchedFields = {};
    context.patches = [];
    context.inversePatches = [];
  } else {
    throw new Error(`unknown event type "${event.type}"`);
  }
}

export const resetValues = assign(produce(resetValuesRecipe));
