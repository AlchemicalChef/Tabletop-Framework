# CTEP Tabletop Framework

A desktop application for creating and running cybersecurity tabletop exercises based on CISA's Cybersecurity Tabletop Exercise Package (CTEP) format.

Built for security teams, incident responders, and risk managers who want to practice their response procedures in a structured, scenario-driven environment.

## Features

### Scenario Authoring
- Create custom tabletop exercises from scratch
- Define modules representing incident response phases (detection, containment, recovery, etc.)
- Add timed injects that drive decision-making
- Write discussion questions with facilitator guidance notes
- Set difficulty levels, duration estimates, and learning objectives

### Exercise Runner
- Real-time facilitation controls (start, pause, advance)
- Module and total elapsed time tracking
- Progress visualization across all modules and injects
- Facilitator notes panel for guidance during exercise
- Response collection from participants

### Participant Portal
- Load participant packages for async participation
- Answer discussion questions offline
- Export responses for facilitator import
- Sanitized view (no facilitator notes visible)

### Scenario Library
8 pre-built scenarios based on real-world threat intelligence:

| Scenario | Category | Difficulty | Duration |
|----------|----------|------------|----------|
| Ransomware Attack: Regional Healthcare Provider | Ransomware | Intermediate | 120 min |
| Business Email Compromise: CEO Fraud | Phishing | Beginner | 90 min |
| CISA CTEP: Ransomware Attack | Ransomware | Intermediate | 180 min |
| CISA CTEP: Vendor Supply Chain Compromise | Supply Chain | Advanced | 180 min |
| CISA CTEP: Open Source Software Vulnerability | Supply Chain | Advanced | 180 min |
| ScatteredSpider Social Engineering Attack | Social Engineering | Advanced | 180 min |
| ShinyHunters Cloud Data Breach | Data Breach | Advanced | 150 min |
| REvil Supply Chain Ransomware Attack | Supply Chain | Advanced | 180 min |

## Tech Stack

- **Electron** - Cross-platform desktop application
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Zustand** - State management with persistence
- **Vite** - Build tooling (electron-vite)

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/Tabletop-Framework.git
cd Tabletop-Framework

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building

```bash
# Build for production
npm run build

# Package for distribution
npm run package

# Platform-specific packaging
npm run package:win    # Windows (NSIS installer + portable)
npm run package:mac    # macOS (DMG + ZIP)
npm run package:linux  # Linux (AppImage + DEB)
```

## Exercise Workflow

### For Facilitators

1. **Create or Select Scenario**
   - Build a custom scenario in the Scenario Author
   - Or select a pre-built scenario from the Library

2. **Export Participant Packages**
   - From Exercise Runner, click "Export Packages"
   - Add participant names and export individual `.ctep-participant.json` files
   - Distribute files to participants

3. **Run the Exercise**
   - Start the timer and advance through injects
   - Use facilitator notes for guidance
   - Collect responses in real-time or import async responses

4. **Generate After-Action Report**
   - Review all responses
   - Generate AAR summary when exercise completes

### For Participants

1. **Open Participant Portal**
   - Load the `.ctep-participant.json` file you received

2. **Review & Respond**
   - Read through the scenario and injects
   - Answer discussion questions

3. **Submit Responses**
   - Export your responses as a `.ctep-response.json` file
   - Send the file back to your facilitator

## File Formats

| Extension | Purpose |
|-----------|---------|
| `.ctep.json` | Scenario definition (full, with facilitator notes) |
| `.ctep-participant.json` | Participant package (sanitized, no facilitator content) |
| `.ctep-response.json` | Participant response submission |

All files include checksums for integrity verification.

## Project Structure

```
tabletop-framework/
├── electron/              # Electron main process
│   ├── main.ts            # App entry, window management, menus
│   └── preload.ts         # IPC bridge (file dialogs, file I/O)
├── src/
│   ├── components/        # React components
│   │   ├── exercise/      # Exercise runner components
│   │   └── scenario/      # Scenario authoring components
│   ├── data/
│   │   └── scenarios/     # Pre-built scenario definitions
│   ├── pages/             # Main application pages
│   ├── stores/            # Zustand state stores
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions (export, validation)
│   └── styles/            # CSS styles
└── package.json
```

## CTEP Exercise Structure

Exercises follow the CISA CTEP format:

```
Scenario
├── Metadata (title, author, difficulty, duration, objectives)
├── Threat Category (ransomware, phishing, supply_chain, etc.)
└── Modules (incident response phases)
    ├── Injects (timed events with severity levels)
    │   ├── Content (scenario text)
    │   ├── Facilitator Notes (hidden from participants)
    │   └── Expected Actions
    └── Discussion Questions
        ├── Question text
        ├── Response type (text, multiple choice, rating)
        └── Facilitator guidance
```

## Resources

- [CISA Tabletop Exercise Packages](https://www.cisa.gov/resources-tools/services/cisa-tabletop-exercise-packages)
- [HSEEP Guidelines](https://www.fema.gov/emergency-managers/national-preparedness/exercises/hseep)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

## Author

Keith (AlchemicalChef)

## License

MIT License - See [LICENSE](LICENSE) for details.
