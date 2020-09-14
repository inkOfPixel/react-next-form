/**
 * Machine viz: https://xstate.js.org/viz/?gist=83a6bda5f9955e31b7db1d22d4871e71
 */
import { createMachine } from "@xstate/fsm";
import { setFieldTouched } from "./actions/setFieldTouched";
import { setValues } from "./actions/setValues";
import { setValidationErrors } from "./actions/setValidationErrors";
import { setSubmissionError } from "./actions/setSubmissionError";
import { clearSubmissionError } from "./actions/clearSubmissionError";
import { clearValidationErrors } from "./actions/clearValidationErrors";
import { incrementSubmissionCount } from "./actions/incrementSubmissionCount";
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
      initial: "init",
      context: initialContext,
      states: {
        init: {
          on: {
            "": [
              {
                target: "validate",
                cond: shouldValidate,
              },
              {
                target: "valid",
              },
            ],
          },
        },
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
            CHANGE: {
              target: "pendingValidation",
              actions: ["setValues"],
            },
            RESET: {
              target: "pendingValidation",
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
        pendingValidation: {
          on: {
            VALIDATE: {
              target: "validate",
            },
            CHANGE: {
              actions: ["setValues"],
            },
            RESET: {
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
            CHANGE: [
              {
                target: "pendingValidation",
                cond: shouldValidate,
                actions: ["setValues"],
              },
              {
                actions: ["setValues"],
              },
            ],
            SUBMIT: {
              target: "submit",
              actions: ["incrementSubmissionCount"],
            },
            RESET: [
              {
                target: "pendingValidation",
                cond: shouldValidate,
                actions: ["resetValues"],
              },
              {
                actions: ["resetValues"],
              },
            ],
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
              target: "pendingValidation",
              actions: ["setValues"],
            },
            RESET: {
              target: "pendingValidation",
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
              actions: ["incrementSubmissionCount"],
            },
            CHANGE: [
              {
                target: "pendingValidation",
                cond: shouldValidate,
                actions: ["setValues"],
              },
              {
                target: "valid",
                actions: ["setValues"],
              },
            ],
            RESET: [
              {
                target: "pendingValidation",
                cond: shouldValidate,
                actions: ["resetValues"],
              },
              {
                target: "valid",
                actions: ["resetValues"],
              },
            ],
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
            CHANGE: [
              {
                target: "pendingValidation",
                cond: shouldValidate,
                actions: ["setValues"],
              },
              {
                target: "valid",
                actions: ["setValues"],
              },
            ],
            RESET: [
              {
                target: "pendingValidation",
                cond: shouldValidate,
                actions: ["resetValues"],
              },
              {
                target: "valid",
                actions: ["resetValues"],
              },
            ],
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
        incrementSubmissionCount,
      },
    }
  );
}

const shouldValidate = <Values, SubmissionResult>(
  context: MachineContext<Values, SubmissionResult>
): boolean => context.shouldValidate;
