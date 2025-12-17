import type { LibraryEntry } from '../library'

export const apt29SupplyChainScenario: LibraryEntry = {
  id: 'apt29-supply-chain-001',
  title: 'APT29 (Cozy Bear): Supply Chain Compromise',
  category: 'apt',
  difficulty: 'advanced',
  duration: 180,
  description: 'A nation-state actor has compromised your software build pipeline, inserting a backdoor into a signed update distributed to thousands of customers. Based on the SolarWinds SUNBURST operation attributed to Russian SVR (APT29/Cozy Bear). This exercise tests supply chain security, customer notification procedures, and coordination with federal agencies.',
  tags: ['apt29', 'cozy-bear', 'supply-chain', 'sunburst', 'nation-state', 'espionage', 'software-vendor', 'svr'],
  moduleCount: 4,
  injectCount: 16,
  questionCount: 14,
  scenario: {
    id: 'apt29-supply-chain-001',
    title: 'APT29 (Cozy Bear): Supply Chain Compromise',
    description: 'A nation-state actor has compromised your software build pipeline, inserting a backdoor into a signed update distributed to thousands of customers. Based on the SolarWinds SUNBURST operation attributed to Russian SVR (APT29/Cozy Bear).',
    version: '1.0.0',
    author: 'CTEP Framework',
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    threatCategory: 'apt',
    difficulty: 'advanced',
    estimatedDuration: 180,
    targetAudience: ['Security Operations', 'Software Engineering', 'DevSecOps', 'Legal/Compliance', 'Executive Leadership', 'Customer Success', 'Communications'],
    objectives: [
      'Detect indicators of build system compromise and malicious code insertion',
      'Assess customer and downstream impact of a supply chain attack',
      'Coordinate response with federal law enforcement and intelligence agencies',
      'Execute customer notification and communication strategy',
      'Implement containment without disrupting legitimate business operations'
    ],
    tags: ['apt29', 'cozy-bear', 'supply-chain', 'sunburst', 'nation-state', 'espionage'],
    facilitatorGuide: {
      id: 'fg-apt29-supply-chain-001',
      createdAt: '2025-01-15T00:00:00Z',
      updatedAt: '2025-01-15T00:00:00Z',
      title: 'Facilitator Guide - APT29 Supply Chain Scenario',
      type: 'facilitator_guide',
      format: 'markdown',
      content: `This scenario is modeled after the SolarWinds SUNBURST attack disclosed in December 2020. Key characteristics of APT29/Cozy Bear operations:

**Tradecraft:**
- Exceptionally patient (months/years of access before detection)
- Custom malware with sophisticated anti-forensics
- Abuse of legitimate software signing certificates
- Blend into normal network traffic (DGA domains, legitimate cloud services)
- Target selection based on value (skip security vendors, target government)

**Timeline Context:**
- Attackers had access to build systems for 6+ months before detection
- Malicious code was present in updates downloaded by ~18,000 organizations
- Only ~100 organizations were actively exploited (high-value targets)
- Detection came from external security firm, not internal monitoring

**Key Decision Points:**
1. Customer notification timing vs. investigation completeness
2. Update server shutdown vs. continued monitoring
3. Federal agency engagement (FBI, CISA, NSA) timing
4. Public disclosure approach

**Emotional Pressure Points:**
- Customer trust and brand reputation at stake
- Potential government contract implications
- Board and investor concerns
- Media scrutiny and congressional attention`
    },
    additionalMaterials: [],
    settings: {
      allowParticipantSkip: false,
      requireAllResponses: true,
      showInjectTimestamps: true,
      enableAnonymousResponses: false
    },
    branchingSettings: {
      enabled: true,
      mode: 'facilitator_controlled',
      showBranchHistory: true,
      allowBacktracking: false
    },
    modules: [
      {
        id: 'apt29-mod-1-detection',
        createdAt: '2025-01-15T00:00:00Z',
        updatedAt: '2025-01-15T00:00:00Z',
        order: 1,
        title: 'Detection & Initial Analysis',
        description: 'An external security firm contacts your organization with troubling findings about your software.',
        phase: 'detection',
        suggestedDuration: 45,
        facilitatorNotes: 'The detection coming from an external party is realistic - most supply chain compromises are discovered by victims or security researchers, not by the compromised vendor. Emphasize the credibility assessment challenge.',
        injects: [
          {
            id: 'apt29-inj-1-1',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 1,
            title: 'External Security Firm Contact',
            content: `CONFIDENTIAL - EXECUTIVE ESCALATION REQUIRED

From: threat-intel@firewall-security.com
To: security@company.com
Subject: URGENT - Potential Compromise of Your Software

To the Security Team,

FireWall Security's threat hunting team has identified suspicious network traffic originating from systems running your OrionSync Enterprise software (version 2024.4.1).

During an incident response engagement with a federal agency client, we discovered:

1. DNS beaconing to avsvmcloud[.]com with DGA-generated subdomains
2. The beacon traffic correlates 100% with systems running OrionSync 2024.4.1
3. C2 traffic using legitimate cloud services (Azure, AWS) for data exfiltration
4. The malicious code appears to be IN YOUR SIGNED SOFTWARE UPDATE

We have confirmed this across 3 separate client environments. We believe your build or distribution system may be compromised.

We are prepared to share full technical indicators. Given the sensitivity, we request a call with your CISO within 2 hours.

This has potential national security implications. We recommend engaging FBI and CISA immediately.

Marcus Chen
VP Threat Intelligence
FireWall Security Inc.`,
            type: 'escalation',
            severity: 'critical',
            triggerTime: 0,
            source: 'External Security Researcher',
            facilitatorNotes: 'This mirrors how SolarWinds learned of SUNBURST - from FireEye. The credibility of the reporter and the specific technical details should drive urgency. Discuss how to validate external reports.',
            expectedActions: ['Validate the report credibility', 'Engage legal and executive leadership', 'Begin internal investigation', 'Prepare for federal agency contact'],
            attachments: [],
            relatedQuestionIds: ['apt29-q-1-1']
          },
          {
            id: 'apt29-inj-1-2',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 2,
            title: 'Internal Build System Anomalies Confirmed',
            content: `SECURITY INVESTIGATION UPDATE
Time: +2 hours from initial report
Classification: INTERNAL ONLY

Engineering team review of build systems has identified:

**Build Pipeline Anomalies:**
- Unauthorized modifications to build orchestration scripts
- Modified source files not matching repository commits
- Additional compilation step inserting code post-checkout
- Changes trace back approximately 6 months

**Code Analysis (Preliminary):**
- Malicious DLL embedded in legitimate update package
- Code is heavily obfuscated with anti-analysis techniques
- Beacon delays 12-14 days before activation (explains delayed detection)
- Victim profiling logic - skips security tool processes
- Legitimate code signing certificate used (our certificate!)

**Affected Versions:**
- OrionSync 2024.3.0 through 2024.4.1
- Distributed via official update servers
- Downloaded by approximately 18,000 customer organizations

**Critical Finding:**
The attackers appear to have had access to our build environment since at least March. Our code signing key may need to be revoked.`,
            type: 'technical',
            severity: 'critical',
            triggerTime: 10,
            source: 'Security Engineering',
            facilitatorNotes: 'The 6-month dwell time and 18,000 affected customers creates massive scope. The code signing compromise is particularly severe. Discuss certificate revocation implications.',
            expectedActions: ['Preserve build system evidence', 'Assess code signing key compromise', 'Identify all affected versions', 'Begin customer impact assessment'],
            attachments: [],
            relatedQuestionIds: ['apt29-q-1-2']
          },
          {
            id: 'apt29-inj-1-3',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 3,
            title: 'FBI Cyber Division Contact',
            content: `INCOMING CALL - FBI CYBER DIVISION

Special Agent Jennifer Walsh from FBI Cyber Division (verified via callback to FBI switchboard) contacts your CISO:

"We've been tracking activity related to your software for several weeks as part of an ongoing national security investigation. We understand FireWall Security has contacted you.

I need to be direct: We believe this is the work of a foreign intelligence service. We have classified intelligence supporting this assessment that I cannot share on this call.

We're requesting your cooperation:
1. Do NOT make public statements without coordinating with us
2. Preserve all evidence - do not remediate until we can image systems
3. We'd like to embed an agent with your IR team
4. Limit internal knowledge to essential personnel only

We're also coordinating with CISA and NSA. There will be a multi-agency call this afternoon.

One more thing - we believe only a subset of your customers were actually targeted for exploitation. The malware has victim selection logic. We're working to identify who was actually compromised versus who just received the update."`,
            type: 'regulatory',
            severity: 'critical',
            triggerTime: 15,
            source: 'FBI Cyber Division',
            facilitatorNotes: 'Federal involvement adds complexity. The request to delay public notification may conflict with customer obligations. The "victim selection" detail is important - not all 18,000 were targeted.',
            expectedActions: ['Verify FBI contact authenticity', 'Engage legal counsel on federal cooperation', 'Assess notification timing implications', 'Prepare for multi-agency coordination'],
            attachments: [],
            relatedQuestionIds: ['apt29-q-1-3'],
            branches: [
              {
                id: 'apt29-branch-1-fed',
                label: 'Fully cooperate with federal request to delay notification',
                description: 'Agree to hold public statements and customer notification pending federal guidance',
                target: { type: 'inject', injectId: 'apt29-inj-2-1' },
                facilitatorNotes: 'This path prioritizes federal investigation but creates customer trust risks if leak occurs'
              },
              {
                id: 'apt29-branch-1-notify',
                label: 'Proceed with immediate customer notification despite federal request',
                description: 'Prioritize customer safety and contractual obligations over federal investigation timing',
                target: { type: 'inject', injectId: 'apt29-inj-2-1' },
                facilitatorNotes: 'This path prioritizes customer relationships but may complicate federal investigation'
              }
            ]
          },
          {
            id: 'apt29-inj-1-4',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 4,
            title: 'Customer Impact Assessment',
            content: `CUSTOMER ANALYSIS - PRELIMINARY
Classification: HIGHLY CONFIDENTIAL

Based on download telemetry, the following customer categories received affected updates:

**Government/Public Sector:**
- 12 US Federal agencies (including 3 in .mil domain)
- 47 state/local government entities
- 8 allied foreign government agencies

**Critical Infrastructure:**
- 23 energy sector companies
- 15 healthcare organizations
- 8 financial services firms
- 6 telecommunications providers

**Enterprise:**
- 312 Fortune 500 companies
- ~17,500 other commercial organizations

**High-Profile Confirmed Downloads:**
- Department of Treasury
- Department of Homeland Security
- National Nuclear Security Administration
- Multiple Fortune 100 technology companies

Note: Download does not equal compromise. The malware's victim selection logic means actual exploitation is likely much smaller subset.`,
            type: 'information',
            severity: 'critical',
            triggerTime: 20,
            source: 'Customer Success / Engineering',
            facilitatorNotes: 'The government and critical infrastructure customer list creates enormous pressure. The distinction between "downloaded" and "exploited" is crucial but hard to communicate.',
            expectedActions: ['Prioritize government/critical infrastructure notification', 'Coordinate messaging with federal partners', 'Prepare customer-specific impact assessments', 'Identify contractual notification requirements'],
            attachments: [],
            relatedQuestionIds: ['apt29-q-1-4']
          }
        ],
        discussionQuestions: [
          {
            id: 'apt29-q-1-1',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 1,
            question: 'An external security firm claims your software contains malware. How do you validate this report while preserving evidence and managing the risk of false positives?',
            category: 'technical',
            responseType: 'text',
            guidanceNotes: 'Discuss validation approaches: independent code review, comparison with known-good builds, network traffic analysis, engaging trusted third parties.',
            expectedThemes: ['External report validation', 'Evidence preservation', 'Independent verification', 'Incident classification']
          },
          {
            id: 'apt29-q-1-2',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 2,
            question: 'Your code signing certificate was used to sign malicious code. What are the implications and what immediate actions should be taken regarding the certificate?',
            category: 'technical',
            responseType: 'text',
            guidanceNotes: 'Cover certificate revocation timing, customer update implications, HSM security assessment, re-signing legitimate software.',
            expectedThemes: ['Certificate revocation', 'Customer impact', 'Re-signing strategy', 'Key management review']
          },
          {
            id: 'apt29-q-1-3',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 3,
            question: 'The FBI requests you delay customer notification to protect their investigation. How do you balance federal cooperation with customer obligations and potential liability?',
            category: 'policy',
            responseType: 'text',
            guidanceNotes: 'Explore legal obligations, contractual requirements, liability implications, reputation considerations, and negotiating with federal agencies.',
            expectedThemes: ['Federal cooperation', 'Customer obligations', 'Legal liability', 'Notification timing']
          },
          {
            id: 'apt29-q-1-4',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 4,
            question: 'Government agencies including DHS and DOD downloaded the compromised update. How does this change your response priorities and communication approach?',
            category: 'coordination',
            responseType: 'text',
            guidanceNotes: 'Discuss government customer SLAs, national security implications, congressional notification potential, coordinated disclosure.',
            expectedThemes: ['Government customer priorities', 'National security considerations', 'Coordinated response', 'Congressional awareness']
          }
        ]
      },
      {
        id: 'apt29-mod-2-scope',
        createdAt: '2025-01-15T00:00:00Z',
        updatedAt: '2025-01-15T00:00:00Z',
        order: 2,
        title: 'Scope Assessment & Containment',
        description: 'Determine the full extent of the compromise while coordinating containment actions across multiple stakeholders.',
        phase: 'containment',
        suggestedDuration: 45,
        facilitatorNotes: 'This phase introduces the tension between thorough investigation and rapid containment. The attacker\'s sophistication means aggressive containment could tip them off and cause evidence destruction.',
        injects: [
          {
            id: 'apt29-inj-2-1',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 1,
            title: 'Multi-Agency Coordination Call',
            content: `MULTI-AGENCY COORDINATION CALL SUMMARY
Participants: FBI, CISA, NSA, Your Organization

Key Guidance Provided:

**Attribution (NSA/FBI):**
- High confidence attribution to Russian Foreign Intelligence Service (SVR)
- Consistent with APT29/Cozy Bear tradecraft
- Part of broader campaign targeting government and technology sectors
- This will likely become a significant policy matter

**Technical Guidance (CISA):**
- Emergency Directive being prepared for federal agencies
- Will require federal customers to disconnect affected software within 48 hours
- CISA to publish detection signatures and hunting guidance
- Coordinated public disclosure planned for 72 hours from now

**Your Requested Actions:**
1. Prepare customer notification to release within 72 hours
2. Develop clean update to remove malicious code
3. Provide CISA with full technical indicators
4. Prepare for congressional briefing requests
5. Designate single point of contact for federal coordination

**Caution:**
Attackers are likely monitoring public sources. Operational security for next 72 hours is critical. Internal communications should assume adversary visibility.`,
            type: 'regulatory',
            severity: 'critical',
            triggerTime: 0,
            source: 'Multi-Agency Call',
            facilitatorNotes: 'The 72-hour timeline creates urgency. The assumption that attackers have visibility into internal communications is realistic and should influence how teams coordinate.',
            expectedActions: ['Establish federal POC', 'Secure internal communications', 'Begin clean update development', 'Prepare notification materials', 'Brief legal on congressional inquiry prep'],
            attachments: [],
            relatedQuestionIds: ['apt29-q-2-1']
          },
          {
            id: 'apt29-inj-2-2',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 2,
            title: 'Additional Internal Compromise Discovered',
            content: `CRITICAL FINDING - INTERNAL SYSTEMS

Forensic analysis reveals the build system compromise was not the only intrusion:

**Additional Access Identified:**
- Source code repository (GitLab) - read access confirmed for 8 months
- Internal wiki with customer deployment documentation
- Support ticket system containing customer environment details
- VPN gateway logs showing persistent access from Tor exit nodes
- Evidence of access to 3 developer workstations

**Developer Workstation Analysis:**
- Custom keylogger recovered (previously unknown malware family)
- Screenshots captured including code reviews
- SSH keys exfiltrated (now rotated)
- Evidence attackers read internal security incident channels

**Implication:**
Attackers likely have detailed knowledge of:
- Your software architecture and security controls
- Customer deployment configurations
- Your incident response plans and capabilities
- Which customers are high-value targets`,
            type: 'technical',
            severity: 'critical',
            triggerTime: 10,
            source: 'Digital Forensics Team',
            facilitatorNotes: 'The scope expansion is demoralizing but realistic for APT29 operations. The access to IR plans means attackers may anticipate response actions.',
            expectedActions: ['Expand forensic scope to all developer systems', 'Rotate all credentials', 'Reassess IR plan assuming adversary knowledge', 'Identify what customer data may be exposed'],
            attachments: [],
            relatedQuestionIds: ['apt29-q-2-2']
          },
          {
            id: 'apt29-inj-2-3',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 3,
            title: 'Update Server Decision Point',
            content: `URGENT DECISION REQUIRED

Engineering team requests guidance on update distribution servers:

**Current State:**
- Update servers continue serving version 2024.4.1 (compromised)
- Approximately 200 new downloads in past 24 hours
- Clean version 2024.4.2 can be ready in 18 hours

**Options Presented:**

Option A - Immediate Shutdown:
- Stop all update distribution immediately
- Prevents new infections
- May alert attackers to our detection
- Breaks auto-update for all 18,000 existing customers
- Customers may panic when updates fail

Option B - Continue Serving Until Clean Version Ready:
- Maintain normal operations for 18 hours
- Prevents tip-off to attackers
- 200+ additional organizations download compromised version
- Clean version ready before shutdown

Option C - Serve Older Clean Version:
- Roll back to 2024.2.x (known clean)
- Customers lose 6 months of features
- May cause compatibility issues
- Can implement within 4 hours

FBI preference: Option B (maintain operational security)
CISO preference: Option A (stop the bleeding)
Engineering preference: Option C (compromise approach)`,
            type: 'decision_point',
            severity: 'critical',
            triggerTime: 15,
            source: 'Engineering / Security Leadership',
            facilitatorNotes: 'This is a core decision point with legitimate arguments for each option. There is no perfect answer. Discuss trade-offs and how to make decisions with imperfect information.',
            expectedActions: ['Evaluate each option against risk tolerance', 'Consider legal liability implications', 'Coordinate decision with federal partners', 'Document decision rationale'],
            attachments: [],
            relatedQuestionIds: ['apt29-q-2-3'],
            branches: [
              {
                id: 'apt29-branch-2-shutdown',
                label: 'Immediate shutdown (Option A)',
                description: 'Stop serving updates immediately to prevent new infections',
                target: { type: 'inject', injectId: 'apt29-inj-2-4' },
                isDefault: false,
                facilitatorNotes: 'Aggressive but may tip off attackers'
              },
              {
                id: 'apt29-branch-2-continue',
                label: 'Continue until clean version (Option B)',
                description: 'Maintain operations to preserve operational security',
                target: { type: 'inject', injectId: 'apt29-inj-2-4' },
                facilitatorNotes: 'FBI preferred but allows more infections'
              },
              {
                id: 'apt29-branch-2-rollback',
                label: 'Roll back to clean older version (Option C)',
                description: 'Serve older but known-clean version immediately',
                target: { type: 'inject', injectId: 'apt29-inj-2-4' },
                isDefault: true,
                facilitatorNotes: 'Compromise approach with trade-offs'
              }
            ]
          },
          {
            id: 'apt29-inj-2-4',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 4,
            title: 'Journalist Inquiry',
            content: `URGENT - COMMUNICATIONS TEAM

Brian Krebs (cybersecurity journalist, Krebs on Security) has sent the following inquiry:

---
To: press@company.com
Subject: Urgent inquiry - software supply chain compromise

I'm working on a story about a supply chain attack affecting your OrionSync software. I have spoken with sources at multiple affected federal agencies who confirm they are disconnecting your software on CISA guidance.

I have the following information and am seeking comment:
- Malicious code in versions 2024.3.x and 2024.4.x
- Russian intelligence service attribution
- Federal agency customers affected
- Multi-agency investigation underway

I plan to publish in approximately 8 hours. Please provide comment.

Brian Krebs
---

Note: The coordinated federal disclosure was planned for 72 hours. This journalist appears to have independent sources.`,
            type: 'media',
            severity: 'high',
            triggerTime: 20,
            source: 'Communications Team',
            facilitatorNotes: 'Media leak before planned disclosure is common. This forces acceleration of communications plans. Discuss whether to engage journalist, provide comment, or stay silent.',
            expectedActions: ['Coordinate with federal partners on accelerated timeline', 'Prepare public statement', 'Decide on journalist engagement', 'Alert board and executives', 'Accelerate customer notification'],
            attachments: [],
            relatedQuestionIds: ['apt29-q-2-4']
          }
        ],
        discussionQuestions: [
          {
            id: 'apt29-q-2-1',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 1,
            question: 'Federal agencies have set a 72-hour coordinated disclosure timeline. How do you prepare customer notifications, clean software updates, and congressional briefing materials within this window?',
            category: 'coordination',
            responseType: 'text',
            guidanceNotes: 'Discuss parallel workstreams, resource allocation, prioritization of government vs. commercial customers, pre-positioned communications.',
            expectedThemes: ['Timeline management', 'Parallel workstreams', 'Resource allocation', 'Prioritization']
          },
          {
            id: 'apt29-q-2-2',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 2,
            question: 'Attackers had access to your incident response plans and internal communications. How does this change your response approach?',
            category: 'technical',
            responseType: 'text',
            guidanceNotes: 'Cover out-of-band communications, assumption of adversary visibility, modifying playbooks, operational security during response.',
            expectedThemes: ['Out-of-band communications', 'Operational security', 'Adversary anticipation', 'Modified playbooks']
          },
          {
            id: 'apt29-q-2-3',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 3,
            question: 'You must choose between preventing new infections (shutting down updates) and maintaining operational security (not tipping off attackers). How do you make this decision?',
            category: 'decision',
            responseType: 'text',
            guidanceNotes: 'Explore decision frameworks for imperfect information, stakeholder interests, documentation requirements, liability considerations.',
            expectedThemes: ['Risk-based decisions', 'Stakeholder balance', 'Documentation', 'Liability management']
          },
          {
            id: 'apt29-q-2-4',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 4,
            question: 'A journalist is about to break the story 64 hours before your planned disclosure. How do you respond and what do you tell federal partners?',
            category: 'communication',
            responseType: 'text',
            guidanceNotes: 'Discuss media engagement strategy, acceleration of disclosure, federal coordination, pre-emption considerations.',
            expectedThemes: ['Media engagement', 'Accelerated disclosure', 'Federal coordination', 'Crisis communications']
          }
        ]
      },
      {
        id: 'apt29-mod-3-eradication',
        createdAt: '2025-01-15T00:00:00Z',
        updatedAt: '2025-01-15T00:00:00Z',
        order: 3,
        title: 'Eradication & Recovery',
        description: 'Remove attacker access, rebuild trusted systems, and restore customer confidence.',
        phase: 'eradication',
        suggestedDuration: 45,
        facilitatorNotes: 'Eradication for nation-state actors is complex - they often have multiple persistence mechanisms. The focus shifts to rebuilding customer trust while ensuring complete removal.',
        injects: [
          {
            id: 'apt29-inj-3-1',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 1,
            title: 'Public Disclosure Goes Live',
            content: `PUBLIC DISCLOSURE SUMMARY

Following the journalist publication and coordinated federal release:

**Company Statement Published:**
- Full acknowledgment of supply chain compromise
- Affected versions identified (2024.3.0 - 2024.4.1)
- Clean version 2024.4.2 available for download
- Customer notification emails sent to all 18,000 organizations
- Dedicated support line and webpage established

**Federal Actions:**
- CISA Emergency Directive ED 21-01 published
- Federal agencies ordered to disconnect within 48 hours
- FBI public attribution statement (Russian SVR)
- Congressional notification letters sent

**Immediate Public Response:**
- Stock price dropped 23% in pre-market trading
- #OrionSyncHack trending on social media
- Customer support queue: 3,400 calls waiting
- Media requests: 47 outlets requesting interviews
- Class action lawsuit filed within 4 hours of disclosure`,
            type: 'media',
            severity: 'high',
            triggerTime: 0,
            source: 'Communications / Legal',
            facilitatorNotes: 'The public response phase is chaotic. Multiple simultaneous crises require prioritization. The class action lawsuit filing is realistic and begins legal considerations.',
            expectedActions: ['Manage communications across channels', 'Prioritize customer support resources', 'Engage external crisis communications', 'Coordinate legal response to lawsuit'],
            attachments: [],
            relatedQuestionIds: ['apt29-q-3-1']
          },
          {
            id: 'apt29-inj-3-2',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 2,
            title: 'Build System Reconstruction',
            content: `BUILD ENVIRONMENT RECONSTRUCTION STATUS

Engineering team provides recovery update:

**Completed:**
- Isolated new "clean room" build environment
- New code signing certificates issued (old certificates revoked)
- Fresh build from verified source control snapshot
- Multi-party verification of build artifacts

**In Progress:**
- Implementing additional build pipeline integrity monitoring
- Adding reproducible build verification
- Establishing out-of-band build integrity attestation
- Third-party security review of new pipeline

**Customer Update Status (2024.4.2):**
- Build complete and signed
- Internal security review: PASSED
- Third-party audit: PENDING (2 days)
- Customer deployment: BLOCKED pending audit

**Decision Needed:**
Do we release 2024.4.2 immediately based on internal verification, or wait 2 days for third-party audit completion?

Context:
- Customers are currently unprotected/disconnected
- Every day of delay increases pressure and reputation damage
- If new build has issues, credibility is destroyed`,
            type: 'technical',
            severity: 'high',
            triggerTime: 10,
            source: 'Engineering Leadership',
            facilitatorNotes: 'Speed vs. thoroughness tension. The third-party audit provides assurance but delays relief. Discuss acceptable risk for recovery.',
            expectedActions: ['Assess risk of releasing without third-party audit', 'Evaluate phased release approach', 'Communicate timeline to customers', 'Consider interim mitigations'],
            attachments: [],
            relatedQuestionIds: ['apt29-q-3-2']
          },
          {
            id: 'apt29-inj-3-3',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 3,
            title: 'Major Customer Termination Notice',
            content: `CUSTOMER ESCALATION - CRITICAL

From: CIO, MegaBank Financial Services
To: CEO, Your Company

Subject: Notice of Contract Termination and Vendor Review

Following the disclosure of the supply chain compromise affecting OrionSync, MegaBank's Risk Committee has made the following decisions:

1. Immediate termination of our OrionSync Enterprise Agreement ($4.2M ARR)
2. Full vendor security review required before any future engagement
3. Notification to our regulators (OCC, Fed) of vendor incident
4. Reservation of rights regarding potential damages

Additionally, I want to make you aware that I have been contacted by three other major financial institutions who are coordinating a joint security assessment of your organization.

We will require:
- Full forensic report from third-party investigator
- Evidence of comprehensive security program overhaul
- Board-level security governance improvements
- Ongoing security audit rights

This incident will significantly impact our evaluation of similar software vendors industry-wide.

[Signed]
CIO, MegaBank Financial Services`,
            type: 'escalation',
            severity: 'critical',
            triggerTime: 15,
            source: 'Customer Success / Executive',
            facilitatorNotes: 'Major customer losses are a realistic consequence. The coordination among financial institutions suggests broader market impact. This creates pressure for demonstrable security improvements.',
            expectedActions: ['Executive engagement with departing customer', 'Assess total customer churn risk', 'Develop customer retention strategy', 'Plan security program enhancements for customer confidence'],
            attachments: [],
            relatedQuestionIds: ['apt29-q-3-3']
          },
          {
            id: 'apt29-inj-3-4',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 4,
            title: 'Congressional Hearing Notice',
            content: `CONGRESSIONAL NOTIFICATION

From: Office of General Counsel
Subject: Senate Intelligence Committee Request

We have received formal notification that the Senate Select Committee on Intelligence requests testimony regarding the OrionSync supply chain compromise.

**Key Points:**
- Hearing scheduled for 2 weeks from today
- CEO requested to testify
- Written testimony required 48 hours prior
- Topics include: timeline of compromise, customer impact, federal coordination, security investments

**Additional Context:**
- House Homeland Security Committee has sent similar request
- SEC has opened informal inquiry into disclosure timing
- Multiple senators have made public statements about "software supply chain security failures"

**Legal Assessment:**
This testimony will be under oath. Statements may impact ongoing litigation. We recommend retaining specialized congressional testimony counsel.

**Preparation Required:**
- Detailed timeline document
- Customer impact summary
- Security investment roadmap
- Coordination with federal law enforcement on classified aspects`,
            type: 'regulatory',
            severity: 'high',
            triggerTime: 20,
            source: 'Legal / Government Affairs',
            facilitatorNotes: 'Congressional testimony adds political dimension. The SEC inquiry suggests potential disclosure timing issues. This requires careful legal coordination.',
            expectedActions: ['Engage congressional testimony counsel', 'Prepare detailed incident timeline', 'Coordinate testimony with federal partners', 'Develop security roadmap for presentation'],
            attachments: [],
            relatedQuestionIds: ['apt29-q-3-4']
          }
        ],
        discussionQuestions: [
          {
            id: 'apt29-q-3-1',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 1,
            question: 'Your stock has dropped 23%, a class action has been filed, and customers are overwhelming support lines. How do you prioritize and resource the response across these simultaneous crises?',
            category: 'coordination',
            responseType: 'text',
            guidanceNotes: 'Discuss crisis prioritization, resource allocation, external support engagement, board communications.',
            expectedThemes: ['Crisis prioritization', 'Resource allocation', 'External expertise', 'Stakeholder management']
          },
          {
            id: 'apt29-q-3-2',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 2,
            question: 'A clean update is ready but third-party audit will take 2 more days. Customers are disconnected and pressuring for relief. Do you release before the audit completes?',
            category: 'decision',
            responseType: 'text',
            guidanceNotes: 'Explore risk appetite, staged release options, customer communication, assurance alternatives to full audit.',
            expectedThemes: ['Risk tolerance', 'Staged releases', 'Customer communication', 'Verification alternatives']
          },
          {
            id: 'apt29-q-3-3',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 3,
            question: 'Major customers are terminating contracts and coordinating industry-wide security assessments of your company. What security improvements would you commit to and how would you communicate them?',
            category: 'lessons_learned',
            responseType: 'text',
            guidanceNotes: 'Discuss security program improvements, customer assurance mechanisms, transparency commitments, industry standards.',
            expectedThemes: ['Security program enhancements', 'Customer assurance', 'Transparency', 'Industry standards']
          },
          {
            id: 'apt29-q-3-4',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 4,
            question: 'Your CEO will testify before Congress under oath about the incident. What are the key messages and what topics require careful legal coordination?',
            category: 'communication',
            responseType: 'text',
            guidanceNotes: 'Cover testimony preparation, legal coordination, national security considerations, forward-looking commitments.',
            expectedThemes: ['Congressional testimony', 'Legal coordination', 'Key messages', 'Security commitments']
          }
        ]
      },
      {
        id: 'apt29-mod-4-strategic',
        createdAt: '2025-01-15T00:00:00Z',
        updatedAt: '2025-01-15T00:00:00Z',
        order: 4,
        title: 'Strategic Response & Lessons Learned',
        description: 'Address long-term implications and implement lasting improvements to prevent recurrence.',
        phase: 'post_incident',
        suggestedDuration: 45,
        facilitatorNotes: 'This module focuses on strategic recovery and industry-wide implications. The incident has become a watershed moment for supply chain security.',
        injects: [
          {
            id: 'apt29-inj-4-1',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 1,
            title: '90-Day Post-Incident Assessment',
            content: `90-DAY INCIDENT ASSESSMENT

**Business Impact Summary:**
- Customer churn: 12% of ARR ($28M lost revenue)
- Stock price: Recovered to -15% from pre-incident
- Legal costs to date: $8.4M
- Class action settlement reserve: $50M
- Security program investment: $35M committed

**Operational Impact:**
- 47 federal agency customers retained (with enhanced SLAs)
- 156 commercial customers terminated
- Customer NPS dropped from +42 to -12
- Employee attrition in engineering: 18%

**Regulatory Outcomes:**
- SEC: No enforcement action (disclosure deemed timely)
- Congressional: New software supply chain legislation proposed
- CISA: Company invited to participate in supply chain security working group

**Insurance Claim Status:**
- Cyber policy limit: $50M
- Claim filed: $67M
- Current dispute: Business interruption coverage interpretation

**Third-Party Investigation Findings:**
Root cause: Compromised developer credentials via targeted phishing 8 months prior
Dwell time: 6 months undetected
Attack sophistication: Highest tier (nation-state resources)
Detection gap: Build pipeline monitoring insufficient`,
            type: 'information',
            severity: 'medium',
            triggerTime: 0,
            source: 'Executive Summary',
            facilitatorNotes: 'The 90-day view provides perspective on full impact. The investigation root cause (phishing leading to build compromise) is realistic. Use this to discuss systemic improvements.',
            expectedActions: ['Review findings against initial response', 'Identify improvement opportunities', 'Assess security investment effectiveness', 'Plan ongoing customer recovery'],
            attachments: [],
            relatedQuestionIds: ['apt29-q-4-1']
          },
          {
            id: 'apt29-inj-4-2',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 2,
            title: 'Security Program Transformation Proposal',
            content: `SECURITY TRANSFORMATION PROPOSAL
Board Presentation Draft

**Proposed Investments ($35M over 24 months):**

1. Build Pipeline Security ($8M)
   - Air-gapped build environment
   - Reproducible builds with multi-party verification
   - Real-time integrity monitoring
   - Hardware security modules for signing

2. Zero Trust Architecture ($12M)
   - Network microsegmentation
   - Continuous authentication
   - Privileged access management
   - Enhanced endpoint detection

3. Threat Detection & Response ($7M)
   - 24/7 threat hunting capability
   - Deception technology
   - Enhanced SIEM/SOAR
   - Red team program

4. Security Culture ($4M)
   - Phishing-resistant authentication for all employees
   - Enhanced security awareness (focus on targeted attacks)
   - Developer security training
   - Security champions program

5. Third-Party Assurance ($4M)
   - Annual penetration testing
   - Continuous third-party monitoring
   - Customer security portal
   - SOC 2 Type II + additional attestations

**Governance Changes:**
- CISO reports to CEO (previously CIO)
- Board Cybersecurity Committee established
- Monthly security metrics to board
- Security considerations in all product decisions`,
            type: 'information',
            severity: 'medium',
            triggerTime: 10,
            source: 'CISO / Security Program',
            facilitatorNotes: 'This represents the "never again" investment. Discuss whether investments address root causes, how to measure effectiveness, and governance changes.',
            expectedActions: ['Evaluate investment priorities', 'Assess governance changes', 'Determine success metrics', 'Plan implementation timeline'],
            attachments: [],
            relatedQuestionIds: ['apt29-q-4-2']
          },
          {
            id: 'apt29-inj-4-3',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 3,
            title: 'Industry-Wide Implications',
            content: `INDUSTRY & REGULATORY DEVELOPMENTS

Following your incident, the software industry is transforming:

**New Regulations/Standards:**
- Executive Order on Software Supply Chain Security issued
- NIST Software Supply Chain Security Framework published
- EU Cyber Resilience Act accelerated
- New software vendor security requirements for federal contracts

**Industry Initiatives:**
- Major tech companies forming "Secure Software Consortium"
- Your company invited as founding member (given experience)
- Focus: Build provenance, dependency tracking, SBOM standards

**Market Changes:**
- Software supply chain security now top due diligence item for buyers
- New insurance underwriting requirements for software vendors
- Venture capital now requires security assessments pre-investment

**Your Opportunity:**
Given your experience and investments, you have opportunity to:
- Lead industry standards development
- Rebuild reputation as security leader
- Differentiate on security assurance
- Advocate for practical regulations

**Risk:**
Competitors positioning your incident as reason to choose them.
Some customers permanently distrustful regardless of improvements.`,
            type: 'information',
            severity: 'low',
            triggerTime: 15,
            source: 'Strategy / Industry Affairs',
            facilitatorNotes: 'The incident has become larger than one company. Discuss how to turn crisis into leadership opportunity while remaining humble about the failure.',
            expectedActions: ['Evaluate industry leadership opportunities', 'Develop thought leadership strategy', 'Engage in standards development', 'Position security as differentiator'],
            attachments: [],
            relatedQuestionIds: ['apt29-q-4-3']
          },
          {
            id: 'apt29-inj-4-4',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 4,
            title: 'Final Exercise Reflection',
            content: `EXERCISE CONCLUSION

This scenario was based on the SolarWinds SUNBURST attack discovered in December 2020, attributed to Russian SVR (APT29/Cozy Bear).

**Real-World Outcome (SolarWinds):**
- ~18,000 organizations downloaded compromised updates
- ~100 organizations actively exploited
- Multiple US government agencies compromised
- Estimated remediation costs: $100M+ for SolarWinds alone
- Stock dropped 40% initially, recovered over 18 months
- CEO testified before Congress multiple times
- New security investments exceeded $40M

**Key Lessons from Real Incident:**
1. Supply chain attacks target trust relationships
2. Nation-state actors have patience and resources
3. Detection often comes from external parties
4. Coordinated disclosure is challenging but essential
5. Customer trust recovery takes years
6. Security must be built into development, not bolted on

**Discussion:**
How has this exercise changed your thinking about:
- Software supply chain security
- Vendor risk management
- Incident response preparedness
- Nation-state threat preparation`,
            type: 'information',
            severity: 'low',
            triggerTime: 20,
            source: 'Exercise Facilitator',
            facilitatorNotes: 'Closing reflection connecting scenario to real events. Use this to facilitate lessons learned discussion and identify organizational improvements.',
            expectedActions: ['Discuss key takeaways', 'Identify organizational gaps', 'Commit to improvement actions', 'Plan follow-up exercises'],
            attachments: [],
            relatedQuestionIds: ['apt29-q-4-4']
          }
        ],
        discussionQuestions: [
          {
            id: 'apt29-q-4-1',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 1,
            question: 'The root cause was phishing leading to developer credential compromise. This is a common initial access vector. What systemic controls would have prevented or detected this earlier?',
            category: 'lessons_learned',
            responseType: 'text',
            guidanceNotes: 'Discuss phishing-resistant authentication, developer account monitoring, build pipeline verification, detection opportunities.',
            expectedThemes: ['Phishing resistance', 'Developer security', 'Build verification', 'Early detection']
          },
          {
            id: 'apt29-q-4-2',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 2,
            question: 'The proposed $35M security investment addresses multiple areas. If budget were cut to $20M, how would you prioritize these investments?',
            category: 'resource',
            responseType: 'text',
            guidanceNotes: 'Force prioritization discussion, consider which investments address root cause vs. symptoms, discuss measurement.',
            expectedThemes: ['Investment prioritization', 'Root cause addressing', 'ROI considerations', 'Measurement']
          },
          {
            id: 'apt29-q-4-3',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 3,
            question: 'Your company can now lead industry security standards development. How do you balance thought leadership with humility about the failure that created this opportunity?',
            category: 'communication',
            responseType: 'text',
            guidanceNotes: 'Explore tone, authenticity, sharing lessons learned, balancing marketing with genuine improvement.',
            expectedThemes: ['Thought leadership', 'Authentic communication', 'Industry contribution', 'Reputation rebuilding']
          },
          {
            id: 'apt29-q-4-4',
            createdAt: '2025-01-15T00:00:00Z',
            updatedAt: '2025-01-15T00:00:00Z',
            order: 4,
            question: 'What are the three most important changes your organization should make based on this exercise? Who is accountable for each?',
            category: 'lessons_learned',
            responseType: 'text',
            guidanceNotes: 'Focus on actionable outcomes with clear ownership. Push for specificity beyond generic "improve security."',
            expectedThemes: ['Specific actions', 'Accountability', 'Timeline', 'Measurement']
          }
        ]
      }
    ]
  }
}
