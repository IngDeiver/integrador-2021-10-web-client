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
    console.log("Render!");


  ipcRenderer.on("sync-success", (event, path) => {
    console.log("sync-success path: ", path); // prints "pong"
    if (path) {
          setPath(path)
          showMessage("Synchronized directory");
    }
  });

  ipcRenderer.on("desynchronize-success", (event, arg) => {
    setPath('');
    showMessage("Directory out of sync");
  });

  ipcRenderer.on("path-syncronized", (event, path) => {
      const pathSyncronized = path ? path:''
      setPath(pathSyncronized);
  });

    if (isElectron()) {
        ipcRenderer.send("get-path-syncronized", null);
    }

    return (() => {
      ipcRenderer.removeAllListeners()
    })
  },[]);


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
          <h1 className="text-center text-muted my-2">
            {path === "" ? "Select a folder to sync" : `Syncing: ${path}`}
          </h1>
          {path === "" ? (
            <button onClick={sync} className="btn btn-info">
              <i className="fas fa-sync"></i> Browser
            </button>
          ) : (
            <button onClick={desynchronize} className="btn btn-danger">
              {" "}
              Desynchronize
            </button>
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
