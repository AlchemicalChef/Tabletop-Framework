import type { Scenario, LibraryEntry } from '../../types/scenario.types'

const scenario: Scenario = {
  id: 'blackcat-energy',
  title: 'Triple Threat: BlackCat/ALPHV Energy Utility Attack',
  subtitle: 'Triple Extortion Ransomware Targeting Regional Energy Utility',
  description: `Your organization is a regional energy utility serving 250,000 residential and commercial customers. You operate natural gas distribution infrastructure, including pipelines, compressor stations, and a small LNG storage facility. Your operations are subject to NERC CIP standards for electric reliability and TSA/PHMSA regulations for pipeline security.

A sophisticated ransomware attack attributed to BlackCat/ALPHV has compromised your IT environment and is threatening your OT systems. The attackers are employing triple extortion: encryption of systems, threat of data publication, AND threats of DDoS attacks against customer-facing services. They've also threatened to notify media and regulators if you don't engage quickly.

This scenario explores the unique challenges of ransomware response in the critical infrastructure sector, including the balance between operational safety, regulatory compliance, and business continuity.`,
  threatCategory: 'Ransomware',
  difficulty: 'advanced',
  estimatedDuration: 150,
  targetAudience: [
    'Security Operations Teams',
    'OT/ICS Security Personnel',
    'Executive Leadership',
    'Regulatory Affairs',
    'Crisis Management Teams'
  ],
  objectives: [
    'Respond to ransomware while protecting critical infrastructure',
    'Make decisions balancing safety, security, and operations',
    'Navigate complex regulatory notification requirements',
    'Manage triple extortion pressure tactics',
    'Coordinate with federal partners (CISA, TSA, FBI)',
    'Execute recovery while maintaining essential services'
  ],
  modules: [
    {
      id: 'blackcat-detection',
      title: 'Detection: IT/OT Convergence Threat',
      phase: 'detection',
      duration: 40,
      objectives: [
        'Identify scope of ransomware across IT and OT boundaries',
        'Assess threat to operational technology systems',
        'Implement containment protecting critical operations',
        'Activate critical infrastructure incident response'
      ],
      injects: [
        {
          id: 'bc-inj-001',
          title: 'Initial Ransomware Detection',
          type: 'technical',
          severity: 'critical',
          triggerTime: 0,
          source: 'Security Operations Center',
          content: `CRITICAL SECURITY ALERT
Alert ID: SOC-CRIT-2024-1847
Time: Tuesday, 06:23 AM

RANSOMWARE ACTIVITY DETECTED

Detection Source: EDR Platform
Affected Systems: Multiple Windows servers

Initial Observations:
- Mass encryption activity beginning 06:15 AM
- File extension: .sphynx (BlackCat/ALPHV variant)
- Ransom note: RECOVER-sphynx-FILES.txt
- Encryption spreading via SMB

Known Affected Systems (Growing):
Corporate IT:
- 47 Windows workstations
- 12 file servers
- 2 domain controllers (partial)
- Email server: Encrypted
- HR/Payroll systems: Encrypted

Engineering/SCADA DMZ:
- 4 engineering workstations: ENCRYPTED
- Historian server: STATUS UNKNOWN
- SCADA interface server: STATUS UNKNOWN

OT Network:
- STATUS UNKNOWN - Cannot verify from IT network
- Control room reports normal operations currently

CRITICAL CONCERN:
Engineering workstations with SCADA connectivity are confirmed encrypted. Potential for OT network lateral movement.

EDR Analysis:
Initial vector: Compromised VPN credential
Lateral movement: Cobalt Strike beacons
Privilege escalation: Domain admin compromised
Pre-encryption dwell time: ~8 days

IMMEDIATE ACTION REQUIRED:
Assess OT network status and containment options.`,
          expectedActions: [
            'Activate incident response procedures',
            'Physically verify OT network status',
            'Implement emergency IT/OT isolation',
            'Contact control room for operational status'
          ],
          facilitatorNotes: 'The IT/OT boundary is the critical concern. Emphasize that encrypted engineering workstations may have had OT access.'
        },
        {
          id: 'bc-inj-002',
          title: 'BlackCat Ransom Demand',
          type: 'technical',
          severity: 'critical',
          triggerTime: 5,
          source: 'Encrypted Systems',
          content: `RANSOM NOTE - RECOVER-sphynx-FILES.txt

==============================================================
                    BLACKCAT/ALPHV
==============================================================

ATTENTION [UTILITY NAME]:

Your network is encrypted. Your data is stolen.

Let's be clear about your situation:

1. ENCRYPTION
   All your important files are encrypted with military-grade
   encryption. Without our key, recovery is impossible.

2. DATA THEFT
   We have exfiltrated 780GB of your sensitive data:
   - Customer PII (250,000 customers)
   - SCADA system documentation
   - Pipeline safety records
   - Employee information
   - Financial records
   - Security configurations

3. DDoS CAPABILITY
   We have prepared DDoS infrastructure targeting:
   - Your customer payment portal
   - Your public website
   - Your email systems
   If negotiations fail, we will demonstrate.

4. REGULATORY NOTIFICATION
   We know you're subject to NERC, TSA, and PHMSA.
   If you don't negotiate, we notify regulators and media
   about your security failures. They love utility breaches.

YOUR SITUATION:
- Critical infrastructure operator
- Customer data exposed
- Operational documentation stolen
- Regulatory scrutiny incoming

THE DEAL:
$4,500,000 USD in Monero or Bitcoin
- Decryption tool for all systems
- Complete deletion of stolen data
- No publication, no DDoS, no regulator contact
- Security report on how we accessed you

TIMER: 5 days before publication
PRICE DOUBLES after 3 days

Negotiate: http://alphvmmm[...]onion/[unique_id]

We are businesspeople. Pay quickly, this goes away.
Delay, and we make your life very difficult.

==============================================================`,
          expectedActions: [
            'Document ransom demands',
            'Assess data theft claims',
            'Prepare for potential DDoS',
            'Brief leadership on triple extortion'
          ],
          facilitatorNotes: 'Triple extortion adds multiple pressure vectors. Discuss how each threat (encryption, leak, DDoS) requires different responses.'
        },
        {
          id: 'bc-inj-003',
          title: 'OT Network Assessment',
          type: 'technical',
          severity: 'critical',
          triggerTime: 12,
          source: 'OT Security Team',
          content: `OT NETWORK ASSESSMENT
Priority: EMERGENCY

Physical assessment of OT environment complete:

Control Systems Status:

Pipeline SCADA:
- Primary: OPERATIONAL (no encryption detected)
- Backup: OPERATIONAL
- HMI displays: Normal
- RTU communications: Normal
- Assessment: NO DIRECT IMPACT

Natural Gas Distribution:
- Compressor station controls: OPERATIONAL
- Pressure monitoring: NORMAL
- Safety systems: ACTIVE
- Assessment: NO DIRECT IMPACT

LNG Storage Facility:
- Level monitoring: OPERATIONAL
- Safety interlocks: ACTIVE
- Assessment: NO DIRECT IMPACT

HOWEVER - CRITICAL CONCERNS:

1. Historian Server (ENCRYPTED)
   - Cannot pull historical data
   - Regulatory compliance impact (PHMSA records)
   - Trend analysis unavailable

2. Engineering Documentation (STOLEN)
   - SCADA network diagrams confirmed exfiltrated
   - Control system configurations exposed
   - Could enable future targeted attack

3. IT/OT Boundary Compromised
   - Engineering workstations encrypted
   - Unknown if credentials for OT systems captured
   - Recommend emergency password rotation on OT

4. Patch Management Server (ENCRYPTED)
   - WSUS server for OT-adjacent systems encrypted
   - Cannot deploy security updates
   - Increases vulnerability window

Recommendation:
Implement emergency isolation between IT and OT.
Rotate all OT credentials immediately.
Operations can continue but under degraded conditions.

SAFETY STATUS: OPERATIONS SAFE TO CONTINUE
SECURITY STATUS: COMPROMISED - ELEVATED RISK`,
          expectedActions: [
            'Implement emergency IT/OT isolation',
            'Execute OT credential rotation',
            'Brief operations on degraded conditions',
            'Assess regulatory reporting requirements'
          ],
          facilitatorNotes: 'Good news: OT isn\'t directly impacted. Bad news: The documentation stolen enables future attacks. Discuss long-term implications.'
        },
        {
          id: 'bc-inj-004',
          title: 'TSA Pipeline Security Call',
          type: 'communication',
          severity: 'high',
          triggerTime: 22,
          source: 'TSA Pipeline Security Division',
          content: `INCOMING CALL
From: TSA Pipeline Security Division

"Good morning, this is [Name] from TSA's Pipeline Security Division. We received an automated alert from CISA about potential ransomware activity affecting your organization.

As you know, under the TSA Security Directives issued following the Colonial Pipeline incident, you have specific cybersecurity reporting requirements.

I need to understand:

1. Has there been a cybersecurity incident affecting your pipeline operations?

2. Have any operational technology systems been impacted?

3. Are there any current or potential impacts to pipeline operations or safety?

4. Have you implemented your Cybersecurity Incident Response Plan?

Under SD Pipeline-2021-02, you're required to report cybersecurity incidents to CISA within 12 hours if they have potential impact on OT systems or pipeline operations.

I also need to inform you that if we determine there's an imminent threat to pipeline safety, we have authority to require specific protective measures up to and including operational restrictions.

Please provide an initial assessment and we'll schedule a follow-up call in 4 hours."`,
          expectedActions: [
            'Provide accurate initial assessment',
            'Confirm CISA notification timeline',
            'Review TSA Security Directive requirements',
            'Prepare detailed briefing for follow-up'
          ],
          facilitatorNotes: 'TSA involvement after Colonial Pipeline adds regulatory pressure. Discuss how post-Colonial directives changed the landscape.'
        },
        {
          id: 'bc-inj-005',
          title: 'DDoS Attack Begins',
          type: 'technical',
          severity: 'high',
          triggerTime: 32,
          source: 'Network Operations',
          content: `NETWORK ALERT - DDoS ATTACK IN PROGRESS
Alert Time: +6 hours from initial detection

Attack Characteristics:
- Target: Customer payment portal
- Attack type: HTTP flood + DNS amplification
- Volume: ~50 Gbps sustained
- Source: Botnet (multiple countries)

Impact:
- Customer payment portal: OFFLINE
- Public website: DEGRADED (intermittent access)
- Customer mobile app: OFFLINE
- Phone system: Unaffected

Customer Impact:
- Cannot pay bills online
- Cannot view usage data
- Cannot report service issues online
- Phone lines experiencing high volume

Mitigation Status:
- ISP contacted, upstream filtering requested
- CDN protection activated
- Attack partially mitigated but ongoing

Attacker Communication:
New message on negotiation portal:
"This is a demonstration. We can do this whenever we want, for as long as we want. Payment portal, email, whatever we choose. Negotiate or this continues."

Duration Warning:
If attack continues 24+ hours:
- Payment processing delays
- Customer complaints to PUC
- Media attention likely

This appears coordinated with ransom deadline pressure.`,
          expectedActions: [
            'Escalate DDoS mitigation efforts',
            'Prepare customer communication',
            'Assess PUC reporting requirements',
            'Consider DDoS impact on ransom decision'
          ],
          facilitatorNotes: 'The DDoS demonstrates capability and adds pressure. Discuss how this affects the negotiation calculus.'
        }
      ],
      discussionQuestions: [
        {
          id: 'bc-q-001',
          question: 'When ransomware hits a utility with IT/OT convergence, how do you balance thorough investigation against the need to quickly verify OT system integrity?',
          category: 'technical',
          suggestedTime: 10,
          keyPoints: [
            'Physical verification importance',
            'Assuming worst case vs. confirming actual state',
            'OT systems may hide compromise differently',
            'Safety system verification priority',
            'Documentation vs. speed trade-offs'
          ]
        },
        {
          id: 'bc-q-002',
          question: 'How does triple extortion (encryption + data leak + DDoS) change your response strategy compared to traditional ransomware?',
          category: 'decision',
          suggestedTime: 8,
          keyPoints: [
            'Multiple simultaneous pressure points',
            'Resource allocation across threats',
            'Each threat requires different response',
            'Escalation sequences',
            'Leverage in negotiation'
          ]
        },
        {
          id: 'bc-q-003',
          question: 'With TSA Security Directives requiring 12-hour reporting, how do you balance regulatory notification against investigation needs?',
          category: 'policy',
          suggestedTime: 8,
          keyPoints: [
            'Mandatory reporting timelines',
            'Information accuracy vs. speed',
            'Regulatory relationship management',
            'Post-Colonial Pipeline environment',
            'Operational restriction risks'
          ]
        }
      ]
    },
    {
      id: 'blackcat-assessment',
      title: 'Assessment: Scope and Regulatory Implications',
      phase: 'analysis',
      duration: 40,
      objectives: [
        'Determine full scope of compromise and data theft',
        'Assess regulatory notification requirements',
        'Evaluate operational risks and safety implications',
        'Develop response options for executive decision'
      ],
      injects: [
        {
          id: 'bc-inj-006',
          title: 'Data Exfiltration Analysis',
          type: 'technical',
          severity: 'critical',
          triggerTime: 0,
          source: 'Incident Response Team',
          content: `DATA EXFILTRATION ANALYSIS
Forensic Assessment - Day 2

Confirmed Data Exfiltration: 782GB
Exfiltration Period: 8 days prior to encryption
Method: Rclone to attacker-controlled cloud storage

Data Categories Identified:

1. Customer Information (290GB)
   - 250,000 customer records
   - Names, addresses, phone numbers
   - Account numbers and service addresses
   - Payment history and bank account info (ACH customers)
   - SSNs for customers with deposits on file (~15,000)
   - Energy usage patterns

2. SCADA/OT Documentation (145GB)
   - Pipeline network diagrams
   - SCADA system architecture
   - Control system configurations
   - IP addressing for OT network
   - Safety system documentation
   - Vendor remote access procedures

3. Employee Information (67GB)
   - 1,200 employee records
   - SSNs, addresses, benefits info
   - Performance reviews
   - Security clearance information
   - Credentials file (encrypted, but concerning)

4. Business/Financial (180GB)
   - Financial statements (5 years)
   - Rate case filings
   - Strategic plans
   - M&A discussions
   - Insurance policies

5. Security Documentation (100GB)
   - Incident response plans
   - Vulnerability assessments
   - Penetration test reports
   - Security policies
   - Access control documentation

Regulatory Implications:
- Customer PII: State breach notification laws triggered
- SCADA docs: TSA security implications
- Employee data: Additional notification required
- Critical infrastructure info: National security concerns

The SCADA documentation theft is particularly concerning.
This information could enable a more sophisticated future attack.`,
          expectedActions: [
            'Brief leadership on data scope',
            'Assess notification requirements by category',
            'Evaluate SCADA documentation exposure',
            'Consider national security reporting'
          ],
          facilitatorNotes: 'The SCADA documentation theft has implications beyond this incident. Discuss how stolen infrastructure documentation enables future attacks.'
        },
        {
          id: 'bc-inj-007',
          title: 'CISA Critical Infrastructure Contact',
          type: 'communication',
          severity: 'high',
          triggerTime: 10,
          source: 'CISA',
          content: `INCOMING CALL
From: CISA Region [X] - Critical Infrastructure Coordinator

"This is [Name] from CISA's Critical Infrastructure Division. We've been coordinating with TSA on your situation and wanted to reach out directly.

We're particularly concerned about the SCADA documentation theft you've reported. This isn't just about your current incident - this information could be used for future attacks against your infrastructure or potentially shared with other threat actors.

CISA can provide:
1. Technical assistance team deployment
2. Malware analysis and threat intelligence
3. Coordination with FBI for investigation
4. Sector-specific guidance and support
5. Coordination with other affected critical infrastructure

We're also seeing BlackCat/ALPHV targeting multiple utilities currently. You're not the only one, and intelligence sharing could help the sector.

I have some concerns I want to raise:
- Has the threat actor indicated any intention regarding the SCADA documentation?
- Have you verified they don't have persistent access to OT networks?
- What's your assessment of their capability to use this information?

We may need to coordinate with DHS and potentially DOE given the critical infrastructure implications. This might escalate to a national security conversation depending on what we learn.

Can we schedule a secure call with your technical team?"`,
          expectedActions: [
            'Schedule CISA technical call',
            'Assess threat actor capabilities',
            'Consider sector-wide implications',
            'Prepare for potential escalation'
          ],
          facilitatorNotes: 'CISA involvement elevates this beyond a typical ransomware incident. Discuss the national security dimensions of critical infrastructure attacks.'
        },
        {
          id: 'bc-inj-008',
          title: 'Public Utility Commission Inquiry',
          type: 'communication',
          severity: 'high',
          triggerTime: 18,
          source: 'State Public Utility Commission',
          content: `OFFICIAL CORRESPONDENCE
[State] Public Utility Commission

Subject: Cybersecurity Incident - Information Request

Dear [CEO]:

The Commission has become aware of a cybersecurity incident affecting your utility through media reports and federal agency coordination.

As your state regulator, we require information regarding:

1. Incident Overview
   - Nature and scope of the incident
   - Systems and data affected
   - Current operational status
   - Impact on customer service

2. Customer Impact
   - Number of customers with data potentially exposed
   - Status of bill payment and customer service systems
   - Plan for customer notification and support

3. Service Reliability
   - Any impact to gas distribution operations
   - Safety system status
   - Service disruption risk assessment

4. Regulatory Compliance
   - Status of compliance with security requirements
   - Prior cybersecurity assessments and findings
   - Remediation plans

We are scheduling an emergency meeting with Commission staff and request executive participation.

Additionally, we're receiving customer complaints about inability to pay bills online. If this continues beyond 48 hours, we may need to address penalty and late fee implications.

The Commission takes cybersecurity seriously and will be evaluating whether additional regulatory requirements are needed.

Please respond within 24 hours.`,
          expectedActions: [
            'Prepare PUC response',
            'Address customer service impact',
            'Consider late fee policy during outage',
            'Prepare for regulatory scrutiny'
          ],
          facilitatorNotes: 'PUC involvement adds state regulatory pressure. Discuss how utilities navigate dual federal/state regulatory oversight during incidents.'
        },
        {
          id: 'bc-inj-009',
          title: 'Negotiator Recommendation',
          type: 'document',
          severity: 'high',
          triggerTime: 28,
          source: 'Ransomware Negotiator (via Insurance)',
          content: `RANSOMWARE NEGOTIATION ASSESSMENT
Prepared by: [Negotiation Firm]
Engagement: Insurance panel vendor

Initial Assessment:

Threat Actor Profile: BlackCat/ALPHV
- Tier 1 ransomware-as-a-service operation
- History of data publication when not paid
- Known to follow through on DDoS threats
- Generally honors agreements when paid
- Experienced negotiators

Demand Analysis:
- Initial demand: $4,500,000
- Based on our experience, negotiable to: $1.8M - $2.5M range
- Timeline: Firm on publication deadline

Negotiation Strategy Options:

Option A: Full Engagement
- Negotiate payment in $1.8-2.5M range
- Request proof of data deletion capability
- Obtain decryption verification before payment
- Timeline: 48-72 hours to resolution
- Success probability: 85%

Option B: Time-Buying Engagement
- Engage but delay substantive negotiation
- Buy time for recovery efforts
- Risk: Attacker may escalate (DDoS, publication)
- May still result in payment at higher amount
- Success probability: 60%

Option C: No Engagement
- Do not communicate with attackers
- Accept data publication
- Recovery from backups
- Manage DDoS via technical controls
- Cost: Extended outage + reputation damage

Our Recommendation:
Given critical infrastructure status and regulatory scrutiny, we recommend Option A with aggressive negotiation. The SCADA documentation exposure creates ongoing risk even after recovery - payment may secure deletion.

However, we must be clear:
- No guarantee of data deletion
- Attackers may have already copied/shared data
- Payment does not eliminate future risk

SANCTION SCREENING: BlackCat/ALPHV is NOT currently OFAC-sanctioned. Payment is legal (though discouraged by government).

Insurance Coverage: Up to $3M for ransom, requires pre-approval.`,
          expectedActions: [
            'Review negotiation options',
            'Brief executive team on recommendations',
            'Make engagement decision',
            'Prepare for chosen approach'
          ],
          facilitatorNotes: 'Professional negotiator perspective adds nuance. Discuss the role of negotiators and how their involvement affects outcomes.',
          decisionPoint: {
            question: 'How will you approach attacker negotiation?',
            options: [
              {
                id: 'full-engage',
                label: 'Full Engagement',
                description: 'Negotiate seriously toward payment in the $1.8-2.5M range',
                consequence: 'Fastest resolution but funds criminal enterprise'
              },
              {
                id: 'time-buying',
                label: 'Time-Buying Engagement',
                description: 'Engage to delay while pursuing recovery, may still pay',
                consequence: 'Buys time but risks escalation and higher eventual payment'
              },
              {
                id: 'no-engage',
                label: 'No Engagement',
                description: 'Do not communicate with attackers, focus on recovery',
                consequence: 'Principled stance but accepts data publication and extended impact'
              }
            ]
          }
        }
      ],
      discussionQuestions: [
        {
          id: 'bc-q-004',
          question: 'Stolen SCADA documentation enables future attacks. How does this long-term risk factor into your immediate response decisions?',
          category: 'decision',
          suggestedTime: 10,
          keyPoints: [
            'Documentation can\'t be "un-stolen"',
            'Payment may secure deletion but no guarantee',
            'Assume documentation will be used/shared',
            'Long-term security architecture implications',
            'Notification to other utilities?'
          ]
        },
        {
          id: 'bc-q-005',
          question: 'With multiple regulators involved (TSA, PUC, potentially FERC/NERC), how do you manage potentially conflicting demands and timelines?',
          category: 'coordination',
          suggestedTime: 8,
          keyPoints: [
            'Federal vs. state jurisdiction',
            'Different reporting requirements',
            'Consistent messaging importance',
            'Regulatory relationship management',
            'Single point of coordination'
          ]
        },
        {
          id: 'bc-q-006',
          question: 'The negotiator recommends full engagement toward payment. How do you weigh this professional advice against organizational values and government guidance?',
          category: 'decision',
          suggestedTime: 8,
          keyPoints: [
            'Expert advice vs. organizational values',
            'Insurance company interests',
            'Government discouragement vs. business reality',
            'Critical infrastructure considerations',
            'Stakeholder input on decision'
          ]
        }
      ]
    },
    {
      id: 'blackcat-containment',
      title: 'Containment: Protecting Critical Operations',
      phase: 'containment',
      duration: 35,
      objectives: [
        'Implement containment without disrupting critical services',
        'Secure OT environment against further compromise',
        'Manage ongoing DDoS attack',
        'Execute communication strategy'
      ],
      injects: [
        {
          id: 'bc-inj-010',
          title: 'OT Security Enhancement Plan',
          type: 'document',
          severity: 'high',
          triggerTime: 0,
          source: 'OT Security Team',
          content: `OT SECURITY ENHANCEMENT PLAN
Emergency Implementation - 72 Hour Window

Current Status:
- OT systems operational and unencrypted
- IT/OT isolation implemented (emergency firewall rules)
- Credentials rotated on critical systems
- Enhanced monitoring deployed

Immediate Actions (0-24 hours):

1. Network Isolation Enhancement
   - Physically disconnect non-essential IT/OT links
   - Implement jump server for any required access
   - Deploy network monitoring on all OT interfaces
   - Estimated impact: Minimal to operations

2. Credential Security
   - Rotate all OT system passwords
   - Disable shared/service accounts where possible
   - Implement temporary MFA for remote OT access
   - Vendor remote access: Suspended until reviewed

3. System Integrity Verification
   - Baseline comparison for PLC programs
   - Verify safety system configurations
   - Check for unauthorized scheduled tasks
   - Firmware verification where possible

Short-term Actions (24-72 hours):

4. Monitoring Enhancement
   - Deploy ICS-specific network monitoring
   - Enable enhanced logging on all HMIs
   - Implement file integrity monitoring
   - Anomaly detection baseline

5. Backup Verification
   - Verify OT configuration backups
   - Test restoration procedures
   - Secure offline copies of critical configs

Concerns:
- Some measures may impact operational flexibility
- Vendor support may be delayed without remote access
- Staff fatigue already an issue

Request: Executive authorization for operational constraints during hardening period.`,
          expectedActions: [
            'Authorize OT hardening measures',
            'Communicate operational constraints',
            'Coordinate vendor access procedures',
            'Monitor for operational impact'
          ],
          facilitatorNotes: 'OT hardening creates operational constraints. Discuss how to balance security enhancement against operational flexibility.'
        },
        {
          id: 'bc-inj-011',
          title: 'Media Inquiry - Ransomware Story',
          type: 'communication',
          severity: 'high',
          triggerTime: 10,
          source: 'Local News Outlet',
          content: `MEDIA INQUIRY
From: [Local TV Station] Investigative Reporter

Email to Communications Department:

"I'm working on a story about ransomware attacks on utilities. I've received information that [Utility Name] is currently dealing with a significant cybersecurity incident.

My sources indicate:
- Your customer payment portal has been down for 24+ hours
- There may be a ransomware attack involved
- Customer data may have been stolen

I've also seen your company listed on what appears to be a ransomware group's website.

I'm planning to run a story tomorrow evening. Before I do, I wanted to give you the opportunity to comment.

Specifically:
1. Can you confirm a cybersecurity incident occurred?
2. Have customer data been compromised?
3. Are your gas operations affected?
4. Are you paying a ransom?

I've also reached out to the Public Utility Commission and TSA for comment.

Please respond by 3 PM today if you want to be included in the story.

[Reporter Name]
Investigative Unit"`,
          expectedActions: [
            'Coordinate media response with legal',
            'Prepare holding statement',
            'Align response with regulatory communications',
            'Consider proactive disclosure'
          ],
          facilitatorNotes: 'Media pressure often accelerates disclosure timeline. Discuss how to manage media during an active incident.',
          decisionPoint: {
            question: 'How will you respond to the media inquiry?',
            options: [
              {
                id: 'proactive-statement',
                label: 'Proactive Statement',
                description: 'Issue comprehensive public statement confirming incident and response',
                consequence: 'Controls narrative but confirms details before you may want to'
              },
              {
                id: 'minimal-confirm',
                label: 'Minimal Confirmation',
                description: 'Confirm cybersecurity incident only, limited details',
                consequence: 'Acknowledges situation without providing ammunition'
              },
              {
                id: 'no-comment',
                label: 'No Comment',
                description: 'Decline to comment, let story run without input',
                consequence: 'Avoids direct statement but loses control of narrative'
              }
            ]
          }
        },
        {
          id: 'bc-inj-012',
          title: 'Customer Escalation Crisis',
          type: 'communication',
          severity: 'high',
          triggerTime: 20,
          source: 'Customer Service',
          content: `CUSTOMER SERVICE ESCALATION REPORT
Status: CRITICAL - ESCALATING

Payment Portal Outage Impact (48 hours):

Customer Contacts:
- Phone calls: 4,200 (300% of normal)
- Social media complaints: 380+
- PUC complaints filed: 47
- Local news tips submitted: Unknown

Key Customer Concerns:

1. Bill Payment
   "My payment is due tomorrow. If I can't pay online, will I be charged a late fee?"
   "I tried to pay for 3 hours. This is unacceptable."
   "Is my bank account information safe?"

2. Service Concerns
   "Is my gas service going to be affected?"
   "I heard on the news there was a cyberattack. Is it safe?"
   "Should I be worried about an explosion?" (from 3 customers)

3. Data Privacy
   "Was my personal information stolen?"
   "I want to know exactly what data was taken."
   "Are you going to provide free credit monitoring?"

Staff Status:
- Customer service staff overwhelmed
- Hold times exceeding 45 minutes
- Staff receiving hostile calls
- Morale declining

Regulatory Attention:
PUC Consumer Affairs Division has contacted us regarding complaint volume and requests immediate briefing.

Social Media:
#[UtilityName]Hack trending locally
Local elected official posted criticism
Customer advocacy group demanding answers

Recommended Actions:
1. Executive customer communication (email/letter)
2. Late fee suspension announcement
3. Data breach FAQ publication
4. Additional call center staffing
5. Social media response team activation`,
          expectedActions: [
            'Approve customer communication plan',
            'Suspend late fees during outage',
            'Staff up customer service',
            'Prepare data breach FAQ'
          ],
          facilitatorNotes: 'Customer pressure adds business urgency. Discuss how customer service crisis affects decision-making during incident.'
        },
        {
          id: 'bc-inj-013',
          title: 'FBI Cyber Division Coordination',
          type: 'communication',
          severity: 'medium',
          triggerTime: 28,
          source: 'FBI Cyber Division',
          content: `FBI COORDINATION UPDATE
From: FBI Cyber Division - Ransomware Task Force

"Thank you for your continued cooperation. I wanted to update you on a few developments:

1. Investigation Status
We've been able to trace some of the attacker infrastructure. This BlackCat affiliate appears to be operating from Eastern Europe. We're coordinating with international partners.

2. Payment Guidance
I understand you're considering payment. I want to reiterate our position:
- We advise against paying ransoms
- However, we understand business decisions must be made
- If you do pay, please inform us - it aids our investigation
- We have recovered ransom payments in some cases

3. Intelligence Sharing
Based on our investigation of this affiliate:
- They generally provide working decryptors when paid
- They have published data when not paid in past cases
- DDoS threats are real and they do follow through
- They have targeted other utilities recently

4. Ongoing Threat
Even if you pay, this affiliate has targeted victims again. We recommend assuming they will maintain access attempts.

5. Potential Prosecution
We are building a case against this affiliate group. Evidence from your incident may be valuable for prosecution. However, any prosecution is years away.

We're here to support whatever decision you make. Is there anything specific we can help with?"`,
          expectedActions: [
            'Document FBI guidance',
            'Consider payment decision implications',
            'Plan for post-incident targeting',
            'Discuss evidence preservation'
          ],
          facilitatorNotes: 'FBI takes consultative approach on payment while maintaining law enforcement perspective. Discuss how their input affects decision.'
        }
      ],
      discussionQuestions: [
        {
          id: 'bc-q-007',
          question: 'OT hardening measures may impact operational flexibility. How do you balance security improvements against operational needs during an active incident?',
          category: 'technical',
          suggestedTime: 8,
          keyPoints: [
            'Operational constraints acceptance',
            'Vendor access management',
            'Staff workload considerations',
            'Temporary vs. permanent measures',
            'Risk-based prioritization'
          ]
        },
        {
          id: 'bc-q-008',
          question: 'With media preparing to run a story, how do you decide between proactive disclosure versus minimal comment?',
          category: 'coordination',
          suggestedTime: 8,
          keyPoints: [
            'Controlling the narrative',
            'Regulatory notification timing',
            'Customer communication first?',
            'Legal exposure considerations',
            'Stakeholder preparation'
          ]
        },
        {
          id: 'bc-q-009',
          question: 'Customer complaints are overwhelming staff and reaching regulators. How does this pressure affect your incident response and payment decisions?',
          category: 'decision',
          suggestedTime: 8,
          keyPoints: [
            'Customer relationship value',
            'Regulatory relationship risk',
            'Staff wellbeing',
            'Speed vs. thoroughness',
            'Business continuity priorities'
          ]
        }
      ]
    },
    {
      id: 'blackcat-recovery',
      title: 'Recovery: Restoration and Long-Term Security',
      phase: 'recovery',
      duration: 35,
      objectives: [
        'Execute recovery plan and restore services',
        'Address regulatory findings and requirements',
        'Implement long-term security improvements',
        'Manage ongoing data breach implications'
      ],
      injects: [
        {
          id: 'bc-inj-014',
          title: 'Recovery Status - Day 5',
          type: 'document',
          severity: 'medium',
          triggerTime: 0,
          source: 'Incident Commander',
          content: `RECOVERY STATUS UPDATE
Day 5 of Incident Response

[Status dependent on ransom decision]

If Ransom Paid:
- Decryption tool received, validated
- 94% systems successfully decrypted
- Customer portal: RESTORED
- Corporate email: RESTORED
- Payment systems: RESTORED (reconciliation ongoing)
- Total payment: $2.1M (negotiated)

If No Payment:
- Backup restoration: 85% complete
- Customer portal: RESTORED (rebuilt)
- Corporate email: RESTORED (some data loss)
- Payment systems: Restored, 5 days transactions manual entry
- Legacy systems: Still rebuilding

OT Environment Status:
- Operations: NORMAL throughout
- Enhanced monitoring: ACTIVE
- Hardening measures: IMPLEMENTED
- No OT systems required decryption

Data Breach Status:
- Attacker has not published full data dump (yet)
- [If paid]: Received "proof of deletion" video
- [If not paid]: Publication expected within 48 hours
- Customer notification: IN PROGRESS

Regulatory Status:
- TSA: Daily briefings ongoing, no restrictions imposed
- PUC: Monitoring, requesting detailed incident report
- State AG: Breach notification filed, investigation pending
- CISA: Technical assistance completed

DDoS Status:
- Attacks ceased [after payment / on their own]
- CDN protection remains active
- Prepared for potential resumption

Financial Summary:
- [If paid] Ransom + response: ~$5.2M
- [If not paid] Response + recovery: ~$4.8M
- Both scenarios: Long-term remediation ~$8M additional

Outstanding concerns:
- SCADA documentation remains exposed
- Long-term security posture improvement needed
- Regulatory scrutiny ongoing`,
          expectedActions: [
            'Continue recovery operations',
            'Finalize customer notification',
            'Prepare regulatory reports',
            'Plan long-term security investment'
          ],
          facilitatorNotes: 'Recovery is progressing but long-term issues remain. Discuss the tail end of incident response and transition to improvement.'
        },
        {
          id: 'bc-inj-015',
          title: 'TSA Compliance Assessment',
          type: 'document',
          severity: 'high',
          triggerTime: 12,
          source: 'TSA Pipeline Security Division',
          content: `TSA PIPELINE SECURITY ASSESSMENT
Preliminary Findings - Post-Incident Review

Subject: [Utility Name] Cybersecurity Incident Assessment

Assessment Period: [Incident dates]
Conducted by: TSA Pipeline Security Division

Security Directive Compliance:

SD Pipeline-2021-01 (Owner/Operators):
- Cybersecurity Coordinator designated: COMPLIANT
- Incident reporting: COMPLIANT (reported within 12 hours)
- Cybersecurity assessment: Previous assessment identified gaps

SD Pipeline-2021-02 (Additional Requirements):
- Network segmentation: PARTIALLY COMPLIANT
  - IT/OT segmentation existed but engineering workstations bridged
- Access control: DEFICIENT
  - VPN compromise enabled initial access
  - Service account controls inadequate
- Monitoring: PARTIALLY COMPLIANT
  - OT-specific monitoring was limited
- Patch management: DEFICIENT
  - Critical vulnerabilities existed in VPN appliances

Findings:

1. Initial access via unpatched VPN (known vulnerability)
2. Insufficient IT/OT segmentation allowed lateral movement
3. Privileged access controls inadequate
4. OT-specific monitoring capabilities limited
5. Incident response plan existed but gaps in execution

Required Actions:

Within 30 days:
- Remediate identified technical vulnerabilities
- Implement enhanced network segmentation
- Deploy additional OT monitoring capabilities

Within 90 days:
- Complete third-party security assessment
- Update incident response plan
- Conduct tabletop exercise

Ongoing:
- Monthly compliance reporting for 12 months
- Quarterly TSA security reviews

Note: Failure to address findings may result in additional requirements or potential enforcement action.

This assessment does not preclude additional regulatory action by other agencies.`,
          expectedActions: [
            'Review TSA findings with leadership',
            'Develop 30/90 day remediation plan',
            'Budget for required improvements',
            'Establish compliance tracking'
          ],
          facilitatorNotes: 'TSA findings create mandated improvements. Discuss how regulatory requirements can drive security investment.'
        },
        {
          id: 'bc-inj-016',
          title: 'Board Security Investment Proposal',
          type: 'document',
          severity: 'medium',
          triggerTime: 22,
          source: 'CISO',
          content: `BOARD PRESENTATION
Security Investment Proposal - Post Incident

Executive Summary:
Following the BlackCat ransomware incident, this proposal outlines necessary security investments to address identified gaps, meet regulatory requirements, and protect against future attacks.

Incident Cost Summary:
- Direct costs: $5-6M (response + recovery/ransom)
- Regulatory remediation: $2M (mandated)
- Customer impact mitigation: $1.5M
- Reputational: Unquantified
- Total incident cost: ~$9M+

Root Cause Analysis Summary:
- Unpatched VPN appliance (initial access)
- Inadequate network segmentation
- Weak privileged access controls
- Limited OT-specific monitoring
- Insufficient security staffing

Proposed Investments:

MANDATORY (Regulatory Requirements):
1. Network segmentation enhancement: $1.2M
2. OT monitoring platform: $800K + $200K/year
3. Third-party assessments: $500K
4. Incident response improvements: $300K
Total Mandatory: $2.8M capital + $200K annual

STRONGLY RECOMMENDED:
5. 24/7 SOC capability (MSSP): $600K/year
6. Identity/PAM solution: $400K + $150K/year
7. Email security upgrade: $200K
8. Backup enhancement: $500K
9. Security staff additions (2 FTE): $350K/year
Total Recommended: $1.1M capital + $1.1M annual

STRATEGIC (12-24 months):
10. Zero trust architecture: $2M over 2 years
11. OT security program build-out: $1.5M over 2 years
12. Security operations center: $3M over 3 years
Total Strategic: $6.5M over 3 years

Summary:
- Year 1 capital: $3.9M mandatory + recommended
- Year 1 operating increase: $1.3M
- 3-year total: ~$12M

Comparison:
- This incident cost: ~$9M
- Average ransomware cost for utilities: $12M
- Next incident cost (if unprepared): Potentially higher

Recommendation:
Approve mandatory and recommended investments immediately.
Strategic investments phased over 3 years.

The cost of prevention is less than the cost of another incident.`,
          expectedActions: [
            'Present to board for approval',
            'Prioritize mandatory investments',
            'Develop implementation roadmap',
            'Establish progress metrics'
          ],
          facilitatorNotes: 'Security investment decisions are critical for post-incident improvement. Discuss how to sustain commitment beyond crisis.'
        },
        {
          id: 'bc-inj-017',
          title: 'Lessons Learned Summary',
          type: 'document',
          severity: 'medium',
          triggerTime: 30,
          source: 'Incident Response Team',
          content: `LESSONS LEARNED REPORT
Post-Incident Assessment

What Went Well:
1. OT environment remained operational throughout
2. Emergency IT/OT isolation executed quickly
3. Regulatory notifications met timelines
4. Customer communication transparent
5. Federal coordination (CISA, FBI) valuable
6. Insurance coverage helped manage costs

What Needs Improvement:
1. Initial access prevention (VPN vulnerability)
2. Detection time (8 days dwell time)
3. IT/OT segmentation (engineering workstations)
4. Privileged access management
5. OT-specific monitoring capabilities
6. Backup testing and isolation
7. Staff fatigue management during extended incident

Root Causes Identified:
1. Technical: Unpatched vulnerability exploited
2. Process: Vulnerability management gaps
3. People: Security understaffing
4. Investment: Deferred security spending

Key Recommendations:

Immediate:
- Implement mandated TSA improvements
- Enhance vulnerability management
- Deploy PAM solution

Short-term:
- Build 24/7 monitoring capability
- Improve IT/OT segmentation
- Enhance backup strategy

Long-term:
- Zero trust architecture
- OT security program
- Security culture development

Cultural Changes Needed:
- Security as business enabler, not obstacle
- Proactive investment vs. reactive spending
- Board-level security governance
- Regular testing and exercises

Final Thoughts:
This incident could have been worse. OT systems were spared direct impact due to existing segmentation. However, the stolen SCADA documentation represents ongoing risk. We must assume adversaries now have detailed knowledge of our infrastructure.

The question isn't whether we'll be targeted again - it's whether we'll be better prepared.`,
          expectedActions: [
            'Present lessons learned to leadership',
            'Develop improvement roadmap',
            'Establish accountability for changes',
            'Schedule follow-up review'
          ],
          facilitatorNotes: 'Lessons learned capture is essential. Discuss how to ensure these lessons translate into sustained action.'
        }
      ],
      discussionQuestions: [
        {
          id: 'bc-q-010',
          question: 'TSA findings create mandated improvements with deadlines. How does regulatory pressure help or hinder appropriate security investment?',
          category: 'policy',
          suggestedTime: 8,
          keyPoints: [
            'Regulatory drivers for investment',
            'Compliance vs. security',
            'Resource constraints',
            'Reporting burden',
            'Prescriptive vs. risk-based requirements'
          ]
        },
        {
          id: 'bc-q-011',
          question: 'The proposed security investment is ~$12M over 3 years. How do you build the business case and sustain commitment beyond the immediate crisis?',
          category: 'lessons_learned',
          suggestedTime: 8,
          keyPoints: [
            'Business case development',
            'Board engagement',
            'Incident amnesia prevention',
            'Metrics and progress tracking',
            'Cultural change requirements'
          ]
        },
        {
          id: 'bc-q-012',
          question: 'What are your key takeaways from this exercise? What changes will you advocate for in your organization?',
          category: 'lessons_learned',
          suggestedTime: 8,
          keyPoints: [
            'Personal action items',
            'Organizational changes needed',
            'Investment priorities',
            'Preparation activities',
            'Relationship building'
          ]
        }
      ]
    }
  ],
  scenarioConfig: {
    timeDisplay: 'elapsed',
    defaultPhaseDuration: 38,
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

export const blackcatEnergyScenario: LibraryEntry = {
  id: scenario.id,
  title: scenario.title,
  category: 'Ransomware',
  difficulty: scenario.difficulty,
  duration: scenario.estimatedDuration,
  description: scenario.description,
  tags: ['BlackCat', 'ALPHV', 'Energy', 'Critical Infrastructure', 'Triple Extortion', 'OT Security', 'NERC CIP', 'TSA'],
  moduleCount,
  injectCount,
  questionCount,
  scenario
}
