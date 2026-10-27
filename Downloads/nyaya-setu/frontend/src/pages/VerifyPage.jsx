import { useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { verifyDocuments } from "../services/verificationService.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ACCEPTED_IMAGE_EXTENSIONS = /\.(jpe?g|png|webp)$/i;

function isSupportedDocument(file) {
  const name = file.name.toLowerCase();
  return file.type === "application/pdf"
    || name.endsWith(".pdf")
    || ACCEPTED_IMAGE_TYPES.has(file.type)
    || ACCEPTED_IMAGE_EXTENSIONS.test(name);
}

const sampleCase = {
  id: "NS-DEMO-0043",
  fields: [
    { name: "Owner name", deed: "Aarav Sharma", receipt: "A. Sharma", status: "Review" },
    { name: "Property area", deed: "10.5 Acres", receipt: "9.2 Acres", status: "Different" },
    { name: "Survey number", deed: "1A/7-3", receipt: "1A/7-3", status: "Match" },
  ],
};

const translations = {
  en: {
    kicker: "DOCUMENT REVIEW WORKSPACE", welcome: "A careful review starts with clear documents.",
    stepTitles: ["Document intake", "Cross-analysis", "Detailed review", "Case summary"],
    intro: "Upload the land deed and tax receipt for a side-by-side comparison. Files are only sent to the verification service when you choose to submit.",
    demoTitle: "Want to explore first?", demoText: "Walk through a sample using fictional information. No files are uploaded and no AI is called.",
    demoButton: "Use sample documents", docOne: "LAND DEED", docTwo: "PROPERTY TAX RECEIPT",
    choose: "Choose file", remove: "Remove", waiting: "PDF or image · JPG, PNG, WebP",
    uploadHelp: "PDF or image · JPG, PNG, WebP · Up to 10 MB per file", instructions: "For best results, use clear scans of documents for the same property.",
    start: "Submit documents", analyzing: "Sending documents…", back: "Back to home",
    consent: "By submitting, you confirm that you are authorized to share these files for review.",
    stages: ["DOCUMENT INTAKE", "CROSS-ANALYSIS", "DETAILED REVIEW", "CASE SUMMARY"],
    demoBadge: "SAMPLE WALKTHROUGH · FICTIONAL DATA",
    summaryTitle: "Initial comparison", summaryIntro: "The sample documents contain details that deserve a closer look. This is illustrative data only.",
    field: "Field", deed: "Land deed", receipt: "Tax receipt", status: "Comparison",
    noFields: "No readable fields could be compared. Try clearer document scans.",
    reviewFindings: "Items for human review", noDifferences: "No clear differences identified",
    warning: "Differences found in sample data", warningText: "Two sample fields differ. A mismatch is not proof of wrongdoing; confirm details against original records.",
    continue: "Review details", edit: "Back to documents", auditTitle: "Detailed field review", auditIntro: "Review the example differences carefully. No legal conclusion is made.",
    nameAudit: "OWNER NAME", areaAudit: "PROPERTY AREA", match: "Match", review: "Review", different: "Different",
    nameText: "The names are similar but not identical. Check the original records and accepted name variations.",
    areaText: "The stated area differs by 1.3 acres in this example. Confirm the measurement and source documents.",
    riskTitle: "Review priority", riskDescription: "High attention recommended in this fictional example. This is not a fraud score or legal opinion.",
    finalReview: "View sample case summary", finalTitle: "Sample review complete", finalText: "This sample walkthrough is complete. It used fictional data and did not verify real documents.",
    nextTitle: "Suggested next steps", nextSteps: ["Compare each detail with the original documents.", "Ask the relevant land-record or tax office to clarify discrepancies.", "Consult an authorized professional before making a decision."],
    print: "Print / save as PDF", newReview: "Start a new review", apiError: "Could not reach the verification service. Make sure the backend is running at http://localhost:8080 and try again.",
    apiFinalTitle: "Document review complete", apiFinalText: "AI-assisted comparison finished. Please check every detail against the original documents; this is not a legal decision.",
    disclaimer: "Nyaya Setu is an informational document-review aid. It does not provide legal advice or determine ownership or fraud.",
    invalidType: "Choose a PDF, JPG, PNG, or WebP image.", tooLarge: "Each file must be 10 MB or smaller.", selected: "Selected", score: "Priority",
  },
  hi: {
    kicker: "दस्तावेज़ समीक्षा कार्यक्षेत्र", welcome: "ध्यानपूर्वक समीक्षा की शुरुआत साफ़ दस्तावेज़ों से होती है।",
    stepTitles: ["दस्तावेज़", "तुलना", "विस्तृत समीक्षा", "सारांश"],
    intro: "साथ-साथ तुलना के लिए भूमि-पत्र और कर रसीद अपलोड करें। फ़ाइलें तभी भेजी जाती हैं जब आप सबमिट करते हैं।",
    demoTitle: "पहले उदाहरण देखना चाहेंगे?", demoText: "काल्पनिक जानकारी के साथ नमूना देखें। कोई फ़ाइल अपलोड नहीं होती और AI कॉल नहीं होता।",
    demoButton: "नमूना दस्तावेज़ इस्तेमाल करें", docOne: "भूमि-पत्र", docTwo: "संपत्ति कर रसीद",
    choose: "फ़ाइल चुनें", remove: "हटाएँ", waiting: "PDF या तस्वीर · JPG, PNG, WebP",
    uploadHelp: "PDF या तस्वीर · JPG, PNG, WebP · हर फ़ाइल 10 MB तक", instructions: "बेहतर परिणाम के लिए एक ही संपत्ति के साफ़ स्कैन इस्तेमाल करें।",
    start: "दस्तावेज़ सबमिट करें", analyzing: "दस्तावेज़ भेजे जा रहे हैं…", back: "होम पर वापस",
    consent: "सबमिट करके आप पुष्टि करते हैं कि समीक्षा के लिए इन फ़ाइलों को साझा करने की अनुमति है।",
    stages: ["दस्तावेज़", "तुलना", "विस्तृत समीक्षा", "सारांश"],
    demoBadge: "नमूना · काल्पनिक जानकारी",
    summaryTitle: "प्रारंभिक तुलना", summaryIntro: "नमूना दस्तावेज़ों में कुछ जानकारी है जिसकी दोबारा समीक्षा होनी चाहिए।",
    field: "जानकारी", deed: "भूमि-पत्र", receipt: "कर रसीद", status: "तुलना",
    noFields: "पढ़ने योग्य जानकारी की तुलना नहीं हो सकी। साफ़ स्कैन आज़माएँ।",
    reviewFindings: "मानवीय समीक्षा के लिए बिंदु", noDifferences: "कोई स्पष्ट अंतर नहीं मिला",
    warning: "नमूने में अंतर मिला", warningText: "नमूने की दो जानकारियाँ अलग हैं। अंतर गलत काम का प्रमाण नहीं है; मूल रिकॉर्ड जाँचें।",
    continue: "विस्तार से देखें", edit: "दस्तावेज़ों पर वापस", auditTitle: "जानकारी की विस्तृत समीक्षा", auditIntro: "उदाहरण के अंतरों की सावधानी से समीक्षा करें। कोई कानूनी निष्कर्ष नहीं दिया गया है।",
    nameAudit: "मालिक का नाम", areaAudit: "संपत्ति का क्षेत्र", match: "मेल", review: "समीक्षा", different: "अलग",
    nameText: "नाम मिलते-जुलते हैं लेकिन एक जैसे नहीं। मूल रिकॉर्ड और मान्य नाम-रूप जाँचें।",
    areaText: "इस उदाहरण में क्षेत्रफल में 1.3 एकड़ का अंतर है। माप और मूल दस्तावेज़ की पुष्टि करें।",
    riskTitle: "समीक्षा प्राथमिकता", riskDescription: "इस काल्पनिक उदाहरण में ध्यानपूर्वक जाँच की सलाह है। यह धोखाधड़ी स्कोर या कानूनी राय नहीं है।",
    finalReview: "नमूना सारांश देखें", finalTitle: "नमूना समीक्षा पूरी हुई", finalText: "यह नमूना काल्पनिक जानकारी से था और इसमें वास्तविक दस्तावेज़ों की जाँच नहीं हुई।",
    nextTitle: "आगे के सुझाव", nextSteps: ["हर जानकारी की मूल दस्तावेज़ों से तुलना करें।", "संबंधित भूमि-अभिलेख या कर कार्यालय से अंतर स्पष्ट करने को कहें।", "निर्णय से पहले अधिकृत विशेषज्ञ से सलाह लें।"],
    print: "प्रिंट / PDF के रूप में सहेजें", newReview: "नई समीक्षा शुरू करें", apiError: "सत्यापन सेवा से कनेक्ट नहीं हो सका। backend चालू करें (http://localhost:8080) और फिर कोशिश करें।",
    apiFinalTitle: "दस्तावेज़ समीक्षा पूरी हुई", apiFinalText: "AI-सहायता वाली तुलना पूरी हुई। मूल दस्तावेज़ों से सभी जानकारियाँ जाँचें; यह कानूनी निर्णय नहीं है।",
    disclaimer: "न्याय सेतु केवल जानकारी की समीक्षा में मदद करता है। यह कानूनी सलाह नहीं देता और स्वामित्व या धोखाधड़ी तय नहीं करता।",
    invalidType: "PDF, JPG, PNG या WebP तस्वीर चुनें।", tooLarge: "हर फ़ाइल 10 MB या उससे छोटी होनी चाहिए।", selected: "चुनी गई", score: "प्राथमिकता",
  },
};

function StepIcon({ number, complete }) {
  return <span className={`wizard-step-icon ${complete ? "is-complete" : ""}`}>{complete ? "✓" : number}</span>;
}

function UploadCard({ title, file, onChange, onRemove, t }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  function selectFile(nextFile) {
    setError("");
    if (!nextFile) return;
    if (!isSupportedDocument(nextFile)) {
      setError(t.invalidType);
      return;
    }
    if (nextFile.size > MAX_FILE_SIZE) {
      setError(t.tooLarge);
      return;
    }
    onChange(nextFile);
  }

  return (
    <div
      className={`upload-card ${file ? "has-file" : ""} ${isDragging ? "is-dragging" : ""}`}
      onDragOver={(event) => event.preventDefault()}
      onDragEnter={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        selectFile(event.dataTransfer.files?.[0]);
      }}
    >
      <input ref={inputRef} className="visually-hidden" type="file" accept="application/pdf,.pdf,image/jpeg,.jpg,.jpeg,image/png,.png,image/webp,.webp" onChange={(event) => selectFile(event.target.files?.[0])} />
      <span className="upload-icon" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M8 3.5h10l7 7V28H8zM18 4v7h7M12 17h9M12 21h9M12 25h5" /></svg></span>
      <div className="upload-card-copy">
        <span className="upload-label">{title}</span>
        {file ? <span className="file-name">{file.name}</span> : <span className="upload-empty">{t.waiting}</span>}
      </div>
      {file ? (
        <button className="file-action" type="button" onClick={onRemove} aria-label={`${t.remove} ${file.name}`}>{t.remove}</button>
      ) : (
        <button className="button button-outline upload-action" type="button" onClick={() => inputRef.current?.click()}>{t.choose}</button>
      )}
      {error && <span className="field-error" role="alert">{error}</span>}
    </div>
  );
}

