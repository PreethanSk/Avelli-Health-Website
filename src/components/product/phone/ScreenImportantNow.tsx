/**
 * Phone screen 1: "What's important now". Three things that need the person
 * this week, and nothing else: a follow-up due, a new report connected (with
 * the living mark playing accrue then added), a claim document missing.
 * Example data: PHONE_IMPORTANT_NOW, PHONE_META (src/lib/example-data.ts).
 */
import { CalendarCheckIcon, CaretRightIcon, FileDashedIcon } from "@phosphor-icons/react/ssr";
import { Lockup } from "@/components/brand/Lockup";
import { PHONE_IMPORTANT_NOW, PHONE_META } from "@/lib/example-data";
import { ReportMark } from "./ReportMark";
import { ScreenLabel, TabBar } from "./screen-kit";

type Item = (typeof PHONE_IMPORTANT_NOW)[number];

function RowIcon({ kind }: { kind: Item["kind"] }) {
  return (
    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-hairline-ink bg-ink text-ice">
      {kind === "report" ? (
        <ReportMark size={24} />
      ) : kind === "followup" ? (
        <CalendarCheckIcon size={19} weight="regular" aria-hidden />
      ) : (
        <FileDashedIcon size={19} weight="regular" aria-hidden />
      )}
    </span>
  );
}

export function ScreenImportantNow() {
  return (
    <div className="flex h-full flex-col pt-[50px]">
      <div className="px-5">
        <div className="flex h-9 items-center justify-between">
          <Lockup ground="ink" fontSize={15} />
          <span
            aria-hidden
            className="grid size-8 place-items-center rounded-full border border-hairline-ink bg-ink-2 font-mono text-[10.5px] tracking-[0.04em] text-ice-60"
          >
            {PHONE_META.initials}
          </span>
        </div>
        <ScreenLabel className="mt-5">{PHONE_META.today}</ScreenLabel>
        <h3 className="mt-2 text-[25px] leading-[1.08] font-medium tracking-[-0.03em] text-ice">
          What&rsquo;s important now
        </h3>
        <p className="mt-1.5 text-[13px] leading-snug text-ice-60">
          {PHONE_IMPORTANT_NOW.length} things this week. Nothing else.
        </p>
      </div>

      <ul className="mt-4 flex flex-col gap-2 px-3">
        {PHONE_IMPORTANT_NOW.map((item) => (
          <li key={item.kind} className="rounded-[20px] border border-hairline-ink/60 bg-ink-2 p-3.5">
            <div className="flex gap-3">
              <RowIcon kind={item.kind} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 font-mono text-[9.5px] leading-none tracking-[0.14em] uppercase">
                  <span className="text-ice-60">{item.category}</span>
                  <span className={item.kind === "report" ? "text-glacier" : "text-ice-60"}>{item.when}</span>
                </div>
                <p className="mt-1.5 text-[14px] leading-tight font-medium text-ice">{item.title}</p>
                <p className="mt-1 text-[12px] leading-snug text-ice-60">{item.detail}</p>
                {"action" in item && (
                  <span
                    className="mt-2.5 inline-flex h-7 items-center gap-1 rounded-full border border-hairline-ink px-3 text-[11.5px] font-medium text-glacier"
                  >
                    {item.action}
                    <CaretRightIcon size={11} weight="regular" aria-hidden />
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <TabBar active="today" />
    </div>
  );
}
