"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { manifest } from "../lib/anatomy";
import type { BrainAction, BrainCommand } from "./hero-brain-scene";
import styles from "./homepage.module.css";

const HeroBrainScene = dynamic(() => import("./hero-brain-scene"), { ssr: false });

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>;
}

class ModelBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() {
    if (this.state.failed) return <div className={styles.modelError} role="alert">
      <p>Model 3D belum dapat ditampilkan.</p>
      <span>Periksa koneksi dan dukungan WebGL di peramban Anda.</span>
      <button onClick={() => window.location.reload()}>Coba muat ulang <Arrow /></button>
    </div>;
    return this.props.children;
  }
}

const questions = [
  { number: "01", topic: "INGATAN", question: "Mengapa sebagian ingatan bertahan, sementara yang lain memudar?" },
  { number: "02", topic: "PERHATIAN", question: "Mengapa pikiran mudah beralih saat kita ingin fokus?" },
  { number: "03", topic: "PERSEPSI", question: "Apakah yang kita lihat selalu sama dengan kenyataan?" },
];

export default function Homepage() {
  const [loaded, setLoaded] = useState(false);
  const [modelFailed, setModelFailed] = useState(false);
  const [nearViewport, setNearViewport] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [touchActive, setTouchActive] = useState(false);
  const [command, setCommand] = useState<BrainCommand>({ action: "reset", sequence: 0 });
  const stage = useRef<HTMLElement>(null);
  const onReady = useCallback(() => setLoaded(true), []);
  const onFailure = useCallback(() => setModelFailed(true), []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const breakpoint = window.matchMedia("(max-width: 720px)");
    const update = () => setMobile(breakpoint.matches);
    update();
    breakpoint.addEventListener("change", update);
    return () => breakpoint.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!stage.current || !("IntersectionObserver" in window)) { setNearViewport(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearViewport(true); observer.disconnect(); }
    }, { rootMargin: "300px" });
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  function act(action: BrainAction) { setCommand((previous) => ({ action, sequence: previous.sequence + 1 })); }
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    const actions: Record<string, BrainAction> = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down", "+": "in", "=": "in", "-": "out", "0": "reset", Home: "reset" };
    const action = actions[event.key];
    if (action && loaded) { event.preventDefault(); act(action); }
  }

  return <main className={styles.home} id="beranda">
    <a className={styles.skipLink} href="#jelajah">Lewati ke eksplorasi otak</a>
    <header className={styles.header}>
      <a className={styles.wordmark} href="#beranda" aria-label="NEUROPLAY, beranda">neuroplay<span aria-hidden="true">.</span></a>
      <nav aria-label="Navigasi utama" className={styles.navigation}>
        <a href="#jelajah">Eksplorasi</a>
        <a href="#rasa-ingin-tahu">Rasa ingin tahu</a>
      </nav>
      <a href="#jelajah" className={styles.navEntry}>Mulai menjelajah <Arrow diagonal /></a>
    </header>

    <section className={styles.intro} aria-labelledby="hero-title">
      <p className={styles.eyebrow}><span aria-hidden="true" /> TENTANG OTAK. TENTANG KITA.</p>
      <h1 id="hero-title">Memahami pikiran.<br /><em>Menjelajahi otak.</em></h1>
      <p className={styles.introCopy}>Temukan hubungan antara pengalaman manusia dan mekanisme otak<br className={styles.desktopBreak} /> melalui eksplorasi 3D, pertanyaan, dan eksperimen interaktif.</p>
    </section>

    <section className={styles.exploration} id="jelajah" ref={stage} aria-label="Jelajahi model otak manusia">
      <div className={styles.atmosphere} aria-hidden="true" />
      <div className={styles.modelArea}>
        <ModelBoundary onFailure={onFailure}>
          <div className={`${styles.modelViewport} ${mobile && !touchActive ? styles.passiveViewport : ""}`} tabIndex={0} role="group" aria-label="Kontrol model otak 3D"
            aria-describedby="brain-instructions brain-keyboard-instructions" onKeyDown={keyboard}
            onPointerDown={(event) => event.currentTarget.focus({ preventScroll: true })}>
            {nearViewport && <HeroBrainScene command={command} reducedMotion={reducedMotion} interactive={!mobile || touchActive} onReady={onReady} />}
            {!loaded && <div className={styles.modelLoading} role="status"><span className={styles.loadingRing} aria-hidden="true" /><p>Memuat anatomi 3D…</p></div>}
          </div>
        </ModelBoundary>
        <div className={styles.modelBottom}>
          <p id="brain-instructions" className={styles.gestureHint}><svg aria-hidden="true" width="19" height="23" viewBox="0 0 19 23" fill="none"><rect x="3.5" y="1.5" width="12" height="19" rx="6" stroke="currentColor" /><path d="M9.5 5v4" stroke="currentColor" strokeLinecap="round" /></svg><span>{mobile ? touchActive ? "Seret untuk memutar. Cubit untuk memperbesar." : "Aktifkan sentuhan, atau gunakan tombol di bawah." : <>Seret untuk memutar <span className={styles.hintSeparator}>/</span> Gulir untuk memperbesar</>}</span></p>
          <span id="brain-keyboard-instructions" className="visually-hidden">Saat model mendapat fokus, gunakan tombol panah untuk memutar, plus dan minus untuk memperbesar atau memperkecil, dan nol untuk mengatur ulang.</span>
          <button className={styles.touchToggle} disabled={!loaded} aria-pressed={touchActive} onClick={() => setTouchActive((active) => !active)}>{touchActive ? "Selesai memutar" : "Putar dengan sentuhan"}</button>
          <div className={styles.modelControls} aria-label="Tombol kontrol otak">
            <button disabled={!loaded} onClick={() => act("left")} aria-label="Putar otak ke kiri" title="Putar ke kiri (←)"><svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="m10 7-5 5 5 5m-5-5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
            <button disabled={!loaded} onClick={() => act("right")} aria-label="Putar otak ke kanan" title="Putar ke kanan (→)"><Arrow /></button>
            <span className={styles.controlDivider} />
            <button disabled={!loaded} onClick={() => act("out")} aria-label="Perkecil model otak" title="Perkecil (−)">−</button>
            <button disabled={!loaded} onClick={() => act("in")} aria-label="Perbesar model otak" title="Perbesar (+)">+</button>
            <button disabled={!loaded} onClick={() => act("reset")} aria-label="Atur ulang tampilan otak" title="Atur ulang (0)"><svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M5 9a7.5 7.5 0 1 1-.1 6M5 4v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>
          </div>
        </div>
      </div>
      <div className={styles.exploreEntry}>
        <span className={styles.exploreKicker}>LANJUTKAN EKSPLORASI</span>
        <Link href="/lab" className={styles.exploreButton}>Jelajahi otak <span><Arrow diagonal /></span></Link>
        <p>Lihat lebih dekat. Temukan struktur di balik permukaannya.</p>
      </div>
      <div className={styles.explorationFootnote}><span>Model anatomi 3D interaktif</span><a href="/models/ATTRIBUTION.md">Sumber & atribusi <Arrow diagonal /></a></div>
      <span className="visually-hidden" role="status">{modelFailed ? "Model otak tidak dapat ditampilkan." : loaded ? "Model otak siap dieksplorasi." : "Model otak sedang dimuat."}</span>
    </section>

    <section className={styles.discovery} id="rasa-ingin-tahu" aria-labelledby="discovery-title">
      <div className={styles.discoveryIntro}>
        <p className={styles.sectionLabel}>BERAWAL DARI PERTANYAAN</p>
        <h2 id="discovery-title">Ada apa<br />di balik<br /><em>pengalaman kita?</em></h2>
        <p>Ingatan, perhatian, persepsi. Pengalaman yang akrab, dengan banyak hal untuk dipahami.</p>
        <span className={styles.conceptLabel}>KONSEP PENGALAMAN BERIKUTNYA</span>
        <p className={styles.conceptNote}>Topik berikut adalah cuplikan arah belajar. Modul interaktifnya belum tersedia.</p>
      </div>
      <div className={styles.questions}>
        {questions.map((item) => <article key={item.number} className={styles.question}>
          <div className={styles.questionMeta}><span>{item.number}</span><span>{item.topic}</span></div>
          <h3>{item.question}</h3>
          <span className={styles.questionStatus}>Untuk dijelajahi nanti</span>
        </article>)}
      </div>
    </section>

    <footer className={styles.footer}>
      <div className={styles.footerTop}><a className={styles.wordmark} href="#beranda">neuroplay<span aria-hidden="true">.</span></a><p>Ruang untuk memahami otak.</p><Link href="/lab">Buka lab teknis <Arrow diagonal /></Link></div>
      <div className={styles.footerBottom}>
        <p>Anatomi: <a href={manifest.doi}>Browne & Schlehlein / Human Reference Atlas</a> · <a href={manifest.licenseUrl}>CC BY 4.0</a></p>
        <details><summary>Tentang model & prototipe</summary><p>Atlas ini menggunakan pencerminan satu hemisfer. Geometri sumber dipertahankan; warna, pencahayaan, skala seragam, dan posisi keseluruhan disesuaikan untuk tampilan. Halaman ini adalah prototipe pengalaman; kelayakan anatomi dan kinerja pada perangkat sasaran masih memerlukan peninjauan. <a href="/models/ATTRIBUTION.md">Lihat atribusi lengkap.</a></p></details>
      </div>
    </footer>
  </main>;
}