function Stepper({ step, t }) {
  return (
    <div className="stepper" aria-label="Verification progress">
      {t.stages.map((label, index) => {
        const number = index + 1;
        return <div className={`stepper-item ${number === step ? "current" : ""} ${number < step ? "done" : ""}`} key={label}>
          <StepIcon number={number} complete={number < step} />
          <span>{t.stages[index]}</span>
        </div>;
      })}
    </div>
  );
}

function ComparisonResults({ t, result, isDemo }) {
  const fields = isDemo
    ? sampleCase.fields.map((field) => ({
      field: field.name,
      landDeedValue: field.deed,
      taxReceiptValue: field.receipt,
      status: field.status === "Match" ? "MATCH" : field.status === "Review" ? "REVIEW" : "MISMATCH",
    }))
    : result.fields;
  const redFlags = isDemo ? [t.warningText] : result.redFlags;
  const caseId = isDemo ? sampleCase.id : result.caseId;

  return (
    <>
      {isDemo && <div className="demo-banner"><span aria-hidden="true">✦</span><div><strong>{t.demoBadge}</strong><small>These example findings are not produced by AI and are not from real documents.</small></div></div>}
      <div className="section-title-row"><div><span className="section-kicker">STEP 02</span><h2>{t.summaryTitle}</h2><p>{isDemo ? t.summaryIntro : result.summary}</p></div><span className="case-id">CASE {caseId}</span></div>
      <div className="table-wrap">
        <table className="comparison-table"><thead><tr><th>{t.field}</th><th>{t.deed}</th><th>{t.receipt}</th><th>{t.status}</th></tr></thead>
          <tbody>{fields.map((field, index) => {
            const isMatch = field.status === "MATCH";
            const needsReview = field.status === "REVIEW";
            const displayStatus = isMatch ? t.match : needsReview ? t.review : t.different;
            return <tr key={`${field.field}-${index}`}><th>{field.field}</th><td>{field.landDeedValue}</td><td>{field.taxReceiptValue}</td><td><span className={`match-status ${isMatch ? "match" : needsReview ? "review" : "different"}`}>{isMatch ? "✓" : needsReview ? "!" : "×"} {displayStatus}</span></td></tr>;
          })}</tbody>
        </table>
      </div>
      {fields.length === 0 && <p className="empty-results">{t.noFields}</p>}
      <div className={`review-alert ${redFlags.length === 0 ? "success-alert" : ""}`}><span className="alert-symbol">{redFlags.length === 0 ? "✓" : "!"}</span><div><strong>{redFlags.length === 0 ? t.noDifferences : t.reviewFindings}</strong>{redFlags.map((flag, index) => <p key={index}>{flag}</p>)}</div></div>
    </>
  );
}

