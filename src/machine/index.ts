/**
 * Machine viz: https://xstate.js.org/viz/?gist=bfb54bad468a9969006df3e08d0ce7ba
 */
import { createMachine } from "@xstate/fsm";
import { setFieldTouched } from "./actions/setFieldTouched";
import { setValues } from "./actions/setValues";
import { setValidationErrors } from "./actions/setValidationErrors";
import { setSubmissionError } from "./actions/setSubmissionError";
import { clearSubmissionError } from "./actions/clearSubmissionError";
import { clearValidationErrors } from "./actions/clearValidationErrors";
import { resetValues } from "./actions/resetValues";
import { MachineContext, MachineEvent } from "./types";

export function createFormMachine<Values, SubmissionResult>(
  initialContext: MachineContext<Values, SubmissionResult>
) {
  return createMachine<
    MachineContext<Values, SubmissionResult>,
    MachineEvent<Values, SubmissionResult>
  >(
    {
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
              target: "invalid",
              actions: ["setValidationErrors"],
            },
            RESET: {
              target: "validate",
              actions: ["resetValues"],
            },
            FIELD_TOUCHED: {
              actions: ["setFieldTouched"],
            },
            DISMISS_VALIDATION_ERROR: {
              actions: ["clearValidationErrors"],
            },
            DISMISS_SUBMISSION_ERROR: {
              actions: ["clearSubmissionError"],
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
            DISMISS_SUBMISSION_ERROR: {
              actions: ["clearSubmissionError"],
            },
          },
        },
        invalid: {
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
            DISMISS_VALIDATION_ERROR: {
              actions: ["clearValidationErrors"],
            },
            DISMISS_SUBMISSION_ERROR: {
              actions: ["clearSubmissionError"],
            },
          },
        },
        submit: {
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
            DISMISS_SUBMISSION_ERROR: {
              actions: ["clearSubmissionError"],
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
            DISMISS_SUBMISSION_ERROR: {
              actions: ["clearSubmissionError"],
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
            DISMISS_SUBMISSION_ERROR: {
              actions: ["clearSubmissionError"],
            },
          },
        },
      },
    },
    {
      actions: {
        setValues,
        setFieldTouched,
        setValidationErrors,
        clearValidationErrors,
        resetValues,
        setSubmissionError,
        clearSubmissionError,
      },
    }
  );
}
