import { configure } from "@utk09/ui-observability";
export { getLogger } from "@utk09/ui-observability";

/**
 * Log level: DEBUG in development, WARN in production.
 */
const level = import.meta.env.DEV ? "DEBUG" : "WARN";

/**
 * Initialize observability and logging for the application.
 */
configure({
  endpoint: "",
  serviceName: "stardela",
  storage: "none",
  bus: { mode: "off" },
  minLevel: level,
  console: level,
  otelLoader: () => Promise.reject(new Error("@opentelemetry/api is not installed")),
});
