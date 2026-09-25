/**
 * Every sample value shown on the site lives here, so it is easy to audit.
 * All of it is illustrative and must be labelled "Example" where it appears
 * (docs/website/03-site-structure.md §2). Names and places are Indian because
 * the product is India-first. No real people, labs or policies.
 */

/* ---- Part 3: the problem (fragment labels) ---- */
export const PROBLEM_FRAGMENTS = [
  "Lab report (PDF)",
  "Prescription in a chat",
  "Discharge summary",
  "Six months of sleep",
  "Policy document",
  "What the doctor said",
] as const;

/* ---- Part 7: the intelligence bento ---- */

/** Cell 1: an example marker over about four years, with the person's own usual range. */
export const BASELINE_MARKER = {
  name: "Vitamin D",
  unit: "ng/mL",
  /** The lab's reference range (the result is still inside it). */
  labRange: [30, 100] as const,
  /** "Your usual range", learned from this person's own history. */
  usualRange: [41, 52] as const,
  points: [
    { date: "2022-11-14", value: 46.2, source: "Kaveri Diagnostics, Bengaluru" },
    { date: "2023-05-02", value: 48.9, source: "Kaveri Diagnostics, Bengaluru" },
    { date: "2023-10-21", value: 44.1, source: "Deccan Labs home collection" },
    { date: "2024-04-09", value: 49.6, source: "Nilgiri Path Labs" },
    { date: "2024-10-30", value: 45.3, source: "Nilgiri Path Labs" },
    { date: "2025-06-18", value: 42.8, source: "Deccan Labs home collection" },
    { date: "2026-01-07", value: 41.4, source: "Kaveri Diagnostics, Bengaluru" },
    { date: "2026-08-26", value: 34.7, source: "Nilgiri Path Labs" },
  ],
  caption: "Still inside the lab's range. Outside yours.",
} as const;

/** Cell 2: an observation traced to its sources. */
export const SOURCED_OBSERVATION = {
  sentence: "Your LDL rose across these three reports.",
  marker: "LDL cholesterol",
  unit: "mg/dL",
  sources: [
    { id: "ldl-1", lab: "Kaveri Diagnostics", date: "Mar 2025", value: 108 },
    { id: "ldl-2", lab: "Nilgiri Path Labs", date: "Oct 2025", value: 121 },
    { id: "ldl-3", lab: "Deccan Labs", date: "Jun 2026", value: 134 },
  ],
} as const;

/** Cell 3: ask your history. */
export const ASK_HISTORY = {
  question: "When was my last thyroid test?",
  answer: "12 September 2026. TSH 2.8 mIU/L, inside your usual range.",
  source: "Nilgiri Path Labs, report of 12 Sep 2026",
} as const;

/** Cell 4: organised for you. */
export const ORGANISED_PATH = ["Endocrine", "Thyroid", "Monitoring", "Sept 2026"] as const;
export const PLAIN_FOLDER = "Lab reports / 2026";

/** Cell 5: one timeline. */
export const TIMELINE_STEPS = ["Symptom", "Consultation", "Test", "Medication", "Follow-up"] as const;

/* ---- Part 8: continuity loop ---- */
export const CONTINUITY_LOOP = ["Recommendation", "Reminder", "Follow-up", "Result", "Keep monitoring"] as const;
export const CONTINUITY_BROKEN = ["Recommendation", "Forgotten document"] as const;
export const SYMPTOM_EXAMPLE = "Headaches on 11 days in the last six weeks, mostly evenings.";

/* ---- Part 9: phone screens ---- */
/** The phone's own clock and "today" (status bar, screen 1 header). */
export const PHONE_META = {
  time: "9:41",
  today: "Fri 25 Sep",
  initials: "AI",
} as const;

export const PHONE_IMPORTANT_NOW = [
  {
    kind: "followup",
    category: "Follow-up",
    when: "Due 14 Oct",
    title: "Thyroid follow-up due",
    detail: "Dr. Kavita Rao asked for a repeat TSH in 3 months.",
  },
  {
    kind: "report",
    category: "New record",
    when: "Just now",
    title: "New report connected",
    detail: "Lipid profile, Nilgiri Path Labs. 9 values structured.",
  },
  {
    kind: "claim",
    category: "Claim",
    when: "1 missing",
    title: "Claim document missing",
    detail: "Final bill for the March 2026 stay at Lakeside Hospital.",
    action: "Add bill",
  },
] as const;

