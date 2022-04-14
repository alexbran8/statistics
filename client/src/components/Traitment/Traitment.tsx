import React, {useState} from 'react'
import "./Traitment.scss"
import ReactFileReader from 'react-file-reader';
import Button from '@material-ui/core/Button'



export const Traitment = () => {
    const [status, setStatus] = useState < String > ('');


    const handleZip = (zipFile) => {
        const zip = new JSZip();
        zip.loadAsync(zipFile[0])
            .then(function (zip) {
                var newResults = []
                Object.keys(zip.files).forEach(file => {
                    zip.files[file].async('string').then(function (fileData) {
                        var updatedResults = [];
                        console.log(fileData)
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

            </div>
        </>
    )
}