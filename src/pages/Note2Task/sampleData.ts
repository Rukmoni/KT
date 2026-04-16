export const SAMPLE_TRANSCRIPTS = [
  {
    label: 'Sprint Planning',
    text: `Sprint Planning Meeting - Q2 Sprint 4
Date: April 14, 2026
Attendees: Sarah Chen (PM), Marcus Johnson (Tech Lead), Priya Nair (Frontend), Tom Walsh (Backend), Anika Rao (QA)

Sarah: Alright everyone, let's kick off Sprint 4 planning. We have 14 story points carried over from Sprint 3, so let's be realistic about capacity this time.

Marcus: Before we dig in - the authentication refactor from last sprint is still blocking the mobile team. We need to prioritize that fix immediately.

Sarah: Agreed. Let's make that the first item. Marcus, can you own that? Target by Wednesday?

Marcus: Yes, I can have a PR up by Tuesday EOD.

Priya: I also need to flag that the dashboard loading time is now 6.2 seconds on production. Users are complaining in the support channel. We discussed adding skeleton loaders but never scheduled it.

Sarah: That's a P1 issue. Priya, can you scope that for this sprint?

Priya: I'll need 3 story points. I can pair with Tom to optimize the API calls at the same time.

Tom: Works for me. I've already identified two endpoints that are doing redundant queries. I'd estimate 2 points to fix those.

Anika: I want to flag a regression in the payment flow. The confirmation email is not being sent for orders over $500. This has been open for 8 days. Affects enterprise clients.

Sarah: That's critical. Tom, who should own that?

Tom: I'll take it. I need to check the email service config. Should be a quick fix but let me scope it properly — I'll update the ticket by end of day.

Sarah: Good. Also, the client from yesterday's call - Acme Corp - needs the CSV export feature by May 1st. That's a hard deadline from the account team.

Priya: CSV export isn't scoped yet. I'd estimate at least 5-6 points. We might need to push something else out.

Marcus: We could defer the dark mode ticket to Sprint 5. It's low priority and no client commitment on that.

Sarah: Agreed. Dark mode goes to backlog. Let's get CSV export scoped and added. Priya you'll own the frontend, Tom the backend endpoint?

Tom: Yes.

Sarah: Any other blockers?

Marcus: We're still waiting on design sign-off for the new onboarding flow. Can't start development without it.

Sarah: I'll follow up with the design team today and get a response by tomorrow.

Anika: One more thing — staging environment has been flaky. Deployments failing about 30% of the time. It's slowing down QA.

Sarah: I'll raise that with DevOps. Marcus, can you join a quick call with them tomorrow at 10am?

Marcus: Sure.

Sarah: Alright, let's wrap. Summary actions: Marcus owns auth fix, Priya owns dashboard performance and CSV frontend, Tom owns API optimization, email bug, and CSV backend, Anika to continue QA regression testing. I'll handle design follow-up and DevOps coordination. Next sync Thursday 9am.`,
  },
  {
    label: 'Client Delivery Review',
    text: `Client Delivery Review — RetailEdge Platform
Date: April 12, 2026
Attendees: James Whitfield (Client Director), Olivia Park (KuvantaTech PM), Dev Kapoor (Solutions Architect), Laura Simmons (Client-side PM), Raj Mehta (QA Lead)

James: Thanks for joining. We're 3 weeks from go-live and I want to make sure we're aligned on what's ready and what's not.

Olivia: Absolutely. As of today, Phases 1 and 2 are fully deployed to staging and passed UAT. Phase 3 — the inventory sync module — is still in progress.

Laura: We noticed during UAT that the product catalog search is returning incorrect results when filters are combined. Can we get an ETA on that fix?

Dev: Yes, we identified the issue — it's a query logic bug in the filtering service. I'd estimate 2 days to fix and test.

Olivia: We'll target that by April 15th. I'll create a P1 ticket and assign it to the backend team today.

James: That's fine. What about the reporting dashboard? Our ops team needs it for the launch.

Olivia: The core reporting module is complete. We're waiting on the final data model sign-off from your finance team — we sent that over on April 8th.

Laura: I'll chase that internally today and get you a response by EOD.

James: Good. One concern — the mobile app performance has been flagged by our beta testers. Load times on the product detail page are too slow.

Dev: We saw this in profiling. The image loading isn't optimized. We can implement lazy loading and CDN-based image delivery. That's roughly 3–4 days of work.

Olivia: Let's prioritize that. I'll scope it and add to the current sprint. We should also run a performance audit before go-live.

Raj: I want to raise that we found 3 critical bugs during regression testing this week. Two are fixed, one is still open — the checkout quantity update is not persisting correctly on page refresh.

Dev: I'll look at that today. Sounds like a session state issue.

Olivia: Raj, can you document all regression findings in the shared tracker by tomorrow EOD? We need full visibility before go-live.

Raj: Done by tomorrow.

James: We also need to decide on the go-live communication plan. My team needs at least 5 business days notice before we send to customers.

Olivia: Understood. If we hit our April 15th milestone, I'd target go-live on April 24th. That gives your team the 5 days.

James: That works. Let's make April 24th the target. I'll confirm internally.

Olivia: Great. I'll send a formal go-live checklist by end of week.`,
  },
];

