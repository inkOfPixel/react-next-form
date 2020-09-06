import produce, { Draft } from "immer";
import {
  State,
  ValidateAction,
  ValidationErrorsAction,
  FormStatus,
} from "../types";

const validateRecipe = <V>(state: Draft<State<V>>, action: ValidateAction) => {
  state.status = FormStatus.Validating;
};

const validationErrorsRecipe = <V>(
  state: Draft<State<V>>,
  action: ValidationErrorsAction
) => {
  action.payload.error?.inner.forEach((error) => {
    state.errors[error.path] = error.message;
  });
  if (state.submitCount > 0) {
    state.status = FormStatus.Submitted;
  } else {
    state.status = FormStatus.Idle;
  }
};

export const validate = produce(validateRecipe);

export const validationErrors = produce(validationErrorsRecipe);