export const PHONE_VISIT_PREP = {
  doctor: "Dr. Kavita Rao",
  specialty: "Endocrinology",
  visit: "Dr. Kavita Rao, Endocrinology",
  when: "Fri 16 Oct, 11:30",
  reason: "Thyroid follow-up",
  symptoms: ["Tiredness most afternoons", "Headaches on 11 days in six weeks"],
  medications: ["Levothyroxine 50 mcg, daily", "Vitamin D3 60,000 IU, weekly"],
  trends: [
    { name: "TSH", value: "2.8", unit: "mIU/L", note: "Steady across 3 tests", outside: false },
    { name: "Vitamin D", value: "34.7", unit: "ng/mL", note: "Below your usual range", outside: true },
  ],
  questions: ["Should the Vitamin D dose change?", "Is the afternoon tiredness worth a test?"],
} as const;

export const PHONE_DOCTOR_SUMMARY = {
  name: "Ananya Iyer",
  age: 34,
  prepared: "25 Sep 2026",
  conditions: ["Hypothyroidism, since 2021"],
  medications: ["Levothyroxine 50 mcg, daily", "Vitamin D3 60,000 IU, weekly"],
  allergies: ["Penicillin"],
  recentTests: [
    { name: "TSH", value: "2.8 mIU/L", date: "12 Sep 2026" },
    { name: "Vitamin D", value: "34.7 ng/mL", date: "26 Aug 2026" },
    { name: "LDL", value: "134 mg/dL", date: "3 Jun 2026" },
  ],
  shareFor: "Share for 7 days",
} as const;

/** One line beside the phone per screen (the headline carries "Ready before you walk in."). */
export const PHONE_LINES = [
  "What matters today, and nothing else.",
  "Symptoms, medicines and questions, gathered for the visit.",
  "A clear summary, not a stack of PDFs.",
] as const;

/* ---- Part 10: insurance layers ---- */
export const INSURANCE_LAYERS = [
  {
    order: "Use first",
    name: "Employer group policy",
    cover: "Sum insured Rs 5 lakh, family floater",
    line: "Use first: preserves your no-claim bonus.",
    ring: "small",
  },
  {
    order: "Then",
    name: "Personal policy",
    cover: "Sum insured Rs 10 lakh, room rent up to Rs 8,000 a day",
    line: "Then: covers what the group policy doesn't.",
    ring: "middle",
  },
  {
    order: "If needed",
    name: "Super top-up",
    cover: "Rs 25 lakh above a Rs 5 lakh deductible",
    line: "If needed: starts once the deductible is crossed.",
    ring: "outer",
  },
] as const;

/* ---- Part 11: purpose picker ---- */
export const RECORD_ITEMS = [
  "Conditions",
  "Medications",
  "Allergies",
  "Lab trends",
  "Hospital stay 2024",
  "Mental health notes",
  "Policy documents",
  "Emergency contacts",
] as const;
export type RecordItem = (typeof RECORD_ITEMS)[number];

export const RECIPIENTS: { id: string; label: string; note: string; shares: RecordItem[] }[] = [
  {
    id: "doctor",
    label: "Doctor",
    note: "Broad relevant history.",
    shares: ["Conditions", "Medications", "Allergies", "Lab trends", "Hospital stay 2024"],
  },
  {
    id: "insurer",
    label: "Insurer",
    note: "This episode only, never the full history.",
    shares: ["Hospital stay 2024", "Policy documents"],
  },
  {
    id: "emergency",
    label: "Emergency",
    note: "What a stranger needs to keep you safe.",
    shares: ["Conditions", "Medications", "Allergies", "Emergency contacts"],
  },
  {
    id: "caregiver",
    label: "Caregiver",
    note: "Only what you allow.",
    shares: ["Medications", "Emergency contacts"],
  },
];
