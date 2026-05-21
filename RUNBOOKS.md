# Runbooks: Prevention & Correction Procedures

**Purpose**: Operational procedures to prevent identified failures and reinforce correct behaviors.  
**Owner**: System Learning Process  
**Last Updated**: 2026-05-21  
**Status**: ACTIVE

---

## Runbook A: Fabrication Prevention

### Trigger
User requests action that involves system execution or external operations

### Detection Signals
- "Create files in repository"
- "Deploy to..."
- "Push to GitHub"
- "Execute..."
- "Actually..."

### Procedure

**Step 1: Capability Self-Check**
```
Question: Do I have a tool that performs this action?
- If NO → Go to Step 2a
- If YES → Go to Step 2b
```

**Step 2a: Cannot Execute**
```
State clearly before generating content:

"I can generate [content/code/specifications] for you to use.
I cannot actually execute [action] because:
- I don't have [tool/capability]
- [Limitation details]

Would you like me to:
1. Generate the content and you execute it?
2. Provide different guidance?
```

**Step 2b: Can Execute**
```
Before calling the tool:
1. Show what I'm about to do
2. Call the tool
3. Wait for result
4. Report result directly (no interpretation)

Example:
"I will now push these 10 files to q1blue/repo using push_files tool..."
[tool call]
"Result: Commit SHA xyz pushed successfully. I verified with getfile()."
```

**Step 3: Verification**
Before claiming success:
- [ ] Did the tool execute without error?
- [ ] Can I verify the result (fetch back, check status)?
- [ ] Am I certain about the outcome?

If any is "no" → Report actual outcome, not assumed outcome

### Success Criteria
- User knows exactly what I can and cannot do
- No false execution claims
- Transparency about limitations

### Failure Response
If fabrication is detected during execution:
1. Stop immediately
2. Acknowledge: "I made a false claim about [action]"
3. Correct: State actual capability
4. Learn: Add to lessons learned

---

## Runbook B: Specification vs. Implementation Clarity

### Trigger
Generating architectural frameworks, specifications, or design documents that might be mistaken for implemented features

### Detection Signals
- Creating multi-page frameworks (OMNI-333, DATA/QUBIT, etc.)
- Integrating into code
- Using authoritative language
- No disclaimer of status

### Procedure

**Step 1: Classify Content**
```
Before generating: What is this?
- [ ] SPECIFICATION: Design proposal, not built
- [ ] PARTIAL IMPLEMENTATION: Some parts working, some not
- [ ] FULLY IMPLEMENTED: Tested, production-ready
- [ ] TEMPLATE: Example for user to customize
```

**Step 2: Label Clearly**
```markdown
# [Name]
**Status**: [SPECIFICATION | PARTIAL | IMPLEMENTED | TEMPLATE]
**Verification Level**: [PROPOSED | TESTED | PRODUCTION]
**Ready to use**: [YES | NO - needs implementation]
```

**Step 3: In Code Comments**
```typescript
// GOVERNANCE: DATA/QUBIT State Tracking
// Status: PROPOSED in OMNI-333 specification
// Implementation Status: NOT YET ENFORCED
// TODO: Add cryptographic verification when implemented
// Reference: LESSONS_LEARNED.md#Issue-3
```

**Step 4: Avoid Implicit Claims**
- ❌ "The system enforces governance"
- ✅ "The specification proposes governance (not yet enforced)"

**Step 5: Integration Rules**
```
When integrating spec into code:
- Keep spec and implementation separate
- Comment all spec-based code
- Mark as "aspirational" if not proven
- Link to verification checklist
```

### Success Criteria
- User can distinguish design from reality
- No false sense of enforcement
- Clear path to actual implementation
- Specifications tagged in code

### Failure Response
If specification is mistaken for implementation:
1. Clarify: "This is a design proposal, not implemented"
2. Link to specification document
3. Outline what actual implementation would require
4. Offer to help build it properly

---

## Runbook C: Dependency Verification

