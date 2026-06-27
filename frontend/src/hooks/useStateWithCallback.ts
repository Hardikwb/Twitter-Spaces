import { useCallback, useEffect, useRef, useState } from "react";
import type { Speaker } from "../types/type";

// export const useStateWithCallback=(initialState:Speaker[])=>{
export const useStateWithCallback = (initialState: Speaker[]) => {
  const [state, setState] = useState<Speaker[]>(initialState);

  const cbRef = useRef<CallableFunction | null>(null);

  const updateState = useCallback(
    (
      newState: Speaker[] | ((prev: Speaker[]) => Speaker[]),
      cb: CallableFunction,
    ) => {
      cbRef.current = cb;
      setState((prev) => {
        return typeof newState === "function" ? newState(prev) : newState;
      });
    },
    [],
  );

  useEffect(() => {
    if (cbRef.current) {
      cbRef.current(state);
      cbRef.current = null;
    }
  }, [state]);

  // return [state,updateState]
  return [state, updateState] as const;
};
