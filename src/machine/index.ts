import { createMachine } from "@xstate/fsm";
import { MachineContext, MachineEvent } from "./types";

export function createFormMachine<Values, SubmissionResult>(
  initialContext: MachineContext<Values, SubmissionResult>
) {
  return createMachine<
    MachineContext<Values, SubmissionResult>,
    MachineEvent<Values, SubmissionResult>
  >({
    id: "form",
    initial: "validate",
    context: initialContext,
    states: {
      validate: {
        on: {
          VALIDATION_SUCCESS: {
            target: "valid",
            actions: ["clearValidationErrors"],
          },
          VALIDATION_ERROR: {
            target: "notValid",
            actions: ["setValidationErrors"],
          },
          RESET: {
            target: "validate",
            actions: ["resetValues"],
          },
          FIELD_TOUCHED: {
            actions: ["setFieldTouched"],
          },
        },
      },
      valid: {
        on: {
          CHANGE: {
            target: "validate",
            actions: ["setValues"],
          },
          SUBMIT: {
            target: "submit",
          },
          RESET: {
            target: "validate",
            actions: ["resetValues"],
          },
          FIELD_TOUCHED: {
            actions: ["setFieldTouched"],
          },
        },
      },
      notValid: {
        on: {
          CHANGE: {
            target: "validate",
            actions: ["setValues"],
          },
          RESET: {
            target: "validate",
            actions: ["resetValues"],
          },
          FIELD_TOUCHED: {
            actions: ["setFieldTouched"],
          },
        },
      },
      submit: {
        entry: ["incrementSubmitCount"],
        on: {
          SUBMISSION_SUCCESS: {
            target: "submitted",
            actions: ["resetValues"],
          },
          SUBMISSION_ERROR: {
            target: "submissionError",
            actions: ["setSubmissionError"],
          },
          FIELD_TOUCHED: {
            actions: ["setFieldTouched"],
          },
        },
      },
      submissionError: {
        on: {
          SUBMIT: {
            target: "submit",
          },
          CHANGE: {
            target: "validate",
            actions: ["setValues"],
          },
          RESET: {
            target: "validate",
            actions: ["resetValues"],
          },
          FIELD_TOUCHED: {
            actions: ["setFieldTouched"],
          },
        },
      },
      submitted: {
        on: {
          SUBMIT: {
            target: "submit",
          },
          CHANGE: {
            target: "validate",
            actions: ["setValues"],
          },
          RESET: {
            target: "validate",
            actions: ["resetValues"],
          },
          FIELD_TOUCHED: {
            actions: ["setFieldTouched"],
          },
        },
      },
    },
  });
}
