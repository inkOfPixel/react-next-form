import React, { DependencyList } from "react";
import { StateMachine, EventObject, Typestate, interpret } from "@xstate/fsm";
import { EventType } from "../machine/types";
import { useMemoize } from "./useMemoize";

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
  const cachedMachine = useMemoize(() => {
    if (typeof machine === "function") {
      return machine();
    }
    return machine;
  }, []);

  const serviceRef = React.useRef<
    StateMachine.Service<Context, Event, State>
  >();
  const [state, setState] = React.useState(() => {
    serviceRef.current = interpret(cachedMachine);
    serviceRef.current!.start();
    serviceRef.current.send(EventType.Transient);
    return serviceRef.current.state;
  });

  React.useEffect(() => {
    serviceRef.current!.subscribe((state) => {
      setState(state);
    });
    return () => {
      if (process.env.NODE_ENV !== "production") {
        console.log("machine stopped!");
      }
      serviceRef.current!.stop();
    };
  }, []);

  return [state, serviceRef.current!.send, serviceRef.current!];
}
