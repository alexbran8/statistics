import React, { useState } from 'react'
import XMLParser from "react-xml-parser";
import ReactFileReader from 'react-file-reader';



import { RansharingCharts } from './RansharingCharts'
import { CaseFilter } from './CaseFilter'

import "./Ransharing.scss"
import JSZip from 'jszip';
import { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { ExportToExcel } from "../Export/ExportExcel"

import { useMutation, useQuery, gql } from "@apollo/client";

import { makeStyles } from '@material-ui/core/styles';

const GET_ALL_RANSHARING = gql`
  query ($selectedCase: String)  {
    getAllRansharing (selectedCase:$selectedCase) {
        diff1
        diff2
        diff1Cells
        diff2Cells
        caseName
        week
        totalCells1
        totalCells2
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

export const Ransharing4G = () => {
    const [results, setResults] = useState();
    const [selectedWeek, setSelectedWeek] = useState < String > (null);
    const [selectedCase, setSelectedCase] = useState();
    const classes = useStyles();
    const [comparisonResults, setComparisonResults] = useState();
    const [status, setStatus] = useState < String > ('');
    const [date, setDate] = useState();
    const [allData, setAllData] = useState();

    var groupBy = function (xs, key) {
        return xs.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    const { data, loading, error, refetch } = useQuery(GET_ALL_RANSHARING, {
        variables: { first: 10 }, onCompleted: (
        ) => {
            console.log(data)
            // setAllData(data)

            let grouppedDate = groupBy(data.getAllRansharing, "caseName")
            setAllData(grouppedDate)
            // setRanData(data.getAllRansharing)
            // mergeData(data.getAllRansharing)

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


    const apolloRefetchFunction = (newInputValue) => {
        console.log(newInputValue)
        setSelectedCase(newInputValue);
        refetch;

    }



    return (
        <div className='ransharing-container'>
            <div className='page-background'>Ransharing Reporting</div>
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
            {/* <>
                Select Case</>
            <CaseFilter
                refetchFunction={apolloRefetchFunction} /> */}
            <div class="grid">
                {allData && Object.keys(allData).map(item =>
                    <>
                     {/* <div className="row-border">{item}</div> */}
                        <RansharingCharts
                            data={allData[item]}
                            case={item} />
                    </>
                )

                }
            </div>

        </div>

    )
}