/**
 * /privacy-trust copy. Each section is written from docs/product/03-our-approach.md
 * (§40 to §45, plus §24, §25, §35 and §36 for sharing and review) in anveli's
 * voice: calm, concrete, short sentences, and the person decides.
 * Rules: headlines <= 8 words, no em or en dashes, no promises of outcomes.
 */

export type TrustSection = {
  id: string;
  title: string;
  body: string[];
  /** The plain "What this means for you" line that closes the section. */
  takeaway: string;
};

export const TRUST_TITLE = "Your information, on your side.";

export const TRUST_INTRO =
  "anveli will hold one of the most complete pictures of your health. So trust isn't a policy we added later. It's part of the product.";

export const TRUST_SECTIONS: TrustSection[] = [
  {
    id: "source",
    title: "Every fact has a source.",
    body: [
      "When anveli tells you something about your health, you can see exactly where it came from. Every observation links back to the records behind it.",
      "For example, \"Your LDL rose across these three reports\" opens those three lab reports. Nothing is left to trust on faith.",
      "You can also see which part was read straight from a document and which part is anveli's interpretation of it.",
    ],
    takeaway: "You never have to take our word for it. The source is always one tap away.",
  },
  {
    id: "correct",
    title: "You can correct it.",
    body: [
      "Reading a scanned report is hard, and sometimes anveli will get a detail wrong: a date, a unit, the same lab result filed twice.",
      "You can fix mistakes, merge duplicates, confirm anything uncertain and move something to the right place. What's verified and what's inferred are always marked.",
      "Your corrections never change the original. The document stays exactly as it was issued, and your fix sits in a layer above it.",
    ],
    takeaway: "Your record gets more accurate over time, and the original is always there to check.",
  },
  {
    id: "decide",
    title: "You decide who sees what.",
    body: [
      "A doctor, an insurer, a caregiver and an emergency responder each need something different. So you share for a purpose, never your whole history by default.",
      "Share one report, one hospital stay or a doctor summary. Set it to expire, and take it back whenever you like. Before anything leaves, you see what's included and who receives it.",
      "Every share leaves a record: who has access, to what, since when, and when it ended.",
    ],
    takeaway: "Nothing leaves without your approval, and you can always see who has what.",
  },
  {
    id: "private",
    title: "Private by default.",
    body: [
      "Health information is some of the most personal information there is. Privacy isn't a setting you have to go looking for.",
      "Your records are encrypted and kept separate from everyone else's. Sharing needs your explicit consent, and only the minimum a task needs is ever disclosed.",
      "Your health information is never sold to advertisers or anyone else.",
    ],
    takeaway: "You start private. Anything else is a choice you make.",
  },
  {
    id: "ai",
    title: "AI only sees what the task needs.",
    body: [
      "Having your records in anveli doesn't give every AI feature access to all of them. AI follows the same rule as people: only what the task needs.",
      "A claim pack is built from that one hospital stay, not your whole history. Preparing for a visit uses the history that matters to that doctor.",
      "And AI never decides on its own what leaves anveli. You review what's included, and why, before anything is shared.",
    ],
    takeaway: "Useful AI, with the limits you'd expect from someone you trust.",
  },
  {
    id: "yours",
    title: "It's yours to take.",
    body: [
      "You should never feel locked in. Your health information stays exportable, in formats that are useful elsewhere.",
      "Take your original records, the structured data, your summaries, or just the part of your history you need right now.",
      "anveli exists to give you more control over your health information, not to become one more place you depend on.",
    ],
    takeaway: "If you ever leave, your history leaves with you.",
  },
];
