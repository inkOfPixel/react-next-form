import produce, { Draft } from "immer";
import { State, ValidateAction, ValidationErrorsAction } from "../types";

const validateRecipe = <V>(state: Draft<State<V>>, action: ValidateAction) => {
  state.isValidating = true;
};

const validationErrorsRecipe = <V>(
  state: Draft<State<V>>,
  action: ValidationErrorsAction
) => {
  action.payload.error?.inner.forEach((error) => {
    state.errors[error.path] = error.message;
  });
  state.isValidating = false;
};

export const validate = produce(validateRecipe);

export const validationErrors = produce(validationErrorsRecipe);
