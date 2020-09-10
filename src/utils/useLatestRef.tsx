import React from "react";

export function useLatestRef<Value>(value: Value) {
  const valueRef = React.useRef<Value>(value);

  React.useEffect(() => {
    valueRef.current = value;
  }, [value]);

  return valueRef;
}
