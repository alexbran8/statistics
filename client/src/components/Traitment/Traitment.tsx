import React, { useState } from 'react'
import "./Traitment.scss"
import ReactFileReader from 'react-file-reader';
import Button from '@material-ui/core/Button'
import JSZip from 'jszip';


export const Traitment = () => {
    const [status, setStatus] = useState < String > ('');
    const [files, setFiles] = useState([]);
    const [processStatus, setProcessStatus] = useState(24);
    const [progress, setProgress] = useState(0);

    const handleZip = (zipFile) => {
        const zip = new JSZip();
        zip.loadAsync(zipFile[0])
            .then(function (zip) {
                var newResults = []
                var newProgress = progress
                // setProcessStatus(processStatus + Object.keys(zip.files).length)
                Object.keys(zip.files).forEach((file,index) => {
                    zip.files[file].async('string').then(function (fileData) {
                        console.log(index)
                        var updatedResults = [];
                        let updatedFiles = []
                        files.push({ fileName: file, content: fileData, status: 'read-from-client' })
                        updatedFiles = [...files]
                        newProgress++
                        setProgress(newProgress)
                        setFiles(updatedFiles)
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
        <>

            <div className="traitment-container">
                <h1>
                    Traitment Reporting
                </h1>
                <ReactFileReader multipleFiles={false} fileTypes={[".zip"]} handleFiles={handleZip}>
                    <Button variant="contained" color="primary" className='btn'>Click here to upload ZIP file</Button>
                </ReactFileReader>

                <>
                    {files ? <>
                        <div className="process-status-container"> 
                        <div className="text"> {processStatus !== 0 ?(progress / processStatus * 100).toFixed(1) +'%' : 'waiting for files'}</div></div>
                        <table className='ransharing-table'>
                            <thead>
                                <tr>
                                    <td>ID</td>
                                    <td>FILE</td>
                                    <td>CONTENT</td>
                                    <td>STATUS</td>
                                </tr>
                            </thead>
                            {files.map((file, index) => {
                                return <tr key={index}>    
                                    <td>{index+1}</td>
                                    <td>{file.fileName}</td>
                                    <td>{file.content.substring(0, 50)}</td>
                                    <td>{file.status}</td>
                                </tr>
                                

                            })}

                        </table>
                    </>
                        : null}
                </>
            </div>
        </>
    )
}