function DetailedReview({ t, result, isDemo }) {
  const riskScore = isDemo ? 68 : result.riskScore;
  const findings = isDemo
    ? sampleCase.fields.filter((field) => field.status !== "Match").map((field) => ({
      field: field.name,
      landDeedValue: field.deed,
      taxReceiptValue: field.receipt,
      status: field.status === "Review" ? "REVIEW" : "MISMATCH",
      explanation: field.name === "Owner name" ? t.nameText : t.areaText,
    }))
    : result.fields.filter((field) => field.status !== "MATCH");

  return (
    <>
      <div className="section-title-row"><div><span className="section-kicker">STEP 03</span><h2>{t.auditTitle}</h2><p>{t.auditIntro}</p></div><span className="priority-pill">{t.score}: {riskScore}/100</span></div>
      <div className="audit-grid">
        {findings.map((field) => <article className="audit-card" key={field.field}><div className="audit-heading"><span>{field.field}</span><span className="audit-badge mismatch">{field.status === "REVIEW" ? t.review : t.different}</span></div><div className="audit-values"><div><small>{t.deed}</small><strong>{field.landDeedValue}</strong></div><div><small>{t.receipt}</small><strong>{field.taxReceiptValue}</strong></div></div><p>{field.explanation}</p></article>)}
      </div>
      {findings.length === 0 && <p className="empty-results">{t.noDifferences}</p>}
      <div className="review-alert risk-alert"><span className="alert-symbol">!</span><div><strong>{t.riskTitle} · {riskScore}/100</strong><p>{isDemo ? t.riskDescription : result.summary}</p></div></div>
    </>
  );
}

