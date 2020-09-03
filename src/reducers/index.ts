import { State, Action, ActionTypes } from "../types";
import { reset } from "./reset";
import { blur } from "./blur";
import { change } from "./change";

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
    default:
      return assertNever(action);
  }
}

export function assertNever(x: never): never {
  throw new Error("Unexpected action: " + x);
}
