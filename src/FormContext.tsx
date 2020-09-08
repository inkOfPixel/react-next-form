import React from "react";
import { FormContext } from "./types";

const RawFormContext = React.createContext<FormContext<any, any> | null>(null);

export interface FormProviderProps<Values, SubmissionResult> {
  form: FormContext<Values, SubmissionResult>;
}

export function FormProvider<Values = any, SubmissionResult = any>({
  children,
  form,
}: React.PropsWithChildren<FormProviderProps<Values, SubmissionResult>>) {
  return (
    <RawFormContext.Provider value={form}>{children}</RawFormContext.Provider>
  );
}

export function useFormContext<Values = any, SubmissionResult = any>() {
  const context = React.useContext<FormContext<
    Values,
    SubmissionResult
  > | null>(RawFormContext);
  if (context == null) {
    throw new Error("Can't use useFormContext without a FormProvider");
  }
  return context;
}
