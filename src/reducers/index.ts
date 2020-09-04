import { State, Action, ActionTypes } from "../types";
import { reset } from "./reset";
import { blur } from "./blur";
import { change } from "./change";
import { append } from "./list/append";
import { remove } from "./list/remove";
import { replace } from "./list/replace";
import { prepend } from "./list/prepend";
import { insert } from "./list/insert";
import { move } from "./list/move";
import { swap } from "./list/swap";
import { undo } from "./undo";
import { redo } from "./redo";
import { validate, validationErrors } from "./validate";

export function reducer<V>(state: State<V>, action: Action<V>): State<V> {
  switch (action.type) {
    case ActionTypes.CHANGE: {
      return change(state, action);
    }
    case ActionTypes.BLUR: {
      return blur(state, action);
    }
    case ActionTypes.SUBMIT: {
      throw new Error("submit not implemented");
    }
    case ActionTypes.RESET: {
      return reset(state, action);
    }
    case ActionTypes.LIST_APPEND: {
      return append(state, action);
    }
    case ActionTypes.LIST_SWAP: {
      return swap(state, action);
    }
    case ActionTypes.LIST_MOVE: {
      return move(state, action);
    }
    case ActionTypes.LIST_INSERT: {
      return insert(state, action);
    }
    case ActionTypes.LIST_PREPEND: {
      return prepend(state, action);
    }
    case ActionTypes.LIST_REMOVE: {
      return remove(state, action);
    }
    case ActionTypes.LIST_REPLACE: {
      return replace(state, action);
    }
    case ActionTypes.UNDO: {
      return undo(state, action);
    }
    case ActionTypes.REDO: {
      return redo(state, action);
    }
    case ActionTypes.VALIDATE: {
      return validate(state, action);
    }
    case ActionTypes.VALIDATION_ERRORS: {
      return validationErrors(state, action);
    }
    default:
      return assertNever(action);
  }
}

export function assertNever(x: never): never {
  throw new Error("Unexpected action: " + x);
}
