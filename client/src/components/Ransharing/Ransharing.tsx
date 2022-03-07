import React, { useState } from 'react'
import XMLParser from "react-xml-parser";
import ReactFileReader from 'react-file-reader';
import "./Ransharing.scss"
import JSZip from 'jszip';
import { useEffect } from 'react';

export const Ransharing = () => {
    const [results, setResults] = useState([]);
    const [status, setStatus] = useState<String>('');
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


    const handleZip = (zipFile) => {
        const zip = new JSZip();
        zip.loadAsync(zipFile[0])
        .then(result => {console.log(result.files)})
        .catch(error => {
            console.log('there has been an error', error)
            console.log(error.message)
            setStatus(error.message)
        })
    }

    const handleFiles = (files) => {
                let caseName = getCase(files[0].name);
            files[0].text()
            .then(firstStep => { const start = performance.now(); return {firstStep, start} })
            .then(result => {
                const mid = performance.now() - result.start; console.log(mid);
            // extract array of cells from XML object
            return result.firstStep.match(/ZPB......./g)
            })
            .then(res => {var updatedResults = results;
            updatedResults[caseName] = res
            console.log(updatedResults)
            setResults(updatedResults)
            }
            )
            .catch(function (e) {
                console.error('There has been an error');
            console.error(e); // "oh, no!"
            })
    }


useEffect(()=> {
                console.log(results)
            },[results])

            return (
            <div className='ransharing-container'>
                <h1>Ransharing Reporting</h1>
                <h5>{status}</h5>
                <p>1. import XML FILE</p>
                <ReactFileReader multipleFiles={false} fileTypes={[".zip"]} handleFiles={handleZip}>
                    <button className='btn'>Upload</button>
                </ReactFileReader>
                {/* <ReactFileReader multipleFiles={false} fileTypes={[".csv"]} handleFiles={handleFiles}>
                    <button className='btn'>Upload</button>
                </ReactFileReader> */}
                <p>2. process files</p>
            </div>
            )
}