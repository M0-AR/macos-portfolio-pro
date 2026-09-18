# Quarantine log — flaky tests are defects with owners, not background noise.
#
# Policy (verified 2026 consensus):
# - A test that fails without a related code change is quarantined within 24h:
#   it keeps running and reporting, but stops blocking merges.
# - Owner has one week to fix or delete. Otherwise it is deleted automatically.
# - Retries are a safety net for genuinely non-deterministic externals
#   (sandbox packet loss, upstream blip) — never a fix for order-dependence.
#
# Known-flaky surface (accepted, retried once inside helpers.mjs):
# - Sandbox egress: 502/503 retried once after 2s; 429 never retried (signal).
#
# | Date | Test | Symptom | Owner | Action | Status |
# |------|------|---------|-------|--------|--------|
# | — | — | — | — | — | Log is empty: no quarantined tests. |
