import type { LibraryEntry } from '../library'

export const becCeoFraudScenario: LibraryEntry = {
  id: 'bec-ceo-fraud-001',
  title: 'Business Email Compromise: CEO Fraud',
  category: 'phishing',
  difficulty: 'beginner',
  duration: 90,
  description: 'A finance department employee receives a convincing email appearing to be from the CEO, requesting an urgent wire transfer to a new vendor. This exercise explores social engineering defenses, verification procedures, and incident response when financial fraud is discovered.',
  tags: ['BEC', 'CEO-fraud', 'social-engineering', 'wire-fraud', 'phishing', 'financial'],
  moduleCount: 4,
  injectCount: 7,
  questionCount: 9,
  scenario: {
    id: 'bec-ceo-fraud-001',
    title: 'Business Email Compromise: CEO Fraud',
    description: 'A finance department employee receives a convincing email appearing to be from the CEO, requesting an urgent wire transfer to a new vendor.',
    version: '1.0.0',
    author: 'Keith',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    threatCategory: 'phishing',
    difficulty: 'beginner',
    estimatedDuration: 90,
    targetAudience: ['Finance/Accounting', 'Executive Leadership', 'IT Security', 'Legal'],
    objectives: [
      'Recognize the hallmarks of business email compromise attacks',
      'Practice verification procedures for financial requests',
      'Understand the urgency and pressure tactics used by attackers',
      'Test incident response procedures for financial fraud'
    ],
    facilitatorGuide: {
      id: 'fg-bec-ceo-fraud-001',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z',
      title: 'Facilitator Guide - BEC CEO Fraud Scenario',
      type: 'facilitator_guide',
      format: 'markdown',
      content: 'This scenario is designed for organizations new to tabletop exercises. Focus on the human factors - the pressure, the urgency, and how social engineering exploits trust and authority.'
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
        id: 'mod-1-initial',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        title: 'The Urgent Request',
        description: 'A finance employee receives an urgent email from the "CEO" requesting a wire transfer.',
        phase: 'detection',
        order: 1,
        suggestedDuration: 20,
        facilitatorNotes: 'Set the scene carefully. The email should feel realistic.',
        injects: [
          {
            id: 'bec-inj-1-1',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 1,
            title: 'Email from "CEO" Arrives',
            content: 'Sarah Chen, Accounts Payable Specialist, receives the following email at 4:47 PM on Friday:\n\nFrom: David Morrison <david.morrison@acme-corp.co>\nSubject: URGENT - Confidential Wire Transfer\n\nSarah,\n\nI need you to process an urgent wire transfer today. This is for a confidential acquisition. Amount: $287,500.\n\nThis is extremely time-sensitive. Process immediately and confirm. Do NOT discuss with anyone.\n\nI\'m in meetings and can\'t take calls.\n\nDavid Morrison, CEO',
            type: 'information',
            severity: 'high',
            triggerTime: 0,
            source: 'Suspicious Email',
            facilitatorNotes: 'Point out subtle red flags: the slightly different domain (.co vs .com), Friday afternoon timing, pressure not to verify.',
            attachments: [],
            relatedQuestionIds: ['bec-q-1-1']
          },
          {
            id: 'bec-inj-1-2',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 2,
            title: 'Follow-up Pressure',
            content: 'Sarah receives a follow-up 15 minutes later:\n\n"Sarah, I haven\'t received confirmation. Is there a problem? The other party is getting nervous. I chose you because I heard you\'re reliable. Please confirm NOW."',
            type: 'escalation',
            severity: 'high',
            triggerTime: 8,
            source: 'Follow-up Email',
            facilitatorNotes: 'Note the emotional manipulation - flattery, fear, and urgency.',
            attachments: [],
            relatedQuestionIds: ['bec-q-1-3']
          }
        ],
        discussionQuestions: [
          {
            id: 'bec-q-1-1',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 1,
            question: 'What red flags should Sarah have noticed in the initial email?',
            category: 'technical',
            responseType: 'text',
            guidanceNotes: 'Key red flags: domain spoofing, Friday timing, demand for secrecy, no previous direct contact from CEO, pressure to bypass procedures.'
          },
          {
            id: 'bec-q-1-2',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 2,
            question: 'What verification procedures should exist for large wire transfers?',
            category: 'policy',
            responseType: 'text',
            guidanceNotes: 'Best practices: callback verification to known numbers, dual authorization, waiting periods for new beneficiaries.'
          },
          {
            id: 'bec-q-1-3',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 3,
            question: 'Why do these attacks work on smart, careful people?',
            category: 'decision',
            responseType: 'text',
            guidanceNotes: 'Psychological factors: authority, urgency, social proof, fear, isolation.'
          }
        ]
      },
      {
        id: 'mod-2-verification',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        title: 'Verification & Investigation',
        description: 'Attempting to verify the request reveals more about the attack.',
        phase: 'detection',
        order: 2,
        suggestedDuration: 20,
        facilitatorNotes: 'This module shows what happens when verification is attempted.',
        injects: [
          {
            id: 'bec-inj-2-1',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 1,
            title: 'Verification Success',
            content: 'Sarah calls the CEO\'s mobile from the company directory:\n\nCEO: "Wire transfer? I haven\'t sent any wire transfer requests today. That\'s not from me. Do NOT process anything. This sounds like a scam. Get IT Security involved. Good job catching this, Sarah."',
            type: 'information',
            severity: 'medium',
            triggerTime: 0,
            source: 'Phone Verification',
            attachments: [],
            relatedQuestionIds: []
          },
          {
            id: 'bec-inj-2-2',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 2,
            title: 'Investigation Findings',
            content: 'IT Security Investigation:\n\n- Email from domain "acme-corp.co" (registered 3 days ago)\n- Attacker knew CEO\'s name, Sarah\'s role, company M&A activity\n- Similar emails sent to two other AP staff\n- Source of intel: public org chart, CEO\'s LinkedIn travel post, supervisor\'s out-of-office',
            type: 'information',
            severity: 'medium',
            triggerTime: 10,
            source: 'IT Security Team',
            attachments: [],
            relatedQuestionIds: ['bec-q-2-1']
          }
        ],
        discussionQuestions: [
          {
            id: 'bec-q-2-1',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 1,
            question: 'How did the attacker know so much about your organization?',
            category: 'technical',
            responseType: 'text',
            guidanceNotes: 'Attackers use OSINT: LinkedIn, company websites, SEC filings, social media, out-of-office messages.'
          },
          {
            id: 'bec-q-2-2',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 2,
            question: 'Should you report this to law enforcement even though no money was lost?',
            category: 'policy',
            responseType: 'text',
            guidanceNotes: 'Yes - FBI IC3 reports help build cases and identify trends.'
          }
        ]
      },
      {
        id: 'mod-3-prevention',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        title: 'Strengthening Defenses',
        description: 'Implementing controls to prevent future BEC attacks.',
        phase: 'recovery',
        order: 3,
        suggestedDuration: 20,
        facilitatorNotes: 'This module focuses on prevention and improvement.',
        injects: [
          {
            id: 'bec-inj-3-1',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 1,
            title: 'CFO Requests Action Plan',
            content: 'The CFO wants an action plan covering:\n\n1. Immediate actions (this week)\n2. Short-term improvements (30 days)\n3. Verification procedures for unusual requests\n4. Training plan for finance employees\n\nTo be presented to the Board Audit Committee next week.',
            type: 'information',
            severity: 'low',
            triggerTime: 0,
            source: 'CFO',
            attachments: [],
            relatedQuestionIds: ['bec-q-3-1', 'bec-q-3-2']
          }
        ],
        discussionQuestions: [
          {
            id: 'bec-q-3-1',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 1,
            question: 'Will executives actually follow verification procedures when they\'re in a hurry?',
            category: 'policy',
            responseType: 'text',
            guidanceNotes: 'This is the key question. Controls fail when leaders bypass them.'
          },
          {
            id: 'bec-q-3-2',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 2,
            question: 'What would you do differently in your organization based on this scenario?',
            category: 'lessons_learned',
            responseType: 'text',
            guidanceNotes: 'Push for specific, actionable commitments.'
          }
        ]
      },
      {
        id: 'mod-4-fraud-occurred',
        createdAt: '2024-01-15T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        title: 'The Wire Was Sent (Alternate)',
        description: 'Optional module exploring what happens when the fraudulent wire is processed.',
        phase: 'containment',
        order: 4,
        suggestedDuration: 25,
        facilitatorNotes: 'This is an ALTERNATE scenario. Use if you want to explore response to successful fraud.',
        injects: [
          {
            id: 'bec-inj-4-1',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 1,
            title: 'Fraud Discovered Monday',
            content: 'Monday morning: Sarah realizes she may have been scammed. She calls the CEO\'s real number:\n\nCEO: "What wire transfer? I never sent that. How much? $287,500? This isn\'t your fault - these scams are sophisticated. But we need to act fast. Call the bank NOW."',
            type: 'escalation',
            severity: 'critical',
            triggerTime: 0,
            source: 'Scenario',
            attachments: [],
            relatedQuestionIds: ['bec-q-4-1']
          },
          {
            id: 'bec-inj-4-2',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 2,
            title: 'Bank Response',
            content: 'Bank Wire Fraud Hotline: "The wire was processed Friday at 4:52 PM and settled same day. We\'ll initiate a recall request, but success rates after 24 hours are very low. In BEC cases, funds are typically moved within hours, often overseas. You should contact FBI IC3, your cyber insurance, and legal counsel."',
            type: 'information',
            severity: 'critical',
            triggerTime: 5,
            source: 'Bank',
            attachments: [],
            relatedQuestionIds: ['bec-q-4-2']
          }
        ],
        discussionQuestions: [
          {
            id: 'bec-q-4-1',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 1,
            question: 'Should Sarah be fired? What factors should influence this decision?',
            category: 'decision',
            responseType: 'text',
            guidanceNotes: 'Consider: Was this a systemic failure or individual failure? What message does firing send?'
          },
          {
            id: 'bec-q-4-2',
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            order: 2,
            question: 'What is the true cost of this incident beyond the $287K?',
            category: 'resource',
            responseType: 'text',
            guidanceNotes: 'Hidden costs: investigation time, legal fees, insurance deductible, morale, process redesign.'
          }
        ]
      }
    ],
    tags: ['BEC', 'CEO-fraud', 'social-engineering', 'wire-fraud', 'phishing']
  }
}
