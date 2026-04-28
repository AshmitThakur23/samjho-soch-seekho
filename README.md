<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Samjho Soch Seekho — README</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #020408;
    --bg2: #050c14;
    --cyan: #00f5ff;
    --cyan2: #00bcd4;
    --pink: #ff006e;
    --gold: #ffd700;
    --green: #00ff88;
    --purple: #a855f7;
    --white: #e8f4f8;
    --dim: #4a6070;
    --card: rgba(0,245,255,0.04);
    --border: rgba(0,245,255,0.15);
    --glow: 0 0 20px rgba(0,245,255,0.4), 0 0 40px rgba(0,245,255,0.15);
    --glow-pink: 0 0 20px rgba(255,0,110,0.5), 0 0 40px rgba(255,0,110,0.2);
    --glow-gold: 0 0 20px rgba(255,215,0,0.4), 0 0 40px rgba(255,215,0,0.15);
  }
 
  * { margin: 0; padding: 0; box-sizing: border-box; }
 
  html { scroll-behavior: smooth; }
 
  body {
    background: var(--bg);
    color: var(--white);
    font-family: 'Rajdhani', sans-serif;
    font-size: 16px;
    line-height: 1.7;
    overflow-x: hidden;
  }
 
  /* ─── GRID BACKGROUND ─── */
  body::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(0,245,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,245,255,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }
 
  /* ─── SCAN LINE ─── */
  body::after {
    content: '';
    position: fixed; top: -100%; left: 0; right: 0; height: 200px;
    background: linear-gradient(transparent, rgba(0,245,255,0.04), transparent);
    animation: scan 8s linear infinite;
    pointer-events: none;
    z-index: 1;
  }
  @keyframes scan { to { top: 110%; } }
 
  .wrapper {
    position: relative;
    z-index: 2;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 24px;
  }
 
  /* ─── HERO ─── */
  .hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    padding: 60px 24px;
  }
 
  .hero-glow-orb {
    position: absolute;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(0,245,255,0.08) 0%, transparent 70%);
    border-radius: 50%;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    animation: pulse-orb 4s ease-in-out infinite;
  }
  @keyframes pulse-orb {
    0%,100% { transform: translate(-50%,-50%) scale(1); opacity: 0.5; }
    50% { transform: translate(-50%,-50%) scale(1.1); opacity: 1; }
  }
 
  .badge-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-bottom: 32px;
    animation: fadeUp 0.8s ease both;
  }
  .badge {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    padding: 4px 12px;
    border: 1px solid var(--border);
    color: var(--cyan);
    background: rgba(0,245,255,0.06);
    letter-spacing: 0.1em;
    clip-path: polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
  }
  .badge.pink { color: var(--pink); border-color: rgba(255,0,110,0.3); background: rgba(255,0,110,0.06); }
  .badge.gold { color: var(--gold); border-color: rgba(255,215,0,0.3); background: rgba(255,215,0,0.06); }
  .badge.green { color: var(--green); border-color: rgba(0,255,136,0.3); background: rgba(0,255,136,0.06); }
 
  .hero-eyebrow {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.3em;
    color: var(--cyan);
    text-transform: uppercase;
    margin-bottom: 16px;
    animation: fadeUp 0.8s 0.1s ease both;
    opacity: 0;
  }
 
  .hero-title {
    font-family: 'Orbitron', monospace;
    font-size: clamp(36px, 7vw, 80px);
    font-weight: 900;
    letter-spacing: 0.05em;
    line-height: 1;
    margin-bottom: 8px;
    animation: fadeUp 0.8s 0.2s ease both;
    opacity: 0;
  }
  .hero-title span.cyan { color: var(--cyan); text-shadow: var(--glow); }
  .hero-title span.pink { color: var(--pink); text-shadow: var(--glow-pink); }
 
  .hero-sub {
    font-family: 'Orbitron', monospace;
    font-size: clamp(14px, 2.5vw, 22px);
    font-weight: 400;
    color: var(--dim);
    letter-spacing: 0.15em;
    margin-bottom: 28px;
    animation: fadeUp 0.8s 0.3s ease both;
    opacity: 0;
  }
 
  .hero-tagline {
    font-family: 'Rajdhani', sans-serif;
    font-size: 18px;
    font-weight: 300;
    color: rgba(232,244,248,0.6);
    max-width: 540px;
    margin-bottom: 40px;
    animation: fadeUp 0.8s 0.4s ease both;
    opacity: 0;
  }
 
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }
 
  /* ─── SECTION TITLE ─── */
  .section {
    padding: 80px 0;
    border-top: 1px solid var(--border);
  }
 
  .sec-label {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.35em;
    color: var(--cyan);
    text-transform: uppercase;
    margin-bottom: 8px;
  }
 
  .sec-title {
    font-family: 'Orbitron', monospace;
    font-size: clamp(22px, 4vw, 36px);
    font-weight: 700;
    color: var(--white);
    margin-bottom: 40px;
    line-height: 1.2;
  }
  .sec-title .accent { color: var(--cyan); }
 
  /* ─── CARDS ─── */
  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
 
  .card {
    background: var(--card);
    border: 1px solid var(--border);
    padding: 28px;
    position: relative;
    transition: all 0.3s;
    clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%);
  }
  .card::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    border-left: 16px solid transparent;
    border-top: 16px solid var(--cyan);
    opacity: 0.5;
    transition: opacity 0.3s;
  }
  .card:hover { border-color: var(--cyan); box-shadow: var(--glow); background: rgba(0,245,255,0.07); }
  .card:hover::before { opacity: 1; }
 
  .card-icon {
    font-size: 28px;
    margin-bottom: 12px;
  }
  .card-title {
    font-family: 'Orbitron', monospace;
    font-size: 14px;
    font-weight: 700;
    color: var(--cyan);
    letter-spacing: 0.05em;
    margin-bottom: 10px;
    text-transform: uppercase;
  }
  .card-text {
    font-size: 14px;
    color: rgba(232,244,248,0.65);
    line-height: 1.6;
  }
 
  /* ─── ARCHITECTURE DIAGRAM ─── */
  .arch-diagram {
    position: relative;
    background: rgba(0,0,0,0.5);
    border: 1px solid var(--border);
    padding: 40px 20px;
    overflow-x: auto;
  }
 
  .arch-svg-wrap { min-width: 700px; }
 
  /* ─── TECH STACK ─── */
  .stack-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
  }
 
  .stack-item {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--card);
    border: 1px solid var(--border);
    padding: 14px 18px;
    transition: all 0.25s;
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
  }
  .stack-item:hover { border-color: var(--cyan); box-shadow: 0 0 12px rgba(0,245,255,0.2); }
  .stack-dot {
    width: 8px; height: 8px;
    background: var(--cyan);
    box-shadow: 0 0 8px var(--cyan);
    flex-shrink: 0;
  }
  .stack-dot.pink { background: var(--pink); box-shadow: 0 0 8px var(--pink); }
  .stack-dot.gold { background: var(--gold); box-shadow: 0 0 8px var(--gold); }
  .stack-dot.green { background: var(--green); box-shadow: 0 0 8px var(--green); }
  .stack-dot.purple { background: var(--purple); box-shadow: 0 0 8px var(--purple); }
  .stack-name { color: var(--white); font-weight: 600; font-size: 13px; font-family: 'Rajdhani', sans-serif; }
  .stack-ver { color: var(--dim); font-size: 11px; margin-left: auto; }
 
  /* ─── FLOW DIAGRAM (SEQUENCE) ─── */
  .flow-wrap {
    background: rgba(0,0,0,0.5);
    border: 1px solid var(--border);
    padding: 32px 20px;
    overflow-x: auto;
  }
 
  /* ─── ROADMAP ─── */
  .roadmap {
    display: flex;
    flex-direction: column;
    gap: 0;
    position: relative;
  }
  .roadmap::before {
    content: '';
    position: absolute;
    left: 22px; top: 0; bottom: 0;
    width: 1px;
    background: linear-gradient(to bottom, var(--cyan), var(--pink), var(--purple));
    opacity: 0.4;
  }
  .roadmap-item {
    display: flex;
    gap: 24px;
    padding: 20px 0;
  }
  .roadmap-dot {
    width: 44px; height: 44px;
    border: 2px solid var(--cyan);
    background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Orbitron', monospace;
    font-size: 12px;
    font-weight: 700;
    color: var(--cyan);
    flex-shrink: 0;
    box-shadow: 0 0 12px rgba(0,245,255,0.3);
    position: relative;
    z-index: 2;
  }
  .roadmap-dot.done { color: var(--green); border-color: var(--green); box-shadow: 0 0 12px rgba(0,255,136,0.3); }
  .roadmap-dot.wip { color: var(--gold); border-color: var(--gold); box-shadow: 0 0 12px rgba(255,215,0,0.3); }
  .roadmap-dot.future { color: var(--purple); border-color: var(--purple); box-shadow: 0 0 12px rgba(168,85,247,0.3); }
  .roadmap-content { flex: 1; }
  .roadmap-phase {
    font-family: 'Orbitron', monospace;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
  }
  .roadmap-phase.done { color: var(--green); }
  .roadmap-phase.wip { color: var(--gold); }
  .roadmap-phase.future { color: var(--purple); }
  .roadmap-items { display: flex; flex-wrap: wrap; gap: 8px; }
  .roadmap-tag {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    padding: 4px 10px;
    background: rgba(0,245,255,0.05);
    border: 1px solid rgba(0,245,255,0.15);
    color: rgba(232,244,248,0.7);
  }
  .roadmap-tag.done { background: rgba(0,255,136,0.05); border-color: rgba(0,255,136,0.2); }
  .roadmap-tag.wip { background: rgba(255,215,0,0.05); border-color: rgba(255,215,0,0.2); }
  .roadmap-tag.future { background: rgba(168,85,247,0.05); border-color: rgba(168,85,247,0.2); }
 
  /* ─── STRUCTURE TABLE ─── */
  .struct-table {
    width: 100%;
    border-collapse: collapse;
    font-family: 'Share Tech Mono', monospace;
    font-size: 13px;
  }
  .struct-table th {
    text-align: left;
    padding: 10px 16px;
    background: rgba(0,245,255,0.08);
    color: var(--cyan);
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    border-bottom: 1px solid var(--border);
  }
  .struct-table td {
    padding: 10px 16px;
    border-bottom: 1px solid rgba(0,245,255,0.06);
    color: rgba(232,244,248,0.75);
    vertical-align: top;
  }
  .struct-table tr:hover td { background: rgba(0,245,255,0.03); }
  .struct-table .path { color: var(--cyan); }
  .struct-table .desc { color: rgba(232,244,248,0.5); font-size: 11px; }
 
  /* ─── USER JOURNEY ─── */
  .journey-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
  }
  .journey-step {
    background: var(--card);
    border: 1px solid var(--border);
    padding: 20px;
    text-align: center;
    position: relative;
    transition: all 0.3s;
  }
  .journey-step:hover { border-color: var(--cyan); box-shadow: var(--glow); }
  .journey-num {
    font-family: 'Orbitron', monospace;
    font-size: 32px;
    font-weight: 900;
    color: rgba(0,245,255,0.12);
    line-height: 1;
    margin-bottom: 8px;
  }
  .journey-icon { font-size: 22px; margin-bottom: 8px; }
  .journey-text {
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px;
    font-weight: 600;
    color: rgba(232,244,248,0.8);
    letter-spacing: 0.05em;
  }
 
  /* ─── FOOTER ─── */
  .footer {
    border-top: 1px solid var(--border);
    padding: 48px 0;
    text-align: center;
  }
  .footer-logo {
    font-family: 'Orbitron', monospace;
    font-size: 20px;
    font-weight: 900;
    color: var(--cyan);
    text-shadow: var(--glow);
    margin-bottom: 12px;
    letter-spacing: 0.1em;
  }
  .footer-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 12px;
    color: var(--dim);
    letter-spacing: 0.1em;
  }
  .footer-links {
    display: flex;
    justify-content: center;
    gap: 24px;
    margin-top: 20px;
  }
  .footer-links a {
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
    color: var(--cyan);
    text-decoration: none;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    border-bottom: 1px solid rgba(0,245,255,0.3);
    padding-bottom: 2px;
    transition: all 0.2s;
  }
  .footer-links a:hover { color: var(--white); border-color: var(--white); }
 
  /* ─── BLINKING CURSOR ─── */
  .cursor {
    display: inline-block;
    width: 2px; height: 1em;
    background: var(--cyan);
    animation: blink 1s step-end infinite;
    vertical-align: middle;
    margin-left: 4px;
    box-shadow: 0 0 8px var(--cyan);
  }
  @keyframes blink { 50% { opacity: 0; } }
 
  /* ─── SVG ANIMATIONS ─── */
  .node-box {
    transition: all 0.3s;
    cursor: pointer;
  }
  .node-box:hover rect { filter: brightness(1.4); }
  
  @keyframes flow-dash {
    from { stroke-dashoffset: 20; }
    to { stroke-dashoffset: 0; }
  }
  .animated-path {
    stroke-dasharray: 5 5;
    animation: flow-dash 0.5s linear infinite;
  }
  @keyframes node-pulse {
    0%,100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  
  /* ─── CORNER DECORATION ─── */
  .corner-decor {
    position: relative;
    padding: 24px;
  }
  .corner-decor::before, .corner-decor::after {
    content: '';
    position: absolute;
    width: 24px; height: 24px;
  }
  .corner-decor::before {
    top: 0; left: 0;
    border-top: 2px solid var(--cyan);
    border-left: 2px solid var(--cyan);
  }
  .corner-decor::after {
    bottom: 0; right: 0;
    border-bottom: 2px solid var(--cyan);
    border-right: 2px solid var(--cyan);
  }
 
  /* ─── PRIVACY FEATURES ─── */
  .feature-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 12px;
  }
  .feature-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    border-left: 2px solid var(--green);
    background: rgba(0,255,136,0.03);
  }
  .feature-check {
    color: var(--green);
    font-size: 14px;
    flex-shrink: 0;
    font-family: 'Share Tech Mono', monospace;
  }
  .feature-text { font-size: 14px; color: rgba(232,244,248,0.75); }
  .feature-text strong { color: var(--white); display: block; margin-bottom: 2px; }
 
  /* ─── SCROLL INDICATOR ─── */
  .scroll-indicator {
    position: absolute;
    bottom: 32px; left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    opacity: 0.5;
    animation: fadeUp 1s 1s ease both;
  }
  .scroll-text {
    font-family: 'Share Tech Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.3em;
    color: var(--cyan);
    text-transform: uppercase;
  }
  .scroll-arrow {
    width: 1px; height: 40px;
    background: linear-gradient(to bottom, var(--cyan), transparent);
    animation: scroll-bob 1.5s ease-in-out infinite;
  }
  @keyframes scroll-bob {
    0%,100% { transform: scaleY(1); opacity: 0.5; }
    50% { transform: scaleY(1.3); opacity: 1; }
  }
 
  /* ─── STATUS BAR ─── */
  .status-bar {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(2,4,8,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 8px 24px;
    display: flex;
    align-items: center;
    gap: 24px;
    font-family: 'Share Tech Mono', monospace;
    font-size: 11px;
  }
  .status-logo {
    color: var(--cyan);
    font-weight: 700;
    letter-spacing: 0.1em;
    text-shadow: 0 0 10px var(--cyan);
  }
  .status-sep { color: var(--border); }
  .status-item { color: var(--dim); }
  .status-item span { color: var(--green); }
  .status-pulse {
    width: 6px; height: 6px;
    background: var(--green);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--green);
    animation: pulse-dot 2s ease-in-out infinite;
    margin-left: auto;
  }
  @keyframes pulse-dot { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
</style>
</head>
<body>
 
<!-- STATUS BAR -->
<div class="status-bar">
  <span class="status-logo">SSS</span>
  <span class="status-sep">//</span>
  <span class="status-item">VERSION <span>0.0.0-alpha</span></span>
  <span class="status-sep">//</span>
  <span class="status-item">STATUS <span>ACTIVE DEV</span></span>
  <span class="status-sep">//</span>
  <span class="status-item">UPDATED <span>APR 28 2026</span></span>
  <div class="status-pulse"></div>
</div>
 
<!-- HERO -->
<section class="hero">
  <div class="hero-glow-orb"></div>
  
  <div class="badge-row">
    <span class="badge">TypeScript 96.8%</span>
    <span class="badge pink">React 18.3+</span>
    <span class="badge gold">Vite 5.4+</span>
    <span class="badge green">MIT License</span>
    <span class="badge">Active Dev</span>
  </div>
 
  <div class="hero-eyebrow">Document Intelligence Platform</div>
  
  <h1 class="hero-title">
    <span class="cyan">SAMJHO</span><br>
    <span class="pink">SOCH</span>&nbsp;<span style="color:var(--gold);text-shadow:var(--glow-gold)">SEEKHO</span>
  </h1>
  
  <div class="hero-sub">UNDERSTAND · THINK · LEARN<span class="cursor"></span></div>
  
  <p class="hero-tagline">
    Upload documents, unlock AI insights, ask questions — in English or Hindi.
    Privacy-first. Client-side. Blazingly fast.
  </p>
 
  <div class="badge-row">
    <span class="badge green">PDF Processing</span>
    <span class="badge">Voice I/O</span>
    <span class="badge pink">Hindi + English</span>
    <span class="badge gold">OCR + NLP</span>
    <span class="badge">Risk Intelligence</span>
  </div>
 
  <div class="scroll-indicator">
    <span class="scroll-text">Scroll</span>
    <div class="scroll-arrow"></div>
  </div>
</section>
 
<!-- FEATURES -->
<section class="section">
  <div class="wrapper">
    <div class="sec-label">// CAPABILITIES</div>
    <h2 class="sec-title">Core <span class="accent">Feature Matrix</span></h2>
    <div class="card-grid">
      <div class="card">
        <div class="card-icon">📄</div>
        <div class="card-title">Document Intelligence</div>
        <div class="card-text">Upload PDFs, DOCX, TXT. AI-powered extraction with OCR for scanned documents. Real-time processing pipeline.</div>
      </div>
      <div class="card">
        <div class="card-icon">🤖</div>
        <div class="card-title">Conversational AI</div>
        <div class="card-text">Context-aware Q&A chatbot with multi-language support. Natural language understanding with practical, jargon-free explanations.</div>
      </div>
      <div class="card">
        <div class="card-icon">🚨</div>
        <div class="card-title">Risk Intelligence</div>
        <div class="card-text">Automatic flagging of critical sections. Risk severity classification with actionable recommendations and prioritized next steps.</div>
      </div>
      <div class="card">
        <div class="card-icon">🌐</div>
        <div class="card-title">Multilingual Core</div>
        <div class="card-text">Seamless English ↔ Hindi switching. Localized responses with cultural context awareness built into the NLP pipeline.</div>
      </div>
      <div class="card">
        <div class="card-icon">🎙️</div>
        <div class="card-title">Voice & Access</div>
        <div class="card-text">Speech-to-text input, text-to-speech output. Fully responsive across mobile, tablet, desktop. WCAG-compliant components.</div>
      </div>
      <div class="card">
        <div class="card-icon">✨</div>
        <div class="card-title">Modern UX</div>
        <div class="card-text">Distraction-free interface with real-time feedback. Privacy-first: all processing client-side. No data leaves your device.</div>
      </div>
    </div>
  </div>
</section>
 
<!-- ARCHITECTURE DIAGRAM -->
<section class="section">
  <div class="wrapper">
    <div class="sec-label">// SYSTEM DESIGN</div>
    <h2 class="sec-title">Architecture <span class="accent">Overview</span></h2>
    <div class="arch-diagram">
      <div class="arch-svg-wrap">
        <svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#00f5ff" opacity="0.7"/>
            </marker>
            <marker id="arrow-pink" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#ff006e" opacity="0.7"/>
            </marker>
            <marker id="arrow-gold" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="#ffd700" opacity="0.7"/>
            </marker>
            <filter id="glow-cyan">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="glow-pink">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#00f5ff;stop-opacity:0.15"/>
              <stop offset="100%" style="stop-color:#00f5ff;stop-opacity:0.05"/>
            </linearGradient>
            <linearGradient id="grad-pink" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#ff006e;stop-opacity:0.15"/>
              <stop offset="100%" style="stop-color:#ff006e;stop-opacity:0.05"/>
            </linearGradient>
            <linearGradient id="grad-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#ffd700;stop-opacity:0.15"/>
              <stop offset="100%" style="stop-color:#ffd700;stop-opacity:0.05"/>
            </linearGradient>
            <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#00ff88;stop-opacity:0.15"/>
              <stop offset="100%" style="stop-color:#00ff88;stop-opacity:0.05"/>
            </linearGradient>
          </defs>
 
          <!-- Layer labels -->
          <text x="20" y="22" font-family="'Share Tech Mono',monospace" font-size="10" fill="#00f5ff" opacity="0.5" letter-spacing="3">// SYSTEM ARCHITECTURE</text>
 
          <!-- ─── REACT UI LAYER ─── -->
          <rect x="280" y="40" width="340" height="110" rx="2" fill="url(#grad-cyan)" stroke="#00f5ff" stroke-width="1" opacity="0.9"/>
          <text x="293" y="58" font-family="Orbitron,monospace" font-size="11" fill="#00f5ff" font-weight="700" letter-spacing="2">REACT UI LAYER</text>
          <text x="293" y="73" font-family="'Share Tech Mono',monospace" font-size="10" fill="#00f5ff" opacity="0.4">Vite + Tailwind + shadcn/ui</text>
          <!-- Sub nodes -->
          <rect x="293" y="82" width="90" height="28" rx="1" fill="rgba(0,245,255,0.08)" stroke="#00f5ff" stroke-width="0.5"/>
          <text x="338" y="100" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#00f5ff">Components</text>
          <rect x="393" y="82" width="90" height="28" rx="1" fill="rgba(0,245,255,0.08)" stroke="#00f5ff" stroke-width="0.5"/>
          <text x="438" y="100" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#00f5ff">State Mgmt</text>
          <rect x="493" y="82" width="90" height="28" rx="1" fill="rgba(0,245,255,0.08)" stroke="#00f5ff" stroke-width="0.5"/>
          <text x="538" y="100" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#00f5ff">React Router</text>
          <!-- Corner cut -->
          <polygon points="600,40 620,40 620,60" fill="none" stroke="#00f5ff" stroke-width="1" opacity="0.5"/>
 
          <!-- Arrow down to service layer -->
          <line x1="450" y1="150" x2="450" y2="185" stroke="#00f5ff" stroke-width="1.5" marker-end="url(#arrow)" opacity="0.6"/>
          <text x="456" y="172" font-family="'Share Tech Mono',monospace" font-size="9" fill="#00f5ff" opacity="0.5">requests</text>
 
          <!-- ─── SERVICE LAYER ─── -->
          <rect x="280" y="188" width="340" height="100" rx="2" fill="url(#grad-pink)" stroke="#ff006e" stroke-width="1" opacity="0.9"/>
          <text x="293" y="207" font-family="Orbitron,monospace" font-size="11" fill="#ff006e" font-weight="700" letter-spacing="2">SERVICE LAYER</text>
          <text x="293" y="222" font-family="'Share Tech Mono',monospace" font-size="10" fill="#ff006e" opacity="0.4">TypeScript Business Logic</text>
          <rect x="293" y="230" width="88" height="28" rx="1" fill="rgba(255,0,110,0.08)" stroke="#ff006e" stroke-width="0.5"/>
          <text x="337" y="248" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="8.5" fill="#ff006e">docService.ts</text>
          <rect x="391" y="230" width="88" height="28" rx="1" fill="rgba(255,0,110,0.08)" stroke="#ff006e" stroke-width="0.5"/>
          <text x="435" y="248" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="8.5" fill="#ff006e">aiService.ts</text>
          <rect x="489" y="230" width="88" height="28" rx="1" fill="rgba(255,0,110,0.08)" stroke="#ff006e" stroke-width="0.5"/>
          <text x="533" y="248" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="8.5" fill="#ff006e">langService.ts</text>
          <polygon points="600,188 620,188 620,208" fill="none" stroke="#ff006e" stroke-width="1" opacity="0.5"/>
 
          <!-- Arrows from service to 3 APIs -->
          <line x1="360" y1="288" x2="165" y2="355" stroke="#ffd700" stroke-width="1.5" marker-end="url(#arrow-gold)" opacity="0.6" stroke-dasharray="4 3"/>
          <line x1="450" y1="288" x2="450" y2="355" stroke="#ffd700" stroke-width="1.5" marker-end="url(#arrow-gold)" opacity="0.6" stroke-dasharray="4 3"/>
          <line x1="540" y1="288" x2="735" y2="355" stroke="#ffd700" stroke-width="1.5" marker-end="url(#arrow-gold)" opacity="0.6" stroke-dasharray="4 3"/>
 
          <!-- ─── THREE BOTTOM LAYERS ─── -->
          <!-- Document API -->
          <rect x="40" y="358" width="200" height="110" rx="2" fill="url(#grad-gold)" stroke="#ffd700" stroke-width="1" opacity="0.9"/>
          <text x="53" y="377" font-family="Orbitron,monospace" font-size="10" fill="#ffd700" font-weight="700" letter-spacing="1">DOCUMENT API</text>
          <rect x="53" y="385" width="174" height="22" rx="1" fill="rgba(255,215,0,0.07)" stroke="#ffd700" stroke-width="0.5"/>
          <text x="140" y="400" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#ffd700">PDF.js v4.8</text>
          <rect x="53" y="413" width="80" height="22" rx="1" fill="rgba(255,215,0,0.07)" stroke="#ffd700" stroke-width="0.5"/>
          <text x="93" y="428" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#ffd700">Mammoth</text>
          <rect x="140" y="413" width="87" height="22" rx="1" fill="rgba(255,215,0,0.07)" stroke="#ffd700" stroke-width="0.5"/>
          <text x="183" y="428" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#ffd700">Tesseract.js</text>
          <text x="140" y="455" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="8" fill="#ffd700" opacity="0.5">OCR + Parsing</text>
          <polygon points="220,358 240,358 240,378" fill="none" stroke="#ffd700" stroke-width="1" opacity="0.4"/>
 
          <!-- AI Models -->
          <rect x="350" y="358" width="200" height="110" rx="2" fill="url(#grad-green)" stroke="#00ff88" stroke-width="1" opacity="0.9"/>
          <text x="363" y="377" font-family="Orbitron,monospace" font-size="10" fill="#00ff88" font-weight="700" letter-spacing="1">AI MODELS</text>
          <rect x="363" y="385" width="174" height="22" rx="1" fill="rgba(0,255,136,0.07)" stroke="#00ff88" stroke-width="0.5"/>
          <text x="450" y="400" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#00ff88">NLP Engine</text>
          <rect x="363" y="413" width="80" height="22" rx="1" fill="rgba(0,255,136,0.07)" stroke="#00ff88" stroke-width="0.5"/>
          <text x="403" y="428" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#00ff88">Summarizer</text>
          <rect x="450" y="413" width="87" height="22" rx="1" fill="rgba(0,255,136,0.07)" stroke="#00ff88" stroke-width="0.5"/>
          <text x="493" y="428" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#00ff88">Risk Detect</text>
          <text x="450" y="455" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="8" fill="#00ff88" opacity="0.5">ML + NLP Services</text>
          <polygon points="530,358 550,358 550,378" fill="none" stroke="#00ff88" stroke-width="1" opacity="0.4"/>
 
          <!-- Language API -->
          <rect x="660" y="358" width="200" height="110" rx="2" fill="rgba(168,85,247,0.1)" stroke="#a855f7" stroke-width="1" opacity="0.9"/>
          <text x="673" y="377" font-family="Orbitron,monospace" font-size="10" fill="#a855f7" font-weight="700" letter-spacing="1">LANGUAGE API</text>
          <rect x="673" y="385" width="174" height="22" rx="1" fill="rgba(168,85,247,0.07)" stroke="#a855f7" stroke-width="0.5"/>
          <text x="760" y="400" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#a855f7">i18n Engine</text>
          <rect x="673" y="413" width="80" height="22" rx="1" fill="rgba(168,85,247,0.07)" stroke="#a855f7" stroke-width="0.5"/>
          <text x="713" y="428" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#a855f7">EN → HI</text>
          <rect x="760" y="413" width="87" height="22" rx="1" fill="rgba(168,85,247,0.07)" stroke="#a855f7" stroke-width="0.5"/>
          <text x="803" y="428" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#a855f7">HI → EN</text>
          <text x="760" y="455" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="8" fill="#a855f7" opacity="0.5">Bilingual NLP</text>
          <polygon points="840,358 860,358 860,378" fill="none" stroke="#a855f7" stroke-width="1" opacity="0.4"/>
 
          <!-- Layer connector labels -->
          <text x="155" y="340" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#ffd700" opacity="0.5">doc parsing</text>
          <text x="450" y="340" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#ffd700" opacity="0.5">inference</text>
          <text x="748" y="340" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#ffd700" opacity="0.5">translation</text>
 
          <!-- INPUT label at top -->
          <text x="450" y="22" text-anchor="middle" font-family="Orbitron,monospace" font-size="9" fill="#00f5ff" opacity="0.4" letter-spacing="3">USER INPUT ↓</text>
          <!-- OUTPUT label at bottom -->
          <text x="450" y="500" text-anchor="middle" font-family="Orbitron,monospace" font-size="9" fill="#00ff88" opacity="0.4" letter-spacing="3">↑ PROCESSED OUTPUT</text>
        </svg>
      </div>
    </div>
  </div>
</section>
 
<!-- REQUEST FLOW SEQUENCE DIAGRAM -->
<section class="section">
  <div class="wrapper">
    <div class="sec-label">// REQUEST LIFECYCLE</div>
    <h2 class="sec-title">Sequence <span class="accent">Flow Diagram</span></h2>
    <div class="flow-wrap">
      <svg viewBox="0 0 860 440" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;min-width:700px">
        <defs>
          <marker id="a2" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" fill="#00f5ff" opacity="0.8"/>
          </marker>
          <marker id="a2r" markerWidth="7" markerHeight="5" refX="0" refY="2.5" orient="auto">
            <polygon points="7 0, 0 2.5, 7 5" fill="#00ff88" opacity="0.8"/>
          </marker>
          <marker id="a2p" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" fill="#ff006e" opacity="0.8"/>
          </marker>
        </defs>
 
        <!-- Lifeline headers -->
        <!-- User -->
        <rect x="20" y="20" width="90" height="36" rx="2" fill="rgba(0,245,255,0.08)" stroke="#00f5ff" stroke-width="1"/>
        <text x="65" y="43" text-anchor="middle" font-family="Orbitron,monospace" font-size="10" fill="#00f5ff">USER</text>
 
        <!-- Frontend -->
        <rect x="190" y="20" width="100" height="36" rx="2" fill="rgba(255,0,110,0.08)" stroke="#ff006e" stroke-width="1"/>
        <text x="240" y="43" text-anchor="middle" font-family="Orbitron,monospace" font-size="10" fill="#ff006e">FRONTEND</text>
 
        <!-- Backend -->
        <rect x="370" y="20" width="100" height="36" rx="2" fill="rgba(255,215,0,0.08)" stroke="#ffd700" stroke-width="1"/>
        <text x="420" y="43" text-anchor="middle" font-family="Orbitron,monospace" font-size="10" fill="#ffd700">BACKEND</text>
 
        <!-- Local LLM -->
        <rect x="555" y="20" width="100" height="36" rx="2" fill="rgba(0,255,136,0.08)" stroke="#00ff88" stroke-width="1"/>
        <text x="605" y="43" text-anchor="middle" font-family="Orbitron,monospace" font-size="10" fill="#00ff88">LOCAL LLM</text>
 
        <!-- Web Search -->
        <rect x="740" y="20" width="100" height="36" rx="2" fill="rgba(168,85,247,0.08)" stroke="#a855f7" stroke-width="1"/>
        <text x="790" y="43" text-anchor="middle" font-family="Orbitron,monospace" font-size="10" fill="#a855f7">WEB SEARCH</text>
 
        <!-- Lifelines -->
        <line x1="65" y1="56" x2="65" y2="420" stroke="#00f5ff" stroke-width="0.5" stroke-dasharray="4 4" opacity="0.3"/>
        <line x1="240" y1="56" x2="240" y2="420" stroke="#ff006e" stroke-width="0.5" stroke-dasharray="4 4" opacity="0.3"/>
        <line x1="420" y1="56" x2="420" y2="420" stroke="#ffd700" stroke-width="0.5" stroke-dasharray="4 4" opacity="0.3"/>
        <line x1="605" y1="56" x2="605" y2="420" stroke="#00ff88" stroke-width="0.5" stroke-dasharray="4 4" opacity="0.3"/>
        <line x1="790" y1="56" x2="790" y2="420" stroke="#a855f7" stroke-width="0.5" stroke-dasharray="4 4" opacity="0.3"/>
 
        <!-- Step circles -->
        <!-- 1 Ask Question -->
        <circle cx="65" cy="90" r="10" fill="rgba(0,245,255,0.15)" stroke="#00f5ff" stroke-width="1"/>
        <text x="65" y="94" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#00f5ff">1</text>
        <line x1="75" y1="90" x2="232" y2="90" stroke="#00f5ff" stroke-width="1.5" marker-end="url(#a2)"/>
        <text x="153" y="85" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#00f5ff" opacity="0.8">Ask Question</text>
 
        <!-- 2 POST /ask -->
        <circle cx="240" cy="125" r="10" fill="rgba(255,0,110,0.15)" stroke="#ff006e" stroke-width="1"/>
        <text x="240" y="129" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#ff006e">2</text>
        <line x1="250" y1="125" x2="412" y2="125" stroke="#ff006e" stroke-width="1.5" marker-end="url(#a2p)"/>
        <text x="331" y="120" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#ff006e" opacity="0.8">POST /ask</text>
 
        <!-- 3 Query Mistral -->
        <circle cx="420" cy="160" r="10" fill="rgba(255,215,0,0.15)" stroke="#ffd700" stroke-width="1"/>
        <text x="420" y="164" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#ffd700">3</text>
        <line x1="430" y1="160" x2="597" y2="160" stroke="#ffd700" stroke-width="1.5" marker-end="url(#a2)"/>
        <text x="513" y="155" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#ffd700" opacity="0.8">Query Mistral</text>
 
        <!-- Alt box: Confident Answer -->
        <rect x="320" y="175" width="370" height="50" rx="1" fill="rgba(0,255,136,0.03)" stroke="#00ff88" stroke-width="0.5" stroke-dasharray="3 3"/>
        <text x="328" y="190" font-family="'Share Tech Mono',monospace" font-size="9" fill="#00ff88" opacity="0.6">alt</text>
        <text x="500" y="190" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#00ff88" opacity="0.8">[ ✅ Confident Answer ]</text>
        <!-- 4 Return Local -->
        <circle cx="605" cy="208" r="10" fill="rgba(0,255,136,0.15)" stroke="#00ff88" stroke-width="1"/>
        <text x="605" y="212" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#00ff88">4</text>
        <line x1="595" y1="208" x2="428" y2="208" stroke="#00ff88" stroke-width="1.5" marker-end="url(#a2r)"/>
        <text x="512" y="203" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#00ff88" opacity="0.8">Return Local Answer</text>
 
        <!-- Alt box 2: Need Web Data -->
        <rect x="320" y="232" width="370" height="52" rx="1" fill="rgba(255,0,110,0.03)" stroke="#ff006e" stroke-width="0.5" stroke-dasharray="3 3"/>
        <text x="328" y="248" font-family="'Share Tech Mono',monospace" font-size="9" fill="#ff006e" opacity="0.6">alt</text>
        <text x="500" y="248" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#ff006e" opacity="0.8">[ ❌ Need Web Data ]</text>
        <!-- 5 Playwright Search -->
        <circle cx="420" cy="267" r="10" fill="rgba(255,215,0,0.15)" stroke="#ffd700" stroke-width="1"/>
        <text x="420" y="271" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#ffd700">5</text>
        <line x1="430" y1="267" x2="782" y2="267" stroke="#ffd700" stroke-width="1.5" marker-end="url(#a2)"/>
        <text x="606" y="261" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#ffd700" opacity="0.8">Playwright Search</text>
 
        <!-- 6 Search Results -->
        <circle cx="790" cy="302" r="10" fill="rgba(168,85,247,0.15)" stroke="#a855f7" stroke-width="1"/>
        <text x="790" y="306" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#a855f7">6</text>
        <line x1="780" y1="302" x2="428" y2="302" stroke="#a855f7" stroke-width="1.5" marker-end="url(#a2r)"/>
        <text x="604" y="296" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#a855f7" opacity="0.8">Search Results</text>
 
        <!-- 7 Scoring Algorithm (loop) -->
        <circle cx="420" cy="337" r="10" fill="rgba(255,215,0,0.15)" stroke="#ffd700" stroke-width="1"/>
        <text x="420" y="341" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#ffd700">7</text>
        <path d="M430,337 Q480,337 480,320 Q480,302 430,302" stroke="#ffd700" stroke-width="1" fill="none" stroke-dasharray="3 2" opacity="0.6"/>
        <text x="510" y="322" font-family="'Share Tech Mono',monospace" font-size="9" fill="#ffd700" opacity="0.7">Apply Scoring Algorithm</text>
 
        <!-- 8 JSON Response -->
        <circle cx="420" cy="372" r="10" fill="rgba(255,215,0,0.15)" stroke="#ffd700" stroke-width="1"/>
        <text x="420" y="376" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#ffd700">8</text>
        <line x1="410" y1="372" x2="248" y2="372" stroke="#00f5ff" stroke-width="1.5" marker-end="url(#a2r)"/>
        <text x="329" y="367" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#00f5ff" opacity="0.8">JSON Response</text>
 
        <!-- 9 Render Answer + Sources -->
        <circle cx="240" cy="407" r="10" fill="rgba(255,0,110,0.15)" stroke="#ff006e" stroke-width="1"/>
        <text x="240" y="411" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#ff006e">9</text>
        <line x1="230" y1="407" x2="73" y2="407" stroke="#00ff88" stroke-width="1.5" marker-end="url(#a2r)"/>
        <text x="151" y="402" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="9" fill="#00ff88" opacity="0.8">Render Answer + Sources</text>
      </svg>
    </div>
  </div>
</section>
 
<!-- DATA FLOW DIAGRAM -->
<section class="section">
  <div class="wrapper">
    <div class="sec-label">// DATA PIPELINE</div>
    <h2 class="sec-title">Data <span class="accent">Flow</span></h2>
    <div class="arch-diagram">
      <svg viewBox="0 0 860 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;min-width:700px">
        <defs>
          <marker id="af" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
            <polygon points="0 0, 7 2.5, 0 5" fill="#00f5ff" opacity="0.8"/>
          </marker>
        </defs>
 
        <!-- Boxes -->
        <!-- INPUT -->
        <rect x="10" y="65" width="90" height="50" rx="2" fill="rgba(0,245,255,0.1)" stroke="#00f5ff" stroke-width="1"/>
        <text x="55" y="86" text-anchor="middle" font-family="Orbitron,monospace" font-size="8" fill="#00f5ff" font-weight="700">UPLOAD</text>
        <text x="55" y="100" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="8" fill="#00f5ff" opacity="0.6">PDF·DOCX·TXT</text>
        <text x="55" y="112" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="8" fill="#00f5ff" opacity="0.6">IMG·SCAN</text>
        <line x1="100" y1="90" x2="140" y2="90" stroke="#00f5ff" stroke-width="1.2" marker-end="url(#af)" opacity="0.7"/>
 
        <!-- VALIDATE -->
        <rect x="140" y="65" width="80" height="50" rx="2" fill="rgba(255,215,0,0.08)" stroke="#ffd700" stroke-width="1"/>
        <text x="180" y="86" text-anchor="middle" font-family="Orbitron,monospace" font-size="8" fill="#ffd700" font-weight="700">VALIDATE</text>
        <text x="180" y="100" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="8" fill="#ffd700" opacity="0.6">type + size</text>
        <text x="180" y="112" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="8" fill="#ffd700" opacity="0.6">check</text>
        <line x1="220" y1="90" x2="258" y2="90" stroke="#00f5ff" stroke-width="1.2" marker-end="url(#af)" opacity="0.7"/>
 
        <!-- PARSE -->
        <rect x="258" y="55" width="90" height="70" rx="2" fill="rgba(255,0,110,0.08)" stroke="#ff006e" stroke-width="1"/>
        <text x="303" y="76" text-anchor="middle" font-family="Orbitron,monospace" font-size="8" fill="#ff006e" font-weight="700">PARSE</text>
        <text x="303" y="91" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="7.5" fill="#ff006e" opacity="0.6">PDF.js</text>
        <text x="303" y="103" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="7.5" fill="#ff006e" opacity="0.6">Mammoth</text>
        <text x="303" y="115" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="7.5" fill="#ff006e" opacity="0.6">Tesseract</text>
        <line x1="348" y1="90" x2="388" y2="90" stroke="#00f5ff" stroke-width="1.2" marker-end="url(#af)" opacity="0.7"/>
 
        <!-- AI ANALYSIS -->
        <rect x="388" y="45" width="110" height="90" rx="2" fill="rgba(0,255,136,0.08)" stroke="#00ff88" stroke-width="1"/>
        <text x="443" y="65" text-anchor="middle" font-family="Orbitron,monospace" font-size="8" fill="#00ff88" font-weight="700">AI ANALYSIS</text>
        <text x="443" y="80" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="7.5" fill="#00ff88" opacity="0.6">NLP Engine</text>
        <text x="443" y="92" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="7.5" fill="#00ff88" opacity="0.6">Summary Gen</text>
        <text x="443" y="104" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="7.5" fill="#00ff88" opacity="0.6">Risk Detect</text>
        <text x="443" y="116" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="7.5" fill="#00ff88" opacity="0.6">Action Items</text>
        <line x1="498" y1="90" x2="536" y2="90" stroke="#00f5ff" stroke-width="1.2" marker-end="url(#af)" opacity="0.7"/>
 
        <!-- TRANSLATE -->
        <rect x="536" y="65" width="80" height="50" rx="2" fill="rgba(168,85,247,0.08)" stroke="#a855f7" stroke-width="1"/>
        <text x="576" y="86" text-anchor="middle" font-family="Orbitron,monospace" font-size="8" fill="#a855f7" font-weight="700">TRANSLATE</text>
        <text x="576" y="100" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="8" fill="#a855f7" opacity="0.6">EN ↔ HI</text>
        <text x="576" y="112" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="8" fill="#a855f7" opacity="0.6">cultural ctx</text>
        <line x1="616" y1="90" x2="654" y2="90" stroke="#00f5ff" stroke-width="1.2" marker-end="url(#af)" opacity="0.7"/>
 
        <!-- OUTPUT -->
        <rect x="654" y="35" width="100" height="110" rx="2" fill="rgba(0,245,255,0.08)" stroke="#00f5ff" stroke-width="1"/>
        <text x="704" y="56" text-anchor="middle" font-family="Orbitron,monospace" font-size="8" fill="#00f5ff" font-weight="700">OUTPUT</text>
        <text x="704" y="72" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="7.5" fill="#00f5ff" opacity="0.6">Summary</text>
        <text x="704" y="84" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="7.5" fill="#00f5ff" opacity="0.6">Risks</text>
        <text x="704" y="96" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="7.5" fill="#00f5ff" opacity="0.6">Actions</text>
        <text x="704" y="108" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="7.5" fill="#00f5ff" opacity="0.6">Q&amp;A</text>
        <text x="704" y="120" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="7.5" fill="#00f5ff" opacity="0.6">Multi-lang</text>
 
        <!-- Flow labels -->
        <text x="55" y="148" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="8" fill="#00f5ff" opacity="0.3">INPUT</text>
        <text x="704" y="165" text-anchor="middle" font-family="'Share Tech Mono',monospace" font-size="8" fill="#00f5ff" opacity="0.3">OUTPUT</text>
      </svg>
    </div>
  </div>
</section>
 
<!-- TECH STACK -->
<section class="section">
  <div class="wrapper">
    <div class="sec-label">// DEPENDENCIES</div>
    <h2 class="sec-title">Tech <span class="accent">Stack</span></h2>
    <div class="stack-grid">
      <div class="stack-item"><div class="stack-dot"></div><span class="stack-name">React</span><span class="stack-ver">18.3+</span></div>
      <div class="stack-item"><div class="stack-dot"></div><span class="stack-name">TypeScript</span><span class="stack-ver">5.8+</span></div>
      <div class="stack-item"><div class="stack-dot pink"></div><span class="stack-name">Vite</span><span class="stack-ver">5.4+</span></div>
      <div class="stack-item"><div class="stack-dot pink"></div><span class="stack-name">Tailwind CSS</span><span class="stack-ver">3.4+</span></div>
      <div class="stack-item"><div class="stack-dot gold"></div><span class="stack-name">shadcn/ui</span><span class="stack-ver">latest</span></div>
      <div class="stack-item"><div class="stack-dot gold"></div><span class="stack-name">Lucide React</span><span class="stack-ver">0.462+</span></div>
      <div class="stack-item"><div class="stack-dot green"></div><span class="stack-name">PDF.js</span><span class="stack-ver">4.8+</span></div>
      <div class="stack-item"><div class="stack-dot green"></div><span class="stack-name">Mammoth</span><span class="stack-ver">1.8+</span></div>
      <div class="stack-item"><div class="stack-dot green"></div><span class="stack-name">Tesseract.js</span><span class="stack-ver">5.1+</span></div>
      <div class="stack-item"><div class="stack-dot purple"></div><span class="stack-name">TanStack Query</span><span class="stack-ver">5.83+</span></div>
      <div class="stack-item"><div class="stack-dot purple"></div><span class="stack-name">Zod</span><span class="stack-ver">3.25+</span></div>
      <div class="stack-item"><div class="stack-dot purple"></div><span class="stack-name">React Hook Form</span><span class="stack-ver">7.61+</span></div>
      <div class="stack-item"><div class="stack-dot"></div><span class="stack-name">React Router</span><span class="stack-ver">6.30+</span></div>
      <div class="stack-item"><div class="stack-dot pink"></div><span class="stack-name">Recharts</span><span class="stack-ver">2.15+</span></div>
      <div class="stack-item"><div class="stack-dot gold"></div><span class="stack-name">Sonner</span><span class="stack-ver">1.7+</span></div>
      <div class="stack-item"><div class="stack-dot green"></div><span class="stack-name">Date-fns</span><span class="stack-ver">3.6+</span></div>
    </div>
  </div>
</section>
 
<!-- PROJECT STRUCTURE -->
<section class="section">
  <div class="wrapper">
    <div class="sec-label">// FILE TREE</div>
    <h2 class="sec-title">Project <span class="accent">Structure</span></h2>
    <div class="arch-diagram">
      <table class="struct-table">
        <thead>
          <tr><th>Path</th><th>Description</th></tr>
        </thead>
        <tbody>
          <tr><td class="path">src/components/ui/</td><td class="desc">shadcn/ui base components</td></tr>
          <tr><td class="path">src/components/features/</td><td class="desc">Feature-specific components</td></tr>
          <tr><td class="path">src/components/layout/</td><td class="desc">Layout & shell components</td></tr>
          <tr><td class="path">src/pages/</td><td class="desc">Route-level page components</td></tr>
          <tr><td class="path">src/services/documentService.ts</td><td class="desc">PDF/DOCX parsing pipeline</td></tr>
          <tr><td class="path">src/services/aiService.ts</td><td class="desc">NLP, summarization, risk detection</td></tr>
          <tr><td class="path">src/services/languageService.ts</td><td class="desc">EN↔HI translation layer</td></tr>
          <tr><td class="path">src/hooks/</td><td class="desc">Custom React hooks</td></tr>
          <tr><td class="path">src/utils/</td><td class="desc">Utility & helper functions</td></tr>
          <tr><td class="path">src/types/</td><td class="desc">TypeScript type definitions</td></tr>
          <tr><td class="path">vite.config.ts</td><td class="desc">Vite build configuration</td></tr>
          <tr><td class="path">tailwind.config.ts</td><td class="desc">Tailwind CSS customization</td></tr>
          <tr><td class="path">tsconfig.json</td><td class="desc">TypeScript compiler config</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>
 
<!-- USER JOURNEY -->
<section class="section">
  <div class="wrapper">
    <div class="sec-label">// USAGE FLOW</div>
    <h2 class="sec-title">User <span class="accent">Journey</span></h2>
    <div class="journey-steps">
      <div class="journey-step">
        <div class="journey-num">01</div>
        <div class="journey-icon">🌐</div>
        <div class="journey-text">Select Language<br>EN / HI</div>
      </div>
      <div class="journey-step">
        <div class="journey-num">02</div>
        <div class="journey-icon">📤</div>
        <div class="journey-text">Upload Document</div>
      </div>
      <div class="journey-step">
        <div class="journey-num">03</div>
        <div class="journey-icon">📋</div>
        <div class="journey-text">Auto Summary<br>& Key Points</div>
      </div>
      <div class="journey-step">
        <div class="journey-num">04</div>
        <div class="journey-icon">🚨</div>
        <div class="journey-text">Scan Risk Flags<br>& Alerts</div>
      </div>
      <div class="journey-step">
        <div class="journey-num">05</div>
        <div class="journey-icon">💬</div>
        <div class="journey-text">Ask Questions<br>Text or Voice</div>
      </div>
      <div class="journey-step">
        <div class="journey-num">06</div>
        <div class="journey-icon">🤖</div>
        <div class="journey-text">AI-Powered<br>Answers</div>
      </div>
      <div class="journey-step">
        <div class="journey-num">07</div>
        <div class="journey-icon">📤</div>
        <div class="journey-text">Export<br>Summaries</div>
      </div>
      <div class="journey-step">
        <div class="journey-num">08</div>
        <div class="journey-icon">✅</div>
        <div class="journey-text">Take Recommended<br>Actions</div>
      </div>
    </div>
  </div>
</section>
 
<!-- QUICK START -->
<section class="section">
  <div class="wrapper">
    <div class="sec-label">// SETUP</div>
    <h2 class="sec-title">Quick <span class="accent">Start</span></h2>
    <div class="corner-decor" style="background:rgba(0,0,0,0.4);border:1px solid var(--border);">
      <div style="font-family:'Share Tech Mono',monospace;font-size:13px;line-height:2.2;color:rgba(232,244,248,0.7);">
        <span style="color:var(--dim)"># 1. Clone</span><br>
        <span style="color:var(--cyan)">$</span> git clone https://github.com/AshmitThakur23/samjho-soch-seekho.git<br>
        <span style="color:var(--cyan)">$</span> cd samjho-soch-seekho<br><br>
        <span style="color:var(--dim)"># 2. Install dependencies</span><br>
        <span style="color:var(--cyan)">$</span> npm install<br><br>
        <span style="color:var(--dim)"># 3. Start dev server → http://localhost:5173</span><br>
        <span style="color:var(--cyan)">$</span> npm run dev<br><br>
        <span style="color:var(--dim)"># 4. Build for production</span><br>
        <span style="color:var(--cyan)">$</span> npm run build<br><br>
        <span style="color:var(--dim)"># 5. Lint</span><br>
        <span style="color:var(--cyan)">$</span> npm run lint<span class="cursor"></span>
      </div>
    </div>
  </div>
</section>
 
<!-- PRIVACY -->
<section class="section">
  <div class="wrapper">
    <div class="sec-label">// SECURITY</div>
    <h2 class="sec-title">Privacy <span class="accent">Architecture</span></h2>
    <div class="feature-list">
      <div class="feature-item">
        <span class="feature-check">✔</span>
        <div class="feature-text"><strong>No Data Collection</strong>Documents analyzed in-session only</div>
      </div>
      <div class="feature-item">
        <span class="feature-check">✔</span>
        <div class="feature-text"><strong>Client-Side Processing</strong>All computation happens on your device</div>
      </div>
      <div class="feature-item">
        <span class="feature-check">✔</span>
        <div class="feature-text"><strong>Zero Server Storage</strong>Data never stored on external servers</div>
      </div>
      <div class="feature-item">
        <span class="feature-check">✔</span>
        <div class="feature-text"><strong>Encryption Ready</strong>Security-first architecture by design</div>
      </div>
    </div>
  </div>
</section>
 
<!-- ROADMAP -->
<section class="section">
  <div class="wrapper">
    <div class="sec-label">// MILESTONES</div>
    <h2 class="sec-title">Development <span class="accent">Roadmap</span></h2>
    <div class="roadmap">
      <div class="roadmap-item">
        <div class="roadmap-dot done">P1</div>
        <div class="roadmap-content">
          <div class="roadmap-phase done">PHASE 1 — COMPLETE</div>
          <div class="roadmap-items">
            <span class="roadmap-tag done">✔ Document Upload & Parsing</span>
            <span class="roadmap-tag done">✔ AI Summarization</span>
            <span class="roadmap-tag done">✔ English / Hindi Support</span>
            <span class="roadmap-tag done">✔ Q&A Functionality</span>
          </div>
        </div>
      </div>
      <div class="roadmap-item">
        <div class="roadmap-dot wip">P2</div>
        <div class="roadmap-content">
          <div class="roadmap-phase wip">PHASE 2 — IN PROGRESS</div>
          <div class="roadmap-items">
            <span class="roadmap-tag wip">⟳ Advanced Risk Assessment</span>
            <span class="roadmap-tag wip">⟳ Domain-Specific Training</span>
            <span class="roadmap-tag wip">⟳ Batch Processing</span>
            <span class="roadmap-tag wip">⟳ Multi-Format Export</span>
          </div>
        </div>
      </div>
      <div class="roadmap-item">
        <div class="roadmap-dot future">P3</div>
        <div class="roadmap-content">
          <div class="roadmap-phase future">PHASE 3 — PLANNED</div>
          <div class="roadmap-items">
            <span class="roadmap-tag future">◌ Mobile App iOS/Android</span>
            <span class="roadmap-tag future">◌ Browser Extension</span>
            <span class="roadmap-tag future">◌ Third-Party API</span>
            <span class="roadmap-tag future">◌ Analytics Dashboard</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
 
<!-- FOOTER -->
<footer class="footer">
  <div class="wrapper">
    <div class="footer-logo">SAMJHO · SOCH · SEEKHO</div>
    <div class="footer-text">
      BUILT WITH ❤️ BY ASHMIT THAKUR · MIT LICENSE · ALPHA v0.0.0
    </div>
    <div class="footer-links">
      <a href="https://github.com/AshmitThakur23/samjho-soch-seekho" target="_blank">GitHub</a>
      <a href="https://github.com/AshmitThakur23/samjho-soch-seekho/issues" target="_blank">Issues</a>
      <a href="https://lovable.dev/projects/1779ca2d-62a0-4d6f-8d40-9b38844ccc6d" target="_blank">Live Demo</a>
    </div>
    <div style="margin-top:32px;font-family:'Share Tech Mono',monospace;font-size:10px;color:rgba(74,96,112,0.4);letter-spacing:0.2em;">
      © 2026 · ALL SYSTEMS NOMINAL · <span style="color:var(--green);">● ONLINE</span>
    </div>
  </div>
</footer>
 
</body>
</html>
 
