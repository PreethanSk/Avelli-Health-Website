/**
 * Small building blocks shared by the three phone screens (part 9): the
 * device status bar, the in-app navigation bar, section labels and the tab bar.
 * The phone is a picture of the app, so its chrome is not interactive: nothing
 * here is focusable, and purely visual chrome is aria-hidden.
 */
import {
  BatteryHighIcon,
  CaretLeftIcon,
  CellSignalFullIcon,
  ClockCounterClockwiseIcon,
  FolderSimpleIcon,
  HouseIcon,
  ShareNetworkIcon,
  WifiHighIcon,
} from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/cn";
import { PHONE_META } from "@/lib/example-data";

/** Device status bar. Overlays the top of every screen. */
export function StatusBar() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-[2] flex h-[46px] items-center justify-between px-7 pt-1.5"
    >
      <span className="text-[14px] font-semibold tracking-[-0.01em] tabular-nums">{PHONE_META.time}</span>
      <span className="flex items-center gap-1.5">
        <CellSignalFullIcon size={15} weight="regular" />
        <WifiHighIcon size={15} weight="regular" />
        <BatteryHighIcon size={20} weight="regular" />
      </span>
    </div>
  );
}

/** In-app navigation bar for a detail screen: back caret and a centred title. */
export function AppNavBar({ title }: { title: string }) {
  return (
    <div className="relative flex h-11 items-center justify-center px-4">
      <span aria-hidden className="absolute left-3 grid size-8 place-items-center rounded-full text-ice-60">
        <CaretLeftIcon size={18} weight="regular" />
      </span>
      <p className="text-[15px] font-medium tracking-[-0.01em] text-ice">{title}</p>
    </div>
  );
}

/** Mono section label inside the app (not a page eyebrow). */
export function ScreenLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-[10px] leading-none tracking-[0.16em] text-ice-60 uppercase", className)}>
      {children}
    </p>
  );
}

const TABS = [
  { id: "today", label: "Today", Icon: HouseIcon },
  { id: "timeline", label: "Timeline", Icon: ClockCounterClockwiseIcon },
  { id: "records", label: "Records", Icon: FolderSimpleIcon },
  { id: "share", label: "Sharing", Icon: ShareNetworkIcon },
] as const;

/** The app's bottom tab bar (visual only). */
export function TabBar({ active }: { active: (typeof TABS)[number]["id"] }) {
  return (
    <div aria-hidden className="mt-auto grid grid-cols-4 border-t border-hairline-ink/70 px-3 pt-2.5 pb-7">
      {TABS.map(({ id, label, Icon }) => (
        <span
          key={id}
          className={cn("flex flex-col items-center gap-1", id === active ? "text-glacier" : "text-ice-60")}
        >
          <Icon size={21} weight="regular" />
          <span className="text-[10px] leading-none font-medium">{label}</span>
        </span>
      ))}
    </div>
  );
}
