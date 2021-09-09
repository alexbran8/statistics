import React, { useState } from "react";
import "./IncoherenceReporting.scss"
import moment from "moment";
import { useMutation, useQuery, gql } from "@apollo/client";

import { Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

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

import { useForm } from 'react-hook-form'
import { Modal, Form } from 'react-bootstrap'

const SAVE_DATA = gql`
mutation ($data: [Incoherence], $week: String!) {
    saveData (data:$data, week:$week){
        success
        message
      }
    }

`;

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
  const [allCheck, setAllCheck] = useState(false);
  const classes = useStyles();
  const [fileData, setFileData] = useState();
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedWeek, setSelectedWeek] = useState()
  const { register, handleSubmit, errors } = useForm();

  
  const date = moment().format("YYYY-MM-DD")

  const sendData = (data) => {
    var that = this;
    setFileData(data)
  }

  const saveData = () => {
    console.log('data saved')
    console.log(fileData)
    console.log(selectedWeek)
    saveDataMutation({
      variables: { week: selectedWeek, data: fileData }
    }
    )
  }

  const onSubmit = (data) => {

    apiService.graphql({
      query: GET_REPORTING,
      variables: { startDate: data.startDate, endDate: data.endDate },
    })
      .then((response) => {
        console.log(response)
      })
    }




  const [saveDataMutation] = useMutation(SAVE_DATA, {
    onCompleted: (dataRes) => {
      alert(dataRes.saveData.message);
      console.log(dataRes.saveData)
      if (dataRes.saveData.success === 'true') {
        setFileData(null);
        setSelectedWeek(null)
      }
    },
    onError: (error) => { console.error("Error creating a post", error); alert("Error creating a post request " + error.message) },
  });

  const lineChartData = {
    data: {
      labels: ['W1', 'W2'],
      datasets: [
        {
          type: 'line',
          label: 'Taux de fiabilite',
          data: [1,2],
          yAxisID: 'A',
          fill: false,
          // backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 2,
          datalabels: {
            color: 'white',
            font: 'bold',
            backgroundColor: 'black',
            borderColor: 'rgb(54, 162, 235)',
            borderWidth: 2
          }
  
        },
        // {
        //   label: "Cellules presentes en BDR ou RR uniquement",
        //   yAxisID: 'B',
        //   backgroundColor: "red",
        //   data: firstCat,
        //   stack: 2
        // },
        // {
        //   label: "Cellules demontees, mais presentes en BDR ou RR",
        //   yAxisID: 'B',
        //   backgroundColor: "orange",
        //   data: secondCat,
        //   stack: 2
        // },
        // {
        //   label: "Cellules normales",
        //   yAxisID: 'B',
        //   backgroundColor: "green",
        //   data: thirdCat,
        //   stack: 2
        // }
  
      ],
    },
    options: {
      plugins: {
        datalabels: {
          color: 'white',
          font: {
            // weight: 'bold',
            size: 14
          }
        }
      },
      scales: {
        A: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: '%'
          }
        },
        B: {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: 'Nombre de cellules'
          },
          ticks: {
            // max: 1,
            // min: 1000
          }
        }
      },
    }
  }


  const getWeek = (date) => {

    const currentdate = new Date(date);
    var oneJan = new Date(currentdate.getFullYear(), 0, 1);
    var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
    var result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
    setSelectedWeek(result - 1 + '-' + currentdate.getFullYear())

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
                  <StyledTableCell align="right">{fileData["_2G"]}</StyledTableCell>
                  <StyledTableCell align="right">{fileData["_3G"]}</StyledTableCell>
                  <StyledTableCell align="right">{fileData["_4G"]}</StyledTableCell>
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
          <div className="button-container" >
            <Button variant="contained" className="button" color="primary" disabled={selectedWeek ? false : true} onClick={() => saveData()}>Save</Button>

            <Button variant="contained" color="secondary" onClick={() => { setFileData(null); setSelectedWeek(null); }}>Close</Button>
          </div>
        </div>
        : null}
    </div>
    <div className="chart-container">
      Incoherence Reporting Weekly Values (by Technology)
      <Form className="reportingForm" onSubmit={handleSubmit(onSubmit)}>
        <Form.Group controlId="new">
          {/* <Form.Label aria-invalid={errors.date ? "true" : "false"}>Start Week</Form.Label> */}
          {/* <Form.Control type="text" name="startWeek"  onChange={(e) => { setStartDate(e.target.value) }}  ref={register({ required: true })} />
          {/* {errors.date && errors.date.type === "required" && (
            <span role="alert">This is required</span>
          )} */}
          {/* <Form.Label aria-invalid={errors.date ? "true" : "false"}>End Week</Form.Label> */}
          {/* <Form.Control type="text" name="endWeek"  onChange={(e) => { setEndDate(e.target.value) }}  ref={register({ required: true })} /> */} */}
          {/* {errors.date && errors.date.type === "required" && (
            <span role="alert">This is required</span>
          )} */}
        </Form.Group>
        <button type="submit" disabled={allCheck} className="centerBtn btn btn-success">Refresh</button>
      </Form>
      <Line
        data={lineChartData.data}
        options={lineChartData.options}
        plugins={[ChartDataLabels]}
        height={200}
        width={250}
      //  options={} 
      />
    </div>
    <ExcelReader
      setShowModal={() => setShowUploadModal(!showUploadModal)}
      getData={sendData}
      showModal={showUploadModal} />
  </div >)

}

export default IncoherenceReporting