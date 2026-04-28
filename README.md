<div align="center">

<!-- HERO BANNER -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00f5ff,50:ff006e,100:ffd700&height=200&section=header&text=SAMJHO%20SOCH%20SEEKHO&fontSize=42&fontColor=ffffff&fontAlignY=38&desc=Understand%20%C2%B7%20Think%20%C2%B7%20Learn&descAlignY=58&descSize=18&animation=fadeIn" width="100%"/>

<!-- BADGES -->
![TypeScript](https://img.shields.io/badge/TypeScript-96.8%25-00f5ff?style=for-the-badge&logo=typescript&logoColor=white&labelColor=0a0a0a)
![React](https://img.shields.io/badge/React-18.3+-ff006e?style=for-the-badge&logo=react&logoColor=white&labelColor=0a0a0a)
![Vite](https://img.shields.io/badge/Vite-5.4+-ffd700?style=for-the-badge&logo=vite&logoColor=white&labelColor=0a0a0a)
![License](https://img.shields.io/badge/License-MIT-00ff88?style=for-the-badge&labelColor=0a0a0a)
![Status](https://img.shields.io/badge/Status-Active_Dev-a855f7?style=for-the-badge&labelColor=0a0a0a)

<br/>

> **🎓 Learning by Building** — Upload documents, unlock AI-powered insights, ask questions in English or Hindi.
> Privacy-first. Client-side. Blazingly fast.

<br/>

[📖 Live Demo](https://lovable.dev/projects/1779ca2d-62a0-4d6f-8d40-9b38844ccc6d) &nbsp;·&nbsp;
[🐛 Report Bug](https://github.com/AshmitThakur23/samjho-soch-seekho/issues) &nbsp;·&nbsp;
[✨ Request Feature](https://github.com/AshmitThakur23/samjho-soch-seekho/issues) &nbsp;·&nbsp;
[👤 Author](https://github.com/AshmitThakur23)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🔄 Request Flow](#-request-flow)
- [⚡ Data Pipeline](#-data-pipeline)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [🔄 User Journey](#-user-journey)
- [🔐 Privacy & Security](#-privacy--security)
- [📈 Roadmap](#-roadmap)
- [🤝 Contributing](#-contributing)

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📄 Document Intelligence
- Upload **PDF, DOCX, TXT, Images**
- AI-powered content extraction & analysis
- Real-time parsing with **OCR** support
- Metadata preservation

</td>
<td width="50%">

### 🤖 Conversational AI
- Context-aware **Q&A chatbot**
- Multi-language: **English & Hindi**
- Natural language understanding
- Jargon → plain language translation

</td>
</tr>
<tr>
<td width="50%">

### 🚨 Risk Intelligence
- Auto-flagging of critical sections
- **Severity level** classification
- Actionable recommendations
- Prioritized next steps

</td>
<td width="50%">

### 🎙️ Voice & Accessibility
- **Speech-to-text** input
- **Text-to-speech** output
- Responsive: mobile · tablet · desktop
- WCAG-compliant components

</td>
</tr>
</table>

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph UI["🖥️ React UI Layer — Vite + Tailwind + shadcn/ui"]
        A[Components] --> B[State Management]
        B --> C[React Router]
    end

    subgraph SVC["⚙️ Service Layer — TypeScript"]
        D[documentService.ts]
        E[aiService.ts]
        F[languageService.ts]
        G[Cache Management]
    end

    subgraph DOC["📄 Document API"]
        H[PDF.js v4.8]
        I[Mammoth v1.8]
        J[Tesseract.js v5.1]
    end

    subgraph AI["🤖 AI Models"]
        K[NLP Engine]
        L[Summarizer]
        M[Risk Detector]
        N[Action Extractor]
    end

    subgraph LANG["🌐 Language API"]
        O[i18n Engine]
        P[EN → HI]
        Q[HI → EN]
    end

    UI -->|requests| SVC
    SVC --> DOC
    SVC --> AI
    SVC --> LANG

    style UI fill:#001a1a,stroke:#00f5ff,color:#00f5ff
    style SVC fill:#1a0010,stroke:#ff006e,color:#ff006e
    style DOC fill:#1a1500,stroke:#ffd700,color:#ffd700
    style AI fill:#001a0d,stroke:#00ff88,color:#00ff88
    style LANG fill:#0f0020,stroke:#a855f7,color:#a855f7
```

---

## 🔄 Request Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as 🖥️ Frontend
    participant BE as ⚙️ Backend
    participant LLM as 🤖 Local LLM
    participant WS as 🌐 Web Search

    User->>FE: Ask Question
    FE->>BE: POST /ask
    BE->>LLM: Query Mistral

    alt ✅ Confident Answer
        LLM-->>BE: Return Local Answer
        BE-->>FE: JSON Response
        FE-->>User: Render Answer + Sources
    else ❌ Needs Web Data
        BE->>WS: Playwright Search
        WS-->>BE: Search Results
        loop Apply Scoring Algorithm
            BE->>BE: Score & Rank Results
        end
        BE-->>FE: JSON Response
        FE-->>User: Render Answer + Sources
    end
```

---

## ⚡ Data Pipeline

```mermaid
flowchart LR
    A([📤 Upload\nPDF·DOCX\nTXT·IMG]) --> B{Validate\nType & Size}
    B -->|✅ Valid| C[Parse\nPDF.js\nMammoth\nTesseract]
    B -->|❌ Invalid| ERR([🚫 Error\nMessage])
    C --> D[Extract\nText Content]
    D --> E[AI Analysis\nNLP Engine]
    E --> F[Summarize]
    E --> G[Risk Detect]
    E --> H[Action Items]
    F & G & H --> I[Language\nProcessing\nEN ↔ HI]
    I --> J([📊 Output\nSummary·Risks\nActions·Q&A])

    style A fill:#001a1a,stroke:#00f5ff,color:#00f5ff
    style C fill:#1a0010,stroke:#ff006e,color:#ff006e
    style E fill:#001a0d,stroke:#00ff88,color:#00ff88
    style I fill:#0f0020,stroke:#a855f7,color:#a855f7
    style J fill:#001a1a,stroke:#00f5ff,color:#00f5ff
    style ERR fill:#1a0000,stroke:#ff006e,color:#ff006e
```

---

## 🛠️ Tech Stack

### Frontend Framework

| Tool | Version | Purpose |
|------|---------|---------|
| ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black&style=flat-square) **React** | `18.3+` | UI library with hooks & components |
| ![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=flat-square) **TypeScript** | `5.8+` | Type-safe JavaScript |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?logo=vite&logoColor=white&style=flat-square) **Vite** | `5.4+` | Ultra-fast build tool with HMR |

### Styling & Components

| Tool | Version | Purpose |
|------|---------|---------|
| ![Tailwind](https://img.shields.io/badge/-Tailwind-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square) **Tailwind CSS** | `3.4+` | Utility-first CSS framework |
| **shadcn/ui** | `latest` | Pre-built accessible components |
| **Lucide React** | `0.462+` | Icon library |

### Document Processing

| Library | Version | Purpose |
|---------|---------|---------|
| **PDF.js** | `4.8+` | PDF parsing & rendering |
| **Mammoth** | `1.8+` | DOCX document parsing |
| **Tesseract.js** | `5.1+` | OCR for scanned documents |

### AI & State Management

| Library | Version | Purpose |
|---------|---------|---------|
| **TanStack Query** | `5.83+` | Server state management |
| **Zod** | `3.25+` | Schema validation |
| **React Hook Form** | `7.61+` | Performant form handling |

---

## 📁 Project Structure

```
samjho-soch-seekho/
│
├── 📂 public/                  # Static assets
│
├── 📂 src/
│   ├── 📂 components/
│   │   ├── 📂 ui/              # shadcn/ui base components
│   │   ├── 📂 features/        # Feature-specific components
│   │   └── 📂 layout/          # Shell & layout components
│   │
│   ├── 📂 pages/               # Route-level page components
│   │
│   ├── 📂 services/
│   │   ├── 📄 documentService.ts   # PDF/DOCX parsing pipeline
│   │   ├── 📄 aiService.ts         # NLP, summarization, risk
│   │   └── 📄 languageService.ts   # EN ↔ HI translation
│   │
│   ├── 📂 hooks/               # Custom React hooks
│   ├── 📂 utils/               # Helper functions
│   ├── 📂 types/               # TypeScript type definitions
│   ├── 📄 App.tsx              # Root component
│   └── 📄 main.tsx             # Entry point
│
├── 📄 index.html               # HTML template
├── 📄 vite.config.ts           # Vite configuration
├── 📄 tailwind.config.ts       # Tailwind customization
├── 📄 tsconfig.json            # TypeScript config
└── 📄 package.json             # Dependencies & scripts
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18+ / **Bun** runtime
- **npm** v9+ · **yarn** v3+ · or **bun**
- **Git**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/AshmitThakur23/samjho-soch-seekho.git
cd samjho-soch-seekho

# 2. Install dependencies
npm install        # or: yarn install / bun install

# 3. Start development server → http://localhost:5173
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview

# 6. Lint
npm run lint
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:dev` | Build in development mode |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint checks |

---

## 🔄 User Journey

```mermaid
journey
    title Samjho Soch Seekho — User Flow
    section Setup
      Select Language EN/HI: 5: User
      Open App: 5: User
    section Document
      Upload Document: 5: User
      Wait for Processing: 3: User, System
      Review Auto Summary: 5: User
      Check Key Points: 5: User
    section Analysis
      Scan Risk Flags: 4: User
      Read Recommendations: 4: User
    section Interaction
      Ask Question via Text: 5: User
      Ask Question via Voice: 4: User
      Receive AI Answer: 5: System
    section Output
      Export Summary: 5: User
      Take Recommended Actions: 5: User
```

---

## 🔐 Privacy & Security

```mermaid
graph LR
    A([Your Document]) --> B[Client Browser]
    B --> C{Processing}
    C -->|✅ PDF.js| D[Local Parse]
    C -->|✅ Tesseract| E[Local OCR]
    C -->|✅ NLP| F[Local Analysis]
    D & E & F --> G([Results in UI])

    X([❌ External Server]) -.->|NEVER| B
    Y([❌ Cloud Storage]) -.->|NEVER| B

    style A fill:#001a1a,stroke:#00f5ff,color:#00f5ff
    style G fill:#001a0d,stroke:#00ff88,color:#00ff88
    style X fill:#1a0000,stroke:#ff006e,color:#ff0000
    style Y fill:#1a0000,stroke:#ff006e,color:#ff0000
```

| Feature | Status |
|---------|--------|
| 🔒 No Data Collection | ✅ Documents analyzed in-session only |
| 💻 Client-Side Processing | ✅ All computation on your device |
| 🚫 No Server Storage | ✅ Data never leaves your browser |
| 🛡️ Encryption Ready | ✅ Security-first architecture |

---

## 📈 Roadmap

```mermaid
gantt
    title Samjho Soch Seekho — Development Phases
    dateFormat  YYYY-MM
    section Phase 1 ✅
    Document Upload & Parsing     :done,    p1a, 2025-10, 2025-11
    Basic AI Summarization        :done,    p1b, 2025-11, 2025-12
    English / Hindi Support       :done,    p1c, 2025-12, 2026-01
    Q&A Functionality             :done,    p1d, 2026-01, 2026-02
    section Phase 2 🚧
    Advanced Risk Assessment      :active,  p2a, 2026-03, 2026-05
    Domain-Specific Training      :active,  p2b, 2026-04, 2026-06
    Batch Processing              :         p2c, 2026-05, 2026-07
    Multi-Format Export           :         p2d, 2026-06, 2026-08
    section Phase 3 📋
    Mobile App iOS/Android        :         p3a, 2026-08, 2026-12
    Browser Extension             :         p3b, 2026-09, 2026-11
    Third-Party API               :         p3c, 2026-10, 2027-01
    Analytics Dashboard           :         p3d, 2026-11, 2027-02
```

---

## 🤝 Contributing

```bash
# 1. Fork the repo, then clone your fork
git clone https://github.com/YOUR_USERNAME/samjho-soch-seekho.git

# 2. Create a feature branch
git checkout -b feature/amazing-feature

# 3. Make your changes, then commit
git commit -m 'feat: add amazing feature'

# 4. Push to your branch
git push origin feature/amazing-feature

# 5. Open a Pull Request on GitHub
```

### We need help with

- 🐛 Bug fixes & performance improvements
- 📝 Documentation updates
- 🎨 UI/UX enhancements
- 🌐 Additional language support
- ♿ Accessibility improvements
- 🧪 Test coverage expansion

---

## 📝 License

```
MIT License — Copyright (c) 2026 Ashmit Thakur

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files, to deal in the Software
without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies.
```

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:ffd700,50:ff006e,100:00f5ff&height=120&section=footer&animation=fadeIn" width="100%"/>

**Made with 💙 by [Ashmit Thakur](https://github.com/AshmitThakur23)**

⭐ Star this repo · 🐛 Report issues · 🤝 Contribute · 📢 Share

![Visitors](https://visitor-badge.laobi.icu/badge?page_id=AshmitThakur23.samjho-soch-seekho&style=for-the-badge)

</div>
