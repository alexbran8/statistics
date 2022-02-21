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
  
  

    return(  <div className="homeContainer">
    <div>
      {/* add user to redux */}
      {!sessionStorage.getItem('userEmail') ? (
        <h1>Welcome! Please login in order to continue...</h1>

      ) : (
        <div>


          <h1>You have been logged in succcessfully!</h1>
          <h2>Welcome {sessionStorage.getItem('userEmail')}!</h2>
        </div>
      )}
      <div className="notification-container">
        <h3 style={{ color: "orange" }}>Working on refactoring the authentification check once token expires so that it will refresh automatically... </h3>
      </div>
    </div>
  </div>)

}

export default Homepage