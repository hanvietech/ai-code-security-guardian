<img src="docs/brand/jikimi-symbol.svg" width="56" height="56" alt="Jikimi symbol">

# Jikimi

**English** · [한국어](README.ko.md)

Jikimi is a security agent that uses AI services to find security issues in code and help you decide what to do. An agent on the developer's PC scans the code, AI suggests whether each finding is a false positive and how to fix it, and your reviewer decides according to your organization's policy, then verifies again after the fix. Built by [Hanvietech](https://hanvietech.com/en/).

> **Coming soon.** This product is preparing for launch. This repository holds public documentation: a product overview and how to use it. The product source code is not public. Features and structure described here may change before release.

**[Try the demo](https://demo.hanvietech.com/en/)** · Click through the Home, Project, Finding detail, Review inbox, and Agent setup screens with sample data. No real customer data is shown.

## How it works

1. **Security scanning**: An agent on the developer's PC finds potential security issues in your code and the open source it uses.
2. **AI + human review**: AI suggests, for each finding, whether it is a false positive and how to fix it, and a reviewer confirms.
3. **Policy decision**: Decides whether to pass, hold, or fix, based on your organization's security policy.
4. **Fix & re-scan**: Re-scans after the fix to confirm the issue is resolved. Unresolved issues flow back into scanning.

## Why Jikimi

- **Four risks in one scan**: Finds secrets, library vulnerabilities, secure coding issues, and license risks in a single scan, and organizes them on one standard.
- **Your repository stays on the developer's PC**: Scanning runs on the developer's PC, and only results and the code snippets needed are sent. Secrets are masked on the PC before anything is sent.
- **AI suggests, people decide**: AI proposes whether a finding is a false positive and how to fix it, with evidence, and your reviewer decides in the review inbox. Every decision is kept in the history.
- **In the cloud or on your internal network**: Use it as a cloud service, or install it on an internal network without internet access and connect your in-house LLM.

## Features

### Seeing results

- **Today**: The home screen starts with what needs attention: findings awaiting review, secrets that actually work, library vulnerabilities fixed by upgrading, and projects with scan problems.
- **The same issue counted once**: Shows open findings by project and category, counting the same issue once. New, recurring, and resolved findings are tracked across scans.
- **Why it matters and how to fix it**: Every finding explains why it is risky and how to fix it. Library vulnerabilities show the fixed version, and licenses show the review needed.
- **Search and filter**: Search by project, package, or CVE, and filter by category, severity, disposition, assignee, period, and more.

### Reviewing and deciding

- **AI judgment**: AI estimates whether a finding is a true positive, a false positive, or needs review, and shows its evidence and a patch suggested for your code. The AI judgment is only a suggestion and never changes the disposition.
- **Review inbox**: Collects only what a person needs to decide: findings AI judged likely to be false positives, findings whose code changed after they were handled, and findings whose risk acceptance expired.
- **Dispositions and history**: Record In progress, False positive, or Risk accepted (with a required deadline) along with a reason, and keep an assignee and notes. Handle many findings at once and undo right away; every change is kept in the finding history.
- **Exception rules**: For recurring findings, set a path or scope so the same disposition applies from now on.

### Operations

- **Roles and scope**: Set Admin, Member, and Viewer roles with project scope, and add reviewers with one-time invite links.
- **Scan operations**: Manage scan history, failures and missing installs, scheduled scans, and connected PCs in one place.
- **One-line install**: Install the agent on a developer PC with a single command created in the dashboard. The agent checks for new versions and updates itself.

## How to use it

### Security reviewers

1. **Account setup**: When Hanvietech opens your organization's account, set a password from the link you receive and sign in.
2. **Invite reviewers**: If others will work with you, set their role and project scope in **Settings → Users & roles** and send them an invite link.
3. **Send the install command**: In **Scan operations → Agents**, enter a PC name, create an install command, and send it to the developer.
4. **Results**: Check Today on the home screen and the results by project, and open a finding to see its location, why it is risky, how to fix it, and the AI judgment.
5. **Review and decide**: Decide on AI proposals and findings to look at again in the review inbox.

### Developers

Paste the install command from your security reviewer into a terminal and run it. It also prepares scanning and sets up auto-start, so there are no connection details to enter. Then scan from the project folder.

```sh
jikimi scan .   # run the scan
```

When the scan finishes, the results appear on the security reviewer's screen. macOS is supported first. Windows support is planned.

## Early access

To receive a pre-release demo and details, choose Jikimi · Doumi early access in the [contact form on hanvietech.com](https://hanvietech.com/en/#contact), or email [ceo@hanvietech.com](mailto:ceo@hanvietech.com).

Sister product: [Doumi](https://github.com/hanvietech/doumi-docs) — AI web vulnerability testing agent

---

© 2026 Hanvietech. All rights reserved.
