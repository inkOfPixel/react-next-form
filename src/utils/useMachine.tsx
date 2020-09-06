import React from "react";
import { StateMachine, EventObject, Typestate, interpret } from "@xstate/fsm";

export function useMachine<
  Context extends object = any,
  Event extends EventObject = any,
  State extends Typestate<Context> = any
>(
  machine:
    | StateMachine.Machine<Context, Event, State>
    | (() => StateMachine.Machine<Context, Event, State>)
): [
  StateMachine.State<Context, Event, State>,
  (event: Event | Event["type"]) => void,
  StateMachine.Service<Context, Event, State>
] {
  const serviceRef = React.useRef<
    StateMachine.Service<Context, Event, State>
  >();
  const [state, setState] = React.useState(() => {
    const _machine = typeof machine === "function" ? machine() : machine;
    serviceRef.current = interpret(_machine);
    return serviceRef.current.state;
  });

  React.useEffect(() => {
    serviceRef.current!.subscribe((state) => {
      setState(state);
    });
    serviceRef.current!.start();
    return () => {
      serviceRef.current!.stop();
    };
  }, [machine]);

  return [state, serviceRef.current!.send, serviceRef.current!];
}
