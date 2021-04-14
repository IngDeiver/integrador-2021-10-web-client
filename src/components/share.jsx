import React, { useState, useEffect } from 'react';
import { getUsuarios } from '../services/fileApiService'
import { Typeahead } from 'react-bootstrap-typeahead';


const Modal = () => {

  const [users, setUsers] = useState([])
  const [multiSelections, setMultiSelections] = useState([]);

  const listUsuarios = () => {
    getUsuarios().then((res) => {
      const listusers = res.data
      setUsers(listusers)
    })
  }

  useEffect(() => {
    listUsuarios()
  }, [])

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
              <input id="input" type="text" className="from-control w-75" placeholder="Write a user...">
              </input>
              <Typeahead
                id="users-typeahead-multiple"
                labelKey="name"
                multiple
                onChange={setMultiSelections}
                options={users}
                placeholder="Select users..."
                selected={multiSelections}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-warning" type="button" data-dismiss="modal">
              Close
                                </button>
            <button className="btn btn-success" arial-label="Compartir">
              Share
                                </button>
          </div>

        </div>
      </div>
    </div>
  )

}


export default Modal