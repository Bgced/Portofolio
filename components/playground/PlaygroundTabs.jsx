"use client";

import { useCallback, useRef, useState } from "react";
import { Bot, Calculator, HeartPulse, QrCode } from "lucide-react";
import CyberCalc from "@/components/playground/CyberCalc";
import BmiCalc from "@/components/playground/BmiCalc";
import CekaelAI from "@/components/playground/CekaelAI";
import QrStudio from "@/components/playground/QrStudio";
import { useLang } from "@/components/providers";

const TABS = [
  { id: "qr", labelKey: "playground.qr", code: "01", icon: QrCode, panel: "qr_panel", hint: "zero-database", Component: QrStudio },
  { id: "ai", labelKey: "playground.ai", code: "02", icon: Bot, panel: "ai_panel", hint: "local-hybrid", Component: CekaelAI },
  { id: "calc", labelKey: "playground.calc", code: "03", icon: Calculator, panel: "calc_panel", hint: "keyboard ready", Component: CyberCalc },
  { id: "bmi", labelKey: "playground.bmi", code: "04", icon: HeartPulse, panel: "bmi_panel", hint: "body scan", Component: BmiCalc },
];

export default function PlaygroundTabs() {
  const [activeId, setActiveId] = useState(TABS[0].id);
  const tabRefs = useRef({});
  const { t } = useLang();

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
      <div
        role="tablist"
        aria-label={t("playground.tablist")}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
        className="no-scrollbar -mx-1 flex flex-wrap gap-1 border-b border-line-soft px-1"
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
              className={`group relative shrink-0 rounded-t-lg px-3 py-3 font-mono text-[0.68rem] tracking-wide transition-colors sm:px-4 sm:text-[0.72rem] ${
                isActive ? "text-accent" : "text-muted hover:text-ink"
              }`}
            >
              <span className="flex items-center gap-2 whitespace-nowrap">
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-accent" : "text-muted"}`} aria-hidden="true" />
                <span className="uppercase">{t(tab.labelKey)}</span>
                <span className={`text-[0.58rem] ${isActive ? "text-accent/60" : "text-muted/50"}`}>{tab.code}</span>
              </span>
              <span
                aria-hidden="true"
                className={`absolute inset-x-2 -bottom-px h-[2px] rounded-full transition-all duration-300 ${
                  isActive ? "bg-accent opacity-100 shadow-[0_0_12px_var(--glow)]" : "bg-transparent opacity-0"
                }`}
              />
            </button>
          );
        })}
      </div>

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

      {/* semua panel tetap mounted biar state nggak ilang */}
      <div className="rounded-b-xl border border-line-soft bg-canvas/40 p-3 sm:p-4">
        {TABS.map((tab) => {
          const Panel = tab.Component;
          return (
            <div
              key={tab.id}
              role="tabpanel"
              id={tab.panel}
              aria-labelledby={`tab-${tab.id}`}
              hidden={activeId !== tab.id}
              tabIndex={0}
              className="focus-visible:outline-none"
            >
              <Panel active={activeId === tab.id} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
