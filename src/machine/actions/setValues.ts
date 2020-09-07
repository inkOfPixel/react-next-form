import { assign } from "@xstate/fsm";
import { assertNever } from "../../utils";
import { ChangeType, EventType, MachineContext, MachineEvent } from "../types";
import { setFieldValue } from "./setFieldValue";
import { replace } from "./list/replace";
import { remove } from "./list/remove";
import { prepend } from "./list/prepend";
import { insert } from "./list/insert";
import { move } from "./list/move";
import { swap } from "./list/swap";
import { append } from "./list/append";

function setValuesRecipe<Values, SubmissionResult>(
  context: MachineContext<Values, SubmissionResult>,
  event: MachineEvent<Values, SubmissionResult>
) {
  if (event.type !== EventType.Change) {
    throw new Error(`unknown event type "${event.type}"`);
  }
  switch (event.payload.type) {
    case ChangeType.Set: {
      return setFieldValue(context, event.payload);
    }
    case ChangeType.ListAppend: {
      return append(context, event.payload);
    }
    case ChangeType.ListSwap: {
      return swap(context, event.payload);
    }
    case ChangeType.ListMove: {
      return move(context, event.payload);
    }
    case ChangeType.ListInsert: {
      return insert(context, event.payload);
    }
    case ChangeType.ListPrepend: {
      return prepend(context, event.payload);
    }
    case ChangeType.ListRemove: {
      return remove(context, event.payload);
    }
    case ChangeType.ListReplace: {
      return replace(context, event.payload);
    }
    default:
      return assertNever(event.payload);
  }
}

export const setValues = assign(setValuesRecipe);
