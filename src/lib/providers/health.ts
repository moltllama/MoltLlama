import type { ProviderHealth } from "./types";

const FAILURE_THRESHOLD = 5;
const OPEN_DURATION_MS = 60_000; // 60 seconds

/**
 * Per-provider circuit breaker.
 *
 * States:
 *  - CLOSED  (healthy): requests flow normally
 *  - OPEN    (unhealthy): after `FAILURE_THRESHOLD` consecutive failures,
 *            skip this provider for `OPEN_DURATION_MS`
 *  - HALF-OPEN: after the cooldown, allow one request through. If it
 *               succeeds → CLOSED; if it fails → OPEN again.
 */
export class CircuitBreaker {
  private consecutiveFailures = 0;
  private lastFailure: number | null = null;

  constructor(private readonly providerName: string) {}

  /** Whether the provider should be tried (CLOSED or HALF-OPEN). */
  isAvailable(): boolean {
    if (this.consecutiveFailures < FAILURE_THRESHOLD) return true;

    // Circuit is open — check if cooldown has elapsed (half-open)
    const now = Date.now();
    if (this.lastFailure && now - this.lastFailure >= OPEN_DURATION_MS) {
      return true; // half-open: allow a probe request
    }

    return false;
  }

  recordSuccess(): void {
    this.consecutiveFailures = 0;
    this.lastFailure = null;
  }

  recordFailure(): void {
    this.consecutiveFailures++;
    this.lastFailure = Date.now();
    if (this.consecutiveFailures === FAILURE_THRESHOLD) {
      console.warn(
        `[CircuitBreaker] ${this.providerName}: circuit OPEN after ${FAILURE_THRESHOLD} failures — skipping for ${OPEN_DURATION_MS / 1000}s`,
      );
    }
  }

  getHealth(): ProviderHealth {
    return {
      consecutiveFailures: this.consecutiveFailures,
      lastFailure: this.lastFailure,
      isOpen: !this.isAvailable(),
    };
  }
}
