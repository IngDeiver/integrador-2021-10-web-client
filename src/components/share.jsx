import React, { useState, useEffect } from 'react';
import { getUsuarios } from '../services/fileApiService'
import { Typeahead } from 'react-bootstrap-typeahead';
import  { shareFile}  from "../services/fileApiService";


const Modal = ({file}) => {

  const [users, setUsers] = useState([])
  const [singleSelections, setSingleSelections] = useState([]);

  const listUsuarios = () => {
    getUsuarios().then((res) => {
      const listusers = res.data
      console.log(listusers)
      setUsers(listusers)
    })
  }

  useEffect(() => {
    listUsuarios()
    console.log(users)
  }, [file])

  const onShare = (file) => {
    if(file.path.includes("/files/")){
      shareFile(file._id)
      .then((res) => {
        const blob = res.data;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("share", file.name);
        link.click();
        showMessage("File shared!");
      })
      .catch((err) => showMessage(err.message, "error"));
    }}

  return (
    <div className="modal" id="ventanaModalShared" tabindex="-1" role="dialog" aria-labelledby="tituloVentana" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Share With Users</h5>
          </div>
          <div className="modal-body">
            <div className="input-group">
              <div className="input-group-pretend mr-1">
                <span className="input-group-text"><i style={{ fontSize: 20 }} class="fas fa-user-plus"></i></span>
              </div>
              
              <Typeahead
                id="users-typeahead"
                labelKey="username"
                onChange={setSingleSelections}
                options={users}
                placeholder="Select users..."
                selected={singleSelections}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-warning" type="button" data-dismiss="modal">
              Close
                                </button>
            
            <button disabled= {singleSelections.length == 0 } className="btn btn-success" arial-label="Compartir"
            onClick={() => onShare(file)}>
              Share
                                </button>
          </div>

        </div>
      </div>
    </div>
  )

}


export default Modal