import { BrowserRouter, Link, NavLink, Navigate, Route, Routes } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import HistoryPage from "../pages/HistoryPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import ResultPage from "../pages/ResultPage.jsx";
import VerifyPage from "../pages/VerifyPage.jsx";

function Shell() {
  const { language, setLanguage } = useLanguage();

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="topbar">
          <Link className="brand" to="/" aria-label="Nyaya Setu home">
            <span className="brand-mark" aria-hidden="true">न</span>
            <span><strong>Nyaya Setu</strong><small>DOCUMENT ASSIST</small></span>
          </Link>
          <nav className="main-nav" aria-label="Main navigation">
            <NavLink to="/" end>{language === "hi" ? "होम" : "Home"}</NavLink>
            <NavLink to="/verify">{language === "hi" ? "जाँच शुरू करें" : "New verification"}</NavLink>
            <NavLink to="/history">{language === "hi" ? "इतिहास" : "History"}</NavLink>
            <NavLink to="/about">{language === "hi" ? "जानकारी" : "About"}</NavLink>
          </nav>
          <button className="language-toggle" type="button" onClick={() => setLanguage(language === "en" ? "hi" : "en")} aria-label="Toggle language">
            {language === "en" ? "हिंदी" : "English"}
          </button>
        </header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/result/:id" element={<ResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <footer className="site-footer">
          <span>Nyaya Setu <span className="footer-dot">•</span> A document review assistant</span>
          <span>Informational only · Always verify with an authorized professional</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default function AppRoutes() {
  return <Shell />;
}
