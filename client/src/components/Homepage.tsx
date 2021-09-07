import React from "react";
import "./Homepage.scss"
import { withTranslation } from "react-i18next";
import "../services/i18n";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";


const Homepage = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (event) => {
      i18n.changeLanguage(event.target.value);
    };
  
  

    return(<h3>  {t("home.label")}</h3>)

}

export default Homepage