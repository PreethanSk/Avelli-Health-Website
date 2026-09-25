"use client";

/**
 * The purpose picker (part 11): pick who you're sharing with, see exactly
 * which parts of your record would go, then press and hold to approve.
 * It demonstrates "you review before anything leaves".
 *
 * Built from: FluidTabs (Watermelon `fluid-tabs`, sliding pill, SPRING.ui) and
 * HoldButton (React Bits Hold Button, 1200ms hold, glacier scaleX fill); see
 * their headers for sources and licences. Motion owns every animation here.
 *
 * Items: lit = opacity 1, scale 1, 1px glacier border, "Shared"; dimmed =
 * surface at opacity 0.35, scale 0.98, "Not shared" (state in text, not colour
 * alone). The item name dims less (0.55) and the state label never dims, so
 * all text stays readable (AA). Changes use SPRING.ui; the glacier border is its
 * own layer so only opacity animates. The summary is announced (aria-live).
 * Reduced motion: lit and dimmed without scale; the tab pill jumps.
 */
import { motion } from "motion/react";
import { useRef, useState } from "react";
import {
  AddressBookIcon,
  ArrowCounterClockwiseIcon,
  BedIcon,
  ChartLineIcon,
  CheckIcon,
  ClockCountdownIcon,
  EyeSlashIcon,
  FileTextIcon,
  ListChecksIcon,
  NotebookIcon,
  PillIcon,
  ProhibitIcon,
  StethoscopeIcon,
  type Icon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/cn";
import { DUR_S, EASE, SPRING } from "@/lib/tokens";
import { RECIPIENTS, RECORD_ITEMS, type RecordItem } from "@/lib/example-data";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";
import { ExampleTag } from "@/components/ui/ExampleTag";
import { FluidTabs, fluidTabId } from "@/components/ui/FluidTabs";
import { HoldButton, type HoldButtonHandle } from "@/components/ui/HoldButton";

const ID = "protect";
const PANEL_ID = `${ID}-panel`;

const ITEM_ICON: Record<RecordItem, Icon> = {
  Conditions: StethoscopeIcon,
  Medications: PillIcon,
  Allergies: ProhibitIcon,
  "Lab trends": ChartLineIcon,
  "Hospital stay 2024": BedIcon,
  "Mental health notes": NotebookIcon,
  "Policy documents": FileTextIcon,
  "Emergency contacts": AddressBookIcon,
};

export function PurposePicker() {
  const reduce = useReducedMotionSafe();
  const [recipientId, setRecipientId] = useState(RECIPIENTS[0].id);
  const [approved, setApproved] = useState(false);
  const hold = useRef<HoldButtonHandle>(null);
  const recipient = RECIPIENTS.find((r) => r.id === recipientId) ?? RECIPIENTS[0];
  const shared = new Set<RecordItem>(recipient.shares);

  const choose = (id: string) => {
    if (id === recipientId) return;
    setRecipientId(id);
    // An approval covers one selection; a new recipient needs a new approval.
    if (approved) {
      setApproved(false);
      hold.current?.reset({ focus: false });
    }
  };

  return (
    <div className="on-ink">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <FluidTabs
          tabs={RECIPIENTS.map(({ id, label }) => ({ id, label }))}
          value={recipientId}
          onChange={choose}
          idPrefix={ID}
          panelId={PANEL_ID}
          label="Who you are sharing with"
          ground="ink"
        />
        <div aria-live="polite" aria-atomic="true" className="md:text-right">
          <p className="text-[17px] font-medium text-ice">
            <span className="font-mono tabular-nums">{shared.size}</span> of {RECORD_ITEMS.length} items shared with{" "}
            {recipient.label}
          </p>
          <p className="mt-1 text-small text-ice-60">{recipient.note}</p>
        </div>
      </div>

      <div
        role="tabpanel"
        id={PANEL_ID}
        aria-labelledby={fluidTabId(ID, recipient.id)}
        tabIndex={0}
        className="mt-8 rounded-card md:mt-10"
      >
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {RECORD_ITEMS.map((item) => (
            <RecordCard key={item} item={item} lit={shared.has(item)} reduce={reduce} />
          ))}
        </ul>
      </div>

      <ShareBar
        holdRef={hold}
        recipientLabel={recipient.label}
        approved={approved}
        onApprove={() => setApproved(true)}
        onReset={() => {
          setApproved(false);
          hold.current?.reset({ focus: true });
        }}
      />
    </div>
  );
}

function RecordCard({ item, lit, reduce }: { item: RecordItem; lit: boolean; reduce: boolean }) {
  const ItemIcon = ITEM_ICON[item];
  return (
    <motion.li
      initial={false}
      animate={{ scale: lit || reduce ? 1 : 0.98 }}
      transition={SPRING.ui}
      className="relative isolate flex min-h-[128px] flex-col justify-between p-4 md:min-h-[148px] md:p-5"
    >
      {/* Surface: ink-2 card, dims to 0.35 */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ opacity: lit ? 1 : 0.35 }}
        transition={SPRING.ui}
        className="absolute inset-0 -z-10 rounded-card border border-hairline-ink bg-ink-2"
      />
      {/* The 1px glacier border of a shared item */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ opacity: lit ? 1 : 0 }}
        transition={{ duration: DUR_S.ui, ease: EASE.out }}
        className="absolute inset-0 -z-10 rounded-card border border-glacier"
      />
      <div className="flex items-start justify-between gap-2">
        <motion.span initial={false} animate={{ opacity: lit ? 1 : 0.35 }} transition={SPRING.ui}>
          <ItemIcon size={22} weight="regular" aria-hidden className={lit ? "text-glacier" : "text-ice-60"} />
        </motion.span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 font-mono text-[10.5px] leading-none tracking-[0.14em] uppercase",
            lit ? "text-glacier" : "text-ice-60",
          )}
        >
          {lit ? <CheckIcon size={12} weight="regular" aria-hidden /> : <EyeSlashIcon size={12} weight="regular" aria-hidden />}
          {lit ? "Shared" : "Not shared"}
        </span>
      </div>
      <motion.p
        initial={false}
        animate={{ opacity: lit ? 1 : 0.55 }}
        transition={SPRING.ui}
        className="text-[15px] leading-snug font-medium tracking-[-0.01em] text-ice md:text-[16px]"
      >
        {item}
      </motion.p>
    </motion.li>
  );
}

