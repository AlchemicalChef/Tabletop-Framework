import type { Scenario, LibraryEntry } from '../../types/scenario.types'

const scenario: Scenario = {
  id: 'lazarus-swift',
  title: 'Phantom Wire: Lazarus Group SWIFT Attack',
  subtitle: 'DPRK State-Sponsored Financial Theft Against Regional Bank',
  description: `Your organization is a regional bank with $45 billion in assets, serving commercial and retail customers across a five-state area. You maintain SWIFT connectivity for international wire transfers and correspondent banking relationships with major money center banks.

An early morning alert from your fraud detection system has identified $81 million in suspicious wire transfers initiated overnight through your SWIFT Alliance Lite2 terminal. Initial investigation suggests unauthorized access to your payment systems by threat actors consistent with the Lazarus Group (APT38), a North Korean state-sponsored group responsible for the Bangladesh Bank heist and numerous other financial institution attacks.

This scenario explores the unique challenges of responding to financially-motivated nation-state attacks, including the race to recover stolen funds, regulatory notification requirements, and the broader implications of DPRK sanctions violations.`,
  threatCategory: 'Nation-State APT',
  difficulty: 'intermediate',
  estimatedDuration: 120,
  targetAudience: [
    'Security Operations Teams',
    'Treasury and Wire Operations',
    'Fraud Investigation Teams',
    'Executive Leadership',
    'Compliance and Regulatory Affairs'
  ],
  objectives: [
    'Detect and respond to unauthorized SWIFT transactions',
    'Coordinate urgent fund recovery with correspondent banks',
    'Navigate complex regulatory notification requirements',
    'Coordinate with FBI and Treasury on sanctions implications',
    'Implement containment while maintaining banking operations',
    'Manage customer and regulatory communications'
  ],
  modules: [
    {
      id: 'lazarus-detection',
      title: 'Detection: Suspicious Wire Activity',
      phase: 'detection',
      duration: 30,
      objectives: [
        'Identify indicators of unauthorized SWIFT access',
        'Assess scope of potentially fraudulent transactions',
        'Initiate emergency response procedures',
        'Begin correspondent bank notification'
      ],
      injects: [
        {
          id: 'laz-inj-001',
          title: 'Fraud Alert: Unusual Wire Transfer Pattern',
          type: 'technical',
          severity: 'critical',
          triggerTime: 0,
          source: 'Fraud Detection System',
          content: `FRAUD ALERT - PRIORITY: CRITICAL
Alert ID: FRD-2024-0847
Generated: 06:14 AM EST

Anomaly Detected: Unusual outbound wire transfer pattern

Summary:
- 5 outbound SWIFT transfers initiated between 02:00-04:30 AM
- Total value: $81,000,000 USD
- Originator: Internal SWIFT operator credentials (svc_swift_ops)
- Pattern inconsistent with normal operations

Transaction Details:
MT103 #1: $23,000,000 to Bank of Manila, Philippines
MT103 #2: $18,000,000 to Commerce Bank Sri Lanka
MT103 #3: $17,500,000 to Singapore Trade Finance Corp
MT103 #4: $14,000,000 to Vietnam Commercial Bank
MT103 #5: $8,500,000 to Cambodia Asia Bank

Anomaly Indicators:
- Transfers initiated outside business hours
- Beneficiary accounts newly established (< 30 days)
- No corresponding customer instructions on file
- Operator workstation: SWIFT-TERM-02 (normally unused overnight)
- Amounts just below individual verification thresholds

Current Status:
- 3 transfers confirmed settled (cannot be recalled)
- 2 transfers pending at correspondent bank (may be recoverable)

Immediate verification required.`,
          expectedActions: [
            'Alert wire operations management immediately',
            'Verify legitimacy with SWIFT operators',
            'Contact correspondent bank for pending transfers',
            'Preserve all logs and evidence'
          ],
          facilitatorNotes: 'Time is critical for fund recovery. Emphasize the narrow window for recall of pending transfers.'
        },
        {
          id: 'laz-inj-002',
          title: 'SWIFT Terminal Log Analysis',
          type: 'technical',
          severity: 'critical',
          triggerTime: 5,
          source: 'IT Security Team',
          content: `SWIFT TERMINAL FORENSIC ANALYSIS
Terminal: SWIFT-TERM-02
Analysis Period: 00:00 - 06:00 AM

Login Activity:
01:47 AM - Service account login (svc_swift_ops)
01:48 AM - Alliance Lite2 application launched
01:52 AM - Multiple MT103 message templates accessed
02:03 AM - First transfer initiated (MT103 #1)
04:34 AM - Last transfer initiated (MT103 #5)
04:41 AM - Session terminated
04:42 AM - Logs partially deleted (recovery attempted)

Suspicious Activity Detected:
- Login from unexpected network segment (IT admin VLAN, not Treasury)
- Service account password changed 72 hours ago
- No corresponding dual-control verification
- Operator authentication codes used from unknown device
- PDF printer malware detected on terminal

Malware Analysis (SWIFT-TERM-02):
Filename: msoutc.exe
Type: PDF printer driver (masquerading)
Function: Intercepts and modifies SWIFT confirmation messages
Behavior: Hides fraudulent transactions from operators
Attribution: Code similarity to Lazarus Group tools (DYEPACK family)

Additional Discovery:
Similar malware found on:
- SWIFT-TERM-01 (primary terminal)
- TREASURY-WS-04 (Treasury workstation)
- PRINT-SVR-02 (confirmation print server)

Assessment: Coordinated attack on SWIFT environment with long dwell time.`,
          expectedActions: [
            'Isolate all affected SWIFT infrastructure',
            'Contact SWIFT Network Operations Center',
            'Engage external forensics team',
            'Document chain of custody for evidence'
          ],
          facilitatorNotes: 'The DYEPACK malware family is actually used by Lazarus. Discuss how attackers target the entire transaction workflow.'
        },
        {
          id: 'laz-inj-003',
          title: 'Correspondent Bank Urgent Contact',
          type: 'communication',
          severity: 'critical',
          triggerTime: 12,
          source: 'Correspondent Banking (NYC)',
          content: `URGENT CALL
From: [Major Money Center Bank] Wire Operations Center

"This is [Name] from the wire operations center at [Correspondent Bank]. We're your correspondent for USD clearing.

We have two pending transfers from your institution totaling $22.5 million that are awaiting release:
- $14 million to Vietnam Commercial Bank
- $8.5 million to Cambodia Asia Bank

These were flagged by our fraud detection due to the beneficiary account profiles. We've placed an administrative hold pending verification.

We need verbal authorization from an officer of your bank to release OR a formal cancellation request within the next 45 minutes. After that, the transfers will auto-release per our SLA.

Also, we should mention - the $58.5 million in the other three transfers has already cleared. Those funds are gone unless the receiving banks cooperate with recovery.

What do you want us to do with the pending transfers?"

Time Remaining: 45 minutes before auto-release`,
          expectedActions: [
            'Immediately request cancellation of pending transfers',
            'Document officer authorization',
            'Request correspondent bank trace settled funds',
            'Escalate to executive leadership'
          ],
          facilitatorNotes: 'This is a time-critical decision. The 45-minute window adds real pressure. Some funds can still be saved.'
        },
        {
          id: 'laz-inj-004',
          title: 'Initial Attribution Assessment',
          type: 'document',
          severity: 'high',
          triggerTime: 20,
          source: 'Threat Intelligence',
          content: `THREAT INTELLIGENCE ASSESSMENT
Classification: CONFIDENTIAL

Subject: Attribution Analysis - SWIFT Compromise

Assessment: HIGH CONFIDENCE - Lazarus Group (APT38/DPRK)

Attribution Indicators:
1. Malware Analysis
   - DYEPACK PDF modifier variant
   - Code reuse from Bangladesh Bank attack
   - Compilation timestamps consistent with Pyongyang timezone

2. Operational TTPs
   - SWIFT targeting methodology identical to prior attacks
   - Weekend/holiday timing (reduced staffing)
   - Beneficiary countries: Lazarus-affiliated money laundering networks

3. Infrastructure
   - C2 communication patterns match known Lazarus infrastructure
   - VPN exit nodes in countries without DPRK extradition

Historical Context:
- Bangladesh Bank (2016): $81M stolen via SWIFT
- Far Eastern International Bank Taiwan (2017): $60M attempted
- Cosmos Bank India (2018): $13.5M via SWIFT/ATM
- Malta Bank of Valletta (2019): $14.7M attempted
- Multiple crypto exchanges (2020-2024): $2B+ total

DPRK Sanctions Implications:
As a US financial institution, this attack triggers:
- OFAC reporting requirements
- Potential sanctions screening failures
- Treasury/FBI notification obligations
- SWIFT security requirements review

Recommendation: Engage FBI immediately. This is not just a fraud case - it's a national security matter.`,
          expectedActions: [
            'Brief executive leadership on attribution',
            'Contact FBI Cyber Division',
            'Notify OFAC regarding potential sanctions exposure',
            'Prepare for regulatory inquiries'
          ],
          facilitatorNotes: 'DPRK attribution adds complexity beyond normal fraud. Discuss sanctions implications and why FBI involvement is essential.'
        }
      ],
      discussionQuestions: [
        {
          id: 'laz-q-001',
          question: 'When you discover potentially fraudulent wire transfers, what is the optimal sequence of actions to maximize fund recovery while preserving evidence?',
          category: 'technical',
          suggestedTime: 8,
          keyPoints: [
            'Time is critical - minutes matter for pending transfers',
            'Balance speed with proper authorization',
            'Correspondent bank relationships are crucial',
            'Evidence preservation vs. immediate action',
            'Chain of custody considerations'
          ]
        },
        {
          id: 'laz-q-002',
          question: 'How does attribution to a nation-state actor (DPRK/Lazarus) change your response compared to criminal fraud? What additional considerations apply?',
          category: 'policy',
          suggestedTime: 8,
          keyPoints: [
            'OFAC and sanctions implications',
            'FBI/Treasury involvement requirements',
            'Geopolitical considerations',
            'Insurance coverage questions',
            'Enhanced regulatory scrutiny'
          ]
        },
        {
          id: 'laz-q-003',
          question: 'What SWIFT-specific security controls could have prevented or detected this attack earlier? How does your organization validate these controls?',
          category: 'technical',
          suggestedTime: 6,
          keyPoints: [
            'SWIFT Customer Security Programme (CSP) controls',
            'Dual authorization requirements',
            'Out-of-band verification',
            'Network segmentation',
            'Transaction monitoring thresholds'
          ]
        }
      ]
    },
    {
      id: 'lazarus-financial',
      title: 'Financial Impact: Assessment and Recovery',
      phase: 'analysis',
      duration: 30,
      objectives: [
        'Quantify total financial exposure',
        'Coordinate fund recovery efforts across jurisdictions',
        'Assess customer impact and liability',
        'Develop financial impact mitigation strategy'
      ],
      injects: [
        {
          id: 'laz-inj-005',
          title: 'Fund Recovery Status Update',
          type: 'document',
          severity: 'critical',
          triggerTime: 0,
          source: 'Treasury Operations',
          content: `FUND RECOVERY STATUS REPORT
As of: 10:30 AM EST

Transfer Summary:
Total Attempted: $81,000,000
Successfully Blocked: $22,500,000 (correspondent bank hold)
Unrecoverable (cleared): $58,500,000

Recovery Efforts by Destination:

Bank of Manila (Philippines): $23,000,000
- Status: Funds withdrawn within 2 hours
- Recovery Probability: <5%
- Note: Beneficiary account closed, funds converted to crypto

Commerce Bank Sri Lanka: $18,000,000
- Status: Partial withdrawal ($12M), $6M frozen
- Recovery Probability: 33% ($6M)
- Note: Sri Lankan central bank cooperating

Singapore Trade Finance Corp: $17,500,000
- Status: Multiple onward transfers executed
- Recovery Probability: <10%
- Note: Funds moved through shell companies

Vietnam Commercial Bank: $14,000,000 - BLOCKED
- Status: Transfer cancelled before release
- Recovery: 100% confirmed
- Note: Still in correspondent bank account

Cambodia Asia Bank: $8,500,000 - BLOCKED
- Status: Transfer cancelled before release
- Recovery: 100% confirmed
- Note: Still in correspondent bank account

Revised Financial Impact:
Confirmed Loss: ~$52,500,000
Potentially Recoverable: ~$6,000,000
Successfully Blocked: $22,500,000

Insurance Coverage:
Cyber policy limit: $25,000,000
Deductible: $5,000,000
Coverage uncertainty: Nation-state exclusion under review

Board notification required for losses exceeding $10M per policy.`,
          expectedActions: [
            'Notify board of confirmed losses',
            'File insurance claim immediately',
            'Coordinate international recovery efforts',
            'Assess customer account exposure'
          ],
          facilitatorNotes: 'The partial recovery shows the value of rapid response. Discuss how the timing of discovery affected outcomes.'
        },
        {
          id: 'laz-inj-006',
          title: 'Customer Account Exposure Analysis',
          type: 'document',
          severity: 'high',
          triggerTime: 8,
          source: 'Fraud Investigation Team',
          content: `CUSTOMER IMPACT ASSESSMENT
Classification: CONFIDENTIAL

Source of Fraudulent Funds:
Investigation reveals the $81M in fraudulent transfers was sourced from:

1. Nostro Account (Correspondent Balance): $45,000,000
   - Bank's own funds
   - Direct P&L impact

2. Customer Settlement Accounts: $36,000,000
   - Pending customer wire transfers redirected
   - Customers expecting funds delivery

Affected Customers (36):
- 12 corporate clients (large wire transfers)
- 24 commercial clients (medium transfers)
- Combined expected settlements: $36,000,000

Customer Impact:
- Customers are expecting funds that won't arrive
- We processed their instructions - they'll expect us to make them whole
- Several time-sensitive transactions (M&A closings, payroll)

Immediate Concerns:
1. ABC Manufacturing: $8.2M wire for acquisition closing TODAY
2. Regional Hospital System: $4.1M for equipment purchase
3. County Government: $3.7M for bond payment due tomorrow

Legal Assessment:
- Bank likely liable for misdirected customer funds
- Potential breach of wire transfer agreement
- Reputational damage from delayed settlements

Options:
A) Make all customers whole immediately (absorb $36M)
B) Inform customers of delay, work recovery
C) Partial funding for time-critical transactions

DECISION REQUIRED: Customer handling approach`,
          expectedActions: [
            'Prioritize time-critical customer transactions',
            'Prepare customer notification process',
            'Reserve funds for customer restitution',
            'Engage legal for liability assessment'
          ],
          facilitatorNotes: 'Customer impact adds urgency beyond just the bank\'s losses. Discuss the reputational and legal implications.',
          decisionPoint: {
            question: 'How will you handle affected customer transactions?',
            options: [
              {
                id: 'make-whole',
                label: 'Make All Customers Whole',
                description: 'Fund all expected customer transactions from bank reserves immediately',
                consequence: 'Bank absorbs full $36M customer impact but preserves relationships and reputation'
              },
              {
                id: 'prioritize-critical',
                label: 'Prioritize Critical Only',
                description: 'Fund time-sensitive transactions only, work recovery for others',
                consequence: 'Reduced immediate outlay but some customers face delays and potential damages'
              },
              {
                id: 'inform-delay',
                label: 'Inform and Delay All',
                description: 'Notify all customers of situation and work on recovery',
                consequence: 'Preserves cash but risks customer lawsuits and severe reputational damage'
              }
            ]
          }
        },
        {
          id: 'laz-inj-007',
          title: 'FBI Financial Crimes Contact',
          type: 'communication',
          severity: 'high',
          triggerTime: 15,
          source: 'FBI Cyber Division',
          content: `INCOMING CALL
From: FBI Cyber Division, Financial Crimes Unit

"This is Special Agent [Name] with the FBI Cyber Division. We received notification from Treasury that your institution may have been targeted by actors associated with the DPRK.

We're very familiar with the Lazarus Group and their SWIFT operations. I want to discuss coordinating on several fronts:

1. Evidence Preservation
We'll need forensic images of affected systems for our investigation. This is part of a larger ongoing investigation into DPRK cyber operations.

2. Fund Tracing
We have established channels with financial intelligence units in the destination countries. Early coordination increases recovery chances.

3. OFAC Coordination
Given DPRK involvement, there are sanctions compliance implications. We're coordinating with Treasury OFAC to ensure your institution is protected for cooperation.

4. Attribution Support
If you share IOCs and malware samples, we can provide additional context from our investigations.

I should mention - anything you share with us may become part of a federal investigation and potential prosecution. We can discuss protective measures.

We strongly recommend engaging with us. We've helped other victim banks significantly improve their recovery rates.

Can we schedule a secure call with your incident response team and legal counsel?"`,
          expectedActions: [
            'Schedule FBI coordination call',
            'Engage outside legal counsel',
            'Prepare evidence for sharing',
            'Discuss protection for information shared'
          ],
          facilitatorNotes: 'FBI involvement can help recovery but also creates legal exposure. Discuss the trade-offs of full cooperation.'
        },
        {
          id: 'laz-inj-008',
          title: 'Board Emergency Session Request',
          type: 'communication',
          severity: 'high',
          triggerTime: 22,
          source: 'Board Chairman',
          content: `URGENT - BOARD COMMUNICATION
From: Board Chairman

"I've been briefed on the cyber incident and the $52 million loss. I'm convening an emergency board session in 3 hours.

I need the following prepared:

1. Complete incident summary - what happened, how, and why
2. Total financial impact - confirmed losses, potential recovery, insurance
3. Customer impact assessment and our proposed response
4. Regulatory notification status and expected inquiries
5. Root cause analysis - why did our controls fail?
6. Remediation plan and associated costs
7. Executive accountability assessment

I'm also concerned about:
- Stock price impact when this becomes public
- Regulatory enforcement risk
- Personal director liability exposure
- CEO and CISO performance

Prepare to address hard questions about why a $45 billion institution couldn't prevent an $81 million theft.

I expect complete transparency. No surprises in that boardroom."`,
          expectedActions: [
            'Prepare comprehensive board presentation',
            'Brief CEO on expected questions',
            'Have general counsel assess liability exposure',
            'Prepare remediation cost estimates'
          ],
          facilitatorNotes: 'Board-level accountability adds pressure. Discuss how to present bad news to governance bodies effectively.'
        }
      ],
      discussionQuestions: [
        {
          id: 'laz-q-004',
          question: 'When the bank\'s losses may be partially recoverable through insurance, how does potential nation-state exclusion affect your financial planning and disclosure?',
          category: 'decision',
          suggestedTime: 8,
          keyPoints: [
            'Policy language around state-sponsored attacks',
            'War exclusion clauses',
            'Attribution uncertainty helps or hurts',
            'Reserve requirements while claim pending',
            'Disclosure of coverage uncertainty'
          ]
        },
        {
          id: 'laz-q-005',
          question: 'How do you balance FBI cooperation (which may help recovery) against legal exposure from information sharing?',
          category: 'coordination',
          suggestedTime: 8,
          keyPoints: [
            'Attorney-client privilege considerations',
            'Voluntary vs. compelled disclosure',
            'Proffer agreements and immunity',
            'Regulatory safe harbor for cooperation',
            'Potential conflicts with other agencies'
          ]
        },
        {
          id: 'laz-q-006',
          question: 'Should the bank immediately make customers whole for the $36M in affected transactions, or pursue recovery first? What are the implications of each choice?',
          category: 'decision',
          suggestedTime: 6,
          keyPoints: [
            'Customer relationship preservation',
            'Legal liability mitigation',
            'Cash flow and liquidity impact',
            'Precedent setting concerns',
            'Reputational risk of delays'
          ]
        }
      ]
    },
    {
      id: 'lazarus-containment',
      title: 'Containment: Securing Payment Systems',
      phase: 'containment',
      duration: 30,
      objectives: [
        'Isolate and secure SWIFT environment',
        'Implement emergency controls while maintaining operations',
        'Coordinate with SWIFT on security requirements',
        'Eradicate attacker access from payment systems'
      ],
      injects: [
        {
          id: 'laz-inj-009',
          title: 'SWIFT Network Security Notification',
          type: 'communication',
          severity: 'high',
          triggerTime: 0,
          source: 'SWIFT Customer Security Programme',
          content: `SWIFT SECURITY NOTIFICATION
Priority: URGENT

Subject: Mandatory Security Actions Following Suspected Fraud

Dear Member Institution,

SWIFT has been notified of a potential unauthorized access incident at your institution. Per the Customer Security Programme (CSP) requirements, we require immediate action:

1. MANDATORY ATTESTATION REVIEW
Your most recent CSP attestation is under review. Any control failures identified during this incident may affect your attestation status.

2. IMMEDIATE SECURITY MEASURES
- Isolate Alliance Lite2 environment from general network
- Reset all SWIFT-related credentials
- Enable enhanced transaction monitoring
- Implement manual verification for all MT103 messages

3. SWIFT TECHNICAL SUPPORT
We are dispatching a security team to assist with:
- Environment assessment
- Malware eradication verification
- Control validation
- Reconnection procedures

4. NETWORK STANDING
Your SWIFT connectivity will remain active but subject to enhanced monitoring. Large-value transfers may experience delays during review.

5. CSP REMEDIATION
Within 30 days, you must provide:
- Root cause analysis
- Remediation plan
- Updated attestation
- Third-party security assessment

Failure to comply may result in restricted SWIFT access.

Please confirm receipt and provide point of contact for our security team.`,
          expectedActions: [
            'Acknowledge SWIFT notification',
            'Implement mandated security measures',
            'Prepare for SWIFT security team visit',
            'Assess CSP attestation impact'
          ],
          facilitatorNotes: 'SWIFT CSP requirements add regulatory pressure. Discuss how this affects the remediation timeline and approach.'
        },
        {
          id: 'laz-inj-010',
          title: 'Lateral Movement Discovery',
          type: 'technical',
          severity: 'critical',
          triggerTime: 8,
          source: 'Incident Response Team',
          content: `LATERAL MOVEMENT ANALYSIS
Scope Expansion Alert

Investigation reveals attack extends beyond SWIFT environment:

Compromised Systems Confirmed:
- SWIFT-TERM-01, SWIFT-TERM-02 (SWIFT terminals)
- TREASURY-WS-01 through WS-06 (Treasury workstations)
- PRINT-SVR-02 (Confirmation print server)
- DC-TREASURY-01 (Treasury domain controller)
- FILE-SVR-TREAS (Treasury file server)
- CORE-BANK-APP-02 (Core banking interface server)

Initial Access Vector Identified:
- Spearphishing email to Treasury analyst (4 months ago)
- Macro-enabled document: "NACHA_Format_Update_2024.xlsm"
- Established Cobalt Strike beacon
- Escalated to domain admin via Kerberoasting
- Moved laterally to SWIFT environment over 3 months

Additional Malware Discovered:
1. FASTCash variant on ATM switch (not yet activated)
2. Keylogger on executive assistants' machines
3. Data exfiltration tool staging customer database

Implications:
- Attack was multi-phase with broader objectives
- SWIFT fraud may have been opportunistic
- ATM fraud capability exists but unused
- Customer data potentially exfiltrated

Recommendation: Full enterprise containment, not just SWIFT environment.`,
          expectedActions: [
            'Expand containment to all compromised systems',
            'Assess ATM network exposure',
            'Determine customer data breach scope',
            'Engage enterprise-wide incident response'
          ],
          facilitatorNotes: 'The attack is broader than initially thought. Discuss how to balance scope expansion with operational continuity.'
        },
        {
          id: 'laz-inj-011',
          title: 'OCC Examiner Contact',
          type: 'communication',
          severity: 'high',
          triggerTime: 15,
          source: 'Office of the Comptroller of the Currency',
          content: `REGULATORY COMMUNICATION
From: OCC Examiner-in-Charge

Subject: Cybersecurity Incident - Information Request

We have been made aware of a significant cybersecurity incident at your institution through interagency coordination.

As your primary federal regulator, we require:

1. IMMEDIATE NOTIFICATION
Per 12 CFR 30, Appendix B, you are required to notify us of incidents involving unauthorized access to sensitive customer information.

2. INFORMATION REQUEST
Within 48 hours, provide:
- Incident timeline and current status
- Systems and data affected
- Customer notification plans
- Remediation actions taken
- Impact on Bank Secrecy Act/AML systems

3. EXAMINATION CONSIDERATIONS
This incident will be incorporated into our ongoing examination. Be prepared to discuss:
- IT risk management program effectiveness
- Third-party risk management
- Business continuity planning
- Board and management oversight

4. MATTERS REQUIRING ATTENTION (MRA)
Depending on findings, we may issue MRAs or more severe enforcement actions.

We expect full cooperation and transparency. Incomplete or delayed responses will be viewed unfavorably.

Please confirm receipt and provide your incident response lead contact.`,
          expectedActions: [
            'Acknowledge OCC communication',
            'Prepare 48-hour information response',
            'Brief board on regulatory exposure',
            'Prepare for examination focus on incident'
          ],
          facilitatorNotes: 'OCC involvement elevates regulatory stakes. Discuss how banking regulators approach cyber incidents differently than other agencies.'
        },
        {
          id: 'laz-inj-012',
          title: 'Operations Impact Assessment',
          type: 'document',
          severity: 'high',
          triggerTime: 22,
          source: 'Operations Management',
          content: `OPERATIONS IMPACT REPORT
Status: DEGRADED OPERATIONS

Current Situation:
SWIFT environment isolated, operating in manual verification mode

Impact to Business Operations:

Wire Transfers:
- International wires: MANUAL ONLY (4x processing time)
- Domestic wires: NORMAL (Fedwire unaffected)
- Daily volume: 2,400 wires/day normally
- Current capacity: ~600 wires/day manual
- Backlog building: 847 pending wires

Customer Impact:
- Large corporate clients experiencing delays
- 23 complaints received in past 4 hours
- Relationship managers fielding difficult calls
- Two major clients threatening to move business

Treasury Operations:
- FX trading operational but settlement delayed
- Correspondent balance management manual
- Liquidity management compromised

Branch Operations:
- ATM network ISOLATED (precautionary)
- 340 ATMs offline
- Customer complaints mounting
- Considering controlled ATM reactivation

Duration Estimate:
- Minimum 5-7 days for SWIFT environment rebuild
- 2-3 days for ATM network verification
- Full normal operations: 2-3 weeks

Revenue Impact:
- Wire transfer fees: ~$180,000/day lost
- FX trading: ~$75,000/day reduced
- ATM interchange: ~$45,000/day lost
- Total daily impact: ~$300,000

Customer Retention Risk: HIGH
Two Fortune 500 relationships at risk of departure.`,
          expectedActions: [
            'Prioritize VIP customer transactions',
            'Communicate realistic timeline to customers',
            'Consider controlled ATM reactivation',
            'Assess temporary staffing for manual operations'
          ],
          facilitatorNotes: 'Operational impact creates pressure to rush remediation. Discuss how to balance security with customer service.'
        }
      ],
      discussionQuestions: [
        {
          id: 'laz-q-007',
          question: 'When attackers have broader access than initially detected (ATM network, customer data), how do you prioritize containment across multiple critical systems?',
          category: 'technical',
          suggestedTime: 8,
          keyPoints: [
            'Risk-based prioritization',
            'Active threat vs. dormant capability',
            'Evidence preservation considerations',
            'Operational dependencies',
            'Resource constraints'
          ]
        },
        {
          id: 'laz-q-008',
          question: 'SWIFT CSP requirements mandate certain actions within specific timeframes. How do you manage these requirements while dealing with a larger incident?',
          category: 'policy',
          suggestedTime: 8,
          keyPoints: [
            'Regulatory vs. operational priorities',
            'Communication with SWIFT',
            'Attestation implications',
            'Third-party assessment timing',
            'Network standing risks'
          ]
        },
        {
          id: 'laz-q-009',
          question: 'How do you balance customer service (restoring wire transfer capacity) against security (complete verification before reconnection)?',
          category: 'decision',
          suggestedTime: 6,
          keyPoints: [
            'Customer retention vs. security',
            'Partial restoration options',
            'Risk acceptance for business continuity',
            'Customer communication about delays',
            'Competitor and market pressure'
          ]
        }
      ]
    },
    {
      id: 'lazarus-recovery',
      title: 'Recovery: Rebuilding Trust and Compliance',
      phase: 'recovery',
      duration: 30,
      objectives: [
        'Develop comprehensive remediation plan',
        'Address regulatory concerns and requirements',
        'Restore full operational capability securely',
        'Rebuild customer and stakeholder trust'
      ],
      injects: [
        {
          id: 'laz-inj-013',
          title: 'Final Financial Reconciliation',
          type: 'document',
          severity: 'high',
          triggerTime: 0,
          source: 'Chief Financial Officer',
          content: `FINANCIAL IMPACT SUMMARY
Final Reconciliation - Day 7

Direct Financial Impact:
Gross Fraudulent Transfers: $81,000,000
Successfully Blocked: ($22,500,000)
International Recovery: ($6,200,000)
Net Fraud Loss: $52,300,000

Customer Restitution:
Customer transactions made whole: $36,000,000
(Customers fully compensated, bank absorbed loss)

Insurance:
Cyber policy claim filed: $25,000,000
Expected recovery (net deductible): $20,000,000
Note: Insurer reviewing nation-state exclusion

Operational Losses (Week 1):
Lost wire transfer revenue: $1,260,000
Reduced FX revenue: $525,000
ATM downtime impact: $315,000
Emergency consulting/forensics: $2,400,000
SWIFT security assessment: $450,000
Temporary staffing: $280,000
Total Operational Impact: $5,230,000

Remediation Budget (Estimated):
SWIFT environment rebuild: $3,500,000
Enterprise security improvements: $8,000,000
Additional monitoring tools: $2,500,000
Third-party assessments: $1,500,000
Staff training and awareness: $500,000
Total Remediation: $16,000,000

Total Financial Impact:
Net Fraud + Operational + Remediation: $73,530,000
Less Expected Insurance: ($20,000,000)
Net Impact to Bank: $53,530,000

Impact to Capital Ratios:
This loss will reduce Tier 1 Capital ratio by ~15 basis points.
Remains above regulatory minimums.

Q4 Earnings Impact: Significant
Will need to disclose as material event in 10-Q.`,
          expectedActions: [
            'Finalize board financial disclosure',
            'Prepare SEC disclosure materials',
            'Complete insurance claim documentation',
            'Update capital planning'
          ],
          facilitatorNotes: 'The full financial picture is now clear. Discuss how the total cost compares to potential prevention investments.'
        },
        {
          id: 'laz-inj-014',
          title: 'OFAC Determination Letter',
          type: 'document',
          severity: 'high',
          triggerTime: 8,
          source: 'Treasury OFAC',
          content: `OFFICIAL CORRESPONDENCE
Office of Foreign Assets Control
U.S. Department of the Treasury

Subject: Apparent Violations Related to DPRK Cyber Activity

Dear [Bank General Counsel]:

OFAC has completed its preliminary review of the cyber incident at your institution involving actors associated with the Democratic People's Republic of Korea (DPRK).

Findings:
The unauthorized transfers from your institution ultimately benefited the DPRK regime through affiliated cyber actors. Under normal circumstances, this would constitute apparent violations of the North Korea Sanctions Regulations (31 CFR Part 510).

However, we have determined:
1. Your institution was a victim of criminal cyber activity
2. You promptly notified appropriate authorities
3. You cooperated fully with investigation
4. You took immediate remedial action

Determination:
Based on these factors and consistent with OFAC's Enforcement Guidelines, we are issuing a Finding of Violation (FOV) rather than pursuing civil monetary penalties. This FOV will be publicly posted.

Required Actions:
1. Implement OFAC-approved sanctions compliance improvements
2. Conduct third-party sanctions controls assessment
3. Provide quarterly compliance reports for 2 years
4. No repeat violations during probationary period

This determination is conditioned on continued cooperation and successful remediation.

While penalties are not being assessed, this matter remains on record and will be considered in any future enforcement actions.`,
          expectedActions: [
            'Brief board on OFAC determination',
            'Implement required compliance improvements',
            'Engage sanctions compliance consultant',
            'Establish quarterly reporting process'
          ],
          facilitatorNotes: 'The FOV is better than penalties but still serious. Discuss how this affects the bank\'s regulatory standing going forward.'
        },
        {
          id: 'laz-inj-015',
          title: 'Customer Communication Strategy',
          type: 'document',
          severity: 'medium',
          triggerTime: 15,
          source: 'Communications Team',
          content: `CUSTOMER COMMUNICATION PLAN
Prepared for Executive Approval

Situation:
- Incident becoming known in market
- Some media coverage expected
- Customer inquiries increasing
- Need proactive communication strategy

Proposed Communication Approach:

Phase 1: Affected Customers (Day 1-2)
- Personal calls from Relationship Managers
- Written notification of delay/resolution
- Assurance that all funds protected
- Dedicated support line for questions

Phase 2: All Customers (Day 3-5)
- Letter from CEO explaining incident
- Emphasis on protective actions taken
- Free credit monitoring offered (precautionary)
- FAQ document addressing common concerns

Phase 3: Public Statement (Day 5-7)
- Press release acknowledging incident
- Focus on rapid response and containment
- No customer funds lost (bank absorbed loss)
- Commitment to enhanced security

Key Messages:
- Customer funds and data are secure
- Bank absorbed all financial impact
- Sophisticated nation-state attack, not negligence
- Enhanced security measures implemented
- Continued commitment to customer security

Sensitive Points:
- Avoid discussing attribution in detail
- Don't disclose total loss amount (SEC timing)
- Don't comment on regulatory proceedings
- Refer media to official statement only

Risks:
- Customers may seek to move accounts regardless
- Class action attorneys monitoring situation
- Competitors may exploit in marketing

APPROVAL NEEDED: Communication timeline and content`,
          expectedActions: [
            'Approve communication strategy',
            'Brief customer-facing staff',
            'Prepare for media inquiries',
            'Monitor customer sentiment'
          ],
          facilitatorNotes: 'Crisis communication is critical. Discuss how the messaging balances transparency with legal/regulatory constraints.'
        },
        {
          id: 'laz-inj-016',
          title: 'Lessons Learned and Enhancement Plan',
          type: 'document',
          severity: 'medium',
          triggerTime: 22,
          source: 'CISO',
          content: `INCIDENT POST-MORTEM
Lessons Learned and Security Enhancement Plan

Root Cause Analysis:

Immediate Cause:
- Spearphishing email bypassed email security
- User enabled macros in malicious document
- Endpoint detection failed to identify Cobalt Strike

Contributing Factors:
- Treasury staff not in regular phishing simulation
- SWIFT environment not adequately segmented
- Service account passwords not rotated
- No anomaly detection on SWIFT transactions
- Dual control bypassed (single person overnight)

Systemic Issues:
- Security budget historically underfunded
- Treasury viewed as "trusted" - less scrutiny
- SWIFT CSP compliance check-box exercise
- No threat-informed defense against APT

What Worked:
- Fraud detection system caught anomaly
- Correspondent bank holds saved $22.5M
- Rapid escalation to leadership
- FBI coordination aided recovery

What Failed:
- Prevention entirely
- Detection took 4+ months post-compromise
- SWIFT-specific monitoring absent
- Insider threat/access controls

Security Enhancement Plan:

Immediate (30 days):
- SWIFT environment complete rebuild
- Network segmentation enforcement
- Privileged access management for Treasury
- 24/7 SWIFT transaction monitoring

Short-term (90 days):
- Enterprise phishing-resistant MFA
- EDR deployment enterprise-wide
- Threat hunting program establishment
- Treasury staff security training

Medium-term (1 year):
- Zero-trust architecture implementation
- SWIFT environment dedicated SOC monitoring
- Regular red team exercises
- Third-party security assessments (quarterly)

Investment Required: $16M capital + $4M annual operating
ROI: Prevent losses >> investment cost

Board Recommendation:
Approve comprehensive security enhancement program.
Accept that sophisticated nation-state attacks remain challenging.
Commit to continuous improvement and threat adaptation.`,
          expectedActions: [
            'Present to board for approval',
            'Prioritize immediate actions',
            'Establish program governance',
            'Set improvement metrics'
          ],
          facilitatorNotes: 'The lessons learned process is essential. Discuss how to ensure these improvements actually get implemented and sustained.'
        }
      ],
      discussionQuestions: [
        {
          id: 'laz-q-010',
          question: 'The total incident cost (~$53M net) far exceeds the proposed $16M security investment. How do you use this incident to justify sustained security investment?',
          category: 'policy',
          suggestedTime: 8,
          keyPoints: [
            'ROI calculation for security',
            'Board and executive education',
            'Risk quantification methods',
            'Sustained vs. one-time investment',
            'Competitive positioning'
          ]
        },
        {
          id: 'laz-q-011',
          question: 'How do you rebuild customer trust after a significant security incident? What actions matter most to customers?',
          category: 'lessons_learned',
          suggestedTime: 8,
          keyPoints: [
            'Transparency vs. over-disclosure',
            'Concrete actions vs. words',
            'Customer compensation approaches',
            'Ongoing communication',
            'Demonstrating improvement'
          ]
        },
        {
          id: 'laz-q-012',
          question: 'What are your key takeaways from this exercise? What changes would you advocate for in your organization?',
          category: 'lessons_learned',
          suggestedTime: 6,
          keyPoints: [
            'Personal action items',
            'Organizational improvements needed',
            'Investment priorities',
            'Training and awareness gaps',
            'Third-party risk management'
          ]
        }
      ]
    }
  ],
  scenarioConfig: {
    timeDisplay: 'elapsed',
    defaultPhaseDuration: 30,
    allowCustomInjects: true,
    requireModuleCompletion: false
  },
  branchingSettings: {
    enabled: true,
    mode: 'facilitator_controlled',
    showBranchHistory: true,
    allowBacktracking: false
  }
}

// Helper function to calculate metrics
const calculateMetrics = () => {
  const moduleCount = scenario.modules.length
  const injectCount = scenario.modules.reduce((acc, mod) => acc + mod.injects.length, 0)
  const questionCount = scenario.modules.reduce((acc, mod) => acc + mod.discussionQuestions.length, 0)
  return { moduleCount, injectCount, questionCount }
}

const { moduleCount, injectCount, questionCount } = calculateMetrics()

export const lazarusSwiftScenario: LibraryEntry = {
  id: scenario.id,
  title: scenario.title,
  category: 'Nation-State APT',
  difficulty: scenario.difficulty,
  duration: scenario.estimatedDuration,
  description: scenario.description,
  tags: ['Lazarus Group', 'DPRK', 'SWIFT', 'Financial Services', 'Wire Fraud', 'Banking', 'OFAC', 'APT38'],
  moduleCount,
  injectCount,
  questionCount,
  scenario
}
