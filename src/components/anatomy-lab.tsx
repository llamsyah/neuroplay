"use client";

import dynamic from "next/dynamic";
import { Component, useState, type ReactNode } from "react";
import { manifest, type SceneStats, type Side, type ViewMode } from "../lib/anatomy";

const BrainScene = dynamic(() => import("./brain-scene"), {
  ssr: false,
  loading: () => <div className="scene-message">Preparing the 3D viewer…</div>,
});

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return <div className="scene-message" role="alert">
      <strong>The anatomy viewer could not load.</strong>
      <p>Check that WebGL 2 is enabled and the local model file is available.</p>
      <button onClick={() => window.location.reload()}>Reload viewer</button>
    </div>;
    return this.props.children;
  }
}

export default function AnatomyLab() {
  const [mode, setMode] = useState<ViewMode>("whole");
  const [side, setSide] = useState<Side>("both");
  const [opacity, setOpacity] = useState(0.02);
  const [hovered, setHovered] = useState("");
  const [stats, setStats] = useState<SceneStats | null>(null);
  const [focusRequest, setFocusRequest] = useState(0);
  const [resetRequest, setResetRequest] = useState(0);

  function changeMode(next: ViewMode) {
    setHovered("");
    setMode(next);
  }

  return <main className="lab">
    <header className="topbar">
      <a className="wordmark" href="/" aria-label="Neuroplay home"><span className="brand-mark">n</span>NEUROPLAY<span className="lab-tag">/ LAB</span></a>
      <span className="phase"><span className="status-dot" />PHASE 0 · TECHNICAL FEASIBILITY</span>
    </header>

    <div className="workspace">
      <section className="viewport" aria-label="Interactive anatomical brain viewer">
        <div className="viewport-heading"><span className="eyebrow">EXPERIMENT 001</span><h1>Look beneath<br />the surface.</h1><p>Whole brain → hippocampus</p></div>
        <SceneBoundary><BrainScene mode={mode} side={side} contextOpacity={opacity}
          focusRequest={focusRequest} resetRequest={resetRequest} onHover={setHovered}
          onReady={setStats} onSelectHippocampus={(selectedSide) => { setSide(selectedSide); changeMode("reveal"); }} />
        </SceneBoundary>
        <div className="view-label"><span className="status-dot" />{mode === "whole" ? "ANATOMICAL CONTEXT" : mode === "reveal" ? "TRANSPARENT CONTEXT" : "ISOLATED STRUCTURE"}</div>
        <div className="hover-label" aria-live="polite">{hovered || "Hover over anatomy to inspect a structure"}</div>
        <div className="viewport-bottom"><span>Drag to rotate <i>·</i> Scroll / pinch to zoom</span><button className="text-button" onClick={() => setResetRequest((n) => n + 1)}>Reset camera ↗</button></div>
      </section>

      <aside className="panel">
        <div className="panel-intro"><span className="eyebrow">ANATOMY WORKBENCH</span><h2>One brain.<br />A closer look.</h2><p>Test a real segmented atlas in its original anatomical context.</p></div>
        <fieldset disabled={!stats}><legend>01 <span>Choose a view</span></legend><div className="view-options">
          {([ ["whole", "Whole brain", "Observe the surrounding anatomy"], ["reveal", "Reveal hippocampus", "Fade context and move closer"], ["isolate", "Isolate hippocampus", "Hide the surrounding structures"] ] as const).map(([value, title, subtitle]) =>
            <button key={value} className={`view-option ${mode === value ? "active" : ""}`} aria-pressed={mode === value} onClick={() => changeMode(value)}><span className="option-indicator" /><span><strong>{title}</strong><small>{subtitle}</small></span><span className="option-arrow">↗</span></button>)}
        </div></fieldset>
        <fieldset disabled={!stats}><legend>02 <span>Hippocampus selection</span></legend><div className="segmented">
          {(["both", "left", "right"] as const).map((value) => <button key={value} aria-pressed={side === value} onClick={() => { setSide(value); setHovered(""); }}>{value === "both" ? "Both sides" : value === "left" ? "Left" : "Right"}</button>)}
        </div><button className="focus-button" onClick={() => { if (mode === "whole") changeMode("reveal"); setFocusRequest((n) => n + 1); }}>Focus selection <span>↗</span></button></fieldset>
        <fieldset disabled={!stats || mode !== "reveal"}><legend>03 <span>Surrounding anatomy</span></legend><label className="range-label" htmlFor="opacity">Context opacity <output>{Math.round(opacity * 100)}%</output></label><input id="opacity" type="range" min="0" max="0.4" step="0.01" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} /><p className="control-note">Transparency is experimental. Isolate hides context completely.</p></fieldset>
        <div className="asset-status" role="status"><span className="status-dot" /><span>{stats ? `${stats.meshes} meshes loaded · ${stats.targetMeshes} selected` : "Loading atlas · 11.42 MiB"}</span></div>
        <p className="asset-credit">Anatomy: <a href={manifest.doi}>Browne & Schlehlein / HRA</a> · <a href={manifest.licenseUrl}>CC BY 4.0</a></p>
        <details className="source-details"><summary>Source & experiment limits</summary><p>{manifest.title}. Kristen Browne & Heidi Schlehlein, HuBMAP (2023). <a href={manifest.doi} target="_blank" rel="noreferrer">Source / citation ↗</a> · <a href={manifest.licenseUrl} target="_blank" rel="noreferrer">CC BY 4.0 ↗</a></p><p>The source mirrors one hemisphere. This is a reference atlas, with stylized materials; it does not represent individual variation. The hippocampus head, body, and tail are named in the source, but lack ontology IDs.</p><p>Geometry is unchanged. Display changes: uniform scaling, recentering, color, opacity, and visibility. Internal structures stay in their original relative positions.</p><a href="/models/ATTRIBUTION.md">Full asset notice ↗</a></details>
      </aside>
    </div>
    <footer className="footer"><span>SCIENTIFIC ASSET · HRA / ALLEN REFERENCE ANATOMY</span><span>Feasibility experiment · educational design pending review</span></footer>
  </main>;
}
