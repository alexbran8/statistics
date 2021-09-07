import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ToggleSwitch from "./toggleSwitch/ToggleSwitch";

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  let [lang, setLang] = useState(true);

  useEffect(() => {
    i18n.changeLanguage("ro");
    setLang(false);
  }, []);

  const changeLanguage = (checked) => {
    setLang(checked);
    if (checked) {
      i18n.changeLanguage("en");
    }
    if (!checked) {
      i18n.changeLanguage("ro");
    }
  };

  return (
    <div>
      <ToggleSwitch id="language" checked={lang} onChange={changeLanguage} />
    </div>
  );
};
export default LanguageSelector;
