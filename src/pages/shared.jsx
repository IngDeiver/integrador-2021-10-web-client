import React, { useContext, useEffect, useState } from "react";
import "../styles/shared.css";
import { onSort } from '../util/sort'
import WithMessage from "../hocs/withMessage";
import WithAppLayout from "../layouts/appLayout";
import { getSharedFiles } from '../services/fileApiService'
import FileComponent from "../components/file";
import { AppContext } from '../context/AppProvider';


  const Shared = ({ showMessage }) => {
  const  [sharedFiles, setSharedFiles ]= useState([])
  //{
    //_id: "6057996135d7e2337fd5966b",
    //author: "Pepito Pérez",
    //name: "Galaxy.jpg",
    //path: "public/photos/login.png-1614224346932-login.png",
    //shared_users:[],
    //upload_at: "2021-02-25T03:39:06.955Z",
    //weight: 23094
  //}, {
    //_id: "60579071ada6c824380f7a90",
    //author: "Pepito Pérez",
    //name: "Archivo.pdf",
    //path: "public/files/login.png-1614224766287-login.png",
    //shared_users:[],
    //upload_at: "2021-02-25T03:39:06.955Z",
    //weight: 23094
  //}

  //Listado archivos compartidos

  const [loadingSharedFiles, setLoadingSharedFiles] = useState(true)
  const context = useContext(AppContext)
  const reloadSharedFiles = context[8]
  const setReloadSharedFiles = context[9]

  const handleSort = async  (typeSort) => {
    const sortSharedFiles = await onSort(typeSort, [...sharedFiles])
    setSharedFiles(sortSharedFiles)
  }

  const listSharedFiles = () => {
    getSharedFiles()
    .then((res) => {
      console.log(res.data)
      setLoadingSharedFiles(false);
      setSharedFiles(res.data)
      setReloadSharedFiles(false)
      
    })
    .catch((err) => {
      console.log(err);
      setLoadingSharedFiles(false);
      showMessage(err.message, "error");
      setReloadSharedFiles(false)
    });
  }

  useEffect(()=> {
    listSharedFiles()
  }, [reloadSharedFiles])

    
  return (
    <>
      <FileComponent 
      loading={loadingSharedFiles}
      files={sharedFiles}
      onSort={handleSort}
      isSharedSection/>

    </>
  );
};

export default WithMessage(WithAppLayout(Shared));
