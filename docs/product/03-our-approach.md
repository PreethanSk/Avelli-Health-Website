# Our Approach

The product should not be designed as another medical-record storage application.

It should function as a **personal health continuity layer**: a system that continuously collects, structures, understands and connects the health information surrounding an individual, then makes the right information useful at the right moment.

The core principle is simple:

> **The user should not have to manually reconstruct their health every time they need healthcare.**

The system should remember.

It should know what happened previously, what is happening now, what requires attention later, what information is relevant to an upcoming doctor visit, what coverage the user has, and what information should—or should not—be shared with another party.

The product therefore operates across seven fundamental responsibilities:

> **Remember → Structure → Understand → Monitor → Act → Communicate → Protect**

Everything else in the product sits underneath these responsibilities.

## Contents

- **Health Vault:** [1. Lifelong Health Vault](#1-the-lifelong-health-vault) · [2. Record Import](#2-frictionless-record-import) · [3. OCR & Extraction](#3-ocr-and-structured-medical-data-extraction) · [4. Automatic Organisation](#4-automatic-health-organisation) · [5. Timeline](#5-the-longitudinal-health-timeline) · [6. Self-Maintaining History](#6-medical-history-that-maintains-itself)
- **Health Intelligence:** [7. Search](#7-natural-language-health-search) · [8. Analytics](#8-longitudinal-health-analytics) · [9. Baselines](#9-personal-baselines) · [10. Dashboard](#10-the-whats-important-now-health-dashboard)
- **Health Continuity:** [11. Follow-Ups](#11-clinician-prescribed-follow-up-tracking) · [12. Preventive Care](#12-preventive-health-guidance) · [13. Symptom Logging](#13-symptom-and-health-event-logging) · [14. Wearables](#14-wearable-and-health-platform-integration) · [15. Correlation](#15-lifestyle-and-clinical-correlation) · [16. Journal](#16-daily-health-journal) · [17. Nutrition](#17-nutrition-and-food-logging) · [18. Goals](#18-health-goals)
- **AI:** [19. Assistant](#19-ai-health-history-assistant) · [20. Proactive Intelligence](#20-proactive-health-intelligence) · [21. Safety](#21-safety-aware-health-guidance)
- **Healthcare Companion:** [22. Visit Preparation](#22-doctor-visit-preparation) · [23. Doctor Summary](#23-doctor-friendly-health-summary) · [24. Selective Sharing](#24-secure-selective-sharing) · [25. Purpose-Based Disclosure](#25-purpose-based-disclosure) · [26. Family Profiles](#26-family-and-dependant-health-profiles) · [27. Caregivers](#27-caregiver-access) · [28. Emergency Profile](#28-emergency-health-profile)
- **Insurance Companion:** [29. Insurance Vault](#29-health-insurance-vault) · [30. Policy Understanding](#30-plain-language-policy-understanding) · [31. Multiple Policies](#31-multiple-policy-intelligence) · [32. Pre-Hospitalisation](#32-pre-hospitalisation-coverage-guidance) · [33. Claim Decisions](#33-claim-decision-support) · [34. Claim Checklist](#34-claim-document-checklist) · [35. Claim Pack](#35-privacy-preserving-claim-pack) · [36. User Review](#36-user-review-before-submission) · [37. Claim Tracking](#37-claim-tracking) · [38. Post-Hospitalisation](#38-post-hospitalisation-expense-tracking) · [39. Care Navigation](#39-care-navigation)
- **Trust & Control:** [40. Provenance](#40-provenance-and-explainability) · [41. Data Quality](#41-correction-and-data-quality-controls) · [42. Consent & Audit](#42-consent-permissions-and-audit-history) · [43. Privacy by Default](#43-privacy-by-default) · [44. Permissioned AI](#44-permissioned-ai) · [45. Portability](#45-data-portability)
- [The Product Experience](#the-product-experience) · [The Core Product](#the-core-product) · [What We Are Actually Building](#what-we-are-actually-building)

---

## 1. The Lifelong Health Vault

At the foundation of the product is a persistent personal health record that belongs to the individual rather than to any particular healthcare provider.

The user should be able to gradually build a complete health history covering years of healthcare interactions.

The vault can contain:

- laboratory reports,
- prescriptions,
- imaging and scan reports,
- discharge summaries,
- consultation records,
- diagnoses,
- procedures and surgeries,
- vaccination records,
- health-check reports,
- medication history,
- allergies,
- hospitalisation records,
- insurance documents,
- claim-related documents,
- and other relevant medical information.

The objective is not simply to keep copies of files.

Every incoming record becomes part of the user's continuously evolving health history.

The original document should always remain available as the authoritative source.

## 2. Frictionless Record Import

Building a lifelong record cannot require the user to manually type their medical history.

Records should therefore be ingestible through multiple channels.

These can include:

- taking a photograph of a paper record,
- uploading a PDF,
- importing an image,
- forwarding or importing medical documents,
- downloading records through supported healthcare integrations,
- importing through interoperable health infrastructure where available,
- and eventually direct provider, laboratory or hospital integrations.

The system should also detect duplicates.

If the same report arrives through two different channels, the user should not end up with two separate medical events.

The principle is:

> **Getting health information into the system should be easier than leaving it scattered outside the system.**

## 3. OCR and Structured Medical Data Extraction

Uploaded reports should not remain static images or PDFs.

The system should extract their contents into structured information.

For example, a laboratory report should become structured data containing information such as:

- test name,
- result,
- units,
- reference range,
- collection date,
- laboratory,
- and related metadata.

A prescription might produce:

- medication,
- dosage,
- frequency,
- duration,
- prescribing clinician,
- and prescription date.

A discharge summary could contribute:

- admission,
- discharge,
- diagnoses,
- procedures,
- medications,
- investigations,
- and follow-up instructions.

This creates a crucial distinction.

The application stores both:

**The original medical evidence**
The actual PDF, scan, image or document provided by the healthcare institution.

**The structured health information**
The information extracted from that document and connected to the rest of the user's history.

The structured information should always maintain provenance.

A user should be able to see:

> where a piece of information came from → which document contained it → when it was recorded.

Users should also be able to correct extraction errors without altering the underlying original document.

## 4. Automatic Health Organisation

The user should not be required to create folders and decide where every medical document belongs.

The system should organise information automatically.

A single record may simultaneously belong to several meaningful dimensions:

- health area,
- condition,
- episode of care,
- record type,
- healthcare provider,
- physician,
- date,
- medication,
- investigation,
- and hospitalisation.

For example, a thyroid blood test should not merely exist under:

> Lab Reports → 2026

It may also belong to:

> Endocrine Health → Thyroid → Monitoring → September 2026

The organisation should reflect how humans think about health rather than how file systems think about documents.

## 5. The Longitudinal Health Timeline

The application should reconstruct the user's health as a timeline.

Instead of seeing isolated documents, the user should be able to see how events developed over time.

A timeline might show:

> symptom appeared → consultation → investigation → diagnosis → medication started → follow-up test → dosage changed → later follow-up

This allows medical events from completely different providers to become part of the same health story.

The timeline becomes the backbone through which the user can understand their history.

## 6. Medical History That Maintains Itself

From the structured record, the application should continuously maintain important sections of the user's history.

These may include:

- active conditions,
- past conditions,
- medication history,
- current medications,
- previous medications,
- allergies,
- procedures,
- hospitalisations,
- vaccinations,
- major investigations,
- clinician history,
- and significant medical events.

The user should not need to repeatedly rebuild this information every time a new doctor asks for it.

As new evidence enters the system, the health history should evolve with it.

## 7. Natural-Language Health Search

Users should be able to search their history without remembering medical terminology or document names.

Examples:

- "When was my last thyroid test?"
- "Show every cholesterol report I've had."
- "What medication was I taking when my vitamin D improved?"
- "Have I had this scan before?"
- "Which doctor prescribed this medicine?"
- "Show the reports from my hospitalisation in 2024."

Search should operate across structured health data and source documents.

Every factual answer derived from the health record should be traceable back to its underlying source.

## 8. Longitudinal Health Analytics

Once medical data becomes structured, the product can provide something ordinary document storage cannot:

> **a view of change over time.**

For supported health measurements, users should be able to see:

- historical values,
- trends,
- increases and decreases,
- reference ranges,
- long-term patterns,
- and significant changes.

Instead of seeing five separate laboratory PDFs, the user could see one continuous view of the measurement across several years.

## 9. Personal Baselines

Population reference ranges are important, but the user's own history can provide additional context.

Over time, the system can establish personal baselines for measurements for which sufficient reliable data exists.

This allows the product to surface observations such as:

- a measurement remaining within a laboratory's reference range but moving substantially from the person's usual level,
- a value gradually changing across multiple tests,
- or a significant deviation from the person's previous measurements.

These should be presented as contextual observations rather than diagnoses.

The product helps the user notice something worth understanding.

It does not pretend to determine the medical explanation.

## 10. The "What's Important Now?" Health Dashboard

A large health record should not force the user to constantly inspect everything.

The application should therefore provide a continuously updated view of what is currently relevant.

For example:

**Follow-ups**
Tests or consultations a clinician previously asked the user to complete.

**Recent changes**
Meaningful changes detected within newly added health information.

**Upcoming health actions**
Scheduled appointments, medication milestones or monitoring requirements.

**Preventive care**
Potentially relevant routine health checks or screenings.

**Recent medical activity**
New reports, prescriptions and healthcare events.

**Insurance actions**
Claim deadlines, missing documents or policy-related actions associated with an ongoing episode.

The dashboard effectively answers:

> "Is there anything about my health that currently needs my attention?"

## 11. Clinician-Prescribed Follow-Up Tracking

Follow-up instructions should not disappear inside a prescription or consultation note.

When the system detects instructions such as:

- repeat this test in three months,
- review after six weeks,
- return if symptoms persist,
- continue medication for thirty days,
- schedule follow-up imaging,
- or monitor a particular measurement,

those instructions can become trackable health actions.

The user should be able to confirm or correct them before they are added.

The system can then remind them at the appropriate time.

Once the follow-up occurs, the new record can be connected back to the original recommendation.

This creates a closed loop:

> **Recommendation → Reminder → Follow-up → Result → Continued monitoring**

rather than:

> Recommendation → Forgotten document

## 12. Preventive Health Guidance

Healthcare should not begin only after something goes wrong.

Using information such as:

- age,
- sex where medically relevant,
- available medical history,
- previous tests,
- vaccination history,
- clinician recommendations,
- and other appropriate risk information,

the system can help users understand which routine preventive-health actions may be relevant.

It can identify when the user appears overdue for a check previously recommended or potentially due for an established screening.

This should remain guidance rather than a substitute for professional medical advice.

The objective is to help people remember and navigate preventive care, not independently prescribe healthcare.

## 13. Symptom and Health Event Logging

Users should be able to record what they are experiencing between healthcare visits.

For example:

- headaches,
- pain,
- fatigue,
- digestive symptoms,
- dizziness,
- sleep problems,
- fever,
- medication effects,
- mood or energy changes,
- or any other recurring symptom.

Entries can include:

- when it happened,
- severity,
- duration,
- frequency,
- related observations,
- and notes.

This creates information that normally disappears between doctor visits.

Instead of telling a doctor:

> "I've been having headaches quite often."

the user may be able to show:

> "I recorded headaches on eleven days during the last six weeks, primarily during the evenings."

The system can help identify patterns and suggest topics worth discussing with a clinician without diagnosing their cause.

## 14. Wearable and Health-Platform Integration

The clinical record should be capable of incorporating the user's everyday physiological and activity information.

Initial integrations can include:

- Apple Health,
- Android Health Connect,
- and compatible wearable ecosystems.

Depending on available data and device support, this may include information such as:

- sleep,
- resting heart rate,
- activity,
- exercise,
- steps,
- weight,
- heart-rate patterns,
- and other health measurements.

The purpose is not to reproduce a wearable application's dashboard.

The value comes from connecting everyday health information with the clinical timeline.

## 15. Lifestyle and Clinical Correlation

Once enough longitudinal information exists, the system can help users explore relationships across different parts of their health.

For example:

- whether sleep patterns changed around a particular period,
- whether weight changed alongside laboratory measurements,
- whether activity levels changed after a medical event,
- whether symptoms repeatedly occurred alongside certain lifestyle patterns,
- or whether a health measurement changed during the same period as a medication or lifestyle change.

These are correlations and observations—not proof of causation.

The product should clearly distinguish:

> "These things occurred together"

from:

> "This caused that."

## 16. Daily Health Journal

A lightweight daily journal can provide additional context that wearables cannot automatically capture.

Users could optionally record areas such as:

- how they felt,
- sleep quality,
- energy,
- stress,
- exercise,
- illness,
- symptoms,
- medication adherence,
- and relevant lifestyle factors.

Over time, the journal becomes another signal within the person's longitudinal health history.

The system can later help surface patterns that would otherwise depend entirely on memory.

## 17. Nutrition and Food Logging

Nutrition can eventually become an additional layer of the health timeline.

Users may log meals or relevant dietary information and connect it to:

- symptoms,
- energy,
- weight,
- metabolic measurements,
- fitness goals,
- and other health information.

This does not need to begin as a calorie-counting application.

Its value is contextual:

> What was happening in the person's lifestyle while their health was changing?

## 18. Health Goals

Users should be able to maintain personal health goals such as:

- improving sleep,
- increasing activity,
- reducing weight,
- improving a specific health measurement,
- maintaining medication adherence,
- completing preventive check-ups,
- or following clinician recommendations.

Where possible, progress can be connected to objective information already present in the platform.

The product becomes useful not only for remembering the past but also for helping the user manage what they are trying to improve.

## 19. AI Health History Assistant

The AI assistant should operate on the user's actual health history rather than behave as a generic medical chatbot.

It should be able to answer questions such as:

- "What happened during my hospitalisation last year?"
- "How has my HbA1c changed?"
- "Which medications have I taken for this condition?"
- "Did my doctor ask me to repeat any tests?"
- "What was abnormal in my last health check?"
- "What changed since my previous report?"
- "Have I had similar symptoms before?"

The AI should retrieve the relevant information, explain it in understandable language and provide links back to the supporting source records.

The essential principle is:

> **AI should reason over the person's record, not invent a medical history from conversation.**

## 20. Proactive Health Intelligence

The user should not need to know exactly which question to ask.

The intelligence layer should be able to surface useful observations when appropriate.

For example:

- a measurement has changed significantly from previous values,
- a clinician-requested follow-up appears overdue,
- similar symptoms have been logged repeatedly,
- a previously monitored health issue has not been reviewed recently,
- a newly uploaded report contains findings the user may want to discuss,
- or several records appear to belong to the same ongoing episode.

The product should explain why it surfaced something and show the evidence behind it.

It should not turn every minor variation into an alarm.

## 21. Safety-Aware Health Guidance

The AI layer must have clearly defined boundaries.

It can:

- explain medical terminology,
- summarise records,
- identify trends,
- help organise questions,
- surface potentially relevant information,
- and suggest when professional medical attention may be appropriate.

It should not present uncertain conclusions as diagnoses.

When symptoms or available information indicate that urgent medical assessment may be appropriate, the product should make escalation clear rather than attempting to handle the situation entirely within the application.

The system is designed to improve the user's relationship with healthcare professionals, not replace them.

## 22. Doctor Visit Preparation

Before an appointment, the application should help the user prepare automatically.

The system can generate a concise visit-preparation view containing relevant information such as:

- reason for the visit,
- recent symptoms,
- relevant previous episodes,
- current medications,
- relevant laboratory trends,
- previous investigations,
- important recent changes,
- outstanding follow-ups,
- and questions the user may want to discuss.

The user decides what is relevant and what should be shared.

The objective is to turn a large health history into something useful during a short consultation.

## 23. Doctor-Friendly Health Summary

When a clinician needs broader context, the user should be able to generate a concise structured summary of their health history.

Rather than giving the clinician dozens of PDFs, the summary can contain relevant information such as:

- known conditions,
- current medications,
- allergies,
- previous major procedures,
- significant medical events,
- recent investigations,
- relevant trends,
- and the specific history relevant to the current visit.

The original records remain accessible when supporting evidence is required.

## 24. Secure Selective Sharing

The user should control who receives their health information and exactly what they receive.

Sharing should support:

- individual records,
- selected health categories,
- a specific episode of care,
- a generated doctor summary,
- defined time periods,
- or specifically chosen data.

Where appropriate, access can be:

- time-limited,
- revocable,
- and logged.

This is fundamentally different from treating the user's entire health vault as one shareable object.

## 25. Purpose-Based Disclosure

Different recipients require different information.

The application should therefore help users share information based on purpose.

**A treating doctor**
May require substantial relevant medical context.

**A new specialist**
May primarily require information related to their area of care.

**An insurer**
May require documentation connected to a particular claim.

**An emergency responder**
May need only critical emergency information.

**A caregiver**
May require a specifically authorised subset.

The principle is:

> **Having the information should never automatically mean sharing the information.**

## 26. Family and Dependant Health Profiles

Many people manage healthcare not only for themselves but also for:

- children,
- parents,
- spouses,
- and other dependants.

The platform should therefore allow authorised users to manage separate health profiles while maintaining clear ownership and access controls.

Each person should retain an independent health history rather than becoming another folder inside one user's account.

## 27. Caregiver Access

Users should be able to grant trusted people access to appropriate portions of their health information.

Permissions should be granular.

A caregiver may be allowed to:

- view certain records,
- receive reminders,
- manage appointments,
- upload records,
- or assist with specific health actions,

without automatically receiving unlimited access to everything.

Permissions should be visible and revocable.

## 28. Emergency Health Profile

Users can optionally maintain a compact emergency profile containing information that may be important during urgent care.

This may include:

- critical allergies,
- important medical conditions,
- essential medications,
- relevant implants or procedures,
- emergency contacts,
- and other user-approved emergency information.

The emergency profile should be intentionally limited rather than exposing the user's complete health history.

## 29. Health Insurance Vault

Insurance should exist inside the same continuity layer because paying for healthcare is part of the healthcare journey.

Users should be able to store and understand multiple policies, including:

- employer or group medical insurance,
- personal individual policies,
- family-floater policies,
- top-up plans,
- super top-up plans,
- and other relevant health coverage.

The system should extract and structure important policy information rather than simply storing policy PDFs.

## 30. Plain-Language Policy Understanding

Insurance policies are difficult to interpret.

The application should help explain relevant policy terms in plain language while linking explanations back to the actual policy wording.

Users should be able to ask questions such as:

- "Is this treatment covered?"
- "What is my room-rent limit?"
- "Do I have a waiting period for this?"
- "Does this policy have a co-payment?"
- "How much coverage remains?"
- "What happens if the hospital bill exceeds my base policy?"

The system should distinguish between:

- what the policy document states,
- what appears likely to apply,
- and what ultimately requires confirmation from the insurer.

It should never guarantee claim approval.

## 31. Multiple-Policy Intelligence

A major difference from ordinary insurance applications is that the system should understand the user's entire coverage portfolio, not one policy at a time.

A user may simultaneously have:

> Employer policy + Personal policy + Super top-up

When a healthcare event occurs, the system should help determine how those policies may interact based on their actual terms.

For example, in an appropriate case it may identify that using employer-provided group coverage first could preserve benefits attached to the user's personal policy, with another policy potentially covering an eligible remaining amount.

But this should never be hard-coded as a universal rule.

The recommendation should depend on:

- actual policy wording,
- available coverage,
- deductibles,
- exclusions,
- waiting periods,
- no-claim benefits,
- claim conditions,
- and the particular healthcare event.

The goal is to answer the real question:

> "Given all the insurance I already have, how should I use it for this event?"

## 32. Pre-Hospitalisation Coverage Guidance

When the user knows they are going to be admitted, the application should help them understand the administrative side before treatment.

It can surface information such as:

- which policies may be relevant,
- whether the hospital appears eligible for cashless treatment where such information is available,
- likely policy restrictions worth checking,
- documents that may be required,
- available policy limits,
- and questions the user may want to confirm with the insurer or hospital insurance desk.

This reduces the likelihood of discovering important restrictions only after treatment has already occurred.

## 33. Claim Decision Support

After a healthcare expense, the product can help the user understand whether the expense appears potentially claimable and under which available policy or policies.

It should not make absolute statements such as:

> "This claim will be approved."

Nor should it encourage the user to abandon a legitimate claim merely because approval appears uncertain.

Instead, it can explain:

- relevant policy terms,
- applicable limits,
- possible exclusions,
- documentation requirements,
- and why submitting the claim may or may not appear worthwhile.

The final decision remains with the user and insurer.

## 34. Claim Document Checklist

For a claim, the system should identify the documentation apparently required by the relevant insurer or policy.

For example:

- bills,
- receipts,
- prescriptions,
- investigation reports,
- discharge summary,
- claim forms,
- proof of payment,
- and other policy-specific documents.

Because the user's health records may already exist inside the application, the system can automatically identify which required documents are already available and which appear to be missing.

## 35. Privacy-Preserving Claim Pack

The claim pack is one of the most important privacy features in the insurance experience.

By default, a claim package should be built around the current episode of care only.

If the user was hospitalised for a particular event, the application can collect the records required for that event.

It should not automatically attach the user's entire historical medical record.

Older records should only be added when:

- specifically requested,
- genuinely required,
- or deliberately selected by the user.

And they should remain clearly identifiable as historical records.

The principle is:

> **Do not volunteer medical history unnecessarily, and do not conceal information that is legitimately required.**

The system helps the user provide the appropriate information for the claim without turning a convenient health vault into an accidental mechanism for unrestricted disclosure.

## 36. User Review Before Submission

AI should never silently decide which health information leaves the platform.

Before a claim pack, doctor summary or other external health package is shared, the user should see:

- what information is included,
- what source documents are attached,
- why each item was selected,
- and who will receive it.

The user then approves the disclosure.

## 37. Claim Tracking

Once a claim has been initiated, the application can maintain the claim as part of the healthcare episode.

The user can track:

- claim submitted,
- documents requested,
- additional information supplied,
- approval or rejection,
- settlement amount,
- outstanding reimbursement,
- and relevant deadlines.

This keeps the financial outcome connected to the medical event that created it.

## 38. Post-Hospitalisation Expense Tracking

Many insurance policies may cover eligible expenses incurred before or after hospitalisation within specified periods.

Where applicable to the user's policy, the application should remind the user that additional related expenses may still need to be submitted.

Relevant new records or bills can then be associated with the existing episode and claim.

## 39. Care Navigation

When appropriate, the product can help the user understand the next category of action without pretending to replace medical judgement.

For example, it may help distinguish situations where the user is trying to understand:

- whether they need an appointment,
- what type of healthcare professional may be relevant,
- whether an existing clinician follow-up should be prioritised,
- what records to bring,
- or whether the symptoms described warrant more urgent medical attention.

The objective is reducing the friction between noticing a problem and entering the healthcare system appropriately.

## 40. Provenance and Explainability

Health AI should never become a black box.

Whenever the product makes an observation based on the user's medical history, the user should be able to understand:

- what information was used,
- where that information came from,
- which records support the statement,
- and what part is factual extraction versus AI interpretation.

For example:

> "Your LDL measurement increased across these three reports."

should link directly to those three laboratory reports.

This is critical for trust.

## 41. Correction and Data Quality Controls

Medical information extracted automatically will not always be perfect.

Users should be able to:

- correct extraction errors,
- resolve duplicate records,
- confirm uncertain information,
- identify incorrect categorisation,
- and distinguish verified information from inferred information.

Corrections should not alter the original source document.

The application should preserve both:

> the source and the interpreted structured layer above it.

## 42. Consent, Permissions and Audit History

Users should be able to understand and control access to their information.

The system should maintain visibility into:

- which people or services have access,
- what information they can access,
- what information has been shared,
- when it was shared,
- and when access was revoked.

Sensitive actions should leave an auditable history.

## 43. Privacy by Default

Because the product may eventually contain one of the most comprehensive datasets about an individual, privacy cannot be an optional feature.

The product should be designed around:

- explicit consent,
- minimum-necessary disclosure,
- strong encryption,
- granular permissions,
- revocable sharing,
- secure authentication,
- access logging,
- separation between users' records,
- and careful controls around AI access.

Identifiable health information should not become a commodity sold to advertisers or unrelated third parties.

Trust is not simply a compliance requirement for this product.

> **Trust is part of the product itself.**

## 44. Permissioned AI

The existence of data inside the user's health vault should not automatically grant every AI process unrestricted access to it.

AI access should follow the same principle as human access:

> **only the information required for the task.**

- A system generating a claim pack should not need access to every unrelated health episode.
- A doctor-visit preparation assistant should use the history relevant to that consultation.
- A general trend analysis may require broader longitudinal information.

Permissions should follow purpose.

## 45. Data Portability

The user should never become trapped inside the platform.

Their health information should remain exportable in useful formats.

A user should be able to retrieve:

- their original records,
- structured data,
- relevant summaries,
- and appropriate portions of their history.

The system exists to give the person greater control over their health information—not simply move the dependency from hospitals to another private platform.

---

## The Product Experience

These features should not feel like forty-five separate tools.

To the user, the experience should be much simpler.

1. **Something happens in healthcare**
   A consultation, test, prescription, symptom, wearable change, hospitalisation or claim.
2. **The information enters the personal health record**
   Automatically where possible, manually when necessary.
3. **The system understands and connects it**
   To the correct person, health area, condition, episode, timeline and previous history.
4. **The system remembers what matters**
   Including trends, medications, follow-ups, outstanding actions and relevant insurance context.
5. **The system surfaces it when useful**
   Before a doctor appointment, when a follow-up is due, when a new report arrives, when a health pattern changes, or when treatment creates an insurance event.
6. **The user decides what happens next**
   Consult a doctor, complete a follow-up, monitor something, share information, make a claim or simply continue tracking.

The system assists with that decision.

It does not take ownership of it.

## The Core Product

At its simplest, the product can be understood as five connected layers:

### 1. Health Vault

*Everything about my health, safely remembered.*

Records, reports, prescriptions, medications, history and documents.

### 2. Health Intelligence

*Help me understand what my history means over time.*

Structure, timeline, search, trends, baselines, correlations and AI.

### 3. Health Continuity

*Help me remember what needs to happen next.*

Follow-ups, preventive care, symptoms, monitoring, goals and reminders.

### 4. Healthcare Companion

*Help me use my information when I actually need healthcare.*

Doctor preparation, summaries, care navigation, selective sharing and family/caregiver support.

### 5. Insurance Companion

*Help me understand and use the coverage I already have.*

Policies, multiple-policy intelligence, claim guidance, claim packs, document management and claim tracking.

These layers reinforce one another.

- The health vault makes intelligence possible.
- Intelligence makes continuity possible.
- Continuity improves healthcare interactions.
- Healthcare events create the information required for insurance.
- And every new event strengthens the longitudinal record.

## What We Are Actually Building

This is therefore not:

- a medical file storage application.
- a symptom checker.
- a wearable dashboard.
- an insurance application.
- a generic AI medical chatbot.

Those are individual components of a much larger system.

The product is a **persistent personal health layer** that stays with the individual across providers, devices, insurers and time.

Its job is to:

- Remember the past.
- Understand the present.
- Prepare for what comes next.
- Help the user navigate healthcare.
- And keep the user in control of their information throughout the process.

**That is the product.**
