import type { LibraryEntry } from '../library'

export const ransomwareHealthcareScenario: LibraryEntry = {
  id: 'ransomware-healthcare-001',
  title: 'Ransomware Attack: Regional Healthcare Provider',
  category: 'ransomware',
  difficulty: 'intermediate',
  duration: 120,
  description: 'A regional healthcare organization discovers ransomware spreading across their network, encrypting patient records, disrupting clinical systems, and threatening patient care. This exercise explores incident response, communication, and recovery decisions under pressure.',
  tags: ['ransomware', 'healthcare', 'HIPAA', 'incident-response', 'data-breach', 'crisis-communication'],
  moduleCount: 5,
  injectCount: 11,
  questionCount: 9,
  scenario: {
    id: 'ransomware-healthcare-001',
    title: 'Ransomware Attack: Regional Healthcare Provider',
    description: 'A regional healthcare organization discovers ransomware spreading across their network, encrypting patient records, disrupting clinical systems, and threatening patient care. This exercise explores incident response, communication, and recovery decisions under pressure.',
    version: '1.0.0',
    author: 'Keith',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    threatCategory: 'ransomware',
    difficulty: 'intermediate',
    estimatedDuration: 120,
    targetAudience: ['IT Security', 'Executive Leadership', 'Legal/Compliance', 'Communications', 'Clinical Operations'],
    objectives: [
      'Practice coordinated incident response across technical and business teams',
      'Evaluate decision-making under time pressure with patient safety implications',
      'Test communication protocols with stakeholders, regulators, and media',
      'Identify gaps in ransomware response procedures and recovery capabilities'
    ],
    facilitatorGuide: {
      id: 'fg-ransomware-healthcare-001',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      title: 'Facilitator Guide - Ransomware Healthcare Scenario',
      type: 'facilitator_guide',
      format: 'markdown',
      content: 'This scenario is designed to escalate tension gradually. Start with Module 1 to establish context, then increase pressure through each subsequent module. Key decision points include: whether to pay ransom, when to notify regulators, and how to maintain patient care.'
    },
    additionalMaterials: [],
    settings: {
      allowParticipantSkip: false,
      requireAllResponses: true,
      showInjectTimestamps: true,
      enableAnonymousResponses: false
    },
    modules: [
      {
        id: 'mod-1-detection',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        title: 'Initial Detection',
        description: 'The IT security team receives alerts indicating potential ransomware activity on the network.',
        phase: 'detection',
        order: 1,
        suggestedDuration: 20,
        facilitatorNotes: 'Set the scene carefully. Participants should feel the initial confusion and urgency of a real incident.',
        injects: [
          {
            id: 'inj-1-1',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 1,
            title: 'SIEM Alert - Unusual Encryption Activity',
            content: 'Your SIEM system has generated a HIGH priority alert:\n\nMultiple Windows servers in the CLINICAL-EAST subnet are showing unusual file system activity. Large volumes of files are being accessed and modified rapidly. File extensions are being changed to \'.locked\'.\n\nAffected Systems:\n- EHRSERVER-02 (Electronic Health Records)\n- FILESVR-CLINICAL-01\n- IMGARCHIVE-03 (Medical Imaging)\n\nPattern matches known ransomware behavior signatures.',
            type: 'information',
            severity: 'high',
            triggerTime: 0,
            source: 'IT Security Operations Center',
            facilitatorNotes: 'This is the opening inject. Give participants time to absorb the information.',
            expectedActions: ['Acknowledge the alert', 'Activate incident response procedures', 'Begin isolating affected systems'],
            attachments: [],
            relatedQuestionIds: ['q-1-1']
          },
          {
            id: 'inj-1-2',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 2,
            title: 'Help Desk Calls Spike',
            content: 'The IT Help Desk reports a sudden surge in calls from clinical staff on floors 3, 4, and 5 of the East building. They\'re reporting that they can\'t access patient files - getting errors about files being encrypted. Some workstations are displaying a message about paying Bitcoin.',
            type: 'information',
            severity: 'high',
            triggerTime: 5,
            source: 'IT Help Desk Supervisor',
            attachments: [],
            relatedQuestionIds: []
          },
          {
            id: 'inj-1-3',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 3,
            title: 'Ransom Note Discovered',
            content: 'ATTENTION MERCY REGIONAL HEALTH SYSTEM\n\nAll your files have been encrypted with military-grade encryption. Your patient records, financial data, and operational systems are now locked.\n\nTo recover your data, you must pay 75 Bitcoin (approximately $3.2 million USD) within 72 hours.\n\nIf you do not pay:\n- The ransom doubles to 150 Bitcoin\n- After 7 days, all data will be permanently deleted\n- We will publish sensitive patient data on our leak site\n\n- DarkSide Collective',
            type: 'escalation',
            severity: 'critical',
            triggerTime: 10,
            source: 'Screenshot from affected workstation',
            facilitatorNotes: 'This is a major escalation point. The threat to publish patient data adds HIPAA concerns.',
            attachments: [],
            relatedQuestionIds: ['q-1-2']
          }
        ],
        discussionQuestions: [
          {
            id: 'q-1-1',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 1,
            question: 'What is your immediate priority: containing the spread or preserving evidence for investigation?',
            category: 'decision',
            context: 'These priorities can sometimes conflict. Rapid containment may destroy forensic evidence.',
            responseType: 'text',
            guidanceNotes: 'This is a classic incident response tension. Most experts recommend prioritizing containment for active ransomware.',
            expectedThemes: ['Containment priority', 'Balance needed', 'Evidence preservation importance']
          },
          {
            id: 'q-1-2',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 2,
            question: 'At what point should you notify the CEO and Board of Directors?',
            category: 'communication',
            responseType: 'text',
            guidanceNotes: 'Executive notification timing varies by organization.',
            expectedThemes: ['Immediate notification', 'Gather facts first', 'Defined escalation criteria']
          }
        ]
      },
      {
        id: 'mod-2-containment',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        title: 'Containment & Scope Assessment',
        description: 'The incident response team works to contain the spread while assessing the full scope of the compromise.',
        phase: 'containment',
        order: 2,
        suggestedDuration: 25,
        facilitatorNotes: 'This module introduces the tension between IT response and clinical operations.',
        injects: [
          {
            id: 'inj-2-1',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 1,
            title: 'Network Isolation Decision',
            content: 'The IT Security team presents options for network containment:\n\nOption A: Full network isolation - Will stop ransomware but disable ALL clinical systems\nOption B: Targeted isolation - Maintains some clinical availability but risk of spread\nOption C: Monitor and contain - Highest risk but least disruption\n\nThe CISO needs a decision in the next 10 minutes.',
            type: 'decision_point',
            severity: 'critical',
            triggerTime: 0,
            source: 'CISO',
            attachments: [],
            relatedQuestionIds: ['q-2-1']
          },
          {
            id: 'inj-2-2',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 2,
            title: 'Clinical Impact Report',
            content: 'The Chief Medical Officer provides a clinical impact assessment:\n\n- ICU (32 patients): Life support functioning but lost remote monitoring\n- Emergency Department: 18 patients, can\'t access medical histories\n- Surgery: 6 procedures scheduled, surgical planning system is down\n- Pharmacy: Automated dispensing offline, manual verification tripling time\n\nShould we divert ambulances? Cancel elective procedures?',
            type: 'information',
            severity: 'critical',
            triggerTime: 8,
            source: 'Chief Medical Officer',
            attachments: [],
            relatedQuestionIds: ['q-2-1']
          },
          {
            id: 'inj-2-3',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 3,
            title: 'Forensic Discovery - Data Exfiltration',
            content: 'The incident response team has discovered large data transfers to an external IP over the past 4 days. Approximately 400GB of data was transferred from servers containing patient records, medical records, and employee HR files.\n\nThis is now also a data breach.',
            type: 'information',
            severity: 'critical',
            triggerTime: 15,
            source: 'Incident Response Team Lead',
            attachments: [],
            relatedQuestionIds: ['q-2-2']
          }
        ],
        discussionQuestions: [
          {
            id: 'q-2-1',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 1,
            question: 'The CMO is asking whether to divert ambulances. Who has the authority to make this decision?',
            category: 'decision',
            responseType: 'text',
            guidanceNotes: 'In most healthcare organizations, clinical leadership has final say on patient care decisions.'
          },
          {
            id: 'q-2-2',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 2,
            question: 'You\'ve confirmed data exfiltration. Under HIPAA, when does your notification clock start?',
            category: 'policy',
            responseType: 'text',
            guidanceNotes: 'HIPAA requires notification within 60 days of discovery.'
          }
        ]
      },
      {
        id: 'mod-3-external',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        title: 'External Communications',
        description: 'Managing communications with regulators, law enforcement, media, and the public.',
        phase: 'containment',
        order: 3,
        suggestedDuration: 25,
        facilitatorNotes: 'This module tests communication and coordination skills.',
        injects: [
          {
            id: 'inj-3-1',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 1,
            title: 'FBI Contact',
            content: 'The FBI Cyber Division offers assistance: threat intelligence, potential decryption keys from previous investigations, and guidance on ransom negotiation. They request copies of ransom notes and network logs.',
            type: 'communication',
            severity: 'medium',
            triggerTime: 0,
            source: 'FBI Cyber Division',
            attachments: [],
            relatedQuestionIds: ['q-3-1']
          },
          {
            id: 'inj-3-2',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 2,
            title: 'Media Inquiry',
            content: 'A local TV reporter is asking for comment on the "major cyberattack" at your hospital. They\'re planning to run a story on the 6 PM news. They want to know: Is patient data at risk? Are patients safe? Are you paying a ransom?',
            type: 'communication',
            severity: 'high',
            triggerTime: 8,
            source: 'Communications Director',
            attachments: [],
            relatedQuestionIds: ['q-3-2']
          }
        ],
        discussionQuestions: [
          {
            id: 'q-3-1',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 1,
            question: 'Should you engage with the FBI? What are the benefits and risks?',
            category: 'coordination',
            responseType: 'text',
            guidanceNotes: 'FBI can provide valuable threat intelligence. Law enforcement engagement is generally recommended.'
          },
          {
            id: 'q-3-2',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 2,
            question: 'Draft your key messages for the media inquiry.',
            category: 'communication',
            responseType: 'text',
            guidanceNotes: 'Focus on: what you know, what you\'re doing, patient safety. Avoid speculation.'
          }
        ]
      },
      {
        id: 'mod-4-ransom',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        title: 'The Ransom Decision',
        description: 'Leadership must decide whether to pay the ransom demand.',
        phase: 'eradication',
        order: 4,
        suggestedDuration: 25,
        facilitatorNotes: 'This is often the most contentious module. Allow robust debate.',
        injects: [
          {
            id: 'inj-4-1',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 1,
            title: 'Ransom Negotiation Update',
            content: 'Through a third-party negotiator, initial contact has been made:\n\n- Original demand: 75 Bitcoin ($3.2M)\n- Current negotiated: 45 Bitcoin ($1.9M)\n- They provided proof they can decrypt sample files\n- Average decryption success rate: ~85%\n\nDecision needed within 12 hours.',
            type: 'decision_point',
            severity: 'critical',
            triggerTime: 0,
            source: 'Ransomware Negotiation Firm',
            attachments: [],
            relatedQuestionIds: ['q-4-1']
          },
          {
            id: 'inj-4-2',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 2,
            title: 'Recovery Without Payment',
            content: 'IT estimates recovery timeline without paying:\n\n- Last full backup: 8 days ago\n- Critical systems recovery: 2-3 weeks\n- Full restoration: 8-12 weeks\n- Data loss: 8 days of patient records (~3,200 visits)\n- Lost revenue during downtime: $2-4M',
            type: 'information',
            severity: 'high',
            triggerTime: 5,
            source: 'IT Director',
            attachments: [],
            relatedQuestionIds: ['q-4-1']
          }
        ],
        discussionQuestions: [
          {
            id: 'q-4-1',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 1,
            question: 'Should you pay the ransom? What factors are most important in your decision?',
            category: 'decision',
            context: 'Consider: patient safety, financial impact, legal implications, ethical considerations.',
            responseType: 'text',
            guidanceNotes: 'This is THE central question. Both positions have merit. Focus on the decision FRAMEWORK.'
          }
        ]
      },
      {
        id: 'mod-5-recovery',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        title: 'Recovery & Lessons Learned',
        description: 'Rebuilding systems and capturing lessons learned.',
        phase: 'recovery',
        order: 5,
        suggestedDuration: 20,
        facilitatorNotes: 'This final module shifts focus to recovery and improvement.',
        injects: [
          {
            id: 'inj-5-1',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 1,
            title: 'Recovery Progress',
            content: '72 hours since incident began:\n\n- Core infrastructure: RESTORED\n- EHR: PARTIAL (read-only historical data)\n- Emergency Department: OPEN\n- Surgeries: RESUMING\n- Ambulance diversion: ENDED\n\nFull recovery still weeks away.',
            type: 'information',
            severity: 'medium',
            triggerTime: 0,
            source: 'Incident Commander',
            attachments: [],
            relatedQuestionIds: ['q-5-1', 'q-5-2']
          }
        ],
        discussionQuestions: [
          {
            id: 'q-5-1',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 1,
            question: 'What worked well in your response? What would you do differently?',
            category: 'lessons_learned',
            responseType: 'text',
            guidanceNotes: 'Encourage honest reflection. Both successes and failures are learning opportunities.'
          },
          {
            id: 'q-5-2',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 2,
            question: 'What changes to your incident response plan will you make based on this exercise?',
            category: 'lessons_learned',
            responseType: 'text',
            guidanceNotes: 'Push for specific, actionable improvements.'
          }
        ]
      }
    ],
    tags: ['ransomware', 'healthcare', 'HIPAA', 'incident-response', 'data-breach']
  }
}
