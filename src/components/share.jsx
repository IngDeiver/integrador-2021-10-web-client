import React from 'react'

const Modal = () => {
    return(
        <div className="modal" id="ventanaModalShared" tabindex="-1" role="dialog" aria-labelledby="tituloVentana" aria-hidden="true"> 
                          <div className="modal-dialog" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5>Share With Users</h5>                               
                              </div>
                              <div className="modal-body">
                                <div className="input-group">
                                  <div className="input-group-pretend mr-1">
                                    <span className="input-group-text"><i style={{fontSize:20}} class="fas fa-user-plus"></i></span>
                                  </div>
                                  <input id="input" type="text" className="from-control w-75" placeholder="Write a user...">                                              
                                  </input>                                                  
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