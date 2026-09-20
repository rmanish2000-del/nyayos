# NYAYOS_FIGMA_BRIEF_V2

## Objective

Design the first NyayOS product around **dispute readiness**, not court filing.

## Brand/product language

### Use

**NyayOS**  
**Dispute Readiness Engine**

### Hero

> **What happened?**

### Supporting copy

> “Tell us what happened in your own words. You don't need to know the legal term.”

### Do not use

- AI Lawyer
- AI Judge
- Predict Your Case
- Win Your Case
- File Automatically
- Replace Your Lawyer

---

# 1. Public pages

## Home

Sections:

1. What happened?
2. How NyayOS works.
3. Evidence-first workflow.
4. Human review.
5. Trust & Privacy.
6. Pilot CTA.

## How it works

Visual:

**Story → Facts → Evidence → Timeline → Possible paths → Action plan → Case file**

## Trust & Safety

Explain:

- AI assists;
- AI does not decide;
- sources are shown;
- uncertainty is visible;
- users can correct/delete;
- private files are not used for training by default.

---

# 2. Secure application

## Dashboard

Cards:

- active disputes;
- recently updated;
- awaiting confirmation;
- evidence gaps;
- review/export status.

Primary CTA:

**Start a dispute**

## New dispute

Large free-text input.

Prompt examples:

- “A supplier delivered something different from what we ordered.”
- “A vendor says we have not paid; our records show a dispute about the invoice.”
- “We paid for a service and did not receive what was agreed.”

Do not prompt users with legal statute names.

---

# 3. Intake screen

Show:

- current question;
- progress;
- “Why we ask” for sensitive fields;
- “I don't know”;
- save and exit.

Avoid a long form.

---

# 4. Evidence locker

Each document card:

- file name;
- document type;
- status;
- number of pages;
- extracted facts;
- upload date;
- confidence;
- verification state.

Actions:

- view;
- rename;
- confirm;
- correct;
- delete.

---

# 5. Fact confirmation

Layout:

**Claim**

“Payment was made on 14 July.”

**Source**

Invoice / page 2

**Status**

AI extraction — awaiting confirmation

Actions:

- Confirm
- Correct
- Uncertain
- Not relevant

Important: visual hierarchy must make source/status more prominent than AI-generated wording.

---

# 6. Timeline

Each event:

- date;
- precision;
- event;
- source;
- status.

Use visual states:

- exact;
- approximate;
- inferred;
- unknown;
- conflicting.

Never visually treat inferred dates as exact.

---

# 7. Parties

Each party card:

- name;
- role;
- type;
- source;
- confidence.

Provide a duplicate-review screen when names are similar.

---

# 8. Evidence mapping

Graph or table:

**Evidence → Fact/Event**

Example:

Receipt.pdf → payment fact → supports

WhatsApp.pdf → delivery fact → partially supports

Invoice.pdf → payment date → contradicts another document

Every relationship opens the source.

---

# 9. Contradictions

Title:

> **Information to review**

Copy:

> “These documents contain different information. NyayOS is not deciding which is correct.”

Show side-by-side source snippets.

Actions:

- confirm difference;
- resolve with user;
- leave unresolved.

Never show “truth score.”

---

# 10. Evidence gaps

Title:

> **What may still be useful**

Each gap has:

- missing item;
- reason;
- related document;
- user response.

Avoid language that implies the event is disproved.

---

# 11. Issue classification

Display:

- likely category;
- alternative category;
- supporting facts;
- confidence;
- sources.

Copy:

> “This is a classification to help organize the file, not a legal determination.”

---

# 12. Verified information

Each item:

- plain-language explanation;
- source title;
- publisher;
- jurisdiction;
- date/version;
- source link;
- last verified.

If source retrieval fails:

> “NyayOS could not verify this from its current source set.”

---

# 13. Possible paths

Cards:

- Direct resolution
- Written communication
- Mediation / ODR where applicable
- Legal-aid route where relevant
- Professional review
- Formal proceeding where appropriate

Do not rank paths as “best.”

---

# 14. Action plan

Each task:

- task;
- why;
- evidence;
- owner;
- deadline status;
- urgency;
- completion state.

Use:

**Verified deadline**

vs.

**No verified deadline**

---

# 15. Human review

CTA:

> **Prepare a professional-ready case file**

Explain:

> “NyayOS organizes the material so a qualified professional can review it efficiently.”

User explicitly selects what to share.

---

# 16. Export center

Tabs:

- Summary
- Full case file
- Evidence index
- Timeline
- Sources

Export footer:

- AI-generated content present;
- export version;
- generated timestamp;
- source status.

---

# 17. Privacy controls

Every dispute has:

- Share
- Stop sharing
- Correct
- Export
- Delete

The user must be able to see who currently has access.

---

# 18. Mobile-first

Priority order:

1. Intake
2. Upload
3. Fact confirmation
4. Timeline
5. Export

Desktop adds density, not different product logic.
