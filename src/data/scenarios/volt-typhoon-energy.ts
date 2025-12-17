import type { Scenario, LibraryEntry } from '../../types/scenario.types'

const scenario: Scenario = {
  id: 'volt-typhoon-energy',
  title: 'Silent Grid: Volt Typhoon Critical Infrastructure Compromise',
  subtitle: 'PRC State-Sponsored Pre-Positioning Attack on Regional Energy Utility',
  description: `Your organization operates a regional electric utility serving 250,000 customers across three states. Routine threat hunting reveals indicators consistent with Volt Typhoon, a PRC state-sponsored actor known for pre-positioning in critical infrastructure for potential future disruption during geopolitical crises.

This scenario explores the unique challenges of responding to nation-state actors whose goal is not immediate disruption but long-term persistent access. The threat actor has been residing in your network for an estimated 18 months using living-off-the-land techniques that blend with normal administrative activity.

Based on real-world Volt Typhoon campaigns identified by CISA, FBI, and NSA in joint advisories (2023-2024), this exercise tests your organization's ability to hunt for, contain, and eradicate a sophisticated adversary while maintaining grid reliability and coordinating with federal partners.`,
  threatCategory: 'Nation-State APT',
  difficulty: 'advanced',
  estimatedDuration: 150,
  targetAudience: [
    'Security Operations Teams',
    'OT/ICS Security Personnel',
    'Executive Leadership',
    'Grid Operations',
    'Federal Coordination Teams'
  ],
  objectives: [
    'Detect living-off-the-land (LOTL) techniques that evade traditional detection',
    'Conduct comprehensive threat hunting across IT and OT environments',
    'Make containment decisions balancing security with grid reliability',
    'Coordinate response with CISA, FBI, and sector-specific agencies',
    'Develop long-term hardening strategy against persistent nation-state threats',
    'Navigate IT/OT convergence security challenges'
  ],
  modules: [
    {
      id: 'volt-detection',
      title: 'Detection: Living-Off-The-Land Discovery',
      phase: 'detection',
      duration: 40,
      objectives: [
        'Recognize LOTL technique indicators in routine system activity',
        'Differentiate between legitimate admin activity and adversary tradecraft',
        'Understand Volt Typhoon TTPs and behavioral patterns',
        'Initiate appropriate threat hunting protocols'
      ],
      injects: [
        {
          id: 'volt-inj-001',
          title: 'Threat Intelligence Brief: Volt Typhoon Advisory',
          type: 'document',
          severity: 'high',
          triggerTime: 0,
          source: 'Threat Intelligence Team',
          content: `CLASSIFIED BRIEF - TLP:AMBER
Joint CISA/FBI/NSA Advisory Update

Subject: Volt Typhoon Targeting of US Critical Infrastructure

Key Updates:
- PRC-sponsored actor actively targeting energy, water, communications sectors
- Primary objective: Pre-positioning for potential future disruption
- Dwell times observed: 12-24+ months before discovery
- Living-off-the-land techniques make detection extremely challenging

Known TTPs:
- Initial Access: Exploitation of internet-facing appliances (Fortinet, Ivanti, SOHO routers)
- Persistence: Valid accounts, scheduled tasks using native tools
- Defense Evasion: Exclusive use of built-in Windows tools (PowerShell, WMI, netsh)
- Credential Access: LSASS dumps via comsvcs.dll, ntdsutil.exe
- Lateral Movement: RDP, SMB, WMI using harvested credentials

Sector-Specific Concern:
Multiple energy sector entities have identified Volt Typhoon activity. Recommend immediate threat hunting using provided IOCs and behavioral indicators.

ACTION REQUIRED: Review behavioral indicators against your environment`,
          expectedActions: [
            'Brief executive leadership on threat advisory',
            'Initiate threat hunting using provided behavioral indicators',
            'Review logs from internet-facing appliances',
            'Assess OT/IT boundary monitoring capabilities'
          ],
          facilitatorNotes: 'This sets the stage for proactive threat hunting. Emphasize that traditional IOC-based detection is ineffective against LOTL techniques.'
        },
        {
          id: 'volt-inj-002',
          title: 'Threat Hunt Finding: Anomalous PowerShell Activity',
          type: 'technical',
          severity: 'critical',
          triggerTime: 5,
          source: 'Threat Hunting Team',
          content: `THREAT HUNT REPORT - Priority: CRITICAL
Hunt ID: TH-2024-0892

Hypothesis: Volt Typhoon LOTL activity in environment

Finding: Anomalous PowerShell execution patterns detected

Evidence:
- Host: OPSWORK-0147 (IT/OT boundary workstation)
- User: svc_gridmon (service account)
- Timeframe: 02:00-04:00 UTC (off-hours)

Suspicious Commands (sampled):
1. powershell.exe -c "Get-WmiObject Win32_NetworkAdapterConfiguration"
2. cmd.exe /c "netsh interface portproxy show all"
3. ntdsutil.exe "ac i ntds" "ifm" "create full c:\\temp"
4. wmic /node:SCADA-HMI-01 process list brief

Analysis:
- Service account not authorized for interactive sessions
- Commands consistent with Volt Typhoon reconnaissance TTPs
- Network discovery targeting OT network segment
- NTDS.dit extraction attempt (credential harvesting)

Lateral Movement Indicators:
- Same account observed on 7 additional hosts over 90 days
- All activity during maintenance windows
- No corresponding change tickets

Recommendation: Assume active nation-state compromise. Initiate full-scope investigation.`,
          expectedActions: [
            'Escalate to executive leadership immediately',
            'Activate incident response procedures',
            'Preserve forensic evidence before containment',
            'Assess scope of service account access'
          ],
          facilitatorNotes: 'Key decision point: how aggressive to be with initial containment given potential OT impact.'
        },
        {
          id: 'volt-inj-003',
          title: 'Historical Log Analysis: 18-Month Dwell Time',
          type: 'technical',
          severity: 'critical',
          triggerTime: 12,
          source: 'Security Analytics',
          content: `LOG ANALYSIS REPORT
Analysis Period: 18 months retrospective

Findings:
Initial compromise identified: Approximately 18 months ago
Entry vector: Fortinet SSL VPN appliance (CVE-2022-42475)

Timeline Reconstruction:
Month 1-3: Initial access, internal reconnaissance
Month 4-6: Credential harvesting, AD enumeration
Month 7-12: Lateral movement to IT/OT boundary systems
Month 13-18: Persistent access to OT-adjacent systems, periodic check-ins

Compromised Assets Identified (preliminary):
- 23 Windows servers (IT network)
- 12 workstations (engineering/OT boundary)
- 4 jump servers to OT network
- Unknown access to OT network proper

Service Accounts Compromised:
- svc_gridmon (OT monitoring)
- svc_backup (backup operations)
- svc_patch (WSUS deployment)

Persistence Mechanisms:
- Scheduled tasks using certutil.exe
- WMI event subscriptions
- Valid credentials (no malware deployed)

Critical Concern:
Attacker has had time to:
1. Map entire OT network architecture
2. Understand grid operations procedures
3. Identify critical control points
4. Potentially pre-position for disruptive action

This represents a worst-case scenario for dwell time.`,
          expectedActions: [
            'Document full scope of compromise',
            'Prioritize OT network assessment',
            'Engage external incident response support',
            'Notify CISA and FBI'
          ],
          facilitatorNotes: 'Emphasize the psychological impact of discovering an 18-month compromise. Discuss why traditional detection failed.'
        },
        {
          id: 'volt-inj-004',
          title: 'CISA Regional Coordinator Contact',
          type: 'communication',
          severity: 'high',
          triggerTime: 20,
          source: 'External - CISA',
          content: `INCOMING CALL
From: CISA Region [X] Coordinator

"This is [Name] from CISA. We've been tracking Volt Typhoon activity across the energy sector and wanted to reach out proactively.

We have threat intelligence suggesting your organization may be targeted. Have you seen any indicators consistent with LOTL activity in your environment?

We want to offer support including:
- Technical assistance team deployment
- Classified threat briefing
- IOC sharing from other sector victims
- Coordination with FBI for attribution and investigation

We're also coordinating with NERC and your regional reliability coordinator. Given the potential grid implications, we want to ensure proper coordination.

What's your current assessment of your environment?"

Note: CISA has information from other compromised utilities that may help scope your investigation.`,
          expectedActions: [
            'Share current findings with CISA',
            'Request technical assistance team',
            'Coordinate on information sharing protocols',
            'Discuss notification to regional reliability coordinator'
          ],
          facilitatorNotes: 'Discuss the benefits and concerns of federal coordination. Some organizations hesitate to involve government agencies.'
        }
      ],
      discussionQuestions: [
        {
          id: 'volt-q-001',
          question: 'Why are living-off-the-land techniques particularly effective against traditional security controls? What detection strategies can help identify LOTL activity?',
          category: 'technical',
          suggestedTime: 8,
          keyPoints: [
            'LOTL uses legitimate tools that are allowlisted',
            'Activity blends with normal admin operations',
            'No malware signatures to detect',
            'Behavioral analytics and baselines are essential',
            'User and Entity Behavior Analytics (UEBA) value'
          ]
        },
        {
          id: 'volt-q-002',
          question: 'Given the 18-month dwell time and potential OT access, how should you prioritize your initial response actions? What are the risks of aggressive early containment?',
          category: 'decision',
          suggestedTime: 10,
          keyPoints: [
            'Evidence preservation vs. stopping the threat',
            'Risk of alerting adversary to detection',
            'OT system stability concerns',
            'Need to understand scope before containment',
            'Potential for adversary to have "dead man switch"'
          ]
        },
        {
          id: 'volt-q-003',
          question: 'What are the benefits and risks of engaging CISA and FBI early in this investigation? How does nation-state attribution change your response calculus?',
          category: 'coordination',
          suggestedTime: 8,
          keyPoints: [
            'Access to classified threat intelligence',
            'Sector-wide coordination benefits',
            'Potential loss of control over response',
            'Legal and regulatory considerations',
            'Geopolitical implications of attribution'
          ]
        }
      ]
    },
    {
      id: 'volt-hunting',
      title: 'Threat Hunting: Scope and Persistence Assessment',
      phase: 'analysis',
      duration: 40,
      objectives: [
        'Conduct comprehensive threat hunting across IT and OT environments',
        'Identify all persistence mechanisms and compromised assets',
        'Assess OT network exposure and potential access',
        'Develop complete picture of adversary capabilities and positioning'
      ],
      injects: [
        {
          id: 'volt-inj-005',
          title: 'OT Network Probe Discovery',
          type: 'technical',
          severity: 'critical',
          triggerTime: 0,
          source: 'OT Security Team',
          content: `OT SECURITY ALERT - PRIORITY: EMERGENCY

During threat hunting sweep of OT-adjacent systems, discovered evidence of reconnaissance against SCADA/EMS environment.

Findings on Engineering Workstation EWS-SCADA-03:
- PowerShell history shows OPC server enumeration
- Network captures show ICS protocol scanning (Modbus, DNP3)
- Screenshots found in temp folder showing HMI displays
- Configuration files for RTUs saved to hidden directory

Accessed Systems (confirmed via logs):
- SCADA-HMI-01 through SCADA-HMI-04
- EMS-PRIMARY (Energy Management System)
- HISTORIAN-01 (process historian)
- RTU-GATEWAY-NORTH, RTU-GATEWAY-SOUTH

Assessment:
Attacker has achieved OT network visibility and understands:
- Grid topology and control architecture
- Substation configurations
- Load balancing procedures
- Emergency operating procedures (documentation accessed)

Unknown:
- Whether attacker has deployed any persistent access in OT
- Whether any control system modifications were made
- Full extent of documentation/configuration exfiltrated

Recommendation: Assume full OT network compromise until proven otherwise.`,
          expectedActions: [
            'Isolate engineering workstations from OT network',
            'Conduct integrity verification of control systems',
            'Review OT network logs for unauthorized access',
            'Engage ICS security specialists'
          ],
          facilitatorNotes: 'This is the nightmare scenario - IT compromise extending into OT. Discuss the unique challenges of OT forensics and response.'
        },
        {
          id: 'volt-inj-006',
          title: 'FBI Cyber Division Briefing Request',
          type: 'communication',
          severity: 'high',
          triggerTime: 10,
          source: 'FBI Cyber Division',
          content: `CONFIDENTIAL - LAW ENFORCEMENT SENSITIVE

From: FBI Cyber Division, Critical Infrastructure Unit

Subject: Volt Typhoon Investigation Coordination

We understand CISA has been in contact regarding Volt Typhoon indicators in your environment. FBI is formally requesting coordination on this matter.

Our interest:
1. This is part of a larger counterintelligence investigation
2. Multiple critical infrastructure entities are compromised
3. Attribution to PRC MSS is being developed for potential response options
4. Intelligence community assessing pre-positioning for Taiwan contingency

We request:
- Forensic image preservation (chain of custody for potential prosecution)
- Information sharing agreement execution
- Weekly coordination calls
- Potential classified briefing for executive leadership (TS/SCI clearance required)

Important Note:
We ask that you not publicly attribute this activity or discuss with media without coordination. Premature attribution could compromise ongoing operations.

We can provide:
- Technical analysts to assist investigation
- Threat intelligence from other victims
- Coordination with intelligence community partners

Please advise on your organization's willingness to coordinate.`,
          expectedActions: [
            'Consult legal counsel on FBI coordination',
            'Discuss information sharing implications with leadership',
            'Ensure proper evidence preservation procedures',
            'Consider security clearance requirements'
          ],
          facilitatorNotes: 'Discuss the tension between organizational autonomy and national security coordination. What obligations exist?'
        },
        {
          id: 'volt-inj-007',
          title: 'Active Directory Analysis: Scope Expansion',
          type: 'technical',
          severity: 'critical',
          triggerTime: 18,
          source: 'Digital Forensics Team',
          content: `AD FORENSICS REPORT
Domain: GRIDOPS.LOCAL

Findings - Worse Than Initially Assessed:

Compromised Accounts (confirmed): 47
- 12 service accounts (including 3 with OT access)
- 8 IT administrator accounts
- 4 OT engineer accounts
- 23 standard user accounts

Persistence Mechanisms Identified:

1. Golden Ticket Capability
   - KRBTGT hash was extracted
   - Attacker can forge any Kerberos ticket
   - Domain considered fully compromised

2. Scheduled Tasks (14 instances)
   - Using certutil, bitsadmin for C2
   - Execution during business hours to blend in

3. WMI Event Subscriptions (8 instances)
   - Triggered on system startup
   - Execute encoded PowerShell

4. GPO Modifications (3 policies)
   - Subtle changes to security policies
   - Weakened audit logging in OT OU

5. Shadow Admin Accounts (2)
   - Named to appear as service accounts
   - Full domain admin privileges

Critical: Standard remediation insufficient. Full AD rebuild required for complete eradication.

Estimated Remediation Time: 4-6 weeks minimum
Risk: Attacker re-compromise during remediation window`,
          expectedActions: [
            'Plan for AD rebuild or migration',
            'Implement emergency credential rotation',
            'Deploy additional monitoring during remediation',
            'Assess business impact of extended remediation'
          ],
          facilitatorNotes: 'Golden Ticket compromise is severe - discuss why this essentially means the domain is unrecoverable without rebuild.'
        },
        {
          id: 'volt-inj-008',
          title: 'Reliability Coordinator Inquiry',
          type: 'communication',
          severity: 'high',
          triggerTime: 28,
          source: 'Regional Reliability Coordinator',
          content: `PRIORITY COMMUNICATION
From: [Regional Reliability Coordinator]
To: [Utility] Chief Operating Officer

Subject: Cybersecurity Incident Information Request

We have been contacted by NERC regarding potential cybersecurity concerns affecting your organization. As your Reliability Coordinator, we need to understand:

1. Current operational status of your transmission and generation assets
2. Any potential impact to your ability to meet reliability obligations
3. Status of your EMS and SCADA systems
4. Whether any control system integrity concerns exist

Per NERC CIP standards, you have reporting obligations for cybersecurity incidents that could affect Bulk Electric System reliability.

We need to assess:
- Do we need to implement special operating procedures?
- Should neighboring utilities be notified?
- Is load shedding capability compromised?
- Are there any immediate reliability concerns?

Please provide an initial assessment within 4 hours and schedule a call with our operations center.

We are not seeking to publicize this situation but must ensure grid reliability is maintained.`,
          expectedActions: [
            'Assess current operational capabilities honestly',
            'Coordinate response with operations team',
            'Prepare NERC CIP incident notification if required',
            'Develop contingency operating procedures'
          ],
          facilitatorNotes: 'This adds regulatory pressure. Discuss NERC CIP requirements and the balance between transparency and operational security.'
        }
      ],
      discussionQuestions: [
        {
          id: 'volt-q-004',
          question: 'How do you conduct forensic investigation and threat hunting in OT environments without disrupting operations? What special considerations apply?',
          category: 'technical',
          suggestedTime: 10,
          keyPoints: [
            'OT systems often cannot be taken offline for imaging',
            'Network monitoring may be only viable option',
            'Integrity verification of configurations and firmware',
            'Vendor coordination may be required',
            'Safety system verification essential'
          ]
        },
        {
          id: 'volt-q-005',
          question: 'Given the Golden Ticket compromise, what are your options for AD remediation while maintaining operations? What are the risks of each approach?',
          category: 'decision',
          suggestedTime: 8,
          keyPoints: [
            'Full rebuild vs. incremental remediation',
            'Parallel AD forest migration',
            'Business continuity during transition',
            'Risk of re-compromise during remediation',
            'Cost and timeline considerations'
          ]
        },
        {
          id: 'volt-q-006',
          question: 'How do you balance transparency with your Reliability Coordinator against operational security concerns during an active investigation?',
          category: 'coordination',
          suggestedTime: 8,
          keyPoints: [
            'Regulatory reporting obligations',
            'Information potentially reaching adversary',
            'Liability considerations',
            'Trust relationships with regulators',
            'Grid reliability paramount'
          ]
        }
      ]
    },
    {
      id: 'volt-containment',
      title: 'Containment: Balancing Security and Reliability',
      phase: 'containment',
      duration: 35,
      objectives: [
        'Develop containment strategy that maintains grid reliability',
        'Make critical decisions about IT/OT isolation',
        'Coordinate containment timing with operations',
        'Implement monitoring to detect containment bypass'
      ],
      injects: [
        {
          id: 'volt-inj-009',
          title: 'Containment Options Assessment',
          type: 'document',
          severity: 'high',
          triggerTime: 0,
          source: 'Incident Response Team',
          content: `CONTAINMENT OPTIONS ANALYSIS
Classification: INTERNAL - EXECUTIVE REVIEW

Option 1: Aggressive Isolation
- Immediately sever IT/OT connectivity
- Disable all compromised service accounts
- Block external network access
Pros: Fastest way to stop adversary
Cons:
- May trigger grid reliability events
- OT systems may require IT connectivity for normal ops
- Adversary may have contingency (destructive action)
Risk Level: HIGH

Option 2: Monitored Containment
- Enhanced monitoring on all pivot points
- Selective account disablement (non-critical first)
- Gradual network segmentation
Pros: Maintains operations, allows evidence gathering
Cons:
- Adversary remains active
- Slower to full containment
- Risk of further lateral movement
Risk Level: MEDIUM

Option 3: Deceptive Containment
- Redirect adversary to honeypot environment
- Maintain appearance of normal access
- Monitor adversary actions in controlled space
Pros: Intelligence gathering, controlled environment
Cons:
- Complex to implement
- Adversary may detect deception
- Resource intensive
Risk Level: MEDIUM-HIGH

Recommendation: Hybrid approach
Phase 1: Enhanced monitoring everywhere
Phase 2: Selective isolation of critical OT systems
Phase 3: Full containment during maintenance window

Timeline: 72-96 hours for full containment

DECISION REQUIRED: Containment approach selection`,
          expectedActions: [
            'Brief executive team on options',
            'Coordinate with operations on timing',
            'Ensure monitoring in place before containment',
            'Prepare rollback procedures'
          ],
          facilitatorNotes: 'Key decision point. Discuss the unique constraints of critical infrastructure that don\'t exist in typical IT environments.',
          decisionPoint: {
            question: 'Which containment approach will you take?',
            options: [
              {
                id: 'aggressive',
                label: 'Aggressive Isolation',
                description: 'Immediately cut IT/OT connectivity and disable accounts - fastest but highest operational risk',
                consequence: 'Maximum security posture but potential grid reliability impact'
              },
              {
                id: 'monitored',
                label: 'Monitored Containment',
                description: 'Gradual containment with enhanced monitoring - balanced but slower',
                consequence: 'Adversary remains active longer but operations maintained'
              },
              {
                id: 'deceptive',
                label: 'Deceptive Containment',
                description: 'Redirect adversary to honeypot while maintaining apparent access',
                consequence: 'Intelligence opportunity but complex and resource-intensive'
              }
            ]
          }
        },
        {
          id: 'volt-inj-010',
          title: 'Grid Operations Emergency',
          type: 'technical',
          severity: 'critical',
          triggerTime: 10,
          source: 'Grid Operations Center',
          content: `GRID OPERATIONS ALERT
Classification: OPERATIONAL EMERGENCY

During initial containment actions, unexpected issues have emerged:

Incident: Loss of visibility to 3 substations
- Substations: NORTH-147, NORTH-152, EAST-089
- Last telemetry: 15 minutes ago
- Status: UNKNOWN

Impact Assessment:
- These substations serve approximately 45,000 customers
- Current load: 180 MW aggregate
- Weather: Heat wave, high demand period

Possible Causes:
1. Coincidental equipment failure
2. Adversary response to detected containment
3. Containment action unintended consequence
4. Pre-positioned destructive action triggered

Operations Center Status:
"We've lost SCADA visibility but substations should be on local automatic control. We have no way to remotely operate breakers or adjust transformer taps. If there's a fault, we can't see it or respond remotely."

Immediate Options:
A) Send crews to substations for manual operation (45 min travel)
B) Continue containment and accept blind spot
C) Roll back containment actions to restore visibility
D) Activate mutual aid from neighboring utility

Grid Reliability Assessment:
Current reserves adequate, but extended outage during heat wave poses health/safety risk.

DECISION REQUIRED: Immediate operational response`,
          expectedActions: [
            'Dispatch crews to affected substations',
            'Assess whether to continue or roll back containment',
            'Notify reliability coordinator of operational constraint',
            'Prepare for potential manual grid operations'
          ],
          facilitatorNotes: 'This is the nightmare scenario - containment actions causing operational impact. Discuss how to proceed when you can\'t tell if adversary caused the issue.'
        },
        {
          id: 'volt-inj-011',
          title: 'Board Chairman Call',
          type: 'communication',
          severity: 'high',
          triggerTime: 20,
          source: 'Board of Directors',
          content: `URGENT - EXECUTIVE COMMUNICATION
From: Board Chairman

"I've been briefed on the situation by the CEO. I have several concerns I need addressed:

1. Customer Impact: If this becomes public, how do we explain that a foreign government has been in our systems for 18 months? Our customers trust us with their essential service.

2. Liability: If the grid goes down due to containment actions OR adversary actions, who is liable? What's our exposure?

3. Insurance: Have we notified our cyber insurance carrier? What are our coverage limits for nation-state attacks? Many policies exclude 'acts of war.'

4. Stock Impact: We're publicly traded. When does this become a material event requiring disclosure?

5. Government Coordination: Are we being asked to subordinate our business interests to national security interests? Who decides?

I'm convening an emergency board meeting in 4 hours. I need a comprehensive briefing that addresses:
- Current situation and response status
- Risk assessment (operational, financial, legal, reputational)
- Recommended path forward
- What we're telling regulators, government, and (eventually) customers

Prepare the team for hard questions."`,
          expectedActions: [
            'Prepare board briefing materials',
            'Engage cyber insurance broker',
            'Consult securities counsel on disclosure obligations',
            'Develop stakeholder communication strategy'
          ],
          facilitatorNotes: 'This adds governance and financial dimensions. Discuss how board-level concerns differ from operational concerns.'
        },
        {
          id: 'volt-inj-012',
          title: 'NSA Cybersecurity Advisory Coordination',
          type: 'communication',
          severity: 'medium',
          triggerTime: 28,
          source: 'NSA Cybersecurity Directorate',
          content: `SECURE COMMUNICATION
From: NSA Cybersecurity Directorate

Subject: Volt Typhoon Technical Coordination

We are coordinating with FBI and CISA on the Volt Typhoon campaign affecting multiple critical infrastructure sectors. NSA has unique technical insights that may assist your remediation.

We can provide:
1. Specific indicators from signals intelligence
2. Adversary C2 infrastructure details
3. Technical countermeasures guidance
4. Coordination with CYBERCOM for potential defensive actions

Additionally, we're developing a classified technical advisory for the energy sector. We'd like to incorporate lessons learned from your response, anonymized.

Important Considerations:
- Information provided may have classification implications
- Some technical details cannot be shared outside cleared personnel
- We may ask you to delay certain defensive actions to protect sources/methods
- Sector-wide defense may require coordination on remediation timing

We recognize this creates tension between your immediate needs and broader national security. We're committed to finding a workable balance.

Can you designate a technical point of contact with appropriate clearances?`,
          expectedActions: [
            'Identify personnel with security clearances',
            'Establish secure communication channels',
            'Balance organizational needs with sector-wide coordination',
            'Document any requests to delay actions'
          ],
          facilitatorNotes: 'Discuss the complexities of coordinating with intelligence agencies. How do you handle requests that conflict with organizational interests?'
        }
      ],
      discussionQuestions: [
        {
          id: 'volt-q-007',
          question: 'When containment actions cause operational issues (like lost substation visibility), how do you determine whether to continue containment or roll back? What framework helps make this decision?',
          category: 'decision',
          suggestedTime: 10,
          keyPoints: [
            'Safety always paramount',
            'Adversary action vs. unintended consequence analysis',
            'Risk of rolling back vs. continuing blind',
            'Pre-established decision frameworks',
            'Coordination with grid operations'
          ]
        },
        {
          id: 'volt-q-008',
          question: 'How do you balance board/shareholder interests with national security coordination? What happens when government agencies ask you to delay protective actions?',
          category: 'policy',
          suggestedTime: 8,
          keyPoints: [
            'Fiduciary duties to shareholders',
            'Public service obligations',
            'Documentation of government requests',
            'Legal protections for coordination',
            'Risk acceptance decisions'
          ]
        },
        {
          id: 'volt-q-009',
          question: 'What criteria would lead you to decide on a controlled grid shutdown versus continuing operations with compromised systems?',
          category: 'decision',
          suggestedTime: 8,
          keyPoints: [
            'Physical safety thresholds',
            'Loss of control capability',
            'Evidence of imminent destructive action',
            'Weather and demand conditions',
            'Restoration capability'
          ]
        }
      ]
    },
    {
      id: 'volt-hardening',
      title: 'Hardening: Long-Term Security Transformation',
      phase: 'recovery',
      duration: 35,
      objectives: [
        'Develop comprehensive eradication and recovery plan',
        'Design hardened architecture to prevent recompromise',
        'Establish enhanced monitoring and threat hunting capabilities',
        'Address systemic security gaps revealed by compromise'
      ],
      injects: [
        {
          id: 'volt-inj-013',
          title: 'Long-Term Remediation Plan',
          type: 'document',
          severity: 'high',
          triggerTime: 0,
          source: 'CISA Technical Assistance Team',
          content: `REMEDIATION ROADMAP
Developed in coordination with CISA, FBI, and NSA

Phase 1: Immediate (Days 1-14)
- Reset all credentials enterprise-wide
- Deploy enhanced monitoring on all network segments
- Implement emergency network segmentation
- Establish out-of-band management network
- Manual operations for critical grid functions
Budget Impact: ~$2M emergency spending

Phase 2: Short-Term (Days 15-60)
- Complete AD forest rebuild/migration
- Replace compromised network appliances
- Implement zero-trust architecture for IT/OT boundary
- Deploy deception technology
- Establish 24/7 threat hunting capability
Budget Impact: ~$8M capital + $3M operating

Phase 3: Medium-Term (Days 61-180)
- OT network security architecture redesign
- Implement ICS-specific security monitoring
- Conduct penetration testing (IT and OT)
- Achieve NERC CIP compliance improvements
- Establish information sharing agreements
Budget Impact: ~$15M capital investment

Phase 4: Long-Term (Year 1-3)
- IT/OT security operations center
- Continuous threat hunting program
- Regular adversary emulation exercises
- Supply chain security program
- Workforce development and training
Budget Impact: ~$5M/year operating increase

Total Investment Required: ~$35M+ over 3 years
(Current annual security budget: $4M)

DECISION REQUIRED: Funding approval and prioritization`,
          expectedActions: [
            'Review and prioritize remediation phases',
            'Develop funding request for board',
            'Identify quick wins vs. long-term investments',
            'Establish program governance'
          ],
          facilitatorNotes: 'The cost of proper remediation is substantial. Discuss how to justify this investment and the risks of under-investing.'
        },
        {
          id: 'volt-inj-014',
          title: 'Public Disclosure Planning',
          type: 'document',
          severity: 'high',
          triggerTime: 10,
          source: 'Communications Team',
          content: `PUBLIC DISCLOSURE ANALYSIS
Classification: INTERNAL - EMBARGOED

Current Situation:
- FBI has requested we delay public disclosure
- SEC rules may require material event disclosure
- State public utility commission requires incident reporting
- Media is starting to ask questions (2 inquiries received)

Disclosure Options:

Option A: Immediate Full Disclosure
- Public statement acknowledging nation-state compromise
- Customer notification of potential data access
- SEC 8-K filing
Pros: Transparency, regulatory compliance
Cons: May compromise investigation, stock impact, customer panic

Option B: Coordinated Sector Disclosure
- Wait for CISA/FBI joint advisory
- Participate in sector-wide disclosure
- Our incident part of larger narrative
Pros: Shared responsibility, government backing
Cons: Delay may violate obligations, loss of control

Option C: Minimal Required Disclosure
- Regulatory notifications only (NERC, PUC)
- No public statement unless required
- Monitor for leaks
Pros: Operational security maintained
Cons: Risk of appearing to hide information if leaked

Option D: Phased Disclosure
- Initial statement: "enhanced security measures"
- Full disclosure after containment complete
- Detailed report after remediation
Pros: Balanced approach
Cons: May appear evasive

Legal Assessment:
SEC materiality threshold likely triggered. State utility regulations vary but generally require reporting. NERC CIP mandatory reporting applies.

Media Inquiry Received:
"We've heard from sources that your utility has discovered Chinese hackers in your systems. Can you comment?"

DECISION REQUIRED: Disclosure strategy and timing`,
          expectedActions: [
            'Consult with legal on disclosure obligations',
            'Coordinate disclosure approach with government partners',
            'Prepare holding statements for media',
            'Brief customer service on potential inquiries'
          ],
          facilitatorNotes: 'Media inquiries add pressure. Discuss how disclosure decisions change when the story might break regardless.',
          decisionPoint: {
            question: 'What disclosure approach will you take?',
            options: [
              {
                id: 'immediate',
                label: 'Immediate Full Disclosure',
                description: 'Public statement acknowledging nation-state compromise now',
                consequence: 'Maximum transparency but potential investigation impact and market reaction'
              },
              {
                id: 'coordinated',
                label: 'Coordinated Sector Disclosure',
                description: 'Wait for joint government advisory to disclose as part of larger narrative',
                consequence: 'Shared responsibility but delayed disclosure may trigger obligations'
              },
              {
                id: 'minimal',
                label: 'Minimal Required Disclosure',
                description: 'Regulatory notifications only, no public statement unless required',
                consequence: 'Maintains operational security but reputation risk if leaked'
              }
            ]
          }
        },
        {
          id: 'volt-inj-015',
          title: 'Post-Incident Intelligence Assessment',
          type: 'document',
          severity: 'medium',
          triggerTime: 22,
          source: 'Intelligence Community (via FBI)',
          content: `CLASSIFIED SUMMARY - UNCLASSIFIED EXCERPT
Distribution: TLP:AMBER

Post-Incident Assessment: Volt Typhoon Campaign

Scope of Campaign:
- 47 confirmed victim organizations (US critical infrastructure)
- Sectors: Energy (23), Water (12), Communications (8), Transportation (4)
- Geographic concentration: Western US, Pacific territories
- Estimated dwell times: 12-36 months average

Strategic Assessment:
Intelligence community assesses with high confidence:
1. Campaign is PRC state-sponsored (MSS via contractors)
2. Objective is pre-positioning for potential disruption
3. Taiwan contingency is primary concern
4. Destructive capability exists but not yet employed
5. Adversary will attempt recompromise

Your Organization's Significance:
- Grid connectivity to [military installation]
- Regional importance to [strategic location]
- Assessed as Tier 1 target for re-compromise attempts

Recommendations:
1. Expect persistent targeting over next 2-3 years
2. Anticipate adversary adapting TTPs post-disclosure
3. Sector-wide defense coordination essential
4. Consider geopolitical triggers for elevated monitoring

Warning:
During periods of increased US-China tension (e.g., Taiwan crisis), organizations in this campaign should be on heightened alert for destructive action.

This threat is not going away with remediation. This is the new normal.`,
          expectedActions: [
            'Brief leadership on ongoing threat assessment',
            'Develop long-term threat monitoring strategy',
            'Establish triggers for elevated security posture',
            'Participate in sector coordination'
          ],
          facilitatorNotes: 'This isn\'t a one-time incident - it\'s an ongoing campaign. Discuss how organizations adapt to persistent nation-state targeting.'
        },
        {
          id: 'volt-inj-016',
          title: 'Lessons Learned and After-Action Report',
          type: 'document',
          severity: 'medium',
          triggerTime: 30,
          source: 'Incident Response Team',
          content: `AFTER-ACTION REPORT
Incident: Volt Typhoon Compromise and Response

What Worked Well:
- Proactive threat hunting identified compromise
- Cross-functional team coordination
- Federal partnership provided valuable intelligence
- Grid operations maintained throughout response
- Evidence preservation enabled investigation

What Needs Improvement:
- Initial detection took 18 months (too long)
- IT/OT boundary security was inadequate
- Service account management was poor
- Network segmentation was insufficient
- Incident response plans didn't address nation-state scenarios

Root Cause Analysis:
1. Initial Access: Unpatched VPN appliance
2. Persistence: Legitimate credentials, no behavioral monitoring
3. Lateral Movement: Flat network, excessive service account privileges
4. OT Access: IT/OT boundary controls inadequate
5. Detection Gap: LOTL techniques not detectable by existing tools

Systemic Issues Identified:
- Security investment historically underprioritzed
- IT/OT security responsibilities unclear
- Threat intelligence not operationalized
- Incident response plans focused on ransomware, not APT
- Board-level cyber risk oversight insufficient

Recommended Policy Changes:
1. Establish OT security function with dedicated budget
2. Implement zero-trust architecture
3. Develop nation-state incident response playbook
4. Enhance board cybersecurity governance
5. Participate in sector ISACs and government partnerships

The Question for Leadership:
Are we prepared to make the necessary investments to operate in an environment of persistent nation-state targeting?`,
          expectedActions: [
            'Present findings to executive leadership',
            'Develop implementation plan for recommendations',
            'Update incident response plans',
            'Establish ongoing improvement program'
          ],
          facilitatorNotes: 'The final inject focuses on systemic improvement. Emphasize that this is about organizational transformation, not just technical fixes.'
        }
      ],
      discussionQuestions: [
        {
          id: 'volt-q-010',
          question: 'Given the scale of investment required ($35M+ over 3 years), how do you prioritize remediation activities? What\'s the minimum viable security posture?',
          category: 'decision',
          suggestedTime: 10,
          keyPoints: [
            'Risk-based prioritization',
            'Quick wins vs. fundamental architecture changes',
            'Regulatory requirements as baseline',
            'Board risk appetite',
            'Consequences of under-investment'
          ]
        },
        {
          id: 'volt-q-011',
          question: 'How do you sustain heightened security operations indefinitely against a persistent nation-state threat? What organizational changes are required?',
          category: 'policy',
          suggestedTime: 8,
          keyPoints: [
            'Continuous threat hunting programs',
            'Staff burnout and retention',
            'Budget sustainability',
            'Cultural changes required',
            'Partnership models'
          ]
        },
        {
          id: 'volt-q-012',
          question: 'What are your key takeaways from this exercise? What changes will you advocate for in your organization?',
          category: 'lessons_learned',
          suggestedTime: 8,
          keyPoints: [
            'Personal commitments and actions',
            'Organizational changes needed',
            'Investment priorities',
            'Coordination improvements',
            'Preparation for next incident'
          ]
        }
      ]
    }
  ],
  scenarioConfig: {
    timeDisplay: 'elapsed',
    defaultPhaseDuration: 40,
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

export const voltTyphoonEnergyScenario: LibraryEntry = {
  id: scenario.id,
  title: scenario.title,
  category: 'Nation-State APT',
  difficulty: scenario.difficulty,
  duration: scenario.estimatedDuration,
  description: scenario.description,
  tags: ['Volt Typhoon', 'PRC', 'Critical Infrastructure', 'Energy', 'LOTL', 'OT Security', 'CISA', 'Grid Operations'],
  moduleCount,
  injectCount,
  questionCount,
  scenario
}
