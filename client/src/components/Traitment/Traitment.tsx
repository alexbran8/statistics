import React, { useState } from 'react'
import "./Traitment.scss"
import ReactFileReader from 'react-file-reader';
import Button from '@material-ui/core/Button'
import JSZip, { file } from 'jszip';


export const Traitment = () => {
    const [status, setStatus] = useState < String > ('');
    const [files, setFiles] = useState([]);
    const [processStatus, setProcessStatus] = useState(24);
    const [progress, setProgress] = useState(0);

    const saveToDb = () => {
        console.log(files)
    }

    const handleZip = (zipFile) => {
        const zip = new JSZip();
        zip.loadAsync(zipFile[0])
            .then(function (zip) {
                var newProgress = progress
                Object.keys(zip.files).forEach((file, index) => {
                    zip.files[file].async('string').then(function (fileData) {
                        // check if file exists in object if not add them
                        if (files.find(item => item.fileName === file) === undefined) {
                            //if not add file to archive
                            var updatedResults = [];
                            let updatedFiles = []
                            files.push({ fileName: file, content: fileData, status: 'read-from-client' });
                            updatedFiles = [...files];
                            newProgress++;
                            setProgress(newProgress);
                            setFiles(updatedFiles);
                        }
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
                <div unselectable="on" className='page-background'>
                    Traitment Reporting
                </div>
                <ReactFileReader multipleFiles={false} fileTypes={[".zip"]} handleFiles={handleZip}>
                    <Button variant="contained" color="primary" className='btn'>Click here to upload ZIP file</Button>
                </ReactFileReader>
                <>

                    <svg viewBox="0 0 36 36" className="circular-chart">
                        {/* <div className="text"> {processStatus !== 0 ? (progress / processStatus * 100).toFixed(1) + '%' : 'waiting for files'}</div> */}
                        <text x="50%" y="60%" text-anchor="middle"  className="text">{processStatus !== 0 ? (progress / processStatus * 100).toFixed(1) + '%' : 'waiting for files'}</text>

                        <path class="circle"
                            stroke-dasharray={`${progress / processStatus * 100}, ${100}`}
                            d="M18 2.0945
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        {/* </div> */}
                    </svg>


                    {files && files.length > 0 ? <>
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
                                    <td>{index + 1}</td>
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