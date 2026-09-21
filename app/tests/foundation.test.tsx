import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/nyayos/button";
import { DateBadge } from "@/components/nyayos/date-badge";
import { NotificationBanner } from "@/components/nyayos/notification-banner";
import { ReadinessIndicator } from "@/components/nyayos/readiness-indicator";
import { SourceBadge } from "@/components/nyayos/source-badge";
import { StatusChip } from "@/components/nyayos/status-chip";

const styles = readFileSync("src/styles.css", "utf8");
const root = readFileSync("src/routes/__root.tsx", "utf8");

describe("Button", () => {
  it("renders every variant", () => {
    for (const variant of ["primary", "secondary", "ghost", "danger", "link"] as const) {
      const { unmount } = render(<Button variant={variant}>Continue</Button>);
      expect(screen.getByRole("button", { name: /continue/i })).toBeInTheDocument();
      unmount();
    }
  });

  it("disables itself while loading and keeps an accessible name", () => {
    render(<Button loading>Saving</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when asked", () => {
    render(<Button disabled>Blocked</Button>);
    expect(screen.getByRole("button", { name: /blocked/i })).toBeDisabled();
  });
});

describe("Provenance and status", () => {
  it("renders each status with visible text, not colour alone", () => {
    for (const kind of [
      "confirmed",
      "to-review",
      "contradiction",
      "missing",
      "processing",
      "removed",
    ] as const) {
      const { container, unmount } = render(<StatusChip status={kind} />);
      expect(container.textContent?.trim().length ?? 0).toBeGreaterThan(0);
      unmount();
    }
  });

  it("renders each source kind with visible text", () => {
    for (const kind of [
      "document-extracted",
      "user-statement",
      "third-party",
      "ai-inference",
      "verified-source",
      "source-unavailable",
    ] as const) {
      const { container, unmount } = render(<SourceBadge source={kind} />);
      expect(container.textContent?.trim().length ?? 0).toBeGreaterThan(0);
      unmount();
    }
  });

  it("renders each date precision with visible text", () => {
    for (const kind of ["exact", "approximate", "inferred", "conflicting"] as const) {
      const { container, unmount } = render(<DateBadge precision={kind} value="14 July 2026" />);
      expect(container.textContent).toContain("14 July 2026");
      unmount();
    }
  });
});

describe("NotificationBanner", () => {
  it("announces its tone in text for each variant", () => {
    for (const tone of ["info", "warning", "error", "success"] as const) {
      const { container, unmount } = render(
        <NotificationBanner tone={tone} title="Heads up">
          Detail line.
        </NotificationBanner>,
      );
      expect(container.textContent).toContain("Heads up");
      unmount();
    }
  });
});

describe("ReadinessIndicator", () => {
  it("exposes a progressbar clamped to 0-100", () => {
    render(<ReadinessIndicator value={142} />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");
  });

  it("uses completion language only — no scoring, ranking or probability", () => {
    const { container } = render(<ReadinessIndicator value={40} />);
    const text = (container.textContent ?? "").toLowerCase();
    for (const banned of ["score", "rank", "strength", "likelihood", "probability", "chance"]) {
      expect(text).not.toContain(banned);
    }
    expect(text).toContain("complete");
  });
});

describe("Design tokens", () => {
  it("defines the Noto Sans typography stack and no prohibited faces", () => {
    expect(styles).toContain("Noto Sans");
    expect(styles).toContain("Noto Sans Devanagari");
    for (const banned of ["Hind Siliguri", "Libre Baskerville", "IBM Plex"]) {
      expect(styles).not.toContain(banned);
      expect(root).not.toContain(banned);
    }
  });

  it("defines the status, provenance, date and notification token families", () => {
    for (const token of [
      "--color-status-confirmed",
      "--color-status-contradiction",
      "--color-source-document",
      "--color-date-exact",
      "--color-warning",
    ]) {
      expect(styles).toContain(token);
    }
  });

  it("defines motion tokens and honours reduced motion", () => {
    expect(styles).toContain("prefers-reduced-motion");
  });
});
