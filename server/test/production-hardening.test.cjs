const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");const root=path.join(__dirname,"..","src");const read=p=>fs.readFileSync(path.resolve(root,p),"utf8");
test("production auth has no insecure default JWT secret",()=>{const s=read("config/env.ts");assert.ok(!s.includes('JWT_SECRET: process.env.JWT_SECRET || "supersecretkey"'))});
test("public election endpoints are rate limited",()=>{const s=read("routes/electionRoutes.ts");for(const token of["receiptLimit","publicResultsLimit","certificateLimit","transparencyLimit"])assert.ok(s.includes(token))});
test("unified readiness requires health backup and config freeze",()=>{const s=read("services/electionReadinessService.ts");for(const id of['["system_health"','["backup"','["config_freeze"','["launch_approvals"'])assert.ok(s.includes(id));assert.ok(s.includes('backupVerified?"pass":"fail"'))});
test("payment webhook returns retryable server failure",()=>{const s=read("controllers/paymentController.ts");assert.ok(s.includes('Paystack webhook error'));assert.ok(s.includes("sendStatus(500)"))});
test("new candidate voting codes use six digits",()=>{const s=read("controllers/candidateController.ts");assert.ok(s.includes("100000+crypto.randomInt(900000)"))});

test("navigation does not default missing role to owner",()=>{const s=read("../client/src/components/layout/Sidebar.tsx");assert.ok(!s.includes('eventRole||"owner"'))});
test("election backups exclude voter codes and external ids",()=>{const s=read("controllers/electionBackupController.ts");assert.ok(!s.includes('id,voter_code,external_id,is_eligible'))});
