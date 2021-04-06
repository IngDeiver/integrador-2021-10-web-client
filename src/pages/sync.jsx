import React, { useEffect } from 'react';
import '../styles/sync.css'
import isElectron from 'is-electron';
import WithMessage from '../hocs/withMessage';
import WithAppLayout from '../layouts/appLayout'



const Sync = () => {

    useEffect(() => {
        
    });

    return (
        <>
            {
                isElectron() ? (
                <div className ="d-flex flex-column justify-content-center align-items-center p-5">
                        <h1 className ="text-center text-muted my-2">Select a folder to sync</h1>
                        <button className="btn btn-info"><i className="fas fa-sync"></i> Browser</button>
                </div>):(
                    <div className ="d-flex flex-column justify-content-center align-items-center p-5">
                        <h1 className ="text-center my-2">Streams for labs</h1>
                        <h3 style={{ marginRight:150, marginLeft:150}} className ="text-center text-muted">To keep your files synchronized, 
                        download the desktop application available for Linux.</h3>
                        <a download href={`${process.env.REACT_APP_GATEWAY_SERVICE_BASE_URL}/streams-for-lab_0.2.0_amd64.deb`} className="btn btn-success">
                            <i className="fas fa-cloud-download-alt mr-2"></i> Download</a>
                    </div>
                )
            }
        </>
    )
}

export default WithMessage(WithAppLayout(Sync))