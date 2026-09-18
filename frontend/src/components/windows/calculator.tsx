"use client";
import { useCallback, useEffect, useState } from "react";
import { Delete } from "lucide-react";
import { WindowShell } from "@/components/os/window-shell";
import { WindowControls } from "@/components/os/window-controls";
import { safeEval } from "@/lib/calc";

const BASIC = ["C", "(", ")", "⌫", "7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"];
const SCI = ["sqrt(", "sin(", "cos(", "tan(", "log(", "ln(", "^", "π"];

export function CalculatorWindow() {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState("");
  const press = useCallback((k: string) => {
    if (k === "C") {
      setExpr("");
      setResult("");
    } else if (k === "⌫") {
      setExpr((e) => e.slice(0, -1));
    } else if (k === "=") {
      setResult(safeEval(expr));
    } else {
      setExpr((e) => (e + k).slice(0, 60));
    }
  }, [expr]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!useWindowStore.getState().windows.calc.isOpen) return;
      if (/^[0-9+\-*/.()^%!]$/.test(e.key)) press(e.key);
      else if (e.key === "Enter") press("=");
      else if (e.key === "Backspace") press("⌫");
      else if (e.key.toLowerCase() === "c" && !e.metaKey && !e.ctrlKey) press("C");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  return (
    <WindowShell win="calc" title="Calculator">
      <div data-drag-handle className="glass-titlebar flex h-12 cursor-grab items-center gap-3 px-4 active:cursor-grabbing">
        <WindowControls target="calc" />
        <h2 className="text-sm font-semibold">Calculator</h2>
      </div>
      <div className="flex h-[calc(100%-3rem)] flex-col bg-black/90 p-4">
        <div className="rounded-xl bg-white/5 p-4 text-right">
          <p className="min-h-6 truncate font-mono text-sm text-white/50">{expr || "0"}</p>
          <p className="truncate font-mono text-3xl font-semibold text-white" aria-live="polite">{result || "0"}</p>
        </div>
        <div className="mt-2 grid grid-cols-4 gap-1.5">
          {SCI.map((k) => (
            <button key={k} onClick={() => press(k)} className="min-h-[40px] rounded-lg bg-white/5 font-mono text-xs text-amber-300 hover:bg-white/10 active:scale-95">{k}</button>
          ))}
        </div>
        <div className="mt-1.5 grid flex-1 grid-cols-4 gap-1.5">
          {BASIC.map((k) => (
            <button
              key={k}
              onClick={() => press(k)}
              aria-label={k === "⌫" ? "Backspace" : `Key ${k}`}
              className={`min-h-[44px] rounded-xl font-mono text-lg active:scale-95 ${k === "=" ? "bg-amber-500 font-bold text-black hover:bg-amber-400" : "bg-white/10 text-white hover:bg-white/15"}`}
            >
              {k === "⌫" ? <Delete className="mx-auto size-5" aria-hidden="true" /> : k}
            </button>
          ))}
        </div>
      </div>
    </WindowShell>
  );
}

// Read open state without subscribing during key handling setup.
import { useWindowStore } from "@/stores/window-store";
