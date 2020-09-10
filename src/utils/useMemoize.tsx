import React, { DependencyList } from "react";

export function useMemoize<Value>(
  fn: () => Value,
  dependencies: DependencyList
) {
  const valueRef = React.useRef<Value>(fn());
  const depsRef = React.useRef(dependencies);

  function getValue() {
    if (depsRef.current.some((dep, index) => dependencies[index] !== dep)) {
      depsRef.current = dependencies;
      valueRef.current = fn();
    }
    return valueRef.current;
  }

  return getValue();
}
