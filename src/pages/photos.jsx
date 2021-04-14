import React, { useEffect, useState, useContext } from "react";
import "../styles/photos.css";
import Lightbox from "react-awesome-lightbox";
import ImageGallery from "react-image-gallery";
import WithMessage from "../hocs/withMessage";
import WithAppLayout from "../layouts/appLayout";
import {
  downloadPhoto,
  removePhotos,
  listPhotos,
} from "../services/photoApiService";
import { AppContext } from "../context/AppProvider";
import Spinner from "../components/spinner";
import { onSort } from "../util/sort";

const Photos = ({ showMessage }) => {
  const [currentImage, setCurrentImage] = useState({});

  // This array should sorted! default by date!
  const [images, setImages] = useState([]);
  const [existRequest, setExistRequest] = useState(false);
  const context = useContext(AppContext);
  const reloadFiles = context[8];
  const setReloadFiles = context[9];
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [showLightBox, setShowLightBox] = useState(false);

  const onSlide = (index) => {
    const image = images[index]
    image.index = index
    console.log(image);
    setCurrentImage(image);
  };

  const onChangeSort = async (e) => {
    const typeSort = e.target.value;
    const photosSorted = await onSort(typeSort, [...images]);
    setImages(photosSorted);
    setCurrentImage(photosSorted[0]);
  };

  function getPhotos() {
    setExistRequest(true);
    listPhotos()
      .then((res) => {
        const photos = res.data;
        setImages(photos);
        setReloadFiles(false);
        if (photos.length != 0) {
          setCurrentImage(photos[0]);
        } else {
          setCurrentImage({});
        }
        setExistRequest(false);
        setLoadingPhotos(false);
      })
      .catch((error) => {
        showMessage(error.message, "error");
        setExistRequest(false);
        setReloadFiles(false);
        setLoadingPhotos(false);
      });
  }

  useEffect(() => {
    getPhotos();
  }, [reloadFiles]);

  function onDownloadPhotos(index) {
    const _id = images[index]._id
    setExistRequest(true);
    showMessage("Download started");
    downloadPhoto(_id)
      .then((res) => {
        const blob = res.data;
        console.log(blob);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", images[index].name);
        link.click();
        showMessage("Photo downloaded!");
        setExistRequest(false);
      })
      .catch((error) => {
        showMessage(error.message, "error");
        setExistRequest(false);
      });
  }

  function onRemovePhotos(index) {
    const _id = images[index]._id
    setExistRequest(true);
    removePhotos([_id])
      .then((response) => {
        showMessage("Photo remove");
        setExistRequest(false);
        getPhotos();
      })
      .catch((error) => {
        showMessage(error.message, "error");
        setExistRequest(false);
      });
  }

  const toogleLightBox = () => {
    setShowLightBox(!showLightBox)
  }

  return (
    <div>
       {images.length !== 0 && (
        <div className="d-flex flex-row mb-2 mt-3 justify-content-start ml-1">
          <select
            style={{ width: "20%" }}
            className="custom-select custom-select-sm"
            onChange={onChangeSort}
          >
            <option selected>Select a sort</option>
            <option value="date">By date</option>
            <option value="name">By name</option>
          </select>
        </div>
      )}

      <div style={{ position: "relative" }}>
        {loadingPhotos && (
          <div className="d-flex flex-row justify-content-center mt-5">
            <Spinner />
          </div>
        )}
        {images.length > 0 ? (
          <>
            <div className="d-flex flex-wrap">
            {images.map((image, index) => (
              <div className="responsive col-4 my-1">
                <div className="gallery wraper">
                    <img
                      loading="lazy"
                      key={index}
                      src={`${process.env.REACT_APP_GATEWAY_SERVICE_BASE_URL}/api/photo/download/${image._id}`}
                      alt={image.name}
                    />
                    <div key={image._id} style={{ cursor:"pointer"}} 
                    className ="overlay d-flex flex-column align-items-center justify-content-center"
                    >
                      <div classNam=" d-flex flex-row align-items-center justify-content-center">
                      <button
                        onClick={() => onRemovePhotos(index)}
                        // Hacemos un boton para remover la imagen
                        type="button"
                        disabled={existRequest}
                        className="btn btn-danger btn-sm mx-2"
                      >
                        Remove
                      </button>
                      <button
                        disabled={existRequest}
                        onClick={() => onDownloadPhotos(index)}
                        // Hacemos un boton para descargar la imagen
                        type="button"
                        className="btn btn-info btn-sm"
                      >
                        Download
                      </button>
                      <button
                        disabled={existRequest}
                        type="button"
                        className="btn btn-success btn-sm ml-2"
                        data-toggle="modal" 
                        data-target="#ventanaModalShared"
                      >
                        Share
                      </button>
                      </div>
                      <button
                      onClick={() => {
                        onSlide(index)
                        toogleLightBox()
                      }}
                        disabled={existRequest}
                        type="button"
                        className="btn btn-outline-light mt-2"
                      >
                        Show
                      </button>
                      
                    </div>
                  {/* <div className="desc">{image.name}</div> */}
                  {/* Modal */}
                  <div className="modal" id="ventanaModalShared" tabindex="-1" role="dialog" aria-labelledby="tituloVentana" aria-hidden="true"> 
                          <div className="modal-dialog" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5>Share With:</h5>                               
                              </div>

                              <div className="modal-body">
                                <div className="input-group">
                                  <div className="input-group-pretend">
                                    <span className="input-group-text">@</span>
                                  </div>
                                  <input type="text" className="from-control w-75" placeholder="User"></input>
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
                </div>
              </div>
            ))}
            </div>
          </>
        ) : (
          <>
            {!loadingPhotos && (
              <p className="text-muted text-center mt-5">
                Start to share photos!
              </p>
            )}
          </>
        )}
      </div>
      {
        showLightBox && <Lightbox onClose={toogleLightBox}  
        images={images.map(img => ({
          url:`${process.env.REACT_APP_GATEWAY_SERVICE_BASE_URL}/api/photo/download/${img._id}`,
          title: img.name
        }))}
        title={currentImage.name}
        startIndex={currentImage.index || 0}/>
      }
    </div>
  );
};
export default WithMessage(WithAppLayout(Photos));
