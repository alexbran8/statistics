import React, { useState } from 'react'
import XMLParser from "react-xml-parser";
import ReactFileReader from 'react-file-reader';
import "./Ransharing.scss"
import JSZip from 'jszip';
import { useEffect } from 'react';

export const Ransharing = () => {
    const [results, setResults] = useState([]);
    const [status, setStatus] = useState < String > ('');

    function getCase(fileName) {
        switch (true) {
            case fileName.includes('FRM'):
                console.log('FRM');
                var result = 'FRM';
                break;
            case fileName.includes('BYT'):
                var result = 'BYT';
                break;
        }
        return result
    }

    function handleInputFile(zipFile) {
        handleZip(zipFile)
        //     let newResults = []
        //     newResults.push(handleZip(zipFile))
        //     // console.log(finalResults)
        //     setResults(newResults)
        //     console.log(results)
        //     console.log('res',newResults)
    }

    const handleZip = (zipFile) => {
        const zip = new JSZip();
        zip.loadAsync(zipFile[0])
            .then(function (zip) {
                Object.keys(zip.files).forEach(file => {
                    zip.files[file].async('string').then(function (fileData) {
                        var updatedResults = [];
                        let newResults = results
                        let caseName = getCase(file)
                        // var updatedResults = fileData;
                        newResults.push({ fileName: file, case: [caseName], content: fileData.match(/ZPB......./g) })

                        updatedResults = [...newResults]
                        console.log({ updatedResults })
                        setResults(updatedResults)
                        // console.log({ [caseName]: fileData.match(/ZPB......./g) })
                        return { [caseName]: fileData.match(/ZPB......./g) }
                    })
                })
            })
            .catch(error => {
                console.log('there has been an error', error)
                console.log(error.message)
                setStatus(error.message)
            })
    }


    // useEffect(() => {
    //     console.log('heerrr', results)
    // }, [results])

    return (
        <div className='ransharing-container'>
            <h1>Ransharing Reporting</h1>
            <h5>{status}</h5>
            <p>1. import ZIP FILE</p>
            <ReactFileReader multipleFiles={false} fileTypes={[".zip"]} handleFiles={handleInputFile}>
                <button className='btn'>Upload</button>
            </ReactFileReader>
            <p>2. process files</p>

            <h5>These are the files that have been loaded</h5>
            <table className='ransharing-table'>
                <thead>
                    <th>FILE</th>
                    <th>CASE</th>
                    <th>CELLS FOUND</th>
                    {/* {console.log(results)} */}
                </thead>
                {results && results.map(item => {
                    console.log('x', item.case)
                    return (
                        <tr>
                            <td>{item.fileName}</td>
                            <td>{item.case}</td>
                            <td>{item.content.length}</td>
                        </tr>
                    )
                })}
            </table>
            {/* {fileList && fileList.map(item => { console.log(item)})} */}
        </div>
    )
}