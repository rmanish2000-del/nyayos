# NYAYOS_RISK_REGISTER_V1

## Scope

Risk register for the NyayOS Dispute Readiness Engine.

| ID | Risk | Severity | Likelihood | Control | Trigger |
|---|---|---:|---:|---|---|
| R01 | Unsupported legal/procedural claim | Critical | Medium | source-required generation; citation audit; refusal | any high-impact unsupported claim |
| R02 | Cross-tenant data leakage | Critical | Low/unknown | RLS + server authorization + signed URLs | any unauthorized read |
| R03 | User mistakes extraction for fact | Critical | Medium | provenance + confirmation UI | high correction/confusion rate |
| R04 | OCR corrupts important evidence | High | High | confidence + source location + human confirmation | critical-field accuracy below threshold |
| R05 | AI resolves contradiction | Critical | Medium | flag-only contradiction logic | system chooses source without basis |
| R06 | Prompt injection in documents | Critical | High | data/instruction separation; closed tools; no arbitrary code | malicious test succeeds |
| R07 | Fabricated citation/source | Critical | Medium | authoritative corpus + source verification | citation audit failure |
| R08 | False deadline | Critical | Medium | verified-deadline gate | generated deadline not source-supported |
| R09 | Private case appears in public demo | Critical | Low | separate sandbox tenant; demo fixture data | any exposure |
| R10 | Product drifts into legal representation | Critical | Medium | prohibited-task controls; copy review | autonomous legal action |
| R11 | Wrong issue classification | High | Medium | alternatives + uncertainty + human confirmation | false classification changes user action |
| R12 | Low user activation | High | Medium | progressive disclosure; “What happened?” | <40% pilot intake completion |
| R13 | Low willingness to pay | High | Medium | paid pilots before scale | <10% qualified prospects accept tested paid offer |
| R14 | Individual-advocate economics fail | High | High | business/FPO payer hypothesis | >50% of qualified business users prefer free-only |
| R15 | Vendor/OCR outage | Medium | Medium | provider abstraction + retry | >5% processing failures |
| R16 | Vector retrieval is weak | High | Medium | hybrid retrieval + evaluation | citation recall fails threshold |
| R17 | Sensitive logs reveal PII | High | Medium | structured metadata; no full case text in audit logs | leakage in log review |
| R18 | Deletion claim is false | Critical | Medium | auditable deletion workflow | active data remains accessible |
| R19 | Backup retention misunderstood | High | Medium | explicit backup policy | user sees deleted item after policy window |
| R20 | Reviewer sees unshared dispute | Critical | Low | explicit share grants + RLS | unauthorized reviewer read |
| R21 | Model vendor trains on data | Critical | Medium | contractual/technical no-training setting | provider policy mismatch |
| R22 | Legal source becomes stale | Critical | Medium | version/date/source metadata | outdated law displayed as current |
| R23 | Consumer launch scope expands too early | High | High | bounded category taxonomy | >1/3 roadmap consumed by new categories |
| R24 | Architecture complexity slows validation | High | Medium | deterministic orchestration; modular providers | security/build work dominates user tests |
| R25 | Market thesis is wrong | Critical | Medium | user interviews + WTP + stop/pivot gates | no repeat pain / no payer |
| R26 | “OS” messaging returns | Medium | Medium | product copy review | homepage becomes platform abstraction |
| R27 | Government infrastructure makes feature redundant | High | Medium | integrate rather than compete | users cite existing workflow as sufficient |
| R28 | Lawyer solicitation/advertising constraints | High | Medium | legal counsel review before acquisition channel | growth depends on restricted lead-gen |
| R29 | Real-case data contaminated by development data | Critical | Medium | separate environments/tenants; no default training | private file enters test corpus |
| R30 | Export misstates source status | Critical | Medium | export schema includes provenance/status | exported “fact” lacks status |

## Top five

### 1. Unsupported claims

A legal product that fabricates authority is unacceptable.

### 2. Sensitive-data leakage

A single tenant-isolation failure can destroy trust.

### 3. Epistemic confusion

Users must know what came from them, their documents, AI extraction, inference, or authoritative sources.

### 4. Prompt injection

Uploaded documents are untrusted content and must never become system instructions.

### 5. Commercial validation failure

The business must validate a payer before scaling the product.

## Risk acceptance

NyayOS should not trade away:

- privacy;
- evidence provenance;
- source traceability;
- human review;
- correction;
- deletion;
- tenant isolation

to increase engagement, conversion or automation.
