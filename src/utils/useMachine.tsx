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
    | (() => StateMachine.Machine<Context, Event, State>),
  dependencies: DependencyList
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
  }, dependencies);

  const isMounted = useIsMounted();
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
    if (isMounted) {
      serviceRef.current = interpret(cachedMachine);
      serviceRef.current!.start();
      serviceRef.current.send(EventType.Transient);
      setState(serviceRef.current.state);
    }
    serviceRef.current!.subscribe((state) => {
      setState(state);
    });
    return () => {
      if (process.env.NODE_ENV !== "production") {
        console.log("machine stopped!");
      }
      serviceRef.current!.stop();
    };
  }, [cachedMachine]);

  return [state, serviceRef.current!.send, serviceRef.current!];
}

function useIsMounted() {
  const isMountedRef = React.useRef(false);
  React.useEffect(() => {
    isMountedRef.current = true;
  }, []);
  return isMountedRef.current;
}
