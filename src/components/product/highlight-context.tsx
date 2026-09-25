"use client";

/**
 * One shared "which data point is highlighted" id for the bento's charts
 * (docs/website/03-site-structure.md part 7: "a shared hover id through
 * context"). Source chips, chart pointers and keyboard focus all write it;
 * every chart reads it and highlights only its own points, so a Vitamin D
 * chart never lights up for an LDL source.
 *
 * `hoverId` follows the pointer and focus. `pinnedId` is set by a click or
 * tap (touch screens have no hover) and holds until clicked again.
 */
import { createContext, useCallback, useContext, useMemo, useState } from "react";

type HighlightState = {
  activeId: string | null;
  pinnedId: string | null;
  setHover: (id: string | null) => void;
  togglePin: (id: string) => void;
};

const Ctx = createContext<HighlightState>({
  activeId: null,
  pinnedId: null,
  setHover: () => {},
  togglePin: () => {},
});

export function HighlightProvider({ children }: { children: React.ReactNode }) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const setHover = useCallback((id: string | null) => setHoverId(id), []);
  const togglePin = useCallback((id: string) => setPinnedId((p) => (p === id ? null : id)), []);
  const value = useMemo(
    () => ({ activeId: hoverId ?? pinnedId, pinnedId, setHover, togglePin }),
    [hoverId, pinnedId, setHover, togglePin],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useHighlight = () => useContext(Ctx);
