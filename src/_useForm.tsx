import React from "react";
import { enablePatches } from "immer";
import { FormContext, FormOptions } from "./types";
import { createFormMachine } from "./machine";
import { interpret } from "@xstate/fsm";

enablePatches();

export function useForm<V extends Record<string, any> = any>(
  options: FormOptions<V>
): FormContext<V> {
  React.useEffect(() => {
    const formMachine = createFormMachine({
      initialValues: options.initialValues,
      values: options.initialValues,
      validationErrors: {},
      submission: {
        result: undefined,
        error: undefined,
        count: 0,
      },
      patches: [],
      inversePatches: [],
      dirtyFields: {},
      touchedFields: {},
    });
    const service = interpret(formMachine).start();
  }, []);
  const form: any = {};
  return form;
}
