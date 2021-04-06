import React, { useEffect } from 'react'
import styled from 'styled-components'
import {MdClose} from 'react-icons/md'


const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalWrapper = styled.div`
  width: 800px;
  height: 500px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
  color: #000;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  z-index: 10;
  border-radius: 10px;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.8;
  color: #141414;
  p {
    margin-bottom: 1rem;
  }
  button {
    padding: 10px 24px;
    background: #141414;
    color: #fff;
    border: none;
  }
`;

const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`;



export const Modal =({showModal, setShowModal}) => {
  useEffect(() => {
    
    
 
  },
  [showModal]

    
  )
    return (
        <>
     
<div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">Compartir</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div className="modal-body">

      


        
        
      <label for="exampleInputEmail1">Usuarios a compartir</label>
    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Ingresa el nombre"></input>
    
    <ul className="list-group pmd-list pmd-modal-list pmd-list-avatar">
               <li className="list-group-item d-flex flex-row">
                    <a href="javascript:void(0);" className="pmd-avatar-list-img"> 
                        <img alt="avatar-img" data-src="holder.js/40x40" className="img-fluid" src="https://p.kindpng.com/picc/s/78-785827_user-profile-avatar-login-account-male-user-icon.png" data-holder-rendered="true"/>
                    </a>
                    <div className="media-body">
                        <h3 className="pmd-list-title">Alex J. Windham</h3>
                        <p className="pmd-list-subtitle">Front End Developer</p> 
                    </div>
                    <div className="custom-control custom-checkbox pmd-checkbox">
                        <input className="custom-control-input" type="checkbox" value="" id="defaultCheck1" checked/>
                        <label className="custom-control-label" for="defaultCheck1">
                        </label>
                    </div>
				</li>
				<li className="list-group-item d-flex flex-row">
                    <a href="javascript:void(0);" className="pmd-avatar-list-img"> 
                        <img alt="avatar-img" data-src="holder.js/40x40" className="img-fluid" src="http://propeller.in/components/list/img/40x40.png" data-holder-rendered="true"/>
                    </a>
                    <div className="media-body">
                        <h3 className="pmd-list-title">Kevin M. Stoneman</h3>
                        <p className="pmd-list-subtitle">Front End Developer</p> 
                    </div>
                    <div className="custom-control custom-checkbox pmd-checkbox">
                        <input className="custom-control-input" type="checkbox" value="" id="defaultCheck2"/>
                        <label className="custom-control-label" for="defaultCheck2">
                        </label>
                    </div>
                </li>	
            </ul>





    
   
      </div>
      
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
        <button type="button" className="btn btn-primary">Compartir</button>
      </div>
    </div>
  </div>
</div>

        </>
       
    ); 
};