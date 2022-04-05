import React, { useState } from 'react'
import XMLParser from "react-xml-parser";
import ReactFileReader from 'react-file-reader';

import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';



import "./Ransharing.scss"
import JSZip from 'jszip';
import { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { ExportToExcel } from "../Export/ExportExcel"

import { useMutation, useQuery, gql } from "@apollo/client";

import { makeStyles } from '@material-ui/core/styles';

const GET_ALL_RANSHARING = gql`
  query  {
    getAllRansharing {
        diff1
        diff2
        diff1Cells
        diff2Cells
        caseName
        week
    }
  }
`;



const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },
}));


const SAVE_DATA = gql`
mutation ($data: [RansahringData], $week: String!) {
    saveRansharingData (data:$data, week:$week){
        success
        message
      }
    }

`;

export const Ransharing = () => {
    const [results, setResults] = useState();
    const [selectedWeek, setSelectedWeek] = useState < String > (null);
    const [ranData, setRanData] = useState(null)
    const classes = useStyles();
    const [comparisonResults, setComparisonResults] = useState();
    const [status, setStatus] = useState < String > ('');
    const [date, setDate] = useState()
    const [dateAxis, setDateAxis] = useState([])

    const { data, loading, error, refetch } = useQuery(GET_ALL_RANSHARING, {
        variables: { first: 10 }, onCompleted: (
        ) => {
            console.log(data)
            // setRanData(data.getAllRansharing)
            // mergeData(data.getAllRansharing)
            var BCMdata = data.getAllRansharing.filter(a => a.caseName == 'BYT-FRM').map(function (x) { return x.diff1 })
            var BYTSFRdata = data.getAllRansharing.filter(a => a.caseName == 'BYT-SFR').map(function (x) { return x.diff1 })
            mergeData(BCMdata, BYTSFRdata)
            var array = data.getAllRansharing.map(function (x) { return x.week })
            let unique = [...new Set(array)];
            setDateAxis(unique)
            //   !loading && !error ? data&& prepareChartData(data) : null
        },
        onError: () => (
            console.log(error)
        )
    });


    const [saveDataMutation] = useMutation(SAVE_DATA, {
        onCompleted: (dataRes) => {
            alert(dataRes.saveRansharingData.message);
            // console.log(dataRes.saveData)

        },
        onError: (error) => { console.error("Error creating a post", error); alert("Error creating a post request " + error.message) },
    });

    const saveData = () => {


        saveDataMutation({
            variables: { week: selectedWeek, data: comparisonResults }
        })
    }


    const getWeek = (date) => {

        const currentdate = new Date(date);
        var oneJan = new Date(currentdate.getFullYear(), 0, 1);
        var numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
        var result = Math.ceil((currentdate.getDay() + 1 + numberOfDays) / 7);
        setSelectedWeek(result - 1 + '-' + currentdate.getFullYear())

    }

    function getCase(fileName) {
        switch (true) {
            case fileName.substring(0, 15).includes('FRM') && fileName.includes('csv') && fileName.includes('BYT'):
                var result = 'FRM-BYT';
                break;
            case fileName.substring(0, 15).includes('BYT') && fileName.includes('csv') && fileName.includes('FRM'):
                var result = 'BYT-FRM';
                break;
            case fileName.substring(0, 15).includes('BYT') && fileName.includes('csv') && fileName.includes('SFR'):
                var result = 'BYT-SFR';
                break;
            case fileName.substring(0, 15).includes('BYT') && fileName.includes('csv') && fileName.includes('ORF'):
                var result = 'BYT-ORF';
                break;
            case fileName.substring(0, 15).includes('SFR') && fileName.includes('csv') && fileName.includes('BYT'):
                var result = 'SFR-BYT';
                break;
            case fileName.substring(0, 15).includes('ORF') && fileName.includes('csv') && fileName.includes('BYT'):
                var result = 'ORF-BYT';
                break;

            case fileName.substring(0, 15).includes('FRM') && fileName.includes('xml') && fileName.includes('BYT'):
                var result = 'FRM-BYT';
                break;
            case fileName.substring(0, 15).includes('BYT') && fileName.includes('xml') && fileName.includes('FRM'):
                var result = 'BYT-FRM';
                break;
            case fileName.substring(0, 15).includes('BYT') && fileName.includes('xml') && fileName.includes('SFR'):
                var result = 'BYT-SFR';
                break;
            case fileName.substring(0, 15).includes('BYT') && fileName.includes('xml') && fileName.includes('ORF'):
                var result = 'BYT-ORF';
                break;
            case fileName.substring(0, 15).includes('SFR') && fileName.includes('xml') && fileName.includes('BYT'):
                var result = 'SFR-BYT';
                break;
            case fileName.substring(0, 15).includes('ORF') && fileName.includes('xml') && fileName.includes('BYT'):
                var result = 'ORF-BYT';
                break;
        }
        return result
    }

    useEffect(() => {
        try {
            if (results && results.length === 12) {
                let a = results.filter(x => x.fileType == 'XML')
                let b = results.filter(x => x.fileType == 'CSV')
                let comparisonResults = []
                a.forEach(item => {

                    let itemToCompareWith = b.find(x => x.caseName == item.caseName)
                    let diff1 = item.content.filter(e => itemToCompareWith && itemToCompareWith.content ? !itemToCompareWith.content.includes(e) : [])
                    let diff2 = itemToCompareWith.content.filter(e => !item.content.includes(e))

                    let updatedComparisonResults = []
                    comparisonResults.push({ caseName: item.caseName, diff1Cells: JSON.stringify(diff1), diff1: diff1.length, diff2: diff2.length, diff2Cells: JSON.stringify(diff2) })

                    updatedComparisonResults = [...comparisonResults]

                    setComparisonResults(updatedComparisonResults)
                }
                )
            }

        }
        catch (error) {
            console.log('there has been an error', error)
            console.log(error.message)
            setStatus(error.message)
        }
    }, [results])

    const handleZip = (zipFile) => {
        const zip = new JSZip();
        zip.loadAsync(zipFile[0])
            .then(function (zip) {
                var newResults = []
                Object.keys(zip.files).forEach(file => {
                    zip.files[file].async('string').then(function (fileData) {
                        var updatedResults = [];
                        console.log(fileData)
                        let caseName = getCase(file)
                        if (file.includes('xml')) {
                            var fileType = 'XML'
                            var fileContent = fileData.match(/<zp_cellule>(.*?)<\/zp_cellule>/g)
                            var fileContent2 = fileContent.map(item => { return item.replace('<zp_cellule>', '').replace('</zp_cellule>', '').replace('ZP_cellule', '') })
                        }
                        else {
                            var fileType = 'CSV'
                            var fileContent = fileData.match(/ZP......../g)
                            var fileContentTemp = Array.from(new Set(fileContent));
                            var fileContent2 = fileContentTemp.filter(item => item !== 'ZP_cellule')

                        }

                        newResults.push({ fileName: file, caseName: caseName, fileType: fileType, content: fileContent2 })
                        updatedResults = [...newResults]
                        setResults(updatedResults)
                    })
                })
            })
            .catch(error => {
                console.log('there has been an error', error)
                console.log(error.message)
                setStatus(error.message)
            })
    }

    const submitResults = () => {
        console.log('submiting results')
    }

    const newDate = new Date()
    const lineChartData =
    {
      options: {
        xAxes: [{
          stacked: false,
          offset: true,
          barPercentage: 0.9
        }],
        yAxes: [{
          stacked: false
        }],
        plugins: {
        },
        scales: {
          A: {
            // type: 'linear',
            position: 'left',
            stacked: true,
            // ticks: {
            //   autoSkip: false
            // },
            title: {
              display: true,
              text: '% du total'
            },
          },  
        },
      }
    }
    

    const mergeData = (data1, data2, dataSub4G, data2GPercentage, data3GPercentage, data4GPercentage, data2G, data3G, data4G) => {
        
        const lineChartData = {
          data: {
            labels: dateAxis,
            datasets: [
              {
                type: 'bar',
                label: '2G',
                stack: 'stack1',
                data: data1,
                yAxisID: 'A',
                // fill: true,
                xAxisID: 'X',
                barThickness: '80',
                color: 'red',
                backgroundColor: 'red',
                // backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: 'red',
                borderWidth: 2,
                datalabels: {
                  display: true,
                  align: "top",
                  anchor: "end",
                  formatter: (val, ctx) => {
                    return val + "% (" + data1[ctx.dataIndex] + ')';
                  },
                  color: '#404040',
                  // backgroundColor: '#404040'
                },
    
              },
              {
                type: 'bar',
                label: '3G',
                data: data2,
                stack: 'stack2',
                color: '#1f77b4',
                yAxisID: 'A',
                fill: false,
                xAxisID: 'X',
                backgroundColor: 'blue',
                borderColor: 'blue',
                borderWidth: 2,
                barThickness: '80',
                datalabels: {
                  display: true,
                  align: "top",
                  anchor: "end",
                  formatter: (val, ctx) => {
                    return val + "% (" + data2[ctx.dataIndex] + ')';
                  },
                  color: '#404040',
                  // backgroundColor: '#404040'
                },
              },
            //   {
            //     type: 'bar',
            //     label: '4G',
            //     data: data4GPercentage,
            //     stack: 'stack3',
            //     color: '#1f77b4',
            //     yAxisID: 'A',
            //     fill: false,
            //     xAxisID: 'X',
            //     backgroundColor: 'green',
            //     borderColor: 'green',
            //     barThickness: '80',
            //     borderWidth: 2,
            //     datalabels: {
            //       display: true,
            //       align: "top",
            //       anchor: "end",
            //       formatter: (val, ctx) => {
            //         return val + "% (" + data4G[ctx.dataIndex] + ')';
            //       },
            //       color: '#404040',
            //       // backgroundColor: '#404040'
            //     },
            //   },
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
              //   align: 'top'6
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
    
        }
    
    
        var mergedData = [
          // ...data1,
          // ...data2,
          // ...dataSub4G,
          // ... data2,
          ...lineChartData.data.datasets
        ]
        // console.log(mergedData)
        setRanData(mergedData)
      }
    

    return (
        <div className='ransharing-container'>
            <h1>Ransharing Reporting</h1>
            <h5>{status}</h5>
            <ReactFileReader multipleFiles={false} fileTypes={[".zip"]} handleFiles={handleZip}>
                <Button variant="contained" color="primary" className='btn'>Click here to upload ZIP file</Button>
            </ReactFileReader>



            {results ?
                <>
                    <h5>Processed files</h5>
                    <table className='ransharing-table'>
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>FILE</td>
                                <td>CASE</td>
                                <td>FILE TYPE</td>
                                <td>NO. OF CELLS</td>
                            </tr>
                            {/* <th>CELLS</th> */}
                            {/* {console.log(results)} */}
                        </thead>
                        <tbody>
                            {results.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.fileName}</td>
                                        <td>{item.caseName}</td>
                                        <td>{item.fileType}</td>
                                        <td>{item.content && item.content.length}</td>
                                        {/* <td>{item.content}</td> */}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </>
                : null}

            {comparisonResults ?
                <>
                    <h5>Processing results</h5>
                    <table className='ransharing-table'>
                        <thead>
                            <tr>
                                <td>ID</td>
                                <td>CASE</td>
                                <td>XML vs CSV</td>
                                {/* <td>CELLS</td> */}
                                <td>CSV vs XML</td>
                                {/* <td>CELLS</td> */}
                            </tr>
                            {/* <th>CELLS</th> */}
                            {/* {console.log(results)} */}
                        </thead>
                        <tbody>
                            {comparisonResults.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.caseName}</td>
                                        <td>{item.diff1}</td>
                                        <td>{item.diff2}</td>
                                        <td>{item.diff2Cells}</td>
                                        <td>{item.diff1Cells}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    <form>
                        <TextField
                            id="date"
                            type="date"
                            defaultValue={newDate.getDate()}
                            variant="outlined"
                            className={classes.textField}
                            onChange={(e, v) => { getWeek(e.target.value); console.log(e.target.value); }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <Button variant="contained" color="primary" onClick={() => { saveData() }} className='btn'>Click here to save results</Button>
                        <ExportToExcel
                            getData={comparisonResults}
                            fileName="export_tacdb"
                            operationName="export all"
                        />
                    </form>
                </>
                : null}

            {ranData ? <Bar
                data={{ labels: dateAxis, datasets: ranData }}
                // data ={lineChartData}
                options={lineChartData.options}
                plugins={[ChartDataLabels]}
                height={0}
                width={250}
            //  options={}
            /> : null}

        </div>

    )
}