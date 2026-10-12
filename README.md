<img src="docs/brand/jikimi-symbol.svg" width="56" height="56" alt="Jikimi symbol">

# Jikimi

**English** · [한국어](README.ko.md)

Jikimi is an AI code security agent that connects the whole process in one workflow: finding security issues in code, reviewing them with AI and people together, deciding according to your organization's policy, and verifying again after the fix. Built by [Hanvietech](https://hanvietech.com/en/).

> **In development.** This repository holds public documentation: a product overview and how to use it. The product source code is not public. Features and structure described here may change.

**[See the demo](https://demo.hanvietech.com/en/)** · Result screens built with sample data. No real customer data is shown.

## How it works

1. **Security scanning**: Finds potential security issues in your code and the open source it uses.
2. **AI + human review**: AI organizes and explains the results, and a reviewer confirms them.
3. **Policy decision**: Decides whether to pass, hold, or fix, based on your organization's security policy.
4. **Fix & re-scan**: Re-scans after the fix to confirm the issue is resolved. Unresolved issues flow back into scanning.

## Features

- **Integrated security checks**: Examines source code, open source components, secrets, and licenses in a single scan, and organizes the results on one standard.
- **Results at a glance**: Shows finding counts by project and category, counting the same issue once. New, recurring, and resolved findings are tracked across scans.
- **Why it matters and how to fix it**: Every finding explains why it is risky and how to fix it.
- **AI review**: AI classifies findings as true positive, false positive, or needs review, with its evidence and a suggested fix. AI review runs on Claude by Anthropic.
- **People make the final call**: AI judgments are suggestions. Only findings a reviewer confirms are treated as false positives and removed from the counts.

## How to use it

### Security reviewers

1. **Account setup**: When Hanvietech opens your organization's account, set a password from the link you receive and sign in.
2. **Agent distribution**: Create an agent download link in the dashboard and send it to developers.
3. **Results**: Review results by project on the dashboard, and open a finding to see its location, why it is risky, and how to fix it.
4. **AI judgments**: Review the findings AI judged likely to be false positives, with their evidence, and confirm them at once.

### Developers

Unpack the bundle from your security reviewer and run the following from the project root. Connection details are included in the bundle, so there is nothing to enter.

```sh
./jikimi install --yes   # prepare for scanning
./jikimi scan .          # run the scan
```

When the scan finishes, the results appear on the security reviewer's dashboard. macOS is supported first. Windows support is planned.

## Early access

To receive a pre-release demo and details, choose Jikimi early access in the [contact form on hanvietech.com](https://hanvietech.com/en/#contact), or email [ceo@hanvietech.com](mailto:ceo@hanvietech.com).

Sister product: [Doumi](https://github.com/hanvietech/doumi-docs) — AI web vulnerability testing agent

---

© 2026 Hanvietech. All rights reserved.
