import React, { useState } from 'react'
import XMLParser from "react-xml-parser";
import ReactFileReader from 'react-file-reader';
import "./Ransharing.scss"
import JSZip from 'jszip';
import { useEffect } from 'react';
import Button from '@material-ui/core/Button';


export const Ransharing = () => {
    const [results, setResults] = useState();
    const [comparisonResults, setComparisonResults] = useState();
    const [status, setStatus] = useState < String > ('');

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
                var result = 'ORF-FRM';
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
                var result = 'ORF-FRM';
                break;
        }
        return result
    }

    useEffect(() => {
        if (results && results.length === 12) {
            let a = results.filter(x => x.fileType == 'XML')
            let b = results.filter(x => x.fileType == 'CSV')
            let comparisonResults = []
            a.forEach(item => {
                let itemToCompareWith = b.find(x => x.caseName == item.caseName)
                // console.log(itemToCompareWith.content)
                // console.log(item.content)
                let diff1 = item.content.filter(e => !itemToCompareWith.content.includes(e))
                let diff2 = itemToCompareWith.content.filter(e => !item.content.includes(e))
                
                let updatedComparisonResults = []
                comparisonResults.push({caseName:item.caseName, diff1:diff1, diff1Cells:diff1.length, diff2Cells:diff2.length, diff2:diff2})
                console.log(item.caseName)
                updatedComparisonResults = [...comparisonResults]
                console.log(updatedComparisonResults)
                setComparisonResults(updatedComparisonResults)
            }
            )
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
                        if(file.includes('xml')) {
                            var fileType = 'XML'
                            var fileContent = fileData.match(/<zp_cellule>(.*?)<\/zp_cellule>/g)
                            var fileContent2 = fileContent.map(item=> {return item.replace('<zp_cellule>', '').replace('</zp_cellule>', '')})
                        }
                        else
                        {
                            var fileType = 'CSV'
                            var fileContent = fileData.match(/ZP......../g)
                            var fileContent2 =  Array.from(new Set(fileContent));
                        }

                        newResults.push({ fileName: file, caseName: caseName, fileType: fileType, content: fileContent2  })
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
                                <td>CELLS</td>
                                <td>CSV vs XML</td>
                                <td>CELLS</td>
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
                                        <td>{item.diff1Cells}</td>
                                        {console.log(item.diff2)}
                                        <td>{item.diff2}</td>
                                        <td>{item.diff2Cells}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </>
                : null}
        </div>
    )
}