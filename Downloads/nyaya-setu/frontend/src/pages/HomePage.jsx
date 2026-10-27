import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";

const copy = {
  en: {
    eyebrow: "A clearer way to review documents",
    title: "Check the details.\nKeep the human in charge.",
    intro: "Compare a land deed and tax receipt side by side. Nyaya Setu helps surface differences so you know what deserves a closer look.",
    start: "Start a new review",
    demo: "Explore sample walkthrough",
    note: "Private by design · PDF files only · Your review stays under your control",
    process: "A simple, transparent process",
    steps: [
      ["01", "Add two documents", "Upload a land deed and its related tax receipt. Your files are checked before review."],
      ["02", "Compare key details", "See names, property area and survey numbers side by side."],
      ["03", "Review before acting", "Look at potential differences, understand the limits and decide your next step."],
    ],
    notice: "An assistant, not a verdict",
    noticeText: "This tool can help highlight differences. It cannot verify legal ownership, diagnose fraud or replace a qualified professional.",
  },
  hi: {
    eyebrow: "दस्तावेज़ जाँचने का एक आसान तरीका",
    title: "जानकारी मिलाएँ।\nअंतिम निर्णय आपका।",
    intro: "भूमि-पत्र और कर रसीद की जानकारी साथ-साथ देखें। न्याय सेतु संभावित अंतर दिखाता है ताकि आप ज़रूरी बातों की दोबारा जाँच कर सकें।",
    start: "नई जाँच शुरू करें",
    demo: "उदाहरण देखें",
    note: "गोपनीयता का ध्यान · केवल PDF · समीक्षा आपके नियंत्रण में",
    process: "सरल और पारदर्शी प्रक्रिया",
    steps: [
      ["01", "दो दस्तावेज़ जोड़ें", "भूमि-पत्र और संबंधित कर रसीद अपलोड करें। समीक्षा से पहले फ़ाइलों की जाँच होगी।"],
      ["02", "मुख्य जानकारी मिलाएँ", "नाम, संपत्ति क्षेत्र और सर्वे नंबर साथ-साथ देखें।"],
      ["03", "कार्रवाई से पहले समीक्षा करें", "संभावित अंतर देखें, सीमाएँ समझें और अगला कदम तय करें।"],
    ],
    notice: "यह सहायक है, कानूनी निर्णय नहीं",
    noticeText: "यह टूल जानकारी में अंतर दिखाने में मदद कर सकता है। यह कानूनी स्वामित्व प्रमाणित नहीं करता और विशेषज्ञ सलाह का विकल्प नहीं है।",
  },
};

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11m-4-4 4 4-4 4" /></svg>;
}

export default function HomePage() {
  const { language } = useLanguage();
  const text = copy[language] ?? copy.en;

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" />{text.eyebrow}</div>
          <h1>{text.title}</h1>
          <p className="hero-intro">{text.intro}</p>
          <div className="hero-actions">
            <Link className="button button-primary" to="/verify">{text.start}<ArrowIcon /></Link>
            <Link className="button button-quiet" to="/verify?demo=true">{text.demo}</Link>
          </div>
          <p className="privacy-note"><span aria-hidden="true">✳</span>{text.note}</p>
        </div>
        <div className="hero-visual" aria-label="Document comparison preview">
          <div className="visual-topline"><span className="live-dot" /> SAMPLE COMPARISON <span className="visual-pill">PREVIEW</span></div>
          <div className="document-pair">
            <div className="paper paper-deed">
              <span className="paper-government">भारत सरकार</span>
              <span className="paper-emblem">◈</span>
              <strong>LAND RECORD</strong>
              <span className="paper-rule" />
              <span className="paper-label">OWNER NAME</span><b>Aarav Sharma</b>
              <span className="paper-label">PROPERTY AREA</span><b>10.5 Acres</b>
              <span className="paper-label">SURVEY NUMBER</span><b>1A/7-3</b>
              <span className="paper-stamp">CERTIFIED<br />COPY</span>
            </div>
            <div className="paper paper-receipt">
              <span className="paper-government">भारत सरकार</span>
              <span className="paper-emblem">◈</span>
              <strong>PROPERTY TAX</strong>
              <span className="paper-rule" />
              <span className="paper-label">OWNER NAME</span><b>A. Sharma</b>
              <span className="paper-label">PROPERTY AREA</span><b className="paper-conflict">9.2 Acres</b>
              <span className="paper-label">SURVEY NUMBER</span><b>1A/7-3</b>
              <span className="receipt-lines" />
            </div>
          </div>
          <div className="compare-callout"><span className="callout-check">!</span><span><b>One detail to review</b><small>Property area differs between documents</small></span><span className="callout-arrow">↗</span></div>
          <div className="visual-footer"><span>Illustrative sample data</span><span>Not a legal assessment</span></div>
        </div>
      </section>

      <section className="process-section">
        <div className="section-heading"><span className="section-kicker">HOW IT WORKS</span><h2>{text.process}</h2></div>
        <div className="process-grid">
          {text.steps.map(([number, title, description]) => (
            <article className="process-card" key={number}>
              <span className="step-number">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <aside className="notice-banner"><span className="notice-icon" aria-hidden="true">i</span><div><strong>{text.notice}</strong><p>{text.noticeText}</p></div></aside>
    </main>
  );
}
