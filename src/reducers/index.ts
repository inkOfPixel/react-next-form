import { State, Action, ActionTypes } from "../types";

export function reducer<V>(state: State<V>, action: Action<V>): State<V> {
  switch (action.type) {
    case ActionTypes.SUBMIT: {
      throw new Error("submit not implemented");
    }
    case ActionTypes.RESET: {
      throw new Error("submit not implemented");
    }
    default:
      return assertNever(action);
  }
}

export function assertNever(x: never): never {
  throw new Error("Unexpected action: " + x);
}
