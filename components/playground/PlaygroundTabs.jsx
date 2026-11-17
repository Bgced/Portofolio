"use client";

import { useCallback, useRef, useState } from "react";
import { Bot, Calculator, HeartPulse } from "lucide-react";
import CyberCalc from "@/components/playground/CyberCalc";
import BmiCalc from "@/components/playground/BmiCalc";
import CekaelAI from "@/components/playground/CekaelAI";

const TABS = [
  { id: "calc", label: "Cyber Calc", code: "01", icon: Calculator, panel: "calc_panel", hint: "keyboard ready" },
  { id: "bmi", label: "BMI Check", code: "02", icon: HeartPulse, panel: "bmi_panel", hint: "body scan" },
  { id: "ai", label: "Cekael AI", code: "03", icon: Bot, panel: "ai_panel", hint: "local-hybrid" },
];

export default function PlaygroundTabs() {
  const [activeId, setActiveId] = useState(TABS[0].id);
  const tabRefs = useRef({});

  const focusTab = useCallback((index) => {
    const next = TABS[index];
    if (!next) return;
    setActiveId(next.id);
    tabRefs.current[next.id]?.focus();
  }, []);

  const onKeyDown = (event) => {
    const index = TABS.findIndex((tab) => tab.id === activeId);
    if (index < 0) return;

    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        focusTab((index + 1) % TABS.length);
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusTab((index - 1 + TABS.length) % TABS.length);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(TABS.length - 1);
        break;
      default:
        break;
    }
  };

  const activeTab = TABS.find((tab) => tab.id === activeId) ?? TABS[0];

  return (
    <div className="w-full">
      {/* tab bar */}
      <div
        role="tablist"
        aria-label="Mini tools playground"
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto border-b border-line-soft px-1"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeId;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              ref={(node) => {
                tabRefs.current[tab.id] = node;
              }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={tab.panel}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              className={`group relative shrink-0 rounded-t-lg px-3.5 py-3 font-mono text-[0.72rem] tracking-wide transition-colors sm:px-4 ${
                isActive ? "text-accent" : "text-muted hover:text-ink"
              }`}
            >
              <span className="flex items-center gap-2 whitespace-nowrap">
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-accent" : "text-muted"}`} aria-hidden="true" />
                <span className="uppercase">{tab.label}</span>
                <span className={`text-[0.58rem] ${isActive ? "text-accent/60" : "text-muted/50"}`}>{tab.code}</span>
              </span>
              <span
                aria-hidden="true"
                className={`absolute inset-x-2 -bottom-px h-[2px] rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-accent opacity-100 shadow-[0_0_12px_var(--glow)]"
                    : "bg-transparent opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* terminal-ish header */}
      <div className="mt-3 flex items-center justify-between gap-3 rounded-t-xl border border-line-soft border-b-0 bg-surface-2/60 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-danger/60" aria-hidden="true" />
          <span className="h-2 w-2 rounded-full bg-[#fbbf24]/60" aria-hidden="true" />
          <span className="h-2 w-2 rounded-full bg-ok/60" aria-hidden="true" />
          <span className="mono-label ml-1.5">
            tool_{activeTab.code} // {activeTab.id}
          </span>
        </div>
        <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted sm:block">
          {activeTab.hint}
        </span>
      </div>

      {/* panels — semua tetap mounted biar state nggak ilang */}
      <div className="rounded-b-xl border border-line-soft bg-canvas/40 p-3 sm:p-4">
        <div
          role="tabpanel"
          id={TABS[0].panel}
          aria-labelledby={`tab-${TABS[0].id}`}
          hidden={activeId !== TABS[0].id}
          tabIndex={0}
          className="focus-visible:outline-none"
        >
          <CyberCalc active={activeId === "calc"} />
        </div>

        <div
          role="tabpanel"
          id={TABS[1].panel}
          aria-labelledby={`tab-${TABS[1].id}`}
          hidden={activeId !== TABS[1].id}
          tabIndex={0}
          className="focus-visible:outline-none"
        >
          <BmiCalc />
        </div>

        <div
          role="tabpanel"
          id={TABS[2].panel}
          aria-labelledby={`tab-${TABS[2].id}`}
          hidden={activeId !== TABS[2].id}
          tabIndex={0}
          className="focus-visible:outline-none"
        >
          <CekaelAI />
        </div>
      </div>
    </div>
  );
}
