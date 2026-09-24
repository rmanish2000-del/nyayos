/**
 * NyayOS FM-A domain foundation (A-030).
 *
 * Framework-agnostic types, schemas and pure functions for the FM-A security and
 * data model. No I/O, no database client, no network, no AI, no legal content.
 * Server functions (not yet built) compose these; UI components import only the
 * types and copy.
 *
 * Authorisation gate: FA-001 (staging build allowed; production not allowed).
 * Nothing in this package deploys or writes to any database.
 */

export * from "./enums";
export * from "./tables";
export * from "./config";
export * from "./context";
export * from "./authz";
export * from "./consent";
export * from "./identity";
export * from "./dispute";
export * from "./proposal";
export * from "./evidence";
export * from "./audit";
export * from "./export";
export * from "./deletion";
export * from "./copy";
export * from "./duplicate";
export * from "./staleness";
