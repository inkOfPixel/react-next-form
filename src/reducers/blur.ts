import produce, { Draft } from "immer";
import { set } from "lodash";
import { BlurAction, State } from "../types";

export const blur = produce(<V>(draft: Draft<State<V>>, action: BlurAction) => {
  set(draft.touchedFields, action.payload.name, true);
});