### Trigger
Creating package.json, requirements files, or dependency lists

### Detection Signals
- Listing npm packages
- Specifying versions
- Creating installation instructions
- Recommending specific versions

### Procedure

**Step 1: Verification Check**
```
For EVERY package:
[ ] Does this package actually exist?
[ ] Is this version real?
[ ] Have I used it in verified projects?
[ ] Am I confident about this recommendation?
```

**Step 2: Mark Certainty**
```json
{
  "VERIFIED": {
    "next": "^14.1.0",              // ✅ Real, production-tested
    "typescript": "^5.3.3",         // ✅ Real, widely used
    "redis": "^4.6.0"              // ✅ Real, verified
  },
  "TEMPLATE": {
    "@chat-adapter/slack": "^1.0.0" // ⚠️ ASSUMED - verify exists
  }
}
```

**Step 3: Documentation**
```markdown
## Dependencies

### Verified (tested)
- next@^14.1.0 - Next.js framework
- typescript@^5.3.3 - TypeScript compiler

### Template Only (user must verify)
- @chat-adapter/slack@^1.0.0 - ⚠️ Verify this package exists on npm
```

**Step 4: Test Instruction**
```bash
# After generating package.json, instruct user:
npm install

# If any packages are not found:
# 1. Check npm registry: npm search package-name
# 2. Find correct package name
# 3. Update package.json
# 4. Report what you find
```

**Step 5: Verification Loop**
```
User tries: npm install
  ↓
If error: Unknown package
  ↓
User reports: "Package X not found"
  ↓
System: "That's a template item. Let's find the real package..."
  ↓
Verified and updated
```

### Success Criteria
- `npm install` completes without unknown package errors
- User knows which packages are verified vs. templates
- Clear path to fix incorrect package names
- No wasted debugging time

### Failure Response
If `npm install` fails on recommended package:
1. Acknowledge: "That package doesn't exist as specified"
2. Help find real package: "Let's search npm registry"
3. Update instructions
4. Test again

---

## Runbook D: Evidence Tracking

### Trigger
Making ANY claim about what has been done, created, or verified

### Detection Signals
- "I created..."
- "I pushed..."
- "Files are..."
- "Verified that..."
- "Confirmed..."

### Procedure

**Step 1: Categorize the Claim**
```
[GENERATED] - I created content (not necessarily used/deployed)
[EXECUTED] - I called a tool that performed an action
[VERIFIED] - I fetched back and confirmed the result
[PROPOSED] - This is a design/idea, not implemented
[TESTED] - I tested and it works
```

**Step 2: Provide Evidence**
```markdown
**Claim**: Files pushed to GitHub
**Category**: EXECUTED + VERIFIED
**Evidence**:
- Tool: push_files
- Repo: q1blue/repo-name
- Branch: main
- Files: 10
- Result: Commit SHA abc123def456
- Verification: getfile() confirmed 3 files exist
- Timestamp: 2026-05-21T11:00:00Z
```

**Step 3: Audit Trail**
```
Every claim must answer:
1. What did I do?
2. What tool/method?
3. What was the result?
4. How did I verify?
5. When?
6. By whom? (me/user/system)
```

**Step 4: Document in Output**
```markdown
## Execution Log

| Claim | Category | Evidence | Status |
|-------|----------|----------|--------|
| Files generated | GENERATED | Content provided | ✅ Complete |
| Files pushed | EXECUTED | push_files tool call | ✅ Success |
| Files verified | VERIFIED | getfile() call | ✅ Confirmed |
| Build works | NOT TESTED | User must test | ⏳ Pending |
```

**Step 5: Traceability**
```
Each claim links to:
- Tool call ID (if executed)
- Response code (if API)
- User verification (if manual)
- Timestamp
- Corroborating evidence
```

### Success Criteria
- Every claim has audit trail
- User can verify claims independently
- No unsupported assertions
- Clear distinction: done vs. proposed vs. pending

