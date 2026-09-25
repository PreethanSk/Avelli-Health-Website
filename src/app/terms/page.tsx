import type { Metadata } from "next";
import Link from "next/link";
import { ContactPending, LegalDoc, type LegalSection } from "@/components/privacy-trust/LegalDoc";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "The terms for using the anveli website and joining the waitlist.",
  alternates: { canonical: "/terms" },
  // A placeholder until legal review: keep it out of search results.
  robots: { index: false, follow: true },
};

const P = ({ children }: { children: React.ReactNode }) => <p>{children}</p>;
const link = "link-inline text-harbor-deep";

const SECTIONS: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    body: [
      <P key="a">
        These terms cover this website and the anveli waitlist. By using the site, you agree to them. The
        anveli app will have its own terms when it opens.
      </P>,
    ],
  },
  {
    id: "waitlist",
    title: "The waitlist",
    body: [
      <P key="a">
        Joining the waitlist is free. It means we&apos;ll email you about anveli, including when it&apos;s
        ready for you. It doesn&apos;t create an account, and it doesn&apos;t guarantee access by a
        particular date.
      </P>,
      <P key="b">You can leave the waitlist at any time from any of our emails.</P>,
    ],
  },
  {
    id: "medical",
    title: "Not medical advice",
    body: [
      <P key="a">
        anveli helps you understand and organise your health information. It does not give medical advice or
        diagnoses. Nothing on this website is a substitute for talking to a qualified doctor.
      </P>,
      <P key="b">In an emergency, contact your local emergency services.</P>,
    ],
  },
  {
    id: "examples",
    title: "Examples on this site",
    body: [
      <P key="a">
        Screens, names, values and documents shown on this website are examples, labelled as such. They
        don&apos;t describe real people, and they show how anveli is designed to work, not a promise of any
        particular result.
      </P>,
    ],
  },
  {
    id: "use",
    title: "Using this site",
    body: [
      <P key="a">
        Please use the site lawfully, and don&apos;t try to disrupt it, access parts of it you aren&apos;t
        meant to, or submit someone else&apos;s email address to the waitlist.
      </P>,
    ],
  },
  {
    id: "ours",
    title: "Our name and content",
    body: [
      <P key="a">
        The anveli name, mark, design and writing on this site belong to us. You&apos;re welcome to link to
        the site and share it; please don&apos;t copy it or present it as your own.
      </P>,
    ],
  },
  {
    id: "privacy",
    title: "Your privacy",
    body: [
      <P key="a">
        Our{" "}
        <Link href="/privacy" className={link}>
          privacy policy
        </Link>{" "}
        explains what we collect and why. For how the app will treat your health information, read{" "}
        <Link href="/privacy-trust" className={link}>
          privacy and trust
        </Link>
        .
      </P>,
    ],
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: [
      <P key="a">
        We may update these terms as anveli grows. If a change matters to you, we&apos;ll say so on this page
        before it applies.
      </P>,
    ],
  },
  {
    id: "law",
    title: "Governing law",
    body: [<P key="a">To be confirmed during legal review.</P>],
  },
  {
    id: "contact",
    title: "Contact",
    body: [
      <P key="a">
        Questions about these terms: <ContactPending />.
      </P>,
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalDoc
      title="Terms of use"
      lead={<p>The ground rules for this website and the waitlist, in plain language.</p>}
      sections={SECTIONS}
    />
  );
}