function ShareBar({
  holdRef,
  recipientLabel,
  approved,
  onApprove,
  onReset,
}: {
  holdRef: React.RefObject<HoldButtonHandle | null>;
  recipientLabel: string;
  approved: boolean;
  onApprove: () => void;
  onReset: () => void;
}) {
  const terms = [
    { label: "Share for 7 days", Icon: ClockCountdownIcon },
    { label: "Revocable", Icon: ArrowCounterClockwiseIcon },
    { label: "Logged", Icon: ListChecksIcon },
  ];
  return (
    <div className="mt-6 md:mt-8">
      <div className="flex flex-col gap-5 rounded-card border border-hairline-ink bg-ink-2 p-5 md:flex-row md:items-center md:justify-between md:rounded-full md:py-3 md:pr-3 md:pl-7">
        <ul className="flex flex-wrap items-center gap-x-7 gap-y-2" aria-label={`Terms for sharing with ${recipientLabel}`}>
          {terms.map(({ label, Icon: TermIcon }, i) => (
            <li
              key={label}
              className={cn("inline-flex items-center gap-2 text-[15px]", i === 0 ? "text-ice" : "text-ice-60")}
            >
              <TermIcon size={17} weight="regular" aria-hidden className={i === 0 ? "text-glacier" : undefined} />
              {label}
            </li>
          ))}
        </ul>
        <HoldButton
          ref={holdRef}
          holdTime={1200}
          hint={`Press and hold for 1.2 seconds to approve sharing with ${recipientLabel}`}
          onHold={onApprove}
          doneLabel={
            <>
              <CheckIcon size={18} weight="regular" aria-hidden />
              Approved
            </>
          }
          className="w-full md:w-auto"
        >
          Approve
        </HoldButton>
      </div>

      <div className="mt-3 flex min-h-11 flex-wrap items-center gap-x-4 gap-y-1 md:pr-3">
        <ExampleTag ground="ink" className="mr-auto" />
        {!approved && <p className="text-small text-ice-60">Press and hold to approve.</p>}
        <p role="status" aria-live="polite" className={cn("text-small text-ice", !approved && "sr-only-soft")}>
          {approved ? "Approved. Shared for 7 days." : ""}
        </p>
        {approved && (
          <button
            type="button"
            onClick={onReset}
            className="link-underline -my-2 inline-flex h-11 items-center text-small text-glacier"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
