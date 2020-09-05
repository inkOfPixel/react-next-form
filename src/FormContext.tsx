import React from "react";
import { FormContext } from "./types";

const FormContext = React.createContext<FormContext<any> | null>(null);

export interface FormProviderProps<V> {
  form: FormContext<V>;
}

export function FormProvider<V>({
  children,
  form,
}: React.PropsWithChildren<FormProviderProps<V>>) {
  return <FormContext.Provider value={form}>{children}</FormContext.Provider>;
}

export function useFormContext<V>() {
  const context = React.useContext<FormContext<V> | null>(FormContext);
  if (context == null) {
    throw new Error("Can't use useFormContext without a FormProvider");
  }
  return context;
}
