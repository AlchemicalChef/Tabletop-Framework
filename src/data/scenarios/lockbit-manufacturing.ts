import type { Scenario, LibraryEntry } from '../../types/scenario.types'

const scenario: Scenario = {
  id: 'lockbit-manufacturing',
  title: 'Production Paralysis: LockBit 3.0 Manufacturing Attack',
  subtitle: 'Double Extortion Ransomware Targeting Mid-Sized Manufacturer',
  description: `Your organization is a mid-sized automotive parts manufacturer with $150 million in annual revenue. You operate three manufacturing facilities and supply just-in-time components to major automotive OEMs. Your production environment relies on networked industrial control systems, and any significant downtime threatens contractual obligations with penalties.

At 3:47 AM on a Saturday, your SOC receives alerts indicating widespread encryption activity. By morning, it's clear: LockBit 3.0 ransomware has encrypted your production systems, IT infrastructure, and backup repositories. A ransom note demands $2.5 million in Bitcoin, threatening to publish stolen data including customer contracts, employee records, and proprietary manufacturing processes.

This scenario explores the complex decision-making around ransomware response, including the pay/don't pay decision, supply chain notification, regulatory obligations, and operational recovery under pressure.`,
  threatCategory: 'Ransomware',
  difficulty: 'intermediate',
  estimatedDuration: 120,
  targetAudience: [
    'Security Operations Teams',
    'Executive Leadership',
    'Operations/Manufacturing',
    'Legal and Compliance',
    'Communications Teams'
  ],
  objectives: [
    'Respond to active ransomware encryption event',
    'Make informed decision on ransom payment',
    'Manage double extortion data leak threat',
    'Coordinate supply chain impact communication',
    'Execute recovery while managing business continuity',
    'Address regulatory notification requirements'
  ],
  modules: [
    {
      id: 'lockbit-detection',
      title: 'Detection: Active Encryption Event',
      phase: 'detection',
      duration: 30,
      objectives: [
        'Identify scope of ransomware encryption',
        'Implement immediate containment measures',
        'Assess backup integrity and recovery options',
        'Activate incident response procedures'
      ],
      injects: [
        {
          id: 'lock-inj-001',
          title: 'SOC Alert: Mass Encryption Detected',
          type: 'technical',
          severity: 'critical',
          triggerTime: 0,
          source: 'Security Operations Center',
          content: `CRITICAL ALERT - RANSOMWARE DETECTED
Alert ID: SOC-2024-CRIT-0892
Generated: Saturday, 03:47 AM

Alert Summary:
Mass file encryption activity detected across multiple systems

Initial Detection:
- EDR Alert: Suspicious encryption process
- Source: Multiple endpoints simultaneously
- File extension: .lockbit3
- Ransom note: README-LOCKBIT.txt

Affected Systems (preliminary):
- 147 Windows endpoints (and counting)
- 23 Windows servers
- File servers: FILESRV-01, FILESRV-02
- ERP System: Partially encrypted
- Production servers: Status unknown

EDR Analysis:
Process: LBB.exe
SHA256: [hash]
Parent: cmd.exe via scheduled task
Network: Lateral movement via SMB/Admin$
Credential: Domain admin account (svc_deploy)

Encryption Status:
- IT network: 85% encrypted
- OT network: Unknown - isolated check needed
- Backups: Attempting access...

CRITICAL: Encryption still in progress
Immediate containment required

On-call engineer en route to data center.`,
          expectedActions: [
            'Activate incident response team',
            'Implement emergency network isolation',
            'Verify backup integrity',
            'Document all observations'
          ],
          facilitatorNotes: 'Saturday timing is intentional - reduced staffing is common attack timing. Emphasize the chaos of early detection.'
        },
        {
          id: 'lock-inj-002',
          title: 'LockBit Ransom Note',
          type: 'technical',
          severity: 'critical',
          triggerTime: 5,
          source: 'Encrypted Systems',
          content: `RANSOM NOTE - Found on encrypted systems:

~~~ LockBit 3.0 ~~~

>> Your network has been penetrated <<

All your important files have been encrypted!

Your files are safe! Only modified (AES-256)

No third party software can restore your files
Don't try to modify or rename encrypted files
Don't waste your time, only we can decrypt your files

>> What happened? <<

We have penetrated your network and had access for 14 days.
We have downloaded 340GB of your sensitive data:
- Customer contracts and pricing
- Employee personal information (SSN, addresses)
- Manufacturing process documentation
- Financial records and bank information
- R&D product designs

>> What you need to do? <<

Pay $2,500,000 USD in Bitcoin within 72 hours
After payment, you will receive:
- Decryption tool for all files
- Deletion of your stolen data
- Security report on how we got in

>> If you don't pay? <<

- Price doubles after 72 hours
- Data published on our leak site after 7 days
- Your customers and competitors will see everything
- We contact your customers directly

>> Contact us <<

TOR Site: lockbit[.]onion/[unique_id]
Session ID: [unique session]

DO NOT:
- Contact FBI or law enforcement
- Hire recovery companies (they just talk to us anyway)
- Try to recover without key (files will be damaged)

Timer starts now: 71:42:17 remaining`,
          expectedActions: [
            'Document ransom demands',
            'Do not engage with attackers yet',
            'Assess data exfiltration claims',
            'Brief leadership on demands'
          ],
          facilitatorNotes: 'The ransom note reveals double extortion. Discuss how data theft changes the calculus compared to encryption-only attacks.'
        },
        {
          id: 'lock-inj-003',
          title: 'Backup Assessment Results',
          type: 'technical',
          severity: 'critical',
          triggerTime: 12,
          source: 'IT Infrastructure Team',
          content: `BACKUP ASSESSMENT REPORT
Status: CRITICAL SITUATION

Primary Backup System (Veeam):
- Status: ENCRYPTED
- Backup repository: Encrypted with .lockbit3
- Backup server: Compromised
- Last good backup: Unknown (metadata encrypted)

Secondary Backup (Tape):
- Status: PARTIALLY VIABLE
- Weekly full backup: 8 days old
- Daily incrementals: 5-8 days old (some tapes offsite)
- Tapes in autoloader: Encrypted
- Offsite tapes: RETRIEVABLE (Iron Mountain)

Cloud Backup (AWS S3):
- Status: INTACT but LIMITED
- Coverage: Critical systems only (30% of environment)
- Last sync: 12 hours ago
- Files: Unencrypted (immutable storage)

Recovery Time Estimates:

Option A: Full restoration from tape/cloud
- Retrieve offsite tapes: 4-6 hours
- Rebuild servers: 48-72 hours
- Data restoration: 72-96 hours
- Total: 5-7 days minimum
- Data loss: 5-8 days of transactions

Option B: Pay ransom and decrypt
- Decryption time: 24-48 hours (if key works)
- Verification: 12-24 hours
- Total: 2-4 days
- Data loss: Minimal (if decryption succeeds)

Option C: Hybrid approach
- Decrypt critical systems
- Rebuild lower priority from backup
- Total: 3-5 days

Critical Gap:
Production control systems (PLCs, HMIs) cannot be easily restored. Custom configurations may require vendor support regardless of approach.`,
          expectedActions: [
            'Initiate offsite tape retrieval',
            'Verify cloud backup integrity',
            'Assess production system recovery options',
            'Begin parallel recovery planning'
          ],
          facilitatorNotes: 'Backup status is partially good news. Discuss how backup strategy affects ransom decision.'
        },
        {
          id: 'lock-inj-004',
          title: 'Production Impact Assessment',
          type: 'operational',
          severity: 'critical',
          triggerTime: 20,
          source: 'VP Manufacturing',
          content: `PRODUCTION IMPACT ASSESSMENT
Prepared by: VP Manufacturing
Status: PRODUCTION HALTED

All Three Facilities Impact:

Plant 1 - Main Assembly (60% of revenue):
- Status: SHUTDOWN
- HMI systems: Encrypted
- PLC programs: Unknown state
- Inventory system: Offline
- Est. daily loss: $420,000

Plant 2 - Precision Components (25% of revenue):
- Status: SHUTDOWN
- CNC controllers: Encrypted
- Quality systems: Offline
- Est. daily loss: $175,000

Plant 3 - Specialty Products (15% of revenue):
- Status: PARTIAL OPERATION
- Some standalone systems operational
- Manual processes possible
- Est. daily loss: $85,000

Total Daily Production Loss: $680,000

Customer Impact (Critical):

1. Major OEM Customer (40% of revenue)
   - JIT delivery contract
   - Contractual penalty: $50,000/day after 48 hours
   - 72-hour buffer inventory at their plant
   - Risk: Production line shutdown at customer

2. Tier 1 Supplier Network
   - 12 customers with orders in progress
   - Average lead time commitment: 5 days
   - Penalty exposure: ~$25,000/day aggregate

3. Annual Contract Renewal
   - Major OEM contract renewal in 30 days
   - Any delivery failures affect negotiation

Workforce Impact:
- 450 production employees idled
- Union contract: Guaranteed pay for 5 days
- After 5 days: Temporary layoff procedures required

IMMEDIATE: CEO must call Major OEM within 4 hours per contract.`,
          expectedActions: [
            'Brief CEO for customer call',
            'Assess contractual obligations',
            'Evaluate workforce impact',
            'Calculate total exposure'
          ],
          facilitatorNotes: 'JIT manufacturing creates severe time pressure. Discuss how supply chain dependencies affect response decisions.'
        }
      ],
      discussionQuestions: [
        {
          id: 'lock-q-001',
          question: 'When ransomware encryption is still in progress, what is the optimal balance between investigation and containment? When do you pull the plug?',
          category: 'technical',
          suggestedTime: 8,
          keyPoints: [
            'Stop active encryption vs. preserve evidence',
            'Network isolation options',
            'OT network considerations',
            'Data that may not be recoverable',
            'Evidence for later investigation'
          ]
        },
        {
          id: 'lock-q-002',
          question: 'How does the presence of viable (though older) backups affect your ransom payment decision calculus?',
          category: 'decision',
          suggestedTime: 8,
          keyPoints: [
            'Recovery time vs. ransom timeline',
            'Data loss from backup age',
            'Production system complexity',
            'Reliability of decryption tools',
            'Double extortion still applies'
          ]
        },
        {
          id: 'lock-q-003',
          question: 'With JIT customer contracts and penalty clauses, how do supply chain dependencies influence your response timeline and decisions?',
          category: 'decision',
          suggestedTime: 6,
          keyPoints: [
            'Contractual obligations',
            'Customer relationship value',
            'Penalty cost vs. ransom cost',
            'Communication timing',
            'Competitive implications'
          ]
        }
      ]
    },
    {
      id: 'lockbit-intrusion',
      title: 'Active Intrusion: Assessing the Breach',
      phase: 'analysis',
      duration: 30,
      objectives: [
        'Determine attacker dwell time and access',
        'Validate data exfiltration claims',
        'Understand attack chain for containment',
        'Assess regulatory notification requirements'
      ],
      injects: [
        {
          id: 'lock-inj-005',
          title: 'Forensic Analysis: Attack Timeline',
          type: 'technical',
          severity: 'high',
          triggerTime: 0,
          source: 'Incident Response Team',
          content: `FORENSIC ANALYSIS REPORT
Initial Findings - Attack Timeline

Day -14: Initial Access
- Phishing email to accounts payable
- Attachment: "Invoice_Update_March.xlsm"
- Macro executed Cobalt Strike stager
- Initial beacon to 185.XX.XX.XX

Day -13 to -10: Reconnaissance
- Internal network scanning
- AD enumeration via BloodHound
- Identified privileged accounts
- Mapped file shares and servers

Day -9 to -7: Privilege Escalation
- Kerberoasted svc_deploy account
- Cracked weak password: Summer2023!
- Gained domain admin equivalent

Day -6 to -3: Data Exfiltration
- Staged data on file server
- Exfiltrated via rclone to cloud storage
- 340GB transferred to MEGA cloud
- Exfil confirmed in network logs

Day -2 to -1: Pre-Positioning
- Deployed LockBit to 200+ systems
- Scheduled task for 3:47 AM Saturday
- Disabled Windows Defender via GPO
- Deleted shadow copies

Day 0 (Today): Execution
- Scheduled task triggered encryption
- Simultaneous execution across network
- Backup systems targeted first
- Production last (ensure maximum impact)

Key IOCs:
- Cobalt Strike C2: 185.XX.XX.XX
- LockBit affiliate ID: [unique]
- Service account compromised: svc_deploy
- Exfil destination: MEGA cloud storage

Assessment: Professional affiliate operation with 14-day dwell time.`,
          expectedActions: [
            'Block identified IOCs at perimeter',
            'Reset all privileged credentials',
            'Preserve forensic evidence',
            'Assess scope of data theft'
          ],
          facilitatorNotes: 'The 14-day dwell time and professional execution indicate an experienced affiliate. Discuss the RaaS affiliate model.'
        },
        {
          id: 'lock-inj-006',
          title: 'Data Exfiltration Validation',
          type: 'technical',
          severity: 'critical',
          triggerTime: 8,
          source: 'Incident Response Team',
          content: `DATA EXFILTRATION ANALYSIS
Validation of Attacker Claims

Network Log Analysis:
Confirmed outbound data transfer to MEGA cloud storage

Timeline: Day -6 to Day -3
Total Transferred: 347GB (matches ransom claim)

Data Identified in Staging Folder (recovered from memory):

1. HR_Employee_Records.zip (12GB)
   - Full employee database export
   - SSNs, addresses, bank info for direct deposit
   - 2,847 current and former employees

2. Customer_Contracts_2020-2024.zip (45GB)
   - Master agreements with all customers
   - Pricing sheets and discount structures
   - Customer-specific specifications

3. Financial_Records.zip (28GB)
   - 4 years of financial statements
   - Bank account information
   - Tax records and filings

4. Manufacturing_Processes.zip (89GB)
   - Proprietary manufacturing specifications
   - Quality control procedures
   - Tooling designs and CAD files

5. RD_Product_Designs.zip (67GB)
   - Next-generation product designs
   - Patent applications (pending)
   - Customer co-development projects

6. IT_Infrastructure.zip (14GB)
   - Network diagrams
   - System credentials (encrypted backup)
   - Security configurations

7. Misc_Business_Docs.zip (92GB)
   - Emails from executives
   - Board meeting minutes
   - M&A exploration documents

Regulatory Implications:
- Employee PII: State breach notification required
- Customer data: Contractual notification required
- Financial data: SOX implications
- IP theft: Trade secret exposure

The data theft is real and comprehensive.`,
          expectedActions: [
            'Brief legal on notification obligations',
            'Assess customer contractual requirements',
            'Evaluate IP and competitive exposure',
            'Prepare notification timeline'
          ],
          facilitatorNotes: 'The data exfiltration confirmation changes the equation - even with recovery, data is still exposed. This is the "double" in double extortion.'
        },
        {
          id: 'lock-inj-007',
          title: 'LockBit Leak Site Preview',
          type: 'technical',
          severity: 'critical',
          triggerTime: 15,
          source: 'Threat Intelligence',
          content: `DARK WEB MONITORING ALERT
LockBit 3.0 Leak Site Update

Your organization has been listed on the LockBit leak site:

Victim: [Your Company Name]
Posted: 2 hours ago
Status: "Negotiations open"
Timer: 6 days, 21 hours

Preview Data Published:
- 5 sample files visible
- Screenshot of employee database (names visible)
- Screenshot of customer contract (major OEM visible)
- Manufacturing process document (cover page)
- Financial summary page

Attacker Commentary:
"[Company] makes parts for [Major OEM]. Nice contracts, nice data. They have 7 days to pay $2.5M or everything goes public. We also contact their customers directly. Tick tock."

Visibility:
- Leak site has ~10,000 daily visitors
- Indexed by multiple threat intel platforms
- Security researchers monitoring
- Journalists known to check site

Implications:
- Public knows you were breached
- Customers may see before you notify them
- Competitors have potential access
- Media inquiries likely within 24 hours

Engagement Consideration:
Initial engagement with attackers on Tor site may buy time and gather intelligence, but legitimizes negotiation.`,
          expectedActions: [
            'Monitor leak site for changes',
            'Prepare for media inquiries',
            'Accelerate customer notification',
            'Consider initial attacker engagement'
          ],
          facilitatorNotes: 'The leak site posting creates public pressure. Discuss how public exposure affects the response timeline and decisions.',
          decisionPoint: {
            question: 'Will you engage with the attackers through their Tor portal?',
            options: [
              {
                id: 'engage-negotiate',
                label: 'Engage to Negotiate',
                description: 'Open communication channel, explore negotiation options',
                consequence: 'May buy time and reduce ransom, but legitimizes attackers and risks being seen as willing to pay'
              },
              {
                id: 'engage-intel',
                label: 'Engage for Intelligence Only',
                description: 'Communicate to gather information but do not commit to payment',
                consequence: 'May gain time and insight but could frustrate attackers into escalating'
              },
              {
                id: 'no-engage',
                label: 'No Engagement',
                description: 'Do not communicate with attackers at all',
                consequence: 'Clear stance but no opportunity to negotiate timeline or verify data claims'
              }
            ]
          }
        },
        {
          id: 'lock-inj-008',
          title: 'Law Enforcement Contact',
          type: 'communication',
          severity: 'medium',
          triggerTime: 22,
          source: 'FBI Field Office',
          content: `INCOMING CALL
From: FBI Cyber Division - Local Field Office

"Good morning, this is Special Agent [Name] with the FBI Cyber Division. We monitor the LockBit leak site as part of ongoing investigations, and we noticed your company was just listed.

We want to reach out proactively to offer assistance. The LockBit operation is a major focus of ours and international partners. We have significant intelligence on their operations that may help your response.

I want to be upfront about a few things:

1. We recommend against paying the ransom. Payment funds criminal operations and there's no guarantee they'll delete your data or provide working decryption.

2. However, we understand this is a business decision. If you do pay, we'd appreciate being informed - it helps our investigation.

3. We can provide technical assistance, threat intelligence, and coordination with international partners for potential fund recovery.

4. We have seen cases where LockBit affiliates were arrested, and decryption keys were recovered. No guarantees, but it happens.

5. Anything you share with us is confidential and will not be shared with regulators without your consent.

We're not here to judge your decisions. We're here to help. Can we schedule a call with your incident response team?"`,
          expectedActions: [
            'Schedule FBI coordination call',
            'Discuss information sharing boundaries',
            'Understand available assistance',
            'Consider ransom payment implications'
          ],
          facilitatorNotes: 'FBI takes a consultative approach on ransom. Discuss how law enforcement engagement affects response options.'
        }
      ],
      discussionQuestions: [
        {
          id: 'lock-q-004',
          question: 'With confirmed data exfiltration, how does your ransom payment decision change? Does paying protect against data publication?',
          category: 'decision',
          suggestedTime: 8,
          keyPoints: [
            'No guarantee of data deletion',
            'Attackers may already have sold data',
            'Reputation damage may be done',
            'But may prevent wider publication',
            'Negotiation for proof of deletion?'
          ]
        },
        {
          id: 'lock-q-005',
          question: 'The leak site posting makes the breach public. How does this affect your customer notification timeline and approach?',
          category: 'coordination',
          suggestedTime: 8,
          keyPoints: [
            'Customers may find out from news',
            'Proactive vs. reactive notification',
            'Contract requirements',
            'Relationship management',
            'Competitive intelligence concerns'
          ]
        },
        {
          id: 'lock-q-006',
          question: 'Should you engage with the attackers through their Tor portal? What are the risks and benefits of negotiation?',
          category: 'decision',
          suggestedTime: 6,
          keyPoints: [
            'Buying time for recovery',
            'Intelligence gathering',
            'Legitimizing criminals',
            'Negotiation tactics',
            'Intermediary/negotiator use'
          ]
        }
      ]
    },
    {
      id: 'lockbit-ransom',
      title: 'Ransom Decision: Pay or Recover',
      phase: 'containment',
      duration: 30,
      objectives: [
        'Make informed ransom payment decision',
        'Execute chosen recovery strategy',
        'Manage customer and supplier communications',
        'Address regulatory notification requirements'
      ],
      injects: [
        {
          id: 'lock-inj-009',
          title: 'Executive Decision Meeting',
          type: 'document',
          severity: 'critical',
          triggerTime: 0,
          source: 'CEO',
          content: `EXECUTIVE DECISION MEETING
Emergency Board Authorization Requested

Current Situation Summary:
- Production halted: 18+ hours
- Daily losses: $680,000 production + penalties accumulating
- Ransom demand: $2.5M (negotiated to $1.8M via intermediary)
- Timer: 58 hours remaining before price doubles
- Data exposure: 347GB confirmed exfiltrated

Recovery Options Analysis:

OPTION A: Pay Ransom ($1.8M negotiated)
Pros:
- Fastest recovery (2-4 days)
- Minimal data loss
- May prevent data publication
- Decryptor usually works (85%+ success rate for LockBit)
Cons:
- No guarantee
- Funds criminal enterprise
- May be targeted again
- Reputational risk if publicized
- Insurance may not cover

OPTION B: Recover from Backup (No Payment)
Pros:
- Denies revenue to criminals
- Full control of recovery
- Insurance more likely to cover
- Better PR narrative
Cons:
- 5-7 day recovery minimum
- 5-8 days data loss
- Production systems complex
- Data still gets published
- Customer penalties: ~$500K+

OPTION C: Hybrid (Pay for Decryption, Accept Data Leak)
Pros:
- Fast recovery
- Accepts data is compromised regardless
Cons:
- Still paying criminals
- Data published anyway

Financial Analysis:
- 5 days downtime cost: $3.4M production + ~$500K penalties
- Ransom: $1.8M (negotiated)
- Reputational cost: Unquantified

Legal Input: No legal prohibition on payment, but Treasury guidance discourages. OFAC sanctions screening required before any payment.

Insurance Input: Cyber policy covers ransom up to $1M, requires insurer pre-approval. Coverage for data breach response: $5M.

DECISION REQUIRED: Board authorization for ransom payment (or not)`,
          expectedActions: [
            'Evaluate all options thoroughly',
            'Seek board authorization',
            'Conduct OFAC sanctions screening',
            'Notify insurance carrier'
          ],
          facilitatorNotes: 'This is the central decision point. Take significant time here to debate the merits of each approach.',
          decisionPoint: {
            question: 'What is your decision on the ransom payment?',
            options: [
              {
                id: 'pay-ransom',
                label: 'Pay the Ransom',
                description: 'Pay the negotiated $1.8M for decryption keys',
                consequence: 'Fastest recovery but funds criminals and no guarantee on data deletion'
              },
              {
                id: 'no-payment',
                label: 'No Payment - Backup Recovery',
                description: 'Recover entirely from backups without any payment',
                consequence: 'Longer recovery, more data loss, but denies revenue to attackers'
              },
              {
                id: 'hybrid',
                label: 'Hybrid Approach',
                description: 'Pay for critical system decryption, rebuild others from backup',
                consequence: 'Balanced approach but complex execution'
              }
            ]
          }
        },
        {
          id: 'lock-inj-010',
          title: 'Major OEM Customer Call',
          type: 'communication',
          severity: 'critical',
          triggerTime: 8,
          source: 'Major Customer',
          content: `INCOMING CALL
From: VP Supply Chain - [Major OEM]

"I just got off a call with my CISO. They saw your company on some ransomware leak site. What's going on?

I need straight answers:

1. What happened and when?
2. Was any of our data compromised? We have proprietary specifications in your systems.
3. When will you be able to ship? Our buffer inventory runs out in 54 hours.
4. What's your recovery plan? Days matter here.

I have to brief my CEO in 2 hours. If you can't give me confidence you'll be shipping by Monday, I need to activate our backup supplier. That will take them 5 days to tool up, which means our line goes down for 3 days.

I'm also concerned about our contract data being exposed. Our pricing and terms are competitive intelligence. If that gets out, we have a problem.

We've been partners for 8 years. I want to work through this. But I need transparency and a realistic timeline.

What can you tell me?"`,
          expectedActions: [
            'Provide honest assessment of timeline',
            'Address data exposure concerns',
            'Discuss mitigation options',
            'Preserve relationship while managing expectations'
          ],
          facilitatorNotes: 'Customer pressure is real but requires honest communication. Overpromising will backfire. Discuss how to have this difficult conversation.'
        },
        {
          id: 'lock-inj-011',
          title: 'State Attorney General Inquiry',
          type: 'communication',
          severity: 'high',
          triggerTime: 15,
          source: 'State Attorney General',
          content: `OFFICIAL CORRESPONDENCE
Office of the State Attorney General
Consumer Protection Division

Subject: Data Breach Notification Inquiry

Dear [General Counsel]:

This office has become aware of a potential data breach affecting [Your Company] through media reports and cybersecurity community notifications.

Under [State] data breach notification law ([cite]), entities experiencing a breach of personal information affecting [State] residents must notify this office and affected individuals within 45 days of discovery.

Based on available information, it appears employee personal information may have been compromised. This triggers notification obligations.

Please provide within 72 hours:

1. Confirmation of whether a breach occurred
2. Categories of personal information affected
3. Number of [State] residents affected
4. Timeline for consumer notification
5. Description of breach and response measures
6. Contact information for your incident lead

Failure to comply with notification requirements may result in civil penalties of up to $5,000 per violation.

We also note that if personal information was subject to encryption at rest, safe harbor provisions may apply. Please include information about your data protection measures.

This office is prepared to work cooperatively with organizations that demonstrate good faith compliance efforts.

[Signature]
Chief, Consumer Protection Division`,
          expectedActions: [
            'Coordinate response with legal',
            'Assess state-specific requirements',
            'Prepare notification plan',
            'Document safe harbor applicability'
          ],
          facilitatorNotes: 'Regulatory pressure adds timeline requirements. Discuss multi-state notification complexities for employee data.'
        },
        {
          id: 'lock-inj-012',
          title: 'Cyber Insurance Carrier Guidance',
          type: 'communication',
          severity: 'medium',
          triggerTime: 22,
          source: 'Cyber Insurance Carrier',
          content: `INSURER COMMUNICATION
From: Cyber Claims Manager

Subject: Ransomware Event - Coverage Guidance

We have received your notification and are assigning a claims adjuster. Reference number: [CLAIM-2024-XXXXX]

Coverage Summary:

Ransomware Payment:
- Sub-limit: $1,000,000
- Deductible: $100,000
- Requirement: Insurer pre-approval required
- Note: We will review the negotiated amount and sanction screening before approval

Business Interruption:
- Coverage: Up to $5,000,000
- Waiting period: 8 hours (satisfied)
- Documentation required: Daily loss calculations

Data Breach Response:
- Coverage: Up to $5,000,000
- Includes: Notification, credit monitoring, legal costs
- Pre-approved vendors required

Important Conditions:

1. Ransom Payment Approval
If you intend to seek ransom payment coverage, you MUST:
- Complete OFAC sanctions screening (we can assist)
- Document negotiation efforts
- Obtain our written pre-approval

2. Vendor Selection
Please use our pre-approved panel for:
- Incident response (we have 3 approved firms)
- Legal (breach notification specialists)
- Forensics
Using non-panel vendors may affect coverage.

3. Subrogation Rights
By accepting coverage, you assign us rights to pursue recovery from responsible parties.

Our breach response team can be mobilized within 4 hours. Should we deploy?`,
          expectedActions: [
            'Confirm insurer panel vendor requirements',
            'Document all expenses for claim',
            'Obtain pre-approval before any ransom',
            'Engage insurer breach response team'
          ],
          facilitatorNotes: 'Insurance requirements add constraints but also resources. Discuss how insurance shapes response decisions.'
        }
      ],
      discussionQuestions: [
        {
          id: 'lock-q-007',
          question: 'What factors most heavily influence your ransom payment decision? How do you weigh financial, ethical, legal, and operational considerations?',
          category: 'decision',
          suggestedTime: 10,
          keyPoints: [
            'Business impact of extended downtime',
            'Ethical concerns funding criminals',
            'Data publication regardless of payment',
            'Insurance coverage limitations',
            'Precedent and targeting implications'
          ]
        },
        {
          id: 'lock-q-008',
          question: 'How do you manage customer communications when you cannot provide certainty on recovery timeline? What commitments can you make?',
          category: 'coordination',
          suggestedTime: 8,
          keyPoints: [
            'Honesty vs. protecting relationship',
            'Under-promise, over-deliver approach',
            'Contractual implications of commitments',
            'Backup supplier activation thresholds',
            'Long-term relationship preservation'
          ]
        },
        {
          id: 'lock-q-009',
          question: 'With multiple state breach notification laws potentially triggered, how do you manage compliance complexity while responding to the incident?',
          category: 'policy',
          suggestedTime: 6,
          keyPoints: [
            'Multi-state requirements differences',
            'Notification timing coordination',
            'Consistent messaging across jurisdictions',
            'AG cooperation benefits',
            'Panel counsel utilization'
          ]
        }
      ]
    },
    {
      id: 'lockbit-recovery',
      title: 'Recovery: Restoring Operations',
      phase: 'recovery',
      duration: 30,
      objectives: [
        'Execute recovery plan and restore operations',
        'Implement security improvements',
        'Complete regulatory notifications',
        'Document lessons learned'
      ],
      injects: [
        {
          id: 'lock-inj-013',
          title: 'Recovery Status Update (Day 4)',
          type: 'document',
          severity: 'medium',
          triggerTime: 0,
          source: 'Incident Commander',
          content: `RECOVERY STATUS UPDATE
Day 4 of Incident Response

Recovery Method Executed: [Dependent on decision made]

If Ransom Paid:
- Decryption tool received and validated
- 89% of systems successfully decrypted
- 11% required backup restore (corrupted files)
- Production systems: Online
- ERP: Restored and reconciled
- Total recovery time: 3.5 days

If No Payment:
- Offsite tapes retrieved and cataloged
- Server rebuilds: 75% complete
- Data restoration: 60% complete
- Production systems: Partially online (manual mode)
- ERP: Rebuilding, 5-8 days data loss
- Total recovery time: 5.5 days (estimated 2 more days)

Current Production Status:
- Plant 1: 60% capacity
- Plant 2: 40% capacity
- Plant 3: 85% capacity

Customer Status:
- Major OEM: Partial shipment made, penalty exposure reduced
- Other customers: Backlog being addressed
- Estimated return to full production: 2 more days

Outstanding Issues:
1. Production control calibration data needs verification
2. Quality system requires audit before certification
3. Some legacy system recovery still pending

Data Breach Status:
- LockBit has not published additional data (yet)
- Timer expired 12 hours ago
- Unknown if/when full dump will occur
- Media inquiries continuing

Resource Status:
- External IR team: Engaged through recovery
- Staff: Extended shifts, fatigue setting in
- Insurance: Covering approved expenses`,
          expectedActions: [
            'Continue recovery operations',
            'Monitor for data publication',
            'Prepare for sustained recovery effort',
            'Address staff fatigue'
          ],
          facilitatorNotes: 'Recovery is progressing but not complete. Discuss the long tail of incident response and recovery.'
        },
        {
          id: 'lock-inj-014',
          title: 'Data Publication Alert',
          type: 'technical',
          severity: 'critical',
          triggerTime: 10,
          source: 'Threat Intelligence',
          content: `DARK WEB ALERT - DATA PUBLISHED
Priority: CRITICAL

LockBit has published partial data dump:

Posted: 2 hours ago
Files Released: 15GB sample (of 347GB total)

Published Content Identified:
1. Employee_Directory_2024.xlsx
   - Full employee list visible
   - SSNs, addresses, phone numbers exposed
   - 2,847 employees affected

2. [Major OEM]_Pricing_Agreement_2023.pdf
   - Customer contract visible
   - Pricing terms exposed
   - Confidentiality clause violated

3. Q3_Financial_Summary.xlsx
   - Revenue figures visible
   - Margin data exposed

4. Manufacturing_Process_TM2847.pdf
   - Proprietary process document
   - Trade secret implications

5. Sample_Employee_W2s.zip
   - 50 employee W-2 forms
   - Full tax information visible

Attacker Comment:
"First sample. [Company] thought they were smart. Full dump in 48 hours. Maybe their customers want to negotiate instead?"

Media Coverage:
- 3 industry publications covering story
- Local news requesting interview
- Reuters inquiry received

Immediate Concerns:
- Employee notification now mandatory (within 24 hours)
- Customer notification required per contract
- Trade secret exposure requires legal assessment
- Media response strategy needed NOW`,
          expectedActions: [
            'Accelerate employee notification',
            'Contact affected customers directly',
            'Prepare media response',
            'Assess trade secret damage'
          ],
          facilitatorNotes: 'Data publication happens regardless of payment decision. Discuss crisis communication under maximum pressure.'
        },
        {
          id: 'lock-inj-015',
          title: 'Employee Town Hall Questions',
          type: 'communication',
          severity: 'high',
          triggerTime: 18,
          source: 'Human Resources',
          content: `EMPLOYEE TOWN HALL PREPARATION
Submitted Questions for CEO/CISO

Employees have submitted questions for the all-hands meeting:

Identity Theft Concerns:
"My SSN is now on the dark web. What is the company doing to protect me? Who pays if my identity is stolen?"

"I've already gotten 3 spam calls since the breach. How did they get my number?"

"Is 2 years of credit monitoring really enough? Identity thieves can sit on data for years."

Job Security:
"Are there going to be layoffs because of this? The company lost millions."

"Is this going to affect our annual bonuses?"

"Should I be looking for another job?"

Accountability:
"How did this happen? Why weren't our systems protected?"

"Is anyone being held responsible for this?"

"Why wasn't our data encrypted if it was so sensitive?"

Trust:
"How do I know this won't happen again?"

"Why should I trust the company with my data going forward?"

Union Concerns (from union rep):
"We need written guarantees about employee protections. Our members are scared and angry."

Tone Guidance:
Employees are frightened and frustrated. Defensive responses will backfire. Acknowledge failure, explain actions, commit to improvement.`,
          expectedActions: [
            'Prepare honest, empathetic responses',
            'Announce concrete employee protections',
            'Address job security concerns',
            'Commit to visible security improvements'
          ],
          facilitatorNotes: 'Internal communication is often overlooked. Discuss how to maintain employee trust and morale after a breach.'
        },
        {
          id: 'lock-inj-016',
          title: 'Post-Incident Assessment',
          type: 'document',
          severity: 'medium',
          triggerTime: 25,
          source: 'Incident Response Team',
          content: `POST-INCIDENT ASSESSMENT
Preliminary Findings - Day 7

Attack Success Factors:

1. Initial Access
- Phishing email bypassed email security
- User enabled macros despite training
- No email attachment sandboxing

2. Persistence and Escalation
- Service account with weak password
- Kerberoasting attack successful
- No privileged access management solution

3. Lateral Movement
- Flat network enabled easy movement
- Limited network segmentation
- Domain admin equivalence too broad

4. Data Exfiltration
- Large data transfer undetected
- No DLP or CASB controls
- Cloud storage access unrestricted

5. Backup Destruction
- Backups on same network as production
- No immutable backup copies
- Backup credentials accessible from compromised accounts

Security Program Gaps Identified:
- Email security: Basic (needs ATP)
- Endpoint protection: Present but misconfigured
- Network segmentation: Minimal
- Privileged access: No PAM solution
- Backup strategy: Inadequate air-gap
- Security monitoring: Limited visibility
- Incident response: No retainer, delayed response

Recommended Improvements (Priority Order):
1. Immutable, air-gapped backups ($150K)
2. PAM solution implementation ($200K)
3. Network segmentation project ($400K)
4. EDR tuning and 24/7 monitoring ($300K/year)
5. Email ATP and security awareness ($150K)
6. IR retainer and tabletop exercises ($100K/year)

Total Security Investment: ~$1.3M capital + $400K annual

Comparison: This incident cost ~$8M+ total
Prevention investment would have been ~$1.3M

Root Cause: Underinvestment in security despite known risks.`,
          expectedActions: [
            'Present findings to board',
            'Prioritize security investments',
            'Develop implementation roadmap',
            'Establish improvement metrics'
          ],
          facilitatorNotes: 'The cost comparison is stark. Discuss how to sustain security investment commitment beyond the immediate crisis.'
        }
      ],
      discussionQuestions: [
        {
          id: 'lock-q-010',
          question: 'When data is published despite your response efforts, how do you manage the ongoing crisis communications with employees, customers, and media?',
          category: 'coordination',
          suggestedTime: 8,
          keyPoints: [
            'Proactive vs. reactive communication',
            'Consistent messaging across audiences',
            'Admitting failures while showing progress',
            'Managing ongoing media interest',
            'Employee support and transparency'
          ]
        },
        {
          id: 'lock-q-011',
          question: 'The post-incident analysis shows prevention would have cost $1.3M vs. incident cost of $8M+. How do you prevent "incident amnesia" and sustain security investment?',
          category: 'lessons_learned',
          suggestedTime: 8,
          keyPoints: [
            'Board-level security governance',
            'Risk quantification methods',
            'Security as business enabler',
            'Sustained investment vs. one-time',
            'Accountability structures'
          ]
        },
        {
          id: 'lock-q-012',
          question: 'What are your key takeaways from this exercise? What would you do differently with the benefit of hindsight?',
          category: 'lessons_learned',
          suggestedTime: 6,
          keyPoints: [
            'Personal lessons learned',
            'Organizational improvements',
            'Investment priorities',
            'Response process improvements',
            'Preparation activities to begin'
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

export const lockbitManufacturingScenario: LibraryEntry = {
  id: scenario.id,
  title: scenario.title,
  category: 'Ransomware',
  difficulty: scenario.difficulty,
  duration: scenario.estimatedDuration,
  description: scenario.description,
  tags: ['LockBit', 'Ransomware', 'Manufacturing', 'Double Extortion', 'OT Security', 'Supply Chain', 'JIT'],
  moduleCount,
  injectCount,
  questionCount,
  scenario
}
