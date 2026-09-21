import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { A as CalendarCheck, C as CircleCheck, D as CalendarSearch, E as CalendarX, M as Accessibility, O as CalendarMinus, S as CircleDashed, T as Check, _ as Clock, a as Sparkles, b as CircleMinus, c as PanelLeftClose, d as MessageSquare, f as LoaderCircle, g as FilePenLine, h as FileText, i as Trash2, j as BadgeCheck, k as CalendarClock, l as Palette, m as Info, n as Users, o as PencilLine, p as LayoutGrid, r as TriangleAlert, s as PanelLeftOpen, t as X, u as Navigation, v as CircleX, w as CircleAlert, x as CircleDotDashed, y as CircleQuestionMark } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region ../../../dev-server/node_modules/.nitro/vite/services/ssr/assets/routes-BWWL0AiS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var NAV = [
	{
		id: "tokens",
		label: "Tokens",
		icon: Palette
	},
	{
		id: "components",
		label: "Components",
		icon: LayoutGrid
	},
	{
		id: "navigation",
		label: "Navigation",
		icon: Navigation
	},
	{
		id: "accessibility",
		label: "Access",
		icon: Accessibility
	}
];
/**
* Responsive navigation shell: one navigation model rendered three ways.
*  - mobile  (< md): bottom tab bar
*  - tablet  (md):   left rail, collapsed or expanded
*  - desktop (lg+):  sidebar, collapsed or expanded
*
* The shell holds no product workflow — it frames the foundation showcase only.
*/
function AppShell({ current, onNavigate, children }) {
	const [expanded, setExpanded] = import_react.useState(true);
	const navButton = (item, opts) => {
		const Icon = item.icon;
		const active = current === item.id;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => onNavigate(item.id),
			"aria-current": active ? "page" : void 0,
			"aria-label": opts.showLabel ? void 0 : item.label,
			title: opts.showLabel ? void 0 : item.label,
			className: cn("flex touch-target items-center gap-2.5 rounded-md px-3 text-sm font-medium transition-colors duration-[var(--animate-duration-fast)] ease-[var(--ease-standard)]", opts.layout === "vertical" && "w-full py-2.5", opts.layout === "horizontal" && "flex-1 flex-col justify-center gap-1 py-1.5 text-xs", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
					"aria-hidden": "true",
					className: "size-5 shrink-0"
				}),
				opts.showLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: item.label
				}) : null,
				active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: " (current)"
				}) : null
			]
		}, item.id);
	};
	const collapseToggle = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: () => setExpanded((v) => !v),
		"aria-expanded": expanded,
		"aria-label": expanded ? "Collapse navigation" : "Expand navigation",
		title: expanded ? "Collapse navigation" : "Expand navigation",
		className: "flex touch-target w-full items-center justify-center rounded-md text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
		children: expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, {
			"aria-hidden": "true",
			className: "size-5"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, {
			"aria-hidden": "true",
			className: "size-5"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:ring-2 focus:ring-ring",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-screen",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					"aria-label": "Foundation sections",
					className: cn("hidden shrink-0 flex-col gap-1 border-r border-sidebar-border bg-sidebar p-2 md:flex", expanded ? "md:w-48 lg:w-60" : "md:w-16"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 px-1 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								className: "grid size-8 shrink-0 place-items-center rounded-md bg-primary font-serif text-sm text-primary-foreground",
								children: "N"
							}), expanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate font-serif text-sm text-sidebar-foreground",
								children: "NyayOS"
							}) : null]
						}),
						NAV.map((item) => navButton(item, {
							showLabel: expanded,
							layout: "vertical"
						})),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-auto",
							children: collapseToggle
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					id: "main",
					className: "min-w-0 flex-1 pb-24 md:pb-8",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Foundation sections",
				className: "fixed inset-x-0 bottom-0 z-40 flex gap-1 border-t border-sidebar-border bg-sidebar px-2 pb-[env(safe-area-inset-bottom)] pt-1 md:hidden",
				children: NAV.map((item) => navButton(item, {
					showLabel: true,
					layout: "horizontal"
				}))
			})
		]
	});
}
/**
* Foundation Button. Variants and states only — no domain behaviour.
* All colors come from semantic tokens. Minimum target size is 44x44.
*/
var buttonVariants = cva("relative inline-flex touch-target items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors duration-200 ease-[var(--ease-standard)] disabled:pointer-events-none disabled:opacity-50", {
	variants: {
		variant: {
			primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80",
			secondary: "border border-border-strong bg-card text-foreground hover:bg-accent active:bg-accent/80",
			ghost: "text-foreground hover:bg-accent active:bg-accent/80",
			danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
			link: "text-primary underline underline-offset-4 hover:no-underline active:opacity-80"
		},
		size: {
			default: "px-4 py-2.5",
			compact: "px-3 py-2 text-sm"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, loading = false, loadingLabel = "Working", children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
	ref,
	...props,
	type: props.type ?? "button",
	"aria-busy": loading || void 0,
	disabled: Boolean(props.disabled || loading),
	className: cn(buttonVariants({
		variant,
		size
	}), className),
	children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
		"aria-hidden": "true",
		className: "size-4 animate-spin"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "sr-only",
		children: loadingLabel
	})] }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(loading && "opacity-70"),
		children
	})]
}));
Button.displayName = "Button";
var CONFIDENCE = {
	low: {
		label: "Low confidence",
		classes: "bg-confidence-low-surface text-confidence-low border-confidence-low/30",
		icon: CircleAlert
	},
	medium: {
		label: "Medium confidence",
		classes: "bg-confidence-medium-surface text-confidence-medium border-confidence-medium/30",
		icon: CircleDotDashed
	},
	high: {
		label: "High confidence",
		classes: "bg-confidence-high-surface text-confidence-high border-confidence-high/30",
		icon: CircleCheck
	}
};
/** Describes bounded extraction confidence, never truth or outcome probability. */
function ConfidenceBand({ band, className }) {
	const config = CONFIDENCE[band];
	const Icon = config.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium", config.classes, className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				"aria-hidden": "true",
				className: "size-3.5 shrink-0"
			}),
			config.label,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: " for extraction"
			})
		]
	});
}
var PRECISION = {
	exact: {
		label: "Exact date",
		classes: "bg-date-exact-surface text-date-exact border-date-exact/30",
		icon: CalendarCheck
	},
	approximate: {
		label: "Approximate date",
		classes: "bg-date-approximate-surface text-date-approximate border-date-approximate/30",
		icon: CalendarClock
	},
	inferred: {
		label: "Inferred date",
		classes: "bg-date-inferred-surface text-date-inferred border-date-inferred/30 border-dashed",
		icon: CalendarSearch
	},
	conflicting: {
		label: "Conflicting dates",
		classes: "bg-date-conflicting-surface text-date-conflicting border-date-conflicting/30",
		icon: CalendarX
	},
	"unknown-date": {
		label: "Date unknown",
		classes: "bg-date-unknown-surface text-date-unknown border-date-unknown/30 border-dashed",
		icon: CalendarMinus
	}
};
/**
* Date Badge — date precision. An inferred or approximate date is never
* presented with the same visual weight as an exact one.
*/
function DateBadge({ precision, value, className }) {
	const config = PRECISION[precision];
	const Icon = config.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs", config.classes, className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				"aria-hidden": "true",
				className: "size-3.5 shrink-0"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn(precision === "exact" ? "font-semibold" : "font-normal italic"),
				children: precision === "unknown-date" ? config.label : value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "sr-only",
				children: [", ", config.label]
			}),
			precision === "unknown-date" ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				"aria-hidden": "true",
				className: "opacity-80",
				children: ["· ", config.label]
			})
		]
	});
}
var controlBase = "w-full touch-target rounded-md border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-200 ease-[var(--ease-standard)] disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";
/**
* Foundation Input. One accessible label/hint/error pattern for every field
* kind. Error state is conveyed by text plus border, never colour alone.
*/
function InputField({ id, label, kind = "text", hint, error, disabled, placeholder, defaultValue, className }) {
	const hintId = hint ? `${id}-hint` : void 0;
	const errorId = error ? `${id}-error` : void 0;
	const describedBy = [hintId, errorId].filter(Boolean).join(" ") || void 0;
	const control = cn(controlBase, error ? "border-error" : "border-input hover:border-border-strong", className);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: id,
				className: "text-sm font-medium text-foreground",
				children: label
			}),
			kind === "textarea" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				id,
				rows: 4,
				disabled,
				placeholder,
				defaultValue,
				"aria-invalid": error ? true : void 0,
				"aria-describedby": describedBy,
				className: cn(control, "min-h-28 resize-y")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id,
				type: kind === "text" ? "text" : kind,
				disabled,
				placeholder,
				defaultValue,
				"aria-invalid": error ? true : void 0,
				"aria-describedby": describedBy,
				className: cn(control, kind === "file" && "file:mr-3 file:text-sm")
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				id: hintId,
				className: "text-xs text-muted-foreground",
				children: hint
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				id: errorId,
				className: "text-xs font-medium text-error",
				children: error
			}) : null
		]
	});
}
var fieldClass = "w-full touch-target rounded-md border border-input bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground hover:border-border-strong disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground";
function InlineCorrectionInput({ id, label, originalValue, initialValue = "", error, disabled = false, saving = false, onSave, onCancel }) {
	const [value, setValue] = import_react.useState(initialValue);
	const [reason, setReason] = import_react.useState("");
	const originalId = `${id}-original`;
	const errorId = error ? `${id}-error` : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-4",
		onSubmit: (event) => {
			event.preventDefault();
			onSave?.(value, reason);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium text-muted-foreground",
				children: "Original value"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				id: originalId,
				className: "mt-1 rounded-md bg-surface-sunken px-3 py-2 text-sm text-foreground",
				children: originalValue
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: id,
						className: "text-sm font-medium text-foreground",
						children: label
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id,
						value,
						onChange: (event) => setValue(event.target.value),
						disabled: disabled || saving,
						"aria-invalid": error ? true : void 0,
						"aria-describedby": [originalId, errorId].filter(Boolean).join(" "),
						className: cn(fieldClass, error && "border-error")
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						id: errorId,
						className: "text-xs font-medium text-error",
						children: error
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					htmlFor: `${id}-reason`,
					className: "text-sm font-medium text-foreground",
					children: ["Reason ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-normal text-muted-foreground",
						children: "(optional)"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					id: `${id}-reason`,
					rows: 2,
					value: reason,
					onChange: (event) => setReason(event.target.value),
					disabled: disabled || saving,
					className: cn(fieldClass, "min-h-20 resize-y")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					disabled: disabled || saving,
					onClick: onCancel,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					loading: saving,
					disabled: disabled || !value.trim(),
					children: "Save correction"
				})]
			})
		]
	});
}
var TONE = {
	info: {
		classes: "bg-info-surface text-info border-info/30",
		icon: Info,
		role: "status"
	},
	warning: {
		classes: "bg-warning-surface text-warning border-warning/30",
		icon: TriangleAlert,
		role: "status"
	},
	error: {
		classes: "bg-error-surface text-error border-error/30",
		icon: CircleX,
		role: "alert"
	},
	success: {
		classes: "bg-success-surface text-success border-success/30",
		icon: CircleCheck,
		role: "status"
	}
};
/**
* Notification Banner. Tone is announced in text as well as colour.
*/
function NotificationBanner({ tone, title, children, onDismiss, className }) {
	const config = TONE[tone];
	const Icon = config.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: config.role,
		"aria-live": tone === "error" ? "assertive" : "polite",
		className: cn("flex gap-3 rounded-lg border p-3.5", config.classes, className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				"aria-hidden": "true",
				className: "mt-0.5 size-5 shrink-0"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "sr-only",
						children: [tone, ": "]
					}), title]
				}), children ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-sm text-foreground/80",
					children
				}) : null]
			}),
			onDismiss ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onDismiss,
				"aria-label": `Dismiss ${tone} message`,
				className: "-my-1.5 -mr-1.5 inline-flex touch-target items-center justify-center rounded-md hover:bg-foreground/5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
					"aria-hidden": "true",
					className: "size-4"
				})
			}) : null
		]
	});
}
/**
* Progress Indicator — readiness percentage only.
*
* Deliberately carries no score, ranking, strength, likelihood or probability
* language. It reports how much of the information set has been assembled and
* nothing about outcomes.
*/
function ReadinessIndicator({ value, label = "Information readiness", description, className }) {
	const pct = Math.max(0, Math.min(100, Math.round(value)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col gap-2", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-medium text-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-sm text-muted-foreground",
					children: [pct, "% complete"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "progressbar",
				"aria-valuenow": pct,
				"aria-valuemin": 0,
				"aria-valuemax": 100,
				"aria-label": `${label}: ${pct} percent complete`,
				className: "h-2.5 w-full overflow-hidden rounded-full bg-surface-sunken ring-1 ring-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full bg-primary transition-[width] duration-[var(--animate-duration-slow)] ease-[var(--ease-standard)]",
					style: { width: `${pct}%` }
				})
			}),
			description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: description
			}) : null
		]
	});
}
var SOURCE = {
	"document-extracted": {
		label: "From document",
		classes: "bg-source-document-surface text-source-document border-source-document/30",
		icon: FileText
	},
	"user-statement": {
		label: "Your statement",
		classes: "bg-source-statement-surface text-source-statement border-source-statement/30",
		icon: MessageSquare
	},
	"third-party": {
		label: "Third party",
		classes: "bg-source-third-party-surface text-source-third-party border-source-third-party/30",
		icon: Users
	},
	"ai-inference": {
		label: "AI inference",
		classes: "bg-source-inference-surface text-source-inference border-source-inference/30",
		icon: Sparkles
	},
	"verified-source": {
		label: "Verified source",
		classes: "bg-source-verified-surface text-source-verified border-source-verified/30",
		icon: BadgeCheck
	},
	"source-unavailable": {
		label: "Source unavailable",
		classes: "bg-source-unavailable-surface text-source-unavailable border-source-unavailable/30",
		icon: CircleQuestionMark
	},
	"user-correction": {
		label: "User correction",
		classes: "bg-source-correction-surface text-source-correction border-source-correction/30",
		icon: FilePenLine
	}
};
/**
* Source Badge — provenance of a piece of information. Provenance is always
* shown alongside content so a claim, a verified fact and an AI inference stay
* visually distinct.
*/
function SourceBadge({ source, detail, className }) {
	const config = SOURCE[source];
	const Icon = config.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium", config.classes, className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				"aria-hidden": "true",
				className: "size-3.5 shrink-0"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Source: "
			}),
			config.label,
			detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "font-normal opacity-80",
				children: ["· ", detail]
			}) : null
		]
	});
}
var STATUS = {
	confirmed: {
		label: "Confirmed",
		classes: "bg-status-confirmed-surface text-status-confirmed border-status-confirmed/30",
		icon: Check
	},
	"to-review": {
		label: "To review",
		classes: "bg-status-review-surface text-status-review border-status-review/30",
		icon: Clock
	},
	contradiction: {
		label: "Information to review",
		classes: "bg-status-contradiction-surface text-status-contradiction border-status-contradiction/30",
		icon: TriangleAlert
	},
	missing: {
		label: "Missing",
		classes: "bg-status-missing-surface text-status-missing border-status-missing/30",
		icon: CircleDashed
	},
	processing: {
		label: "Processing",
		classes: "bg-status-processing-surface text-status-processing border-status-processing/30",
		icon: LoaderCircle
	},
	removed: {
		label: "Removed",
		classes: "bg-status-removed-surface text-status-removed border-status-removed/30",
		icon: Trash2
	},
	uncertain: {
		label: "Uncertain",
		classes: "bg-status-uncertain-surface text-status-uncertain border-status-uncertain/30",
		icon: CircleQuestionMark
	},
	"not-relevant": {
		label: "Not relevant",
		classes: "bg-status-not-relevant-surface text-status-not-relevant border-status-not-relevant/30",
		icon: CircleMinus
	},
	corrected: {
		label: "Corrected",
		classes: "bg-status-corrected-surface text-status-corrected border-status-corrected/30",
		icon: PencilLine
	}
};
/**
* Status Chip — confirmation state of a fact or document.
* Never expresses a score, ranking or likelihood.
*/
function StatusChip({ status, label, className }) {
	const config = STATUS[status];
	const Icon = config.icon;
	const text = label ?? config.label;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium", config.classes, className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				"aria-hidden": "true",
				className: cn("size-3.5 shrink-0", status === "processing" && "animate-spin")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Status: "
			}),
			text
		]
	});
}
function Section({ title, subtitle, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-b border-border px-4 py-8 last:border-0 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-xl text-foreground",
				children: title
			}),
			subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm text-muted-foreground",
				children: subtitle
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children
			})
		]
	});
}
function Panel({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-token-sm)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-wrap items-center gap-3",
			children
		})]
	});
}
var TOKEN_SWATCHES = [
	{
		name: "background",
		className: "bg-background"
	},
	{
		name: "surface-raised",
		className: "bg-surface-raised"
	},
	{
		name: "surface-sunken",
		className: "bg-surface-sunken"
	},
	{
		name: "primary",
		className: "bg-primary"
	},
	{
		name: "secondary",
		className: "bg-secondary"
	},
	{
		name: "accent",
		className: "bg-accent"
	},
	{
		name: "muted",
		className: "bg-muted"
	},
	{
		name: "destructive",
		className: "bg-destructive"
	},
	{
		name: "info",
		className: "bg-info"
	},
	{
		name: "warning",
		className: "bg-warning"
	},
	{
		name: "error",
		className: "bg-error"
	},
	{
		name: "success",
		className: "bg-success"
	}
];
function TokensView() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Colour roles",
			subtitle: "Every colour in the product is a semantic token. Components never hold raw colour values.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
				children: TOKEN_SWATCHES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg border border-border bg-card p-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-12 rounded-md ring-1 ring-border ${t.className}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-mono text-xs text-muted-foreground",
						children: t.name
					})]
				}, t.name))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Typography",
			subtitle: "Noto Sans for headings and body text, Noto Sans Devanagari for Hindi, Noto Sans Mono for values.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-3xl text-foreground",
						children: "What happened?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-xl text-foreground",
						children: "Section heading"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base text-foreground",
						children: "Body text. Tell us what happened in your own words."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Supporting text and hints."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-sm text-foreground",
						children: "14 July 2026 · page 2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						lang: "hi",
						className: "space-y-2 rounded-lg border border-border bg-card p-3",
						style: { fontFamily: "var(--font-devanagari)" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-2xl text-foreground",
								children: "क्या हुआ था?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base text-foreground",
								children: "अपनी बात अपने शब्दों में बताइए। तारीख़, नाम और दस्तावेज़ जोड़ सकते हैं।"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "सहायक पाठ — हिन्दी और अंग्रेज़ी एक ही टाइप स्केल साझा करते हैं।"
							})
						]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Spacing, radius, shadow and motion",
			subtitle: "Shared scales keep every screen consistent.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						label: "Spacing scale",
						children: [
							1,
							2,
							3,
							4,
							6,
							8,
							12
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto bg-primary",
								style: {
									width: s * 4,
									height: 16
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-xs text-muted-foreground",
								children: s * 4
							})]
						}, s))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						label: "Radius",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-12 rounded-sm bg-secondary ring-1 ring-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-12 rounded-md bg-secondary ring-1 ring-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-12 rounded-lg bg-secondary ring-1 ring-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-12 rounded-full bg-secondary ring-1 ring-border" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						label: "Shadow",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-16 rounded-lg bg-card shadow-[var(--shadow-token-sm)]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-16 rounded-lg bg-card shadow-[var(--shadow-token-md)]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-16 rounded-lg bg-card shadow-[var(--shadow-token-lg)]" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						label: "Motion (reduced-motion aware)",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-10 animate-pulse rounded-full bg-status-processing-surface ring-1 ring-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "120ms / 200ms / 320ms with a shared easing curve. All motion collapses when the operating system requests reduced motion."
						})]
					})
				]
			})
		})
	] });
}
function ComponentsView() {
	const [dismissed, setDismissed] = import_react.useState(false);
	const [correctionMessage, setCorrectionMessage] = import_react.useState("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Button",
			subtitle: "Five variants across default, hover, active, disabled and loading states.",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					"primary",
					"secondary",
					"ghost",
					"danger",
					"link"
				].map((variant) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					label: variant,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant,
							children: "Default"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant,
							disabled: true,
							children: "Disabled"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant,
							loading: true,
							children: "Loading"
						})
					]
				}, variant))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: "Hover and active states are applied on pointer interaction; focus is always visible on keyboard navigation."
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Input",
			subtitle: "Text, long text, date, file and search — each with default, focus, error and disabled states.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-5 sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputField, {
						id: "f-text",
						label: "Text",
						kind: "text",
						placeholder: "Supplier name",
						hint: "Default state."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputField, {
						id: "f-textarea",
						label: "Long text",
						kind: "textarea",
						placeholder: "Tell us what happened in your own words."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputField, {
						id: "f-date",
						label: "Date",
						kind: "date",
						hint: "Use the date you are confident about."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputField, {
						id: "f-file",
						label: "File",
						kind: "file",
						hint: "PDF, image or document."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputField, {
						id: "f-search",
						label: "Search",
						kind: "search",
						placeholder: "Search documents"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputField, {
						id: "f-error",
						label: "Text with error",
						kind: "text",
						defaultValue: "not-a-date",
						error: "Enter a date in the format 14 July 2026."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputField, {
						id: "f-disabled",
						label: "Disabled",
						kind: "text",
						disabled: true,
						defaultValue: "Locked value"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Status chip",
			subtitle: "Confirmation state of an item. No score, ranking or likelihood language.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				label: "All states",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: "confirmed" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: "to-review" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: "contradiction" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: "missing" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: "processing" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: "removed" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: "uncertain" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: "not-relevant" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, { status: "corrected" })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Source badge",
			subtitle: "Provenance stays attached to information: a statement, a verified fact and an AI inference never look alike.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				label: "All states",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceBadge, {
						source: "document-extracted",
						detail: "Invoice · page 2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceBadge, { source: "user-statement" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceBadge, { source: "third-party" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceBadge, { source: "ai-inference" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceBadge, { source: "verified-source" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceBadge, { source: "source-unavailable" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SourceBadge, {
						source: "user-correction",
						detail: "Corrected by you"
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Date badge",
			subtitle: "Date precision is always visible. Inferred and approximate dates are never shown as exact.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				label: "All states",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateBadge, {
						precision: "exact",
						value: "14 July 2026"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateBadge, {
						precision: "approximate",
						value: "Mid July 2026"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateBadge, {
						precision: "inferred",
						value: "Before 20 July 2026"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateBadge, {
						precision: "conflicting",
						value: "14 or 17 July 2026"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DateBadge, { precision: "unknown-date" })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Confidence band",
			subtitle: "Bounded extraction confidence only. It does not judge truth or predict an outcome.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				label: "All states",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceBand, { band: "low" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceBand, { band: "medium" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfidenceBand, { band: "high" })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Inline correction input",
			subtitle: "Preserves the original value while recording a user correction and optional reason.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						label: "Interactive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InlineCorrectionInput, {
								id: "correction-live",
								label: "Corrected supplier name",
								originalValue: "Asha Trading Co.",
								onSave: (value) => setCorrectionMessage(`Saved correction: ${value}`),
								onCancel: () => setCorrectionMessage("Correction cancelled")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 min-h-5 text-xs text-muted-foreground",
								"aria-live": "polite",
								children: correctionMessage
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						label: "Error",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InlineCorrectionInput, {
								id: "correction-error",
								label: "Corrected date",
								originalValue: "14 July 2026",
								initialValue: "32 July 2026",
								error: "Enter a valid date."
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						label: "Disabled and saving",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid w-full gap-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InlineCorrectionInput, {
								id: "correction-disabled",
								label: "Corrected value",
								originalValue: "Original",
								initialValue: "Correction unavailable",
								disabled: true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InlineCorrectionInput, {
								id: "correction-saving",
								label: "Corrected value",
								originalValue: "Original",
								initialValue: "Saving correction",
								saving: true
							})]
						})
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Notification banner",
			subtitle: "Tone is carried by text as well as colour, and announced to screen readers.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationBanner, {
						tone: "info",
						title: "Information",
						children: "Sources are shown for every item so you can check them yourself."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationBanner, {
						tone: "warning",
						title: "Needs your attention",
						children: "Two documents contain different information. NyayOS is not deciding which is correct."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationBanner, {
						tone: "error",
						title: "Upload failed",
						children: "That file could not be read. Try uploading it again."
					}),
					dismissed ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationBanner, {
						tone: "success",
						title: "Saved",
						onDismiss: () => setDismissed(true),
						children: "Your changes were saved. This banner can be dismissed."
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Progress indicator",
			subtitle: "Readiness percentage only — how much information is assembled, never an outcome, score or ranking.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid max-w-xl gap-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessIndicator, {
						value: 0,
						description: "Nothing assembled yet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessIndicator, {
						value: 45,
						description: "Some information is still awaiting confirmation."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessIndicator, {
						value: 100,
						description: "All requested information is assembled."
					})
				]
			})
		})
	] });
}
function NavigationView() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		title: "Navigation shell",
		subtitle: "One navigation model rendered three ways. Resize the window to see each form.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					label: "Mobile — bottom tab bar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Below 48rem the sections sit in a fixed bottom bar with icon and label, each a 44×44 target."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					label: "Tablet — left rail",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "From 48rem a left rail appears and can be collapsed to icons only; collapsed items keep accessible names and tooltips."
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					label: "Desktop — sidebar",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "From 64rem the rail widens into a sidebar with the same collapse control and the same current-section state."
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-4 text-sm text-muted-foreground",
			children: [
				"The current section is marked with ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
					className: "font-mono",
					children: "aria-current"
				}),
				" and a visible background. Use the collapse control at the bottom of the rail or sidebar."
			]
		})]
	});
}
var CHECKS = [
	{
		item: "Semantic colour tokens only, no hardcoded colours in components",
		result: "Pass"
	},
	{
		item: "Interactive targets at least 44×44",
		result: "Pass"
	},
	{
		item: "Visible focus indicator on every interactive element",
		result: "Pass"
	},
	{
		item: "Keyboard operable: tab order, Enter and Space activation",
		result: "Pass"
	},
	{
		item: "Skip-to-content link as first focusable element",
		result: "Pass"
	},
	{
		item: "Status, source and date meaning conveyed by text as well as colour",
		result: "Pass"
	},
	{
		item: "Form fields have labels, hints and errors linked programmatically",
		result: "Pass"
	},
	{
		item: "Live regions announce banner messages",
		result: "Pass"
	},
	{
		item: "Reduced-motion preference honoured globally",
		result: "Pass"
	},
	{
		item: "Formal contrast audit with an automated tool",
		result: "Not yet run"
	},
	{
		item: "Screen-reader pass with NVDA / VoiceOver",
		result: "Not yet run"
	}
];
function AccessibilityView() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		title: "Accessibility baseline",
		subtitle: "Target: WCAG 2.2 AA. Checklist state for this foundation.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto rounded-lg border border-border bg-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
						className: "sr-only",
						children: "Accessibility checklist results"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-surface-sunken text-xs uppercase tracking-wide text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							scope: "col",
							className: "px-4 py-2.5 font-semibold",
							children: "Check"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							scope: "col",
							className: "px-4 py-2.5 font-semibold",
							children: "Result"
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: CHECKS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2.5 text-foreground",
							children: c.item
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-2.5",
							children: c.result === "Pass" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, {
								status: "confirmed",
								label: "Pass"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusChip, {
								status: "to-review",
								label: c.result
							})
						})]
					}, c.item)) })
				]
			})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
		title: "Known limitations",
		subtitle: "Recorded for handoff.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "list-disc space-y-2 pl-5 text-sm text-muted-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "No approved design-token source existed in the repository; tokens were derived from the design brief language and must be reviewed against the Figma output." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Dark theme values are provided but the product does not yet expose a theme switch." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Contrast and screen-reader verification are manual so far; no automated audit run." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "This is a foundation only — no intake, evidence, fact confirmation or analysis screens, and no backend, database or AI integration." })
			]
		})
	})] });
}
function FoundationShowcase() {
	const [section, setSection] = import_react.useState("tokens");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		current: section,
		onNavigate: setSection,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b border-border bg-surface-raised px-4 py-6 sm:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Staging · Sprint 1 foundation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-serif text-2xl text-foreground sm:text-3xl",
						children: "NyayOS foundation library"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm text-muted-foreground",
						children: "Design tokens, provenance-first components and the responsive navigation shell that every later screen will be built from. No product workflow is included."
					})
				]
			}),
			section === "tokens" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TokensView, {}) : null,
			section === "components" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComponentsView, {}) : null,
			section === "navigation" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavigationView, {}) : null,
			section === "accessibility" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessibilityView, {}) : null
		]
	});
}
//#endregion
export { FoundationShowcase as component };
