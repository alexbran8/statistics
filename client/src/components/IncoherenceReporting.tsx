import React, { useState } from "react";
import "./IncoherenceReporting.scss"
import { withTranslation } from "react-i18next";
import "../services/i18n";
import LanguageSelector from "./LanguageSelector";
import { useTranslation } from "react-i18next";
import ExcelReader from "./ExcelReader";
import Button from '@material-ui/core/Button';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from '@material-ui/core/TextField';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);




const useStyles = makeStyles({
  table: {
    width: 800,
    // marginLeft: 50
  },
});

const IncoherenceReporting = () => {
  const newDate = new Date()
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const [fileData, setFileData] = useState();
  const [showUploadModal, setShowUploadModal] = useState(true)
  const [selectedWeek, setSelectedWeek] = useState()

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  const sendData = (data) => {
    var that = this;
    setFileData(data)
  }

  const getWeek = (date) => {

    const currentdate = new Date(date);
    var oneJan = new Date(currentdate.getFullYear(), 0, 1);
    var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    var result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
    { console.log(result + '-' + currentdate.getFullYear()) }
    setSelectedWeek(result + '-' + currentdate.getFullYear())

  }



  return (<div className="center-container"> <Button variant="contained" color="primary" onClick={() => setShowUploadModal(!showUploadModal)}>Upload File</Button>
    <div>
      {fileData ?
        <div>
          <p>The following data has been processed from the loaded file:</p>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Technology</StyledTableCell>
                  <StyledTableCell align="right">2G</StyledTableCell>
                  <StyledTableCell align="right">3G</StyledTableCell>
                  <StyledTableCell align="right">4G</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <StyledTableCell>Value(number of incoherences):</StyledTableCell>
                  <StyledTableCell align="right">{fileData["2G"]}</StyledTableCell>
                  <StyledTableCell align="right">{fileData["3G"]}</StyledTableCell>
                  <StyledTableCell align="right">{fileData["4G"]}</StyledTableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <p>Select date for which the above data will be saved into the database: </p>
          <TextField
            id="date"
            type="date"
            defaultValue={newDate.getDate()}
            variant="outlined"
            className={classes.textField}
            onChange={(e) => { getWeek(e.target.value); }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          {selectedWeek ? <div>Selected week is : <b>{selectedWeek}</b></div> : null}
          <div>
            <Button variant="contained" color="primary" disabled={selectedWeek? false : true} onClick={() => setShowUploadModal(!showUploadModal)}>Save</Button>
          </div>
        </div>
        : null}
    </div>
    <ExcelReader
      setShowModal={() => setShowUploadModal(!showUploadModal)}
      getData={sendData}
      showModal={showUploadModal} />
  </div>)

}

export default IncoherenceReporting