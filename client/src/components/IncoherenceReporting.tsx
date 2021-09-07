import React, { useState } from "react";
import "./IncoherenceReporting.scss"
import { withTranslation } from "react-i18next";
import "../services/i18n";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";
import ExcelReader from "./ExcelReader";
import Button from '@material-ui/core/Button';

const IncoherenceReporting = () => {
  const { t, i18n } = useTranslation();
  const [fileData, setFileData] = useState();
  const [showUploadModal, setShowUploadModal] = useState(true)

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  const sendData = (data) => {
    var that = this;
    setFileData(data)
}



  return (<div> <Button variant="contained" color="primary" onClick={() =>setShowUploadModal(!showUploadModal)}>Upload</Button>
  <div>
    { fileData ? 
    <table>
      <tbody>

        <td>{fileData["2G"]}</td>
        <td>{fileData["3G"]}</td>
        <td>{fileData["4G"]}</td>
      </tbody>
    </table>
    : null }
  </div>
  <ExcelReader
    setShowModal={() => setShowUploadModal(!showUploadModal)}
    getData={sendData}
    showModal={showUploadModal} />
  </div>)

}

export default IncoherenceReporting