import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const vercel = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));

test("Fallback Billing never claims the Main Store alias", () => {
  assert.ok(!(vercel.alias || []).includes("orbitfsstore.vercel.app"));
});
test("Standby Fallback never starts a duplicate shared-database mail cron", () => {
  assert.ok(!Array.isArray(vercel.crons) || vercel.crons.length === 0);
});
test("Fallback retains controlled/manual Git deployment policy", () => {
  assert.equal(vercel.git?.deploymentEnabled, false);
  assert.equal(vercel.framework, "nextjs");
});
