import React, { useState } from 'react'
import "./Traitment.scss"
import ReactFileReader from 'react-file-reader';
import Button from '@material-ui/core/Button'
import JSZip from 'jszip';


export const Traitment = () => {
    const [status, setStatus] = useState < String > ('');
    const [files, setFiles] = useState([]);
    const [processStatus, setProcessStatus] = useState(0);
    const [progress, setProgress] = useState(0);

    const handleZip = (zipFile) => {
        const zip = new JSZip();
        zip.loadAsync(zipFile[0])
            .then(function (zip) {
                var newResults = []
                setProcessStatus(Object.keys(zip.files).length)
                Object.keys(zip.files).forEach(file => {
                    zip.files[file].async('string').then(function (fileData) {
                        var updatedResults = [];
                        let updatedFiles = []
                        files.push({ fileName: file, content: fileData, status: 'read-from-client' })
                        updatedFiles = [...files]
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

    const statusLoading = (index) => {
        console.log(progress)
        let updatedIndex = index += 1
        // setProgress(updatedIndex)
        console.log(updatedIndex)
        // let progressUpdate = index;
        // setProgress(updatedIndex);
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
                        <h5>/ {processStatus}</h5>
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
                                statusLoading()
                                return <tr key={index}>    
                                    <td>{index}</td>
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