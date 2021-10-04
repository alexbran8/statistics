import React, { useState } from "react";
import "./IncoherenceReporting.scss"
import moment from "moment";
import { useMutation, useQuery, gql } from "@apollo/client";

import { Bar } from 'react-chartjs-2';
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

import TextField from '@material-ui/core/TextField';

import { useForm } from 'react-hook-form'
import { Form } from 'react-bootstrap'

const SAVE_DATA = gql`
mutation ($data: [Incoherence], $dataSub: [IncoherencesSub], $week: String!) {
    saveData (data:$data, dataSub: $dataSub, week:$week){
        success
        message
      }
    }

`;


const GET_ALL = gql`
  query  { 
    getAll(first:10)  {
        values
        week
        technology
    }
    getAllSubCat(first:10)  {
      values
      week
      technology
      incoherence
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
  const [items, setItems] = useState();

  const [dataCat, setDataCat] = useState();
  const [firstCat, set2G] = useState();
  const [secondCat, set3G] = useState();
  const [thirdCat, set4G] = useState();
  const [_2GSubCat, set2GSubCat] = useState();
  const [subCatData, setsubCatData] = useState();
  const [dateAxis,setdateAxis] = useState();

  


  const getSubCatData = (data, tech) => {
  
    const object = {}
    var groupBy = function(xs, key) {
      return xs.reduce(function(rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
      }, {});
    };
    
    var groupedby = groupBy(data.filter(x => x.technology == tech), 'incoherence');
    const map = Object.keys(groupedby).map(s => {
      // console.log(s, groupedby[s].map(x => object.push({'values': x.values})
      
      return { 
        label: s,
        data: groupedby[s].map(x => x.values),
        type: 'bar',
        stack: 'stack1',
        //        color: '#1f77b4',
        //       yAxisID: 'A',
        //       xAxisID: 'X',
        //       fill: false,
      }
    })
    return map
    // Object.keys(groupedby).reduce(function (res, value) {
    //   console.log('res', res, value)
    //   return res;
    // }, {});


    // return data.filter(x => x.technology == tech).map((s, index) => {

    //   return {
    //     label: s.incoherence,
    //     data: [s.values],
    //     type: 'bar',
    //        stack: 'stack1',
    //        color: '#1f77b4',
    //       yAxisID: 'A',
    //       xAxisID: 'X',
    //       fill: false,
    //     // backgroundColor: this.props.backgroundColors[index],
    //     // borderColor: this.props.borderColor[index],
    //     borderWidth: 2
    //   };
    // });
  };

  const { data, loading, error, refetch } = useQuery(GET_ALL, {
    variables: { first: 10 }, onCompleted: (
    ) => {    
      var total = []
      // get all incoherences
      data.getAll.reduce(function (res, value) {
        if (!res[value.week]) {
          res[value.week] = { week: value.week, values: 0 };
          total.push(res[value.week])
        }
        res[value.week].values += parseFloat(value.values);
        return res;
      }, {});

      // console.log(total)
        // console.log(data.getAll)
        var array2G = data.getAll.filter(a => a.technology == '2G').map(function(x) {return x.values})
        var array = data.getAll.filter(a => a.technology == '2G').map(function(x) {return x.values})
        // console.log(array2G)
        // var array2G2 = [...total].map((e, i) => (array[i]/e.values*100).toFixed(2));
        // set2G(div)
        var array3G = data.getAll.filter(a => a.technology == '3G').map(function(x) {return x.values})
        // console.log(array)
        // var div = [...total].map((e, i) => ( array[i]/ e.values*100).toFixed(2));
        // set3G(div)
        var array4G = data.getAll.filter(a => a.technology == '4G').map(function(x) {return x.values})
        // console.log(array)
        // var array4G = [...total].map((e, i) => (array[i]/e.values*100).toFixed(2));
        // set4G(div)
        console.log('x', getSubCatData(data.getAllSubCat, '2G'))
        mergeData(getSubCatData(data.getAllSubCat, '2G'), getSubCatData(data.getAllSubCat, '3G'), getSubCatData(data.getAllSubCat, '4G'), array2G, array3G, array4G, )
        var array = data.getAll.map(function(x) {return x.week})
        let unique = [...new Set(array)];
        setdateAxis(unique)
        // console.log(firstCat) 
        
       
      // console.log(array)


      

      
    }
});



const mergeData = (data1, data2, dataSub4G, data2G, data3G, data4G) => {
  const lineChartData = {
    data: {
      labels: dateAxis,
      datasets: [
        {
          type: 'bar',
          label: '2G',
          stack: 'stack2',
          data: data2G,
          yAxisID: 'A',
          fill: true,
          // color: 'red',
          // backgroundColor: 'blue',
          // backgroundColor: "rgba(75,192,192,0.2)",
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 2,
          // datalabels: {
          //   color: 'black',
          //   font: 'bold',
          //   align: "top",
          //   // backgroundColor: 'blue',
          //   // borderColor: 'rgb(54, 162, 235)',
          //   borderWidth: 2
          // }
  
        },
        {
          type: 'bar',
          label: '3G',
          data: data3G,
          stack: 'stack2',
          color: '#1f77b4',
          yAxisID: 'A',
          fill: false,
          // backgroundColor: 'red',
          borderColor: 'orange',  
          borderWidth: 2,
          datalabels: {
            color: 'black ',
            font: 'bold',
            // backgroundColor: 'black',
            align: "top",
          }
        },
        {
          type: 'bar',
          label: '4G',
          data: data4G,
          stack: 'stack2',
          color: '#1f77b4',
          yAxisID: 'A',
          fill: false,
          // backgroundColor: 'red',
          borderColor: 'orange',  
          borderWidth: 2,
          datalabels: {
            color: 'black ',
            font: 'bold',
            // backgroundColor: 'black',
            align: "top",
          }
        },
        // {
        //   type: 'bar',
        //   label: '4G',
        //   color: 'red',
        //   stack: 'stack2',
        //   data: data4,
        //   yAxisID: 'A',
        //   fill: false,
        //   // backgroundColor: 'green',
        //   borderColor: 'green',
        //   borderWidth: 2,
        //   datalabels: {
        //     color: 'black',
        //     font: 'bold',
        //   align: 'top'
        //   }
  
        // },
        // {
        //   type: 'bar',
        //   label: '2G',
        //   stack: 'stack1',
        //   data: firstCat,
        //   yAxisID: 'A',
        //   xAxisID: 'X',
        //   fill: true,
        //   barThickness : '200',
        //   color: 'red',
        //   backgroundColor: 'blue',
        //   backgroundColor: "rgba(75,192,192,0.2)",
        //   borderColor: 'blue',
        //   borderWidth: 2,
        //   datalabels: {
        //     color: 'white',
        //     font: 'bold',
        //     align: "top",
        //     backgroundColor: 'blue',
        //     borderColor: 'rgb(54, 162, 235)',
        //     borderWidth: 2
        //   }
  
        // },
        // {
        //   type: 'bar',
        //   label: '3G',
        //   data: secondCat,
        //   stack: 'stack1',
        //   color: '#1f77b4',
        //   yAxisID: 'A',
        //   xAxisID: 'X',
        //   fill: false,
        //   barThickness : '200',
        //   backgroundColor: 'red',
        //   borderColor: 'red',
        //   borderWidth: 2,
        //   datalabels: {
        //     color: 'white ',
        //     font: 'bold',
        //     backgroundColor: 'black',
        //     align: "top",
        //   }
        // },
        // {
        //   type: 'bar',
        //   label: '4G',
        //   color: 'red',
        //   stack: 'stack1',
        //   data: thirdCat,
        //   yAxisID: 'A',
        //   xAxisID: 'X',
        //   fill: false,
        //   backgroundColor: 'green',
        //   borderColor: 'green',
        //   barThickness : '200',
        //   borderWidth: 2,
        //   datalabels: {
        //     color: 'black',
        //     font: 'bold',
        //   align: 'top'
        //   }
  
        // },
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
      xAxes: [{
        stacked: true,
        barPercentage: 0.4
      }],
      yAxes: [{
        stacked: true
    }],
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
          stacked: true,
          title: {
            display: true,
            text: '%'
          }
        },
        
        // B: {
        //   type: 'linear',
        //   position: 'right',
        //   title: {
        //     display: true,
        //     text: '%'
        //   },
        //   ticks: {
        //     // max: 1,
        //     // min: 1000
        //   }
        // }
      },
    }
  }

  
  var mergedData = [...data1, 
    ...data2, 
    // ...dataSub4G,
    // ... data2, 
    ...lineChartData.data.datasets
  ]
  // console.log(mergedData)
  setsubCatData(mergedData)
}
  
  const date = moment().format("YYYY-MM-DD")

  const sendData = (data) => {
    var that = this;
    // get data by categories
    autoConvertMapToObject(splitCount(data["data2G"]), "2G")
    autoConvertMapToObject(splitCount(data["data3G"]), "3G")
    autoConvertMapToObject(splitCount(data["data4G"]), "4G")
    var merged = autoConvertMapToObject(splitCount(data["data2G"]), "2G")
    .concat(autoConvertMapToObject(splitCount(data["data3G"]), "3G"), autoConvertMapToObject(splitCount(data["data4G"]), "4G"))
    // .groupBy("incoherence")
    setDataCat(merged)
    delete data["data2G"]
    delete data["data3G"]
    delete data["data4G"]
    setFileData(data)
    // .map(_.spread(_.merge))
    // .value();
  

  }

  const splitCount = (data) => {
    const distinctItems = [...new Map(data.map(item => [item["Incoherence remonte"], data.filter(x => x["Incoherence remonte"] == item["Incoherence remonte"]).length]))];
    return distinctItems
  }

  const saveData = () => {
    saveDataMutation({
      variables: { week: selectedWeek, dataSub:dataCat, data: fileData }
    })
  }

  const onSubmit = (data) => {
  refetch()
    }


    const autoConvertMapToObject = (map, technology) => {
      const obj = [];
      for (const item of [...map]) {
        const [
          key,
          value
        ] = item;
        obj.push({'incoherence': key, 'value': value, 'technology': technology});
        // obj['tehnology'] = technology
      }
      return obj;
    }

  const [saveDataMutation] = useMutation(SAVE_DATA, {
    onCompleted: (dataRes) => {
      alert(dataRes.saveData.message);
      // console.log(dataRes.saveData)
      if (dataRes.saveData.success === 'true') {
        setFileData(null);
        setSelectedWeek(null)
      }
    },
    onError: (error) => { console.error("Error creating a post", error); alert("Error creating a post request " + error.message) },
  });

  


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

          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Incoherence</StyledTableCell>
                  <StyledTableCell align="right">Technology</StyledTableCell>
                  <StyledTableCell align="right">Value</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataCat && dataCat.map((item, index) => {
                  return (
                    <TableRow key={index}>
                    <StyledTableCell>{item.incoherence}</StyledTableCell>
                    <StyledTableCell align="right">{item.technology}</StyledTableCell>
                    <StyledTableCell align="right">{item.value}</StyledTableCell>
                  </TableRow>
                  )
                })}

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
          {/* <Form.Control type="text" name="endWeek"  onChange={(e) => { setEndDate(e.target.value) }}  ref={register({ required: true })} /> */} 
          {/* {errors.date && errors.date.type === "required" && (
            <span role="alert">This is required</span>
          )} */}
        </Form.Group>
        <button type="submit" disabled={allCheck} className="centerBtn btn btn-success">Refresh</button>
      </Form>
      {subCatData ? <Bar
        data={{   labels: dateAxis, datasets: subCatData}}
        // data ={lineChartData}
        // options={lineChartData.options}
        plugins={[ChartDataLabels]}
        height={0}
        width={250}
      //  options={} 
      /> : null }
    </div>
    <ExcelReader
      setShowModal={() => setShowUploadModal(!showUploadModal)}
      getData={sendData}
      showModal={showUploadModal} />
  </div >)

}

export default IncoherenceReporting