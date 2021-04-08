import React, { useContext, useEffect, useState } from "react";
import "../styles/sync.css";
import isElectron from "is-electron";
import WithMessage from "../hocs/withMessage";
import WithAppLayout from "../layouts/appLayout";
import { AppContext } from "../context/AppProvider";
const { ipcRenderer } = window;


const Sync = ({ showMessage }) => {
  const [path, setPath] = useState("");
  const context = useContext(AppContext);
  const user = context[3];
  
  useEffect(() => {
    console.log("Render Sync");

  // set path when client sync a directory
  ipcRenderer.on("sync-success-dir", (event, path) => {
    console.log("sync-success path: ", path);
    if (path) {
          setPath(path)
          showMessage("Synchronized directory");
    }
  });

  // clear path when client dessync a directory
  ipcRenderer.on("desynchronize-success", (event, arg) => {
    setPath('');
    showMessage("Directory out of sync");
  });


  // listen if exist a path synced
  ipcRenderer.on("path-syncronized", (event, path) => {
      const pathSyncronized = path ? path:''
      setPath(pathSyncronized);
  });

    // checkl if exist a dir synced
    if (isElectron()) {
        ipcRenderer.send("get-path-syncronized", null);
    }

    // return () => {
    //   ipcRenderer.removeAllListeners()
    // }
  });


  const sync = () => {
    ipcRenderer.send("sync", user.username);
  };

  const desynchronize = () => {
    ipcRenderer.send("desynchronize", null);
  };
  return (
    <>
      {isElectron() ? (
        <div className="d-flex flex-column justify-content-center align-items-center p-5">
          {path !== '' && <h1 className="text-center text-muted my-2">Your files are in sync</h1>}
          <h2 className="text-center text-muted my-2">
            {path === "" ? "Select a folder to sync" : `Folder: ${path}`}
          </h2>
          {path === "" ? (
            <button onClick={sync} className="btn btn-info">
              <i className="fas fa-sync"></i> Browser
            </button>
          ) : (
            <div className ="d-flex flex-column justify-content-cener">
              <img width="50%" src ="/images/spinning-arrows.gif" className="ml-5 mt-2 mb-4"/>
              <button onClick={desynchronize} className="btn btn-danger">
              {" "}
              Desynchronize
            </button>
            </div>
          )}
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center p-5">
          <h1 className="text-center my-2">Streams for labs</h1>
          <h3
            style={{ marginRight: 150, marginLeft: 150 }}
            className="text-center text-muted"
          >
            To keep your files synchronized, download the desktop application
            available for Linux.
          </h3>
          <a
            download
            href={`${process.env.REACT_APP_GATEWAY_SERVICE_BASE_URL}/streams-for-lab_0.2.0_amd64.deb`}
            className="btn btn-success"
          >
            <i className="fas fa-cloud-download-alt mr-2"></i> Download
          </a>
        </div>
      )}
    </>
  );
};

export default WithMessage(WithAppLayout(Sync));
