import { createContext, useContext, useMemo, useState } from "react";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem("nyaya-language") ?? "en");
  function changeLanguage(nextLanguage) {
    localStorage.setItem("nyaya-language", nextLanguage);
    setLanguage(nextLanguage);
  }
  const value = useMemo(() => ({ language, setLanguage: changeLanguage }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
