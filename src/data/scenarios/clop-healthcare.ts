import type { Scenario, LibraryEntry } from '../../types/scenario.types'

const scenario: Scenario = {
  id: 'clop-healthcare',
  title: 'Patient Zero: Cl0p Healthcare Mass Exploitation',
  subtitle: 'Zero-Day Supply Chain Attack on Multi-Hospital Health System',
  description: `Your organization is a large health system operating 5 hospitals and over 200 outpatient clinics across a three-state region. You serve 2.3 million patients annually and employ 15,000 healthcare workers. You're subject to HIPAA regulations and various state health data privacy laws.

A critical zero-day vulnerability has been disclosed in a file transfer application (similar to MOVEit) used by your organization and hundreds of others. The Cl0p ransomware group has exploited this vulnerability at scale, exfiltrating data from potentially thousands of organizations before the vulnerability was known. Unlike traditional ransomware, Cl0p has not encrypted any systems—they have only stolen data and are now demanding payment to prevent publication.

This scenario explores the unique challenges of responding to a mass exploitation event where you are one of many victims, navigating complex healthcare regulatory requirements, and managing patient notification when the scope is overwhelming.`,
  threatCategory: 'Ransomware',
  difficulty: 'advanced',
  estimatedDuration: 180,
  targetAudience: [
    'Security Operations Teams',
    'Healthcare Privacy Officers',
    'Executive Leadership',
    'Legal and Compliance',
    'Patient Services Leadership'
  ],
  objectives: [
    'Respond to zero-day exploitation and data exfiltration',
    'Determine scope of PHI exposure across complex environment',
    'Navigate HIPAA breach notification requirements',
    'Coordinate response as one of many victims',
    'Manage patient communication at scale',
    'Address multi-state regulatory requirements'
  ],
  modules: [
    {
      id: 'clop-discovery',
      title: 'Discovery: Mass Exploitation Revealed',
      phase: 'detection',
      duration: 45,
      objectives: [
        'Understand nature of zero-day vulnerability',
        'Assess organizational exposure',
        'Initiate investigation of potential compromise',
        'Begin vendor and threat intelligence coordination'
      ],
      injects: [
        {
          id: 'clop-inj-001',
          title: 'Vendor Security Advisory',
          type: 'technical',
          severity: 'critical',
          triggerTime: 0,
          source: 'File Transfer Vendor',
          content: `CRITICAL SECURITY ADVISORY
[File Transfer Vendor] - CVE-2024-XXXXX

SEVERITY: CRITICAL (CVSS 9.8)
EXPLOITATION STATUS: ACTIVELY EXPLOITED IN THE WILD

Summary:
A critical SQL injection vulnerability has been identified in [File Transfer Product] that allows unauthenticated remote attackers to execute arbitrary commands and exfiltrate data.

We have confirmed that this vulnerability has been exploited by threat actors prior to our discovery. If you are running an affected version, YOU MAY ALREADY BE COMPROMISED.

Affected Versions:
- [Product] 2021.0 through 2023.0.4
- [Product] 2023.1.0 through 2023.1.2

Immediate Actions Required:
1. Take [Product] offline IMMEDIATELY
2. Apply emergency patch (available now)
3. Check for indicators of compromise
4. Review all data accessible through [Product]

Known Indicators of Compromise:
- Webshell files: human2.aspx, help.aspx
- Unexpected files in [installation path]
- Large outbound data transfers
- Access logs showing exploitation patterns

This vulnerability has been exploited at scale. Multiple organizations have confirmed data exfiltration. The threat actor group Cl0p has claimed responsibility.

We are coordinating with law enforcement and CISA.

For technical support: [emergency hotline]
For security questions: [security team email]

We deeply regret this incident and are committed to supporting affected customers.`,
          expectedActions: [
            'Take affected systems offline immediately',
            'Check for indicators of compromise',
            'Assess what data was accessible via system',
            'Brief leadership on potential exposure'
          ],
          facilitatorNotes: 'This is a supply chain/zero-day scenario - the organization was vulnerable through no fault of their own. Emphasize the mass exploitation nature.'
        },
        {
          id: 'clop-inj-002',
          title: 'IOC Hunt Results',
          type: 'technical',
          severity: 'critical',
          triggerTime: 8,
          source: 'Security Operations Team',
          content: `INDICATOR OF COMPROMISE HUNT
Target: [File Transfer Product] Instances

Systems Identified:
- FT-PROD-01 (Production file transfer - main data center)
- FT-PROD-02 (Production file transfer - DR site)
- FT-CLAIMS (Insurance claims processing)

IOC Hunt Results:

FT-PROD-01: COMPROMISED
- Webshell found: human2.aspx (created June 1, 02:14 UTC)
- Evidence of SQL injection in logs
- Large data export: June 1, 02:18-04:47 UTC
- Total data accessed: ~450GB

FT-PROD-02: COMPROMISED
- Webshell found: human2.aspx (created June 1, 02:19 UTC)
- Similar exploitation pattern
- Data export: June 1, 02:22-05:12 UTC
- Total data accessed: ~380GB

FT-CLAIMS: COMPROMISED
- Webshell found: help.aspx (created June 1, 02:21 UTC)
- Exploitation confirmed
- Data export: June 1, 02:25-03:58 UTC
- Total data accessed: ~175GB

Total Potential Data Exfiltration: ~1TB

Timeline:
- Vulnerability exploited: June 1, ~02:14 UTC (3 weeks ago)
- Vendor disclosure: Today
- Our discovery: Today

Critical: Compromise occurred 3 weeks ago. Attackers had time for comprehensive exfiltration.

Data Categories at Risk (preliminary):
The file transfer systems were used for:
- Patient data exchange with insurers
- Lab results and imaging transfers
- Claims and billing data
- Employee HR file transfers
- Vendor data exchanges

Full data scope assessment required.`,
          expectedActions: [
            'Isolate all compromised systems',
            'Preserve forensic evidence',
            'Begin data scope assessment',
            'Activate incident response team'
          ],
          facilitatorNotes: 'Three weeks of dwell time means comprehensive exfiltration. The scope will be massive. Prepare the group for scale.'
        },
        {
          id: 'clop-inj-003',
          title: 'CISA Emergency Alert',
          type: 'document',
          severity: 'critical',
          triggerTime: 15,
          source: 'CISA',
          content: `CISA CYBERSECURITY ALERT
AA24-XXX: Cl0p Ransomware Gang Exploiting [Product] Vulnerability

Summary:
CISA, FBI, and international partners are responding to widespread exploitation of CVE-2024-XXXXX in [File Transfer Product]. The Cl0p ransomware group has exploited this vulnerability at scale.

Scale of Attack:
- Estimated 2,000+ organizations potentially affected globally
- Multiple US federal agencies impacted
- Healthcare, financial, government sectors heavily targeted
- Exploitation occurred over 2-3 week period before disclosure

Threat Actor Profile:
Cl0p (also known as TA505) is a cybercriminal group known for:
- Large-scale data theft operations
- Extortion without encryption
- Mass exploitation of zero-day vulnerabilities
- Public victim shaming via leak site

Expected Behavior:
Based on previous Cl0p campaigns (Accellion, GoAnywhere):
1. Victims will be contacted via email demanding payment
2. Victims will be listed on Cl0p leak site if no payment
3. Data publication occurs in waves
4. Cl0p typically gives 7-10 days before publication

Healthcare Sector Impact:
Significant healthcare sector exposure expected due to:
- Widespread use of product for HIPAA-compliant transfers
- PHI likely exposed at many organizations
- HHS OCR monitoring situation

CISA Recommendations:
1. Identify all instances of affected product
2. Hunt for indicators of compromise
3. Determine data exposure scope
4. Prepare for breach notification obligations
5. Do not assume you're not affected

CISA is establishing a coordination mechanism for affected organizations.

This is a rapidly evolving situation. Updates will follow.`,
          expectedActions: [
            'Confirm participation in CISA coordination',
            'Review all instances of affected product',
            'Begin comprehensive data scope assessment',
            'Prepare for regulatory notification'
          ],
          facilitatorNotes: '2,000+ organizations affected means this is a mass event. Discuss how being one of many victims affects response strategy.'
        },
        {
          id: 'clop-inj-004',
          title: 'Initial Data Scope Assessment',
          type: 'document',
          severity: 'critical',
          triggerTime: 28,
          source: 'Privacy Officer',
          content: `PRELIMINARY DATA SCOPE ASSESSMENT
Classification: HIGHLY CONFIDENTIAL

Systems Analyzed: FT-PROD-01, FT-PROD-02, FT-CLAIMS

Data Categories Confirmed Exposed:

1. Patient Health Information (PHI)
   - Patient demographics
   - Medical record numbers
   - Dates of service
   - Diagnosis codes
   - Treatment information
   - Insurance information

   Estimated Records: 2.3 million patient records
   Date Range: January 2020 - June 2024

2. Insurance Claims Data
   - Claims details
   - SSNs (for coordination of benefits)
   - Financial information
   - Coverage details

   Estimated Records: 1.8 million claims

3. Lab Results and Imaging
   - Laboratory test results
   - Diagnostic imaging reports
   - Pathology reports

   Estimated Records: 4.2 million records

4. Employee Information
   - HR file transfers
   - Benefits data
   - Some personnel files

   Estimated Employees: 12,400

5. Business Associate Data
   - Data shared with vendors
   - Third-party patient information
   - Contractor data

Preliminary Assessment:
This appears to be a breach affecting substantially all patients seen in the past 4+ years, plus current employees.

HIPAA Breach Analysis:
- Breach threshold clearly exceeded
- No encryption on data at rest
- "Low probability of compromise" standard NOT met
- Presumption of breach applies
- 60-day notification clock started June 1 (when breach occurred)
- Days elapsed: 21
- Days remaining: 39

OCR Notification Required: Yes
State Notification Required: Yes (multiple states)
Media Notification Required: Yes (exceeds 500 in multiple states)
Individual Notification Required: Yes (2.3 million patients)

This is one of the largest healthcare breaches in recent years.`,
          expectedActions: [
            'Brief executive team on scope',
            'Engage breach notification counsel',
            'Begin notification planning',
            'Prepare for HHS OCR communication'
          ],
          facilitatorNotes: '2.3 million patients is massive. The 60-day HIPAA clock adds urgency. Discuss how scale affects notification approach.'
        },
        {
          id: 'clop-inj-005',
          title: 'Cl0p Direct Contact',
          type: 'communication',
          severity: 'critical',
          triggerTime: 38,
          source: 'Cl0p Threat Actor',
          content: `EMAIL RECEIVED
From: [Cl0p contact email]
To: CEO, General Counsel (publicly available emails)
Subject: YOUR DATA - URGENT ACTION REQUIRED

Hello [Health System Name],

We are the CL0P team. We have downloaded significant data from your organization through the [File Transfer Product] vulnerability.

Your data includes:
- Patient medical records
- Social security numbers
- Insurance information
- Employee data

We have proof. Sample attached [encrypted zip file].

Our demand: $15,000,000 USD

If paid, we will:
- Delete all your data
- Provide proof of deletion
- Not publish anything
- Not contact your patients

If not paid:
- Your data goes on our leak site
- Patients will find out from media
- We may contact your patients directly
- HIPAA regulators will see your failures

You have until [date - 10 days] to pay.

After that, your patient data is public.

We know healthcare organizations have difficult decisions. But compare:
- $15M payment, this goes away quietly
- No payment: notification costs, lawsuits, regulatory fines, reputation damage = much more than $15M

This is business. Contact us to negotiate at:
TOR: [address]

Do not involve law enforcement. They cannot help you and will only complicate things.

CL0P`,
          expectedActions: [
            'Do not open attachment',
            'Brief leadership on extortion demand',
            'Notify FBI immediately',
            'Document contact for investigation'
          ],
          facilitatorNotes: 'Direct extortion contact adds pressure. The $15M demand and patient contact threat require discussion of response strategy.'
        }
      ],
      discussionQuestions: [
        {
          id: 'clop-q-001',
          question: 'This breach resulted from a zero-day in a vendor product. How does the supply chain nature of this attack affect your response strategy and communication?',
          category: 'coordination',
          suggestedTime: 10,
          keyPoints: [
            'Not directly your "fault" but still your responsibility',
            'Vendor coordination importance',
            'Being one of many victims',
            'Shared intelligence opportunities',
            'Supply chain risk going forward'
          ]
        },
        {
          id: 'clop-q-002',
          question: 'With 2.3 million patients potentially affected and a 39-day HIPAA notification deadline remaining, how do you approach the scope determination vs. notification timeline tension?',
          category: 'decision',
          suggestedTime: 10,
          keyPoints: [
            'HIPAA requires "without unreasonable delay"',
            '60 days is outer limit, not target',
            'Rolling notification approach',
            'What you know vs. what you\'ll learn',
            'OCR guidance on mass breaches'
          ]
        },
        {
          id: 'clop-q-003',
          question: 'The threat actor demands $15M and threatens to contact patients directly. How does this patient contact threat affect your response approach?',
          category: 'decision',
          suggestedTime: 8,
          keyPoints: [
            'Racing to notify before attackers',
            'Patient confusion and fear',
            'Call center preparation',
            'Coordination with law enforcement',
            'Media management'
          ]
        }
      ]
    },
    {
      id: 'clop-scope',
      title: 'Scope Assessment: Understanding the Exposure',
      phase: 'analysis',
      duration: 45,
      objectives: [
        'Complete detailed assessment of exposed data',
        'Identify all affected individuals and categories',
        'Assess third-party and downstream impacts',
        'Prepare notification scope documentation'
      ],
      injects: [
        {
          id: 'clop-inj-006',
          title: 'Detailed PHI Analysis',
          type: 'document',
          severity: 'critical',
          triggerTime: 0,
          source: 'Incident Response Team',
          content: `DETAILED PHI EXPOSURE ANALYSIS
Final Assessment - Day 3 of Investigation

Methodology:
- Reconstructed file transfer logs (partial recovery)
- Analyzed database access patterns
- Reviewed file server contents
- Interviewed business process owners

Confirmed Exposed Data:

PATIENT DATA (2.34 million unique patients):

Demographic Information:
- Full names: 2.34M
- Addresses: 2.34M
- Phone numbers: 2.34M
- Dates of birth: 2.34M
- SSNs: 1.2M (primarily Medicare patients)
- Email addresses: 1.8M

Clinical Information:
- Medical record numbers: 2.34M
- Diagnosis codes (ICD-10): 2.34M
- Treatment information: 1.9M
- Lab results: 1.4M
- Prescription information: 1.1M
- Mental health records: 89,000
- Substance abuse records: 42,000
- HIV status: 12,400

Financial Information:
- Insurance IDs: 2.2M
- Insurance claims: 1.8M
- Payment card data: 0 (not in system)
- Bank account info (direct deposit): 0

Special Categories (Requiring Enhanced Protection):
- Minors (under 18): 340,000
- Mental health patients: 89,000
- Substance abuse treatment: 42,000
- HIV-positive patients: 12,400

Geographic Distribution:
- State A (primary): 1.4M patients
- State B: 620,000 patients
- State C: 320,000 patients

Regulatory Implications:
- HIPAA breach notification: Required
- State A breach law: 45-day requirement
- State B breach law: 30-day requirement
- State C breach law: 60-day requirement
- State B has specific HIV/mental health protections

The 42 CFR Part 2 substance abuse records and HIV data require special handling and may have additional notification restrictions.`,
          expectedActions: [
            'Map data to notification requirements',
            'Identify special category data handling',
            'Coordinate multi-state notification',
            'Prepare for sensitive data communication'
          ],
          facilitatorNotes: 'Special category data (HIV, mental health, substance abuse) adds complexity. Discuss the additional protections and notification considerations.'
        },
        {
          id: 'clop-inj-007',
          title: 'HHS OCR Communication',
          type: 'communication',
          severity: 'high',
          triggerTime: 12,
          source: 'HHS Office for Civil Rights',
          content: `COMMUNICATION FROM HHS OCR

From: HHS Office for Civil Rights, Health Information Privacy Division
To: [Health System] HIPAA Privacy Officer
Subject: CVE-2024-XXXXX Healthcare Sector Impact

Dear Privacy Officer:

OCR is aware of the widespread exploitation of CVE-2024-XXXXX affecting [File Transfer Product] and the resulting data compromises across the healthcare sector.

We are contacting potentially affected covered entities and business associates to:

1. Confirm your organization's status regarding this vulnerability
2. Understand the scope of any potential PHI exposure
3. Provide guidance on breach notification obligations
4. Offer coordination support given the mass nature of this event

Initial Information Request:

Please provide within 14 days:
- Confirmation of whether your organization used the affected product
- If compromised, preliminary assessment of PHI exposure
- Estimated number of affected individuals
- Planned notification timeline
- Whether you've received extortion demands

OCR Guidance for Mass Exploitation Events:

Given the widespread nature of this incident, OCR is providing the following guidance:
- Affected entities should prioritize patient notification
- Rolling notifications are acceptable as scope is determined
- Substitute notice may be appropriate for large-scale breaches
- Coordination with other victims on messaging is encouraged
- Documentation of good faith efforts is important

OCR Enforcement Considerations:
- OCR recognizes this is a supply chain attack
- We will consider cooperation and good faith efforts
- Timely notification remains required
- Covered entities remain responsible for BA management

We expect significant media attention on healthcare sector impacts. OCR may issue public guidance.

Please acknowledge receipt and provide initial response.`,
          expectedActions: [
            'Respond to OCR within timeline',
            'Coordinate response with legal counsel',
            'Document good faith efforts',
            'Prepare detailed scope information'
          ],
          facilitatorNotes: 'OCR proactive outreach is unusual and indicates the scale of this event. Discuss how regulatory coordination helps in mass events.'
        },
        {
          id: 'clop-inj-008',
          title: 'Business Associate Impact Discovery',
          type: 'document',
          severity: 'high',
          triggerTime: 22,
          source: 'Vendor Management',
          content: `BUSINESS ASSOCIATE IMPACT ASSESSMENT
Downstream Notification Requirements

The file transfer systems were used to exchange data with multiple business associates. Assessment of third-party exposure:

AFFECTED BUSINESS ASSOCIATES:

1. [Major Health Insurer]
   - Claims data shared: 890,000 members
   - BA notification required: Yes
   - Their potential exposure: Duplicative to ours

2. [Laboratory Services Company]
   - Lab results exchanged: 1.2M results
   - BA notification required: Yes
   - They may have separate obligation

3. [Radiology Group]
   - Imaging reports: 340,000
   - BA notification required: Yes

4. [Pharmacy Benefits Manager]
   - Prescription data: 780,000 patients
   - BA notification required: Yes

5. [Medical Billing Service]
   - Claims processing: 2.1M claims
   - BA notification required: Yes

6. [IT Managed Services Provider]
   - Employee data: 12,400
   - BA notification required: Yes

7. [Other Healthcare Systems] (data sharing agreements)
   - Patient transfers/referrals: 45,000 patients
   - Notification coordination needed

Implications:
- Some patients may receive multiple notifications
- Coordination with BAs on messaging needed
- Some BAs may have their own breach from same vulnerability
- Potential for confusion in patient population

Additionally Discovered:
Three of our business associates ALSO used [File Transfer Product] and were independently compromised. This creates overlapping breach situations.

Recommendation:
Establish BA coordination calls to align messaging and prevent duplicate notifications.`,
          expectedActions: [
            'Notify business associates of exposure',
            'Coordinate notification messaging',
            'Prevent duplicate patient notifications',
            'Document BA notification efforts'
          ],
          facilitatorNotes: 'BA complexity is significant. Discuss how overlapping breaches and shared patients create coordination challenges.'
        },
        {
          id: 'clop-inj-009',
          title: 'Peer Health System Coordination Request',
          type: 'communication',
          severity: 'medium',
          triggerTime: 32,
          source: 'Regional Health System Association',
          content: `COORDINATION REQUEST
From: [Regional Health System Association]

Subject: Cl0p Incident - Regional Coordination Call

Dear Member Health Systems:

As you know, multiple health systems in our region have been affected by the Cl0p exploitation of [File Transfer Product]. We are organizing a coordination call to:

1. Share intelligence on the attack
2. Coordinate patient notification approaches
3. Align on messaging to avoid confusion
4. Share resources and best practices
5. Present unified front to media

Known Affected Members:
- [Your Health System] - Confirmed
- [Health System B] - Confirmed
- [Health System C] - Confirmed
- [Health System D] - Assessing
- [Health System E] - Assessing

Proposed Coordination:

Joint Press Statement:
Several organizations are considering a joint statement acknowledging the sector-wide impact while emphasizing individual organization response.

Notification Coordination:
Concern that patients of multiple systems may receive multiple letters causing confusion. Proposed shared FAQ and call center guidance.

Vendor Coordination:
Joint communication to [Vendor] regarding support, forensics, and potential legal action.

Call scheduled for [Tomorrow, 2PM]
Dial-in: [conference line]
Participants: CISOs, Privacy Officers, Communications leads

Please confirm attendance and provide preliminary scope information (confidential within group).`,
          expectedActions: [
            'Participate in coordination call',
            'Share appropriate information',
            'Consider joint messaging benefits',
            'Maintain organizational autonomy'
          ],
          facilitatorNotes: 'Peer coordination is valuable but complex. Discuss benefits and risks of joint action versus independent response.',
          decisionPoint: {
            question: 'Will you participate in joint notification coordination with peer health systems?',
            options: [
              {
                id: 'full-coordination',
                label: 'Full Coordination',
                description: 'Joint press statement, shared FAQs, coordinated notification timing',
                consequence: 'Unified message reduces confusion but may limit flexibility and share competitive information'
              },
              {
                id: 'partial-coordination',
                label: 'Partial Coordination',
                description: 'Share intelligence and FAQs but maintain independent notification and communication',
                consequence: 'Benefit from shared resources while maintaining control of your message'
              },
              {
                id: 'independent',
                label: 'Independent Response',
                description: 'Participate in calls but maintain fully independent response',
                consequence: 'Full control but potentially less efficient and may create inconsistent messaging'
              }
            ]
          }
        }
      ],
      discussionQuestions: [
        {
          id: 'clop-q-004',
          question: 'With sensitive categories like HIV status, mental health, and substance abuse records exposed, what additional considerations apply to notification and communication?',
          category: 'policy',
          suggestedTime: 10,
          keyPoints: [
            '42 CFR Part 2 protections',
            'State-specific HIV notification laws',
            'Stigma and patient concerns',
            'Specialized support resources',
            'Separate/specialized notifications'
          ]
        },
        {
          id: 'clop-q-005',
          question: 'Multiple health systems and business associates are affected, some sharing the same patients. How do you coordinate to prevent patient confusion from multiple notifications?',
          category: 'coordination',
          suggestedTime: 10,
          keyPoints: [
            'Shared patient identification',
            'Notification timing coordination',
            'Consistent messaging across organizations',
            'Shared resources (FAQs, call centers)',
            'Antitrust considerations in coordination'
          ]
        },
        {
          id: 'clop-q-006',
          question: 'OCR has proactively reached out and indicated they\'ll consider good faith efforts. How does this regulatory posture affect your notification strategy?',
          category: 'policy',
          suggestedTime: 8,
          keyPoints: [
            'Documentation importance',
            'Communication with OCR',
            'Rolling notification acceptability',
            'Resource allocation',
            'Precedent for future events'
          ]
        }
      ]
    },
    {
      id: 'clop-notification',
      title: 'Notification: Reaching 2.3 Million Patients',
      phase: 'containment',
      duration: 45,
      objectives: [
        'Execute patient notification at unprecedented scale',
        'Manage call center and patient support operations',
        'Address media coverage and public communication',
        'Handle regulatory notifications across jurisdictions'
      ],
      injects: [
        {
          id: 'clop-inj-010',
          title: 'Notification Logistics Challenge',
          type: 'document',
          severity: 'high',
          triggerTime: 0,
          source: 'Patient Services',
          content: `NOTIFICATION LOGISTICS ASSESSMENT
Scale: 2.34 Million Individual Notifications

Notification Methods Required:

1. Written Notification (HIPAA requirement)
   - 2.34 million letters
   - Current address verification: ~85% valid
   - Bad addresses: ~350,000 patients
   - Printing cost: ~$2M
   - Postage: ~$1.5M
   - Timeline: 3-4 weeks for production/mailing

2. Substitute Notice (for unlocatable patients)
   - Media notice required (serves 500+ patients)
   - Website posting required
   - Toll-free hotline required

3. Email Notification (supplementary)
   - 1.8M email addresses available
   - Delivery rate: ~75%
   - Can execute faster than mail

Call Center Planning:

Expected call volume (based on industry data):
- Week 1 after notification: 150,000-200,000 calls
- Week 2-4: 50,000-100,000 calls per week
- Total expected: 400,000+ calls

Current capacity: 50 agents
Required capacity: 400+ agents for first month
Options:
A) Outsource to specialized vendor: $2M setup + $3M monthly
B) Build internal team: 4-week ramp, quality concerns
C) Hybrid: Internal + overflow outsourcing

Credit Monitoring:
- Required by multiple state laws
- Cost: ~$25/person x 2.34M = ~$58M (if all enroll)
- Typical enrollment: 10-15%
- Realistic cost: $6-10M for credit monitoring

Identity Theft Protection:
- Premium option: $50/person
- Estimated demand: 5%
- Cost: ~$6M

Total Notification Cost Estimate: $15-25M

Budget approval required immediately to meet HIPAA deadline.`,
          expectedActions: [
            'Approve notification budget',
            'Select call center approach',
            'Engage credit monitoring vendor',
            'Begin notification production'
          ],
          facilitatorNotes: 'The scale of notification is staggering. Discuss the operational challenges of notifying millions of patients.'
        },
        {
          id: 'clop-inj-011',
          title: 'Cl0p Leak Site Posting',
          type: 'technical',
          severity: 'critical',
          triggerTime: 10,
          source: 'Threat Intelligence',
          content: `DARK WEB ALERT
Cl0p Leak Site Update

Your organization has been added to the Cl0p leak site:

[Health System Name]
Posted: Today
Status: "Negotiation window closing"
Timer: 4 days remaining

Attacker Statement:
"[Health System] stores sensitive health information on millions of patients. Medical records, social security numbers, HIV status, mental health records. All exposed because they used vulnerable software.

We gave them chance to pay and protect their patients. They chose to involve law enforcement instead.

In 4 days, patient data goes public. Medical conditions, treatments, personal information. Maybe patients should ask [Health System] why they didn't protect them.

Last chance to negotiate: [TOR address]"

Sample Data Published:
- 100 patient records visible
- Names, DOB, diagnoses displayed
- Clear PHI exposure

Visibility Assessment:
- Multiple security researchers reporting
- Healthcare media monitoring
- Patient advocacy groups notified
- Mainstream media coverage likely within hours

Media Inquiries Already Received: 7

Patient Social Media:
"Just saw my name on a hacker website from [Health System]. WTF is going on?"
- Already spreading on social media

The situation is escalating rapidly.`,
          expectedActions: [
            'Accelerate notification timeline',
            'Issue public statement immediately',
            'Activate crisis communications',
            'Prepare call center for surge'
          ],
          facilitatorNotes: 'Public exposure before notification is a worst case. Discuss the communication challenge when patients find out from media.'
        },
        {
          id: 'clop-inj-012',
          title: 'Media Crisis: National Coverage',
          type: 'communication',
          severity: 'critical',
          triggerTime: 20,
          source: 'Communications Team',
          content: `MEDIA SITUATION REPORT
Status: NATIONAL CRISIS

Current Coverage:

Television:
- CNN: "2 Million Patient Records Exposed in Healthcare Hack"
- Local affiliates: Leading evening news
- Network morning shows: Requesting interviews

Print/Online:
- Wall Street Journal: Story published
- New York Times: Story in progress
- Local newspapers: Front page

Social Media:
- #[HealthSystemName]Breach trending regionally
- Patient posts: 500+ and growing
- Angry sentiment: 85%

Patient Advocacy Response:
- Patient Rights Advocate group issued statement condemning breach
- Class action attorneys advertising
- State attorney general statement expected

Key Media Questions:
1. Why weren't patients notified before this went public?
2. How long did you know about this?
3. Are you paying the ransom?
4. What were you doing with HIV status data?
5. How did this happen and who is responsible?
6. What are you doing to help affected patients?

CEO Interview Requests:
- 14 requests for on-camera interviews
- All major networks requesting

Current Messaging Challenges:
- We haven't completed notification
- Patients are finding out from news
- Call center not yet staffed
- Credit monitoring not yet available

Recommended Actions:
1. CEO statement within 2 hours
2. Patient FAQ on website immediately
3. Emergency call center activation
4. Town hall for employees (they're also affected)

This is a reputational crisis of significant magnitude.`,
          expectedActions: [
            'CEO video statement immediately',
            'Activate all communication channels',
            'Staff emergency call center',
            'Launch patient resource website'
          ],
          facilitatorNotes: 'Public exposure before you\'re ready is challenging. Discuss crisis communications under maximum pressure.'
        },
        {
          id: 'clop-inj-013',
          title: 'Special Population Concerns',
          type: 'communication',
          severity: 'high',
          triggerTime: 32,
          source: 'Patient Advocacy',
          content: `URGENT: VULNERABLE POPULATION CONCERNS

Multiple urgent situations requiring immediate attention:

1. HIV Patient Outreach
Received call from HIV advocacy organization:
"Patients are terrified. Some haven't disclosed their status to family. They're seeing their names on hacker websites. We need immediate support."

Considerations:
- HIV status disclosure has life-altering implications
- Risk of discrimination, violence, family rupture
- Specialized counseling may be needed
- State law may have specific notification requirements

2. Mental Health Patient Crisis
Psychiatry department reporting:
- Multiple patient calls expressing suicidal ideation related to breach
- Patients in substance abuse treatment fearing employer discovery
- Eating disorder patients distressed about weight data exposure
- Need enhanced crisis resources

3. Domestic Violence Survivor Concern
Call from domestic violence shelter:
"Some of your patients are hiding from abusive partners. If their addresses are exposed, they could be in physical danger."

- Address confidentiality program participants affected
- Need immediate outreach to identified patients
- May need to coordinate with law enforcement

4. Undocumented Patient Fear
Community health center reporting:
"Undocumented patients are afraid this will affect their immigration status or lead to deportation. Some are avoiding seeking care."

- Need reassurance about immigration non-involvement
- Language-accessible resources needed

5. Celebrity/VIP Patients
Communications team noting:
"Several high-profile patients are in the exposed data. Media may identify them from leaked samples."

These populations need specialized outreach beyond standard notification.`,
          expectedActions: [
            'Establish specialized support resources',
            'Coordinate with advocacy organizations',
            'Priority outreach to highest-risk patients',
            'Crisis counseling resources'
          ],
          facilitatorNotes: 'Vulnerable populations face disproportionate harm. Discuss how to provide equitable care across different patient needs.'
        },
        {
          id: 'clop-inj-014',
          title: 'State Attorney General Investigation',
          type: 'communication',
          severity: 'high',
          triggerTime: 40,
          source: 'State Attorney General',
          content: `OFFICIAL COMMUNICATION
Office of the [State A] Attorney General
Consumer Protection Division

RE: Investigation of Data Breach Affecting [State A] Residents

Dear General Counsel:

This office is opening a formal investigation into the data breach affecting [Health System], which has exposed personal and health information of approximately 1.4 million [State A] residents.

We have significant concerns regarding:

1. Notification Timing
   - Breach occurred approximately 3+ weeks ago
   - Patients learned of breach from media reports
   - Written notification has not yet been received
   - This appears to violate [State A] notification timeline requirements

2. Security Practices
   - We will be examining what security measures were in place
   - Vendor management practices under review
   - Whether industry-standard protections were implemented

3. Vulnerable Population Impact
   - Particularly concerned about exposure of sensitive health data
   - HIV status, mental health, substance abuse records
   - Additional protections may have been required

Document Preservation Notice:
You are hereby directed to preserve all documents related to:
- The [File Transfer Product] implementation
- Security assessments and audits
- Incident response activities
- Vendor contracts and due diligence

Information Request:
Within 21 days, please provide:
- Complete incident timeline
- Data mapping of exposed information
- Notification plan and status
- Security policies and procedures
- Vendor management documentation

Potential Remedies:
Depending on findings, this office may seek:
- Civil penalties under state law
- Injunctive relief
- Consumer restitution
- Enhanced security requirements

We expect full cooperation. Failure to cooperate will be considered in any enforcement determination.`,
          expectedActions: [
            'Engage state AG counsel',
            'Implement document preservation',
            'Prepare response within timeline',
            'Brief leadership on investigation'
          ],
          facilitatorNotes: 'State AG investigation adds legal exposure. Discuss how regulatory investigations complicate response while it\'s still ongoing.'
        }
      ],
      discussionQuestions: [
        {
          id: 'clop-q-007',
          question: 'Patients are learning about the breach from media before receiving notification. How does this change your communication approach?',
          category: 'coordination',
          suggestedTime: 10,
          keyPoints: [
            'Public statement priority',
            'Self-service resources immediately',
            'Call center scaling',
            'Social media response',
            'Expectation management'
          ]
        },
        {
          id: 'clop-q-008',
          question: 'Vulnerable populations (HIV patients, domestic violence survivors, mental health patients) face disproportionate harm. How do you prioritize and resource specialized support?',
          category: 'decision',
          suggestedTime: 10,
          keyPoints: [
            'Risk-based prioritization',
            'Specialized outreach resources',
            'Partner organization coordination',
            'Crisis intervention capability',
            'Equity in response'
          ]
        },
        {
          id: 'clop-q-009',
          question: 'With multiple state AGs investigating and media scrutiny intense, how do you balance legal exposure management against transparent communication?',
          category: 'policy',
          suggestedTime: 8,
          keyPoints: [
            'Legal counsel role',
            'Public statement vs. legal risk',
            'Admissions and liability',
            'Cooperation vs. protection',
            'Long-term reputation'
          ]
        }
      ]
    },
    {
      id: 'clop-recovery',
      title: 'Recovery: Long-Term Implications',
      phase: 'recovery',
      duration: 45,
      objectives: [
        'Assess long-term impact and ongoing obligations',
        'Address regulatory findings and requirements',
        'Implement security improvements',
        'Plan for extended patient support'
      ],
      injects: [
        {
          id: 'clop-inj-015',
          title: 'Financial Impact Assessment',
          type: 'document',
          severity: 'high',
          triggerTime: 0,
          source: 'Chief Financial Officer',
          content: `BREACH FINANCIAL IMPACT ASSESSMENT
30-Day Post-Incident Analysis

Direct Response Costs (Incurred/Committed):

Notification and Communication:
- Printing and mailing: $3.2M
- Call center operations: $4.8M (month 1)
- Website and digital resources: $200K
- Media relations support: $500K
Subtotal: $8.7M

Forensics and Investigation:
- External IR firm: $1.2M
- Legal counsel (breach response): $2.1M
- Vendor forensics coordination: $300K
Subtotal: $3.6M

Credit/Identity Protection:
- Credit monitoring (enrolled): $7.2M (2 years)
- Identity theft insurance: $3.1M
- Identity restoration services: $500K (TBD)
Subtotal: $10.8M

Security Remediation (Immediate):
- System rebuilds/replacement: $2.4M
- Emergency security controls: $1.1M
- Additional monitoring: $800K
Subtotal: $4.3M

Total Direct Costs (30 days): $27.4M

Projected Additional Costs:

Regulatory:
- OCR settlement (estimated): $5-15M
- State AG settlements: $2-10M
- State-specific penalties: $1-5M
Subtotal: $8-30M

Litigation:
- Class action settlement (peer comparable): $50-150M
- Individual lawsuits: $5-20M
- Legal defense: $15-30M
Subtotal: $70-200M

Operational Impact:
- Patient volume decline: ~5% (observed)
- Revenue impact: ~$40M annually (if sustained)
- Recruitment challenges: Increasing
- Contract renegotiations: TBD

Cyber Insurance:
- Policy limit: $25M
- Expected recovery: $20-22M
- Uninsured exposure: Significant

3-Year Projected Total Cost: $150-300M

This is a material financial event requiring board and auditor notification.`,
          expectedActions: [
            'Brief board on financial exposure',
            'File insurance claims',
            'Establish litigation reserves',
            'Assess operational mitigation'
          ],
          facilitatorNotes: 'Healthcare breaches are extraordinarily expensive. Discuss how this financial impact shapes long-term decisions.'
        },
        {
          id: 'clop-inj-016',
          title: 'HHS OCR Settlement Discussion',
          type: 'communication',
          severity: 'high',
          triggerTime: 12,
          source: 'HHS OCR',
          content: `CONFIDENTIAL COMMUNICATION
HHS Office for Civil Rights

Subject: Resolution Agreement Discussion - [Health System]

Following our investigation and review of the CVE-2024-XXXXX breach affecting your organization, OCR would like to discuss a potential resolution agreement.

Preliminary Findings:

OCR has identified the following concerns:
1. Risk Analysis - Insufficient vendor security assessment
2. Business Associate Management - BA agreements did not adequately address security requirements
3. Contingency Planning - Incident response plan gaps
4. Audit Controls - Insufficient monitoring of file transfer activities

Mitigating Factors:
- Supply chain nature of attack
- Prompt notification once aware
- Cooperation with OCR
- Commitment to remediation
- Participation in sector coordination

OCR Proposal:

We are prepared to discuss a resolution agreement including:
- Monetary settlement: $8-12M range (negotiable)
- 3-year Corrective Action Plan
- Independent monitor for security program
- Annual compliance reporting
- No admission of liability

This is significantly reduced from what we would seek in litigation based on:
- 2.3M affected individuals
- Sensitive data categories
- Prior risk analysis findings

Benefits of Resolution:
- Avoids lengthy litigation
- Provides regulatory certainty
- Demonstrates accountability
- Allows focus on remediation

We believe early resolution is in everyone's interest given the circumstances. Please advise whether you wish to pursue settlement discussions.

This is without prejudice to any enforcement action if resolution is not achieved.`,
          expectedActions: [
            'Engage settlement counsel',
            'Assess resolution agreement terms',
            'Brief board on settlement option',
            'Consider strategic implications'
          ],
          facilitatorNotes: 'OCR settlement is common for large breaches. Discuss the trade-offs between settlement and defense.',
          decisionPoint: {
            question: 'How will you approach the OCR settlement discussion?',
            options: [
              {
                id: 'accept-negotiate',
                label: 'Accept and Negotiate',
                description: 'Engage in settlement negotiations, seek improved terms',
                consequence: 'Certainty and closure but monetary outlay and corrective action requirements'
              },
              {
                id: 'request-abeyance',
                label: 'Request Abeyance',
                description: 'Ask OCR to hold enforcement pending supply chain investigation conclusions',
                consequence: 'Buys time and may benefit from sector-wide findings but delays resolution'
              },
              {
                id: 'prepare-defense',
                label: 'Prepare for Litigation',
                description: 'Decline settlement, prepare to defend on supply chain causation',
                consequence: 'May prevail but expensive, lengthy, and uncertain outcome'
              }
            ]
          }
        },
        {
          id: 'clop-inj-017',
          title: 'Class Action Litigation Update',
          type: 'document',
          severity: 'high',
          triggerTime: 25,
          source: 'General Counsel',
          content: `CLASS ACTION LITIGATION STATUS
Confidential - Attorney-Client Privileged

Current Litigation:
- 14 class action complaints filed across 3 federal districts
- MDL motion pending (consolidation)
- Lead plaintiff competition underway

Claims Alleged:
- Negligence
- Breach of implied contract
- State consumer protection violations
- State data breach law violations
- HIPAA violations (private cause contested)

Class Definitions Proposed:
- All patients with PHI exposed
- Subclass: Sensitive data (HIV, mental health)
- Subclass: Identity theft victims
- Subclass: Medicare patients (SSN exposure)

Plaintiff Counsel:
Lead firms are experienced healthcare breach litigators. Settlement expectations will be informed by prior healthcare breaches:
- Anthem ($115M - 78M individuals)
- Premera ($74M - 11M individuals)
- Community Health ($157M - 28M individuals)
- Scaled comparison suggests: $100-200M range

Timeline:
- MDL decision: 60-90 days
- Class certification: 18-24 months
- Trial (if no settlement): 3-4 years
- Settlement most likely: After class certification

Our Position:
- Supply chain causation defense
- Lack of demonstrated harm (most plaintiffs)
- Compliance with security standards
- Prompt response once aware

Insurance:
- D&O coverage for executives: $50M
- Entity coverage: Limited in cyber policy
- Most exposure is uninsured

Board Concerns:
Several board members have received personal subpoenas. D&O counsel engaged.

Recommendation:
Prepare for lengthy litigation while remaining open to reasonable settlement post-class certification.`,
          expectedActions: [
            'Engage class action defense counsel',
            'Preserve relevant documents',
            'Brief board on litigation exposure',
            'Assess settlement strategy'
          ],
          facilitatorNotes: 'Class action exposure is massive. Discuss how litigation risk shapes organizational behavior and settlements.'
        },
        {
          id: 'clop-inj-018',
          title: 'Long-Term Security Program',
          type: 'document',
          severity: 'medium',
          triggerTime: 38,
          source: 'CISO',
          content: `SECURITY PROGRAM TRANSFORMATION
Post-Incident Strategic Plan

Lessons Learned Summary:

What Failed:
1. Vendor security assessment inadequate
2. File transfer system visibility limited
3. Sensitive data inventory incomplete
4. Segmentation allowed mass data access
5. Detection of exfiltration failed
6. Incident response plan gaps

What Worked:
- External IR engagement effective
- Regulatory notification timely
- Organizational coordination good
- Recovery executed successfully

Strategic Security Investments:

PHASE 1: Immediate Remediation (90 days)
- Zero-trust network architecture design
- Enhanced vendor risk management
- Data classification and mapping
- Sensitive data encryption at rest
Investment: $8M

PHASE 2: Detection Enhancement (Year 1)
- 24/7 security operations
- Healthcare-specific threat intelligence
- Advanced EDR/XDR deployment
- Cloud security posture management
Investment: $6M capital + $4M annual

PHASE 3: Program Maturity (Years 1-3)
- Privacy-by-design in systems
- Advanced data loss prevention
- Third-party risk continuous monitoring
- Regular penetration testing
- Security culture program
Investment: $10M over 3 years

Governance Changes:
- Board Cybersecurity Committee (new)
- CISO reports to CEO (changed)
- Quarterly security metrics to board
- Annual third-party assessment
- Tabletop exercises (quarterly)

Staffing:
- Security team expansion: +8 FTE
- Privacy team expansion: +4 FTE
- Annual cost: +$2.5M

3-Year Security Investment: ~$35M

Compare to Breach Cost: $150-300M

ROI Calculation:
If these investments prevent one similar breach, ROI is 4-8x.

Recommendation:
Board approval of 3-year security transformation program.

This incident changed everything. We cannot return to previous risk tolerance.`,
          expectedActions: [
            'Present transformation plan to board',
            'Secure multi-year commitment',
            'Establish implementation governance',
            'Define success metrics'
          ],
          facilitatorNotes: 'Post-incident security investment is critical but often fades. Discuss how to sustain commitment.'
        }
      ],
      discussionQuestions: [
        {
          id: 'clop-q-010',
          question: 'With total breach costs potentially reaching $150-300M, how do you justify and sustain the $35M security investment to prevent future incidents?',
          category: 'lessons_learned',
          suggestedTime: 10,
          keyPoints: [
            'ROI calculation and presentation',
            'Board education and engagement',
            'Multi-year commitment mechanisms',
            'Progress metrics and accountability',
            'Avoiding incident amnesia'
          ]
        },
        {
          id: 'clop-q-011',
          question: 'OCR is offering settlement while class action litigation is ongoing. How do you coordinate these parallel proceedings?',
          category: 'decision',
          suggestedTime: 10,
          keyPoints: [
            'Settlement precedent considerations',
            'Information sharing between proceedings',
            'Admission implications',
            'Resource allocation',
            'Strategic timing'
          ]
        },
        {
          id: 'clop-q-012',
          question: 'What are your key takeaways from this exercise? What changes will you advocate for in your organization?',
          category: 'lessons_learned',
          suggestedTime: 8,
          keyPoints: [
            'Personal action items',
            'Organizational changes needed',
            'Third-party risk management',
            'Patient communication',
            'Regulatory relationships'
          ]
        }
      ]
    }
  ],
  scenarioConfig: {
    timeDisplay: 'elapsed',
    defaultPhaseDuration: 45,
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

export const clopHealthcareScenario: LibraryEntry = {
  id: scenario.id,
  title: scenario.title,
  category: 'Ransomware',
  difficulty: scenario.difficulty,
  duration: scenario.estimatedDuration,
  description: scenario.description,
  tags: ['Cl0p', 'Healthcare', 'Mass Exploitation', 'Zero-Day', 'PHI', 'HIPAA', 'Supply Chain', 'Data Breach'],
  moduleCount,
  injectCount,
  questionCount,
  scenario
}
