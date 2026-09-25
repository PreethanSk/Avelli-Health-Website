/**
 * Phone screen 3: the doctor summary. Conditions, medications, allergies and
 * recent tests on one page, with a time-limited share. The share button is part
 * of the picture (not a control on this page). Example data: PHONE_DOCTOR_SUMMARY.
 */
import { ShareNetworkIcon } from "@phosphor-icons/react/ssr";
import { PHONE_DOCTOR_SUMMARY as D } from "@/lib/example-data";
import { AppNavBar, ScreenLabel } from "./screen-kit";

function Row({ label, items }: { label: string; items: readonly string[] }) {
  return (
    <div className="grid grid-cols-[88px_1fr] gap-3 py-2.5">
      <ScreenLabel className="pt-[3px]">{label}</ScreenLabel>
      <ul className="flex flex-col gap-1">
        {items.map((it) => (
          <li key={it} className="text-[13px] leading-snug text-ice">
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ScreenDoctorSummary() {
  return (
    <div className="flex h-full flex-col pt-[46px]">
      <AppNavBar title="Doctor summary" />

      <div className="px-5 pt-3">
        <p className="text-[22px] leading-tight font-medium tracking-[-0.025em] text-ice">{D.name}</p>
        <p className="mt-1.5 font-mono text-[10px] leading-none tracking-[0.14em] text-ice-60 uppercase">
          {D.age} yrs <span className="px-1">/</span> Prepared {D.prepared}
        </p>
      </div>

      <div className="mx-3 mt-4 divide-y divide-hairline-ink rounded-[20px] border border-hairline-ink/60 bg-ink-2 px-3.5 py-1">
        <Row label="Conditions" items={D.conditions} />
        <Row label="Medications" items={D.medications} />
        <Row label="Allergies" items={D.allergies} />
      </div>

      <div className="mt-4 px-5">
        <ScreenLabel>Recent tests</ScreenLabel>
        <ul className="mt-2.5 flex flex-col gap-2">
          {D.recentTests.map((t) => (
            <li key={t.name} className="flex items-baseline justify-between gap-3">
              <span className="text-[13px] text-ice">{t.name}</span>
              <span className="flex items-baseline gap-2.5 font-mono tabular-nums">
                <span className="text-[12.5px] text-ice">{t.value}</span>
                <span className="w-[74px] text-right text-[10.5px] text-ice-60">{t.date}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto px-4 pb-8">
        <span
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-glacier text-[15px] font-medium text-ink"
        >
          <ShareNetworkIcon size={17} weight="regular" aria-hidden />
          {D.shareFor}
        </span>
        <p className="mt-2.5 text-center text-[11px] text-ice-60">You review everything before it leaves.</p>
      </div>
    </div>
  );
}
