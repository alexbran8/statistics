import React from 'react'
import XMLParser from "react-xml-parser";
import ReactFileReader from 'react-file-reader';
import "./Ransharing.scss"

export const Ransharing = () => {


    const handleFiles = (files) =>  {
        files[0].text()
        .then(firstStep =>  {const start = performance.now();console.log (firstStep); return {firstStep, start}})
        .then(result => {
            console.log(2);
            const mid = performance.now() - result.start; console.log(mid);
            const step2 = result.firstStep
            console.log(result.firstStep.match(/ZPB......./g))
            // const step2 =new XMLParser().parseFromString(result.firstStep);
            return {step2, mid} })
        .then(result2 => {let end = performance.now(); console.log(end-result2.mid);console.log(3)})        
    }

    return (
        <div className='ransharing-container'>
            <h1>Ransharing Reporting</h1>
            <p>1. import XML FILE</p>
            <ReactFileReader multipleFiles={false} fileTypes={[".xml"]} handleFiles={handleFiles}>
                <button className='btn'>Upload</button>
            </ReactFileReader>
            <p>2. process files</p>
        </div>
    )
}