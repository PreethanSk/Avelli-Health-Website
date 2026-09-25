import type { Metadata } from "next";
import Link from "next/link";
import { ContactPending, LegalDoc, type LegalSection } from "@/components/privacy-trust/LegalDoc";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How anveli handles the information you give us on this website and the waitlist.",
  alternates: { canonical: "/privacy" },
  // A placeholder until legal review: keep it out of search results.
  robots: { index: false, follow: true },
};

const P = ({ children }: { children: React.ReactNode }) => <p>{children}</p>;
const link = "link-inline text-harbor-deep";

const SECTIONS: LegalSection[] = [
  {
    id: "collect",
    title: "What we collect",
    body: [
      <P key="a">Right now, anveli is a website and a waitlist. When you join, we collect:</P>,
      <ul key="b" className="list-disc space-y-2 pl-5 marker:text-slate">
        <li>your email address;</li>
        <li>which page you joined from, so we know what brought you here;</li>
        <li>your answer to &quot;What would you use first?&quot;, only if you choose to give one.</li>
      </ul>,
      <P key="c">
        We don&apos;t ask for health information on this website, and you shouldn&apos;t send us any.
      </P>,
    ],
  },
  {
    id: "use",
    title: "How we use it",
    body: [
      <P key="a">
        We use your email address only to write to you about anveli: when it opens to you, and the occasional
        update before then. Every email has a way to unsubscribe.
      </P>,
      <P key="b">Your answer to the follow-up question helps us decide what to build first.</P>,
    ],
  },
  {
    id: "share",
    title: "Who we share it with",
    body: [
      <P key="a">
        Our waitlist runs on an email service that stores the list and sends our emails on our behalf. It may
        only use your information to provide that service to us.
      </P>,
      <P key="b">We never sell your information, and we don&apos;t share it with advertisers.</P>,
    ],
  },
  {
    id: "device",
    title: "What stays on your device",
    body: [
      <P key="a">
        This site doesn&apos;t use advertising or tracking cookies. Your browser keeps two small preferences
        on your device: that you&apos;ve already joined the waitlist, and whether you paused motion. They
        aren&apos;t sent to us, and clearing your browser data removes them.
      </P>,
      <P key="b">
        Like any website, the service that hosts these pages may keep short-lived technical logs, such as IP
        addresses, to keep the site running and secure.
      </P>,
    ],
  },
  {
    id: "keep",
    title: "How long we keep it",
    body: [
      <P key="a">
        We keep your email address until you unsubscribe or ask us to delete it, or until we no longer need it
        for the waitlist.
      </P>,
    ],
  },
  {
    id: "choices",
    title: "Your choices",
    body: [
      <P key="a">
        You can ask to see the information we hold about you, correct it, or delete it at any time. Write to
        us at <ContactPending /> and we&apos;ll reply.
      </P>,
    ],
  },
  {
    id: "app",
    title: "The anveli app",
    body: [
      <P key="a">
        When anveli opens, this policy will be expanded to cover the health information you choose to keep in
        it. Until then, you can read{" "}
        <Link href="/privacy-trust" className={link}>
          how anveli will treat your information
        </Link>
        .
      </P>,
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    body: [
      <P key="a">
        If this policy changes in a way that matters to you, we&apos;ll say so on this page and by email
        before the change applies.
      </P>,
    ],
  },
  {
    id: "contact",
    title: "Contact",
    body: [
      <P key="a">
        Questions about your information: <ContactPending />.
      </P>,
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalDoc
      title="Privacy policy"
      lead={
        <p>
          What we collect on this website and the waitlist, why, and what you can do about it. In plain
          language, and short on purpose.
        </p>
      }
      sections={SECTIONS}
    />
  );
}