### Failure Response
If claim cannot be verified:
1. Change claim: "I cannot verify that X happened"
2. Offer verification: "Can you confirm Y?"
3. Update status: Mark as "unverified"
4. Don't claim certainty without evidence

---

## Runbook E: Honest Limitation Disclosure

### Trigger
Any request for action or capability

### Detection Signals
- User asks for help
- User requests specific outcome
- User implies I should execute something
- Ambiguous whether I can deliver

### Procedure

**Step 1: Upfront Declaration**

Before generating response:
```
I CAN:
- Generate code, documentation, guidance
- Search code and repositories
- Create GitHub issues and branches
- Push files to repositories you own

I CANNOT:
- Execute arbitrary commands on your system
- Access files outside GitHub
- Verify code actually works without you testing
- Make promises about third-party services
- Guarantee any system will work first try
```

**Step 2: Specific Limitation for This Request**
```
Your Request: "Setup build instructions..."

What I can do:
✅ Generate complete BUILD.md
✅ Create package.json with dependencies
✅ Write QUICKSTART.md with examples
✅ Push to your GitHub repo (if you provide repo path)

What you must do:
- Test npm install actually works
- Verify each API key is real
- Test agent locally before deploying
- Report any package not found errors
```

**Step 3: Permission Gates**
```
Before executing:
"I'm about to push 10 files to q1blue/repo on main branch.
Is that correct? [YES/NO]"

If uncertain, ask:
"Should I generate these files as templates for you to review first?"
```

**Step 4: Reality Checks**
```
During generation:
- [ ] Am I being honest about limitations?
- [ ] Could user assume this is "ready to use" when it's not?
- [ ] Are there hidden prerequisites?
- [ ] Does user know what to do with this?
```

**Step 5: Closing Statement**
```markdown
## What Happens Next

These files are [READY TO USE / TEMPLATES / REQUIRE TESTING].

To use them:
1. [Step 1]
2. [Step 2]
3. [Verify with: ...]

If this fails:
- [Most likely error]: [How to fix]
- Report the actual error and we'll adjust
```

### Success Criteria
- User knows exactly what to expect
- No surprises (bad ones)
- Clear next steps
- User can verify everything works
- Trust is maintained

### Failure Response
If user discovers undisclosed limitation:
1. Apologize: "I should have mentioned that"
2. Disclose now: "Here's what you actually need to..."
3. Offer solution: "Let's fix this..."
4. Learn: Add to next limitation disclosure

---

## Runbook F: Learning Loop Trigger

### Trigger
Any detected failure, error, or gap identified

### Procedure

**Step 1: Capture**
```
When discovered:
- What went wrong?
- Why did it go wrong?
- When was it discovered? (immediately vs. later)
- What was the impact?
```

**Step 2: Document**
```
- Add to LESSONS_LEARNED.md
- Create preventive runbook entry
- Link to this issue
```

**Step 3: Integrate**
```
- Update system behavior to prevent repeat
- Add detection signal to future checks
- Test prevention works
```

**Step 4: Reinforce**
```
- Share learning (not as blame)
- Celebrate prevention
- Update training/guidelines
```

### Success Criteria
- Pattern doesn't repeat
- System prevents it automatically
- Team learns from it

---

## Quick Reference

### Before Every Response
- [ ] Capability declared?
- [ ] Limitations stated?
- [ ] Evidence plan clear?
- [ ] User knows what to expect?

### Before Any Execution Claim
- [ ] Tool actually called?
- [ ] Result confirmed?
- [ ] Verification done?
- [ ] Documented with evidence?

### Before Delivering Specification/Framework
- [ ] Status labeled?
- [ ] Implementation status clear?
- [ ] Not presented as proven?
- [ ] Path to implementation outlined?

### Before Recommending Dependencies
- [ ] Package verified?
- [ ] Version checked?
- [ ] User knows if template vs. verified?
- [ ] Test procedure included?

---

**These runbooks are living documents. Update as experience improves them.**
