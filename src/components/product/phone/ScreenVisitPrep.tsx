/**
 * Phone screen 2: visit prep. Reason for the visit, recent symptoms, current
 * medications, two relevant trends and questions to ask, gathered before the
 * appointment. Trend values outside the person's own usual range use the amber
 * data state (never an alarm colour). Example data: PHONE_VISIT_PREP.
 */
import { ChatCircleTextIcon, PillIcon, PulseIcon } from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";
import { PHONE_VISIT_PREP as V } from "@/lib/example-data";
import { AppNavBar, ScreenLabel } from "./screen-kit";

function Group({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-5", className)}>
      <ScreenLabel>{label}</ScreenLabel>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function ScreenVisitPrep() {
  return (
    <div className="flex h-full flex-col pt-[46px]">
      <AppNavBar title="Visit prep" />

      <div className="mx-3 mt-1.5 rounded-[20px] border border-hairline-ink/60 bg-ink-2 p-4">
        <p className="font-mono text-[10px] leading-none tracking-[0.14em] text-glacier uppercase">{V.when}</p>
        <p className="mt-2 text-[17px] leading-tight font-medium tracking-[-0.015em] text-ice">{V.doctor}</p>
        <p className="mt-0.5 text-[12.5px] text-ice-60">{V.specialty}</p>
        <p className="mt-3 border-t border-hairline-ink pt-2.5 text-[12.5px] text-ice-60">
          Reason <span className="ml-1 text-ice">{V.reason}</span>
        </p>
      </div>

      <Group label="Recent symptoms" className="mt-4">
        <ul className="flex flex-col gap-1.5">
          {V.symptoms.map((s) => (
            <li key={s} className="flex items-start gap-2 text-[13px] leading-snug text-ice">
              <PulseIcon size={14} weight="regular" className="mt-[3px] shrink-0 text-ice-60" aria-hidden />
              {s}
            </li>
          ))}
        </ul>
      </Group>

      <Group label="Current medications" className="mt-4">
        <ul className="flex flex-col gap-1.5">
          {V.medications.map((m) => (
            <li key={m} className="flex items-start gap-2 text-[13px] leading-snug text-ice">
              <PillIcon size={14} weight="regular" className="mt-[3px] shrink-0 text-ice-60" aria-hidden />
              {m}
            </li>
          ))}
        </ul>
      </Group>

      <Group label="Trends" className="mt-4">
        <ul className="grid grid-cols-2 gap-2">
          {V.trends.map((t) => (
            <li key={t.name} className="rounded-[16px] border border-hairline-ink/60 bg-ink-2 px-3 py-2.5">
              <p className="text-[11.5px] text-ice-60">{t.name}</p>
              <p className="mt-1 flex items-baseline gap-1">
                <span
                  className={cn(
                    "font-mono text-[19px] leading-none font-medium tracking-[-0.02em]",
                    t.outside ? "text-amber-ink" : "text-ice",
                  )}
                >
                  {t.value}
                </span>
                <span className="font-mono text-[10px] text-ice-60">{t.unit}</span>
              </p>
              <p className="mt-1.5 text-[11px] leading-snug text-ice-60">{t.note}</p>
            </li>
          ))}
        </ul>
      </Group>

      <Group label="Questions to ask" className="mt-4">
        <ul className="flex flex-col gap-1.5">
          {V.questions.map((q) => (
            <li key={q} className="flex items-start gap-2 text-[13px] leading-snug text-ice">
              <ChatCircleTextIcon size={14} weight="regular" className="mt-[3px] shrink-0 text-glacier" aria-hidden />
              {q}
            </li>
          ))}
        </ul>
      </Group>
    </div>
  );
}