function FinalSummary({ t, onPrint, onNew, isDemo }) {
  return (
    <>
      <div className="completion-heading"><span className="completion-check">✓</span><span className="section-kicker">{isDemo ? "STEP 04 · SAMPLE" : "STEP 04 · COMPLETE"}</span><h2>{isDemo ? t.finalTitle : t.apiFinalTitle}</h2><p>{isDemo ? t.finalText : t.apiFinalText}</p></div>
      <section className="next-steps"><h3>{t.nextTitle}</h3><ol>{t.nextSteps.map((item) => <li key={item}>{item}</li>)}</ol></section>
      <div className="workflow-actions"><button className="button button-outline" type="button" onClick={onPrint}>{t.print}</button><button className="button button-primary" type="button" onClick={onNew}>{t.newReview}</button></div>
    </>
  );
}

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const isSampleRoute = searchParams.get("demo") === "true";
  const [step, setStep] = useState(1);
  const [files, setFiles] = useState([null, null]);
  const [isDemo, setIsDemo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const { language } = useLanguage();
  const t = useMemo(() => translations[language] ?? translations.en, [language]);

  async function submitFiles() {
    setError("");
    setAnalysis(null);
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("landDeed", files[0]);
    formData.append("taxReceipt", files[1]);
    try {
      const result = await verifyDocuments(formData);
      setAnalysis(result);
      setIsDemo(false);
      setStep(2);
    } catch (requestError) {
      const serverMessage = requestError?.response?.data?.message ?? requestError?.response?.data?.detail;
      setError(typeof serverMessage === "string" && serverMessage.trim() ? serverMessage : t.apiError);
    } finally {
      setIsSubmitting(false);
    }
  }

  function useSample() {
    setIsDemo(true);
    setError("");
    setAnalysis(null);
    setStep(2);
  }

  function reset() {
    setFiles([null, null]);
    setIsDemo(false);
    setStep(1);
    setError("");
    setAnalysis(null);
  }

  return (
    <main className="workspace">
      <div className="workspace-heading"><div><span className="section-kicker">{t.kicker}</span><h1>{step === 1 ? t.welcome : t.stepTitles[step - 1]}</h1><p>{step === 1 ? t.intro : `CASE ${isDemo ? sampleCase.id : analysis?.caseId ?? ""} · ${isDemo ? t.demoBadge : "DOCUMENT REVIEW"}`}</p></div><Link className="back-link" to="/">← {t.back}</Link></div>
      <Stepper step={step} t={t} />
      <section className="workflow-panel">
        {step === 1 && <>
          {isSampleRoute && <div className="demo-invite"><div><strong>{t.demoTitle}</strong><p>{t.demoText}</p></div><button className="button button-outline" type="button" onClick={useSample}>{t.demoButton}</button></div>}
          <div className="upload-grid">
            <UploadCard title={t.docOne} file={files[0]} onChange={(file) => setFiles((current) => [file, current[1]])} onRemove={() => setFiles((current) => [null, current[1]])} t={t} />
            <UploadCard title={t.docTwo} file={files[1]} onChange={(file) => setFiles((current) => [current[0], file])} onRemove={() => setFiles((current) => [current[0], null])} t={t} />
          </div>
          <div className="upload-guidance"><span aria-hidden="true">ⓘ</span><div><strong>{t.uploadHelp}</strong><p>{t.instructions}</p></div></div>
          <div className="privacy-callout"><span aria-hidden="true">♧</span><span>{t.consent}</span></div>
          {error && <div className="inline-error" role="alert">{error}</div>}
          <div className="workflow-actions"><button className="button button-primary" type="button" onClick={submitFiles} disabled={!files[0] || !files[1] || isSubmitting}>{isSubmitting ? t.analyzing : <>{t.start}<span aria-hidden="true"> →</span></>}</button></div>
        </>}
        {step === 2 && <><ComparisonResults t={t} result={analysis} isDemo={isDemo} /><div className="workflow-actions"><button className="button button-outline" type="button" onClick={() => setStep(1)}>{t.edit}</button><button className="button button-primary" type="button" onClick={() => setStep(3)}>{t.continue}<span aria-hidden="true"> →</span></button></div></>}
        {step === 3 && <><DetailedReview t={t} result={analysis} isDemo={isDemo} /><div className="workflow-actions"><button className="button button-outline" type="button" onClick={() => setStep(2)}>{t.edit}</button><button className="button button-primary" type="button" onClick={() => setStep(4)}>{t.finalReview}<span aria-hidden="true"> →</span></button></div></>}
        {step === 4 && <FinalSummary t={t} onPrint={() => window.print()} onNew={reset} isDemo={isDemo} />}
      </section>
      <p className="workspace-disclaimer">{t.disclaimer}</p>
    </main>
  );
}