export interface ExtractedTask {
  id: string;
  summary: string;
  description: string;
  assignee: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  issueType: 'Bug' | 'Story' | 'Task' | 'Sub-task';
  dueDate: string;
  labels: string[];
  status: 'Draft' | 'Ready' | 'Approved';
  confidence: number;
  decisions?: string;
}

export interface ExtractionResult {
  summary: string;
  decisions: string[];
  risks: string[];
  blockers: string[];
  tasks: ExtractedTask[];
}

export function mockExtract(transcript: string): ExtractionResult {
  const lc = transcript.toLowerCase();

  if (lc.includes('sprint') && lc.includes('sarah')) {
    return {
      summary:
        'Sprint 4 planning session identified key priorities: authentication refactor fix (blocking mobile), dashboard performance improvement (6.2s load), payment email regression, and CSV export feature for Acme Corp (hard May 1 deadline). Dark mode deferred to Sprint 5.',
      decisions: [
        'Dark mode ticket deferred to Sprint 5 backlog.',
        'CSV export scoped and added to Sprint 4 with hard deadline of May 1st.',
        'Auth refactor fix to be delivered Tuesday EOD to unblock mobile team.',
        'Go-live staging environment issue escalated to DevOps.',
      ],
      risks: [
        'Payment confirmation email not sent for orders >$500 — affects enterprise clients, open 8 days.',
        'Design sign-off for onboarding flow still pending, blocking development.',
        'Staging environment failing 30% of deployments, slowing QA velocity.',
      ],
      blockers: [
        'Auth refactor blocking mobile team until Marcus delivers fix.',
        'Design team approval required before onboarding development can start.',
      ],
      tasks: [
        {
          id: 'N2T-001',
          summary: 'Fix authentication refactor to unblock mobile team',
          description:
            'The authentication refactor from Sprint 3 is currently blocking the mobile team. Deliver PR by Tuesday EOD.',
          assignee: 'Marcus Johnson',
          priority: 'Critical',
          issueType: 'Bug',
          dueDate: '2026-04-15',
          labels: ['auth', 'blocker', 'mobile'],
          status: 'Draft',
          confidence: 97,
        },
        {
          id: 'N2T-002',
          summary: 'Improve dashboard load time — skeleton loaders & API optimization',
          description:
            'Dashboard load time is 6.2s on production. Add skeleton loaders (Priya, 3 pts) and optimize 2 redundant API endpoints (Tom, 2 pts).',
          assignee: 'Priya Nair',
          priority: 'High',
          issueType: 'Story',
          dueDate: '2026-04-18',
          labels: ['performance', 'dashboard', 'frontend'],
          status: 'Draft',
          confidence: 94,
        },
        {
          id: 'N2T-003',
          summary: 'Fix payment confirmation email not sent for orders over $500',
          description:
            'Regression: Confirmation emails not being dispatched for enterprise orders >$500. Open 8 days. Tom to investigate email service config and deliver fix.',
          assignee: 'Tom Walsh',
          priority: 'Critical',
          issueType: 'Bug',
          dueDate: '2026-04-14',
          labels: ['payments', 'email', 'enterprise', 'regression'],
          status: 'Draft',
          confidence: 99,
        },
        {
          id: 'N2T-004',
          summary: 'Build CSV export feature — frontend (Priya) and backend endpoint (Tom)',
          description:
            'Acme Corp requires CSV export by May 1st (hard deadline). Priya owns frontend (5-6 pts), Tom owns backend endpoint.',
          assignee: 'Priya Nair',
          priority: 'High',
          issueType: 'Story',
          dueDate: '2026-04-30',
          labels: ['export', 'csv', 'client-commitment', 'acme'],
          status: 'Draft',
          confidence: 92,
        },
        {
          id: 'N2T-005',
          summary: 'Optimize redundant API endpoint queries',
          description:
            'Two backend endpoints identified with redundant queries. Tom to refactor for performance improvement (2 story points).',
          assignee: 'Tom Walsh',
          priority: 'Medium',
          issueType: 'Task',
          dueDate: '2026-04-17',
          labels: ['backend', 'performance', 'api'],
          status: 'Draft',
          confidence: 88,
        },
        {
          id: 'N2T-006',
          summary: 'Coordinate design sign-off for onboarding flow',
          description:
            'Development blocked pending design team approval. Sarah to follow up today and get response by tomorrow.',
          assignee: 'Sarah Chen',
          priority: 'High',
          issueType: 'Task',
          dueDate: '2026-04-15',
          labels: ['design', 'onboarding', 'coordination'],
          status: 'Draft',
          confidence: 91,
        },
        {
          id: 'N2T-007',
          summary: 'Resolve staging environment deployment failures (30% failure rate)',
          description:
            'Staging deployments failing ~30% of the time, impacting QA velocity. Sarah to coordinate with DevOps. Marcus to join call tomorrow at 10am.',
          assignee: 'Sarah Chen',
          priority: 'High',
          issueType: 'Task',
          dueDate: '2026-04-15',
          labels: ['devops', 'staging', 'infrastructure'],
          status: 'Draft',
          confidence: 86,
        },
      ],
    };
  }

  return {
    summary:
      'Client delivery review for RetailEdge platform confirmed go-live target of April 24th. Key outstanding items: product catalog search bug (April 15 fix target), mobile app performance optimization, checkout persistence bug, and pending data model sign-off from client finance team.',
    decisions: [
      'Go-live date confirmed as April 24th, 2026.',
      'Product catalog search bug given April 15th fix deadline.',
      'Dark mode deferred to allow CSV export to be prioritized.',
      'Performance audit to be conducted before go-live.',
    ],
    risks: [
      'Finance team data model sign-off still pending — could delay reporting dashboard.',
      'Mobile performance issues flagged by beta testers may impact launch quality.',
      'Checkout quantity persistence bug still open in regression.',
    ],
    blockers: [
      'Finance team data model approval required before reporting module sign-off.',
      'Open P1 checkout bug must be resolved before go-live.',
    ],
    tasks: [
      {
        id: 'N2T-001',
        summary: 'Fix product catalog search bug — incorrect results with combined filters',
        description:
          'Query logic bug in filtering service causing incorrect results when multiple filters are combined. Dev to fix and test by April 15.',
        assignee: 'Dev Kapoor',
        priority: 'Critical',
        issueType: 'Bug',
        dueDate: '2026-04-15',
        labels: ['catalog', 'search', 'P1', 'UAT-finding'],
        status: 'Draft',
        confidence: 97,
      },
      {
        id: 'N2T-002',
        summary: 'Implement lazy loading and CDN image delivery for mobile product detail page',
        description:
          'Mobile product detail page load time flagged by beta testers. Implement lazy loading and CDN-based image delivery. Estimated 3-4 days.',
        assignee: 'Dev Kapoor',
        priority: 'High',
        issueType: 'Story',
        dueDate: '2026-04-18',
        labels: ['mobile', 'performance', 'images', 'CDN'],
        status: 'Draft',
        confidence: 93,
      },
      {
        id: 'N2T-003',
        summary: 'Fix checkout quantity not persisting on page refresh',
        description:
          'Regression: Checkout quantity update not persisted on page refresh. Suspected session state issue. Dev to investigate and fix.',
        assignee: 'Dev Kapoor',
        priority: 'Critical',
        issueType: 'Bug',
        dueDate: '2026-04-14',
        labels: ['checkout', 'regression', 'session-state'],
        status: 'Draft',
        confidence: 99,
      },
      {
        id: 'N2T-004',
        summary: 'Chase finance team data model sign-off for reporting dashboard',
        description:
          'Data model sent to client finance team April 8th. Laura to follow up internally and respond by EOD.',
        assignee: 'Laura Simmons',
        priority: 'High',
        issueType: 'Task',
        dueDate: '2026-04-12',
        labels: ['reporting', 'client-action', 'data-model'],
        status: 'Draft',
        confidence: 90,
      },
      {
        id: 'N2T-005',
        summary: 'Document all regression findings in shared tracker',
        description:
          'Raj to document all 3 regression findings (2 fixed, 1 open) in shared tracker by tomorrow EOD for go-live visibility.',
        assignee: 'Raj Mehta',
        priority: 'Medium',
        issueType: 'Task',
        dueDate: '2026-04-13',
        labels: ['QA', 'regression', 'documentation'],
        status: 'Draft',
        confidence: 88,
      },
      {
        id: 'N2T-006',
        summary: 'Send formal go-live checklist to client',
        description:
          'Olivia to prepare and send formal go-live checklist to RetailEdge client by end of week. Go-live target April 24th.',
        assignee: 'Olivia Park',
        priority: 'Medium',
        issueType: 'Task',
        dueDate: '2026-04-16',
        labels: ['go-live', 'client-communication', 'checklist'],
        status: 'Draft',
        confidence: 85,
      },
      {
        id: 'N2T-007',
        summary: 'Conduct full performance audit before go-live',
        description:
          'Run complete performance audit of RetailEdge platform before April 24th go-live. Focus on mobile, API response times, and image delivery.',
        assignee: 'Dev Kapoor',
        priority: 'High',
        issueType: 'Task',
        dueDate: '2026-04-22',
        labels: ['performance', 'audit', 'pre-launch'],
        status: 'Draft',
        confidence: 83,
      },
    ],
  };
}
